import FundingDetail from "../../components/funding/FundingDetail.vue";

export default [
    {
        path: '/funding/detail/:id',
        name : 'FundingDetail',
        component: FundingDetail,
        meta: {
            hideHeader: true,
        }
    },

]