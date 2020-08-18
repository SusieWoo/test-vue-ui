import request from '@/utils/request';
import Mock from './mock'
const isMock = true;
export const querySeriesList = () =>
  request({
    url: 'sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: {
      propertyName: '1'
    }
  });
export const queryCarTypeList = (data: { carSeries: String }) =>
  request({
    url: 'sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: Object.assign({
      propertyName: '2'
    }, data)
  });
export const queryEmissionList = (data: { carSeries: String; carType: String }) =>
  request({
    url: 'sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: Object.assign({
      propertyName: '3'
    }, data)
  });
export const queryArea = (id: any) => {
  return request({
    url: 'servicestation/activity/queryArea',
    method: 'post',
    data: {
      provinceId: id
    }
  });
}
export const carBindList = (data: any) => {
  // if (isMock) {
  //   return Mock.carBindList();
  // }
  return request({
    url: 'operate/review/carBindList',
    method: 'post',
    data: data
  });
}
export const carBindDetail = (data: any) => {
  // if (isMock){
  //   return Mock.carBindList();
  // }
  return request({
    url: 'operate/review/carBindDetail',
    method: 'post',
    data: data
  });
}
export const carUnBind = (data: any) => {
  if (isMock) {
    return Mock.carBindList();
  }
  return request({
    url: 'operate/review/carUnBind',
    method: 'post',
    data: data
  });
}
export const carTeamList = (params: any) => {
  // if (isMock){
  //   return Mock.carTeamList();
  // }
  return request({
    url: 'operate/carTeam/carTeamList',
    method: 'get',
    params
  });
}
export const getManagerData = (params: any) => {
  return request({
    url: 'operate/userManage/queryCarTeamByPhone',
    method: 'get',
    params
  });
}
export const newAccount = (params: any) => {
  return request({
    url: 'operate/userManage/newAccount',
    method: 'get',
    params
  });
}
export const queryUrgentCall = (params: any) => {
  return request({
    url: 'operate/emergency/queryUrgentCall',
    method: 'get',
    params
  });
}
export const delUrgentCall = (params: any) => {
  return request({
    url: 'operate/emergency/delUrgentCall',
    method: 'get',
    params: {
      id: params
    }
  });
}
export const addTelephoneBaseList = (params: any) => {
  return request({
    url: 'operate/emergency/add/urgentCall',
    method: 'get',
    params
  });
}
export const updTelephoneList = (params: any) => {
  return request({
    url: 'operate/emergency/updUrgentCall',
    method: 'get',
    params
  });
}

export const sortUrgentCall = (params: any) => {
  return request({
    url: 'operate/emergency/sortUrgentCall',
    method: 'get',
    params
  });
}

export const batchAddCarList = (params: any) => {
  return request({
    url: 'operate/carTeam/batchAddCarList',
    method: 'get',
    params
  });
}
export const getAdminList = (params: any) => {
  return request({
    url: 'operate/carTeam/carTeamAdmin',
    method: 'get',
    params
  });
}
export const callCenter = (params: any) => {
  return request({
    url: 'operate/customerCare/callCenter',
    method: 'get',
    params
  });
}
export const getCarList = (params: any) => {
  return request({
    url: 'operate/carTeam/carList',
    method: 'get',
    params
  });
}
export const QueryRealTimeCondition = (params: any) => {
  return request({
    url: 'operate/customerCare/QueryRealTimeCondition',
    method: 'get',
    params
  });
}
export const modifyCarTeam = (params: any) => {
  return request({
    url:  '/operate/carTeam/modifyCarTeam',
    method: 'get',
    params
  });
}
export const delCarTeamManager = (params: any) => {
  return request({
    url: 'operate/carTeam/delCarTeamManager',
    method: 'get',
    params
  });
}
/*保养管理*/
export const queryDataDict = (params: any) => {
  return request({
    url: '/operate/queryDataDict',
    method: 'get',
    params: {
      code: 'M087'
    }
  });
}
export const queryMaintainSet = (params: any) => {
  return request({
    url: '/operate/queryMaintainSet',
    method: 'get',
  });
}
export const maintainSet = (params: any) => {
  return request({
    url: '/operate/maintainSet',
    method: 'get',
    params
  });
}
export const getMaintainItemList = (params: any) => {
  return request({
    url: '/operate/getMaintainItemList',
    method: 'get',
    params
  });
}
export const editMaintainItem = (data: any,type: any) => {
  return request({
    url: type == 2 ? '/operate/editMaintainItem' : '/operate/saveMaintainItem',
    method: 'post',
    data: data
  });
}
export const importMaintainItem = (params: any) => {
  return request({
    url: '/operate/importMaintainItem',
    method: 'post',
    data:params
  });
}
export const delMaintainItem = (maintainItemId: any) =>{
  return request({
    url: '/operate/delMaintainItem',
    method: 'post',
    data: {
      maintainItemId: maintainItemId
    }
  });
}

