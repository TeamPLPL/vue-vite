import Login from "../../components/user/Login.vue";
import Signup from "../../components/user/Signup.vue";
import CookieToHeader from "../../components/user/CookieToHeader.vue";
import MyMaker from "../../components/user/MyMaker.vue";
import MySupporter from "../../components/user/MySupporter.vue";
import Info from "../../components/user/userComponents/Info.vue";
import FindIdPwd from "../../components/user/FindIdPwd.vue";
import ModifyProfile from "../../components/user/ModifyProfile.vue";
import UpdatePwd from "../../components/user/UpdatePwd.vue";
import Address from "../../components/common/Address.vue";
import DropoutUser from "../../components/user/DropoutUser.vue";

export default [
    {
        path: "/login",
        name: "login",
        component: Login,
        meta: {
            hideHeader: true,
            hideTopbar: true,
            hideFooter: true,
        },
    },
    {
        path: "/signup",
        name: "signup",
        component: Signup,
        meta: {
            hideHeader: true,
            hideTopbar: true,
            hideFooter: true,
        },
    },
    {
        path: "/find/idpwd",
        name: "find-id",
        component: FindIdPwd,
        meta: { hideHeader: true },
    },
    {
        path: "/cookie-to-header",
        name: "cookie-to-header",
        component: CookieToHeader,
        meta: {
            hideHeader: true,
            hideTopbar: true,
            hideFooter: true,
            requiresAuth: true,
            requiresSecureAccess: true,
        },
    },
    {
        path: "/mywadiz/maker",
        name: "mywadiz-maker",
        component: MyMaker,
        meta: {
            hideHeader: true,
            requiresAuth: true,
            requiresSecureAccess: true,
        },
    },
    {
        path: "/mywadiz/supporter",
        name: "mywadiz-supporter",
        component: MySupporter,
        meta: {
            hideHeader: true,
            requiresAuth: true,
            requiresSecureAccess: true,
        },
    },
    {
        path: "/mywadiz/info/modifyprofile",
        name: "modifyprofile",
        component: ModifyProfile,
        meta: {
            hideHeader: true,
            requiresAuth: true,
            requiresSecureAccess: true,
        },
    },
    {
        path: "/mywadiz/info/updatepwd",
        name: "updatepwd",
        component: UpdatePwd,
        meta: {
            hideHeader: true,
            requiresAuth: true,
            requiresSecureAccess: true,
        },
    },
    {
        path: '/mywadiz/info/deliveryAddress',
        name: 'address',
        component: Address,
        meta: {
            hideHeader: true,
            requiresAuth: true,
            requiresSecureAccess: true,
        }
    },
    {
        path: "/mywadiz/info/dropoutuser",
        name: "dropoutuser",
        component: DropoutUser,
        meta: {
            hideHeader: true,
            requiresAuth: true,
            requiresSecureAccess: true,
        },
    },
];
