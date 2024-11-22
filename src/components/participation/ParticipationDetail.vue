<template>
    <div class="participation-detail-container">
        <!-- 기본 정보 -->
        <div class="project-info">

        </div>

        <!-- 결제 예약 정보 -->
        <div v-if="paymentDetails" class="reservation-info">
            <div class="text-start">
                <span>
                    {{ paymentDetails.mainCategory }} / {{ paymentDetails.subCategory }}
                </span>
            </div>
            <div class="text-start">
                <span class="status-dot"></span>
                <span>{{ status }}</span>
            </div>
            <!-- <h4 class="fw-bold text-start">{{ paymentDetails.value.funding.fundingTitle }}</h4>
            <p class="text-start">by {{ paymentDetails.value.funding.makerNick }}</p> -->
            <div class="info-container">
                <div class="info-labels">
                    <p>결제 번호</p>
                    <p>참여일</p>
                    <p>종료일</p>
                    <p>결제 상태</p>
                </div>
                <div class="info-values">
                    <p>{{ paymentDetails.paymentId }}</p>
                    <p>{{ formatDate(paymentDetails.paymentDate) }}</p>
                    <p>{{ formatDate(paymentDetails.fundingEndDate) }}</p>
                    <p>
                        {{ paymentDetails.paymentStatus }}
                        <span v-if="paymentDetails.paymentStatus === 'complete'">
                            ({{ getRefundStatus(paymentDetails.fundingEndDate) }})
                        </span>
                    </p>
                </div>
            </div>

            <!-- 결제 예약 취소 버튼 -->
            <button v-if="(paymentDetails.paymentStatus !== 'refund' && paymentDetails.paymentStatus !== 'failed')
                && isRefundEligible(paymentDetails.fundingEndDate)" class="change-button"
                @click="openCancelModal(paymentDetails.paymentId)">
                결제 예약 취소
            </button>

            <!-- 모달 컴포넌트 -->
            <ModalConfirm v-show="showCancelModal" :show="showCancelModal" :payment-id="collectedPaymentId"
                :calculated-amount="calculateNetAmount()" title="결제를 취소하시겠어요?"
                message="리워드 옵션 변경을 원한다면 결제를 취소하지 않고 참여 내역에서 변경 가능해요." @close="closeCancelModal"
                @confirm="cancelReservation" />

            <div v-if="paymentDetails.paymentStatus !== 'refund' && paymentDetails.paymentStatus !== 'failed'"
                class="notice">
                <h6 class="fw-bold text-start">결제 예약 유의 사항</h6>
                <p class="reservation-notice">
                    - 프로젝트 참여 즉시 결제되며, 결제 취소는 프로젝트 종료 시점인 {{ formatDate(paymentDetails.fundingEndDate) }}까지 가능합니다.
                </p>
            </div>

        </div>

        <!-- 리워드 정보 -->
        <div v-if="paymentDetails" class="reward-info">
            <h3 class="text-start fw-bold">리워드 정보</h3>
            <br />
            <div v-for="reward in (paymentDetails.rewards || [])" :key="reward.rewardId" class="reward-list">
                <h6 class="fw-bold text-start">{{ reward.rewardName }}</h6>
                <hr />
                <p class="reward-price">{{ reward.price }}원 / {{ reward.count }}개</p>
                <p>발송 시작 : {{ formatDate(reward.deliveryStartDate) }} 예정</p>
            </div>
            <p class="reward-notice">
                * 프로젝트 환불 정책 <br />
                - 프로젝트 기간동안 환불이 가능하며, 프로젝트 기간이 지난 후에는 환불이 불가능합니다. &gt;
            </p>
        </div>

        <!-- 결제 내역 -->
        <div v-if="paymentDetails" class="payment-summary">
            <h6 class="fw-bold">결제 내역</h6>
            <br />
            <div class="payment-info">
                <div class="info-labels">
                    <p>리워드 금액</p>
                    <p>쿠폰 차감금액</p>
                    <p>포인트 차감금액</p>
                    <p>추가 후원금</p>
                    <p>배송비</p>
                </div>
                <div class="info-values">
                    <p>{{ calculateTotalRewardPrice() }}원</p>
                    <p>- {{ calculateDiscountPrice() }}원</p>
                    <p>- 0원</p>
                    <!-- <p>{{ paymentDetails.amount + calculateDiscountPrice() - calculateTotalRewardPrice() - getMaxDeliveryFee() }}원</p> -->
                    <p>{{ AdditionalFunding() }}원</p>
                    <p>{{ getMaxDeliveryFee() }}원</p>
                </div>
            </div>
            <div class="final-amount">
                <p>최종 결제 금액</p>
                <p class="amount-value">{{ paymentDetails.amount }}원</p>
            </div>
        </div>

        <!-- 결제 정보 -->
        <div v-if="paymentDetails" class="payment-details">
            <h6 class="fw-bold">결제 정보</h6>
            <br />
            <div class="payment-info">
                <div class="info-labels">
                    <p>결제방법</p>
                    <p>카드번호</p>
                    <p>할부기간</p>
                </div>
                <div class="info-values">
                    <p>{{ isCreditCard() }}</p>
                    <p>{{ paymentDetails.cardNumber }}</p>
                    <p>일시불</p>
                </div>
            </div>
        </div>

        <!-- 배송지 정보 -->
        <div v-if="paymentDetails" class="shipping-info">
            <h3>배송지 정보</h3>
            <div class="shipping-details">
                <div class="info-labels">
                    <p>받는 분</p>
                    <p>연락처</p>
                    <p>주소</p>
                    <p>배송 시 요청사항</p>
                </div>
                <div class="info-values">
                    <p>{{ paymentDetails.receiverName }}</p>
                    <p>{{ paymentDetails.phoneNum }}</p>
                    <p>[{{ paymentDetails.address.zonecode }}] {{ paymentDetails.address.addr }} {{
                        paymentDetails.address.extraAddr }} {{ paymentDetails.address.detailAddr }}</p>
                    <p>{{ paymentDetails.deliveryRequest }}</p>
                </div>
            </div>
            <p class="policy">
                리워드 발송은 메이커의 의무로 프로젝트 진행 시 메이커가 약속한 리워드 발송 시각에 제공하는 것을 원칙으로 합니다.
                다만 메이커의 예기치 못한 일정 변경이 있을 수 있으며,
                리워드 발송에 대해 발생한 이슈는 프로젝트 상세 페이지 - 환불・정책 탭에 명시한 정책을 따릅니다.
            </p>
            <div class="footer-notice">
                <button class="back-button">
                    <router-link to="/mywadiz/supporter/participation">목록으로 돌아가기</router-link>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import ModalConfirm from './participationComponents/ModalConfirm.vue';
