import styles from "./CSCenter.module.css";
import noticeStyles from "../../components/CSCenter/Notice.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosData } from "../../utils/dataFetch.js";
import { chatIcon, docIcon, plusIcon } from "../../components/common/Svgs.jsx";

export function CSCenter() {
  const navigate = useNavigate();
  const [miniNotices, setMiniNotices] = useState([]);

  useEffect(() => {
    (async () => {
      const json = await axiosData("/data/csCenterNotice.json");
      setMiniNotices(json.slice(0, 3)); // ✅ 상위 3개만
    })();
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.content}>
        <h1>무엇을 도와드릴까요?</h1>
        <h1>
          <span>햄스문고 고객센터</span>입니다.
        </h1>

        <div className={styles.qnaSection}>
          <h2>1:1 문의</h2>
          <ul className={styles.qnaList}>
            <li>
              <button onClick={() => navigate("/cscenter/qna-form")}>
                {chatIcon}
                <p>문의 접수</p>
              </button>
              <div className={styles.verticalDivider}></div>
              <button onClick={() => navigate("/mypage/inquiries")}>
                {docIcon}
                <p>문의 내역</p>
              </button>
            </li>

            <li>
              <h4>전화 상담</h4>
              <div>
                <p>교보문고 1544-1900</p>
                <p>핫트랙스 1661-1112</p>
              </div>
              <div>
                <p>평일 09:00~18:00 (주말 및 공휴일 휴무)</p>
                <p>점심 12:00~13:00 (교보문고 전화상담만 가능)</p>
              </div>
            </li>

            <li>
              <h4>보이는 ARS</h4>
              <p>평일 09:00~18:00 (주말 및 공휴일 휴무)</p>
              <Link to="/cscenter/contact">전화상담서비스 안내도 {">"}</Link>
            </li>
          </ul>
        </div>

        <div className={styles.noticeSection}>
          <h2>공지사항</h2>
          <Link to="/cscenter/notice">
            <span>더보기</span>
            <span>{plusIcon}</span>
          </Link>

          <ul className={noticeStyles.listBody}>
            {miniNotices.map((item, idx) => (
              <li key={item.id ?? idx} className={noticeStyles.noticeItem}>
                <div className={noticeStyles.colNo}>{idx + 1}</div>
                <div className={noticeStyles.colTitle}>{item.title}</div>
                <div className={noticeStyles.colCategory}>{item.category}</div>
                <div className={noticeStyles.colDate}>{item.date}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
