import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/components/Login";
import Home from "@/components/Home";
import Welcome from "@/components/Welcome";
import Users from "@/components/user/Users";
import Servers from "@/components/server/Servers";
import CreateUser from "@/components/user/CreateUser";
import CreateServer from "@/components/server/CreateServer";
import EditUser from "@/components/user/EditUser";

Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        name: 'login',
        path: '/login',
        component: Login
    },
    {
        name: "home",
        path: '/home',
        component: Home,
        redirect: '/users',
        children: [
            {
                name: 'welcome',
                path: '/welcome',
                component: Welcome
            },
            {
                name: 'users',
                path: '/users',
                component: Users,
            },
            {
                name: 'create-user',
                path: '/users/create',
                component: CreateUser,
            },
            {
                name: 'edit-user',
                path: '/users/:uid/edit',
                component: EditUser,
            },
            {
                name: 'servers',
                path: '/servers',
                component: Servers
            },
            {
                name: 'create-server',
                path: '/servers/create',
                component: CreateServer
            }
        ]
    }
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
]

const router = new VueRouter({
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const token = window.sessionStorage.getItem("accessToken");
    if (!token) {
        return next('/login');
    }
    next();
})

export default router
