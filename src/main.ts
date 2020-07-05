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
import '@/styles/index.scss'

import HereMap from '@/components/HereMap'

Vue.config.productionTip = false;

console.log(HereMap)
Vue.use(HereMap, {
  apiKey: 'W2tAflEZh_G8e84lx8ZmLtlQ9gFR5DAflxIBf0J_X9A',
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
