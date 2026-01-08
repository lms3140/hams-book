import styles from "./Search.module.css";
import paginationStyles from "../Pagination/Pagination.module.css";
import { useEffect } from "react";
import { SearchFilter } from "../../components/Search/SearchFilter.jsx";
import { SearchSort } from "../../components/Search/SearchSort.jsx";
import { SearchItems } from "../../components/Search/SearchItems.jsx";
import Pagination from "../Pagination/Pagination.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePagination } from "../../hooks/usePagination.js";
import { confirmSwal, infoSwal, likeSwal } from "../../api/api.js";
import {
  selectFilteredSortedBooks,
  setKeyword,
  setLimit,
  setSortOptions,
  setViewType,
  toggleSelected,
} from "../../store/searchSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchBooks } from "../../store/bookSlice.js";
import { addToCart } from "../../store/cartSlice.js";
import {
  addMultipleLikes,
  setItems,
  toggleLike,
} from "../../store/likedSlice.js";
import axios from "axios";
import { SERVER_URL } from "../../api/config";

export function Search() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const keyword = params.get("keyword");
  const limit = useSelector((state) => state.search.limit);
  const viewType = useSelector((state) => state.search.viewType);
  const selectedItems = useSelector((state) => state.search.selectedItems);
  const likedItems = useSelector((state) => state.liked.likedItems);
  const sortedBooks = useSelector(selectFilteredSortedBooks);
  const originalBooks = useSelector((state) => state.books.books);
  const isLoggedIn = Boolean(localStorage.getItem("jwtToken"));

  // keyword 바뀔 때마다 검색 실행
  useEffect(() => {
    if (keyword) {
      dispatch(setKeyword(keyword));
      dispatch(fetchBooks(keyword));
    }
  }, [keyword, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const getList = async () => {
      const resp = await axios.get(`${SERVER_URL}/wishlist/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setItems(resp.data));
    };
    getList();
  }, []);

  //페이지네이션
  const { currentPage, pageCount, currentItems, handlePageChange } =
    usePagination(sortedBooks, limit);

  const addMultiWish = async () => {
    if (selectedItems.length === 0) {
      await infoSwal("선택한 상품이 없습니다.", "", "확인");
      return;
    }

    const token = localStorage.getItem("jwtToken");
    const resp = await axios.post(
      `${SERVER_URL}/wishlist/add-multi`,
      selectedItems,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (resp.status === 200) {
      dispatch(addMultipleLikes(resp.data));
      const result = likeSwal();
      if ((await result).isConfirmed) navigate("/mypage/wishlist");
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
      const book = sortedBooks.find((b) => b.bookId === bookId);
      if (!book) return;

      dispatch(
        addToCart({
          bookId: book.bookId,
          title: book.title,
          price: book.price,
          imageUrl: book.imageUrl,
          quantity: 1,
        })
      );
    });

    const result = await confirmSwal(title, text, confirmButtonText);
    if (result.isConfirmed) navigate("/cart");
  };

  return (
    <div className={styles.searchWrapper}>
      <h1 className={styles.resultTitle}>
        <span>'{keyword}'</span>에 대한 {originalBooks.length}개의 검색 결과
      </h1>

      <div className={styles.searchContainer}>
        <SearchFilter />

        <div className={styles.rightArea}>
          <SearchSort
            onLimitChange={(v) => dispatch(setLimit(v))}
            viewType={viewType}
            onViewTypeChange={(v) => dispatch(setViewType(v))}
            onSortChange={(v) => dispatch(setSortOptions(v))}
            addMultiToCart={addMultiToCart}
            addMultiWish={addMultiWish}
          />
          <div
            className={viewType === "list" ? styles.listView : styles.gridView}
          >
            {currentItems &&
              currentItems.map((item) => (
                <SearchItems
                  key={item.bookId}
                  item={item}
                  viewType={viewType}
                  selectedItems={selectedItems}
                  toggleSelect={(id) => dispatch(toggleSelected(id))}
                  addSingleToCart={addSingleToCart}
                  likedItems={likedItems}
                  toggleLike={(id) => dispatch(toggleLike(id))}
                  isLoggedIn={isLoggedIn}
                />
              ))}
          </div>
          <div
            className={`${paginationStyles.pagination} ${styles.pagination}`}
          >
            {sortedBooks.length > limit ? (
              <Pagination
                pageCount={pageCount}
                onPageChange={handlePageChange}
                currentPage={currentPage}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
