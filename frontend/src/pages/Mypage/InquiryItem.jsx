import { useState } from "react";
import styles from "./InquiryItem.module.css";
import { downArrowIcon, upArrowIcon } from "../../components/common/Svgs";
import dayjs from "dayjs";
import { confirmSwal } from "../../api/api.js";
import axios from "axios";
import { SERVER_URL } from "../../api/config";

export function InquiryItem({ inquiry, onDelete }) {
  const [isOpen, setIsOpen] = useState(true);

  const formatDate = (date) => {
    return dayjs(date).format("YYYY.MM.DD");
  };

  const handleDelete = async () => {
    const result = await confirmSwal(
      "문의내역을 삭제하시겠습니까?",
      "",
      "확인"
    );
    if (!result.isConfirmed) return;

    const token = localStorage.getItem("jwtToken");
    await axios.post(
      `${SERVER_URL}/inquiry/delete`,
      {
        inquiryId: inquiry.inquiryId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (onDelete) onDelete(inquiry.inquiryId);
  };

  return (
    <div className={styles.itemWrap}>
      <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.buttonTitle}>
          <div className={styles.left}>
            <span className={styles.status}>{inquiry.status}</span>
          </div>

          <div className={styles.titleArea}>
            <span className={styles.qIcon}>Q</span>
            <span className={styles.title}>{inquiry.title}</span>
          </div>
        </div>

        <div className={styles.right}>
          <span className={styles.date}>{formatDate(inquiry.createdAt)}</span>
          {isOpen ? upArrowIcon : downArrowIcon}
        </div>
      </div>

      {isOpen && (
        <div className={styles.contentBox}>
          <p className={styles.content}>{inquiry.content}</p>

          <div className={styles.buttonArea}>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
