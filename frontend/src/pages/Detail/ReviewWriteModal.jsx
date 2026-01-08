// ReviewWriteModal.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import "../../css/swal.css"; // Swal 커스텀 스타일
import styles from "./ReviewWriteModal.module.css";
import axios from "axios"; // ✅ axiosData 대신 axios 직접 사용, 헤더 커스터마이징 위해
import { SERVER_URL } from "../../api/config";

export default function ReviewWriteModal({ bookId, memberId, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 🔹 리뷰 작성 핸들러
  const handleSubmit = async () => {
    if (rating === 0 || !content.trim()) {
      await Swal.fire({
        title: "평점과 내용을 모두 입력해주세요.",
        confirmButtonText: "확인",
        customClass: {
          popup: "customPopup",
          title: "customTitle",
          confirmButton: "customConfirmButton",
        },
      });
      return;
    }

    setSubmitting(true);

    try {
      // 🔹 JWT 토큰 가져오기 (localStorage 혹은 cookie)
      const token = localStorage.getItem("jwtToken"); // 토큰 이름에 맞게 수정
      if (!token) throw new Error("로그인이 필요합니다.");

      // 🔹 axios POST 요청 + Authorization 헤더 추가
      const res = await axios.post(
        `${SERVER_URL}/api/reviews`,
        {
          bookId,
          memberId,
          rating,
          content
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🔹 토큰 포함
          },
        }
      );

      await Swal.fire({
        title: "리뷰가 등록되었어요!",
        confirmButtonText: "확인",
        customClass: {
          popup: "customPopup",
          title: "customTitle",
          confirmButton: "customConfirmButton",
        },
      });

      onSuccess(res.data); // 작성된 리뷰 데이터 전달
      onClose(); // 모달 닫기
    } catch (e) {
      console.error("리뷰 작성 실패:", e);
      await Swal.fire({
        title: "리뷰 작성 실패",
        text: e.response?.data?.message || "다시 시도해주세요.",
        confirmButtonText: "확인",
        customClass: {
          popup: "customPopup",
          title: "customTitle",
          htmlContainer: "customText",
          confirmButton: "customConfirmButton",
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        <h2>리뷰 작성</h2>
        <label>
          평점:
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            disabled={submitting}
          >
            <option value={0}>선택</option>
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>{v}점</option>
            ))}
          </select>
        </label>
        <textarea
          placeholder="리뷰 내용을 작성하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
        />
        <div className={styles.buttonRow}>
          <button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "등록 중..." : "등록"}
          </button>
          <button onClick={onClose} disabled={submitting}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
