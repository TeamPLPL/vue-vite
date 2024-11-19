import { createRouter, createWebHistory } from "vue-router";
import paymentRouter from "./payment-router.js";
import loginRouter from "./login-router.js";
import mainpageRouter from "./mainpage-router.js";
import projectRouter from "./project-router.js";
import fundingRouter from "./funding-router.js";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/authStore.js";

/*
 *   작성자 : 신은호, 작성 날짜 : 24년 11월 11일
 *   0. 메인 라우터(router.js)에 { path, name, componet }직접 사용은 금지한다.
 *   1. 라우터 파일명은 케밥 스타일로 작성한다. ex) loginRouter(x), login-router(o)
 *   2. 작성한 라우터는 routes에 등록한다. ex) ...loginRouter
 *   3. 모르면 보고 따라하자^^;;
 *
 *   [참고 사항] : 앞에 붙은 ...은 **스프레드 연산자(spread operator)**로,
 *   배열이나 객체를 펼쳐서 개별 요소나 프로퍼티로 나열하는 역할을 한다.
 */
const routes = [
    ...paymentRouter,
    ...loginRouter,
    ...mainpageRouter,
    ...projectRouter,
    ...fundingRouter,
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 작성자 : 신은호, 작성 내용 : 토큰 만료 확인
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const token = localStorage.getItem("jwtToken");

    // 토큰 검증 및 초기화 함수로 분리
    const validateToken = () => {
        if (!token) return false;

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000; // 초 단위

            if (decoded.exp < currentTime) {
                alert("토큰이 만료되었습니다. 다시 로그인해 주세요.");
                authStore.logout();
                return false;
            }

            // 토큰이 유효하면 자동으로 보안 페이지 접근 권한 부여
            authStore.setSecurePageAccess(true);
            return true;
        } catch (error) {
            console.error("Token validation error:", error);
            authStore.logout();
            return false;
        }
    };

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!validateToken()) {
            next("/login");
            return;
        }

        if (
            to.matched.some((record) => record.meta.requiresSecureAccess) &&
            !authStore.canAccessSecurePage
        ) {
            next("/");
            return;
        }

        next();
    } else {
        next();
    }
});

export default router;
