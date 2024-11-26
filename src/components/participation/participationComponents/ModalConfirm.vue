<template>
    <div v-show="show" class="modal-overlay">
        <div class="modal">
            <h3>{{ title }}</h3>
            <p>{{ message }}</p>
            <div class="modal-buttons">
                <button @click="$emit('close')" class="btn btn-secondary">다시 생각하기</button>
                <button @click="confirmCancellation" class="btn btn-primary">취소하기</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import apiWrapper from '../../../util/axios/axios';

const props = defineProps({
    show: Boolean,
    title: String,
    message: String,
    paymentId: Number, // Payment ID 수신
    calculatedAmount: Number // 계산된 금액
});

const emit = defineEmits(['close', 'confirm']); // 이벤트 정의

async function cancelTransaction(tid, orderId, reason = 'User Request') {
    try {
        const url = `/api/nicepay/order/${tid}/cancel`; // 백엔드 경로
        const payload = {
            reason: reason,
            orderId: orderId,
        };

        const response = await apiWrapper.postData(url, payload); // POST 요청을 백엔드로
        console.log('Cancel Response from Backend:', response);
        return response;
    } catch (error) {
        console.error('Error canceling transaction:', error);
        throw error;
    }
}

async function updatePaymentStatus(paymentId, newStatus = 'refund') {
    try {
        const url = `/api/payment/${paymentId}/status`; // 백엔드 API 경로
        const response = await apiWrapper.putData(url, { status: newStatus });
        console.log('Payment Status Updated:', response);
        return response;
    } catch (error) {
        console.error('Error updating payment status:', error);
        throw error;
    }
}

// 거래 취소 에러 처리
function handleCancellationError(error) {
    console.error('Error during cancellation:', error);

    if (error.response) {
        // 서버 응답에 따른 에러 처리
        const status = error.response.status;
        const message = error.response.data.message || '알 수 없는 오류가 발생했습니다.';

        if (status === 401) {
            alert('인증 오류: 다시 로그인해 주세요.');
        } else if (status === 500) {
            alert('서버 오류: 잠시 후 다시 시도해 주세요.');
        } else {
            alert(`취소 실패: ${message}`);
        }
    } else {
        // 네트워크 오류 또는 기타 에러 처리
        alert('네트워크 오류: 인터넷 연결을 확인해 주세요.');
    }
}


async function confirmCancellation() {
    try {
        const orderId = `prod_1126_${props.paymentId}`; // orderId 생성, ReservePayment의 orderId 양식과 똑같아야 한다.
        console.log('Generated Order ID:', orderId);

        // 1. 세부 거래 조회
        const orderDetails = await fetchOrderDetails(orderId);
        const tid = orderDetails.tid;
        console.log('Transaction TID : ', tid);

        // 2. 백엔드를 통해 거래 취소 요청
        const cancelResponse = await cancelTransaction(tid, orderId, '사용자 요청');
        console.log('Transaction Cancelled:', cancelResponse);

        // 3. 상태 업데이트 요청
        const paymentId = props.paymentId;
        await updatePaymentStatus(paymentId, 'refund');

        const response = await apiWrapper.postData(`/api/payment/${props.paymentId}/cancel`, {
            amount: props.calculatedAmount // 계산된 금액 전달
        });

        emit('confirm', { paymentId, cancelResponse, response }); // Payment ID와 결과 전달
        alert('거래가 성공적으로 취소되었습니다.'); // 나중에 사용자 친화적인 알림 컴포넌트로 교체 권장
    } catch (error) {
        handleCancellationError(error); // 에러를 핸들링 함수로 이동
    }
}

// 거래 조회 요청 함수
async function fetchOrderDetails(orderId) {
    try {
        const url = `/api/nicepay/order/${orderId}`;  // Spring Boot 백엔드 경로
        const response = await apiWrapper.getData(url);
        console.log('Order Details from Backend:', response);
        return response;
    } catch (error) {
        console.error('Error fetching order details:', error);
        throw error;
    }
}

</script>

<style scoped>
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

.modal {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    max-height: 200px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 1010;
    position: relative; /* 기본 위치 */
    display: block;
}

.modal-buttons {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.btn-secondary {
    background-color: #f1f1f1;
    color: #333;
}

.btn-primary {
    background-color: #0c8;
    color: white;
}
</style>