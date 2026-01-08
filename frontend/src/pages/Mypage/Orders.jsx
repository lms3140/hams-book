import { useEffect, useState } from "react";
import style from "./Orders.module.css";
import { OrderItems } from "./OrderItems";
import { confirmSwal } from "../../api/api";
import { SERVER_URL } from "../../api/config";

export function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(`${SERVER_URL}/order-history/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const handleDeleteOrders = async (orderId) => {
    const result = await confirmSwal(
      "주문,배송 목록에서 삭제하시겠습니까? 삭제된 주문은 주문배송 목록에서 노출되지 않으며, 복구가 불가능합니다. 교환/반품 신청은 고객센터를 통해 문의해주세요.",
      "",
      "확인"
    );
    if (!result.isConfirmed) return;

    const token = localStorage.getItem("jwtToken");
    const res = await fetch(
      `${SERVER_URL}/order-history/delete/${orderId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      }
    );

    await res.json();

    setOrders((prev) => prev.filter((order) => order.orderId !== orderId));
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>주문/배송 목록</h1>
      <div>
        {orders && orders.length > 0 ? (
          <OrderItems orders={orders} onDelete={handleDeleteOrders} />
        ) : (
          <div className={style.noDataWrap}>
            <img src="/images/mypage/ico_nodata.png" alt="" />
            <p>주문한 상품이 없습니다.</p>
          </div>
        )}
      </div>

      <nav className={style.noticeBox}>
        <p>유의사항</p>
        <ul>
          <li>･ 배송조회는 택배사로 상품전달 후 조회 가능합니다.</li>
          <li>･ eBook은 구매 후 다운로드 시 이용할 수 있습니다.</li>
          <li>
            ･ eBook ‘sam’ 이용내역 조회 및 서비스 해지는 마이룸 {">"}{" "}
            sam이용내역 {">"} my이용권 페이지에서 가능합니다.
          </li>
          <li>
            ･ 주문한 상품이 품절될 경우 해당 상품은 자동 취소 신청되며,
            취소금액은 승인 취소 또는 예치금으로 반환됩니다.
          </li>
          <li>
            ･ 반환된 예치금은 나의 통장 {">"} 예치금에서 환불신청시, 신청계좌로
            환불해 드립니다.
          </li>
        </ul>
      </nav>

      <nav className={style.noticeBox}>
        <p>카드결제(간편결제,법인카드 포함) 취소 안내</p>
        <ul>
          <li>
            ･ 카드결제 취소 기간 안내
            <ul>
              <li>- 전체취소 : 당일 취소/환불 처리</li>
              <li>- 부분취소 : 영업일 기준 3~5일 소요(당일 취소 포함)</li>
            </ul>
          </li>
          <li>
            ･ 카드사 정책에 따라 주문당일 부분취소한 경우 당일 취소 및 환불
            불가합니다.
          </li>
          <li>･ 부분취소한 경우 카드사 승인 취소는 약 3~5일 소요됩니다.</li>
          <li>
            ･ 카드사에서 부분취소를 지원하지 않는 카드의 경우 승인취소가 아닌
            예치금으로 환불됩니다.
          </li>
          <li>
            ･ 주문취소시 오류가 발생하거나 환불이 정상 처리되지 않을 경우 1:1로
            문의 주시기 바랍니다.
          </li>
        </ul>
      </nav>
    </div>
  );
}
