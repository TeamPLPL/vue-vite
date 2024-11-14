import { defineStore } from 'pinia';
import { ref } from 'vue'; // ref 추가

export const useAuthStore = defineStore('auth', () => {
    // 상태 변수: JWT 토큰
    const jwtToken = ref(localStorage.getItem('jwtToken'));

    // 토큰 설정 메소드
    function setJwtToken(token) {
        jwtToken.value = token;
        localStorage.setItem('jwtToken', token);
    }

    // 토큰 가져오기 메소드
    function getJwtToken() {
        return jwtToken.value;
    }

    return { jwtToken, setJwtToken, getJwtToken };
});