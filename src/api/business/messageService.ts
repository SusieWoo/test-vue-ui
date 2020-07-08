import request from '@/utils/request';


export const noticeList = (data: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/notice/queryNoticeList',
    method: 'post',
    data: data
  });
};

export const brandList = (params: any) =>
  request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/common/brandList',
    method: 'get',
    params
  });

export const carSeriesList = (params: any) =>
  request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/common/seriseList',
    method: 'get',
    params
  });

export const carTypeList = (params: any) =>
  request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/common/activityModelList',
    method: 'get',
    params
  });

export const newNotice = (data: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/notice/newNotice',
    method: 'post',
    data: data
  });
};


export const resendNotice = (data: any) => {
  return request({
    url: process.env.VUE_APP_TBOSS_API + 'yiqi/app/api/faw/operate/notice/resendNotice',
    method: 'post',
    data: data
  });
};
