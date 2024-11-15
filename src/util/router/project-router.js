import Funding from "../../components/project/Funding.vue";
import Schedule from "../../components/project/Schedule.vue";
import Intro from "../../components/project/Intro.vue";
import ProjectInfo from "../../components/project/ProjectInfo.vue";
import Reward from "../../components/project/Reward.vue";
import RewardPolicy from "../../components/project/RewardPolicy.vue";

export default [
    {
        path : '/studio/:projectId/project/',
        component: Funding,
        props: true,
        meta: {hideHeader: true}
    },
    {
        path: '/studio/:projectId/project/intro',
        name : 'Intro',
        component: Intro,
        props: true,
        meta: {hideHeader: true}
    },
    {
        path : '/studio/:projectId/project/schedule',
        name : 'Schedule',
        component: Schedule,
        props: true,
        meta: {hideHeader: true}
    },
    {
        path : '/studio/:projectId/project/info',
        name : 'projectInfo',
        component: ProjectInfo,
        props: true,
        meta: {hideHeader: true}
    },
    {
        path: '/studio/:projectId/project/reward',
        name : 'reward',
        component: Reward,
        props: true,
        meta: {hideHeader: true}
    },
    {
        path: '/studio/:projectId/project/policy',
        name: 'policy',
        component: RewardPolicy,
        props: true,
        meta: {hideHeader: true}
    }
]