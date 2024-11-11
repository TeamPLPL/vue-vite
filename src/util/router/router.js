import {createRouter, createWebHistory} from "vue-router"
import paymentRouter from "./payment-router.js";
import loginRouter from "./login-router.js";
import mainpageRouter from "./mainpage-router.js";
import projectRouter from "./project-router.js";

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
    ...projectRouter
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;