// 终端管理列表
export const queryTerminalList = (data: any) => {
  return request({
    url: 'system/terminal/search',
    method: 'post',
    data: data
  });
}
// system/termodel/listTerModel
export const listTerModel = (params: any) => {
  return request({
    url: 'system/termodel/listTerModel',
    method: 'get',
    params
  });
}
// system/district/queryDistrictTip经销商管理所属区域
export const queryDistrictTip = (params: any) => {
  return request({
    url: 'system/district/queryDistrictTip',
    method: 'get',
    params
  });
}
//system/dealer/querySDealer
export const querySDealer = (params: any) => {
  return request({
    url: 'system/dealer/querySDealer',
    method: 'get',
    params
  });
}
// 启用禁用经销商system/dealer/enableOrDisable
export const enableOrDisable = (params: any) => {
  return request({
    url: 'system/dealer/enableOrDisable',
    method: 'post',
    data: params
  });
}
// 删除经销商system/dealer/delDealer
export const delDealer = (params: any) => {
  return request({
    url: 'system/dealer/delDealer',
    method: 'post',
    data: params
  });
}
// 导出经销商system/dealer/exportSDealer
export const exportSDealer = (params: any) => {
  return request({
    url: 'system/dealer/exportSDealer',
    method: 'post',
    data: params
  });
}

export const addCarTeamManager = (params: any) =>{
  return request({
    url: 'operate/carTeam/addCarTeamManager',
    method: 'get',
    params
  });
}
export const addCarByVin = (params: any) =>{
  return request({
    url: 'operate/carTeam/addCarByVin',
    method: 'get',
    params
  });
}
export const addCarTeamCar = (params: any) =>{
  return request({
    url: 'operate/carTeam/addCarTeamCar',
    method: 'get',
    params
  });
}
export const userListNew = (data: any) => {
  return request({
    url: 'operate/userManage/userListNew',
    method: 'post',
    data: data
  });
}
export const modifyCarTeamVip = (params: any) =>{
  return request({
    url: 'operate/carTeam/modifyCarTeamVip',
    method: 'get',
    params
  });
}
//system/district/queryDistrict
export const queryDistrictList = (params: any) =>{
  return request({
    url: 'system/district/queryDistrict',
    method: 'get',
    params
  });
}
// qingqi/system/deleteDistrict
export const deleteDistrict = (params: any) =>{
  return request({
    url: 'system/deleteDistrict',
    method: 'get',
    params
  });
}
// qingqi/system/addDistrict
export const addOrEditDistrict = (params: any, update: Boolean) =>{
  return request({
    url: !update ? 'system/addDistrict' : 'system/updateDistrict',
    method: 'get',
    params
  });
}
export const carTeamListExcel = (params: any) =>{
  return request({
    url: 'operate/carTeam/carTeamListExcel',
    method: 'get',
    params
  })
}
// system/updateDistrict
//system/getDistrict
export const getDistrict = (params: any) =>{
  return request({
    url: 'system/getDistrict',
    method: 'get',
    params
  });
}
export const userListExcelNew = (data: any) => {
  return request({
    url: 'operate/userManage/userListExcelNew',
    method: 'post',
    data: data
  });
}
export const queryCarTeamByName = (params: any) =>{
  return request({
    url: 'operate/userManage/queryCarTeamByName',
    method: 'get',
    params
  });
}
// system/dealer/addDealer
export const addOrEditDealer = (data: any, type: Number) =>{
  return request({
    url: type === 1 ? 'system/dealer/addDealer' : 'system/dealer/updateDealer',
    method: 'post',
    data
  });
}

