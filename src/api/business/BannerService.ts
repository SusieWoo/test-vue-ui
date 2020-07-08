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
export const getCustomFilelList = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/servicestation/activity/query',
    method: 'get',
    params
  });
export const update = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/servicestation/activity/update',
    method: 'get',
    params
  });
export const setAd = (data: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/wechat/setAd',
    method: 'post',
    data
  });
export const UpdateBannerOnline = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/operate/BannerInfo/UpdateBannerOnline',
    method: 'get',
    params
  });