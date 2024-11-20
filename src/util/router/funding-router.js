import Funding from "../../components/funding/Funding.vue";
import FundingDetail from "../../components/funding/FundingDetail.vue";
import FundingNotice from "../../components/funding/FundingNotice.vue";
import FundingBoard from "../../components/funding/FundingBoard.vue";
import FundingInfo from "../../components/funding/FundingInfo.vue";
import NoticeDetail from "../../components/funding/NoticeDetail.vue";

export default [
    {
        path: "/funding/:id",
        name: "Funding",
        component: Funding,
        meta: { hideHeader: true, showDetailHeader: true },
        redirect: (to) => {
            return `/funding/${to.params.id}/detail`;
        },
        children: [
            {
                path: "detail",
                name: "FundingDetail",
                component: FundingDetail,
                meta: { hideHeader: true, showDetailHeader: true },
            },
            {
                path: "notice",
                name: "FundingNotice",
                component: FundingNotice,
                meta: { hideHeader: true, showDetailHeader: true },
            },
            {
                path: "notice/detail",
                name: "NoticeDetail",
                component: NoticeDetail,
                meta: { hideHeader: true, showDetailHeader: true },
                props: (route) => ({
                    noticeId: route.query.noticeId,
                }),
            },
            {
                path: "board",
                name: "FundingBoard",
                component: FundingBoard,
                meta: { hideHeader: true, showDetailHeader: true },
            },
            {
                path: "info",
                name: "FundingInfo",
                component: FundingInfo,
                meta: { hideHeader: true, showDetailHeader: true },
            },
        ],
    },
];
