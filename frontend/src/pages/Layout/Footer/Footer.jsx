import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export function Footer() {
  const countRef = useRef(0);
  const [count, setCount] = useState(0);
  const [noticeData, setNoticeData] = useState(null);
  useEffect(() => {
    async function callNotice() {
      const resp = await axios("/data/csCenterNotice.json");
      setNoticeData(resp.data);
    }
    callNotice();
  }, []);

  useEffect(() => {
    if (noticeData === null) {
      return;
    }
    const interval = setInterval(() => {
      setCount((prev) => (prev >= noticeData.length - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [noticeData]);

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.noticeWrapper}>
        <ul>
          <li>
            <Link to={"#"}>공지사항</Link>
            <div>
              <Link>{noticeData && noticeData[count]?.title}</Link>
            </div>
          </li>
          <li>
            <Link to={"#"}>당첨자 발표</Link>
            <div>
              <Link>이벤트 당첨자 발표</Link>
            </div>
          </li>
        </ul>
      </div>

      <div className={styles.footerInnerContainer}>
        <section>
          <img src="./images/logo.png" alt="logo" />
          <div>
            <ul className={styles.footerMenu}>
              <li>
                <Link to={"#"}>회사소개</Link>
              </li>
              <li>
                <Link to={"#"}>이용약관</Link>
              </li>
              <li>
                <Link to={"#"}>개인정보처리방침</Link>
              </li>
              <li>
                <Link to={"#"}>청소년보호정책</Link>
              </li>
              <li>
                <Link to={"#"}>대량구매서비스</Link>
              </li>
              <li>
                <Link to={"#"}>협력사여러분</Link>
              </li>
              <li>
                <Link to={"#"}>채용정보</Link>
              </li>
              <li>
                <Link to={"#"}>광고소개</Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerAddress}>
            <ul>
              <li>햄스문고</li>
              <li>햄스특별시 햄남</li>
              <li>대표이사 : 이명석</li>
              <li>사업자 등록번호 : xxx-xx-xxxxx</li>
              <li>대표전화: xxxx-xxxx</li>
              <li>FAX:xxxxx</li>
            </ul>
          </div>
          <span>HAMS BOOK CENTRE</span>
        </section>
        <div></div>
      </div>
    </footer>
  );
}
