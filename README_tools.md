# 笔记

## todo：
sass -》 less；用户信息存储； 信息保留;websockt;时间范围；分模块引用；导入excel；下载；打印；富文本编辑器；
here地图。在线客服。表单。面包屑 里面跳转不好用

## 代码规范
所有命名用驼峰形式
所有tboss请求接口用dev环境
所有页面，写到app文件下


## 分环境打包

## JS/CSS热更新

## 起服务页面自动打开

## 多语言

.vue 文件夹中：
<el-button type="primary"  @click="goBack()"> {{$t('common.cancel')}} </el-button>

this.$t('business.appConfig.noticePic') + '1080*1920'

rule.ts 文件中：
  import i18n from '@/lang'
  const lang:any = i18n

  new Error(lang.t('rules.checkUrl'))

data.ts 文件中：

  yOrNo: (vm:any)=>{ return [
    { key: 1, val: vm.t('data.BaseData.yOrN[0]') },
    { key: 0, val: vm.t('data.BaseData.yOrNo[1]') }
  ]},

  BaseData.yOrNo(this) //组件引用时，传入this



## 兄弟组件传值

import Bus from '@/utils/bus.ts'

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

 ## 关于路由：

 ### 隐藏路由菜单
 meta: { hidden: true }

 ### 关闭当前页面，并回退
 import { TagsViewModule } from '@/store/modules/tags-view'; //引入
 TagsViewModule.delView(this.$route); //删除导航tab标签
 this.$router.go(-1); //返回

## 坑

<el-checkbox v-model="row.from1" label="车队端" name="type" @change="func" />
触发推荐用 @change="func"
若@click.native="func($event)" 则会触发两次（原因：表面上el-checkbox是一个标签，其实它是label和input两个标签 第一个事件在label上触发第二个在input上触发）。
修改办法@click.native坑的方法，用$event判断：
func(e){
        if (e.target.tagName === 'INPUT') return 
      },
 

 ## 图片上传
 <UploadImg :upload-config="uploadConfig8"
            :upload-finish="finishUpload"
            @on-upload-success="uploadSuccess"
            @on-handle-remove="handleRemove" />
 
 uploadConfig: {
        label: '图片',
        sizeLimit: 2,
        numLimt: 1,
        ruleName: 'needImg'
      }
  
  file-list 格式[{url:''}] 或者 [{name:'',url:''}]

//父组件赋值图片地址
  this.$nextTick(() => {
    this.$refs.uploadImg.changePath([{ url: this.params.imgPath }]);
  })


## @type
  types声明文件，在使用之前需要在typesearch里面查看一下相关的类库是否有声明文件，https://microsoft.github.io/TypeSearch/


## 查看大图
<el-image :src="scope.row.imgPath" :preview-src-list="[scope.row.imgPath]" fit="contain" />

## 导出

import Export from '@/components/Export'

<Export :iframe-filter="iframeFilter"
            @exportMethod="emailExcel" />

 handleDownExcel () {
      this.iframeFilter = {
        data: {
          isEmail: true
        }
      }
    },
    
async emailExcel (email) {
  await exportCarBindList(Object.assign({ email: email }, this.querys))
  this.$message.success('后台正在导出，稍后请查收邮件');
},

## 导入

<Import
  :title="'是否需要批量加车？'"                //dialog标题
  :batchAddCarVis="batchAddCarVis"            //控制dialog显示与否
  :limit="limit"                              //同时上传文件个数限制
  :action="action"                            //文件上传URL
  :accept="accept"                            //可上传文件类型
  :tip="tip"                                  //导入提示
  :demoURL="demoURL"                          //模板下载URL
  :batchAddInfo="batchAddInfo"                //导入后状态信息
  @handleSuccess = "handleSuccess"            //导入成功回调
  @cancelBatchAddCar = "cancelBatchAddCar"    //暂不添加
></Import>

  demoURL: 'http://sy.aerozhonghuan.com:81/test/yiqi/web/qdfaw/tboss/assets/import/addCarList.xlsx',
  tip: '每次批量导入最多支持1000条数据',
  accept: '.xlsx,.xls',
  action: 'http://sy.aerozhonghuan.com:81/fsm/fsevice/uploadFile',
  limit: 1,
  batchAddInfo: null,
  teamId: '',
  batchAddCarVis: false,

  cancelBatchAddCar () {
      this.batchAddCarVis = false
      if(this.$refs['buildForm']){
        this.$refs['buildForm'].resetFields()
      }
      if(this.$refs['dialogForm']){
        this.$refs['dialogForm'].resetFields()
      }
      this.batchAddInfo = null
      this.$router.go(-1)
    },
  async handleSuccess (response) {
    let params = {
      uuid: response.data.fullPath,
      fileType: response.data.ext_name,
      reviewer: this.accountName,
      teamId: this.teamId
    }
    const batchAdd = await batchAddCarList(params)
    this.batchAddInfo = batchAdd.data
  },