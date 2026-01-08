import { BookCollectionSection } from "../BookCollectionSection/BookCollectionSection";
import contentStyle from "./HomeColContent.module.css";
import { useGetFetch } from "../../../hooks/useGetFetch";
import { SERVER_URL } from "../../../api/config";

export function HomeColContent() {
  const url = `${SERVER_URL}/book-collection/all`;
  const { isLoading, isError, data } = useGetFetch(url);

  if (isLoading || (data && data.length === 0)) {
    // 로딩중이거나 데이터가 없을때 보여줄 컨텐츠 리턴
    return (
      <div className={contentStyle.noBook}>
        <img src="./images/bookImg/loading.png" alt="loading" width={1200} />
      </div>
    );
  } else if (isError) {
    // 에러일때 보여줄 컨텐츠 리턴
    return (
      <div className={contentStyle.noBook}>
        <img src="./images/bookImg/no_book.png" alt="no_book" width={1200} />
      </div>
    );
  }

  return (
    <div className={contentStyle.homeColContent}>
      {data &&
        data.map((collection) => {
          return (
            <BookCollectionSection
              key={collection.collectionId}
              bookCollection={collection}
            />
          );
        })}
    </div>
  );
}
