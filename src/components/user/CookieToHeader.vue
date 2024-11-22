<template>
    <div>
    </div>
  </template>

<script>
import axios from "axios";
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'CookieToHeader',
  setup() {
    const router = useRouter();
    const jwtToken = ref(localStorage.getItem('jwtToken') || ''); // JWT 토큰을 반응형으로 관리

    const isLoggedIn = computed(() => {
      return jwtToken.value !== ''; // 토큰이 있으면 로그인 상태
    });

    const getJwtFromBackend = async () => {
      try {
        // 백엔드로 요청하여 JWT를 헤더로 받아옴
        const response = await axios(`http://localhost:8080/api/cookie-to-header`, { withCredentials: true });

        // 헤더에서 JWT 추출
        const token = response.headers['authorization']?.split(" ")[1];

        if (token) {
          // localStorage에 JWT 저장
          localStorage.setItem('jwtToken', token);
          jwtToken.value = token; // 반응형 변수에 토큰 저장

          console.log("JWT 저장 완료:", token);

          // 이후 요청에서 Authorization 헤더에 토큰 포함
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // JWT 저장 후 "/"로 리디렉션
          router.push('/');
        } else {
          console.error("Authorization 헤더에서 토큰이 없습니다.");
        }
      } catch (error) {
        console.error("JWT를 가져오는 중 에러 발생:", error);
      }
    };

    // 페이지가 로드될 때 JWT를 가져오는 함수 실행
    getJwtFromBackend();

    // 로그아웃 함수
    const logout = () => {
      localStorage.removeItem('jwtToken'); // 로컬 스토리지에서 JWT 삭제
      jwtToken.value = ''; // 반응형 변수 초기화
      delete axios.defaults.headers.common['Authorization']; // 헤더에서 Authorization 제거
      router.push('/'); // 로그아웃 후 메인 페이지로 이동
    };

    return {
      isLoggedIn,
      logout,
    };
  }
};
</script>