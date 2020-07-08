import request from '@/utils/request';

/* *
* https://10.30.50.150:8443/svn/青汽车联网项目/数据结构设计/云端数据库数据字典表/云端数据库字典表.xlsx
* 数据字典 获得服务类型 se01 type一般是传"A"
* */
export const basedata = (params: any) =>
  request({
    url: 'http://sy.aerozhonghuan.com:81/dev/yiqi/app/api/faw/operate/common/basedata',
    method: 'get',
    params
  });
//图片上传
export const uploadImageAndCrtThumbImage = (data: any) =>
  request({
    url: process.env.VUE_APP_UPLOAD_API,
    method: 'post',
    data
  });
