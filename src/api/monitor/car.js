import RequestService from '@/utils/request'
import axios from 'axios'

import { AppModule } from "@/store/modules/app";
import Mock from './mock'
const getIp = ''
const isMock = true;

export default {
  //获取实时异步树
  queryAsyncTree: query => {
    return RequestService.request({
      url: 'monitor/car/queryAsyncTree',
      method: 'get',
      params: query
    })
  },
  //获取初始化树
  querySolidifyTree: query => {

    return RequestService.request({
      url: 'monitor/car/querySolidifyTree',
      method: 'get',
      params: query
    })
  },
  // 获取查询树
  querySearchTree: query => {
    return RequestService.request({
      url: 'monitor/car/querySearchSolidifyTree',
      method: 'get',
      params: query
    })
  },

  //获取聚合信息

  queryPolymerize: query => {
    return RequestService.request({
      url: 'monitor/car/queryPolymerize',
      method: 'get',
      params: query
    })
  },

  // 获取地图打点车信息
  queryCarLoc: query => {
    return RequestService.request({
      url: 'monitor/car/queryCarLoc',
      method: 'get',
      params: query
    })
  },
  // 获取车辆详情
  queryCarInfo: query => {
    return RequestService.request({
      url: 'monitor/car/queryCarInfo',
      method: 'get',
      params: query
    })
  },
  // 获取车辆详情
  queryCarTip: query => {
    return RequestService.request({
      url: 'monitor/car/queryCarTip',
      method: 'get',
      params: query
    })
  },
  // 获取验证码
  sendCode: query => {
    return RequestService.request({
      url: 'authority/verifyCode/getSMSVerifyCode',
      method: 'post',
      data: query
    })
  },
  // 锁车
  lock: query => {
    return RequestService.request({
      url: 'pushcmd/lock',
      method: 'get',
      params: query
    })
  },
  // 解锁
  unLock: query => {
    return RequestService.request({
      url: 'pushcmd/unlock',
      method: 'get',
      params: query
    })
  },
  // 撤销
  undo: query => {
    return RequestService.request({
      url: 'pushcmd/lockAndUnLockCarCancel',
      method: 'get',
      params: query
    })
  },
  getDesc: query => {
    return RequestService.request({
      url: 'pushcmd/getDesc',
      method: 'get',
      params: query
    })
  },
  baseData: query => {
    return RequestService.request({
      url: 'system/baseData',
      method: 'get',
      params: query
    })
  },
  // 获取手机号下拉列表
  getPhoneNum: query => {
    return RequestService.request({
      url: 'system/atc/getDealerAccountInfo',
      method: 'get',
      params: query
    })
  },
  // 获取ip
  getIp: query => {
    return axios({
      method: 'get',
      url: getIp
    })
  },
  // 根据状态，设置对应图标
  // carStatus —— 状态：不在线不定位(0)，在线不定位(1)，不在线停车(2)，在线停车(3)，不在线行驶(6)，在线行驶(7)
  // carDirection —— 行驶方向
  getDirectIcon: (carStatus, carDirection) => {
    var statusIconStuff = ''
    var result = ''
    switch (carStatus) {
      case 0:
        result = 'iFriendsOfflineInvalid1'
        break
      case 1:
        result = 'iFriendsOnlineInvalid1'
        break
      case 2:
        result = 'iFriendsOfflineStop1'
        break
      case 3:
        result = 'iFriendsOnlineStop1'
        break
      case 6:
        statusIconStuff = 'Offline1'
        break
      case 7:
        statusIconStuff = 'Online1'
        break
      default:
        return ''
    }

    if (carStatus === 7 || carStatus === 6) {
      if (carDirection === 0) {
        result = 'iFriends' + statusIconStuff
      } else if (carDirection > 0 && carDirection < 90) {
        result = 'iFriends' + statusIconStuff
      } else if (carDirection === 90) {
        result = 'iFriends' + statusIconStuff
      } else if (carDirection > 90 && carDirection < 180) {
        result = 'iFriends' + statusIconStuff
      } else if (carDirection === 180) {
        result = 'iFriends' + statusIconStuff
      } else if (carDirection > 180 && carDirection < 270) {
        result = 'iFriends' + statusIconStuff
      } else if (carDirection === 270) {
        result = 'iFriends' + statusIconStuff
      } else if (carDirection > 270 && carDirection < 359) {
        result = 'iFriends' + statusIconStuff
      } else {
        result = 'iFriends' + statusIconStuff
      }
    }
    return result
  },


  // 防控激活
  postActivation: query => {
    return RequestService.request({
      url: 'monitor/car/sendTamper',
      method: 'get',
      params: query
    })
  },
  // 锁车
  postLockCar: query => {
    return RequestService.request({
      url: 'monitor/car/lockCar',
      method: 'get',
      params: query
    })
  },

  getCarStatus: data => {
    return RequestService.request({
      url: 'monitor/interaction/lockCar/getDesc',
      method: 'post',
      data
    })
  },
  queryTimelyMonitor: query => {
    return RequestService.request({
      url: 'monitor/car/queryTimelyMonitor',
      method: 'get',
      params: query
    })
  },
  queryStations: query => {
    return RequestService.request({
      url: 'monitor/station/queryStations',
      method: 'get',
      params: query
    })
  },
  trackVacuate: query => {
    return RequestService.request({
      url: 'monitor/car/trackVacuate',
      method: 'get',
      params: query
    })
  },
  queryConsumption: query => {
    return RequestService.request({
      url: 'monitor/car/queryConsumption',
      method: 'get',
      params: query
    })
  },
  exportTraces: data => {
    return RequestService.request({
      url: 'monitor/car/exportTraces',
      method: 'post',
      data
    })
  },
  exportTimelyData: data => {
    return RequestService.request({
      url: 'monitor/car/exportTimelyData',
      method: 'post',
      data
    })
  },

}


