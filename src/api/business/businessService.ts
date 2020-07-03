import request from '@/utils/request';
import Mock from './mock'
const isMock = true;
export const queryCarPropertyForMaintains = () =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/test/qdfaw/api/qingqi/sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: {
      propertyName: "1"
    }
  });
export const queryArea = (id: any) => {
  return request({
    url: 'http://sy.aerozhonghuan.com:81/test/qdfaw/api/qingqi/servicestation/activity/queryArea',
    method: 'post',
    data: {
      provinceId: id
    }
  });

}
export const carBindList = (data: any) => {
  console.log('here')
  if (isMock){
    return Mock.carBindList();
  }
  return  request({
    url: 'http://sy.aerozhonghuan.com:81/test/yiqi/app/api/faw/operate/review/carBindList',
    method: 'post',
    data: data
  });

}
export const carTeamList = (data: any) => {
  console.log('1')
  if (isMock){
    console.log('2')
    return Mock.carTeamList();
  }
  console.log('3')
  return  request({
    url: 'http://sy.aerozhonghuan.com:81/test/yiqi/app/api/faw/operate/carTeam/carTeamList',
    method: 'post',
    data: data
  });

}




