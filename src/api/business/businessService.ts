import request from '@/utils/request';

export const queryCarPropertyForMaintains = () =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/dev/qdfaw/api/qingqi/sellbusiness/queryCarPropertyForMaintains',
    method: 'post',
    data: {
      propertyName: "1"
    }
  });
export const queryArea = (id: any) => {
  console.log(id);
  return request({
    url: 'http://sy.aerozhonghuan.com:81/dev/qdfaw/api/qingqi/servicestation/activity/queryArea',
    method: 'post',
    data: {
      provinceId: id
    }
  });

}




