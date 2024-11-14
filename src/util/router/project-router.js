import Funding from "../../components/project/Funding.vue";
import Schedule from "../../components/project/Schedule.vue";
import Intro from "../../components/project/Intro.vue";
import ProjectInfo from "../../components/project/ProjectInfo.vue";
import Reward from "../../components/project/Reward.vue";
import RewardPolicy from "../../components/project/RewardPolicy.vue";

export default [
    {
        path: '/studio/:id/project',
        name : 'Funding',
        component: Funding,
        meta: {hideHeader: true}
    },
    {
        path: '/studio/:id/project/intro',
        name : 'Intro',
        component: Intro,
        meta: {hideHeader: true}
    },
    {
        path : '/studio/:id/project/schedule',
        name : 'Schedule',
        component: Schedule,
        meta: {hideHeader: true}
    },
    {
        path : '/studio/:id/project/info',
        name : 'projectInfo',
        component: ProjectInfo,
        meta: {hideHeader: true}
    },
    {
        path: '/studio/:id/project/reward',
        name : 'reward',
        component: Reward,
        meta: {hideHeader: true}
    },
    {
        path: '/studio/:id/project/policy',
        name: 'policy',
        component: RewardPolicy,
        meta: {hideHeader: true}
    }
]