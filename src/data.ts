interface IBaseData {
  yOrNo: object,
  onOrOff:object
}

interface IViewData {
  operateAppScreen: object
}

// 页面通用数据
const BaseData: IBaseData = {
  yOrNo: (vm:any)=>{ return [
    { key: 1, val: vm.$t('common.data.BaseData.yOrN[0]') },
    { key: 0, val: vm.$t('common.data.BaseData.yOrNo[1]') }
  ]},
  onOrOff:(vm:any)=>{ return [
    { key: '1', value: vm.$t('common.data.BaseData.onOrOff[0]') }, 
    { key: '0', value: vm.$t('common.data.BaseData.onOrOff[1]') }
    ]}
}

// 页面专属数据
const ViewData: IViewData = {
  operateAppScreen: {
    appTypeList: (vm:any)=>{ return [
      { key: '0', value: vm.$t('common.data.ViewData.operateAppScreen.appTypeList[0]') }, 
      { key: '1', value: vm.$t('common.data.ViewData.operateAppScreen.appTypeList[1]') }, 
      { key: '2', value: vm.$t('common.data.ViewData.operateAppScreen.appTypeList[2]') }, 
      { key: '3', value: vm.$t('common.data.ViewData.operateAppScreen.appTypeList[3]') }]},
    statusList:  (vm:any)=>{ return[
      { key: '0', value: vm.$t('common.data.ViewData.operateAppScreen.statusList[0]') }, 
      { key: '1', value: vm.$t('common.data.ViewData.operateAppScreen.statusList[1]') }, 
      { key: '2', value: vm.$t('common.data.ViewData.operateAppScreen.statusList[2]') }
    ]}
  },
}

export { ViewData, BaseData }
