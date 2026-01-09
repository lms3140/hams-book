package com.bookshop.service;

import com.bookshop.client.KakaoPayClient;
import com.bookshop.dto.*;
import com.bookshop.entity.*;
import com.bookshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final KakaoPayClient kakaoPayClient;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final AddressRepository addressRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final OrderDetailRepository orderDetailRepository;

    @Value("${kakaopay.cid}")
    private String cid;

    private static final String FRONT = "https://hams-book.vercel.app";

    /**
     * 결제 준비
     */
    public KakaoPayReadyResponseDto ready(PaymentReadyRequestDto dto) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName();

        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("회원 조회 실패"));

        Address address = addressRepository.findById(dto.getAddressId())
                .orElseThrow(() -> new RuntimeException("주소 조회 실패"));

        int usedPoint = dto.getPoint();
        if (member.getPointBalance() < usedPoint) {
            throw new RuntimeException("보유 포인트 부족");
        }

        int totalAmount = 0;
        int originalAmount = 0;
        int earnedPoint = 0;
        int totalQuantity = 0;

        // 주문 뼈대 생성
        PurchaseOrder order = new PurchaseOrder(member, address, 0, 0);
        order.setUsedPoint(usedPoint);
        purchaseOrderRepository.save(order);

        // 상품 계산
        for (PayItemDto item : dto.getBooks()) {
            Book book = bookRepository.findById(item.getBookId())
                    .orElseThrow(() -> new RuntimeException("도서 조회 실패"));

            int quantity = item.getQuantity();
            int price = book.getPrice();
            double discountRate = 0.1;

            int discountedPrice = (int) Math.round(price * (1 - discountRate));

            originalAmount += price * quantity;
            totalAmount += discountedPrice * quantity;
            earnedPoint += (int) Math.ceil(price * quantity * 0.1);
            totalQuantity += quantity;

            OrderDetail detail = new OrderDetail(order, book, quantity, price);
            orderDetailRepository.save(detail);
        }

        if (usedPoint > totalAmount) {
            throw new RuntimeException("포인트는 결제 금액을 초과할 수 없습니다.");
        }

        int finalPayAmount = totalAmount - usedPoint;

        order.setOriginalAmount(originalAmount);
        order.setEarnedPoint(earnedPoint);
        order.setTotalAmount(finalPayAmount);

        // ✅ 0원 결제 처리 (카카오페이 안 탐)
        if (finalPayAmount == 0) {
            order.approve();

            int finalPoint =
                    member.getPointBalance()
                            - usedPoint
                            + earnedPoint;

            member.setPointBalance(finalPoint);

            purchaseOrderRepository.save(order);
            memberRepository.save(member);

            KakaoPayReadyResponseDto response = new KakaoPayReadyResponseDto();
            response.setOrderId(order.getOrderId());
            response.setNext_redirect_pc_url(
                    FRONT + "/order/complete/" + order.getOrderId()
            );
            return response;
        }

        // 카카오페이 결제 준비
        KakaoPayReadyRequestDto req = new KakaoPayReadyRequestDto();
        req.setCid(cid);
        req.setPartner_order_id(order.getOrderId().toString());
        req.setPartner_user_id(member.getUserId());
        req.setItem_name(dto.getItemName());
        req.setQuantity(totalQuantity);
        req.setTotal_amount(finalPayAmount);
        req.setTax_free_amount(0);
        req.setApproval_url(FRONT + "/order/complete/" + order.getOrderId());
        req.setCancel_url(FRONT + "/payment/cancel");
        req.setFail_url(FRONT + "/payment/fail");

        KakaoPayReadyResponseDto response = kakaoPayClient.ready(req);
        order.setTid(response.getTid());
        purchaseOrderRepository.save(order);

        response.setOrderId(order.getOrderId());
        return response;
    }

    /**
     * 결제 승인
     */
    public KakaoPayApproveResponseDto approve(String orderId, String pgToken) {

        PurchaseOrder order = purchaseOrderRepository.findById(Long.valueOf(orderId))
                .orElseThrow(() -> new RuntimeException("주문 조회 실패"));

        if (order.getOrderStatus().equals("PAID")) {
            throw new RuntimeException("이미 결제 완료된 주문");
        }

        Member member = order.getMember();

        KakaoPayApproveRequestDto req = new KakaoPayApproveRequestDto();
        req.setCid(cid);
        req.setTid(order.getTid());
        req.setPartner_order_id(orderId);
        req.setPartner_user_id(member.getUserId());
        req.setPg_token(pgToken);

        KakaoPayApproveResponseDto response = kakaoPayClient.approve(req);

        order.approve();

        int finalPoint =
                member.getPointBalance()
                        - order.getUsedPoint()
                        + order.getEarnedPoint();

        member.setPointBalance(finalPoint);

        purchaseOrderRepository.save(order);
        memberRepository.save(member);

        response.setTotal_amount(order.getTotalAmount());
        response.setPartner_order_id(order.getOrderId().toString());

        return response;
    }

    public String failed(String orderId) {
        PurchaseOrder order = purchaseOrderRepository.findById(Long.valueOf(orderId))
                .orElseThrow(() -> new RuntimeException("주문 조회 실패"));
        order.fail();
        purchaseOrderRepository.save(order);
        return "결제 실패";
    }

    public String cancel(String orderId) {
        PurchaseOrder order = purchaseOrderRepository.findById(Long.valueOf(orderId))
                .orElseThrow(() -> new RuntimeException("주문 조회 실패"));
        order.cancel();
        purchaseOrderRepository.save(order);
        return "결제 취소";
    }
}
