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
export const queryDepartment = (params: any) =>
    request({
        url: makeUrl('system/dict/departments'),
        method: 'get',
        params
    });
export const queryUserList = (params: any) =>
    request({
        url: makeUrl('system/user/userList'),
        method: 'get',
        params
    });
export const delUser = (data: any) =>
    request({
        url: makeUrl('system/user/delUser'),
        method: 'post',
        data
    });
export const roleByType = (params: any) =>
    request({
        url: makeUrl('system/role/roleByType'),
        method: 'get',
        params
    });
export const getRoleTree = (params: any) =>
    request({
        url: makeUrl('system/role/rolePermission'),
        method: 'get',
        params
    });
export const add = (data: any) =>
    request({
        url: makeUrl('system/user/addMultipleUser'),
        method: 'post',
        data
    });
export const detail = (params: any) =>
    request({
        url: makeUrl('system/role/getRole'),
        method: 'get',
        params
    });
export const edit = (data: any) =>
    request({
        url: makeUrl('system/user/editUser'),
        method: 'post',
        data
    });
export const resetPassWord = (params: any) =>
    request({
        url: makeUrl('system/user/resetPassWord'),
        method: 'get',
        params
    });
export const getTeam = (params: any) =>
    request({
        url: makeUrl('system/getTeam'),
        method: 'get',
        params
    });

export const getStation = (params: any) =>
    request({
        url: 'monitor/station/queryStationTree',
        method: 'get',
        params
    });

export const getDetail = (params: any) =>
    request({
        url: 'system/user/userDetail',
        method: 'get',
        params
    });
