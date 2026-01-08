import { Link } from "react-router-dom";
import styles from "./MyPageSidebar.module.css";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../../api/config.js";

export function MyPageSidebar() {
  const [member, setMember] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      try {
        const res = await fetch(`${SERVER_URL}/member/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setMember(data);
        } else {
          console.error("회원 정보 조회 실패");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchInfo();
  }, []);

  return (
    <div className={styles.sideBar}>
      <div className={styles.userInfo}>
        <div className={styles.profileImage}>
          <img src="/images/mypage/img_no_profile.png" alt="" />
        </div>
        <div className={styles.name}>{member ? member.name : "회원"}님</div>
        <div className={styles.point}>
          포인트 :{" "}
          <span>{(member ? member.pointBalance : 0).toLocaleString()}</span>
        </div>
      </div>
      <nav>
        <ul className={styles.menuList}>
          <h3>마이페이지</h3>
          <li>
            <Link to="/mypage/orders">구매목록</Link>
          </li>
          <li>
            <Link to="/mypage/wishlist">찜목록</Link>
          </li>
          <li>
            <Link to="/mypage/reviews">리뷰</Link>
          </li>
          <li>
            <Link to="/mypage/inquiries">1:1 문의내역</Link>
          </li>
          <li>
            <Link to="/mypage/profile">회원정보수정</Link>
          </li>
          <li>
            <Link to="/mypage/addresses">배송 주소록</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
