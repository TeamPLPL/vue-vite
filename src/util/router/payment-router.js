import ChooseReward from "../../components/payment/ChooseReward.vue";
import ReservePayment from "../../components/payment/ReservePayment.vue";
import CompletePayment from "../../components/payment/CompletePayment.vue";
import AdminPage from "../../components/adminPage/AdminPage.vue";
import DashBoard from "../../components/adminPage/DashBoard.vue";
import MemberManage from "../../components/adminPage/MemberManage.vue";
import MemberDetail from "../../components/adminPage/MemberDetail.vue";
import ReportManage from "../../components/adminPage/ReportManage.vue";
import ProjectManage from "../../components/adminPage/ProjectManage.vue";
import CommentManage from "../../components/adminPage/CommentManage.vue";
import Participation from "../../components/participation/Participation.vue";
import ParticipationDetail from "../../components/participation/ParticipationDetail.vue";

export default [
    {
        path: "/purchase/choose/:id",
        name: "ChooseReward",
        component: ChooseReward,
        props: true,
    },
    {
        path: "/purchase/reserve/:id",
        name: "ReservePayment",
        component: ReservePayment,
        props: true,
    },
    {
        path: "/purchase/complete/:id",
        name: "CompletePayment",
        component: CompletePayment,
        props: true,
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
                meta: {hideHeader: true}
            },
            {
                path: "member",
                name: "MemberManage",
                component: MemberManage,
                meta: {hideHeader: true}
            },
            {
                path: "member/:id",
                name: "MemberDetail",
                component: MemberDetail,
                meta: {hideHeader: true}
            },
            {
                path: "report",
                name: "ReportManage",
                component: ReportManage,
                meta: {hideHeader: true}
            },
            {
                path: "project",
                name: "ProjectManage",
                component: ProjectManage,
                meta: {hideHeader: true}
            },
            {
                path: "comment",
                name: "CommentManage",
                component: CommentManage,
                meta: {hideHeader: true}
            },
        ]
    },
    {
        path: '/mywadiz/info/participation',
        name: 'Participation',
        component: Participation,
    },
    {
        path: '/mywadiz/info/participation/:id',
        name: 'ParticipationDetail',
        component: ParticipationDetail,
    },
]