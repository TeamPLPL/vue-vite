import Funding from "../../components/funding/Funding.vue";
import FundingDetail from "../../components/funding/FundingDetail.vue";
import FundingNotice from "../../components/funding/FundingNotice.vue";
import FundingBoard from "../../components/funding/FundingBoard.vue";
import FundingInfo from "../../components/funding/FundingInfo.vue";

export default [
    {
        path: '/funding/:id',
        name: 'Funding',
        component: Funding,
        meta: { hideHeader: true, showDetailHeader: true },
        redirect: (to) => {
            // `id` 파라미터를 사용하여 기본 페이지로 리디렉션
            return `/funding/${to.params.id}/detail`;
        },
        children: [
            {
                path: 'detail',
                component: FundingDetail,
                meta: { hideHeader: true, showDetailHeader: true },
            },
            {
                path: 'notice',
                component: FundingNotice,
                meta: { hideHeader: true, showDetailHeader: true },
            },
            {
                path: 'board', 
                component: FundingBoard,
                meta: { hideHeader: true, showDetailHeader: true },
            },
            {
                path: 'info', 
                component: FundingInfo,
                meta: { hideHeader: true, showDetailHeader: true },
            },
        ]
    },
];
