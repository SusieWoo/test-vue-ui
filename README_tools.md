# 笔记

## todo：
sass -》 less；用户信息存储；页面刷新 信息保留;websockt;时间范围；table和分页；分模块引用；导入excel；下载；打印；富文本编辑器；图片上传


## 分环境打包

## JS/CSS热更新

## 起服务页面自动打开

## 兄弟组件传值

this.$bus.$emit('XXXX-a', data);
this.$bus.$on('XXXX-a', (data) => {});
this.$bus.$off("XXXX-a")

## 按需引入elementUi

使用了element官网的方案实现按需引入，注引入el-scrollbar等类似的隐藏组件时，需要手动在element包中修改。
如未使用ts，则可以忽略。

# types文件夹中加入scrollbar.d.ts文件，入参根据引入组件不同，自行添加

import { ElementUIComponent } from './component'

export declare class ElScrollbar extends ElementUIComponent {

  name:'scrollbar' ;

}

# element-ui.d.ts文件中加入一行

export class Scrollbar extends ElScrollbar {}


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




