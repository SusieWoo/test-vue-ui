import request from '@/utils/request'

export const getUserInfo = () =>
  request({
    url: '/getUserInfo',
    method: 'post'
  })

export const login = (data: any) =>
  request({
    url: '/login',
    method: 'post',

    data:Object.assign(data,{
        autoLogin : 1,
        captcha : "",
        deviceId : 0,
        deviceType : 0,
        product : "qingqi",
        versionNo : "1.1.00"
    })
  })

export const logout = (params: any) =>
    request({
        url: '/logout',
        method: 'get',
        params
    })