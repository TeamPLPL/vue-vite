<template>
    <div class="mb-4">
        <div class="progress-steps my-5">
            <div v-for="(step, index) in steps" :key="index" class="step-container">
                <div :class="['step-circle', { 'step-completed': index === 0, 'step-pending': index > 0 }]">
                    {{ step }}
                </div>
                <div v-if="index < steps.length - 1" class="dashed-line"></div>
            </div>
        </div>

        <h5 class="text-start fw-bold">리워드 선택</h5>
        <div v-if="selectedRewards.length">
            <div v-for="reward in selectedRewards" :key="reward.rewardId" class="reward-item">
                <div class="reward-header">
                    <h6>{{ reward.rewardName }}</h6>
                </div>
                <!-- <p>가격: {{ reward.price.toLocaleString() }}원</p> -->
                <p v-if="reward.price">가격: {{ reward.price.toLocaleString() }}원</p>
                <p>발송 시작일: {{ formatToKoreanDate(reward.deliveryStartDate) }}</p>
                <div class="quantity-input">
                    <label :for="'quantity-' + reward.rewardId">수량:</label>
                    <input type="number" :id="'quantity-' + reward.rewardId" v-model.number="reward.quantity" min="1" />
                    <button class="btn btn-outline-secondary" @click="decreaseQuantity(reward.rewardId)">-</button>
                    <button class="btn btn-outline-secondary" @click="increaseQuantity(reward.rewardId)">+</button>
                </div>
            </div>
            <p class="text-end">총 배송비: {{ totalDeliveryFee.toLocaleString() }}원</p>
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

        <RouterLink :to="`/purchase/reserve/${projectId}`">
            <button type="button" class="btn btn-primary w-100 my-1" @click="saveToStore">다음 단계</button>
        </RouterLink>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePurchaseStore } from '../../util/store/purchaseStore';
import apiWrapper from '../../util/axios/axios';
import { useAuthStore } from '../../util/store/authStore';
import { useRewardStore } from '../../util/store/rewardStore';

const rewardStore = useRewardStore();
const storedSelectedRewards = computed(() => rewardStore.selectedRewards);

const props = defineProps(['id']); // props로 id 값을 받음


const rewards = ref([]);
const selectedRewards = ref([]);
const donationAmount = ref(0);
const route = useRoute();

const steps = ref(["리워드 선택", "결제 화면", "결제 완료"]);

// Pinia 스토어 인스턴스 (Setup Store 형태로 사용)
const purchaseStore = usePurchaseStore();

//////
const router = useRouter();

const projectId = route.params.id;

const selectedRewardsFromQuery = computed(() => {
    const queryParam = route.query.selectedRewards;
    return queryParam ? JSON.parse(queryParam) : [];
});

const authStore = useAuthStore();
const isAuthenticated = computed(() => authStore.isAuthenticated);

const totalDeliveryFee = ref(0)

//////


function formatToKoreanDate(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    console.log("date: ", date)
    console.log("year: ", year)
    console.log("month: ", month)
    console.log("day: ", day)

    return `${year}년 ${month}월 ${day}일`;
}

