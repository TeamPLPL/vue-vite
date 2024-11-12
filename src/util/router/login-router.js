import Login from "../../components/user/Login.vue";
import Signup from "../../components/user/Signup.vue";
import CookieToHeader from "../../components/user/CookieToHeader.vue";
import MyMaker from "../../components/user/MyMaker.vue";
import MySupporter from "../../components/user/MySupporter.vue";
import Info from "../../components/user/Info.vue";
import FindIdPwd from "../../components/user/FindIdPwd.vue";
import ModifyProfile from "../../components/user/ModifyProfile.vue";
import UpdatePwd from "../../components/user/UpdatePwd.vue";
import DropoutUser from "../../components/user/DropoutUser.vue";

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
        path: '/find/idpwd',
        name : 'find-id',
        component: FindIdPwd
    },
    {
        path: '/cookie-to-header',
        name :'cookie-to-header',
        component : CookieToHeader,
    },
    {
        path: '/mywadiz/maker',
        name: 'mywadiz-maker',
        component: MyMaker
    },
    {
        path: '/mywadiz/supporter',
        name: 'mywadiz-supporter',
        component: MySupporter
    },
    {
        path: '/mywadiz/info',
        name: 'mywadiz-info',
        component: Info
    },
    {
        path: '/mywadiz/info/modifyprofile',
        name: 'modifyprofile',
        component: ModifyProfile
    },
    {
        path: '/mywadiz/info/updatepwd',
        name: 'updatepwd',
        component: UpdatePwd
    },
    {
        path: '/mywadiz/info/dropoutuser',
        name: 'dropoutuser',
        component: DropoutUser
    }

]