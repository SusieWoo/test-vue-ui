# VUE HERE MAP
> 基于 HERE V3.1 进行封装, [HERE GUIDE](https://developer.here.com/documentation/maps/3.1.14.0/dev_guide/index.html)

##### 1. start
全局引入:
```
// 若需要加载自己的ui样式, 修改 ui-theme/mapjs-ui.css, 再进行导入覆盖
import './assets/map-ui-theme/index.css'
import HereMap from '@/components/HereMap'
Vue.use(HereMap, {
  // v3.1版本移除了 appcode 和 appid, 以 apiKey 作为替代方案
  apiKey: 'yourApiKey',
  customUICss: true
})
```