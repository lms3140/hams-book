import styles from "./Addresses.module.css";
import { Radio } from "../../components/RadioButton/Radio.jsx";
import { AddressModal } from "./AddressModal.jsx";
import { useEffect, useState } from "react";
import { confirmSwal } from "../../api/api.js";
import { SERVER_URL } from "../../api/config";

export function Addresses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const formatPhone = (p) => p?.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");

  //주소 불러오기
  const fetchAddress = async () => {
    const token = localStorage.getItem("jwtToken");
    const res = await fetch(`${SERVER_URL}/address/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let data = await res.json();

    data = data.sort((a, b) =>
      a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
    );
    setAddresses(data);

    setSelectedAddressId(null);
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const defaultAddress = addresses.find((a) => a.isDefault) || null;

  //기본배송지 설정
  const handleSetDefault = async () => {
    if (!selectedAddressId) return;

    const token = localStorage.getItem("jwtToken");
    const res = await fetch(`${SERVER_URL}/address/set-default`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ addressId: selectedAddressId }),
    });

    let updated = await res.json();

    updated = updated.sort((a, b) =>
      a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
    );

    setAddresses(updated);

    // 기본배송지 자동 선택
    const defaultAddr = updated.find((a) => a.isDefault);
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.addressId);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const result = await confirmSwal(
      "선택된 배송지를 삭제하시겠습니까?",
      "",
      "확인"
    );
    if (!result.isConfirmed) return;

    const token = localStorage.getItem("jwtToken");
    const res = await fetch(`${SERVER_URL}/address/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ addressId }),
    });

    const updated = await res.json();
    setAddresses(updated);
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>배송주소록</h2>

      <div className={styles.defaultBox}>
        <div className={styles.defaultLeft}>
          {defaultAddress ? (
            <>
              <div className={styles.itemTitle}>
                {defaultAddress.addressName}
                <span className={styles.defaultTag}>기본배송지</span>
              </div>

              <div className={styles.itemText}>
                {defaultAddress.recipientName} /{" "}
                {formatPhone(defaultAddress.phone)}
              </div>

              <div className={styles.itemText2}>
                [{defaultAddress.zipCode}] {defaultAddress.addressLine1}{" "}
                {defaultAddress.addressLine2}
              </div>
            </>
          ) : (
            <p>기본배송지가 없습니다.</p>
          )}
        </div>
      </div>
      <div className={styles.defaultNotice}>
        <p>･ 기본배송지 기준으로 배송일자가 안내됩니다.</p>
        <p>･ 기본배송지는 삭제 불가합니다.</p>
      </div>

      <div className={styles.listTop}>
        <div>
          <span className={styles.countText}>{addresses.length}</span>개
        </div>
        <div className={styles.rightGroup}>
          <span className={styles.maxText}>
            <span>*</span> 배송지는 최대 100개까지 등록 가능합니다.
          </span>
          <button
            className={styles.addBtn}
            onClick={() => setIsModalOpen(true)}
          >
            <img src="/images/mypage/ico_plus.png" alt="플러스 아이콘" />새
            배송지 등록
          </button>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.listContainer}>
        {addresses.map((addr) => (
          <div key={addr.addressId} className={styles.item}>
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

            <div className={styles.itemBtns}>
              {!addr.isDefault && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteAddress(addr.addressId)}
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        className={`${styles.submitBtn} ${
          selectedAddressId === null ? styles.disabled : ""
        }`}
        onClick={handleSetDefault}
      >
        기본 배송지로 설정
      </button>

      {isModalOpen && (
        <AddressModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={fetchAddress}
        />
      )}
    </div>
  );
}
