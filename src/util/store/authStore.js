import { defineStore } from 'pinia';
import { ref } from 'vue'; // ref 추가

export const useAuthStore = defineStore('auth', () => {
    // 상태 변수: JWT 토큰
    const jwtToken = ref(null);
    const userInfo = ref(null);

    // 토큰 설정 메소드
    function setJwtToken(token) {
        jwtToken.value = token;
        localStorage.setItem('jwtToken', token);

        // 토큰 디코딩 및 사용자 정보 추출
        userInfo.value = parseJwt(token);
    }

    // 토큰 가져오기 메소드
    function getJwtToken() {
        if (!jwtToken.value) {
            // localStorage에서 토큰 로드
            const tokenFromStorage = localStorage.getItem('jwtToken');
            if (tokenFromStorage) {
                setJwtToken(tokenFromStorage);
            }
        }
        return jwtToken.value;
    }

    // JWT 디코딩 함수
    function parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    }

    function getUserInfo() {
        return userInfo.value;
    }

    return { jwtToken, setJwtToken, getJwtToken, getUserInfo };
});