//system/terminal/importTerminal
export const importTerminal = (data: any) =>{
  return request({
    url: 'system/terminal/importTerminal',
    method: 'post',
    data
  });
}
//system/terminal/protocol
export const protocol = (data: any) =>{
  return request({
    url: 'system/terminal/protocol',
    method: 'post',
    data
  });
}
//system/baseData
export const getBaseData = (data: any) =>{
  return request({
    url: 'system/baseData',
    method: 'post',
    data
  });
}
//system/terminal/add
export const addOrEditTerminal = (data: any, type: string) =>{
  return request({
    url: `system/terminal/${type}`,
    method: 'post',
    data
  });
}
// system/terminal/detail
export const getTerminalDetail = (data: any) =>{
  return request({
    url: 'system/terminal/detail',
    method: 'post',
    data
  });
}
//system/dealer/getSDealer
export const getSDealerDetail = (params: any) =>{
  return request({
    url: 'system/dealer/getSDealer',
    method: 'get',
    params
  });
}
export const userBaseInfo = (params: any) =>{
  return request({
    url: 'operate/userManage/userBaseInfo',
    method: 'get',
    params
  });
}
export const userInfoCar = (params: any) =>{
  return request({
    url: 'operate/userManage/userInfoCar',
    method: 'get',
    params
  });
}
export const userInfoCarTeam = (params: any) =>{
  return request({
    url: 'operate/userManage/userInfoCarTeam',
    method: 'get',
    params
  });
}
export const queryCarFaultList = (data: any) =>{
  return request({
    url: 'operate/queryCarFaultList',
    method: 'post',
    data
  });
}
export const exportRealtimeCarFaultList = (data: any) => {
  return request({
    url: 'operate/exportRealtimeCarFaultList',
    method: 'post',
    data: data
  });
}
export const queryCarFaultBaseList = (data: any) => {
  return request({
    url: 'sellbusiness/queryCarFaultBaseList',
    method: 'post',
    data: data
  });
}
export const delCarFaultBaseInfo = (params: any) =>{
  return request({
    url: 'sellbusiness/delCarFaultBaseInfo',
    method: 'get',
    params
  });
}
export const exportCarFaultBaseList = (data: any) => {
  return request({
    url: 'sellbusiness/exportCarFaultBaseList',
    method: 'post',
    data: data
  });
}
export const importCarFaultBaseInfo = (data: any) => {
  return request({
    url: 'sellbusiness/importCarFaultBaseInfo',
    method: 'post',
    data: data
  });
}
export const saveCarFaultBaseInfo = (data: any) => {
  return request({
    url: 'sellbusiness/saveCarFaultBaseInfo',
    method: 'post',
    data: data
  });
}
export const queryCarFaultBaseInfo = (data: any) => {
  return request({
    url: 'sellbusiness/queryCarFaultBaseInfo',
    method: 'post',
    data: data
  });
}
export const queryCarFaultFmiList = (params: any) =>{
  return request({
    url: 'sellbusiness/queryCarFaultFmiList',
    method: 'get',
    params
  });
}
export const queryFaultGroupList = (data: any) => {
  return request({
    url: 'sellbusiness/queryFaultGroupList',
    method: 'post',
    data: data
  });
}
export const queryDataDictList = (params: any) =>{
  return request({
    url: 'sellbusiness/queryDataDictList',
    method: 'get',
    params
  });
}
export const queryAllEngineBrand = (data: any) => {
  return request({
    url: 'sellbusiness/queryAllEngineBrand',
    method: 'post',
    data: data
  });
}
export const queryAllEngineModel = (data: any) => {
  return request({
    url: 'sellbusiness/queryAllEngineModel',
    method: 'post',
    data: data
  });
}
export const exportFaultGroupList = (data: any) => {
  return request({
    url: 'sellbusiness/exportFaultGroupList',
    method: 'post',
    data: data
  });
}
export const queryFaultGroupInfo = (data: any) => {
  return request({
    url: 'sellbusiness/queryFaultGroupInfo',
    method: 'post',
    data: data
  });
}
export const delFaultGroupInfo = (data: any) => {
  return request({
    url: 'sellbusiness/delFaultGroupInfo',
    method: 'post',
    data: data
  });
}
export const saveFaultGroupInfo = (data: any) => {
  return request({
    url: 'sellbusiness/saveFaultGroupInfo',
    method: 'post',
    data: data
  });
}
