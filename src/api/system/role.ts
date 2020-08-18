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
export const queryRoleList = (params: any) =>
    request({
        url: makeUrl('system/role/roleList'),
        method: 'get',
        params
    });
export const delRole = (data: any) =>
    request({
        url: makeUrl('system/role/delRole'),
        method: 'post',
        data
    });
export const getRoleTree = (params: any) =>
    request({
        url: makeUrl('system/role/rolePermission'),
        method: 'get',
        params
    });
export const add = (data: any) =>
    request({
        url: makeUrl('system/role/addRole'),
        method: 'post',
        data
    });
export const detail = (params: any) =>
    request({
        url: makeUrl('system/role/getRole'),
        method: 'get',
        params
    });
export const edit = (params: any) =>
    request({
        url: makeUrl('system/role/editRole'),
        method: 'get',
        params
    });
