<template>
    <div class="participation-detail-container">
        <!-- 기본 정보 -->
        <div class="project-info">

        </div>

        <!-- 결제 예약 정보 -->
        <div class="reservation-info">
            <div class="text-start">
                <span>{{ category }} / {{ subcategory }}</span>
            </div>
            <div class="text-start">
                <span class="status-dot"></span>
                <span>{{ status }}</span>
            </div>
            <h4 class="fw-bold text-start">{{ title }}</h4>
            <p class="text-start">by {{ author }}</p>
            <div class="info-container">
                <div class="info-labels">
                    <p>결제 번호</p>
                    <p>참여일</p>
                    <p>종료일</p>
                    <p>결제 상태</p>
                </div>
                <div class="info-values">
                    <p>{{ paymentId }}</p>
                    <p>{{ date }}</p>
                    <p>{{ endDate }}</p>
                    <p>{{ paymentStatus }}</p>
                </div>
            </div>
            <button class="change-button">결제 예약 취소</button>

            <div class="notice">
                <h6 class="fw-bold text-start">결제 예약 유의 사항</h6>
                <p class="reservation-notice">
                    - 프로젝트 종료 후 2024.11.24 17시에 결제되며, 한도초과 등으로 인한 결제 실패 시 다음날 17시에 결제됩니다.(총 2회 결제 진행)
                    <br />
                    - 리워드 옵션 변경과 결제 취소는 프로젝트 종료일인 2024.11.23까지 가능합니다.
                </p>
            </div>

        </div>

        <!-- 리워드 정보 -->
        <div class="reward-info">
            <h6 class="text-start">리워드 정보</h6>
            <h6 class="fw-bold text-start">[얼리버드] F5 리미티드 에디션 단품</h6>
            <p class="reward-subtitle">23% 할인기여금 / 1,580단위 F5 리미티드 에디션 *1</p>
            <p class="reward-price">37,600원 / 1개</p>
            <p class="reward-date">발송 시작일: 2024년 12월 중순 (11~20일) 예정</p>
            <p class="reward-notice">
                * 프로젝트 교환 · 환불 · A/S 정책은 펀딩 · 정책을 확인하세요. <br />
                프로젝트 환불 * 정책 바로가기 &gt;
            </p>
        </div>

        <!-- 결제 내역 -->
        <div class="payment-summary">
            <h6>결제 내역</h6>
            <div class="payment-info">
                <div class="info-labels">
                    <p>리워드 금액</p>
                    <p>쿠폰 차감금액</p>
                    <p>포인트 차감금액</p>
                    <p>추가 후원금</p>
                    <p>배송비</p>
                </div>
                <div class="info-values">
                    <p>37,600원</p>
                    <p>- 0원</p>
                    <p>- 0원</p>
                    <p>0원</p>
                    <p>3,000원</p>
                </div>
            </div>
            <div class="final-amount">
                <p>최종 결제 금액</p>
                <p class="amount-value">40,600원</p>
            </div>
        </div>

        <!-- 결제 정보 -->
        <div class="payment-details">
            <h6>결제 정보</h6>
            <div class="payment-info">
                <div class="info-labels">
                    <p>결제방법</p>
                    <p>카드번호</p>
                    <p>할부기간</p>
                </div>
                <div class="info-values">
                    <p>신용(체크)카드</p>
                    <p>************7071</p>
                    <p>일시불</p>
                </div>
            </div>
            <button class="change-button">결제 정보 변경하기</button>
        </div>

        <div>
            <p class="payment-notice">
                결제 정보 및 할부 변경은 펀딩 종료일 전날 2024.11.24 16시 30분까지 가능합니다.
            </p>
        </div>

        <!-- 배송지 정보 -->
        <div class="shipping-info">
            <h3>배송지 정보</h3>
            <div class="shipping-details">
                <div class="info-labels">
                    <p>받는 분</p>
                    <p>연락처</p>
                    <p>주소</p>
                    <p>배송 시 요청사항</p>
                </div>
                <div class="info-values">
                    <p>홍엽</p>
                    <p>010-8108-6648</p>
                    <p>[11520] 경기 양주시 장흥면 호국로123번길 36-17 (일영리, 스타빌) 103동 401호</p>
                    <input type="text" placeholder="요청 사항을 입력하세요" />
                </div>
            </div>
            <button class="change-button">배송지 정보 변경하기</button>

            <div class="shipping-notice">
                <p>
                    프로젝트 종료 이후에는 서포터의 배송지 정보가 메이커에게 전달되기 때문에 종료 이후 배송 정보 변경 등에 대한 문의는 메이커에게 직접 해야 합니다.
                </p>
                <button class="inquiry-button">메이커에게 문의하기</button>
            </div>


        </div>
        <!-- 하단 안내 사항 -->
        <div class="footer-notice">
            <p class="policy">
                리워드 발송은 메이커의 의무로 프로젝트 진행 시 메이커가 약속한 리워드 발송 시각에 제공하는 것을 원칙으로 합니다.
                다만 메이커의 예기치 못한 일정 변경이 있을 수 있으며,
                리워드 발송에 대해 발생한 이슈는 프로젝트 상세 페이지 - 환불・정책 탭에 명시한 정책을 따릅니다.
            </p>
            <button class="back-button">
                <router-link to="/participation">목록으로 돌아가기</router-link>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// 기본 데이터
