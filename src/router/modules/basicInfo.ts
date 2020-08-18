import Layout from '@/components/layout/index.vue'

export default {
  path: '/basicInfo',
  component: Layout,
  roleId: 20008,
  name: 'basicInfo',
  meta: {
    title: 'basicInfo',
    icon: 'el-icon-help'
  },
  children: [
    {
      path: 'carManage',
      name: 'carManage',
      roleId: 20009,
      meta: { title: 'carManage' },
      component: () => import(/* webpackChunkName: "banner" */ '@/views/basicInfo/carManage.vue'),

    },
    {
      path: 'carManage/:id/:type',
      component: () => import(/* webpackChunkName: "banner" */ '@/views/basicInfo/editCar.vue'),
      name: 'editCar',
      meta: { title: 'editCar', hidden: true }
    },
    {
      path: 'terminalList',
      name: 'terminalList',
      roleId: 20013,
      meta: { title: 'terminalList' },
      component: () => import(/* webpackChunkName: "terminalList" */ '@/views/app/business/terminal/terminalManage.vue'),
    },
    {
      path: 'terminalAddAndEdit',
      name: 'terminalAddAndEdit',
      meta: { title: 'terminalAddAndEdit', hidden: true },
      component: () => import(/* webpackChunkName: "terminalEdit" */ '@/views/app/business/terminal/addAndEdit.vue'),
    },
    {
      path: 'dealerManagement',
      name: 'dealerManagement',
      roleId: 20016,
      meta: { title: 'dealerManagement' },
      component: () => import(/* webpackChunkName: "terminalList" */ '@/views/app/business/dealerManagement/index.vue'),
    },
    {
      path: 'dealerAddAndEdit',
      name: 'dealerAddAndEdit',
      meta: { title: 'terminalAddAndEdit', hidden: true },
      component: () => import(/* webpackChunkName: "terminalEdit" */ '@/views/app/business/dealerManagement/addAndEdit.vue'),
    },
    {
      path: 'saleAreas',
      name: 'saleAreas',
      roleId: 20019,
      meta: { title: 'saleAreas' },
      component: () => import(/* webpackChunkName: "terminalEdit" */ '@/views/app/business/saleAreas/index.vue'),
    },
    {
      path: 'saleAreasAddAndEdit',
      name: 'saleAreasAddAndEdit',
      meta: { title: 'terminalAddAndEdit', hidden: true },
      component: () => import(/* webpackChunkName: "terminalEdit" */ '@/views/app/business/saleAreas/addAndEdit.vue'),
    },
  ]
}
