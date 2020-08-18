import Layout from '@/components/layout/index.vue'

export default {
    path: '/system',
    roleId: 20000,
    component: Layout,
    name: 'system',
    redirect: '/system/user',
    meta: {
        title: 'system',
        icon: 'el-icon-setting'
    },
    children: [
        {
            path: 'user',
            name: 'user',
            roleId: 20001,
            meta: {
                title: 'user'
            },
            component: () => import('@/views/system/user/index.vue'),
        },
        {
            path: 'user/:id',
            component: () => import('@/views/system/user/editUser.vue'),
            name: 'editUser',
            meta: { title: 'editUser', hidden: true }
        },
        {
            path: 'role',
            name: 'role',
            roleId: 20005,
            meta: {
                title: 'role'
            },
            component: () => import('@/views/system/role/index.vue'),
        },
        {
            path: 'role/:id',
            component: () => import('@/views/system/role/editRole.vue'),
            name: 'editRole',
            meta: { title: 'editRole', hidden: true }
        },
        {
            path: 'dictate',
            name: 'dictate',
            roleId: 20006,
            meta: { title: 'dictate' },
            component: () => import('@/views/system/dictate/index.vue'),
        }
    ]
}
