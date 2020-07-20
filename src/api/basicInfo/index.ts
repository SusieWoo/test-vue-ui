import request, { post } from '@/utils/request';
const base = process.env.VUE_APP_TSP_API

export const queryCar = (params: any) =>
  request({
    url: base + 'system/car/queryCar',
    method: 'get',
    params
  });

export const queryCarBasicData = (params: any) =>
  request({
    url: base + 'system/car/queryBasicData',
    method: 'get',
    params
  });
export const getBaseData = (params: any) =>
  request({
    url: base + 'system/baseData',
    method: 'get',
    params
  });
export const queryTerminal = (params: any) =>
  request({
    url: base + 'system/car/queryTerminal',
    method: 'get',
    params
  });

export const queryBusinesses = (params: any) =>
  request({
    url: base + 'system/queryBusinesses',
    method: 'get',
    params
  });


export const queryDealer = (params: any) =>
request({
  url: base + 'system/car/queryDealer',
  method: 'get',
  params
});


//防止重复提交
export const operateCar = (p: object) => post(base + 'system/lockEnable/operat', p, true);

export const downloadCar = (p: object) => post(base + 'system/car/downloadCar', p, true);


export const updateCar = (p: object) => post(base + 'system/car/updateCar', p, true);
