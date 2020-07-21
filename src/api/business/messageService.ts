import request from '@/utils/request';

// 推送消息列表
export const noticeList = (params: any) =>
  request({
    url: 'operate/notice/queryNoticeList',
    method: 'get',
    params
  });

// 车辆品牌
export const brandList = (params: any) =>
  request({
    url: 'operate/common/brandList',
    method: 'get',
    params
  });

// 车系
export const carSeriesList = (params: any) =>
  request({
    url: 'operate/common/seriseList',
    method: 'get',
    params
  });

// 车型
export const carTypeList = (params: any) =>
  request({
    url: 'operate/common/activityModelList',
    method: 'get',
    params
  });

// 根据手机号或者底盘号获取用户
export const userIdByPhoneAndVin = (params: any) =>
    request({
        url: 'operate/getUserIdByPhoneAndVin',
        method: 'get',
        params
    });

// 新增推送消息
export const newNotice = (data: any) => {
  return request({
    url: 'operate/notice/newNotice',
    method: 'post',
    data: data
  });
};

// 重发-推送消息详情
export const resendNotice = (data: any) => {
  return request({
    url: 'operate/notice/resendNotice',
    method: 'post',
    data: data
  });
};

// 短消息列表
export const smsMessageList = (params: any) =>
    request({
        url: 'operate/msgManageGetSendedSMSList',
        method: 'get',
        params
    });

// 新增短消息
export const newSms = (data: any) => {
    return request({
        url: 'operate/msgManageSendSMS',
        method: 'post',
        data: data
    });
};

// 重发-短消息详情
export const resendSms = (params: any) =>
    request({
        url: 'operate/msgManageReSendSMS',
        method: 'get',
        params
    });

// 统计-发送端
export const smsMsgTypeList = (params: any) =>
    request({
        url: 'operate/queryStatisticsSMSType',
        method: 'get',
        params
    });

// 统计-类型
export const statisticsSmsList = (params: any) =>
    request({
        url: 'operate/queryStatisticsSMSList',
        method: 'get',
        params
    });


// 统计-详情
export const statisticsSmsDetail = (params: any) =>
    request({
        url: 'operate/msgStatisticsSMSDetailList',
        method: 'get',
        params
    });
