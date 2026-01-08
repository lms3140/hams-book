import { useState } from "react";
import { infoSwal } from "../../api/api.js";
import styles from "./AddressModal.module.css";
import Modal from "react-modal";
import { Checkbox } from "../../components/Checkbox/Checkbox.jsx";
import DaumPostcode from "react-daum-postcode";
import { CiSearch } from "react-icons/ci";
import { SERVER_URL } from "../../api/config";

export function AddressModal({ isOpen, onClose, onSaved }) {
  const [addressName, setAddressName] = useState("");
  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipcode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
  const openPostcode = () => setIsPostcodeOpen(true);
  const closePostcode = () => setIsPostcodeOpen(false);

  const handleComplete = (data) => {
    setZipcode(data.zonecode);
    setAddress1(data.address);
    closePostcode();
  };

  // 저장 API
  const handleSave = async () => {
    const token = localStorage.getItem("jwtToken");

    const body = {
      addressName: addressName,
      recipientName: recipient,
      phone,
      zipCode,
      addressLine1: address1,
      addressLine2: address2,
      isDefault,
    };

    try {
      const res = await fetch(`${SERVER_URL}/address/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.error("주소 등록 실패");
        return;
      }

      infoSwal("주소가 등록되었습니다.", "", "확인");
      onClose();
      onSaved();
    } catch (err) {
      console.error("API error", err);
    }
  };

  const isFormValid = addressName.trim() && recipient.trim() && phone.trim();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.header}>
          <h3>배송지 추가</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <img src="/images/mypage/btn_close.png" alt="" />
          </button>
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label}>배송지명</label>
          <input
            type="text"
            className={styles.input}
            placeholder="최대 7글자까지 자유롭게 수정가능"
            value={addressName}
            onChange={(e) => setAddressName(e.target.value)}
          />

          <label className={styles.label}>받는 분</label>
          <input
            type="text"
            className={styles.input}
            placeholder="이름을 입력해 주세요."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="text"
            className={styles.input}
            placeholder="휴대폰번호를 - 없이 입력해 주세요."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className={styles.label}>주소</label>
          {!address1 && (
            <button
              className={styles.addressSearchButton}
              onClick={openPostcode}
            >
              <img src="/images/mypage/ico_search.png" alt="돋보기 아이콘" />
              주소 찾기
            </button>
          )}

          {address1 && (
            <>
              <div className={styles.addressTopRow}>
                <label className={styles.label}>주소</label>
                <button className={styles.changeBtn} onClick={openPostcode}>
                  주소 변경
                </button>
              </div>

              <input
                className={styles.addressInput}
                value={address1}
                readOnly
              />

              <input
                className={styles.addressInput}
                placeholder="상세 주소를 입력해 주세요."
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </>
          )}
        </div>

        <div className={styles.checkboxWrap}>
          <Checkbox
            checked={isDefault}
            onChange={() => setIsDefault(!isDefault)}
          />
          <p>기본배송지로 설정</p>
        </div>

        <div className={styles.saveBtnWrap}>
          <button
            className={`${styles.saveBtn} ${
              !isFormValid ? styles.disabled : ""
            }`}
            onClick={handleSave}
            disabled={!isFormValid}
          >
            저장
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isPostcodeOpen}
        onRequestClose={closePostcode}
        className={styles.postcodeModal}
        overlayClassName={styles.overlay}
      >
        <div className={styles.header}>
          <h3>주소 찾기</h3>
          <button className={styles.closeBtn} onClick={closePostcode}>
            <img src="/images/mypage/btn_close.png" alt="" />
          </button>
        </div>

        <div className={styles.postcodeBody}>
          <DaumPostcode onComplete={handleComplete} heigth={"100%"} />
        </div>
      </Modal>
    </>
  );
}
