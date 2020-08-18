import Layout from '@/components/layout/index.vue';
export default {
  id: 'monitor',
  path: '/monitor',
  roleId: 20022,
  component: Layout,
  /*重定向，当用户访问时，路径会自动变化*/
  redirect: '/monitor/car',
  name: 'monitor',
  meta: {
    title: 'monitor',
    icon: 'el-icon-map-location',

  },
  children: [{
    path: 'car',
    name: 'carmonitor',
    roleId: 20023,
    component: () => import(/* webpackChunkName: "monitorGroup" */  '@/views/monitor/car/car.vue'),
    meta: {
      title: 'carMonitor',
      keepAlive: 'true',
      icon: 'el-icon-map-location',
    }
  },
  {
    path: 'car/info',
    name: 'carInfo',
    hidden: true,
    roleId: '',
    component: () => import(/* webpackChunkName: "monitorGroup" */ '@/views/monitor/car/info.vue'),
    meta: {
      title: 'carDetail',
      father_path: '/car/car',
      father_title: '车辆监控',
      hidden: true
    }
  }
  ]
}
