import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '仪表板', icon: 'dashboard' }
    }]
  },
  {
    path: '/users',
    component: Layout,
    redirect: '/users/list',
    name: 'Users',
    meta: { title: '用户管理', icon: 'peoples' },
    children: [
      {
        name: 'list-user',
        path: '/users/list',
        component: () => import('@/views/users/list'),
        meta: { title: '用户列表', icon: 'table' }
      },
      {
        name: 'create-user',
        path: '/users/create',
        component: () => import('@/views/users/create'),
        meta: { title: '新建用户', icon: 'user' }
      },
      {
        name: 'edit-user',
        path: '/users/:uid/edit',
        component: () => import('@/views/users/edit'),
        meta: { title: '编辑用户', icon: 'tree' },
        hidden: true
      }
    ]
  },
  {
    path: '/servers',
    component: Layout,
    redirect: '/servers/list',
    name: 'Servers',
    meta: { title: '节点管理', icon: 'el-icon-s-help' },
    children: [
      {
        name: 'list-server',
        path: '/servers/list',
        component: () => import('@/views/servers/list'),
        meta: { title: '节点列表', icon: 'table' }
      },
      {
        name: 'create-server',
        path: '/servers/create',
        component: () => import('@/views/servers/create'),
        meta: { title: '新建节点', icon: 'tree' }
      },
      {
        name: 'edit-server',
        path: '/servers/:uid/edit',
        component: () => import('@/views/servers/edit'),
        meta: { title: '编辑节点', icon: 'tree' },
        hidden: true
      }
    ]
  },
  {
    path: 'main',
    component: Layout,
    children: [
      {
        path: 'https://de.qfdk.me',
        meta: { title: '主站', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/speed') return next()
  if (to.path === '/login') return next()

  const token = window.localStorage.getItem('accessToken')
  if (!token) {
    return next('/login')
  }
  next()
})

export default router