import { useRouter, useRoute } from 'vue-router';
import apiWrapper from '../../util/axios/axios';
import { useAuthStore } from '../../util/store/authStore';

const router = useRouter();
const showCancelModal = ref(false);
const collectedPaymentId = ref(null);

const route = useRoute();
const status = route.query.status;
const paymentId = ref(route.params.id); // URL에서 Payment의 id 값을 가져오기

console.log('현재 결제 ID:', paymentId.value); // 디버깅용 로그

const authStore = useAuthStore();
const paymentDetails = ref(null);

function openCancelModal(paymentId) {
    collectedPaymentId.value = paymentId;
    showCancelModal.value = true;
}

function closeCancelModal() {
    showCancelModal.value = false;
}

function cancelReservation({ paymentId, cancelResponse, response }) {
    // 결제 예약 취소 로직 추가
    console.log('결제 취소 확인:', paymentId);
    console.log('취소 응답 데이터:', cancelResponse);
    console.log('Funding 업데이트 응답:', response);

    if (response.status === 200) {
        alert('결제가 성공적으로 취소되었습니다.');
    } else {
        alert('결제 취소 후 문제가 발생했습니다.');
    }

    console.log("결제 예약 취소됨");
    console.log('취소할 Payment ID:', collectedPaymentId.value);
    showCancelModal.value = false; // 모달 닫기
    router.push('/mywadiz/supporter/participation');   // '/participate'로 라우팅
}

function formatDate(dateString) {
    if (!dateString) return '날짜 정보 없음';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
}

// 환불 상태를 결정하는 함수
function getRefundStatus(fundingEndDate) {
    const now = new Date();
    const endDate = new Date(fundingEndDate);

    return now < endDate ? '환불 가능' : '환불 불가능';

    // ISO 8601 형식의 날짜를 Date 객체로 변환
    // const endDate = new Date(fundingEndDate);
    // const now = new Date();

    // // 날짜 변환 유효성 검증
    // if (isNaN(endDate.getTime())) {
    //     console.error("Invalid fundingEndDate:", fundingEndDate);
    //     return "날짜 오류";
    // }

    // // 종료일로부터 14일 후 계산
    // const refundDeadline = new Date(endDate);
    // refundDeadline.setDate(endDate.getDate() + 14);

    // if (now < endDate) {
    //     return "환불 가능 (진행 중)";
    // } else if (now >= endDate && now <= refundDeadline) {
    //     return "환불 가능 (14일 이내)";
    // } else {
    //     return "환불 불가능 (14일 초과)";
    // }
}

function isRefundEligible(fundingEndDate) {
    // const now = new Date();
    // const endDate = new Date(fundingEndDate);

    // // 종료일로부터 14일 후 계산
    // const refundDeadline = new Date(endDate);
    // refundDeadline.setDate(endDate.getDate() + 14);

    // // 현재 날짜가 종료일과 환불 마감일 사이에 있는지 확인
    // return now <= refundDeadline;
    console.log('This is', fundingEndDate)

    const now = new Date(); // 현재 날짜
    const endDate = new Date(fundingEndDate); // 종료일을 Date 객체로 변환

    // 종료일이 유효한지 확인
    if (isNaN(endDate)) {
        console.error("유효하지 않은 종료일:", fundingEndDate);
        return false;
    }

    const refundDeadline = new Date(endDate);
    refundDeadline.setDate(endDate.getDate()); // 종료일로부터 14일 후 계산

    return now <= refundDeadline;;
}

