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
      path: 'app-config',
      name: 'App-config',
      meta: { title: 'app-config' },
      component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/app-config/app-config.vue'),
      children: [
        {
          path: 'banner',
          component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/app-config/banner/index.vue'),
          name: 'Banner',
          meta: { title: 'banner' }
        },
        {
          path: 'screen',
          component: () => import(/* webpackChunkName: "screen" */ '@/views/app/business/app-config/screen/index.vue'),
          name: 'Screen',
          meta: { title: 'screen' }
        }
      ]
    },
    
  ]
}

export default businessRoutes
