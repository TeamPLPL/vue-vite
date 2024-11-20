<template>
    <div class="progress-steps my-5">
        <div v-for="(step, index) in steps" :key="index" class="step-container">
            <div :class="['step-circle', { 'step-completed': index === 1, 'step-pending': index !== 1 }]">
                {{ step }}
            </div>
            <div v-if="index < steps.length - 1" class="dashed-line"></div>
        </div>
    </div>

    <h5 class="fw-bold">선택한 리워드</h5>
    <div v-for="reward in selectedRewards" :key="reward.rewardId" class="reward-item">
        <h6 class="reward-title">{{ reward.rewardName }}</h6>
        <p>수량: {{ reward.quantity }}개</p>
        <p>가격: {{ (reward.price * reward.quantity).toLocaleString() }}원</p>
    </div>

    <hr />

    <h5 class="fw-bold">결제 요약</h5>
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

    <div class="d-flex input-group mb-3">
        <h6>쿠폰 사용</h6>
        <br />
        <select v-model="selectedCoupon" class="form-select">
            <option disabled value="">쿠폰을 선택하세요</option>
            <option v-for="coupon in coupons" :key="coupon.id" :value="coupon">
                {{ coupon.couponName }} ({{ coupon.discountRate }}% 할인)
            </option>
        </select>
        <p v-if="selectedCoupon">
            선택된 쿠폰: {{ selectedCoupon.couponName }} ({{ selectedCoupon.discountRate }}%)
        </p>
    </div>


    <hr />

    <h5 class="fw-bold">배송지 정보</h5>
    <div class="mb-3">
        <label for="recipientName" class="form-label">이름</label>
        <input v-model="recipientName" type="text" class="form-control" id="recipientName" placeholder="이름을 입력하세요" />
    </div>
    <div class="mb-3">
        <label for="phoneNumber" class="form-label">휴대폰 번호</label>
        <input v-model="phoneNumber" type="text" class="form-control" id="phoneNumber" placeholder="휴대폰 번호를 입력하세요" />
    </div>

    <div class="mb-3">
        <!-- Address 컴포넌트 추가 -->
        <Address @selectedAddress="handleAddressSelection" />
    </div>

    <button @click="saveAddressToPayment">선택한 주소 확인 및 저장</button>

    <div class="mb-3">
        <label for="deliveryRequest" class="form-label">배송 시 요청사항 (선택)</label>
        <input v-model="deliveryRequest" type="text" class="form-control" id="deliveryRequest"
            placeholder="요청사항을 입력하세요" />
    </div>

    <hr />

    <h5 class="fw-bold">결제 방법</h5>
    <div class="form-check mb-3">
        <input class="form-check-input" type="radio" name="paymentMethod" id="creditCard" value="card"
            v-model="paymentMethod" />
        <label class="form-check-label" for="creditCard">신용/체크카드</label>
    </div>

    <div v-if="paymentMethod === 'card'" class="mb-3">
        <label for="cardNumber" class="form-label">카드번호</label>
        <input v-model="cardNumber" type="text" class="form-control" id="cardNumber" placeholder="카드번호를 입력하세요" />
    </div>

    <hr />

    <h5 class="fw-bold">약관 동의</h5>
    <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="terms1" v-model="termsAccepted" />
        <label for="terms1" class="form-check-label">결제 진행 필수 동의</label>
    </div>

    <RouterLink :to="`/purchase/choose/${id}`">
        <button type="button" class="btn btn-primary w-100 my-1">이전 단계</button>
    </RouterLink>
    <RouterLink :to="`/purchase/reserve/${id}`">
        <button @click="clientAuth" class="btn btn-primary w-100 my-1">clientAuth 결제하기</button>
    </RouterLink>
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


async function clientAuth() {
    if (!selectedAddress.value.id) {
        alert('배송지를 선택해주세요!');
        return;
    }

    if (paymentMethod.value === 'card' && (!cardNumber.value || cardNumber.value.trim() === '')) {
        alert('카드 번호를 입력해야 합니다.');
        return;
    }

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
            orderId: `test_1115_${registerResponse.data.id}`, // 서버에서 결제 내역 확인용 ID, 최종 시연할 때 test_xxxx_를 제거할 예정
            amount: wholePrice.value,
            goodsName: '나이스페이-상품',
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

        await loadScript("https://pay.nicepay.co.kr/v1/js/", "nicepay-script");
        // 추가적인 스크립트를 로드하려면 같은 방식으로 호출

        console.log('NicePay script loaded successfully.');
    } catch (error) {
        console.error("Script loading failed:", error);
    }
});
</script>

<style scoped>
.reward-item {
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-size: 14px;
}

.reward-title {
    font-weight: bold;
    color: #007bff;
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
</style>