// 리워드 총 금액 계산
const calculateTotalRewardPrice = () => {
    if (!paymentDetails.value || !paymentDetails.value.rewards) return 0;

    return paymentDetails.value.rewards.reduce((total, reward) => {
        return total + (reward.price * reward.count); // 리워드 가격 * 수량
    }, 0);
};

// 할인 금액 계산
const calculateDiscountPrice = () => {
    return calculateTotalRewardPrice() * paymentDetails.value.discountRate / 100;
}

// 최대 배송비 계산
const getMaxDeliveryFee = () => {
    if (!paymentDetails.value || !paymentDetails.value.rewards) return 0;

    return Math.max(...paymentDetails.value.rewards.map(reward => reward.deliveryFee), 0);
};

// 펀딩에서 빠져나가는 돈 계산
const calculateNetAmount = () => {
    const rewardTotal = calculateTotalRewardPrice(); // 리워드 금액
    const donation = AdditionalFunding();           // 추가 후원금
    const discount = calculateDiscountPrice();      // 쿠폰 할인

    return rewardTotal + donation - discount;
};

// 추가 후원금 계산
const AdditionalFunding = () => {
    return paymentDetails.value.amount + calculateDiscountPrice() - calculateTotalRewardPrice() - getMaxDeliveryFee()
}

// 신용카드 여부 확인
const isCreditCard = () => {
    if (paymentDetails.value.methodType === 'card' || paymentDetails.value.methodType === 'CARD') {
        return '신용(체크)카드';
    } else {
        return '기타';
    }
}

async function fetchPaymentDetails(paymentId) {
    try {
        const token = authStore.getJwtToken(); // JWT 토큰 가져오기
        if (!token) {
            console.warn('JWT 토큰이 없습니다.');
            return;
        }

        const response = await apiWrapper.getData(`/api/payment/${paymentId}/details`);
        console.log('API Response:', response); // API 응답 확인
        paymentDetails.value = response;
        console.log('Fetched Payment Details 1:', paymentDetails.value);
    } catch (error) {
        console.error('Error fetching payment details:', error);
        paymentDetails.value = null; // 실패 시 초기화
    }
}

// route.params.id 변경 시 fetch 다시 호출
watch(() => route.params.id, async (newId) => {
    await fetchPaymentDetails(newId);
    console.log('Fetched Payment Details after route change:', paymentDetails.value);
});

// 처음 mount 시 fetch 호출
onMounted(async () => {
    await fetchPaymentDetails(route.params.id);
    console.log('Fetched Payment Details:', paymentDetails.value);
});
</script>

<style scoped>
/* 모달 오버레이 스타일 */
.shipping-details {
    display: flex;
    /* 가로 정렬을 위해 flexbox 사용 */
    gap: 20px;
    /* 라벨과 값 사이 간격 추가 */
}

.info-labels,
.info-values {
    flex: 1;
    /* 각 요소가 동일한 비율로 공간 차지 */
}

.info-labels p,
.info-values p {
    margin: 5px 0;
    /* 각 줄 사이의 간격 */
    word-break: break-word;
    /* 긴 텍스트 줄 바꿈 */
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* 모달 박스 스타일 */
.modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    max-height: 200px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    display: block;
    /* 모달을 화면에 표시 */
    position: relative;
    /* 기본 위치 */
    z-index: 1010;
}

.modal h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
}

.modal p {
    font-size: 14px;
    color: #666;
    margin-bottom: 20px;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.modal-buttons .btn {
    width: 45%;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
}

.modal-buttons .btn-secondary {
    background-color: #f1f1f1;
    color: #333;
    border: 1px solid #ccc;
}

.modal-buttons .btn-primary {
    background-color: #0c8;
    color: white;
    border: none;
}

.participation-detail-container {
    max-width: 800px;
    border-radius: 10px;
    padding: 20px;
    margin: 20px auto;
}

.reward-list {
    margin-bottom: 1%;
}

.reservation-info,
.reward-info,
.payment-summary,
.payment-details,
.shipping-info {
    background-color: #fff;
    padding: 5%;
    margin: 3%;
    text-align: start;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
    justify-content: center;
    display: flex;
    /* 플렉스박스로 설정 */
    justify-content: center;
    /* 가운데 정렬 */
    align-items: center;
    /* 세로축 중앙 정렬 */
}

/* 부모 컨테이너에 대해 설정하려면: */
.footer-notice {
    display: flex;
    justify-content: center;
    /* 가로로 가운데 정렬 */
    align-items: center;
    /* 세로로 가운데 정렬 */
    flex-direction: column;
    /* 세로 정렬 */
    padding: 20px;
}

.policy {
    background-color: #f3f4f6;
    width: 100%;
    margin-top: 2%;
}
</style>