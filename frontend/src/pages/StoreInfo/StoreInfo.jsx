import styles from "./StoreInfo.module.css";
import { useEffect, useState } from "react";
import { StoreDetail } from "../../components/StoreInfo/StoreDetail.jsx";
import { StoreList } from "../../components/StoreInfo/StoreList.jsx";
import { StoreTab } from "../../components/StoreInfo/StoreTab.jsx";
import { MenuList } from "../../components/StoreInfo/MenuList.jsx";
import { axiosData } from "../../utils/dataFetch.js";
import { StoreMap } from "../../components/StoreInfo/StoreMap.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { Coming } from "../../components/StoreInfo/Coming.jsx";
import { Service } from "../../components/StoreInfo/Service.jsx";

export function StoreInfo() {
  const navigate = useNavigate();
  const [info, setInfo] = useState(); //json 데이터
  const [activeTab, setActiveTab] = useState("seoul"); //활성화된 탭 (서울, 경기/인천, 수도권 외)
  const [selectedStore, setSelectedStore] = useState(null); //선택된 매장-
  const { pid } = useParams();

  //url id로 매핑해서 이동
  let store = null;
  for (const region in info) {
    store = info[region].find((s) => s.id === pid);
    if (store) break;
  }

  //json데이터 불러오기
  useEffect(() => {
    const fetch = async () => {
      const jsonData = await axiosData("/data/storeInfo.json");
      setInfo(jsonData);

      //기본 선택값을 광화문점으로
      const defaultStore = jsonData["seoul"]?.find(
        (store) => store.id === "001"
      );
      if (defaultStore) setSelectedStore(defaultStore);
    };

    fetch();
  }, []);

  //탭 클릭시 이벤트
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  //지점 클릭시 이벤트
  const handleStoreClick = (store) => {
    setSelectedStore(store);
    navigate(`/store-info/${store.id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.storeSection}>
        <StoreTab activeTab={activeTab} onTabChange={handleTabChange} />
        {info && (
          <div className={styles.menuList}>
            <StoreList
              stores={info[activeTab]}
              onStoreClick={handleStoreClick}
              selectedStore={selectedStore}
            />
            <StoreDetail store={selectedStore} />
          </div>
        )}
      </div>

      <MenuList />

      <div className={styles.section} id="coming">
        <Coming selectedStore={selectedStore} />
      </div>
      <div className={styles.section2} id="storeMap">
        <StoreMap selectedStore={selectedStore} />
      </div>
      <div className={styles.section}>
        <Service selectedStore={selectedStore} />
      </div>
    </div>
  );
}
