import React, { useEffect } from "react";
import {
  useLocation,
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";
import paymentStyle from "./Order.module.css";
import { StepItemNum } from "../../components/Cart/StepItemNum.jsx";
import axios from "axios";
import { SERVER_URL } from "../../api/config";

export function OrderComplete() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  // 결제 완료 정보 가져오기, 기본값 처리

  useEffect(() => {
    async function callPost() {
      const token = localStorage.getItem("jwtToken");
      const resp = await axios.post(
        `${SERVER_URL}/payment/approve`,
        {
          orderId,
          pgToken: searchParams.get("pg_token"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(resp.data);
    }
    callPost();
  }, []);

  return (
    <section className={paymentStyle.contents}>
      {/* ===== 상단 스텝 표시 ===== */}
      <div className={paymentStyle.paymentTopWrap}>
        <p className={paymentStyle.titleWrap}>주문 완료</p>
        <ul className={paymentStyle.stepWrapper}>
          <StepItemNum activeStep={3} /> {/* Step 3: 완료 */}
        </ul>
      </div>

      <div className={paymentStyle.paymentLayout}>
        {/* ===== 좌측 영역: 주문 완료 메시지 ===== */}
        <div className={paymentStyle.leftArea}>
          <h2>주문이 완료되었습니다</h2>

          {/* 홈으로 돌아가기 버튼 */}
          <Link to="/" className={paymentStyle.orderBtn}>
            홈으로 가기
          </Link>

          {/* 홈으로 돌아가기 버튼 */}
          <Link to="/mypage/orders" className={paymentStyle.orderBtn}>
            구매 목록
          </Link>
        </div>
      </div>
    </section>
  );
}
