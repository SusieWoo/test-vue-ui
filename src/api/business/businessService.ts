import request from '@/utils/request';
import Mock from './mock'
const isMock = true;
export const queryCarPropertyForMaintains = () =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/dev/qdfaw/api/qingqi/sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: {
      propertyName: '1'
    }
  });
export const queryArea = (id: any) => {
  return request({
    url: 'http://sy.aerozhonghuan.com:81/dev/qdfaw/api/qingqi/servicestation/activity/queryArea',
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
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/operate/review/carBindList',
    method: 'post',
    data: data
  });
}
export const carBindDetail = (data: any) => {
  // if (isMock){
  //   return Mock.carBindList();
  // }
  return request({
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/operate/review/carBindDetail',
    method: 'post',
    data: data
  });
}
export const carUnBind = (data: any) => {
  // if (isMock){
  //   return Mock.carBindList();
  // }
  return request({
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/operate/review/carUnBind',
    method: 'post',
    data: data
  });
}
export const carTeamList = (data: any) => {
  if (isMock) {
    return Mock.carTeamList();
  }
  return request({
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/operate/carTeam/carTeamList',
    method: 'post',
    data: data
  });
}




