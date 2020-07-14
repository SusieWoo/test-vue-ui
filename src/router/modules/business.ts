import { RouteConfig } from 'vue-router'
import Layout from '@/components/layout/index.vue'

const businessRoutes: RouteConfig = {
  path: '/business',
  component: Layout,

  name: 'Business',
  meta: {
    title: 'business',
    icon: 'user'
  },
  children: [
    {
      path: 'carGroup',
      name: 'CarGroup',
      meta: { title: 'carGroup' },
      component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/carGroup/index.vue'),
    },
    {
      path: 'carGroupBuild',
      name: 'CarGroupBuild',
      meta: { title: 'carGroupBuild', hidden: true },
      component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/carGroup/build.vue'),
    },
    {
      path: 'carGroupDetail',
      name: 'CarGroupDetail',
      meta: { title: 'carGroupDetail'},
      component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/carGroup/detail.vue'),
    },
    {
      path: 'appConfig',
      name: 'AppConfig',
      meta: { title: 'appConfig' },
      component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/appConfig/appConfig.vue'),
      children: [
        {
          path: 'banner',
          component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/appConfig/banner/index.vue'),
          name: 'Banner',
          meta: { title: 'banner' }
        },
        {
          path: 'screen',
          component: () => import(/* webpackChunkName: "screen" */ '@/views/app/business/appConfig/screen/index.vue'),
          name: 'Screen',
          meta: { title: 'screen' }
        }
      ]
    },
    {
      path: 'vehicleManage',
      name: 'vehicleManage',
      meta: { title: 'vehicleManage' },
      component: () => import(/* webpackChunkName: "banner" */ '@/views/businessSupport/vehicleManage.vue')
    },
    {
      path: 'messageManage',
      name: 'MessageManage',
      meta: { title: 'messageManage' },
      component: () => import(/* webpackChunkName: "messageManage" */ '@/views/businessSupport/message/messageManage.vue')
    },
    {
      path: 'messagePush',
      name: 'MessagePush',
      meta: { title: 'messagePush', hidden: true },
      component: () => import(/* webpackChunkName: "pushMessageAdd" */ '@/views/businessSupport/message/messagePush.vue')
    },
    {
      path: 'messageSms',
      name: 'MessageSms',
      meta: { title: 'messageSms', hidden: true },
      component: () => import(/* webpackChunkName: "pushMessageAdd" */ '@/views/businessSupport/message/messageSms.vue')
    },
    {
      path: 'messageStatistics',
      name: 'MessageStatistics',
      meta: { title: 'messageStatistics', hidden: true },
      component: () => import(/* webpackChunkName: "pushMessageAdd" */ '@/views/businessSupport/message/messageStatistics.vue')
    },
  ]
}

export default businessRoutes
