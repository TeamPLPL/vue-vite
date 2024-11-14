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
        <li class="d-flex justify-content-between fw-bold">
            <span>총 결제 금액</span>
            <span>{{ wholePrice.toLocaleString() }}원</span>
        </li>
    </ul>

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
        <label for="address" class="form-label">주소</label>
        <input v-model="address" type="text" class="form-control" id="address" placeholder="주소를 입력하세요" />
    </div>
    <div class="mb-3">
        <input v-model="detailedAddress" type="text" class="form-control" placeholder="상세주소" />
    </div>
    <div class="mb-3">
        <label for="deliveryRequest" class="form-label">배송 시 요청사항 (선택)</label>
        <input v-model="deliveryRequest" type="text" class="form-control" id="deliveryRequest"
            placeholder="요청사항을 입력하세요" />
    </div>

    <hr />

    <h5 class="fw-bold">결제 방법</h5>
    <div class="form-check mb-3">
        <input class="form-check-input" type="radio" name="paymentMethod" id="npay" value="naverpayCard"
            v-model="paymentMethod" />
        <label class="form-check-label" for="npay">네이버페이</label>
    </div>
    <div class="form-check mb-3">
        <input class="form-check-input" type="radio" name="paymentMethod" id="kpay" value="kakaopayCard"
            v-model="paymentMethod" />
        <label class="form-check-label" for="kpay">카카오페이</label>
    </div>
    <div class="form-check mb-3">
        <input class="form-check-input" type="radio" name="paymentMethod" id="creditCard" value="CARD"
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
import apiWrapper from '../../util/axios/axios';
import { usePaymentStore } from '../../util/store/paymentStore';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../util/store/authStore';

const authStore = useAuthStore();
const router = useRouter();

const props = defineProps(['id']); // props로 id 값을 받음

const steps = ref(["리워드 선택", "결제 화면", "결제 완료"]);
const purchaseStore = usePurchaseStore();

// 인증 상태와 사용자 정보를 관리
// const isAuthenticated = ref(false);
// const userInfo = ref(null);

// const fetchUserInfo = async () => {
//     // const token = authStore.getJwtToken();

//     // if (!token) {
//     //     alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
//     //     router.push('/login');
//     //     return;
//     // }

//     try {
//         const response = await axios.post('http://localhost:8080/api/login', {
//             email: state.email,
//             password: state.password,
//         });

//         // Authorization 헤더가 정상적으로 오는지 체크
//         if (response.headers['authorization']) {
//             const token = response.headers['authorization'].split(' ')[1];
//             console.log(token);

//             // 로컬 스토리지에 토큰 저장
//             localStorage.setItem('jwtToken', token);
//             authStore.getJwtToken();
//         } else {
//             console.error('JWT 토큰을 찾을 수 없습니다.');
//         }

//         userInfo.value = response.data;
//         isAuthenticated.value = true;
//         console.log('로그인된 사용자 정보:', userInfo.value);
//     } catch (error) {
//         console.error('사용자 정보 가져오기 실패:', error);
//         // alert('로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.');
//         // router.push('/login');
//     }
// };

const recipientName = ref('');
const phoneNumber = ref('');
const address = ref('');
const detailedAddress = ref('');
const deliveryRequest = ref('');
const cardNumber = ref('');
const paymentMethod = ref('');
const termsAccepted = ref(false);

const selectedRewards = computed(() => purchaseStore.selectedRewards);
const totalPrice = computed(() => purchaseStore.totalPrice);
const donationAmount = computed(() => purchaseStore.donationAmount);
const deliveryFee = computed(() => purchaseStore.deliveryFee);
const wholePrice = computed(() => totalPrice.value + donationAmount.value + deliveryFee.value);

// 서버로 가는지 테스트
const testFunction = async () => {
    try {
        // POST 요청 테스트
        const postDataResult = await apiWrapper.postData('/api/payment/register', { key: 'value' });
        console.log('POST 요청 결과:', postDataResult);
    } catch (error) {
        console.error('API 호출 에러:', error);
    }
}


