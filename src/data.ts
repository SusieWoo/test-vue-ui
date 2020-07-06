interface IBaseData {
  yOrNo: object
}

interface IViewData {
  operateAppScreen: object
}

// 页面通用数据
const BaseData: IBaseData = {
  yOrNo: [
    { key: 1, val: '是' },
    { key: 0, val: '否' }
  ],
}


// 页面专属数据
const ViewData: IViewData = {
  operateAppScreen: {
    appTypeList: [{ key: '0', value: '车队app' }, { key: '1', value: '司机app' }, { key: '2', value: '服务app' }, { key: '3', value: '产销app' }],
    statusList: [{ key: '0', value: '待生效' }, { key: '1', value: '生效中' }, { key: '2', value: '已失效' }]
  },
}

export { ViewData, BaseData }
