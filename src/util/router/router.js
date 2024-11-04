import {createRouter, createWebHistory} from "vue-router"

import App from "../../App.vue"
import ChooseReward from "../../components/payment/ChooseReward.vue";
import ReservePayment from "../../components/payment/ReservePayment.vue";
import CompletePayment from "../../components/payment/CompletePayment.vue";
import AdminPage from "../../components/adminPage/AdminPage.vue";
import DashBoard from "../../components/adminPage/DashBoard.vue";
import MemberManage from "../../components/adminPage/MemberManage.vue";
import ReportManage from "../../components/adminPage/ReportManage.vue";
import ProjectManage from "../../components/adminPage/ProjectManage.vue";
import CommentManage from "../../components/adminPage/CommentManage.vue";
import MemberDetail from "../../components/adminPage/MemberDetail.vue";

const routes = [
    {
        path: "/",
        name: "App",
        component: App,
    },
    {
        path: "/web/wpurchase/reward/step10",
        name: "ChooseReward",
        component: ChooseReward,
    },
    {
        path: "/web/wpurchase/reward/step20",
        name: "ReservePayment",
        component: ReservePayment,
    },
    {
        path: "/web/wpurchase/reward/complete",
        name: "CompletePayment",
        component: CompletePayment,
    },
    {
        path: "/admin",
        name: "AdminPage",
        component: AdminPage,
        redirect: "/admin/dashboard",
        children: [
            {
                path: "dashboard",
                name: "DashBoard",
                component: DashBoard,
            },
            {
                path: "member",
                name: "MemberManage",
                component: MemberManage,
            },
            {
                path: "member/:id",
                name: "MemberDetail",
                component: MemberDetail,
            },
            {
                path: "report",
                name: "ReportManage",
                component: ReportManage,
            },
            {
                path: "project",
                name: "ProjectManage",
                component: ProjectManage,
            },
            {
                path: "comment",
                name: "CommentManage",
                component: CommentManage,
            },
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;