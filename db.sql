drop database book_store;
create database book_store;
use book_store;

-- ============================================================
-- 📚 카테고리 / 하위 카테고리
-- ============================================================
CREATE TABLE category (
  category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE subcategory (
  subcategory_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT NOT NULL,
  subcategory_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES category (category_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 🏢 출판사
-- ============================================================
CREATE TABLE publisher (
  publisher_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- ✍️ 저자 / 번역가
-- ============================================================
CREATE TABLE author (
  author_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE translator (
  translator_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  bio TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 📖 도서
-- ============================================================
CREATE TABLE book (
  book_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subcategory_id BIGINT NULL,
  publisher_id BIGINT NULL,
  price INT NULL,
  point INT NULL,
  published_date DATE NULL,
  description TEXT NULL,
  image_url VARCHAR(500) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (subcategory_id) REFERENCES subcategory (subcategory_id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (publisher_id) REFERENCES publisher (publisher_id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 📚 책 - 저자 / 번역가 매핑
-- ============================================================
CREATE TABLE book_author (
  book_id BIGINT NOT NULL,
  author_id BIGINT NOT NULL,
  PRIMARY KEY (book_id, author_id),
  FOREIGN KEY (book_id) REFERENCES book (book_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (author_id) REFERENCES author (author_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book_translator (
  book_id BIGINT NOT NULL,
  translator_id BIGINT NOT NULL,
  PRIMARY KEY (book_id, translator_id),
  FOREIGN KEY (book_id) REFERENCES book (book_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (translator_id) REFERENCES translator (translator_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 👤 회원 / 주소
-- ============================================================
CREATE TABLE member (
  member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  -- 로그인 정보
  user_id VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  -- 기본 회원 정보
  name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  birth DATE NULL,
  gender VARCHAR(1) NULL,
  -- 권한 / 상태
  role VARCHAR(20) DEFAULT 'USER', 
  status VARCHAR(20) DEFAULT 'ACTIVE', 
  -- ACTIVE / BLOCK / WITHDRAW
  -- 차단 정보
  block_reason VARCHAR(255) NULL,
  blocked_at TIMESTAMP NULL,
  -- 포인트
  point_balance INT DEFAULT 0,
  -- 소셜 로그인
  kakao_id VARCHAR(255) UNIQUE NULL,
  -- 시간 관리
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE member_history (
  history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT NOT NULL,               -- member 테이블과 연동
  type VARCHAR(20) NOT NULL,               -- 상태/포인트
  before_value VARCHAR(255),               -- 변경 전 값
  after_value VARCHAR(255),                -- 변경 후 값
  reason VARCHAR(255),                     -- 수정 이유
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 수정 시간
  FOREIGN KEY (member_id) REFERENCES member(member_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE address (
  address_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT NOT NULL,
  recipient_name VARCHAR(50) NULL,
  phone VARCHAR(20) NULL,
  address_line1 VARCHAR(255) NULL,
  address_line2 VARCHAR(255) NULL,
  zip_code VARCHAR(10) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  address_name varchar(7) null,
  is_default boolean not null,
  FOREIGN KEY (member_id) REFERENCES member (member_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 🛒 장바구니
-- ============================================================
CREATE TABLE cart_item (
  cart_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  quantity INT DEFAULT 1,
  UNIQUE KEY unique_cart_item(user_id, book_id),
  FOREIGN KEY (user_id) REFERENCES member(member_id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES book(book_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 🧾 주문 / 주문 상세
-- ============================================================
CREATE TABLE purchase_order (
  order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT NOT NULL,
  address_id BIGINT NULL,

  total_amount INT NOT NULL,
  original_amount INT NOT NULL,
  earned_point int not null default 0,
  order_status VARCHAR(20) DEFAULT 'READY',
  tid VARCHAR(50) NULL,
  paid_at TIMESTAMP NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (member_id) REFERENCES member (member_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (address_id) REFERENCES address (address_id)
    ON DELETE SET NULL ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE order_detail (
  order_detail_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price INT NULL,
  FOREIGN KEY (order_id) REFERENCES purchase_order (order_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (book_id) REFERENCES book (book_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- 🗂 도서 컬렉션
-- ============================================================
CREATE TABLE book_collection (
  collection_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  display_order INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE collection_book (
  collection_book_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  collection_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  display_order INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (collection_id) REFERENCES book_collection (collection_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (book_id) REFERENCES book (book_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ============================================================
-- 🗣 리뷰 / 찜 / 문의 / 포인트 내역
-- ============================================================
CREATE TABLE review (
  review_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  rating INT NULL,
  content TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES member (member_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (book_id) REFERENCES book (book_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE wishlist (
  member_id BIGINT NOT NULL,
  book_id BIGINT NOT NULL,
  PRIMARY KEY (member_id, book_id),
  FOREIGN KEY (member_id) REFERENCES member (member_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (book_id) REFERENCES book (book_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE inquiry (
  inquiry_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT NOT NULL,
  title VARCHAR(255) NULL,
  content TEXT NULL,
  status VARCHAR(20) NULL,
  answered_by BIGINT NULL,
  answered_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES member (member_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE point_history (
  point_history_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  member_id BIGINT NOT NULL,
  change_amount INT NULL,
  type VARCHAR(20) NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES member (member_id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 책 정보 조회
SELECT 
    b.book_id,
    b.title,
    p.name AS publisher,
    c.category_name,
    s.subcategory_name,
    b.price,
    b.point,
    b.published_date,
    b.description,
    b.image_url,
    GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS authors,
    GROUP_CONCAT(DISTINCT t.name SEPARATOR ', ') AS translators
FROM 
    book b
    JOIN publisher p ON b.publisher_id = p.publisher_id
    JOIN subcategory s ON b.subcategory_id = s.subcategory_id
    JOIN category c ON s.category_id = c.category_id
    JOIN book_author ba ON b.book_id = ba.book_id
    JOIN author a ON ba.author_id = a.author_id
    LEFT JOIN book_translator bt ON b.book_id = bt.book_id
    LEFT JOIN translator t ON bt.translator_id = t.translator_id
GROUP BY 
    b.book_id, b.title, p.name, c.category_name, s.subcategory_name,
    b.price, b.point, b.published_date, b.description, b.image_url;

CREATE VIEW collection_vw AS
SELECT
    bc.collection_id AS collectionId,
    bc.name AS collectionName,
    bc.description AS description,
    bc.display_order AS collectionDisplayOrder,
    b.book_id AS bookId,
    b.title AS title,
    b.image_url AS imageUrl,
    cb.display_order AS bookDisplayOrder
FROM book_collection bc
JOIN collection_book cb
    ON bc.collection_id = cb.collection_id
JOIN book b
    ON cb.book_id = b.book_id
ORDER BY
    bc.display_order ASC,
    cb.display_order ASC;


-- 모든 책의 판매
CREATE OR REPLACE VIEW book_sales_stats_view AS
SELECT 
    b.book_id,
    b.title,
    b.image_url,
    
    COALESCE(SUM(od.quantity), 0) AS total_sales_quantity,
    COALESCE(SUM(od.quantity * od.unit_price), 0) AS total_sales_amount,

    MIN(b.published_date) AS published_date  -- 선택: 필요 없으면 삭제 가능
FROM book b
LEFT JOIN order_detail od 
    ON b.book_id = od.book_id
LEFT JOIN purchase_order po
    ON od.order_id = po.order_id 
    AND po.order_status = 'PAID'  -- 결제 완료된 주문만 집계
GROUP BY 
    b.book_id, b.title, b.image_url;
    
-- 프로젝트 요약
CREATE OR REPLACE VIEW admin_summary_view AS
SELECT 
    -- 총 매출 (quantity × unit_price)
    COALESCE(SUM(od.quantity * od.unit_price), 0) AS total_revenue,

    -- 총 판매량
    COALESCE(SUM(od.quantity), 0) AS total_quantity,

    -- 판매된 책 종류 수 (판매기록이 있는 book_id의 distinct 개수)
    COALESCE(COUNT(DISTINCT od.book_id), 0) AS sold_book_count,

    -- 전체 등록된 책 개수 (옵션)
    (SELECT COUNT(*) FROM book) AS total_book_count

FROM order_detail od
JOIN purchase_order po 
    ON po.order_id = od.order_id
    AND po.order_status = 'PAID';    

-- top5 가장 많이 팔린 책
CREATE VIEW top5_quantity_view AS
SELECT 
    b.book_id,
    b.title,
    b.image_url,
    SUM(od.quantity) AS total_quantity
FROM order_detail od
JOIN purchase_order po ON od.order_id = po.order_id
JOIN book b ON od.book_id = b.book_id
WHERE po.order_status = 'PAID'
GROUP BY b.book_id
ORDER BY total_quantity DESC
LIMIT 5;

-- 매출 top5
CREATE VIEW top5_revenue_view AS
SELECT 
    b.book_id,
    b.title,
    b.image_url,
    SUM(od.quantity * od.unit_price) AS total_revenue
FROM order_detail od
JOIN purchase_order po ON od.order_id = po.order_id
JOIN book b ON od.book_id = b.book_id
WHERE po.order_status = 'PAID'
GROUP BY b.book_id
ORDER BY total_revenue DESC
LIMIT 5;


-- drop view admin_booksales_detail_view;
CREATE VIEW admin_booksales_detail_view AS
SELECT 
    m.user_id,
    p.created_at,
    o.quantity,
    o.unit_price,
    o.book_id
FROM purchase_order p
LEFT JOIN member m ON m.member_id = p.member_id
LEFT JOIN order_detail o ON o.order_id = p.order_id;




