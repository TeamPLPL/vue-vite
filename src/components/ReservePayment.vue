<template>
    <div class="progress-steps my-5">
        <div v-for="(step, index) in steps" :key="index" class="step-container">
            <div :class="['step-circle', { 'step-completed': index === 1, 'step-pending': index !== 1 }]">
                {{ step }}
            </div>
            <div v-if="index < steps.length - 1" class="dashed-line"></div>
        </div>
    </div>

    <h5 class="text-primary text-start">[슈퍼얼리버드] 에브리봇 침구 로봇청소기</h5>
    <h6 class="text-start">제품구성 : 로봇 본체 + 먼지동 + USB 케이블</h6>

    <div class="mt-3 d-flex">
        <h6>수량: {{ quantity }}개</h6>
        &nbsp;&nbsp;
        <h6>{{ totalPrice.toLocaleString() }}원</h6>
    </div>
    <h6 class="text-start">후원금 추가: {{ donationAmount.toLocaleString() }}원</h6>
    <h2 class="text-start">결제 예약 금액</h2>
    <h4>리워드 금액 {{ totalPrice.toLocaleString() }} 원</h4>
    <h4>추가 후원금 {{ donationAmount.toLocaleString() }} 원</h4>
    <h3>총 결제금액 {{ wholePrice.toLocaleString() }} 원</h3>

    <h2 class="text-start">리워드 배송지</h2>
    <div class="align-content-start">
        <label>이름</label>
        <input type="text">
        <br />
        <label>전화번호</label>
        <input type="text">
        <br />
        <label>주소</label>
        <input type="text">
        <br />
        <label>배송시 요청사항(선택)</label>
        <input type="text">
    </div>

    <h2 class="text-start">지금 결제</h2>
    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
        <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio1">네이버페이</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio2">카카오페이</label>

        <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
        <label class="btn btn-outline-primary" for="btnradio3">신용/체크카드</label>
    </div>
    

    <RouterLink to="/web/wpurchase/reward/step10">
        <button type="button" class="btn btn-primary w-100 my-1">이전 단계</button>
    </RouterLink>
    <RouterLink to="/web/wpurchase/reward/step20">
        <button @click="clientAuth" class="btn btn-primary w-100 my-1">clientAuth 결제하기</button>
    </RouterLink>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePurchaseStore } from '../util/store/purchaseStore'; // Pinia 스토어 import
import { RouterLink } from 'vue-router';

const steps = ref(["리워드 선택", "결제 예약", "소문내기"]);

// Pinia 스토어 사용
const purchaseStore = usePurchaseStore();
const quantity = purchaseStore.quantity;
const totalPrice = purchaseStore.totalPrice;
const donationAmount = purchaseStore.donationAmount;

const wholePrice = computed(() => purchaseStore.totalPrice + purchaseStore.donationAmount);



function clientAuth() {
    AUTHNICE.requestPay({
        clientId: '{my-client-id}', 
        method: 'card',
        orderId: 'test_1031_0000',
        amount: 1004,
        goodsName: '나이스페이-상품',
        returnUrl: 'http://localhost:5173/web/wpurchase/reward/step20'
    },

    // 결제 성공 콜백 함수
    function onSuccess(response) {
        console.log("결제 성공:", response);
    },

    // 결제 실패 콜백 함수
    function onFailure(error) {
        console.log("결제 실패:", error);
    },

    function fnError(error) { // 필수 에러 핸들링 콜백
        console.error("결제 중 에러 발생:", error);
    });
}

// 스크립트를 동적으로 로드하는 함수
function loadScript(url, id) {
    return new Promise((resolve, reject) => {
        // 중복 로드 방지
        if (document.getElementById(id)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = url;
        script.id = id;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

onMounted(async () => {
    try {
        await loadScript("https://pay.nicepay.co.kr/v1/js/", "nicepay-script");
        // 추가적인 스크립트를 로드하려면 같은 방식으로 호출
    } catch (error) {
        console.error("Script loading failed:", error);
    }
});
</script>

<style scoped>
.progress-steps {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.step-container {
    display: flex;
    align-items: center;
}
.step-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
    margin-right: 10px;
}
.step-completed {
    background-color: #4db4d7; /* Example color for completed step */
}
.step-pending {
    background-color: #e9ecef;
}
.dashed-line {
    width: 130px; /* 원하는 길이로 설정 */
    border-top: 2px dashed #000000;
    margin-right: 10px;
}
</style>
