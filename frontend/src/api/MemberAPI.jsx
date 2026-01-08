import axios from "axios";
import { SERVER_URL } from "./config";

const BASE_URL = `${SERVER_URL}/member`;

// 회원가입
export const signupMember = async (memberData) => {
  try {
    const res = await axios.post(`${BASE_URL}/signup`, memberData, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("[API] 회원가입 실패:", err);
    throw err;
  }
};

// 로그인
export const loginMember = async (userId, pwd) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/login`,
      { userId, pwd },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("[API] 로그인 실패:", err);
    throw err;
  }
};

// 아이디 중복 체크
export const checkUserId = async (userId) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/idCheck`,
      { userId },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("[API] 아이디 체크 실패:", err);
    throw err;
  }
};

// 로그인 상태 확인
export const checkLoginStatus = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("[API] 로그인 상태 확인 실패:", err);
    return { login: false };
  }
};
