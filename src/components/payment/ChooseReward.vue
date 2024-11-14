<template>
    <div class="progress-steps my-5">
        <div v-for="(step, index) in steps" :key="index" class="step-container">
            <div :class="['step-circle', { 'step-completed': index === 0, 'step-pending': index > 0 }]">
                {{ step }}
            </div>
            <div v-if="index < steps.length - 1" class="dashed-line"></div>
        </div>
    </div>

    <h5 class="text-start fw-bold">리워드 선택</h5>
    <div v-if="rewards.length">
        <div v-for="reward in rewards" :key="reward.rewardId" class="reward-item">
        <div class="reward-header">
            <input type="checkbox" :id="'reward-checkbox-' + reward.rewardId"
                v-model="selectedRewards[reward.rewardId].checked" @change="updateReward(reward.rewardId)" />
            <label :for="'reward-checkbox-' + reward.rewardId">{{ reward.rewardName }}</label>
        </div>
        <p>가격: {{ reward.price.toLocaleString() }}원</p>
        <p>배송비: {{ reward.deliveryFee.toLocaleString() }}원</p>
        <p>발송 시작일: {{ formatToKoreanDate(reward.deliveryStartDate) }}</p>

        <div v-if="selectedRewards[reward.rewardId].checked" class="quantity-input">
            <label :for="'quantity-' + reward.rewardId">수량:</label>
            <input type="number" :id="'quantity-' + reward.rewardId"
                v-model.number="selectedRewards[reward.rewardId].quantity" min="1" />
            <button class="btn btn-outline-secondary" @click="increaseQuantity(reward.rewardId)">+</button>
            <button class="btn btn-outline-secondary" @click="decreaseQuantity(reward.rewardId)">-</button>
        </div>
    </div>
    </div>
    <div v-else>
        <p>리워드가 없습니다.</p>
    </div>

    <h5 class="text-start fw-bold">후원금 더하기 (선택)</h5>
    <div class="donation-section">
        <p>후원금을 더하여 참여할 수 있습니다. 추가 후원금을 입력하시겠습니까?</p>
        <div class="d-flex align-items-center">
            <input type="number" placeholder="0" v-model.number="donationAmount" class="form-control me-2" />
            <span>원을 추가로 후원합니다.</span>
        </div>
    </div>

    <RouterLink :to="`/purchase/reserve/${id}`">
        <button type="button" class="btn btn-primary w-100 my-1" @click="saveToStore">다음 단계</button>
    </RouterLink>

    <!-- <h5 class="mt-4">결제 요약</h5>
    <p>총 리워드 금액: {{ totalRewardPrice.toLocaleString() }}원</p>
    <p>총 배송비: {{ totalDeliveryFee.toLocaleString() }}원</p>
    <p>총 추가 후원금: {{ donationAmount.toLocaleString() }}원</p>
    <p><strong>최종 결제 금액: {{ finalAmount.toLocaleString() }}원</strong></p> -->
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { usePurchaseStore } from '../../util/store/purchaseStore';

const props = defineProps(['id']); // props로 id 값을 받음

const rewards = ref([]);
const selectedRewards = ref([]);
const donationAmount = ref(0);
const route = useRoute();

const steps = ref(["리워드 선택", "결제 화면", "결제 완료"]);

// Pinia 스토어 인스턴스 (Setup Store 형태로 사용)
const purchaseStore = usePurchaseStore();

function formatToKoreanDate(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
}

// 서버에서 리워드 목록 가져오기
onMounted(async () => {
    const projectId = route.params.id;
    try {
        const response = await axios.get(`http://localhost:8080/api/reward-list/all/${projectId}`);
        console.log(response.data);
        rewards.value = response.data;

        // 초기 selectedRewards 배열 설정
        selectedRewards.value = rewards.value.reduce((acc, reward) => {
            acc[reward.rewardId] = {
                rewardId: reward.rewardId,
                price: reward.price,
                deliveryFee: reward.deliveryFee,
                checked: false,
                quantity: 1,
            };
            return acc;
        }, {});
    } catch (error) {
        console.error('리워드 목록 조회 실패:', error);
    }
});

// 선택된 리워드 업데이트
function updateReward(rewardId) {
    const reward = selectedRewards.value[rewardId];
    if (!reward.checked) {
        reward.quantity = 0; // 체크 해제 시 수량 0
    } else {
        reward.quantity = 1; // 체크 시 기본 수량 1
    }
}

// 총 리워드 금액 계산
const totalRewardPrice = computed(() =>
    Object.values(selectedRewards.value).reduce((sum, reward) => {
        if (reward.checked) {
            return sum + reward.price * reward.quantity;
        }
        return sum;
    }, 0)
);

// 총 배송비 계산
const totalDeliveryFee = computed(() =>
    Object.values(selectedRewards.value).reduce((maxFee, reward) => {
        if (reward.checked) {
            return Math.max(maxFee, reward.deliveryFee);
        }
        return maxFee;
    }, 0)
);

// 최종 결제 금액 계산
const finalAmount = computed(() => {
    return totalRewardPrice.value + totalDeliveryFee.value + donationAmount.value;
});

// 수량 증가 함수
function increaseQuantity(rewardId) {
    selectedRewards.value[rewardId].quantity++;
}

// 수량 감소 함수 (최소 1 보장)
function decreaseQuantity(rewardId) {
    if (selectedRewards.value[rewardId].quantity > 1) {
        selectedRewards.value[rewardId].quantity--;
    }
}

// Pinia 스토어에 저장
function saveToStore() {
    const selectedRewardsData = Object.values(selectedRewards.value).filter(reward => reward.checked);
    const totalRewardPrice = selectedRewardsData.reduce((total, reward) => total + reward.price * reward.quantity, 0);

    purchaseStore.setPurchaseDetails(
        selectedRewardsData,
        totalRewardPrice,
        donationAmount.value
    );
}
</script>

<style scoped>
.reward-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px 0;
    border-radius: 5px;
}

.progress-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: normal;
    /* 일반적인 줄바꿈 허용 */
    word-break: keep-all;
    /* 단어 단위로 줄바꿈 */
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
}

.step-completed {
    background-color: #4db4d7;
    /* Example color for completed step */
}

.step-pending {
    background-color: #e9ecef;
}

.dashed-line {
    border-top: 2px dashed #000000;
    width: 80px;
    margin: 0 10px;
    /* 필요시 약간의 여백을 추가 */
}

.donation-section {
    text-align: left;
    margin-top: 10px;
}

.donation-section p {
    margin-bottom: 8px;
    color: #333;
    font-size: 0.9rem;
}

.donation-section input {
    width: 80px;
    text-align: left;
}

.donation-section span {
    font-size: 0.9rem;
}

.reward-item {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
}

.quantity-input {
    margin-top: 10px;
}

.summary {
    border-top: 2px solid #ddd;
    padding-top: 10px;
}
</style>
