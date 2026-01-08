import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Reviews.module.css";
import dayjs from "dayjs";
import { StarRating } from "../../components/StarRating/StarRating.jsx";
import { confirmSwal } from "../../api/api.js";
import { SERVER_URL } from "../../api/config";

export function Reviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(`${SERVER_URL}/api/reviews/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setReviews(data);
    };
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    const result = await confirmSwal("삭제하시겠습니까?", "", "확인");
    if (!result.isConfirmed) return;

    const token = localStorage.getItem("jwtToken");
    try {
      await fetch(`${SERVER_URL}/api/reviews/delete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewId }),
      });

      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
    } catch (e) {
      console.log("삭제실패 :: ", e);
    }
  };

  const maskUserId = (id) => {
    if (!id) return "";

    // id 2자 초과 분기 추가
    if (id.length > 2) {
      return id.substring(0, 2) + "*".repeat(id.length - 2);
    } else {
      return id;
    }
  };

  const formatDate = (date) => {
    return dayjs(date).format("YYYY.MM.DD");
  };
  console.log(reviews);
  return (
    <div className={styles.reviewWrapper}>
      <h1 className={styles.title}>Klover 리뷰</h1>
      <p className={styles.subText}>
        * 기간 및 조건 내 작성한 리뷰 조회 가능합니다.
      </p>

      {reviews.length > 0 ? (
        reviews?.map((review) => (
          <div className={styles.reviewCard} key={review.reviewId}>
            <div className={styles.bookInfo}>
              <img
                src={review.imageUrl}
                alt={review.title}
                className={styles.bookImage}
              />
              <div className={styles.bookTextArea}>
                <p className={styles.bookTitle}>{review.title}</p>
                <p className={styles.bookAuthors}>{review.authors}</p>
              </div>
            </div>

            <div className={styles.metaWrapper}>
              <div className={styles.metaTop}>
                <p className={styles.reviewType}>구매리뷰</p>
                <StarRating rating={review.rating} />
              </div>

              <div className={styles.metaBottom}>
                <p>
                  {maskUserId(review.userId)}{" "}
                  <div className={styles.divider}></div>{" "}
                  {formatDate(review.createdAt)}{" "}
                  <div className={styles.divider}></div>{" "}
                  <button onClick={() => handleDelete(review.reviewId)}>
                    삭제
                  </button>
                </p>
              </div>
            </div>

            <div className={styles.reviewContent}>{review.content}</div>
          </div>
        ))
      ) : (
        <div className={styles.noData}>
          <img src="/images/mypage/ico_nodata.png" alt="" />
          <p className={styles.noDataInfo}>작성한 리뷰가 없습니다.</p>
          <p>교보문고의 다양한 상품과 콘텐츠를 둘러보세요!</p>
          <button onClick={() => navigate("/")}>둘러보기</button>
        </div>
      )}
    </div>
  );
}
