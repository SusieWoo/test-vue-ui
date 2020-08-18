import request from '@/utils/request';
type makeUrl = { (url: string): string };
let makeUrl = (url: string) => {
    return url;
}

export const baseData = (params: any) =>
    request({
        url: makeUrl('system/baseData'),
        method: 'get',
        params
    });

export const queryList = (params: any) =>
    request({
        url: makeUrl('monitor/log/queryTerminalLog'),
        method: 'get',
        params
    });
export const delUser = (data: any) =>
    request({
        url: makeUrl('system/user/delUser'),
        method: 'post',
        data
    });
export const exportDictate = (params: any) =>
    request({
        url: makeUrl('monitor/log/exportOperateLog'),
        method: 'get',
        params
    });
