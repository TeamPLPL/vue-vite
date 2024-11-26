<template>
    <div class="container mb-4">
        <div class="progress-steps my-5">
            <div v-for="(step, index) in steps" :key="index" class="step-container">
                <div :class="['step-circle', { 'step-completed': index === 1, 'step-pending': index !== 1 }]">
                    {{ step }}
                </div>
                <div v-if="index < steps.length - 1" class="dashed-line"></div>
            </div>
        </div>

        <h5 class="fw-bold text-start">선택한 리워드</h5>
        <div v-for="reward in selectedRewards" :key="reward.rewardId" class="reward-item">
            <h6 class="reward-title">{{ reward.rewardName }}</h6>
            <p>수량: {{ reward.quantity }}개</p>
            <p>가격: {{ (reward.price * reward.quantity).toLocaleString() }}원</p>
        </div>

        <hr />

        <h5 class="fw-bold text-start">결제 요약</h5>
        <ul class="list-unstyled">
            <li class="d-flex justify-content-between">
                <span>리워드 금액</span>
                <span>{{ totalPrice.toLocaleString() }}원</span>
            </li>
            <li class="d-flex justify-content-between">
                <span>배송비</span>
                <span>{{ deliveryFee.toLocaleString() }}원</span>
            </li>
            <li class="d-flex justify-content-between">
                <span>추가 후원금</span>
                <span>{{ donationAmount.toLocaleString() }}원</span>
            </li>
            <li v-if="selectedCoupon" class="d-flex justify-content-between text-danger">
                <span>쿠폰 할인 ({{ selectedCoupon.discountRate }}%)</span>
                <span>-{{ ((totalPrice * selectedCoupon.discountRate) / 100).toLocaleString() }}원</span>
            </li>
            <li class="d-flex justify-content-between fw-bold">
                <span>총 결제 금액</span>
                <span>{{ wholePrice.toLocaleString() }}원</span>
            </li>
        </ul>

        <div class="d-flex align-items-center input-group mb-3">
            <h6 class="text-start w-25">쿠폰 사용</h6>
            <br />
            <select v-model="selectedCoupon" class="form-select w-50">
                <option disabled value="">쿠폰을 선택하세요</option>
                <option v-for="coupon in coupons" :key="coupon.id" :value="coupon">
                    {{ coupon.couponName }} ({{ coupon.discountRate }}% 할인)
                </option>
            </select>
            <br />

        </div>
        <p v-if="selectedCoupon">
            선택된 쿠폰: {{ selectedCoupon.couponName }} ({{ selectedCoupon.discountRate }}%)
        </p>

        <hr />

        <h5 class="fw-bold text-start">배송지 정보</h5>
        <div class="mb-3 d-flex">
            <label for="recipientName" class="form-label w-25 text-start">이름</label>
            <input v-model="recipientName" type="text" class="form-control" id="recipientName"
                placeholder="이름을 입력하세요" />
        </div>
        <div class="mb-3 d-flex">
            <label for="phoneNumber" class="form-label w-25 text-start">휴대폰 번호</label>
            <input v-model="phoneNumber" type="text" class="form-control" id="phoneNumber"
                placeholder="휴대폰 번호를 입력하세요" />
        </div>

        <div class="mb-3">
            <!-- Address 컴포넌트 추가 -->
            <Address @selectedAddress="handleAddressSelection" />
        </div>

        <button @click="saveAddressToPayment">선택한 주소 확인 및 저장</button>

        <div class="mb-3">
            <h5 for="deliveryRequest" class="form-label w-50 text-start">배송 시 요청사항 (선택)</h5>
            <input v-model="deliveryRequest" type="text" class="form-control" id="deliveryRequest"
                placeholder="요청사항을 입력하세요" />
        </div>

        <hr />

        <h5 class="fw-bold text-start">결제 방법</h5>
        <div class="form-check mb-3">
            <input class="form-check-input" type="radio" name="paymentMethod" id="creditCard" value="card"
                v-model="paymentMethod" />
            <label class="form-check-label w-100 text-start" for="creditCard">신용/체크카드</label>
        </div>

        <div v-if="paymentMethod === 'card'" class="mb-3">
            <label for="cardNumber" class="form-label w-100 text-start">카드번호</label>
            <input v-model="cardNumber" type="text" class="form-control" id="cardNumber" placeholder="카드번호를 입력하세요" />
        </div>

        <hr />

        <h5 class="fw-bold text-start">약관 동의</h5>
        <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" id="terms1" v-model="termsAccepted" />
            <label for="terms1" class="form-check-label w-100 text-start">결제 진행 필수 동의</label>
        </div>

        <RouterLink :to="`/purchase/choose/${id}`">
            <button type="button" class="btn prev-btn w-100 my-1">이전 단계</button>
        </RouterLink>
        <RouterLink :to="`/purchase/reserve/${id}`">
            <button @click="clientAuth" class="btn pay-btn w-100 my-1">결제하기</button>
        </RouterLink>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePurchaseStore } from '../../util/store/purchaseStore'; // Pinia 스토어 import
