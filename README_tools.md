# 笔记

## todo：
sass -》 less；用户信息存储；页面刷新 信息保留;websockt;时间范围；table和分页；分模块引用；导入excel；下载；打印；富文本编辑器；图片上传;
here地图。在线客服。表单。解决Vue-cli3.0下scss文件编译过慢、卡顿问题

## 代码规范
所有命名用驼峰形式

## 分环境打包

## JS/CSS热更新

## 起服务页面自动打开

## 兄弟组件传值

import Bus from '@/common/bus.ts';
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

## webpack
以VUE_APP_开头的变量，只有以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中，可以在客户端侧的代码中访问。访问方式：process.env.VUE_APP_<自定义变量名>

## PWA
Progressive Web Apps 是 Google 提出的用前沿的 Web 技术为网页提供 App 般使用体验的一系列方案。这篇文章里我们来完成一个非常简单的 PWA 页面。
一个 PWA 应用首先是一个网页, 可以通过 Web 技术编写出一个网页应用. 随后添加上 App Manifest 和 Service Worker 来实现 PWA 的安装和离线等功能。

## 面包屑跳转问题
把面包屑组件中 :to="item.redirect||item.path"这个改为:to="getGoToPath(item)"
// 获取当前的链接路径

getGoToPath(item) {
     if (item.path) {
          var path = item.path;
          var startPos = path.indexOf(":");

          if (startPos !== -1) {
              var endPos = path.indexOf("/", startPos);
              var key = path.substring(startPos + 1, endPos);
              path = path.replace(":" + key, this.$route.params[key]);
              return path;
       }
  }

  return item.redirect || item.path;
}

## loading 写到对应div
 v-loading.fullscreen.lock="fullscreenLoading"