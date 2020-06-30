import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router'
import Layout from '@/components/layout/index.vue';
import nestedRouter from './modules/nested'
import businessRoutes from './modules/business'

Vue.use(Router)
export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
    meta: { hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  }
]

export const asyncRoutes: RouteConfig[] = [
  {
    path: '/about',
    component: Layout,
    redirect: '/about/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "about" */ '@/views/about/index.vue'),
        name: 'About',
        meta: {
          title: 'about',
          icon: 'link'
        }
      }
    ]
  },
  nestedRouter,
  {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "pdf" */ '@/views/pdf/index.vue'),
        name: 'PDF',
        meta: {
          title: 'pdf',
          icon: 'example'
        }
      }
    ]
  },
  
  {
    path: '/pdf-download-example',
    component: () => import(/* webpackChunkName: "pdf-download-example" */ '@/views/pdf/download.vue'),
    meta: { hidden: true }
  },
  {
    path: '/i18n',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import(/* webpackChunkName: "i18n-demo" */ '@/views/i18n-demo/index.vue'),
        name: 'I18n',
        meta: {
          title: 'i18n',
          icon: 'form'
        }
      }
    ]
  },
  businessRoutes
]

const createRouter = () => new Router({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router

