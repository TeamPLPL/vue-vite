<template>
    <div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useAuthStore } from '../../util/store/authStore';
  
  export default {
    name: 'CookieToHeader',
    setup() {
      const authStore = useAuthStore();
  
      const getJwtFromBackend = async () => {
        try {
          // 백엔드로 요청하여 JWT를 헤더로 받아옴
          const response = await axios.get("http://localhost:8080/api/cookie-to-header", { withCredentials: true });
          
          // 헤더에서 JWT 추출
          const token = response.headers['authorization'].split(" ")[1];
          
          // Pinia 스토어에 JWT 저장
          authStore.setJwtToken(token);
          
          console.log("JWT 저장 완료:", token);

          // JWT 저장 후 "/"로 리디렉션
          window.location.href = "/";
          
        } catch (error) {
          console.error("JWT를 가져오는 중 에러 발생:", error);
        }
      };
  
      getJwtFromBackend();
  
      return {};
    }
  };

  </script>