import { RouterLink } from 'vue-router';
import { usePaymentStore } from '../../util/store/paymentStore';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../util/store/authStore';

import apiWrapper from '../../util/axios/axios';

import Address from '../common/Address.vue';

const authStore = useAuthStore();
const router = useRouter();

const props = defineProps(['id']); // props로 id 값을 받음

const userId = ref(null); // 가져온 사용자 ID 저장
const coupons = ref([]); // 사용자 쿠폰 목록 저장

const selectedCoupon = ref(null);

const steps = ref(["리워드 선택", "결제 화면", "결제 완료"]);
const purchaseStore = usePurchaseStore();

const fundingData = ref(null); // 펀딩 데이터를 저장할 변수

const recipientName = ref('');
const phoneNumber = ref('');
const deliveryRequest = ref('');

const selectedAddress = ref({}); // 선택된 주소 데이터 저장

const cardNumber = ref('');
const paymentMethod = ref('');
const termsAccepted = ref(false);

// Address 컴포넌트에서 선택된 주소 데이터를 받을 핸들러
const handleAddressSelection = (addressData) => {
    selectedAddress.value = { ...addressData };
    console.log('선택된 주소:', selectedAddress.value);
};

const saveAddressToPayment = () => {
    if (Object.keys(selectedAddress.value).length === 0) {
        alert('주소를 선택해주세요!');
        return;
    }

    console.log('확정된 주소:', selectedAddress.value, ' : ', selectedAddress.value.id);
    alert('주소가 저장되었습니다!');
};

const selectedRewards = computed(() => purchaseStore.selectedRewards);
const totalPrice = computed(() => purchaseStore.totalPrice);
const donationAmount = computed(() => purchaseStore.donationAmount);
const deliveryFee = computed(() => purchaseStore.deliveryFee);

// 리워드 가격을 할인해줌
const wholePrice = computed(() => {
    if (selectedCoupon.value) {
        const discount = (totalPrice.value * selectedCoupon.value.discountRate) / 100;
        return totalPrice.value + donationAmount.value + deliveryFee.value - discount;
    }
    return totalPrice.value + donationAmount.value + deliveryFee.value;
});

const fetchUserCoupons = async () => {
    try {
        const token = authStore.getJwtToken(); // JWT 토큰 가져오기

        if (!token) {
            console.error('JWT 토큰이 없습니다.');
            return;
        }

        console.log('JWT 토큰이 존재합니다!');

        const response = await apiWrapper.getData('/api/coupons/user');
        coupons.value = response;
        console.log('사용자 쿠폰 목록:', coupons.value);
        console.log('사용자 ID', coupons.value.id)
    } catch (error) {
        console.error('쿠폰 조회 실패:', error);
    }
};

