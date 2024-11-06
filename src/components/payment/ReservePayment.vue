<template>
    <div class="progress-steps my-5">
        <div v-for="(step, index) in steps" :key="index" class="step-container">
            <div :class="['step-circle', { 'step-completed': index === 1, 'step-pending': index !== 1 }]">
                {{ step }}
            </div>
            <div v-if="index < steps.length - 1" class="dashed-line"></div>
        </div>
    </div>

    <div class="container my-5">
        <h5 class="text-primary">[슈퍼얼리버드] 에브리봇 침구 로봇청소기</h5>
        <p>제품구성 : 로봇 본체 + 먼지동 + USB 케이블</p>

        <div class="d-flex justify-content-between">
            <span>수량: {{ quantity }}개</span>
            <span>{{ totalPrice.toLocaleString() }}원</span>
        </div>

        <hr />

        <!-- Additional Donation -->
        <div class="d-flex justify-content-between">
            <h6>추가 후원금</h6>
            <span>{{ donationAmount.toLocaleString() }}원</span>
        </div>

        <hr />

        <!-- Shipping Fee -->
        <div class="d-flex justify-content-between">
            <h6>배송비</h6>
            <span>0원</span>
        </div>

        <hr />

        <!-- Coupon Selection -->
        <div class="d-flex input-group mb-3">
            <h6>쿠폰 사용</h6>
            <br />
            <select class="form-select">
                <option selected>쿠폰을 선택하세요</option>
                <option>10% 할인 쿠폰</option>
            </select>
        </div>

        <!-- Point Usage -->
        <h6>포인트 사용</h6>
        <div class="d-flex align-items-center mb-3">
            <input type="checkbox" id="use-all-points" class="form-check-input me-2" />
            <label for="use-all-points" class="form-check-label me-3">모두 사용 (보유 포인트 0P)</label>
            <input type="number" class="form-control" placeholder="0" style="max-width: 100px;" />
        </div>

        <hr />

        <!-- Payment Summary -->
        <h5 class="fw-bold text-start">결제 예약 금액</h5>
        <ul class="list-unstyled">
            <li class="d-flex justify-content-between">
                <span>리워드 금액</span>
                <span>{{ totalPrice.toLocaleString() }}원</span>
            </li>
            <li class="d-flex justify-content-between">
                <span>쿠폰 할인 금액</span>
                <span>-0원</span>
            </li>
            <li class="d-flex justify-content-between">
                <span>포인트 할인 금액</span>
                <span>0원</span>
            </li>
            <li class="d-flex justify-content-between">
                <span>추가 후원금</span>
                <span>{{ donationAmount.toLocaleString() }}원</span>
            </li>
            <li class="d-flex justify-content-between">
                <span>배송비</span>
                <span>0원</span>
            </li>
            <li class="d-flex justify-content-between fw-bold">
                <span>총 결제 금액</span>
                <span>{{ wholePrice.toLocaleString() }}원</span>
            </li>
        </ul>

        <hr />

        <h5 class="fw-bold text-start">리워드 배송지</h5>
        <!-- 이름 -->
        <div class="mb-3">
            <label for="name" class="form-label float-start">이름</label>
            <input type="text" class="form-control" id="name" placeholder="이름을 입력하세요" />
        </div>

        <!-- 휴대폰 번호 -->
        <div class="mb-3">
            <label for="phone" class="form-label float-start">휴대폰 번호</label>
            <input type="text" class="form-control" id="phone" placeholder="휴대폰 번호를 입력하세요" />
        </div>

        <!-- 주소 -->
        <div class="mb-3">
            <label for="address" class="form-label float-start">주소</label>
            <div class="input-group">
                <input type="text" class="form-control" id="address" placeholder="주소를 입력하세요" />
                <button class="btn btn-secondary" type="button">주소 찾기</button>
            </div>
        </div>

        <!-- 상세주소 -->
        <div class="mb-3">
            <input type="text" class="form-control" placeholder="상세주소" />
        </div>

        <!-- 개인정보 보호 메시지 -->
        <div class="mb-3">
            <small class="text-muted float-start">
                🔒 와디즈에서는 서포터님의 개인정보 보호를 위해 안심번호를 사용해요.
            </small>
            <br />
        </div>

        <!-- 배송 시 요청사항 (선택) -->
        <div class="my-3">
            <label for="deliveryRequest" class="form-label float-start">배송 시 요청사항 (선택)</label>
            <input type="text" class="form-control" id="deliveryRequest" placeholder="ex) 부재 시 경비실에 보관해주세요." />
            <small class="text-muted float-start">해당 요청사항은 배송에 관련된 내용만 적어주세요.</small>
        </div>

        <hr />

        <h5 class="fw-bold text-start">지금 결제</h5>
        <div class="form-check mb-3">
            <input class="form-check-input" type="radio" name="paymentMethod" id="npay" value="naverpayCard"
                v-model="paymentMethod" />
            <label class="form-check-label d-flex align-items-center" for="npay">
                <span class="badge bg-success text-white me-2">N pay</span>
                네이버페이
            </label>
        </div>

        <div class="form-check mb-3">
            <input class="form-check-input" type="radio" name="paymentMethod" id="kpay" value="kakaopayCard"
                v-model="paymentMethod" />
            <label class="form-check-label d-flex align-items-center" for="kpay">
                <span class="badge bg-warning text-dark me-2">K pay</span>
                카카오페이
            </label>
        </div>

        <div class="form-check mb-4">
            <input class="form-check-input" type="radio" name="paymentMethod" id="creditCard" value="card"
                v-model="paymentMethod" />
            <label class="form-check-label float-start" for="creditCard">신용/체크카드</label>
        </div>

        <hr />

        <!-- Payment Notice -->
        <div class="p-3 bg-light border rounded mb-4">
            <h6 class="fw-bold">결제 유의사항</h6>
            <ul class="mb-0">
                <li>장기할부는 상품금액이 30만원 이상, 일부 프로젝트 운영에 한해서만 제공됩니다.</li>
                <li>예약 결제의 경우 결제 실행일에 결제자 귀책사유로 인해 결제가 실패할 수 있으니, 결제수단이 유효한지 확인해주세요.</li>
                <li>예약 결제의 경우 1차 결제 실패 시 다음날 재 결제를 실행합니다.</li>
                <li>결제 이후, 결제 정보를 변경하려면 마이페이지 > 참여 내역에서 결제 정보를 변경해주세요.</li>
                <li>지금 결제를 한 경우에도 프로젝트가 종료되기 전까지 언제든 결제를 취소할 수 있어요.</li>
            </ul>
        </div>

        <hr />

        <!-- Terms and Conditions -->
        <h5 class="fw-bold">약관 동의</h5>
        <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" id="terms1" />
            <label class="form-check-label float-start" for="terms1">결제 진행 필수 동의</label>
        </div>

        <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" id="terms2" />
            <label class="form-check-label float-start" for="terms2">
                구매조건, 결제 진행 및 결제 대행 서비스 동의(필수)
            </label>
        </div>
        <ul class="list-unstyled ms-4 text-start">
            <li>- 전자금융거래 이용약관</li>
            <li>- 개인정보 수집 및 이용 및 제3자 제공에 대한 동의</li>
            <li>- 환불 정책 동의</li>
        </ul>
        <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" id="terms3" />
            <label class="form-check-label float-start" for="terms3">개인정보 제3자 제공 동의 (필수)</label>
        </div>

        <div class="form-check mb-2">
            <input class="form-check-input" type="checkbox" id="terms4" />
            <label class="form-check-label float-start" for="terms4">책임 규정에 대한 동의 (필수)</label>
        </div>
    </div>

    <!-- <button @click="testFunction">연결테스트</button>     -->

    <RouterLink :to="`/purchase/step10/${id}`">
        <button type="button" class="btn btn-primary w-100 my-1">이전 단계</button>
    </RouterLink>
    <RouterLink :to="`/purchase/step20/${id}`">
        <button @click="clientAuth" class="btn btn-primary w-100 my-1">clientAuth 결제하기</button>
    </RouterLink>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePurchaseStore } from '../../util/store/purchaseStore'; // Pinia 스토어 import
