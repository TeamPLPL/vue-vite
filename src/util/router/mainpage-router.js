import Mainpage from "../../components/common/MainComponent.vue";
import CategoryView from '../../components/common/CategoryView.vue';

export default [
    {
        path: '/',
        name :'mainpage',
        component : Mainpage
    },
    {
        path: '/category/:type/:id',
        name: 'Category',
        component: CategoryView,
        props: true
    },
]