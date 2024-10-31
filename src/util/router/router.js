import {createRouter, createWebHistory} from "vue-router"

import App from "../../App.vue"
import ChooseReward from "../../components/ChooseReward.vue";
import ReservePayment from "../../components/ReservePayment.vue";

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
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;