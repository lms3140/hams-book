import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Inquiries.module.css";
import { InquiryList } from "./InquiryList";
import { SERVER_URL } from "../../api/config";

export function Inquiries() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const res = await fetch(`${SERVER_URL}/inquiry/member`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("문의내역을 불러올 수 없습니다.");
        const data = await res.json();
        setInquiries(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchInquiries();
  }, []);

  return (
    <div className={styles.inquiriesContainer}>
      <h1>1:1문의</h1>

      <div className={styles.topArea}>
        <p className={styles.noticeText}>
          1:1문의내역 조회는 최대 3년까지 가능합니다.
        </p>
        <button
          className={styles.inquiryButton}
          onClick={() => navigate("/cscenter/qna-form")}
        >
          <img
            src="/images/mypage/ico_comment_white.png"
            alt="문의하기버튼아이콘"
          />
          1:1문의하기
        </button>
      </div>
      {inquiries.length === 0 ? (
        <div className={styles.noDataWrap}>
          <img src="/images/mypage/ico_nodata.png" alt="nodata" />
          <p>문의 내역이 없습니다.</p>
        </div>
      ) : (
        <InquiryList inquiries={inquiries} setInquiries={setInquiries} />
      )}
    </div>
  );
}
