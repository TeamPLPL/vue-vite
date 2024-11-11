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
  <div class="app-container">
    <Topbar class="topbar" />
    <Header />
    <RouterView />
    <Footer class="footer" />
  </div>
</template>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}
.footer {
  position: sticky;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  margin-top: auto;
}
</style>
