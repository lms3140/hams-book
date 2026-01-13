import React, { useState } from "react";
import styles from "./Terms.module.css";

export const Terms = ({ formData, setFormData }) => {
  // 아코디언 열림 상태 관리
  const [openGroup, setOpenGroup] = useState({
    terms: false,
    privacy: false,
    marketing: false,
  });

  // 아코디언 토글
  const toggleGroup = (group) => {
    setOpenGroup({ ...openGroup, [group]: !openGroup[group] });
  };

  // 전체 동의
  const handleAllAgree = (e) => {
    const checked = e.target.checked;
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

  // 개별 약관 체크
  const handleCheck = (e) => {
    const { name, checked } = e.target;

    if (name === "agreeMarketing") {
      // 마케팅 체크 시 하위 항목도 동시에 체크/해제
      setFormData({
        ...formData,
        agreeMarketing: checked,
        marketingEmail: checked,
        marketingSMS: checked,
      });
    } else {
      setFormData({ ...formData, [name]: checked });
    }
  };

  // 마케팅 하위 체크
  const handleMarketingSubCheck = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  return (
    <div className={styles.agreeSection}>
      {/* 전체 동의 */}
      <div className={styles.agreeAll}>
        <input
          type="checkbox"
          name="agreeAll"
          checked={formData.agreeAll}
          onChange={handleAllAgree}
        />
        <label>약관 전체 동의</label>
      </div>

      {/* 이용약관 */}
      <div className={styles.agreeItem}>
        <div className={styles.groupHeader}>
          <input
            type="checkbox"
            name="agreeTerms"
            checked={formData.agreeTerms}
            onChange={handleCheck}
          />
          <label>햄스문고 이용약관 (필수)</label>
          <button
            type="button"
            className={styles.btnView}
            onClick={() => toggleGroup("terms")}
          >
            {openGroup.terms ? "접기" : "보기"}
          </button>
        </div>
        {openGroup.terms && (
          <div className={styles.groupContent}>
            {/* 실제 약관 내용 */}
            <p>여기에 이용약관 내용이 들어갑니다.</p>
          </div>
        )}
      </div>

      {/* 개인정보 */}
      <div className={styles.agreeItem}>
        <div className={styles.groupHeader}>
          <input
            type="checkbox"
            name="agreePrivacy"
            checked={formData.agreePrivacy}
            onChange={handleCheck}
          />
          <label>개인정보 수집 및 이용 동의 (필수)</label>
          <button
            type="button"
            className={styles.btnView}
            onClick={() => toggleGroup("privacy")}
          >
            {openGroup.privacy ? "접기" : "보기"}
          </button>
        </div>
        {openGroup.privacy && (
          <div className={styles.groupContent}>
            <p>여기에 개인정보 약관 내용이 들어갑니다.</p>
          </div>
        )}
      </div>

      {/* 마케팅 선택 */}
      <div className={styles.agreeItem}>
        <div className={styles.groupHeader}>
          <input
            type="checkbox"
            name="agreeMarketing"
            checked={formData.agreeMarketing}
            onChange={handleCheck}
          />
          <label>마케팅 정보 수신 동의 (선택)</label>
          <button
            type="button"
            className={styles.btnView}
            onClick={() => toggleGroup("marketing")}
          >
            {openGroup.marketing ? "접기" : "보기"}
          </button>
        </div>
        {openGroup.marketing && (
          <div className={styles.groupContent}>
            {/* 하위 선택 항목 */}
            <div>
              <input
                type="checkbox"
                name="marketingEmail"
                checked={formData.marketingEmail || false}
                onChange={handleMarketingSubCheck}
              />
              <label>이메일</label>
            </div>
            <div>
              <input
                type="checkbox"
                name="marketingSMS"
                checked={formData.marketingSMS || false}
                onChange={handleMarketingSubCheck}
              />
              <label>문자</label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terms;
