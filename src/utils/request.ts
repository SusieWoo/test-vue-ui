import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import { UserModule } from '@/store/modules/user';
import { getToken } from '@/utils/cookies';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
});



// Request interceptors
service.interceptors.request.use(
  (config) => {
    let token: string | undefined = 'ef6ea00da7e34fa1b211cbf1cbe0b341';
    if (config.url === '/getUserInfo') {
      token = getToken();
    }
    let base = {
      token: token,
      appType: 3
    };
    /*这里解决调用接口问题，get的入参*/
    if (config.method === 'post') {
      config.data = config.data || {};
      Object.assign(config.data, base);
    }
    if (config.method === 'get') {
      config.params = config.params || {};
      Object.assign(config.params, base);
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // Some example codes here:
    // code == 200: success
    // code == 507: invalid access token
    // code == 500: time out
    // code == 506: err
    // You can change this part for your own usage.
    const res = response.data;
    if (res.resultCode !== 200) {
      if (res.resultCode === 500) {
        MessageBox.confirm(
          'timeout',
          'Log out',
          {
            confirmButtonText: 'Relogin',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken();
          location.reload(); // To prevent bugs from vue-router
        });
      } else if (res.resultCode === 509) {
        MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken()
          location.reload() // To prevent bugs from vue-router
        })
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return response.data;
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
