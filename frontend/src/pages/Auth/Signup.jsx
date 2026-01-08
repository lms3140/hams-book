import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import styles from "./Signup.module.css";
import cstyles from "./Logo.module.css";
import Terms from "./Terms.jsx";
import { signupMember } from "../../api/MemberAPI.jsx";
import Swal from "sweetalert2";
import "../../css/swal.css";
import { SERVER_URL } from "../../api/config";

export const Signup = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        id: "",
        pwd: "",
        pwdcheck: "",
        name: "",
        phone: "",
        email: "",
        birth: "",
        gender: "",
        agreeAll: false,
        agreeTerms: false,
        agreePrivacy: false,
        agreeMarketing: false,
        marketingEmail: false,
        marketingSMS: false,
    });

    const [idCheckResult, setIdCheckResult] = useState(null);
    const [pwdMatch, setPwdMatch] = useState(null);
    const [pwdValid, setPwdValid] = useState(null);

    // 🔹 카카오 자동 입력
    useEffect(() => {
        const kakaoId = searchParams.get("kakaoId");
        const kakaoName = searchParams.get("name");

        if (kakaoId) {
            setFormData(prev => ({ ...prev, id: kakaoId }));
            setIdCheckResult("available");
        }
        if (kakaoName) {
            setFormData(prev => ({ ...prev, name: kakaoName }));
        }
    }, [searchParams]);

    const validatePassword = (pwd) => /^.{4,}$/.test(pwd);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "pwd") {
            setFormData({ ...formData, pwd: value });
            setPwdValid(validatePassword(value));
            if (formData.pwdcheck) setPwdMatch(value === formData.pwdcheck);
            return;
        }

        if (name === "pwdcheck") {
            setFormData({ ...formData, pwdcheck: value });
            setPwdMatch(formData.pwd === value);
            return;
        }

        if (name === "phone") {
            const formatted = value
                .replace(/[^0-9]/g, "")
                .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/, "$1-$2-$3")
                .replace(/(-{1,2})$/, "");
            setFormData({ ...formData, phone: formatted });
            return;
        }

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleAllAgree = (checked) => {
        setFormData({
            ...formData,
            agreeAll: checked,
            agreeTerms: checked,
            agreePrivacy: checked,
            agreeMarketing: checked,
            marketingEmail: checked,
            marketingSMS: checked,
        });
    };

    const handleIdCheck = async () => {
        if (!formData.id) {
            Swal.fire({
                title: "아이디를 입력해주세요.",
                confirmButtonText: "확인",
                customClass: {
                    popup: "customPopup",
                    title: "customTitle",
                    confirmButton: "customConfirmButton"
                }
            });
            return;
        }

        try {
            const res = await fetch(`${SERVER_URL}/member/idCheck`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: formData.id }),
            });
            const data = await res.json();

            if (data.message === "사용 가능한 아이디입니다.") {
                setIdCheckResult("available");
                Swal.fire({
                    title: "사용 가능한 아이디입니다.",
                    confirmButtonText: "확인",
                    customClass: {
                        popup: "customPopup",
                        title: "customTitle",
                        confirmButton: "customConfirmButton"
                    }
                });
            } else {
                setIdCheckResult("duplicate");
                Swal.fire({
                    title: "이미 존재하는 아이디입니다.",
                    confirmButtonText: "확인",
                    customClass: {
                        popup: "customPopup",
                        title: "customTitle",
                        confirmButton: "customConfirmButton"
                    }
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "아이디 중복 확인 중 오류가 발생했습니다.",
                confirmButtonText: "확인",
                customClass: {
                    popup: "customPopup",
                    title: "customTitle",
                    confirmButton: "customConfirmButton"
                }
            });
        }
    };

    const handleSendCode = () => {
        if (!formData.email) {
            Swal.fire({
                title: "이메일을 입력해주세요.",
                confirmButtonText: "확인",
                customClass: {
                    popup: "customPopup",
                    title: "customTitle",
                    confirmButton: "customConfirmButton"
                }
            });
            return;
        }

        Swal.fire({
            title: `인증 메일이 ${formData.email}로 발송되었습니다.`,
            confirmButtonText: "확인",
            customClass: {
                popup: "customPopup",
                title: "customTitle",
                confirmButton: "customConfirmButton"
            }
        });
    };

    const isRequiredFilled =
        formData.id &&
        formData.pwd &&
        formData.pwdcheck &&
        pwdValid === true &&
        pwdMatch === true &&
        formData.name &&
        formData.phone &&
        formData.email &&
        formData.birth &&
        formData.gender &&
        formData.agreeTerms &&
        formData.agreePrivacy;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pwdValid) {
            Swal.fire({
                title: "비밀번호가 형식에 맞지 않습니다.",
                confirmButtonText: "확인",
                customClass: {
                    popup: "customPopup",
                    title: "customTitle",
                    confirmButton: "customConfirmButton"
                }
            });
            return;
        }

        if (formData.pwd !== formData.pwdcheck) {
            Swal.fire({
                title: "비밀번호가 일치하지 않습니다.",
                confirmButtonText: "확인",
                customClass: {
                    popup: "customPopup",
                    title: "customTitle",
                    confirmButton: "customConfirmButton"
                }
            });
            return;
        }

        if (!isRequiredFilled) {
            Swal.fire({
                title: "필수 항목을 모두 입력하고 약관에 동의해주세요.",
                confirmButtonText: "확인",
                customClass: {
                    popup: "customPopup",
                    title: "customTitle",
                    confirmButton: "customConfirmButton"
                }
            });
            return;
        }

        if (idCheckResult !== "available") {
            Swal.fire({
                title: "아이디 중복 확인을 완료해주세요.",
                confirmButtonText: "확인",
                customClass: {
                    popup: "customPopup",
                    title: "customTitle",
                    confirmButton: "customConfirmButton"
                }
            });
            return;
        }

        const submitData = {
            userId: formData.id,
            pwd: formData.pwd,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            birth: formData.birth.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"),
            gender: formData.gender,
        };

        try {
            await signupMember(submitData);
            Swal.fire({
                title: "회원가입이 완료되었습니다!",
                confirmButtonText: "확인",
                customClass: {
                    popup: "customPopup",
                    title: "customTitle",
                    confirmButton: "customConfirmButton"
                }
            }).then(() => navigate("/login"));
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.",
                confirmButtonText: "확인",
                customClass: {
                    popup: "customPopup",
                    title: "customTitle",
                    confirmButton: "customConfirmButton"
                }
            });
        }
    };

    return (
        <div className={cstyles.container}>
            <div className={cstyles.logo}>
                <Link to="/"><img src="/images/logo.png" alt="로고" className={cstyles.logoImg} /></Link>
            </div>

            <div className={styles.titleRow}>
                <h2 className={styles.title}>회원가입</h2>
                <p className={styles.stepInfo}>마지막 단계입니다!</p>
            </div>

            <div className={styles.sectionRow}>
                <h3 className={styles.sectionTitle}>회원정보 입력</h3>
                <p className={styles.sectionInfo}><span className={styles.required}>*</span> 필수 입력</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* 아이디 */}
                <label>아이디 <span className={styles.required}>*</span></label>
                <div className={styles.inputInfo}>아이디는 최소 4글자 이상이어야 합니다.</div>
                <div className={styles.inputRow}>
                    <input
                        minLength={4}
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="아이디를 입력해주세요."
                        readOnly={!!searchParams.get("kakaoId")}
                    />
                    {!searchParams.get("kakaoId") && (
                        <button type="button" onClick={handleIdCheck} className={styles.btnCheck}>중복확인</button>
                    )}
                </div>

                {/* 비밀번호 */}
                <label>비밀번호 <span className={styles.required}>*</span></label>
                <input
                    type="password"
                    name="pwd"
                    value={formData.pwd}
                    onChange={handleChange}
                    placeholder="비밀번호를 입력해주세요."
                />
                {pwdValid === false && <p className={styles.errorMsg}>비밀번호는 4자 이상이어야 합니다.</p>}
                {pwdValid === true && <p className={styles.successMsg}>사용 가능한 비밀번호입니다.</p>}

                {/* 비밀번호 확인 */}
                <label>비밀번호 확인 <span className={styles.required}>*</span></label>
                <input
                    type="password"
                    name="pwdcheck"
                    value={formData.pwdcheck}
                    onChange={handleChange}
                    placeholder="비밀번호를 한 번 더 입력해주세요."
                />
                {pwdMatch === false && <p className={styles.errorMsg}>비밀번호가 일치하지 않습니다.</p>}
                {pwdMatch === true && <p className={styles.successMsg}>비밀번호가 일치합니다.</p>}

                {/* 이름 */}
                <label>이름 <span className={styles.required}>*</span></label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="이름을 입력해주세요."
                    readOnly={!!searchParams.get("name")}
                />

                {/* 전화번호 */}
                <label>휴대폰번호 <span className={styles.required}>*</span></label>
                <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="휴대폰 번호를 입력해주세요."
                />

                {/* 이메일 + 인증번호 */}
                <label>이메일 <span className={styles.required}>*</span></label>
                <div className={styles.emailWrapper}>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="이메일을 입력해주세요."
                    />
                    <button
                        type="button"
                        className={styles.btnSendCode}
                        onClick={handleSendCode}
                        disabled={!formData.email}
                    >
                        인증번호 발송
                    </button>
                </div>

                {/* 생년월일 / 성별 */}
                <div className={styles.rowFlex}>
                    <div className={styles.flexItem}>
                        <label>생년월일/성별 <span className={styles.required}>*</span></label>
                        <input
                            name="birth"
                            value={formData.birth}
                            onChange={handleChange}
                            placeholder="YYYYMMDD"
                            pattern="\d{8}"
                            title="8자리 숫자 (예: 19991231)"
                        />
                    </div>
                    <div className={styles.flexItem}>
                        <div className={styles.segmentedControl}>
                            <button
                                type="button"
                                className={formData.gender === "m" ? styles.activeSegment : ""}
                                onClick={() => setFormData({ ...formData, gender: "m" })}
                            >
                                {formData.gender === "m" && "✔"} 남
                            </button>
                            <button
                                type="button"
                                className={formData.gender === "f" ? styles.activeSegment : ""}
                                onClick={() => setFormData({ ...formData, gender: "f" })}
                            >
                                {formData.gender === "f" && "✔"} 여
                            </button>
                        </div>
                    </div>
                </div>

                {/* 약관 동의 */}
                <Terms formData={formData} setFormData={setFormData} handleAllAgree={handleAllAgree} />

                <button type="submit" className={styles.btnSignup} disabled={!isRequiredFilled}>회원가입</button>
            </form>
        </div>
    );
};

export default Signup;
