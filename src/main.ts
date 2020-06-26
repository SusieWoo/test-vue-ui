import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/styles/element-variables.scss';
import ElementUI from 'element-ui';
import SvgIcon from 'vue-svgicon';
import '@/icons/components';
import i18n from '@/lang'
import { AppModule } from '@/store/modules/app'
import '@/permission'
import '@/styles/index.scss'

Vue.config.productionTip = false;
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
  render: h => h(App)
}).$mount('#app');
