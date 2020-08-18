import Layout from '@/components/layout/index.vue'

export default {
  path: '/competition',
  roleId: 10015,
  component: Layout,
  name: 'competition',
  meta: {
    title: 'competition',
    icon: 'el-icon-s-flag'
  },
  children: [
    {
      path: 'oil',
      name: 'Oil',
      roleId: 10016,
      meta: { title: 'competition' },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/oil/index.vue'),
    }, {
      path: 'oilSet',
      name: 'OilSet',
      roleId: 10017,
      meta: { title: 'oilSet' },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/oilSet/index.vue'),
    },
    {
      path: 'oilSet/oilSetAdd',
      name: 'oilSetAdd',
      meta: { title: 'oilSetAdd', hidden: true },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/oilSet/add.vue'),
    },
    {
      path: 'oilSet/oilSetLook',
      name: 'oilSetLook',
      meta: { title: 'oilSetLook', hidden: true },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/oilSet/add.vue'),
    },
    {
      path: 'oilSet/oilSetEdit',
      name: 'oilSetEdit',
      meta: { title: 'oilSetEdit', hidden: true },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/oilSet/add.vue'),
    },
    {
      path: 'oilnew',
      name: 'oilNew',
      meta: { title: 'oilNew', hidden: true },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/oilnew/index.vue'),
    },
    {
      path: 'oilnew/look',
      name: 'oilNewLook',
      meta: { title: 'oilNewLook', hidden: true },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/oilnew/index.vue'),
    },
    {
      path: 'oilnew/edit',
      name: 'oilNewEdit',
      meta: { title: 'oilNewEdit', hidden: true },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/oilnew/index.vue'),
    },
    {
      path: 'announcement',
      name: 'Announcement',
      meta: { title: 'Announcement', hidden: true },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/announcement/index.vue'),
    },
    {
      path: 'filtration',
      name: 'Filtration',
      meta: { title: 'Filtration', hidden: true },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/filtration/index.vue'),
    },
    {
      path: 'record',
      name: 'Record',
      meta: { title: 'Record', hidden: true },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/record/index.vue'),
    },
    {
      path: 'detail',
      name: 'RecordDetail',
      meta: { title: 'RecordDetail', hidden: true },
      component: () => import(/* webpackChunkName: "oil" */ '@/views/app/competition/record/detail/index.vue')
    }
  ]
}
