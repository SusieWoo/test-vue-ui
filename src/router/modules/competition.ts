import { RouteConfig } from 'vue-router'
import Layout from '@/components/layout/index.vue'

const competitionRoutes: RouteConfig = {
  path: '/competition',
  component: Layout,
  name: 'competition',
  meta: {
    title: 'competition',
    icon: 'user'
  },
  children: [
    {
      path: 'oil',
      name: 'oil',
      meta: { title: 'competition' },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/oil/index.vue'),
    }, {
      path: 'oil',
      name: 'oil',
      meta: { title: 'competition' },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/oil/index.vue'),
    },
  ]
}

export default competitionRoutes
