import request from '@/utils/request';

export const queryList = (query) =>
    request({
      url: '/oilwearcompetition/queryActivityList',
      method: 'post',
      data: query
    });

export const updOilWearActivityStatus = (type, id, status) =>
    request({
      url: '/oilwearcompetition/updOilWearActivityStatus',
      method: 'get',
      params: {
        activityId: id,
        type: type,
        status: status
      }
    });

export const queryActivityFilterRuleList = (filter) =>
    request({
      url: '/oilwearcompetition/queryActivityFilterRuleList',
      method: 'get',
      params: filter
    });

export const updCrossActivityStatus = (type,crossActivityId,status) =>
    request({
      url: '/oilwearcompetition/queryCrossActivityList',
      method: 'get',
      params: {
        type: type,
        crossActivityId: crossActivityId,
        status: status
      }
    });

export const queryEffectiveActivityList = () =>
    request({
      url: '/oilwearcompetition/queryEffectiveActivityList',
      method: 'get'
    });

export const queryCrossActivityPrizeConfList = (confType) =>
    request({
      url: '/oilwearcompetition/queryCrossActivityPrizeConfList',
      method: 'get',
      params: {
        confType: confType
      }
    });

export const addCrossActivity = (query) =>
    request({
      url: '/oilwearcompetition/addCrossActivity',
      method: 'post',
      data: query
    });

export const queryCrossActivityList = (filter) =>
    request({
      url: '/oilwearcompetition/queryCrossActivityList',
      method: 'get',
      params: filter
    });

export const queryActivityUserList = (filter) =>
    request({
      url: '/oilwearcompetition/queryActivityUserList',
      method: 'get',
      params: filter
    });

export const queryActivityDataGroupModelList = (activityId,groupType) =>
    request({
      url: '/oilwearcompetition/queryActivityDataGroupModelList',
      method: 'get',
      params: {
        activityId: activityId,
        groupType: groupType
      }
    });

export const oilActivityRelease = (activityId) =>
    request({
      url: '/oilwearcompetition/oilActivityRelease',
      method: 'get',
      params: {
        activityId: activityId
      }
    });

export const editActivityCarTotalOilWearData = (query,group) =>
    request({
      url: '/oilwearcompetition/editActivityCarTotalOilWearData',
      method: 'get',
      params: {
        activityId: query.activityId,
        vin: query.vin,
        totalOilWear: query.totalOilWear,
        activityGroupId: group
      }
    });

export const ActivityDeleteVin = (activityId,carId) =>
    request({
      url: '/oilwearcompetition/activityDeleteVin',
      method: 'get',
      params: {
        activityId: activityId,
        carId: carId
      }
    });
export const queryRewardInformationList = (filter) =>
    request({
      url: '/oilwearcompetition/queryRewardInformationList',
      method: 'get',
      params: filter
    });
export const editActivityCar = (query,activityId) =>
    request({
      url: '/oilwearcompetition/editActivityCar',
      method: 'get',
      params: {
        activityId: activityId,
        vin: query.vin,
        consignee: query.consignee,
        idCard: query.idCard,
        phone: query.phone,
        address: query.address
      }
    });

export const addOilActivityDetail = (filter) =>
    request({
      url: '/oilwearcompetition/addOilActivityDetail',
      method: 'post',
      data: filter
    });

export const editOilActivityDetail = (filter) =>
    request({
      url: '/oilwearcompetition/editOilActivityDetail',
      method: 'post',
      data: filter
    });

export const queryOilActivityDetail = (activityId) =>
    request({
      url: '/oilwearcompetition/queryOilActivityDetail',
      method: 'get',
      params: {
        activityId: activityId
      }
    });

export const queryOilActivityGroupPrizeRuleDetail = (params) =>
    request({
      url: '/oilwearcompetition/queryOilActivityGroupPrizeRuleDetail',
      method: 'get',
      params: {
        activityId: params.activityId,
        activityGroupId: params.activityGroupId
      }
    });

export const queryOilActivityGroupRankRuleDetail = (params) =>
    request({
      url: '/oilwearcompetition/queryOilActivityGroupRankRuleDetail',
      method: 'get',
      params: {
        activityId: params.activityId,
        activityGroupId: params.activityGroupId
      }
    });

export const carModelDataDict = (filter) =>
    request({
      url: '/sellbusiness/carModelDataDict',
      method: 'post',
      data: filter
    });

export const queryActivityPrizeConf = (filter) =>
    request({
      url: '/oilwearcompetition/queryActivityPrizeConf',
      method: 'get',
      params: filter
    });

export const operateActivityPrizeConf = (id, flag) =>
    request({
      url: '/oilwearcompetition/operateActivityPrizeConf',
      method: 'get',
      params: {
        confId: id,
        flag: flag
      }
    });

export const checkActivityPrizeConf = (id, flag) =>
    request({
      url: '/oilwearcompetition/checkActivityPrizeConf',
      method: 'get',
      params: {
        confId: id,
        flag: flag
      }
    });

// 价值唯一校验
export const checkOnlyPrizeCost = (prizeCost,prizeId) =>
    request({
      url: '/oilwearcompetition/checkOnlyPrizeCost',
      method: 'get',
      params: {
        prizeCost: prizeCost,
        prizeId: prizeId
      }
    });

export const getPrizeDetail = (confId) =>
    request({
      url: '/oilwearcompetition/queryConfList',
      method: 'get',
      params: {
        confId: confId
      }
    });

export const addConfigure = (filter) =>
    request({
      url: '/oilwearcompetition/addConfigure',
      method: 'post',
      data: filter
    });

export const editConfigure = (filter) =>
    request({
      url: '/oilwearcompetition/editConfigure',
      method: 'post',
      data: filter
    });