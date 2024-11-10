<script setup>
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './util/store/authStore'; // authStore import
import { usePaymentStore } from './util/store/paymentStore';
import axios from 'axios'; // axios import for handling headers
import Header from './components/common/Header.vue'
import Topbar from './components/common/Topbar.vue'
import Footer from './components/common/Footer.vue'

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore(); // authStore 사용
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
  <Topbar />
  <Header />
    <div class="app-container">
        <RouterView/>
    </div>
  <Footer />
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
