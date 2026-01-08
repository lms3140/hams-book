import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "../../components/Checkbox/Checkbox.jsx";
import styles from "./WishList.module.css";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice.js";
import { confirmSwal, infoSwal } from "../../api/api.js";
import { SERVER_URL } from "../../api/config";
import {
  clearSelected,
  selectFilteredSortedBooks,
  toggleSelected,
} from "../../store/searchSlice.js";

export function WishList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [wishList, setWishList] = useState([]);
  const sortedBooks = useSelector(selectFilteredSortedBooks);
  const selectedItems = useSelector((state) => state.search.selectedItems);

  useEffect(() => {
    const fetchWish = async () => {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(`${SERVER_URL}/wishlist/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setWishList(data);
    };
    fetchWish();
  }, []);

  const handleSelectAll = () => {
    if (selectedItems.length === wishList.length) {
      dispatch(clearSelected());
    } else {
      wishList.forEach((item) => dispatch(toggleSelected(item.bookId)));
    }
  };

  //아이템 하나 담기
  const addSingleToCart = async (item) => {
    const title = "선택한 상품을 장바구니에 담았어요.";
    const text = "장바구니로 이동하시겠어요?";
    const confirmButtonText = "장바구니 보기";

    dispatch(
      addToCart({
        bookId: item.bookId,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1,
      })
    );

    const result = await confirmSwal(title, text, confirmButtonText);
    if (result.isConfirmed) navigate("/cart");
  };

  //아이템 여러개 담기
  const addMultiToCart = async () => {
    const title = "선택한 상품을 장바구니에 담았어요.";
    const text = "장바구니로 이동하시겠어요?";
    const confirmButtonText = "장바구니 보기";

    if (selectedItems.length === 0) {
      await infoSwal("선택한 상품이 없습니다.", "", "확인");
      return;
    }

    selectedItems.forEach((bookId) => {
      const item = wishList.find((w) => w.bookId === bookId);
      if (!item) return;

      dispatch(
        addToCart({
          bookId: item.bookId,
          title: item.title,
          price: item.price,
          imageUrl: item.imageUrl,
          quantity: 1,
        })
      );
    });

    const result = await confirmSwal(title, text, confirmButtonText);
    if (result.isConfirmed) navigate("/cart");
  };

  const handleDeleteWishList = async (bookId) => {
    if (selectedItems.length === 0) {
      await infoSwal("삭제할 상품/콘텐츠를 선택해 주세요.", "", "확인");
      return;
    }

    const result = await confirmSwal(
      "선택한 상품/콘텐츠를 삭제하시겠습니까?",
      "",
      "확인"
    );
    if (!result.isConfirmed) return;

    const token = localStorage.getItem("jwtToken");
    const res = await fetch(`${SERVER_URL}/wishlist/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookId),
    });

    await res.json();

    const res2 = await fetch(`${SERVER_URL}/wishlist/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const updated = await res2.json();
    setWishList(updated);
  };

  const handleBuyNow = () => {
    navigate("/payment", {
      state: {
        orderItems: [
          {
            bookId: wishList.bookId,
            quantity: 1,
            title: wishList.title,
            price: wishList.price,
            imageUrl: wishList.imageUrl,
          },
        ],
      },
    });
  };

  return (
    <div className={styles.wrapper}>
      <h1>찜</h1>
      <div className={styles.top}>
        <p className={styles.topBox}>
          관심 있는 상품을 찜해두면 언제든 쉽게 구매할 수 있어요.
        </p>
      </div>

      {wishList.length > 0 ? (
        <div>
          <div className={styles.topBar}>
            <div className={styles.leftArea}>
              <Checkbox
                checked={
                  wishList.length > 0 &&
                  selectedItems.length === wishList.length
                }
                onChange={handleSelectAll}
              />
              <h3>
                찜한 상품 <span>{selectedItems.length}</span>/{wishList.length}
              </h3>
            </div>

            <div className={styles.rightArea}>
              <button onClick={() => handleDeleteWishList(selectedItems)}>
                선택삭제
              </button>
              <button onClick={() => addMultiToCart()}>
                <img src="/images/search/ico_cart.png" alt="" />
                장바구니에 담기
              </button>
            </div>
          </div>

          {wishList.map((wish) => (
            <div key={wish.bookId} className={styles.item}>
              <Checkbox
                checked={selectedItems.includes(wish.bookId)}
                onChange={() => dispatch(toggleSelected(wish.bookId))}
              />
              <img
                className={styles.bookImg}
                src={wish.imageUrl}
                alt={wish.title}
                onClick={() => navigate(`/detail/${wish.bookId}`)}
              />

              <div className={styles.itemInfo}>
                <h4 onClick={() => navigate(`/detail/${wish.bookId}`)}>
                  [{wish.categoryName}] {wish.title}
                </h4>

                <p>
                  <span
                    onClick={() =>
                      navigate(
                        `/search?keyword=${encodeURIComponent(wish.authors)}`
                      )
                    }
                  >
                    {wish.authors.join(", ")}
                  </span>{" "}
                  ･ {wish.publisherName}
                </p>
                <div className={styles.priceRow}>
                  <p className={styles.itemInfoPrice}>
                    <span>{wish.price.toLocaleString()}</span>원{" "}
                    <div className={styles.divider}></div>
                    {wish.point === null ? 0 : wish.point.toLocaleString()}p
                  </p>
                </div>
              </div>

              <div className={styles.itemButtons}>
                <button type="button" onClick={() => addSingleToCart(wish)}>
                  장바구니
                </button>
                <button type="button" onClick={handleBuyNow}>
                  바로구매
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noData}>
          <img src="/images/mypage/ico_nodata.png" alt="" />
          <p className={styles.noDataInfo}>찜한 상품이 없습니다.</p>
          <p>교보문고의 다양한 상품과 콘텐츠를 둘러보세요!</p>
          <button onClick={() => navigate("/")}>계속 쇼핑하기</button>
        </div>
      )}
    </div>
  );
}