const category = ref("프리오더");
const subcategory = ref("푸드>음료>커피");
const date = ref("2024.11.05 21:49");
const status = ref("진행중");
const title = ref("머신도 필요 없는 세상에서 가장 작은 바리스타 | 8가지 풍미 <F5 커피>");
const author = ref("디에이치알");

const paymentId = ref("13344846");
const endDate = ref("2024.11.23");
const paymentStatus = ref("결제 예약");
</script>

<style scoped>
.participation-detail-container {
    max-width: 800px;
    border-radius: 10px;
    padding: 20px;
    margin: 20px auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.reservation-info,
.reward-info,
.payment-summary,
.payment-details,
.shipping-info,
.footer-notice {
    background-color: #fff;
    padding: 5%;
    margin: 3%;
    text-align: start;
}

.notice {
    padding: 5%;
    background-color: #f3f4f6;
}

.payment-notice {
    margin-left: 5%;
    background-color: #f3f4f6;
    text-align: start;
}

.shipping-notice {
    padding: 1%;
    background-color: #f3f4f6;
    text-align: start;
}

.footer-notice {
    padding: 5%;
    background-color: white;
    text-align: start;
    display: flex;
    flex-direction: column;
    align-items: center; /* back-button을 가운데 배치 */
}

.payment-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
}

.reservation-info {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
}

.info-container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
}

.info-labels {
    text-align: left;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* 높이 맞추기 위해 추가 */
}

.info-values {
    text-align: right;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    /* 높이 맞추기 위해 추가 */
}

.change-button {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    color: #e6e6e6;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    background-color: transparent;
    cursor: pointer;
    text-align: center;
}

.reservation-notice {
    text-align: start;
}

.title {
    font-size: 24px;
    font-weight: bold;
    margin: 20px 0;
}

.info-labels,
.info-values {
    display: flex;
    flex-direction: column;
}

.change-button,
.inquiry-button {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    color: #0c8;
    border: 1px solid #0c8;
    border-radius: 5px;
    background-color: transparent;
    cursor: pointer;
    text-align: center;
    margin-top: 10px;
}

.final-amount {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    font-weight: bold;
}

.back-button {
    background-color: white;
    border: #ada8a8 1px solid;
    padding: 10px 20px;
    margin-top: 20px;
    cursor: pointer;
    text-align: center;
    border-radius: 5px;
}

.policy {
    background-color: #f3f4f6;
}
</style>