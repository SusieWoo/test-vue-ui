# 笔记

## todo：
sass -》 less；用户信息存储；页面刷新 信息保留；起服务，自动弹出页面；监听修改

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




