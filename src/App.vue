<script setup>
import { ref, provide, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './util/store/authStore'; // authStore import
import { usePaymentStore } from './util/store/paymentStore';
import axios from 'axios'; // axios import for handling headers
import Header from './components/common/Header.vue'
import Topbar from './components/common/Topbar.vue'
import Footer from './components/common/Footer.vue'
import FundingDetailHeader from './components/funding/FundingDetailHeader.vue'; // Import FundingDetailHeader
import Example from "./components/Example.vue";
import wishlistStore from "./util/scripts/wishlistStore"

provide('wishlistStore', wishlistStore);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore(); // authStore 사용
const paymentStore = usePaymentStore();

// 새로고침 이벤트 핸들러
const reloadPage = () => {
  authStore.saveStateBeforeReload(); // 상태 저장
  window.location.reload(); // 페이지 새로고침
};

// Detect if the current route requires a gray background
const isGrayBackground = computed(() => route.meta.grayBackground);

// Detect if the current route requires hiding the header
const shouldHideHeader = computed(() => route.meta.hideHeader);

const shouldHideTopbar = computed(() => route.meta.hideTopbar);

const shouldHideFooter = computed(() => route.meta.hideFooter);

const isDetailPage = computed(() => {
  return route.path.startsWith('/funding/') && route.name !== 'Funding';
});

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
  window.addEventListener('beforeunload', authStore.saveStateBeforeReload); // 새로고침 전 상태 저장
  authStore.restoreStateAfterReload(); // 새로고침 후 상태 복구
  authStore.initializeStore(); // 인증 상태 초기화
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

//////////////

// const selectedCategory = ref(null);

// const handleCategorySelected = (category) => {
//   selectedCategory.value = category;
// };
const handleCategorySelected = (category) => {
  router.push({
    name: 'Category',
    params: { type: category.type, id: category.id },
    query: { name: category.name }
  });
};
</script>

<template>
  <div id="app-vue-container">
    <div class="container-fluid">
      <Topbar class="topbar" v-if="!shouldHideTopbar" />
    </div>
    <Header v-if="!shouldHideHeader" @category-selected="handleCategorySelected" />
    <FundingDetailHeader v-if="isDetailPage" />
    <div class="container-sm">
      <div class="app-container">
        <!-- <RouterView :selected-category="selectedCategory" /> -->
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
#app-vue-container {
  min-width: 400px;
  position: relative;
  overflow-x: hidden;
}

@media screen and (max-width: 767px) {
  #app-vue-container {
    min-width: 100%;
    width: 100%;
  }
}

.app-container {
  padding-top: 38px;
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
  z-index: 2000;
  /* Footer보다 높은 z-index 설정 */
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
