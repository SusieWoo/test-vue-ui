import request, { post } from '@/utils/request';

export const queryCar = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/pro/qdfaw/api/qingqi/system/car/queryCar',
    method: 'get',
    params
  });

export const queryCarBasicData = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/pro/qdfaw/api/qingqi/system/car/queryBasicData',
    method: 'get',
    params
  });
export const queryBasicData = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/pro/qdfaw/api/qingqi/system/car/queryBasicData',
    method: 'get',
    params
  });


//防止重复提交
export const operateCar = (p: object) => post('http://sy.aerozhonghuan.com:81/pro/qdfaw/api/qingqi/system/lockEnable/operat', p, true);




export const downloadCar = (p: object) => post('http://sy.aerozhonghuan.com:81/pro/qdfaw/api/qingqi/system/car/downloadCar', p, true);


export const queryDealer = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/pro/qdfaw/api/qingqi/system/car/queryDealer',
    method: 'get',
    params
  });