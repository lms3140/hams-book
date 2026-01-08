import React, { useEffect, useState } from "react";
import styles from "./AddressesList.module.css";
import axios from "axios";
import { Radio } from "../../components/RadioButton/Radio.jsx";
import { AddressModal } from "../Mypage/AddressModal.jsx";
import { SERVER_URL } from "../../api/config";

export default function AddressesList({ isOpen, onClose, onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // ===== 주소 불러오기 =====
  const fetchAddress = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.get(`${SERVER_URL}/address/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data = res.data || [];

      // 기본 배송지를 가장 위로 정렬
      data = data.sort((a, b) =>
        a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
      );

      setAddresses(data);
      setSelectedAddressId(null);
    } catch (err) {
      console.error("주소 불러오기 실패", err);
    }
  };

  useEffect(() => {
    if (isOpen) fetchAddress();
  }, [isOpen]);

  if (!isOpen) return null;

  // 전화번호 포맷 함수
  const formatPhone = (phone) => {
    if (!phone) return "";
    return phone.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3");
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>배송지 선택</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <img src="/images/mypage/btn_close.png" alt="닫기" />
          </button>
        </div>

        {/* 주소 리스트 */}
        <div className={styles.list}>
          {addresses.map((addr) => (
            <div
              key={addr.addressId}
              className={styles.addressItem}
              onClick={() => setSelectedAddressId(addr.addressId)}
            >
              <Radio
                checked={selectedAddressId === addr.addressId}
                onChange={() => setSelectedAddressId(addr.addressId)}
              />

              <div className={styles.itemInfo}>
                <div className={styles.itemTitle}>
                  {addr.addressName}
                  {addr.isDefault && (
                    <span className={styles.defaultTag}>기본배송지</span>
                  )}
                </div>

                <div className={styles.itemText}>
                  {addr.recipientName} / {formatPhone(addr.phone)}
                </div>

                <div className={styles.itemText2}>
                  [{addr.zipCode}] {addr.addressLine1} {addr.addressLine2}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 버튼 영역 */}
        <div className={styles.bottomBtns}>
          <button className={styles.addBtn} onClick={() => setIsAddOpen(true)}>
            새 주소 추가
          </button>

          <button
            className={styles.saveBtn}
            disabled={!selectedAddressId}
            onClick={() => {
              const addr = addresses.find(
                (a) => a.addressId === selectedAddressId
              );
              if (addr) {
                onSelect(addr);
                onClose();
              }
            }}
          >
            선택하기
          </button>
        </div>

        {/* 내부에서 AddressModal 열기 */}
        {isAddOpen && (
          <AddressModal
            isOpen={true}
            onClose={() => setIsAddOpen(false)}
            onSaved={fetchAddress}
          />
        )}
      </div>
    </div>
  );
}
