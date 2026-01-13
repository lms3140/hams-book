import { answerIcon, downArrowIcon, upArrowIcon } from "../common/Svgs.jsx";
import styles from "./FaQ.module.css";
import { useState } from "react";

export function FaQ() {
  //펼쳐진 질문
  const [openIndex, setOpenIndex] = useState(null);

  //질문 펼치기 토글
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      <h1 className={styles.title}>자주 묻는 질문</h1>
      <div className={styles.item}>
        <button
          className={styles.question}
          onClick={() => toggleFAQ(0)}
          aria-expanded={openIndex === 0}
        >
          <p>
            <span className={styles.q}>Q</span>검색이 되지 않거나 품절/절판인
            도서는 구입할 수 없나요?
          </p>
          <span className={styles.icon}>
            {openIndex === 0 ? upArrowIcon : downArrowIcon}
          </span>
        </button>

        <div
          className={`${styles.answerBox} ${
            openIndex === 0 ? styles.open : ""
          }`}
        >
          <div className={styles.arrow}>{answerIcon}</div>
          <div className={styles.answer}>
            <p>
              검색이 되지 않는 도서는 품절/절판일 경우가 대부분이므로 검색옵션
              중 [품절/절판상품 포함]란에 체크하신 후 한번 더 검색해보시기
              바랍니다.
            </p>
            <p>
              품절이나 절판으로 표시된 도서는 출판사에서도 더이상 발간하지 않고
              재고가 없는 경우가 대부분이라 구하기 어려운 도서입니다.
            </p>
            <p>
              이 경우 회원님게서 요청하셔도 구입시기를 확실하게 약속드릴 수
              없습니다.
            </p>
            <p>
              이러한 도서의 구입가능 여부를 확인하시려면 고객센터의 1:1 문의
              접수 이용하여 주시면, 최대한 확인하여 답변드리겠습니다.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.item}>
        <button
          className={styles.question}
          onClick={() => toggleFAQ(1)}
          aria-expanded={openIndex === 1}
        >
          <p>
            <span className={styles.q}>Q</span>eBook 선물하기란 무엇인가요?
          </p>
          <span className={styles.icon}>
            {openIndex === 1 ? upArrowIcon : downArrowIcon}
          </span>
        </button>

        <div
          className={`${styles.answerBox} ${
            openIndex === 1 ? styles.open : ""
          }`}
        >
          <div className={styles.arrow}>{answerIcon}</div>
          <div className={styles.answer}>
            <p>
              eBook선물하기는 햄스문고에서 판매하는 eBook(전자책)을 지인과
              친구들에게 선물 하실 수 있는 서비스 입니다. eBook선물하기 주문시
              입력한 휴대번호로 선물알림 (알림톡)이 발송되며, 선물받은 사람이
              선물등록시 컨텐츠를 다운로드 받을 수 있습니다.
            </p>
            <p>
              장바구니에서 선물주문을 하실 경우 <span>휴대폰, 이메일</span>로
              선물번호를 발송하실 수 있습니다. ※ 대여, 구매 모두 가능하며
              연재,시리즈 상품은 장바구니에서 최대 <span>100권</span>까지
              선물하실 수 있습니다.
            </p>
            <p>*eBook선물하기 주문방법</p>
            <p>- eBook상세페이지 선물하기 버튼클릭</p>
            <p>
              - eBook 장바구니에서 선물하기
              <span>
                *1회 주문시 <span>1권</span>이상 선물 주문방법
              </span>
            </p>
            <p>
              - eBook 장바구니에서 선물할 도서를 선택(단,학술논문 제외)후
              선물하기 클릭
            </p>
            <p>- 선물 받으시는 분 정보입력(휴대폰 또는 이메일)</p>
            <p>
              - 선물하기는 최대 100명까지 가능하며 주문 상품 수량에 따라 선택
              가능한 사람 수가 달라질 수 있습니다.
            </p>
            <p>
              ㅤㅤ예{")"}1회 주문의 경우 20권을 10명에게 200권 선물주문
              불가합니다. 20권을 5명에게 100권 선물주문 가능합니다.
            </p>
            <p>
              - 선물받은 eBook은 알림톡 및 이베일로 수신한 링크를 통해 확인
              가능합니다.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.item}>
        <button
          className={styles.question}
          onClick={() => toggleFAQ(2)}
          aria-expanded={openIndex === 2}
        >
          <p>
            <span className={styles.q}>Q</span>교보페이란 무엇인가요?
          </p>
          <span className={styles.icon}>
            {openIndex === 2 ? upArrowIcon : downArrowIcon}
          </span>
        </button>

        <div
          className={`${styles.answerBox} ${
            openIndex === 2 ? styles.open : ""
          }`}
        >
          <div className={styles.arrow}>{answerIcon}</div>
          <div className={styles.answer}>
            <p>
              햄스페이는 스마일페이 기반의 결제 서비스로 온라인햄스문고에서
              사용가능한 간편결제 서비스 입니다. 스마일페이 가입정보가 있을
              경우,햄스페이 이용약관 동의(1회 인증) 후 즉시 서비스 이용 가능
              합니다. 온라인 햄스문고 주문/결제 페이지에서 안전하고 간편한
              햄스페이를 이용 해 보세요.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.item}>
        <button
          className={styles.question}
          onClick={() => toggleFAQ(3)}
          aria-expanded={openIndex === 3}
        >
          <p>
            <span className={styles.q}>Q</span>해외주문도서를 주문하면 얼마 후에
            받아볼 수 있나요?
          </p>
          <span className={styles.icon}>
            {openIndex === 3 ? upArrowIcon : downArrowIcon}
          </span>
        </button>

        <div
          className={`${styles.answerBox} ${
            openIndex === 3 ? styles.open : ""
          }`}
        >
          <div className={styles.arrow}>{answerIcon}</div>
          <div className={styles.answer}>
            <p>
              1. <span>인터넷 주문가능 상태 주문접수 된 도서</span>는 결제가
              완료되는 즉시 해외거래처(B&T)로 자동발주 처리되어, 도서 입고까지
              업무일 기준 약 1-2주 정도 소요됩니다.
            </p>
            <p>
              2. <span>Special order</span> 는 4~6주 안에 공급가능하며, 현지
              출판사 사정에 의해 구입이 어려울 경우 2~3주 안에 공지해 드립니다.
            </p>
            <p>
              ※ 주말 또는 휴일에 주문하신 주문건들은 1-2일 정도 해외발주가
              지연되오니 양지해 주시기 바랍니다.
            </p>
            <p>
              또한 미국 내 현지 사정에 의해 도서 입고일이 지연될 수 있습니다 ex
              {")"}
              크리스마스, 추수감사절, 연휴 등
            </p>
          </div>
        </div>
      </div>

      <div className={styles.item}>
        <button
          className={styles.question}
          onClick={() => toggleFAQ(4)}
          aria-expanded={openIndex === 4}
        >
          <p>
            <span className={styles.q}>Q</span>주문하면 얼마 만에 받아볼 수
            있나요?
          </p>
          <span className={styles.icon}>
            {openIndex === 4 ? upArrowIcon : downArrowIcon}
          </span>
        </button>

        <div
          className={`${styles.answerBox} ${
            openIndex === 4 ? styles.open : ""
          }`}
        >
          <div className={styles.arrow}>{answerIcon}</div>
          <div className={styles.answer}>
            <p>
              <span>
                고객님께서 주문하신 상품을 실제 받으시는 날은 "예상출고일 +
                배송일"입니다.
              </span>
            </p>
            <p>
              <span>'예상출고일'</span>이란 근무일 기준으로 도서가 준비되는 시간
              만을 안내하는 것이며, 배송시간은 예상출고일 외 택배를 통해
              고객님께 실제 배달되는 기간을 말합니다.
            </p>
            <p>
              <span>'출고예정일'</span>은 상품에 따라 준비기간이 다르며 배송
              시간은 지역에 따라 약간씩 다르나 보통 1~3일정도 소요됩니다.
              (도서산간지역은 최대 7일 소요)
            </p>
            <p>
              * 예상출고일은 영업일 기준으로 산정되며, 일요일과 공휴일 및 기타
              휴무일에는 배송되지 않습니다. (우체국 배송은 토요일 휴무로 배송
              불가함)
            </p>
            <p>
              * 주문한 상품의 당사에 재고가 없을 때는 거래처로 다시 주문 요청한
              후 출고되므로 3∼7일내외 정도 더 소요됩니다.
            </p>
            <p>
              * 주문 완료 후 주소를 변경할 경우 배송 스케쥴이 변경될 수
              있습니다.
            </p>
            <p>
              * 천재지변 등의 불가항력적 사유로 인한 배송 지연은 그 해당기간
              동안의 배송소요 기간에서 제외됩니다.
            </p>
            <p>
              * 더 빠른 배송을 위해 주문하신 시간과 배송지역에 따라 새벽배송이
              적용될 수 있습니다.
            </p>
            <p>
              ▷ 새벽배송: 평일 12시 ~ 22시 이내에 완료된 주문건에 대해 익일 07시
              이전까지 배송
            </p>
            <p>
              (새벽배송은 택배사의 사정에 따라 서비스 가능 지역이 변경될 수
              있습니다.)
            </p>
          </div>
        </div>
      </div>

      <div className={styles.item}>
        <button
          className={styles.question}
          onClick={() => toggleFAQ(5)}
          aria-expanded={openIndex === 5}
        >
          <p>
            <span className={styles.q}>Q</span>주문상품이 언제 출고 되는지 알 수
            있나요?
          </p>
          <span className={styles.icon}>
            {openIndex === 5 ? upArrowIcon : downArrowIcon}
          </span>
        </button>

        <div
          className={`${styles.answerBox} ${
            openIndex === 5 ? styles.open : ""
          }`}
        >
          <div className={styles.arrow}>{answerIcon}</div>
          <div className={styles.answer}>
            <p>
              각 상품별 재고량을 기준으로 상세 상품정보에 예상출고일이
              표시됩니다.
            </p>
            <p>
              출고예정일이란, 주문상품의 결제(무통장입금의 경우 입금확인)가
              확인된 날 기준으로 상품을 준비하여 상품 포장 후 햄스문고
              물류센터에서 택배사로 전달하게 되는 예상 일자 입니다.
            </p>
            <p>
              배송일정은 예상출고일에 택배사의 배송일(약 2일)이 더해진 날이며
              연휴 및 토.일,공휴일을 제외한 근무일 기준입니다.
            </p>
            <p>
              다양한 상품을 함께 주문하실 경우 가장 늦은 출고일정에 맞춰 함께
              배송됩니다.
            </p>
            <p>
              *출고예정일이 5일 이상인 상품의 경우, 출판사/유통사 사정으로
              품/절판 되어 구입이 어려울 수 있습니다. 이 경우 SMS,메일로
              알려드립니다. 고객님께서 급하게 필요하신 상품은 별도로 주문하면
              받으시는 시간이 절약 됩니다.
            </p>
            <p>
              *
              <span>
                5~7일 이상이 소요되는 상품(해외개인주문도서 포함)의 경우 거래처
                사정에 따라 품절 또는 절판
              </span>
              될 수 있습니다. 준비가 되지 않는 경우에는 메일(또는 전화)로 별도
              연락 드리겠습니다.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.item}>
        <button
          className={styles.question}
          onClick={() => toggleFAQ(6)}
          aria-expanded={openIndex === 6}
        >
          <p>
            <span className={styles.q}>Q</span>주문한 상품이 아직 안왔어요.
          </p>
          <span className={styles.icon}>
            {openIndex === 6 ? upArrowIcon : downArrowIcon}
          </span>
        </button>

        <div
          className={`${styles.answerBox} ${
            openIndex === 6 ? styles.open : ""
          }`}
        >
          <div className={styles.arrow}>{answerIcon}</div>
          <div className={styles.answer}>
            <p>
              주문하신 도서를 아직 못받아 보셨다면 다음 사항을 확인해 주십시오.
            </p>
            <p>
              <span>
                1. 주문·배송 확인 시 상품의 처리상태가 포장완료로 되어 있는 경우
              </span>{" "}
              이 상품은 당사에서는 출고처리를 한 것입니다. 당사에서 출고처리가
              되었으나 2~3일 이내에 받아보시지 못한 경우는 다음을 확인하시기
              바랍니다.
            </p>
            <p>
              <span>
                2. 주문·배송 확인 시 상품의 처리상태가 품절/절판이라고 되어 있는
                경우
              </span>
              상품이 품절/절판인 경우에는 당사에 재고가 없으며, 거래처에서
              상품을 더 이상 취급하지 않기 때문에 보내드릴 수 없습니다.
            </p>
            <p>
              <span>3. 상품준비중 상태가 오래 지속될 경우</span> 주문/배송
              조회시 주문상태가 ‘상품준비중’ 단계로 남아 있다면 상품의 출고
              예정일을 확인해 주세요.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.item}>
        <button
          className={styles.question}
          onClick={() => toggleFAQ(7)}
          aria-expanded={openIndex === 7}
        >
          <p>
            <span className={styles.q}>Q</span>파본/훼손/오배송 된 상품을
            교환하고 싶습니다. 어떻게 해야하나요?
          </p>
          <span className={styles.icon}>
            {openIndex === 7 ? upArrowIcon : downArrowIcon}
          </span>
        </button>

        <div
          className={`${styles.answerBox} ${
            openIndex === 7 ? styles.open : ""
          }`}
        >
          <div className={styles.arrow}>{answerIcon}</div>
          <div className={styles.answer}>
            <p>
              일반 택배로 배송 받으신 상품에 하자가 있는 경우, 인터넷
              홈페이지에서 배송 완료일로 부터 30일 이내
              <span>마이 {">"} 주문/ 배송목록</span> {">"} 주문상세페이지 {">"}{" "}
              교환신청 가능합니다.
            </p>
            <p>
              장바구니에서 선물주문을 하실 경우 <span>휴대폰, 이메일</span>로
              선물번호를 발송하실 수 있습니다. ※ 대여, 구매 모두 가능하며
              연재,시리즈 상품은 장바구니에서 최대 <span>100권</span>까지
              선물하실 수 있습니다.
            </p>
            <p>
              ※ 배송완료 후 3개월 이내, 문제점 발견 후 30일이내 ※ 단, 우편/
              편의점택배 수령의 경우 회수주소지 정보에 일반 주소지 입력해 주시면
              일반택배로 맞교환 진행됩니다.
            </p>
            <p>
              고객센터 1:1상담에서 {"<"}파본/ 상품불량 신고{">"} 또는 {"<"}
              반품/교환/환불{">"} 상담에 주문번호와 내용을 기재하여 주십시오.
            </p>
            <p>
              <span>[반송주소]</span>
              <span>
                일반 택배 반품 시:(우편번호:10881) 경기도 파주시 문발로 249,
                햄스문고 A동 2층 인터넷반품담당자 앞
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.item}>
        <button
          className={styles.question}
          onClick={() => toggleFAQ(8)}
          aria-expanded={openIndex === 8}
        >
          <p>
            <span className={styles.q}>Q</span>상품의 재고를 확인할 수 있나요?
          </p>
          <span className={styles.icon}>
            {openIndex === 8 ? upArrowIcon : downArrowIcon}
          </span>
        </button>

        <div
          className={`${styles.answerBox} ${
            openIndex === 8 ? styles.open : ""
          }`}
        >
          <div className={styles.arrow}>{answerIcon}</div>
          <div className={styles.answer}>
            <p>
              모바일 앱이나 웹에서는 <span>도서</span>만 재고를 확인할 수
              있어요. <span>음반, DVD, 블루레이</span>는 <span>PC</span>에서만
              조회하실 수 있습니다.
            </p>
            <p>● 재고 확인 방법</p>
            <p>
              <span>[도서]</span> 상품 상세 {">"} 재고 조회
            </p>
            <p>
              <span>[문구류]</span> 재고 조회가 어렵습니다.
            </p>
            <p>
              <span>[음반/DVD/블루레이]</span> PC에서만 확인하실 수 있습니다.
            </p>
          </div>
        </div>

        <div className={styles.item}>
          <button
            className={styles.question}
            onClick={() => toggleFAQ(9)}
            aria-expanded={openIndex === 9}
          >
            <p>
              <span className={styles.q}>Q</span>주문/결제페이지에서
              [결제하기]를 누른 후 주문중으로 계속 표시될때
            </p>
            <span className={styles.icon}>
              {openIndex === 9 ? upArrowIcon : downArrowIcon}
            </span>
          </button>

          <div
            className={`${styles.answerBox} ${
              openIndex === 9 ? styles.open : ""
            }`}
          >
            <div className={styles.arrow}>{answerIcon}</div>
            <div className={styles.answer}>
              <p>
                결제창에서 오류가 발생하여 주문처리중 메세지가 계속 표시될 경우,
                [이전]화면으로 돌아가신 후 결제 재시도하여 주시기바랍니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
