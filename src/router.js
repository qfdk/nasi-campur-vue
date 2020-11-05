import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "@/components/Home";

Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        name: 'login',
        path: '/login',
        component: () => import(/* webpackChunkName: "common" */ '@/components/Login')
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
                component: () => import(/* webpackChunkName: "common" */ '@/components/Login')
            },
            {
                name: 'users',
                path: '/users',
                component: () => import(/* webpackChunkName: "common" */ '@/components/user/Users')

            },
            {
                name: 'create-user',
                path: '/users/create',
                component: () => import(/* webpackChunkName: "common" */ '@/components/user/CreateUser')
            },
            {
                name: 'edit-user',
                path: '/users/:uid/edit',
                component: () => import(/* webpackChunkName: "common" */ '@/components/user/EditUser')
            },
            {
                name: 'servers',
                path: '/servers',
                component: () => import(/* webpackChunkName: "common" */ '@/components/server/Servers')
            },
            {
                name: 'create-server',
                path: '/servers/create',
                component: () => import(/* webpackChunkName: "common" */ '@/components/server/CreateServer')
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