import { RouterLink } from 'vue-router';
import apiWrapper from '../../util/axios/axios';
import { usePaymentStore } from '../../util/store/paymentStore';

const props = defineProps(['id']); // props로 id 값을 받음

const steps = ref(["리워드 선택", "결제 예약", "소문내기"]);
const paymentMethod = ref("card"); // 초기값 설정
//const orderId = ref(getOrderId()); // 순차적으로 증가하는 orderId

// Pinia 스토어 사용
const purchaseStore = usePurchaseStore();
const quantity = purchaseStore.quantity;
const totalPrice = purchaseStore.totalPrice;
const donationAmount = purchaseStore.donationAmount;
const paymentStore = usePaymentStore();

const wholePrice = computed(() => purchaseStore.totalPrice + purchaseStore.donationAmount);

// 순차적인 orderId 생성 및 저장
// function getOrderId() {
//     // 로컬 스토리지에서 기존 orderId를 가져옵니다.
//     const storedOrderId = localStorage.getItem('orderId');
//     if (storedOrderId) {
//         return parseInt(storedOrderId);
//     } else {
//         localStorage.setItem('orderId', '1000'); // 초기값 설정
//         return 1000;
//     }
// }

// function incrementOrderId() {
//     orderId.value += 1;
//     localStorage.setItem('orderId', orderId.value.toString());
// }

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


function clientAuth() {
    AUTHNICE.requestPay({
        clientId: import.meta.env.VITE_NICEPAY_KEY,
        method: paymentMethod.value,
        orderId: `test_1107_${purchaseStore.orderId}`, // Pinia 스토어에서 orderId 사용
        amount: wholePrice.value,
        goodsName: '나이스페이-상품',
        returnUrl: `http://localhost:8080/api/payment/complete?id=${props.id}`,
        fnError: function (result) {
            alert('개발자확인용 : ' + result.errorMsg + '')
        }
    },

    // 결제 성공 콜백 함수
    function onSuccess(response) {
        console.log("결제 성공:", response);
        paymentStore.setPaymentSuccess(true);
        purchaseStore.incrementOrderId(); // 결제 성공 후 orderId 증가
    },

    // 결제 실패 콜백 함수
    function onFailure(error) {
        console.log("결제 실패:", error);
        alert("결제가 실패했습니다. 다시 시도해주세요.");
        purchaseStore.incrementOrderId(); // 결제 실패 후 orderId 증가
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
