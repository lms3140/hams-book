import React, { useEffect, useState } from "react";
import { axiosData } from "../../utils/dataFetch.js";
import ReviewWriteModal from "./ReviewWriteModal";
import ReviewSummary from "./ReviewSummary";
import { Dropdown } from "../../components/Dropdown/Dropdown.jsx";
import { StarRating } from "../../components/StarRating/StarRating.jsx";  // StarRating 컴포넌트 추가

import styles from "./Review.module.css";
import axios from "axios";
import dayjs from "dayjs";
import { SERVER_URL } from "../../api/config";

export default function Review({ bookId }) {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // 🔹 정렬 옵션 추가
  const sortOptions = ["최신순", "오래된순"];
  const [sort, setSort] = useState("최신순");

  /** 리뷰 목록 조회 */
  const fetchReviews = async (sortParam = sort) => {
    try {
      const data = await axios(
        `${SERVER_URL}/api/reviews?book_id=${bookId}&sort=${sortParam}`
      );
      setReviews(Array.isArray(data.data) ? data.data : []);
    } catch (e) {
      console.error(e);
      setReviews([]);
    }
  };

  /** 리뷰 요약 조회 */
  const fetchSummary = async () => {
    try {
      const data = await axiosData(
        `${SERVER_URL}/api/reviews/summary?book_id=${bookId}`
      );
      setSummary(data);
      console.log(data);
    } catch (e) {
      console.error(e);
      setSummary(null);
    }
  };

  /** bookId 또는 sort 변경 시 데이터 새로 가져오기 */
  useEffect(() => {
    fetchReviews();
    fetchSummary();
    setLoading(false);
  }, [bookId, sort]);

  /** 정렬 변경 시 상태 업데이트 */
  const handleSortChange = (newSort) => {
    setSort(newSort);
    fetchReviews(newSort); // sort 파라미터와 함께 API 호출
  };

  return (
    <div className={styles.reviewSection}>
      {/* 🔹 1. 상단 헤더 영역 */}
      <div className={styles.headerRow}>
        <h3 className={styles.sectionTitle}>Klover 리뷰</h3>

        <button
          className={styles.writeButton}
          onClick={() => setModalOpen(true)}
        >
          <img
            src="/images/detail/ico_review.png"
            alt="리뷰 작성"
            className={styles.pencilIcon}
          />
          리뷰 작성
        </button>
      </div>

      {/* 🔹 2. 리뷰 요약 Summary */}
      <ReviewSummary summary={summary} />

      {/* 🔹 2-1. 리뷰 정렬 Dropdown */}
      <div className={styles.sortDropdowns}>
        <Dropdown
          options={sortOptions}
          selected={sort}
          onChange={handleSortChange}
        />
      </div>

      {/* 🔹 3. 리뷰 리스트 표시 */}
      {loading ? (
        <p>로딩중...</p>
      ) : reviews.length === 0 ? (
        <p className={styles.noReview}>아직 리뷰가 없습니다.</p>
      ) : (
        reviews.map((review) => {
          console.log(review);
          return (
            <div key={review.reviewId} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <span className={styles.memberId}>{review.userId}</span>

                {/* 🔹 별점 표시 */}
                {/* StarRating 컴포넌트 사용 */}
                <span className={styles.rating}>
                  <StarRating rating={review.rating} />
                </span>
              </div>
              <p className={styles.content}>{review.content}</p>
              {/* 🔹 리뷰 작성 시간 표시 */}
              <span className={styles.date}>
                {dayjs(review.created_at).format("YYYY-MM-DD")}
              </span>
            </div>
          );
        })
      )}

      {/* 🔹 4. 리뷰 작성 모달 */}
      {modalOpen && (
        <ReviewWriteModal
          bookId={bookId}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            fetchReviews();
            fetchSummary(); // 리뷰 작성 후 Summary도 업데이트
          }}
        />
      )}
    </div>
  );
}
