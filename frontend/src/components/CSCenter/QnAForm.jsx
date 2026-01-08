import styles from "./QnAForm.module.css";
import { useEffect, useState } from "react";
import { axiosPost } from "../../utils/dataFetch.js";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "../Checkbox/Checkbox.jsx";
import { Radio } from "../RadioButton/Radio.jsx";
import { infoSwal } from "../../api/api.js";
import { SERVER_URL } from "../../api/config";

export function QnAForm() {
  const navigate = useNavigate();
  const [inquiryType, setInquiryType] = useState("");
  const [isContentEnabled, setIsContentEnabled] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitActive, setIsSubmitActive] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("phone");
  const [memberId, setMemberId] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;

      const res = await fetch(`${SERVER_URL}/member/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("회원 정보를 불러올 수 없습니다.");

      const data = await res.json();
      setPhone(data.phone);
      setEmail(data.email);
      setMemberId(data.memberId);
    };
    fetchUserInfo();
  }, []);

  // 문의유형 선택
  const handleInquiryChange = (e) => {
    const value = e.target.value;
    setInquiryType(value);
    setIsContentEnabled(!!value);
  };

  //제목 입력
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // textarea 입력
  const handleContentChange = (e) => {
    const value = e.target.value;
    if (value.length <= 500) {
      setContent(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { memberId, title, content, status: "준비중" };
      const url = `${SERVER_URL}/inquiry/qna`;
      await axiosPost(url, data);
      await infoSwal(
        "문의가 접수되었어요.",
        "빠른 시간 내에 답변 드리겠습니다.",
        "확인"
      );
      navigate("/mypage/inquiries");
    } catch (e) {
      console.log(e);
      infoSwal("다시 시도해주세요", "", "확인");
    }
  };

  //content 모두 작성 시 문의 접수 버튼 색상 변경
  useEffect(() => {
    if (inquiryType && title.trim() && content.trim()) {
      setIsSubmitActive(true);
    } else {
      setIsSubmitActive(false);
    }
  }, [inquiryType, title, content]);

  return (
    <div className={styles.qnaContainer}>
      <h1>1:1 문의 접수</h1>

      <form className={styles.from} onSubmit={handleSubmit}>
        <div className={styles.fieldRow}>
          <label htmlFor="inquiryType" className={styles.label}>
            문의유형 <span className={styles.green}>*</span>
          </label>
          <div className={styles.selectWrap}>
            <select
              id="inquiryType"
              className={styles.select}
              value={inquiryType}
              onChange={handleInquiryChange}
              required
            >
              <option value="">문의 유형을 선택해 주세요.</option>
              <option value="배송/수령예정일안내">배송/수령예정일안내</option>
              <option value="주문/결제/기프트카드">주문/결제/기프트카드</option>
              <option value="검색 기능 관련">검색 기능 관련</option>
              <option value="반품/교환/환불(도서)">반품/교환/환불(도서)</option>
              <option value="도서/상품정보">도서/상품정보</option>
              <option value="회원정보서비스">회원정보서비스</option>
            </select>
          </div>
        </div>

        <div className={styles.fieldRow}>
          <label htmlFor="title" className={styles.label}>
            내용 <span className={styles.green}>*</span>
          </label>
          <div>
            <input
              type="text"
              id="title"
              className={styles.input}
              placeholder="제목을 입력해 주세요."
              value={title}
              onChange={handleTitleChange}
            />
          </div>
        </div>

        <div className={styles.fieldColumn}>
          <label htmlFor="contetn" className={styles.label}></label>
          <div>
            <textarea
              id="content"
              className={styles.textarea}
              value={content}
              onChange={handleContentChange}
              placeholder={
                isContentEnabled
                  ? "내용을 입력해 주세요."
                  : "문의 유형을 먼저 선택 후 입력해주세요."
              }
              maxLength="500"
              disabled={!isContentEnabled}
            ></textarea>

            <span className={styles.charCount}>{content.length}/500</span>
          </div>
        </div>

        <div className={styles.contactSection}>
          <div className={styles.border}>
            <p className={styles.contactTitle}>
              문의에 대한 답변 등록 시 알려드립니다.
            </p>
            <div className={styles.fieldRow}>
              <label className={styles.label}>
                연락처 <span className={styles.green}>*</span>
              </label>

              <div className={styles.contactBox}>
                <div className={styles.contactType}>
                  <Radio
                    name={"phone"}
                    label={"휴대폰 번호"}
                    checked={type === "phone"}
                    onChange={() => setType("phone")}
                  />
                  <Radio
                    name={"tel"}
                    label={"전화번호"}
                    checked={type === "tel"}
                    onChange={() => setType("tel")}
                  />
                </div>

                <input
                  type="text"
                  placeholder="숫자만 입력해 주세요."
                  className={`${styles.input} ${styles.phoneInput}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {!phone && (
                  <p className={styles.warning}>
                    <img src="/images/CSCenter/warningIcon.png" alt="" />
                    연락처를 입력해주세요.
                  </p>
                )}
                {phone.length < 11 && phone && (
                  <p className={styles.warning}>
                    <img src="/images/CSCenter/warningIcon.png" alt="" />
                    유효한 연락처를 입력해주세요.(숫자만 입력)
                  </p>
                )}

                {type === "phone" && (
                  <Checkbox
                    labelStyle={styles.checkboxLabel}
                    label={
                      "답변알림 요청 (답변이 등록되면 알림톡으로 알려드립니다.)"
                    }
                  />
                )}
              </div>
            </div>

            <div className={styles.emailField}>
              <label htmlFor="email" className={styles.label}>
                이메일
              </label>
              <input
                type="email"
                id="email"
                className={styles.emailInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요."
              />
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.cancelBtn}>
            취소
          </button>
          <button
            type="submit"
            className={`${styles.submitBtn} ${
              isSubmitActive ? styles.active : ""
            }`}
            disabled={!isSubmitActive}
          >
            문의접수
          </button>
        </div>

        <div className={styles.noticeBox}>
          <h4>문의내용 답변 안내</h4>
          <p>
            ㆍ답변은 마이룸 또는 회원정보에 등록된 이메일로 확인 가능합니다.
            (문의내용에 따라 고객센터 또는 매장에서 연락드릴 수 있습니다.)
          </p>
          <p>
            ㆍ당일 17시 이후 문의건과 공휴일 1:1 문의는 문의 유형과
            이름/연락처/이메일 주소를 남겨 주시면 확인 후 운영시간에 통지해
            드립니다.
          </p>
          <p>
            ㆍ정상근무일 기준이며, 통지예정일이 휴일인 경우 다음 정상 근무일에
            진행 됩니다.
          </p>
          <p>
            ㆍ주문 취소 및 변경 문의는 답변 시점에 따라 처리가 어려울 수
            있습니다.
          </p>
          <p className={styles.bold}>
            ㆍ설/추석 연휴 기간 동안은 고객센터 휴무로 인해 1:1 문의 답변이 불가
            합니다.
          </p>
          <p className={styles.bold}>
            ㆍ설/추석 연후 끝난 이후부터 순차적으로 답변드릴 예정이니 양해
            부탁드립니다.
          </p>
          <p className={styles.bold}>
            ㆍ신학기(3월, 9월)에는 문의량이 급증하여 답변이 지연될 수 있습니다.
          </p>
        </div>
      </form>
    </div>
  );
}
