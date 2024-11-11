import Funding from "../../components/project/Funding.vue";
import Schedule from "../../components/project/Schedule.vue";
import Intro from "../../components/project/Intro.vue";

export default [
    {
        path: '/studio/:id/funding',
        name : 'Funding',
        component: Funding
    },
    {
        path: '/studio/:id/intro',
        name : 'Intro',
        component: Intro
    },
    {
        path : '/studio/:id/schedule',
        name : 'Schedule',
        component: Schedule
    }

]