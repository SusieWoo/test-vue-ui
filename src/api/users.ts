import request from '@/utils/request';

export const getUserInfo = () =>
  request({
    url: process.env.VUE_APP_TSP_API + 'authority/getUserInfoByToken',
    method: 'post',
  });

export const getVerifyCode = (verifyId: any) =>
    request({
        url: process.env.VUE_APP_TSP_API + 'authority/getVerifyCode',
        method: 'get',
        params: {
            verifyCodeId: verifyId
        }
    });

export const isShowVerifyCode = (userName: any) =>
    request({
        url: process.env.VUE_APP_TSP_API + 'authority/isSendMsg',
        method: 'get',
        params: {
            userName: userName
        }
    })

export const getMsgCode = (params: any) =>
    request({
        url: process.env.VUE_APP_TSP_API + 'authority/getCode',
        method: 'get',
        params: {
            verifyCodeId: params.mobileVerifyCodeId,
            userName: params.userName,
            password: params.password
        }
    })

export const resetPassword = (data: any) =>
    request({
        url: process.env.VUE_APP_TSP_API + 'authority/updatePassword',
        method: 'post',
        data
    })

export const login = (data: any) =>
  request({
    url: process.env.VUE_APP_TSP_API + 'authority/login',
    method: 'post',
    data: Object.assign(data, {
        confirmLoginFlg: '0'
    })
  });

export const logout = (params: any) =>
  request({
    url: process.env.VUE_APP_TSP_API + 'authority/logout',
    method: 'get',
    params
  });
