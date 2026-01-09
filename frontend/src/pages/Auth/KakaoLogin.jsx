import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import "../../css/swal.css";
import { setIsLogin, setUserId } from "../../store/memberSlice.js";
import { SERVER_URL } from "../../api/config";

// 카카오 로그인 후 토큰을 발급받는 컴포넌트
export const KakaoLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get("code"); // URL에서 인가 코드 추출

  useEffect(() => {
    if (!code) {
      Swal.fire({
        title: "로그인 실패(인가 코드)",
        text: "로그인 과정에서 문제가 발생했습니다.",
        confirmButtonText: "확인",
        customClass: {
          popup: "customPopup",
          title: "customTitle",
          htmlContainer: "customText",
          confirmButton: "customConfirmButton",
        },
      });
      navigate("/"); // 메인 페이지로 리디렉션
      return;
    }

    const fetchData = async () => {
      try {
        // 카카오 액세스 토큰 요청
        const response = await axios.post(
          "https://kauth.kakao.com/oauth/token",
          new URLSearchParams({
            grant_type: "authorization_code",
            client_id: "faa41cfd2406bc361c3eb40aa4fb7ceb", // 실제 카카오 REST API 키
            redirect_uri: "https://hams-book.vercel.app/auth/kakao/callback", // 리다이렉트 URI
            code: code, // URL에서 받은 인가 코드
            client_secret: "PHItwtu9LhGh8FmQFesCzcZ8dGelUM0f",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          }
        );

        // 응답에서 ID 토큰 추출
        const { id_token } = response.data;
        const payloadBase64 = id_token.split(".")[1];
        const payload = JSON.parse(atob(payloadBase64));
        const kakaoId = payload.sub;

        // 백엔드로 카카오 ID 보내서 JWT 발급받기
        const backendRes = await axios.post(`${SERVER_URL}/auth/kakao/login`, {
          kakaoId,
        });

        if (backendRes.data && backendRes.data.jwtToken) {
          const { jwtToken } = backendRes.data;

          // JWT를 로컬 스토리지에 저장
          localStorage.setItem("jwtToken", jwtToken);
          // Redux에 로그인 정보 저장
          dispatch(setIsLogin(true)); // 로그인 상태
          dispatch(setUserId(kakaoId)); // 카카오 ID

          Swal.fire({
            title: "로그인 성공",
            confirmButtonText: "확인",
            customClass: {
              popup: "customPopup",
              title: "customTitle",
              confirmButton: "customConfirmButton",
            },
          });
          navigate("/"); // 메인 페이지로 리디렉션
        } else {
          throw new Error("백엔드에서 JWT 토큰을 받지 못했습니다.");
        }
      } catch (error) {
        console.error("카카오 로그인 실패:", error);
        Swal.fire({
          title: "로그인 실패",
          text: "로그인 과정에서 문제가 발생했습니다. 다시 시도해주세요.",
          confirmButtonText: "확인",
          customClass: {
            popup: "customPopup",
            title: "customTitle",
            htmlContainer: "customText",
            confirmButton: "customConfirmButton",
          },
        });
        navigate("/"); // 로그인 실패 시 메인 페이지로 리디렉션
      }
    };

    fetchData(); // 카카오 로그인 요청
  }, [code, navigate, dispatch]);

  return <div>카카오 로그인 처리 중...</div>;
};
