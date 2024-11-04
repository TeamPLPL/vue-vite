<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePaymentStore } from './util/store/paymentStore';
// import HelloWorld from './components/HelloWorld.vue'

const router = useRouter();
const paymentStore = usePaymentStore();

onMounted(() => {
  // 결제 성공 상태를 확인하여 리디렉션
  if (paymentStore.isPaymentSuccessful) {
    router.push('/web/wpurchase/reward/complete');
    paymentStore.resetPaymentStatus(); // 상태 초기화
  }
});
</script>

<template>
  <div>
    <button class="btn btn-primary">Hello World</button>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <div class="app-container">
    <!-- RouterView만 렌더링 -->
    <RouterView />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
