import styles from "./Profile.module.css";
import { InfoRow } from "./InfoRow.jsx";
import { useEffect, useState } from "react";
import { infoSwal } from "../../api/api.js";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../api/config";

export function Profile() {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [currentPwVisible, setCurrentPwVisible] = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const [pwCheckVisible, setPwCheckVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      const token = localStorage.getItem("jwtToken");

      const res = await fetch(`${SERVER_URL}/member/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      setMember(json);
    };
    fetchInfo();
  }, []);

  useEffect(() => {
    if (password && passwordCheck && password !== passwordCheck) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
  }, [password, passwordCheck]);

  useEffect(() => {
    if (member) {
      setNewEmail(member.email);
      setNewPhone(member.phone);
    }
  }, [member]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("jwtToken");

    const res = await fetch(`${SERVER_URL}/member/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPwd,
        pwd: password,
        pwdCheck: passwordCheck,
        email: newEmail,
        phone: newPhone,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();

      if (msg === "Current password is required") {
        infoSwal("현재 비밀번호를 입력해주세요.", "", "확인");
      }

      if (msg === "Invalid current password") {
        infoSwal(
          "현재 비밀번호가 일치하지 않습니다.",
          "다시 입력해주세요.",
          "확인"
        );
      }

      if (msg === "Password confirmation required") {
        infoSwal("비밀번호 확인을 입력해주세요.", "", "확인");
      }

      if (msg === "Password mismatch") {
        infoSwal(
          "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.",
          "다시 입력해주세요.",
          "확인"
        );
      }

      if (msg === "Need new password") {
        infoSwal(
          "이전에 사용하던 비밀번호는 사용할 수 없습니다.",
          "새로운 비밀번호를 입력해주세요.",
          "확인"
        );
      }
    } else {
      await infoSwal("회원정보가 수정되었습니다.", "", "확인");
      navigate("/");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <h2 className={styles.pageTitle}>회원정보 수정</h2>

      <section className={styles.section}>
        <p className={styles.sectionTitle}>기본 정보</p>
        <div className={styles.group}>
          <InfoRow label="아이디" value={member?.userId} />

          <InfoRow
            label="현재 비밀번호"
            type={currentPwVisible ? "text" : "password"}
            onChange={(e) => setCurrentPwd(e.target.value)}
            placeholder="현재 비밀번호를 입력해주세요."
            buttonIcon
            onButtonClick={() => setCurrentPwVisible(!currentPwVisible)}
          />

          <InfoRow
            label="새 비밀번호"
            type={pwVisible ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="새 비밀번호를 입력해주세요."
            buttonIcon
            onButtonClick={() => setPwVisible(!pwVisible)}
            infoText={
              <>
                <span>
                  영문, 숫자, 특수문자 3가지 조합 8자리 이상 또는 2가지 조합
                  10자리 이상
                  <br />
                </span>
                <span>공백 및 3자 이상의 연속 또는 중복 문자 사용 불가</span>
              </>
            }
          />
          <InfoRow
            label="새 비밀번호 확인"
            type={pwCheckVisible ? "text" : "password"}
            onChange={(e) => setPasswordCheck(e.target.value)}
            placeholder="새 비밀번호를 한 번 더 입력해주세요."
            buttonIcon
            onButtonClick={() => setPwCheckVisible(!pwCheckVisible)}
            errorText={passwordError}
          />

          {passwordError && <p className={styles.error}>{passwordError}</p>}

          <InfoRow label="이름" value={member?.name} />
        </div>

        <div className={styles.group}>
          <InfoRow
            label="생년월일/성별"
            value={`${member?.birth} / ${member?.gender === "m" ? "남" : "여"}`}
          />
          <InfoRow
            label="이메일"
            value={newEmail}
            editMode={editEmail}
            buttonText="변경"
            placeholder="이메일을 입력해주세요."
            onChange={(e) => setNewEmail(e.target.value)}
            onToggleEdit={() => {
              setEditEmail((prev) => {
                const next = !prev;
                if (next) setNewEmail("");
                return next;
              });
            }}
          />
          <InfoRow
            label="휴대폰번호"
            value={newPhone}
            editMode={editPhone}
            buttonText="변경"
            placeholder="전화번호를 입력해주세요."
            onChange={(e) => setNewPhone(e.target.value)}
            onToggleEdit={() => {
              setEditPhone((prev) => {
                const next = !prev;
                if (next) setNewPhone("");
                return next;
              });
            }}
          />
        </div>
      </section>

      <div className={styles.quitGroup}>
        <p>회원 탈퇴 후 동일 아이디로 재가입이 불가합니다.</p>
        <button>회원탈퇴 {">"}</button>
      </div>

      <div className={styles.buttonGroup}>
        <button className={styles.cancelBtn}>취소</button>
        <button className={styles.confirmBtn} onClick={handleUpdate}>
          확인
        </button>
      </div>
    </div>
  );
}