async function clientAuth() {
    purchaseStore.incrementOrderId(); // 에러 시에도 호출

    if (paymentMethod.value === 'card' && (!cardNumber.value || cardNumber.value.trim() === '')) {
        alert('카드 번호를 입력해야 합니다.');
        return;
    }

    try {
        const paymentData = {
            // userId: userInfo.value?.id,
            userId: 1, // 일단 더미로 userId 넣기
            addressId: 1, // 예시로 기본 주소 ID
            fundingId: props.id,
            couponId: null,
            amount: wholePrice.value,
            phoneNum: phoneNumber.value,
            receiverName: recipientName.value,
            deliveryRequest: deliveryRequest.value,
            methodType: paymentMethod.value,
            cardNumber: paymentMethod.value === 'CARD' ? cardNumber.value : null,
            thirdPartyId: paymentMethod.value !== 'CARD' ? thirdPartyId.value : null,
            thirdPartyPw: paymentMethod.value !== 'CARD' ? thirdPartyPw.value : null,
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
            orderId: `test_1109_${registerResponse.data.id}`, // 서버에서 결제 내역 확인용 ID
            amount: wholePrice.value,
            goodsName: '나이스페이-상품',
            returnUrl: `http://localhost:8080/api/payment/complete?id=${props.id}`,
            fnError: function (result) {
                alert('결제 오류: ' + result.errorMsg);
                purchaseStore.incrementOrderId();
            }
        },
            function onSuccess(response) {
                console.log("결제 성공:", response);

                // 3. 성공적으로 거래 완료 시 paymentStatus 업데이트
                updatePaymentStatus(registerResponse.data.id, 'success');
                alert('결제가 성공적으로 완료되었습니다!');
            },
            function onFailure(error) {
                console.log("결제 실패:", error);

                // 4. 실패 시 paymentStatus 업데이트
                updatePaymentStatus(registerResponse.data.id, 'failed');
                alert('결제가 실패했습니다. 다시 시도해주세요.');
            });

    } catch (error) {
        console.error('결제 등록 실패:', error.response || error);
        alert('결제 등록 중 오류가 발생했습니다.');
    }

    // if (!isAuthenticated.value) {
    //     alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
    //     router.push('/login');
    //     return;
    // }

    // if (!termsAccepted.value) {
    //     alert('약관에 동의하셔야 결제가 진행됩니다.');
    //     return;
    // }

    // console.log('결제 요청:', {
    //     paymentMethod: paymentMethod.value,
    //     cardNumber: paymentMethod.value === 'card' ? cardNumber.value : null,
    //     recipientName: recipientName.value,
    //     phoneNumber: phoneNumber.value,
    //     address: `${address.value} ${detailedAddress.value}`,
    //     deliveryRequest: deliveryRequest.value,
    //     totalAmount: wholePrice.value,
    //     selectedRewards: selectedRewards.value,
    // });
    // AUTHNICE.requestPay({
    //     clientId: import.meta.env.VITE_NICEPAY_KEY,
    //     method: paymentMethod.value,
    //     orderId: `test_1109_${purchaseStore.orderId}`, // Pinia 스토어에서 orderId 사용
    //     amount: wholePrice.value,
    //     goodsName: '나이스페이-상품',
    //     returnUrl: `http://localhost:8080/api/payment/complete?id=${props.id}`,
    //     fnError: function (result) {
    //         alert('개발자확인용 : ' + result.errorMsg + '');
    //         purchaseStore.incrementOrderId(); // 에러 시에도 호출
    //     }
    // },

    //     // 결제 성공 콜백 함수
    //     function onSuccess(response) {
    //         console.log("결제 성공:", response);
    //         paymentStore.setPaymentSuccess(true);
    //         purchaseStore.incrementOrderId(); // 결제 성공 후 orderId 증가
    //     },

    //     // 결제 실패 콜백 함수
    //     function onFailure(error) {
    //         console.log("결제 실패:", error);
    //         alert("결제가 실패했습니다. 다시 시도해주세요.");
    //         purchaseStore.incrementOrderId(); // 결제 실패 후 orderId 증가
    //     });
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
    const token = authStore.getJwtToken();
    if (!token) {
        console.log("Token is null, fetching from localStorage");
        authStore.setJwtToken(localStorage.getItem('jwtToken')); // 다시 설정
        console.log(localStorage.getItem('jwtToken'));
    } else {
        console.log(token);
    }


    console.log('Initial Order ID:', purchaseStore.orderId); // 초기 Order ID 확인
    try {
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