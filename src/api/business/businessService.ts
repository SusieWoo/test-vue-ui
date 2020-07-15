import request from '@/utils/request';
import Mock from './mock'
const isMock = true;
export const querySeriesList = () =>
  request({
    url: process.env.VUE_APP_TBOSS_API + 'qdfaw/api/qingqi/sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: {
      propertyName: '1'
    }
  });
export const queryCarTypeList = (data: { carSeries: String }) =>
  request({
    url: process.env.VUE_APP_TBOSS_API + 'qdfaw/api/qingqi/sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: Object.assign({
      propertyName: '2'
    }, data)
  });
export const queryEmissionList = (data: { carSeries: String; carType: String }) =>
  request({
    url: process.env.VUE_APP_TBOSS_API + 'qdfaw/api/qingqi/sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: Object.assign({
      propertyName: '3'
    }, data)
  });


export const queryArea = (id: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'qdfaw/api/qingqi/servicestation/activity/queryArea',
    method: 'post',
    data: {
      provinceId: id
    }
  });
}
export const carBindList = (data: any) => {
  if (isMock) {
    return Mock.carBindList();
  }
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/review/carBindList',
    method: 'post',
    data: data
  });
}
export const carBindDetail = (data: any) => {
  // if (isMock){
  //   return Mock.carBindList();
  // }
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/review/carBindDetail',
    method: 'post',
    data: data
  });
}
export const carUnBind = (data: any) => {
  if (isMock) {
    return Mock.carBindList();
  }
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/review/carUnBind',
    method: 'post',
    data: data
  });
}
export const carTeamList = (data: any) => {
  // if (isMock) {
  //   return Mock.carTeamList();
  // }
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/carTeam/carTeamList',
    method: 'post',
    data: data
  });
}
export const getManagerData = (params: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/userManage/queryCarTeamByPhone',
    method: 'get',
    params
  });
}
export const newAccount = (params: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/userManage/newAccount',
    method: 'get',
    params
  });
}
export const queryUrgentCall = (params: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/emergency/queryUrgentCall',
    method: 'get',
    params
  });
}
export const delUrgentCall = (params: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/emergency/delUrgentCall',
    method: 'get',
    params: {
      id: params
    }
  });
}
export const addTelephoneBaseList = (params: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/emergency/add/urgentCall',
    method: 'get',
    params
  });
}
export const updTelephoneList = (params: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/emergency/updUrgentCall',
    method: 'get',
    params
  });
}

export const sortUrgentCall = (params: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/emergency/sortUrgentCall',
    method: 'get',
    params
  });
}

export const batchAddCarList = (params: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/carTeam/batchAddCarList',
    method: 'get',
    params
  });
}

export const callCenter = (params: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/customerCare/callCenter',
    method: 'get',
    params
  });
}

export const QueryRealTimeCondition = (params: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/customerCare/QueryRealTimeCondition',
    method: 'get',
    params
  });
}

