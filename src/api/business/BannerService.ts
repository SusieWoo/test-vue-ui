import request from '@/utils/request';
type makeUrl = { (url: string): string };
let makeUrl = (url: string) => {
  let base: any = process.env.VUE_APP_TBOSS_API
  if (base === 'http://uat-iov-ec.fawjiefang.com.cn/') {
    return process.env.VUE_APP_TBOSS_API + 'app/api/faw/' + url
  } else {
    return process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/' + url
  }
}

export const QueryBannerInfo = (params: any) =>
  request({
    url: makeUrl('operate/BannerInfo/QueryBannerInfo'),
    method: 'get',
    params
  });

export const MoveBannerInfo = (params: any) =>
  request({
    url: makeUrl('operate/BannerInfo/MoveBannerInfo'),
    method: 'get',
    params
  });
export const DelBannerInfo = (id: any) =>
  request({
    url: makeUrl('operate/BannerInfo/DelBannerInfo'),
    method: 'post',
    data: {
      id: id
    }
  });
export const getCustomFilelList = (params: any) =>
  request({
    url: makeUrl('servicestation/activity/query'),
    method: 'get',
    params
  });
export const update = (params: any) =>
  request({
    url: makeUrl('servicestation/activity/update'),
    method: 'get',
    params
  });
export const setAd = (data: any) =>
  request({
    url: makeUrl('wechat/setAd'),
    method: 'post',
    data
  });
export const UpdateBannerOnline = (params: any) =>
  request({
    url: makeUrl('operate/BannerInfo/UpdateBannerOnline'),
    method: 'get',
    params
  });
// APP banner配置 - 新建
export const AddBannerInfo = (params: any) =>
  request({
    url: makeUrl('operate/BannerInfo/AddBannerInfo'),
    method: 'get',
    params
  });
// APP banner配置 - 修改
export const UpdateBannerInfo = (params: any) =>
  request({
    url: makeUrl('operate/BannerInfo/UpdateBannerInfo'),
    method: 'get',
    params
  });