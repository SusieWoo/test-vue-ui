import axios from 'axios';
import QS from 'qs';
import { Message, MessageBox } from 'element-ui';
import { UserModule } from '@/store/modules/user';
import { getToken } from '@/utils/cookies';
import { getLocale } from '@/lang/index'
import { AppModule } from '@/store/modules/app';
import i18n from '@/lang'
const lang:any = i18n

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
    Object.assign(params, { 'token': token, '__r': Math.random() });
  } else if (method === 'post') {
    Object.assign(params, { 'token': token });
  }
  return params || {}
}

let cansubmit = true; //防止重复提交变量

// Request interceptors
service.interceptors.request.use(
  (config) => {
    let token = getToken();
    let base = {
      token: token,
      appType: 3
    };


    // TODO 在线客服tboss的uat环境，联调完再删除，筛选uat环境在线客服 无需关系,忽视-----------------------------------------------

    if (config.url && (/^(http|https):\/\/uat/.test(config.url))) {
      token = '4593c7ed4e6542f291aaef725c1a6748';
    }

    // -----------------------------------------------------------------------------------------------------


    /*这里解决调用接口问题，get的入参*/
    if (config.method === 'post') {
      config.data = config.data || {};
      dealParams(config.data, token, 'post')
    }
    if (config.method === 'get') {
      config.params = config.params || {};
      dealParams(config.params, token, 'get')
    }
    if (AppModule.lang) {
      //后端要求不论get，post，参数必须在url问号之后传入
      config.url = config.url && config.url.indexOf('?') >= 0 ? config.url + `&lang=${AppModule.lang}` : config.url + `?lang=${AppModule.lang}`
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
    console.log(response)
    if (res.resultCode !== 200 && response.config.url && response.config.url.indexOf('revgeocode.search.hereapi.com') < 0 && response.config.url !== process.env['VUE_APP_UPLOAD_FILE_API']) {
      if (res.resultCode === 500) {
        Message({
          message: lang.t('common.tips.timeOut'),
          type: 'warning',
          duration: 5 * 1000
        });
      } else if (res.resultCode === 509 || res.resultCode === 610106) {
        MessageBox.confirm(
          lang.t('common.tips.goOut'),
          lang.t('common.tips.comfirmOut'),
          {
            confirmButtonText: lang.t('common.tips.reLogin'),
            cancelButtonText: lang.t('common.cancel'),
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
      // eslint-disable-next-line prefer-promise-reject-errors
      return reject({ message: lang.t('common.tips.noRepeat') })
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
      console.log('post error ', err)
      reject(err)
    })
  });
}

export default service;
