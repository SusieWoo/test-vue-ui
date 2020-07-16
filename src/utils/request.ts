import axios from 'axios';
import QS from 'qs';
import { Message, MessageBox } from 'element-ui';
import { UserModule } from '@/store/modules/user';
import { getToken } from '@/utils/cookies';

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000
})
interface props {
  [proppName: string]: any
}
let dealParams = (params: props, token: string | undefined, method: string): props => {
  //get 方法，去掉空值
  if (method === 'get') {
    Object.keys(params).forEach(item => {
      if (!params[item] && params[item] !== 0) {
        delete params[item]
      }
    });
  }
  Object.assign(params, { 'token': token, '__r': Math.random() });
  return params || {}
}

let cansubmit = true; //防止重复提交变量

// const CancelToken = axios.CancelToken
// const source = CancelToken.source()

// Request interceptors
service.interceptors.request.use(
  (config) => {
    let token = getToken();
    let base = {
      token: token,
      appType: 3
    };
    // if (config.cancelToken) {
    //   config.cancelToken = source.token
    // }


    /*这里解决调用接口问题，get的入参*/
    if (config.method === 'post') {
      config.data = config.data || {};
      dealParams(config.data, token, 'post')
    }
    if (config.method === 'get') {
      config.params = config.params || {};
      dealParams(config.params, token, 'get')
    }

    return config;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log('Request canceled', error.message)
    } else {
      Promise.reject(error);
    }
  }
);

// source.cancel('取消上次请求')

// Response interceptors
service.interceptors.response.use(
  (response) => {
    // Some example codes here:
    // code == 200: success
    // code == 507: invalid access token
    // code == 500: time out
    // code == 506: err
    // code == 670205: 导出条数超过3000，选择发送到邮箱
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
      } else if (res.resultCode === 670205) {
        return res;
      } else if (res.resultCode === 610191) {
          Message({
              message: res.message || 'Error',
              type: 'error',
              duration: 5 * 1000
          });
          return response.data;
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



/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 * @param {bool} isLazy [防止重复提交]
 */
export function post(url: string, params: object, isLazy: boolean) {
  // let cansubmit = true;
  return new Promise((resolve, reject) => {
    if (!cansubmit) {
      return reject({ message: '不可重复提交' })
    }
    if (isLazy) {
      cansubmit = false;
      let timer = setTimeout(() => {
        cansubmit = true;
        clearTimeout(timer);
      }, 2000);
    }
    service.request({
      url: url,
      method: 'post',
      data: params,
    }).then(res => {
      resolve(res);
    }).catch(err => {
      console.log("post error ", err)
      reject(err)
    })
  });
}

export default service;
