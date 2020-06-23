# 笔记

## todo：
sass -》 less；用户信息存储；页面刷新 信息保留。

## 分环境打包

## JS/CSS热更新

## 起服务页面自动打开

## 兄弟组件传值

import Bus from '@/common/bus.js';
Bus.$emit('XXXX-a', data);
Bus.$on('XXXX-a', (data) => {});
Bus.$off("XXXX-a")

## 分环境打包



## 请求接口
```

export const getUserInfo = (data: any) =>
  request({
    url: '/getUserInfo',
    method: 'post',
    data
  })
  
export const logout = (params: any) =>
    request({
        url: '/logout',
        method: 'get',
        params
    })
```




