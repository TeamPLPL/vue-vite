<template>
  <div>
    <h1>Pinia 테스트</h1>
    <button @click="setToken">토큰 설정</button>
    <button @click="getToken">토큰 가져오기</button>
    <p>토큰 값: {{ token }}</p>
  </div>
</template>

<script>
import { useAuthStore } from '../util/store/authStore.js';
import { ref } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();
    const token = ref('');

    // 토큰 설정 예제
    const setToken = () => {
      authStore.setJwtToken('테스트_토큰');
    };

    // 토큰 가져오기 예제
    const getToken = () => {
      token.value = authStore.getJwtToken();
      console.log('현재 토큰:', token.value); // 콘솔 출력으로 확인
    };

    return { setToken, getToken, token };
  },
};
</script>
