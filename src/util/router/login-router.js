import Login from "../../components/user/Login.vue";
import Signup from "../../components/user/Signup.vue";
import CookieToHeader from "../../components/user/CookieToHeader.vue";

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
    }
]