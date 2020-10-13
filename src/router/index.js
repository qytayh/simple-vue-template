import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 素材管理
  {
    path: '/dxf',
    component: Layout,
    redirect: '/dxf/category',
    meta: {
      title: 'dxf管理',
      icon: 'plane' 
    },
    children: [
      {
        path: 'category',
        name: 'category',
        component: () => import('@/views/dxf/category'),
        meta: {
          title: '目录管理',
        }
      },
      {
        path: 'glassSolution',
        name: 'glassSolution',
        component: () => import('@/views/dxf/glassSolution'),
        meta: {
          title: '玻璃方案管理',
        }
      },
      {
        path: 'screenSolution',
        name: 'screenSolution',
        component: () => import('@/views/dxf/screenSolution'),
        meta: {
          title: '纱网方案管理',
        }
      },
      {
        path: 'tlzposSolution',
        name: 'tlzposSolution',
        component: () => import('@/views/dxf/tlzposSolution'),
        meta: {
          title: '轨道方案管理',
        }
      },
      {
        path: 'series',
        name: 'series',
        component: () => import('@/views/dxf/series'),
        meta: {
          title: '系列管理',
        }
      },
      
    ]
  },

  //测试页面
  // {
  //   path: '/',
  //   component: Layout,
  //   children: [{
  //     path: 'test',
  //     name: 'test',
  //     component: () => import('@/views/test/test'),
  //     meta: {
  //       title: '测试',
  //     }
  //   }]
  // },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
