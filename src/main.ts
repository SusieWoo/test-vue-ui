import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
// import '@/styles/element-variables.scss';
import '@/styles/element-main.scss';

import ElementUI from 'element-ui';
import SvgIcon from 'vue-svgicon';
import '@/icons/components';
import i18n from '@/lang'
import { AppModule } from '@/store/modules/app'
import '@/permission'
import { hasPermission } from '@/hasPermission'
import '@/styles/index.scss'

import './assets/map-ui-theme/index.css'
import HereMap from '@/components/HereMap/index.ts'

import moment from 'moment'
Vue.prototype.$moment = moment

Vue.prototype.$EventBus = new Vue()
Vue.config.productionTip = false;

Vue.use(HereMap, {
  apiKey: process.env.VUE_APP_API_KEY,
  customUICss: true
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
});
Vue.use(ElementUI, {
  size: AppModule.size, // Set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value)
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');

declare module 'vue/types/vue' {
  interface Vue {
    $UPLOAD_API: any
  }
}
Vue.prototype.$UPLOAD_API = process.env.VUE_APP_UPLOAD_API
Vue.prototype.hasPerm = hasPermission
