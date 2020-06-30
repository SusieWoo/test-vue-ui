import request from '@/utils/request';

export const QueryBannerInfo = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/test/yiqi/app/api/faw/operate/BannerInfo/QueryBannerInfo',
    method: 'get',
    params
  });