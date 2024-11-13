import Funding from "../../components/project/Funding.vue";
import Schedule from "../../components/project/Schedule.vue";
import Intro from "../../components/project/Intro.vue";
import ProjectInfo from "../../components/project/ProjectInfo.vue";

export default [
    {
        path: '/studio/:id/project',
        name : 'Funding',
        component: Funding
    },
    {
        path: '/studio/:id/project/intro',
        name : 'Intro',
        component: Intro
    },
    {
        path : '/studio/:id/project/schedule',
        name : 'Schedule',
        component: Schedule
    },
    {
        path : '/studio/:id/project/info',
        name : 'projectInfo',
        component: ProjectInfo
    }

]