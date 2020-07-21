import request, { post } from '@/utils/request';

export const queryCar = (params: any) =>
  request({
    url: 'system/car/queryCar',
    method: 'get',
    params
  });

export const queryCarBasicData = (params: any) =>
  request({
    url: 'system/car/queryBasicData',
    method: 'get',
    params
  });
export const getBaseData = (params: any) =>
  request({
    url: 'system/baseData',
    method: 'get',
    params
  });
export const queryTerminal = (params: any) =>
  request({
    url: 'system/car/queryTerminal',
    method: 'get',
    params
  });

export const queryBusinesses = (params: any) =>
  request({
    url: 'system/queryBusinesses',
    method: 'get',
    params
  });


export const queryDealer = (params: any) =>
  request({
    url: 'system/car/queryDealer',
    method: 'get',
    params
  });


//防止重复提交
export const operateCar = (p: object) => post('system/lockEnable/operat', p, true);

export const downloadCar = (p: object) => post('system/car/downloadCar', p, true);


export const updateCar = (p: object) => post('system/car/updateCar', p, true);
