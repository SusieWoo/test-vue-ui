import Layout from '@/components/layout/index.vue'

export default {
  path: '/business',
  component: Layout,
  roleId: 10000,
  name: 'Business',
  meta: {
    title: 'business',
    icon: 'el-icon-suitcase'
  },
  children: [
    {
      path: 'appUserManage',
      name: 'AppUserManage',
      roleId: 10003,
      meta: { title: 'appUserManage' },
      component: () => import(/* webpackChunkName: "appConfig" */ '@/views/app/business/appUserManage/appUserManage.vue'),
      children: [
        {
          path: 'userManage',
          roleId: 10020,
          component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/appUserManage/userManage.vue'),
          name: 'UserManage',
          meta: { title: 'userManage' }
        }
        // {
        //   path: 'specialUser',
        //   component: () => import(/* webpackChunkName: "screen" */ '@/views/app/business/appUserManage/specialUser.vue'),
        //   name: 'SpecialUser',
        //   meta: { title: 'specialUser' }
        // }
      ]
    },
    {
      path: 'buildManager',
      name: 'BuildManager',
      meta: { title: 'buildManager', hidden: true },
      component: () => import(/* webpackChunkName: "carGroup" */ '@/views/app/business/appUserManage/buildManager.vue'),
    },
    {
      path: 'userDetail',
      name: 'UserDetail',
      meta: { title: 'userDetail', hidden: true },
      component: () => import(/* webpackChunkName: "carGroup" */ '@/views/app/business/appUserManage/userDetail.vue'),
    },
    {
      path: 'carGroup',
      name: 'CarGroup',
      roleId: 10002,
      meta: { title: 'carGroup' },
      component: () => import(/* webpackChunkName: "carGroup" */ '@/views/app/business/carGroup/index.vue'),
    },
    {
      path: 'carGroupBuild',
      name: 'CarGroupBuild',
      meta: { title: 'carGroupBuild', hidden: true },
      component: () => import(/* webpackChunkName: "carGroupBuild" */ '@/views/app/business/carGroup/build.vue'),
    },
    {
      path: 'carGroupDetail',
      name: 'CarGroupDetail',
      meta: { title: 'carGroupDetail', hidden: true },
      component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/carGroup/detail.vue'),
    },
    {
      path: 'carGroupUpdate',
      name: 'CarGroupUpdate',
      meta: { title: 'carGroupUpdate', hidden: true },
      component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/carGroup/update.vue'),
    },
    {
      path: 'faultDiagnosis',
      name: 'FaultDiagnosis',
      roleId: 10006,
      meta: { title: 'faultDiagnosis' },
      component: () => import(/* webpackChunkName: "appConfig" */ '@/views/app/business/faultDiagnosis/faultDiagnosis.vue'),
      children: [
        {
          path: 'realTimeFault',
          roleId: 10018,
          component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/faultDiagnosis/realTimeFault.vue'),
          name: 'RealTimeFault',
          meta: { title: 'realTimeFault' }
        },
        {
          path: 'faultCodeLibrary',
          roleId: 10019,
          component: () => import(/* webpackChunkName: "screen" */ '@/views/app/business/faultDiagnosis/faultCodeLibrary.vue'),
          name: 'FaultCodeLibrary',
          meta: { title: 'faultCodeLibrary' }
        }
      ]
    },
    {
      path: 'upkeep',
      name: 'upkeep',
      roleId: 10007,
      meta: { title: 'upkeep' },
      redirect: '/business/upkeep/rule',
      component: () => import(/* webpackChunkName: "upkeep" */ '@/views/app/business/upkeep/upkeep.vue'),
      children: [
        {
          path: 'rule',
          name: 'rule',
          roleId: 10026,
          meta: { title: 'rule' },
          component: () => import(/* webpackChunkName: "rule" */ '@/views/app/business/upkeep/rule/rule.vue'),
        },
        {
          path: 'manual',
          name: 'manual',
          meta: { title: 'manual' },
          component: () => import(/* webpackChunkName: "manual" */ '@/views/app/business/upkeep/manual/manual.vue'),
        },
      ]
    },
    {
      path: 'appConfig',
      name: 'AppConfig',
      roleId: 10004,
      meta: { title: 'appConfig' },
      component: () => import(/* webpackChunkName: "appConfig" */ '@/views/app/business/appConfig/appConfig.vue'),
      children: [
        {
          path: 'banner',
          roleId: 10021,
          component: () => import(/* webpackChunkName: "banner" */ '@/views/app/business/appConfig/banner/index.vue'),
          name: 'Banner',
          meta: { title: 'banner' }
        },
        {
          path: 'screen',
          roleId: 10022,
          component: () => import(/* webpackChunkName: "screen" */ '@/views/app/business/appConfig/screen/index.vue'),
          name: 'Screen',
          meta: { title: 'screen' }
        }
      ]
    },
    {
      path: 'vehicleManage',
      name: 'vehicleManage',
      roleId: 10001,
      meta: { title: 'vehicleManage' },
      component: () => import(/* webpackChunkName: "vehicleManage" */ '@/views/businessSupport/vehicleManage.vue')
    },
    {
      path: 'messageManage',
      name: 'MessageManage',
      roleId: 10005,
      meta: { title: 'messageManage' },
      component: () => import(/* webpackChunkName: "messageManage" */ '@/views/businessSupport/message/messageManage.vue')
    },
    {
      path: 'messagePush',
      name: 'MessagePush',
      meta: { title: 'messagePush', hidden: true },
      component: () => import(/* webpackChunkName: "messagePush" */ '@/views/businessSupport/message/messagePush.vue')
    },
    {
      path: 'messageSms',
      name: 'MessageSms',
      meta: { title: 'messageSms', hidden: true },
      component: () => import(/* webpackChunkName: "messageSms" */ '@/views/businessSupport/message/messageSms.vue')
    }, {
      path: 'telephone',
      name: 'Telephone',
      roleId: 10009,
      meta: { title: 'telephone' },
      component: () => import(/* webpackChunkName: "telephone" */ '@/views/app/business/telephone/index.vue'),
    },
    {
      path: 'messageStatistics',
      name: 'MessageStatistics',
      meta: { title: 'messageStatistics', hidden: true },
      component: () => import(/* webpackChunkName: "pushMessageAdd" */ '@/views/businessSupport/message/messageStatistics.vue')
    },
    // {
    //   path: 'care',
    //   name: 'care',
    //   roleId: 10008,
    //   meta: { title: 'care' },
    //   component: () => import(/* webpackChunkName: "carGroup" */ '@/views/app/business/care/index.vue'),
    // },
    // {
    //   path: 'careInfo',
    //   name: 'careInfo',
    //   meta: { title: 'careInfo', hidden: true },
    //   component: () => import(/* webpackChunkName: "carGroupBuild" */ '@/views/app/business/care/info.vue'),
    // },

  ]
}
