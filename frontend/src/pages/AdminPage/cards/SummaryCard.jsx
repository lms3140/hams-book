import { useGetFetch } from "../../../hooks/useGetFetch";
import cardStyle from "./SummaryCard.module.css";
import { SERVER_URL } from "../../../api/config";

export function SummaryCard() {
  const { data, isError, isLoading } = useGetFetch(
    `${SERVER_URL}/adminPage/summary`
  );

  if (isLoading) {
    return <>로딩중</>;
  }
  if (isError) {
    return <>오류발생</>;
  }
  console.log(data);

  return (
    <div className={cardStyle.container}>
      <div>전체 책 수량: {data.totalBookCount}</div>
      <div>총 매출: {data.totalRevenue}</div>
      <div>판매된 총 권수: {data.totalQuantity}</div>
      <div>판매된 책 종류 수: {data.soldBookCount}</div>
    </div>
  );
}
