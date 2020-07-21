import Layout from '@/components/layout/index.vue';
export default {
  id: 'monitor',
  path: '/monitor',
  component: Layout,
  /*重定向，当用户访问时，路径会自动变化*/
  redirect: '/monitor/car',
  name: 'monitor',
  meta: {
    title: '车辆监控',
    icon: 'ic-monitor'
  },
  children: [{
    path: 'car',
    wholePath: '/monitor/car',
    name: 'car',
    roleId: 1,
    component: () =>import(/* webpackChunkName: "monitorGroup" */  '@/views/monitor/car/car.vue'),
    meta: {
      title: '车辆监控',
      icon: 'ic-monitor',
      keepAlive: 'true'
    }
  }, {
    path: 'car/info',
    wholePath: '/monitor/car/info',
    name: 'carInfo',
    hidden: true,
    roleId: '',
    component: () =>import(/* webpackChunkName: "monitorGroup" */ '@/views/monitor/car/info.vue'),
    meta: {
      title: '车辆详情',
      father_path: '/car/car',
      father_title: '车辆监控'
    }
  },
    {
      path: 'car/real',
      wholePath: '/monitor/car/real',
      name: 'real',
      hidden: true,
      roleId: '',
      component: () =>  import(/* webpackChunkName: "monitorGroup" */ '@/views/monitor/car/real.vue'),
      meta: {
        title: '实时在途',
        father_path: '/car/car',
        father_title: '车辆监控'
      }
    },
    {
      path: 'car/reproduce',
      wholePath: '/monitor/car/reproduce',
      name: 'reproduce',
      hidden: true,
      roleId: '',
      component: () =>import(/* webpackChunkName: "monitorGroup" */ '@/views/monitor/car/reproduce.vue'),
      meta: {
        title: '在途重现',
        father_path: '/car/car',
        father_title: '车辆监控'
      }
    }
  ]
}
