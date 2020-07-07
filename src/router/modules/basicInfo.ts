import { RouteConfig } from 'vue-router'
import Layout from '@/components/layout/index.vue'

const basicInfoRoutes: RouteConfig = {
  path: '/basicInfo',
  component: Layout,

  name: 'basicInfo',
  meta: {
    title: 'basicInfo',
    icon: 'user'
  },
  children: [
    {
      path: 'carManage',
      name: 'carManage',
      meta: { title: 'carManage' },
      component: () => import(/* webpackChunkName: "banner" */ '@/views/basicInfo/carManage.vue'),
    },
    {
        path: 'vehicleManage',
        name: 'vehicleManage',
        meta: { title: 'vehicleManage' },
        component: () => import(/* webpackChunkName: "banner" */ '@/views/businessSupport/vehicleManage.vue')
      },
  ]
}

export default basicInfoRoutes
