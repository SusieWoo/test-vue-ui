import request from '@/utils/request';
import Mock from './mock'
const isMock = true;
export const querySeriesList = () =>
  request({
    url: 'qdfaw/api/qingqi/sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: {
      propertyName: '1'
    }
  });
export const queryCarTypeList = (data: { carSeries: String }) =>
  request({
    url: 'qdfaw/api/qingqi/sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: Object.assign({
      propertyName: '2'
    }, data)
  });
export const queryEmissionList = (data: { carSeries: String; carType: String }) =>
  request({
    url: 'qdfaw/api/qingqi/sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: Object.assign({
      propertyName: '3'
    }, data)
  });


export const queryArea = (id: any) => {
  return request({
    url: 'qdfaw/api/qingqi/servicestation/activity/queryArea',
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
    url:  'operate/emergency/queryUrgentCall',
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
export const getAdminList = (params: any) =>{
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
export const getCarList = (params: any) =>{
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
