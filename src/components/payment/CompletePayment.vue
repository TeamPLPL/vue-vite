<template>
    <div class="text-center my-5">
        <h2>결제가 성공적으로 완료되었습니다!</h2>
        <p>감사합니다. 결제 내역은 마이페이지에서 확인하실 수 있습니다.</p>
        <RouterLink to="/">홈으로 돌아가기</RouterLink>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePaymentStore } from '../../util/store/paymentStore';

const router = useRouter();
const paymentStore = usePaymentStore();

onMounted(() => {
    // 결제 성공 상태 확인
    if (paymentStore.isPaymentSuccessful) {
        // 리디렉션 수행 후 상태 초기화
        router.push('/web/wpurchase/reward/complete');
        paymentStore.resetPaymentStatus();
    }
});

</script>