import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaRegUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import Swal from "sweetalert2";
import "../../css/swal.css";

import { axiosGetKakaoAuth } from "../../utils/dataFetch.js";
import { loginMember } from "../../api/MemberAPI.jsx";
import { setIsLogin, setUserId } from "../../store/memberSlice.js";

import cstyles from "./Logo.module.css";
import styles from "./Login.module.css";
import { SERVER_URL } from "../../api/config.js";

export const Login = () => {
  const [formData, setFormData] = useState({
    userId: "",
    pwd: "",
    saveId: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 페이지 로드 시 localStorage에 저장된 아이디/토큰 체크
  useEffect(() => {
    const savedId = localStorage.getItem("savedUserId");
    if (savedId) {
      setFormData((prev) => ({ ...prev, userId: savedId, saveId: true }));
    }

    const token = localStorage.getItem("jwtToken");
    if (token) {
      // JWT가 있으면 자동 로그인 처리
      const userId = localStorage.getItem("savedUserId") || "Unknown";
      dispatch(setUserId(userId));
      dispatch(setIsLogin(true));
    }
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.userId || !formData.pwd) {
      const msg = "아이디와 비밀번호를 모두 입력해주세요.";
      setError(msg);
      await Swal.fire({
        title: msg,
        confirmButtonText: "확인",
        customClass: {
          popup: "customPopup",
          title: "customTitle",
          confirmButton: "customConfirmButton",
        },
      });
      return;
    }

    try {
      const res = await loginMember(formData.userId, formData.pwd);

      if (res.login) {
        // 로그인 성공: JWT 저장
        localStorage.setItem("jwtToken", res.token);

        // 아이디 저장 체크
        if (formData.saveId)
          localStorage.setItem("savedUserId", formData.userId);
        else localStorage.removeItem("savedUserId");

        // Redux 상태 갱신
        dispatch(setUserId(formData.userId));
        dispatch(setIsLogin(true));

        await Swal.fire({
          title: "로그인 성공!",
          text: `환영합니다, ${formData.userId}님`,
          confirmButtonText: "확인",
          customClass: {
            popup: "customPopup",
            title: "customTitle",
            confirmButton: "customConfirmButton",
          },
        });

        navigate("/"); // 홈으로 이동
      } else {
        const msg = "아이디 또는 비밀번호가 올바르지 않습니다.";
        setError(msg);
        await Swal.fire({
          title: "로그인 실패",
          text: msg,
          confirmButtonText: "확인",
          customClass: {
            popup: "customPopup",
            title: "customTitle",
            htmlContainer: "customText",
            confirmButton: "customConfirmButton",
          },
        });
      }
    } catch (err) {
      console.error("로그인 실패:", err);
      const msg = "서버 오류로 로그인할 수 없습니다.";
      setError(msg);
      await Swal.fire({
        title: "서버 오류",
        text: msg,
        confirmButtonText: "확인",
        customClass: {
          popup: "customPopup",
          title: "customTitle",
          htmlContainer: "customText",
          confirmButton: "customConfirmButton",
        },
      });
    }
  };

  const handleKakaoAuth = () => {
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=faa41cfd2406bc361c3eb40aa4fb7ceb&redirect_uri=${SERVER_URL}/auth/kakao/callback&response_type=code`;
  };

  return (
    <div className={cstyles.container}>
      <div className={cstyles.logo}>
        <Link to="/">
          <img src="/images/logo.png" alt="로고" className={cstyles.logoImg} />
        </Link>
      </div>

      <form className={styles.loginForm} onSubmit={handleLogin}>
        <div className={styles.inputBox}>
          <FaRegUser className={styles.icon} />
          <input
            type="text"
            placeholder="아이디"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputBox}>
          <FaLock className={styles.icon} />
          <input
            type="password"
            placeholder="비밀번호"
            name="pwd"
            value={formData.pwd}
            onChange={handleChange}
          />
        </div>

        <div className={styles.checkboxWrap}>
          <input
            type="checkbox"
            id="saveId"
            name="saveId"
            checked={formData.saveId}
            onChange={handleChange}
          />
          <label htmlFor="saveId">아이디 저장</label>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.btnLogin}>
          로그인
        </button>

        <div className={styles.loginLinks}>
          <Link to="/signup-intro">회원가입</Link>
          <span>|</span>
          <a href="#">아이디 찾기</a>
          <span>|</span>
          <a href="#">비밀번호 찾기</a>
        </div>

        <div className={styles.socialLogin}>
          <button
            type="button"
            className={styles.btnKakao}
            onClick={handleKakaoAuth}
          >
            <img
              src="/images/auth/kakao_login.png"
              alt="카카오 로그인"
              className={styles.kakaoImg}
            />
          </button>
          {/*           <button type="button" className={styles.btnNaver}>네이버 로그인</button> */}
          {/*           <button type="button" className={styles.btnGoogle}>구글 로그인</button> */}
        </div>

        {/*         <div className={styles.guestLink}> */}
        {/*           <a href="#">비회원 주문조회</a> */}
        {/*         </div> */}
      </form>
    </div>
  );
};

export default Login;
