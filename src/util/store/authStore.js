import { defineStore } from "pinia";
import { ref, computed } from "vue"; // ref 추가

export const useAuthStore = defineStore("auth", () => {
    // 상태 변수: JWT 토큰
    // const jwtToken = ref(null);
    const jwtToken = ref(localStorage.getItem("jwtToken"));
    const userInfo = ref(null);

    const canAccessSecurePage = ref(false);
    const isInitialized = ref(false); // 상태 복구 여부
    // 컴퓨티드 속성: 인증 상태
    const isAuthenticated = computed(() => !!jwtToken.value || false);

    // 토큰 설정 메소드
    function setJwtToken(token) {
        jwtToken.value = token;
        localStorage.setItem("jwtToken", token);

        // 토큰 디코딩 및 사용자 정보 추출
        userInfo.value = parseJwt(token);
    }

    // 토큰 가져오기 메소드
    function getJwtToken() {
        if (!jwtToken.value) {
            // localStorage에서 토큰 로드
            const tokenFromStorage = localStorage.getItem("jwtToken");
            if (tokenFromStorage) {
                setJwtToken(tokenFromStorage);
            }
        }
        return jwtToken.value;
    }

    // JWT 디코딩 함수에 에러 처리 추가
    function parseJwt(token) {
        try {
            if (!token) return null;

            const base64Url = token.split(".")[1];
            if (!base64Url) return null;

            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map(
                        (c) =>
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    )
                    .join("")
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Token parsing error:", error);
            return null;
        }
    }

    function getUserInfo() {
        return userInfo.value;
    }

    // 초기화 함수
    function initializeStore() {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            jwtToken.value = token;
            userInfo.value = parseJwt(token);
            canAccessSecurePage.value = true; // 토큰이 있으면 접근 권한 부여
            console.log("Store initialized with user info:", userInfo.value);
        }
        isInitialized.value = true; // 상태 복구 완료
    }

    // 보안 페이지 접근 권한 설정
    function setSecurePageAccess(value) {
        canAccessSecurePage.value = value;
    }

    // 새로고침 전 상태 저장
    function saveStateBeforeReload() {
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo.value));
        sessionStorage.setItem(
            "secureAccess",
            JSON.stringify(canAccessSecurePage.value)
        );
    }

    // 새로고침 후 상태 복구
    function restoreStateAfterReload() {
        const savedUserInfo = sessionStorage.getItem("userInfo");
        const savedSecureAccess = sessionStorage.getItem("secureAccess");

        if (savedUserInfo) {
            userInfo.value = JSON.parse(savedUserInfo);
        }

        if (savedSecureAccess) {
            canAccessSecurePage.value = JSON.parse(savedSecureAccess);
        }

        isInitialized.value = true; // 상태 복구 완료
    }

    // function logout() {
    //     jwtToken.value = null;
    //     userInfo.value = null;
    //     canAccessSecurePage.value = false;
    //     isInitialized.value = false;
    //     localStorage.removeItem("jwtToken");
    //     sessionStorage.clear(); // 세션 스토리지 초기화
    // }

    // 로그아웃
    // function logout() {
    //     resetState();
    //     localStorage.removeItem("jwtToken");
    // }

    // 로그아웃 함수 수정
    async function logout() {
        try {
            // 서버에 로그아웃 요청 (필요한 경우)
            await fetch("/api/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${getJwtToken()}`,
                },
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            resetState();
            localStorage.removeItem("jwtToken");
            sessionStorage.clear();
            location.reload();
        }
    }

    function resetState() {
        jwtToken.value = null;
        userInfo.value = null;
        canAccessSecurePage.value = false;
    }

    /////////////////////////
    // JWT 만료 시간 확인 함수
    function isTokenExpired(token) {
        if (!token) return true;
        const decodedToken = parseJwt(token);
        if (!decodedToken) return true;
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    }
    // 토큰 유효성 검사 및 갱신 함수
    async function checkAndRefreshToken() {
        const token = getJwtToken();
        if (token && isTokenExpired(token)) {
            // try {
            //     // 리프레시 토큰을 사용하여 새 토큰 요청
            //     const response = await fetch("/api/refresh-token", {
            //         method: "POST",
            //         headers: {
            //             Authorization: `Bearer ${token}`,
            //         },
            //     });
            //     if (response.ok) {
            //         const { newToken } = await response.json();
            //         setJwtToken(newToken);
            //     } else {
            //         // 리프레시 실패 시 로그아웃 처리
            //         await handleTokenExpiration();
            //     }
            // } catch (error) {
            //     console.error("Token refresh failed:", error);
            //     await handleTokenExpiration();
            // }
            console.log("TokenExpired");
            await handleTokenExpiration();
        }
    }
    // 토큰 만료 처리 함수
    async function handleTokenExpiration() {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        await logout();
        router.push("/login");
    }
    //////////////////////////////

    return {
        jwtToken,
        setJwtToken,
        getJwtToken,
        getUserInfo,
        initializeStore,
        saveStateBeforeReload,
        restoreStateAfterReload,
        isAuthenticated,
        canAccessSecurePage,
        setSecurePageAccess,
        isInitialized,
        logout,
        checkAndRefreshToken,
        handleTokenExpiration,
    };
});