const updateFundingAmount = async () => {
    try {
        const rewardTotal = totalPrice.value; // 리워드 총 금액
        const donation = donationAmount.value; // 추가 후원금
        const discount = selectedCoupon.value
            ? (totalPrice.value * selectedCoupon.value.discountRate) / 100
            : 0; // 쿠폰 할인액

        const calculatedAmount = rewardTotal + donation - discount; // 배송비 제외

        const payload = {
            calculatedAmount, // 계산된 금액 전달
        };

        await apiWrapper.postData(`/api/payment/${props.id}/update-current-amount`, payload);
        console.log('Funding current amount updated successfully.');
    } catch (error) {
        console.error('Error updating funding current amount:', error);
    }
};

// 펀딩 데이터를 가져오는 함수
const fetchFundingDetails = async (fundingId) => {
    try {
        const data = await apiWrapper.fetchFundingData(fundingId);
        fundingData.value = data;
        console.log("펀딩 데이터 로드 성공:", fundingData.value);
    } catch (error) {
        console.error("펀딩 데이터 로드 중 오류 발생:", error);
    }
};

// 구매 검증
async function validateMultiplePurchases(rewards) {
    try {
        const response = await apiWrapper.postData('/api/payment/validate-purchase', rewards);

        // 응답 데이터 로깅
        console.log("API 응답 데이터:", response);

        // 응답 데이터 검증
        if (!response.data || typeof response.data.valid === 'undefined') {
            console.warn("API 응답 형식이 다릅니다:", response);
            alert("구매 검증 중 문제가 발생했습니다. 다시 시도해주세요.");
            return false;
        }

        // 검증 실패 처리
        if (!response.data.valid) {
            alert(response.data.message || "구매 검증 실패.");
            return false;
        }

        // 검증 성공
        console.log("모든 리워드 구매 가능");
        return true;
    } catch (error) {
        console.error("구매 검증 실패:", error);

        // 에러 메시지 처리
        alert(error.response?.data?.message || "구매 검증 중 오류가 발생했습니다.");
        return false;
    }
}

async function clientAuth() {
    if (purchaseStore.selectedRewards.length === 0) {
        alert("구매할 리워드를 선택해주세요.");
        return;
    }

    const rewards = purchaseStore.selectedRewards.map(reward => ({
        rewardId: reward.rewardId,
        fundingId: props.id, // 펀딩 ID
        purchaseQuantity: reward.quantity, // 구매하려는 수량
    }));

    // API 요청에서 배열로 전달
    const rewardsPayload = Array.isArray(rewards) ? rewards : [rewards];

    // rewards 데이터 구조 확인
    // console.log("clientAuth에서 rewards 데이터:", rewards);
    console.log("API 호출 payload:", rewardsPayload);

    const isPurchaseValid = await validateMultiplePurchases(rewardsPayload);

    if (!isPurchaseValid) {
        console.log("구매 불가능. 로직 종료.");
        return; // 구매 시도 중단
    }

    if (!selectedAddress.value.id) {
        alert('배송지를 선택해주세요!');
        return;
    }

    if (paymentMethod.value === 'card' && (!cardNumber.value || cardNumber.value.trim() === '')) {
        alert('카드 번호를 입력해야 합니다.');
        return;
    }

    console.log("구매 가능. 결제 로직 실행.");

    try {
        const paymentData = {
            addressId: selectedAddress.value.id, // 예시로 기본 주소 ID
            fundingId: props.id,
            couponId: selectedCoupon.value ? selectedCoupon.value.id : null, // 선택된 쿠폰 ID 추가,
            amount: wholePrice.value,
            phoneNum: phoneNumber.value,
            receiverName: recipientName.value,
            deliveryRequest: deliveryRequest.value,
            methodType: paymentMethod.value,
            cardNumber: paymentMethod.value === 'card' ? cardNumber.value : null,
            thirdPartyId: paymentMethod.value !== 'card' ? thirdPartyId.value : null,
            thirdPartyPw: paymentMethod.value !== 'card' ? thirdPartyPw.value : null,
            rewards: selectedRewards.value.reduce((acc, reward) => {
                acc[reward.rewardId] = { rewardId: reward.rewardId, rewardName: reward.rewardName, quantity: reward.quantity };
                return acc;
            }, {}),
        };

        console.log('paymentMethod:', paymentMethod.value);
        console.log('cardNumber:', cardNumber.value);
        console.log('paymentData:', paymentData);

        const registerResponse = await apiWrapper.postData('/api/payment/register', paymentData);

        console.log('결제 등록 성공:', registerResponse.data);
        console.log(registerResponse.data.id);

        // 2. requestPay 호출
        AUTHNICE.requestPay({
            buyerTel: phoneNumber.value,
            clientId: import.meta.env.VITE_NICEPAY_KEY,
            method: paymentMethod.value,
            // ModalConfirm.vue에 있는 orderId의 양식과 똑같아야 한다.
            orderId: `prod_1127_${registerResponse.data.id}`, // 서버에서 결제 내역 확인용 ID, 최종 시연할 때 test_xxxx_를 제거할 예정
            amount: wholePrice.value,
            goodsName: fundingData.value.fundingTitle,
            returnUrl: `http://localhost:8080/api/payment/complete?id=${props.id}`,
            fnError: function (result) {
                alert('결제 오류: ' + result.errorMsg);
                updatePaymentStatus(registerResponse.data.id, 'failed');
            }
        }),

            await updatePaymentStatus(registerResponse.data.id, 'complete');
        await updateFundingAmount();

    } catch (error) {
        console.error('결제 등록 실패:', error.response || error);
        alert('결제 등록 중 오류가 발생했습니다.');
    }
}

