import request from '@/utils/request';

type makeUrl = { (url: string): string };
let makeUrl = (url: string) => {
    return 'https://uat-iov-ec.fawjiefang.com.cn/app/api/faw' + url;
}

export const logged = (params: any) =>
    request({
        url: makeUrl('/operate/validateLogin'),
        method: 'get',
        params
    });
export const queryUserInfo = (params: any) =>
    request({
        url: makeUrl('/crm/queryUserInfo'),
        method: 'get',
        params
    });
export const serviceDialogList = (params: any) =>
    request({
        url: makeUrl('/crm/serviceDialogList'),
        method: 'get',
        params
    });

export const dialogDetail = (params: any) =>
    request({
        url: makeUrl('/crm/dialogDetail'),
        method: 'get',
        params
    });

export const dialogSearch = (params: any) =>
    request({
        url: makeUrl('/crm/dialogSearch'),
        method: 'get',
        params
    });
// crm/closeDialog
export const closeDialog = (params: any) =>
    request({
        url: makeUrl('/crm/closeDialog'),
        method: 'get',
        params // dialogId: 190
    });
// crm/cancelDialogTimeout
export const cancelDialogTimeout = (params: any) =>
    request({
        url: makeUrl('/crm/cancelDialogTimeout'),
        method: 'get',
        params // dialogId: 190
    });

// crm/queryCarList
export const queryCarList = (params: any) =>
    request({
        url: makeUrl('/crm/queryCarList'),
        method: 'get',
        params // dialogId: 190
    });
export const queryCarDetailInfo = (params: any) =>
    request({
        url: makeUrl('/crm/queryCarDetailInfo'),
        method: 'get',
        params // dialogId: 190
    });
//sellbusiness/queryProductUserInfo
export const queryProductUserInfo = (params: any) =>
    request({
        url: makeUrl('/sellbusiness/queryProductUserInfo'),
        method: 'get',
        params // dialogId: 190
    });

// crm/customerDialogPageList
export const getChatHistory = (params: any) =>
    request({
        url: makeUrl('/crm/customerDialogPageList'),
        method: 'get',
        params // dialogId: 190
    });
//crm/createTboosDialog
export const createTboosDialog = (params: any) =>
    request({
        url: makeUrl('/crm/createTboosDialog'),
        method: 'get',
        params // dialogId: 190
    });
//crm/queryOnlineServerList
export const queryOnlineServerList = (params: any) =>
    request({
        url: makeUrl('/crm/queryOnlineServerList'),
        method: 'get',
        params // dialogId: 190
    });
// export const setAd = (data: any) =>
//   request({
//     url: makeUrl('wechat/setAd'),
//     method: 'post',
//     data
//   });
