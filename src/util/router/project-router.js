import Funding from "../../components/project/Funding.vue";
import Schedule from "../../components/project/Schedule.vue";
import Intro from "../../components/project/Intro.vue";

export default [
    {
        path: '/studio/:id/funding',
        name : 'Funding',
        component: Funding,
        meta: {hideHeader: true}
    },
    {
        path: '/studio/:id/intro',
        name : 'Intro',
        component: Intro,
        meta: {hideHeader: true}
    },
    {
        path : '/studio/:id/schedule',
        name : 'Schedule',
        component: Schedule,
        meta: {hideHeader: true}
    }

]