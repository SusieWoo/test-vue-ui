import Layout from '@/components/layout/index.vue'

export default {
    path: '/im',
    roleId: 10011,
    component: Layout,
    children: [
        {
            path: 'index',
            roleId: 10011,
            component: () => import(/* webpackChunkName: "im" */ '@/views/app/im/index.vue'),
            name: 'Im',
            meta: {
                title: 'im',
                icon: 'el-icon-service'
            }
        }
    ]
}
