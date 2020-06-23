import request from '@/utils/request'

export const queryManagerList = (params: any) =>
  request({
    url: '/queryManagerList',
    method: 'get',
    params
  })
