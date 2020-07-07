import request from '@/utils/request';

export const queryCar = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/pro/qdfaw/api/qingqi/system/car/queryCar',
    method: 'get',
    params
  });