<script setup>
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { usePaymentStore } from './util/store/paymentStore';

const router = useRouter();
const route = useRoute();
const paymentStore = usePaymentStore();

// Detect if the current route requires a gray background
const isGrayBackground = computed(() => route.meta.grayBackground);

onMounted(() => {
    // Check if payment is successful and redirect if needed
    if (paymentStore.isPaymentSuccessful) {
        router.push('/purchase/step30/:id');
        paymentStore.resetPaymentStatus();
    }
});
</script>

<template>
    <div class="app-container">
        <RouterView />
    </div>
</template>

<style>
/* html, body, #app에 글로벌 스타일 적용 */
html, body, #app {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}

.app-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 100vh;
    width: 100%; /* 화면 가로를 전부 차지 */
    background-color: white;
}
</style>
