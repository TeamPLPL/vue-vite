<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './util/store/authStore'; // authStore import
import { usePaymentStore } from './util/store/paymentStore';
import axios from 'axios'; // axios import for handling headers
import Header from './components/common/Header.vue'
import Topbar from './components/common/Topbar.vue'
import Footer from './components/common/Footer.vue'
import Example from "./components/Example.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore(); // authStore 사용
const paymentStore = usePaymentStore();

// Detect if the current route requires a gray background
const isGrayBackground = computed(() => route.meta.grayBackground);

// Detect if the current route requires hiding the header
const shouldHideHeader = computed(() => route.meta.hideHeader);

const shouldHideTopbar = computed(() => route.meta.hideTopbar);

const shouldHideFooter = computed(() => route.meta.hideFooter);

const showTopButton = ref(false)

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const checkScroll = () => {
  showTopButton.value = window.scrollY > 300
}

onMounted(() => {
    // Check if payment is successful and redirect if needed
    if (paymentStore.isPaymentSuccessful) {
        router.push('/purchase/complete/:id');
        paymentStore.resetPaymentStatus();
    }
    window.addEventListener('scroll', checkScroll)
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <div>
    <div class="container-fluid">
      <Topbar class="topbar" v-if="!shouldHideTopbar" />
    </div>
    <Header v-if="!shouldHideHeader" />
    <div class="container-sm">
      <div class="app-container">
        <RouterView />
      </div>
    </div>
    <div class="">
      <Footer class="footer" v-if="!shouldHideFooter" />
    </div>  
  </div>
  <button @click="scrollToTop" id="top-btn" class="top-button" :class="{ 'show': showTopButton }">
    Top
  </button>
</template>

<style>
/* .app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
} */
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
  /* width: 100%; */
  width: 100vw;
  margin-top: auto;
  margin: 0;
}

.top-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 16px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s, visibility 0.3s;
  visibility: hidden;
  z-index: 2000; /* Footer보다 높은 z-index 설정 */
}

.top-button.show {
  opacity: 1;
  visibility: visible;
}

.top-button:hover {
  background-color: #0056b3;
}

#top-btn {
  padding: 0;
}

</style>
