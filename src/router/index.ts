import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Layout from '@/components/layout/index.vue'


Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: '/login',
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        meta: {
          title: 'Dashboard',
          icon: 'dashboard'
        }
      }
    ]
  },
  {
    path: '/about',
    component: Layout,
    redirect: '/about',
    children: [
      {
        path: '/about',
        component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
        meta: {
          title: 'About',
          icon: 'user'
        }
      }
    ]
  },
];

const router = new VueRouter({
  routes
});

export default router;
