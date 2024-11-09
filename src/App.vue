<script setup>
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './util/store/authStore'; // authStore import
import { usePaymentStore } from './util/store/paymentStore';
import axios from 'axios'; // axios import for handling headers

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore(); // authStore 사용
const paymentStore = usePaymentStore();

// Detect if the current route requires a gray background
const isGrayBackground = computed(() => route.meta.grayBackground);

// 로그아웃 메소드
function logout() {
    authStore.setJwtToken(null); // jwtToken을 null로 설정
    axios.defaults.headers.common['Authorization'] = ''; // Authorization 헤더 초기화
    router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
}

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
        <!-- 로그아웃 버튼 -->
        <button @click="logout" class="btn btn-primary mt-4">로그아웃</button>
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
    width: 100%;
    background-color: white;
}
</style>
