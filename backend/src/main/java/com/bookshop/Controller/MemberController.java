package com.bookshop.Controller;

import com.bookshop.dto.MemberDto;
import com.bookshop.service.JwtService;
import com.bookshop.service.MemberService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/member")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MemberController {

    private final MemberService memberService;
    private final JwtService jwtService;  // JwtService를 주입받기

    public MemberController(MemberService memberService, JwtService jwtService) {
        this.memberService = memberService;
        this.jwtService = jwtService;
    }

    // ===== 로그인 =====
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberDto memberDto,
                                   HttpServletRequest request,
                                   HttpServletResponse response) {
        String token = memberService.login(memberDto, request, response);
        if (token == null) {
            return ResponseEntity.ok(Map.of("login", false));
        }

        // 로그인 성공 시 반환할 데이터
        return ResponseEntity.ok(Map.of(
                "login", true,
                "token", token,
                "userId", memberDto.getUserId()
        ));
    }

    // 쿠키를 받는 로그인
    @PostMapping("/login-cookie")
    public ResponseEntity<?> loginCookie(@RequestBody MemberDto dto,
                                         HttpServletResponse response) {
        String token = memberService.adminLogin(dto, response);
        if (token == null) {
            return ResponseEntity.status(401).body(Map.of("login", false));
        }

        ResponseCookie cookie = ResponseCookie.from("accessToken", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(60 * 60 * 24 * 7)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.ok(Map.of(
                "login", true,
                "userId", dto.getUserId()
        ));
    }

    // ===== 로그아웃 =====
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        memberService.logout(request, response);
        return ResponseEntity.ok(Map.of("logout", true));
    }

    // ===== 회원가입 =====
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody MemberDto memberDto) {
        boolean result = memberService.signup(memberDto);
        return ResponseEntity.ok(Map.of("signup", result));
    }

    // ===== 아이디 중복 체크 =====
    @PostMapping("/idCheck")
    public ResponseEntity<?> idCheck(@RequestBody Map<String, String> param) {
        String userId = param.get("userId");
        boolean exists = memberService.idCheck(userId);
        String msg = exists ? "이미 사용중인 아이디입니다." : "사용 가능한 아이디입니다.";
        return ResponseEntity.ok(Map.of("message", msg));
    }

    // ===== 로그인 상태 확인 =====
    @GetMapping("/status")
    public ResponseEntity<?> loginStatus(HttpServletRequest request) {
        Long memberId = memberService.getCurrentMemberId(request);
        boolean isLogin = memberId != null;
        return ResponseEntity.ok(Map.of("login", isLogin));
    }

    // ===== 회원 체크 =====
    @PostMapping("/memberCheck")
    public ResponseEntity<?> memberCheck(@RequestBody MemberDto memberDto) {
        Long result = memberService.memberCheck(memberDto.getUserId());
        return ResponseEntity.ok(Map.of("memberId", result));
    }

    // ===== JWT 검증 =====
    @PostMapping("/validate-jwt")
    public ResponseEntity<?> validateJwt(@RequestBody String token) {
        boolean isValid = jwtService.validateToken(token);
        if (isValid) {
            return ResponseEntity.ok("JWT is valid");
        } else {
            return ResponseEntity.status(401).body("Invalid or expired JWT");
        }
    }

    @PostMapping("/validate-jwt-cookie")
    public ResponseEntity<?> validateCookieJwt(
            @CookieValue(name = "accessToken", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(401).body("No token");
        }

        boolean isValid = jwtService.validateToken(token);
        if (!isValid) {
            return ResponseEntity.status(401).body("Invalid or expired JWT");
        }

        return ResponseEntity.ok().build();
    }

    // ===== JWT에서 userId 추출 =====
    @PostMapping("/extract-userid")
    public ResponseEntity<?> extractUserId(@RequestBody String token) {
        if (jwtService.validateToken(token)) {
            String userId = jwtService.getUserId(token);
            return ResponseEntity.ok(userId);
        } else {
            return ResponseEntity.status(401).body("Invalid or expired JWT");
        }
    }

    // ===== 로그인된 회원 정보 조회 (JWT 기반) =====
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        String userId = jwtService.getUserId(token);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("No token provided");
        }

        if (!jwtService.validateToken(token)) {
            return ResponseEntity.status(401).body("Invalid token");
        }

        MemberDto memberDto = memberService.getMemberInfo(userId);
        if (memberDto == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(memberDto);
    }

    // ===== 회원 정보 수정 =====
    @PutMapping("/update")
    public ResponseEntity<?> updateMember(@RequestHeader("Authorization") String authHeader,
                                          @RequestBody MemberDto updateReq) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body("No token provided");
        }

        String token = authHeader.substring(7);
        if (!jwtService.validateToken(token)) {
            return ResponseEntity.status(401).body("Invalid or expired token");
        }

        String userId = jwtService.getUserId(token);

        if(updateReq.getCurrentPwd() == null || updateReq.getCurrentPwd().isBlank()){
            return ResponseEntity.status(400).body("Current password is required");
        }

        if(updateReq.getPwd().equals(updateReq.getCurrentPwd())) {
            return ResponseEntity.status(400).body("Need new password");
        }

        if(updateReq.getPwd() != null && !updateReq.getPwd().isBlank()) {
            if (updateReq.getPwdCheck() == null || updateReq.getPwdCheck().isBlank()) {
                return ResponseEntity.status(400).body("Password confirmation required");
            }

            if(!updateReq.getPwd().equals(updateReq.getPwdCheck())) {
                return ResponseEntity.status(400).body("Password mismatch");
            }
        }

        boolean success = memberService.updateMember(userId, updateReq);

        if(!success) {
            return ResponseEntity.status(400).body("Invalid current password");
        }
        return ResponseEntity.ok(Map.of("update", true));
    }

    @GetMapping("/me-cookie")
    public ResponseEntity<?> getMyInfoByCookie(
            @CookieValue(name = "accessToken", required = false) String token) {

        if (token == null) {
            return ResponseEntity.status(401).body("No token");
        }

        if (!jwtService.validateToken(token)) {
            return ResponseEntity.status(401).body("Invalid or expired JWT");
        }

        String userId = jwtService.getUserId(token);
        MemberDto memberDto = memberService.getMemberInfo(userId);

        if (memberDto == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(memberDto);
    }
}
