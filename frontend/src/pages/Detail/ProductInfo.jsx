import React from "react";
import styles from "./Detail.module.css";
import { useGetFetch } from "../../hooks/useGetFetch";
import { SERVER_URL } from "../../api/config";

export const ProductInfo = ({ bookId }) => {
  const url = `${SERVER_URL}/book/detail/${bookId}`;
  const { data, isLoading, isError } = useGetFetch(url);

  if (isLoading) return <div>상품 정보를 불러오는 중...</div>;
  if (isError || !data) return <div>상품 정보를 불러오지 못했습니다.</div>;

  // BookDetailDto 데이터 구조
  const {
    title,
    categoryName,
    subcategoryName,
    price,
    point,
    publishedDate,
    description,
    imageUrl,
    authors,
    translators,
  } = data;

  return (
    <div className={styles.detailSection}>
      <h3 className={styles.sectionTitle}>상품 정보</h3>
      {/* 상세 설명 */}
      <div className={styles.description}>
        <p>{description || "상세 설명이 제공되지 않았습니다."}</p>
      </div>

      {/* 기본 정보 */}
      <h4 className={styles.sectionTitle}>기본 정보</h4>
      <table className={styles.basicInfoTable}>
        <tbody>
          <tr>
            <th>제목</th>
            <td>{title}</td>
          </tr>

          <tr>
            <th>저자</th>
            <td>{authors}</td>
          </tr>

          {translators && (
            <tr>
              <th>역자</th>
              <td>{translators}</td>
            </tr>
          )}

          <tr>
            <th>카테고리</th>
            <td>
              {categoryName} &gt; {subcategoryName}
            </td>
          </tr>

          <tr>
            <th>출간일</th>
            <td>{new Date(publishedDate).toLocaleDateString()}</td>
          </tr>

          <tr>
            <th>가격</th>
            <td>₩ {price.toLocaleString()}</td>
          </tr>

          <tr>
            <th>포인트</th>
            <td>{Math.floor(price * 0.1).toLocaleString()}P</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductInfo;