// 결제 상태 업데이트 함수
async function updatePaymentStatus(paymentId, status) {
    try {
        const response = await apiWrapper.putData(`/api/payment/${paymentId}/status`, { status });
        console.log(`Payment ${paymentId} 상태 업데이트:`, response.data);
    } catch (error) {
        console.error('결제 상태 업데이트 실패:', error.response || error);
    }
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
        const token = authStore.getJwtToken();

        if (!token) {
            console.error("JWT 토큰이 없습니다.");
            router.push('/login'); // 로그인 페이지로 리다이렉트
            return;
        }
        await fetchUserCoupons();

        fetchFundingDetails(props.id); // 펀딩 데이터를 가져옴

        await loadScript("https://pay.nicepay.co.kr/v1/js/", "nicepay-script");
        // 추가적인 스크립트를 로드하려면 같은 방식으로 호출

        console.log('NicePay script loaded successfully.');
    } catch (error) {
        console.error("Script loading failed:", error);
    }
});
</script>

<style scoped>
/* 선택한 리워드와 결제 화면의 너비를 ChooseReward.vue와 동일하게 설정 */
.container {
    max-width: 550px;
    /* ChooseReward.vue의 기준 너비와 동일하게 설정 */
    margin: 0 auto;
    /* 중앙 정렬 */
    padding: 0 20px;
    /* 여백 추가로 가독성 향상 */
}

.prev-btn {
    background-color: #00c4c4;
    color: #fff;
}

.pay-btn {
    background-color: #00c4c4;
    color: #fff;
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

.reward-title {
    font-weight: bold;
    color: #00c4c4;
    margin-bottom: 8px;
}

.reward-details {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.reward-info {
    display: flex;
}

.reward-quantity,
.reward-price {
    margin: 0;
    color: #333;
}

.reward-delivery-fee {
    font-weight: bold;
    color: #333;
}

.progress-steps {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* 요소를 수직으로 중앙 정렬 */
    margin: 40px 0;
    width: 100%;
    /* 부모 컨테이너의 전체 폭 사용 */
}

.step-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 각 스텝을 중앙 정렬 */
    text-align: center;
    /* 원 아래의 텍스트 정렬 */
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
    /* 원과 아래 텍스트 간의 간격 */
}

.step-completed {
    background-color: #00c4c4;
    /* Example color for completed step */
}

.step-pending {
    background-color: #e9ecef;
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
</style>