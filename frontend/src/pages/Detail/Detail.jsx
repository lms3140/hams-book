import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Detail.module.css";
import { useGetFetch } from "../../hooks/useGetFetch.js";
import { SERVER_URL } from "../../api/config";
import ProductInfo from "./ProductInfo";
import Review from "./Review";
import ReturnPolicy from "./ReturnPolicy";
import UnderBar from "./UnderBar";

export default function Detail() {
  const { bookId } = useParams(); // URL 파라미터에서 bookId 추출
  const url = `${SERVER_URL}/book/detail/${bookId}`;
  const { isLoading, isError, data } = useGetFetch(url);

  const [count, setCount] = useState(1);
  const [liked, setLiked] = useState(false);

  // 섹션 ref
  const infoRef = useRef(null);
  const reviewRef = useRef(null);
  const returnRef = useRef(null);

  const [activeTab, setActiveTab] = useState("info");

  const scrollToSection = (ref, tabName) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
    setActiveTab(tabName);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 80;
      const infoTop = infoRef.current?.offsetTop ?? 0;
      const reviewTop = reviewRef.current?.offsetTop ?? 0;
      const returnTop = returnRef.current?.offsetTop ?? 0;

      if (scrollPos >= returnTop) setActiveTab("return");
      else if (scrollPos >= reviewTop) setActiveTab("review");
      else setActiveTab("info");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) return <div>로딩중...</div>;
  if (isError || !data) return <div>상품을 찾을 수 없습니다.</div>;

  return (
    <div className={styles.detailContainer}>
      <div className={styles.detailTop}>
        <img
          className={styles.bookImage}
          src={data.imageUrl}
          alt={data.title}
        />
        <div className={styles.bookInfo}>
          <h2 className={styles.title}>{data.title}</h2>
          <p className={styles.author}>
            {data.authors || "저자 정보 없음"} | {data.publisherName || "출판사 정보 없음"}
          </p>
          <p className={styles.price}>₩ {data.price.toLocaleString()}</p>
        </div>
      </div>

      <div className={styles.tabMenu}>
        <button
          className={activeTab === "info" ? styles.active : ""}
          onClick={() => scrollToSection(infoRef, "info")}
        >
          상품정보
        </button>
        <button
          className={activeTab === "review" ? styles.active : ""}
          onClick={() => scrollToSection(reviewRef, "review")}
        >
          리뷰
        </button>
        <button
          className={activeTab === "return" ? styles.active : ""}
          onClick={() => scrollToSection(returnRef, "return")}
        >
          교환/반품/품절
        </button>
      </div>

      <div ref={infoRef} className={styles.tabContent}>
        <ProductInfo bookId={bookId} />
      </div>

      <div id="review" ref={reviewRef} className={styles.tabContent}>
        <Review bookId={bookId} />
      </div>

      <div ref={returnRef} className={styles.tabContent}>
        <ReturnPolicy />
      </div>

      <UnderBar
        product={data}
        count={count}
        setCount={setCount}
        liked={liked}
        setLiked={setLiked}
      />
    </div>
  );
}
