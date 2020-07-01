import request from '@/utils/request';

export const QueryBannerInfo = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/operate/BannerInfo/QueryBannerInfo',
    method: 'get',
    params
  });

export const MoveBannerInfo = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/operate/BannerInfo/MoveBannerInfo',
    method: 'get',
    params
  });
export const DelBannerInfo = (id: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/operate/BannerInfo/DelBannerInfo',
    method: 'post',
    data: {
      id: id
    }
  });