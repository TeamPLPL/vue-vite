import { defineStore } from 'pinia';
import { ref } from 'vue'; // ref 추가

export const useAuthStore = defineStore('auth', () => {
    // 상태 변수: JWT 토큰
    // `jwtToken`은 로그인 시 할당된 JWT 토큰을 저장하는 상태 변수로,
    // 다양한 컴포넌트에서 이 토큰을 필요로 할 때 접근할 수 있도록 함.
    const jwtToken = ref(null);

    // 토큰 설정 메소드
    // `setJwtToken` 메소드는 로그인 성공 후 받은 토큰을 `jwtToken` 상태 변수에 할당함.
    // 이를 통해 다른 컴포넌트나 Axios 인터셉터에서 이 토큰을 사용할 수 있게 됨.
    function setJwtToken(token) {
        jwtToken.value = token;
    }

    // 토큰 가져오기 메소드
    // `getJwtToken` 메소드는 저장된 토큰을 반환하는 역할을 함.
    // 토큰이 필요한 요청에서 이 메소드를 호출하여 토큰을 쉽게 가져올 수 있음.
    function getJwtToken() {
        return jwtToken.value;
    }

    // 반환된 객체에는 상태 변수와 메소드가 포함되어 있으며,
    // 다른 컴포넌트나 모듈에서 `useAuthStore`를 호출하여 이를 사용할 수 있음.
    return { jwtToken, setJwtToken, getJwtToken };
});
