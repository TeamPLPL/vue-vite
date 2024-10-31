<template>
    <div class="progress-steps my-5">
        <div v-for="(step, index) in steps" :key="index" class="step-container">
            <div :class="['step-circle', { 'step-completed': index === 0, 'step-pending': index > 0 }]">
                {{ step }}
            </div>
            <div v-if="index < steps.length - 1" class="dashed-line"></div>
        </div>
    </div>

    <h2 class="text-start">리워드 선택</h2>
    <div class="card">
        <div class="card-body">
            <div class="d-flex align-items-center mb-2">
                <input v-model="isChecked" class="form-check-input custom-checkbox" type="checkbox" id="checkboxNoLabel" value="" aria-label="...">
                <h3 class="mb-0 ms-2">{{ unitPrice.toLocaleString() }}원</h3>
            </div>
            <h4 class="card-title">[슈퍼얼리버드] 에브리봇 침구 로봇청소기</h4>
            <div class="d-flex">
                <h5>제한수량 300개</h5>
                &nbsp;&nbsp;
                <h5 class="text-primary">25개 남음</h5>
            </div>
            <br />
            <h5 class="text-start">제품구성 : 로봇 본체 + 먼지동 + USB 케이블</h5>
            <div class="d-flex">
                <img src="../assets/truck.svg">
                &nbsp;&nbsp;
                <h6 class="mb-0">무료배송 - 2024년 12월 15~25일 중으로 리워드 제공 예정</h6>
            </div>
            <!-- 체크박스가 선택된 경우에만 표시되는 개수 조절 섹션 -->
            <div v-if="isChecked" class="mt-3 position-relative">
                <label class="form-label text-start w-100">수량 선택</label>
                <button type="button" class="btn-close position-absolute top-0 end-0" aria-label="Close" @click="closeQuantitySelection"></button>
                
                <div class="input-group mb-3">
                    <button class="btn btn-outline-secondary" type="button" @click="decreaseQuantity">-</button>
                    <input type="text" class="form-control text-center" :value="quantity" readonly>
                    <button class="btn btn-outline-secondary" type="button" @click="increaseQuantity">+</button>
                </div>
                <h5 class="text-start mt-2">총 가격: {{ totalPrice.toLocaleString() }}원</h5>
            </div>
        </div>
    </div>

    <h2 class="text-start">후원금 더하기 (선택)</h2>
    <div class="d-flex">
        <input type="number" placeholder="0" v-model.number="donationAmount">
        <h6 class="mb-0">원을 추가로 후원합니다.</h6>
    </div>

    <RouterLink to="/web/wpurchase/reward/step20">
        <button type="button" class="btn btn-primary w-100 my-1" @click="saveToStore">다음 단계</button>
    </RouterLink>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePurchaseStore } from '../util/store/purchaseStore';

const steps = ref(["리워드 선택", "결제 예약", "소문내기"]);
const isChecked = ref(false); // 체크박스 상태를 관리하는 변수
const quantity = ref(1); // 초기 수량 설정
const unitPrice = ref(248000); // 단가 설정
const donationAmount = ref(0); // 후원금 입력값

// Pinia 스토어 인스턴스 (Setup Store 형태로 사용)
const purchaseStore = usePurchaseStore();

// 총 가격 계산
const totalPrice = computed(() => quantity.value * unitPrice.value);

// 수량 증가 함수
function increaseQuantity() {
    quantity.value++;
}

// 수량 감소 함수 (최소 수량 1로 설정)
function decreaseQuantity() {
    if (quantity.value > 1) {
        quantity.value--;
    }
}

// 수량 선택 창 닫기 함수
function closeQuantitySelection() {
    isChecked.value = false;
}

// Pinia 스토어에 총 가격, 후원금, 수량 저장
function saveToStore() {
    purchaseStore.setPurchaseDetails(totalPrice.value, donationAmount.value, quantity.value);
}
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