// 서버에서 리워드 목록 가져오기
onMounted(async () => {
    if (!isAuthenticated.value) {
        alert('로그인이 필요한 서비스입니다.')
        router.push('/login');
    }

    // selectedRewards.value = selectedRewardsFromQuery.value;

    const initialRewards = storedSelectedRewards.value.map((reward) => ({
        rewardId: reward.rewardId,
        quantity: reward.quantity || 1, // 기본값 설정
    }));

    // selectedRewards.value = storedSelectedRewards.value;
    selectedRewards.value = [...storedSelectedRewards.value]; // 기존 값 복사
    console.log("selectedRewards 배열:", selectedRewards);
    console.log("selectedRewards.value:", selectedRewards.value);
    console.log("RewardStore에서 가져온 selectedRewards:", rewardStore.selectedRewards);
    try {
        const rewardsForApi = selectedRewards.value.map(reward => ({
            rewardId: reward.rewardId,
            quantity: reward.quantity
        }));

        // const response = await axios.get(`http://localhost:8080/api/reward-list/all/${projectId}`);
        const response = await apiWrapper.getSelectedRewardList(rewardsForApi)
        console.log("전체 응답:", response);
        console.log("리워드 목록:", response.rewardDTOList);
        console.log("배송비:", response.deliveryFee);

        // 서버 응답 데이터 병합
        if (response.rewardDTOList && response.rewardDTOList.length > 0) {
            selectedRewards.value = response.rewardDTOList.map((apiReward) => {
                // initialRewards에서 매칭되는 데이터를 찾음
                const matchingReward = initialRewards.find(
                    (reward) => reward.rewardId === apiReward.rewardId
                );

                // matchingReward가 존재하면 quantity 값을 유지
                return {
                    rewardId: apiReward.rewardId,
                    rewardName: apiReward.rewardName || "",
                    price: apiReward.price || 0,
                    deliveryStartDate: apiReward.deliveryStartDate,
                    quantity: matchingReward ? matchingReward.quantity : apiReward.quantity || 1, // 기존 값 유지 또는 API의 quantity 사용
                    checked: true,
                };
            });
        } else {
            console.warn("서버 응답에서 rewardDTOList가 비어 있습니다.");
        }

        console.log("최종 selectedRewards 데이터:", selectedRewards.value);

        // 배송비 설정
        totalDeliveryFee.value = response.deliveryFee || 0;

        // rewards.value = response.rewardDTOList;
        // totalDeliveryFee.value = response.deliveryFee;

        // // selectedRewards를 API 응답과 병합
        // selectedRewards.value = response.rewardDTOList.map(apiReward => {
        //     const matchingReward = initialRewards.find(
        //         reward => reward.rewardId === rewardsForApi.rewardId
        //     );
        //     return {
        //         rewardId: apiReward.rewardId,
        //         rewardName: apiReward.rewardName || '',
        //         price: apiReward.price || 0,
        //         deliveryStartDate: apiReward.deliveryStartDate,
        //         quantity: matchingReward ? matchingReward.quantity : 1, // 초기 값 유지
        //         checked: true,
        //     };
        // });

        // console.log("최종 selectedRewards.value:", selectedRewards.value);

        // selectedRewards.value = response.data;

        // 초기 selectedRewards 배열 설정
        // selectedRewards.value = rewards.value.reduce((acc, reward) => {
        //     acc[reward.rewardId] = {
        //         rewardId: reward.rewardId,
        //         price: reward.price,
        //         deliveryFee: reward.deliveryFee,
        //         checked: false,
        //         quantity: 1,
        //     };
        //     return acc;
        // }, {});
        // 초기 selectedRewards 배열 설정 
        // selectedRewards.value = response.rewardDTOList.map(reward => ({
        //     rewardId: reward.rewardId,
        //     rewardName: reward.rewardName || '',
        //     price: reward.price || 0,
        //     deliveryStartDate: reward.deliveryStartDate,
        //     quantity: reward.count || 1,
        //     checked: true
        // }));
    } catch (error) {
        console.error('리워드 목록 조회 실패:', error);
    } finally {
        console.log("onMounted 마지막, selectedRewards.value: ", selectedRewards.value)
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
// const totalDeliveryFee = computed(() =>
//     Object.values(selectedRewards.value).reduce((maxFee, reward) => {
//         if (reward.checked) {
//             return Math.max(maxFee, reward.deliveryFee);
//         }
//         return maxFee;
//     }, 0)
// );

// 최종 결제 금액 계산
const finalAmount = computed(() => {
    return totalRewardPrice.value + totalDeliveryFee.value + donationAmount.value;
});

// // 수량 증가 함수
// function increaseQuantity(rewardId) {
//     selectedRewards.value[rewardId].quantity++;
// }

// // 수량 감소 함수 (최소 1 보장)
// function decreaseQuantity(rewardId) {
//     if (selectedRewards.value[rewardId].quantity > 1) {
//         selectedRewards.value[rewardId].quantity--;
//     }
// }

// 수량 증가 함수
function increaseQuantity(rewardId) {
    const reward = selectedRewards.value.find(r => r.rewardId === rewardId);
    if (reward) {
        reward.quantity++;
    }
}

// 수량 감소 함수 (최소 1 보장)
function decreaseQuantity(rewardId) {
    const reward = selectedRewards.value.find(r => r.rewardId === rewardId);
    if (reward && reward.quantity > 1) {
        reward.quantity--;
    }
}

// Pinia 스토어에 저장
function saveToStore() {
    const selectedRewardsData = Object.values(selectedRewards.value).filter(reward => reward.checked);
    const totalRewardPrice = selectedRewardsData.reduce((total, reward) => total + reward.price * reward.quantity, 0);

    purchaseStore.setPurchaseDetails(
        selectedRewardsData,
        totalRewardPrice,
        donationAmount.value,
        totalDeliveryFee.value
    );
}
</script>

<!-- <style scoped>
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
</style> -->
<style scoped>
.progress-steps {
    display: flex;
    justify-content: space-between;
    margin: 40px 0;
}

.step-container {
    display: flex;
    flex-direction: column;
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
    font-size: 14px;
    margin-bottom: 10px;
}

.step-completed {
    background-color: #00c4c4;
}

.step-pending {
    background-color: #e0e0e0;
    color: #666;
}

.dashed-line {
    flex-grow: 1;
    border-top: 2px dashed #ccc;
    margin: 0 10px;
}

h5.text-start {
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
    font-weight: bold;
}

.reward-item {
    background-color: #fff;
    border: 1px solid #e7e7e7;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    transition: all 0.2s ease;
}

.reward-item:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.reward-header h6 {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.reward-item p {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
}

.quantity-input {
    display: flex;
    align-items: center;
    margin-top: 15px;
}

.quantity-input label {
    margin-right: 10px;
}

.quantity-input input {
    width: 60px;
    text-align: center;
    margin-right: 10px;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    padding: 5px;
}

.quantity-input button {
    width: 30px;
    height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    margin: 0 5px;
    cursor: pointer;
}

.quantity-input button:hover {
    background-color: #e0e0e0;
}

.donation-section {
    background-color: #f8f9fa;
    border: 1px solid #e7e7e7;
    border-radius: 8px;
    padding: 20px;
    margin-top: 30px;
}

.donation-section p {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
}

.donation-section input {
    width: 120px;
    text-align: right;
    margin-right: 10px;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    padding: 5px;
}

button.btn-primary {
    background-color: #00c4c4;
    border-color: #00c4c4;
    font-weight: bold;
    padding: 15px;
    font-size: 18px;
    margin-top: 30px;
    width: 100%;
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

button.btn-primary:hover {
    background-color: #00b2b2;
    border-color: #00b2b2;
}

.text-end {
    font-size: 14px;
    color: #666;
    margin-top: 10px;
}
</style>