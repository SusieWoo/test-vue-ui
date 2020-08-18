import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router'
import Layout from '@/components/layout/index.vue';
import nestedRouter from './modules/nested'
import businessRoutes from './modules/business'
import imRoutes from './modules/im'
import competitionRoutes from './modules/competition'
import basicInfoRoutes from './modules/basicInfo'
import monitor from './monitor/monitor'
import system from './modules/system'

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
    redirect: '/monitor',
  }
]

export const asyncRoutes: RouteConfig[] = [
  {
    path: '/about',
    component: Layout,
    redirect: '/about/index',
    meta: { hidden: true },
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
  monitor,
  businessRoutes,
  imRoutes,
  competitionRoutes,
  basicInfoRoutes,
  system
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
      .concat(businessRoutes)
      .concat(imRoutes)
      .concat(competitionRoutes)
      .concat(basicInfoRoutes)
      .concat(monitor)
      .concat(system)
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router

