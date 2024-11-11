import Login from "../../components/user/Login.vue";
import Signup from "../../components/user/Signup.vue";
import CookieToHeader from "../../components/user/CookieToHeader.vue";
import MyMaker from "../../components/user/MyMaker.vue";
import MySupporter from "../../components/user/MySupporter.vue";

export default [
    {
        path: '/login',
        name :'login',
        component : Login,
    },
    {
        path: '/signup',
        name :'signup',
        component : Signup,
    },
    {
        path: '/cookie-to-header',
        name :'cookie-to-header',
        component : CookieToHeader,
    },
    {
        path: '/mywadiz/maker',
        name: 'my-maker',
        component: MyMaker
    },
    {
        path: '/mywadiz/supporter',
        name: 'my-supporter',
        component: MySupporter
    },
]