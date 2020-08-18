import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { cookie } from '@/im/utils/cookies'
import { initNimSDK } from '@/im/initNimSDK'
import { serviceDialogList,dialogDetail,dialogSearch, closeDialog, cancelDialogTimeout, queryCarList, queryCarDetailInfo, queryProductUserInfo } from '@/api/business/imService';
import Bus from '@/utils/bus';
import utils from '@/im/utils/index'
import page from '@/im/utils/page';
export interface IImState {
  nim: any


  toperson:string
  dialogId:string
  userUID: string
  customerName: string


  sdktoken: string
  friendslist: any
  contacting: boolean
  username: string
  sessions: any
  current_session:any
  msgs:any
  sysMsgUnread:number
  customSysMsgUnread:number
  userRole:string
  userRoleCode:string

  headPic:string
  history:any
  autoClose:string
  carList: any
  chatUserInfo: any
  chatUserRole: string
}


@Module({ dynamic: true, store, name: 'im' })
class Im extends VuexModule implements IImState {
  public nim = null

  public toperson = '1'
  public dialogId = ''
  public userUID = ''
  public customerName = ''


  public sdktoken = ''
  public friendslist = [] as any[]
  public contacting = false
  public username = '加载中...'
  public sessions = []
  public current_session = {
    list: [] as any[]
  }
  public msgs = []
  public sysMsgUnread =2 //TODO 假数据
  public customSysMsgUnread =2 //TODO 假数据
  public userRole = ''
  public userRoleCode = ''
  public headPic = ''
  public history = {
    historyPageNumber: 1,
    historySessions: [],
    isHistory: false, // 是否是历史状态。判断是否滚动到消息底部
    endTime: '', // 历史记录的用来对比是否还有历史消息
    noMore: false
  }
  public autoClose = '1'
  public carList = []
  public chatUserInfo = {}
  public chatUserRole = ''





  @Mutation
  private SET_USER_LIST(friendslist: any) {
    this.userUID = cookie.readCookie('uid') || ''
    this.sdktoken = cookie.readCookie('sdktoken') || ''
    this.contacting = true
    this.friendslist = friendslist
  }
  @Mutation
  private SET_NIMS(nim: any) {
    this.nim = nim
  }

  @Mutation
  private SET_CONNET_STATE(status: boolean) {
    this.contacting = status
  }

  @Mutation
  private SET_MY_INFO(info: any) {
    let params = info.params
    let type = info.types
    if (type === 'username') this.username = params.nick
    if (type === 'userRole') this.userRole = params
    if (type === 'userRoleCode') this.userRoleCode = params
  }

  @Mutation
  private SET_CURRENT(info: any) {
    let params = info.params
    let type = info.types
    // @ts-ignore
    // this[type] = params
    if (type === 'toperson') this.toperson = params
    if (type === 'dialogId') this.dialogId = params
    if (type === 'headPic') this.headPic = params
    if (type === 'autoClose') this.autoClose = params
    if (type === 'customerName') this.customerName = params
    if (type === 'history') {
      this.history = params
      console.log('重置history', params.noMore)
      console.log(this.history.noMore)
    }
    if (type === 'resetHistory') {
      this.history = {
        historyPageNumber: 1,
        historySessions: [],
        isHistory: false, // 是否是历史状态。判断是否滚动到消息底部
        endTime: '', // 历史记录的用来对比是否还有历史消息
        noMore: false
      }
    }
    if (type === 'carList') this.carList = params
    if (type === 'chatUserInfo') this.chatUserInfo = params
    if (type === 'chatUserRole') this.chatUserRole = params
  }


  @Mutation
  private SET_HISTORY(info: any) {
    if (!info || info.params.length === 0) return
    let params: any = info.params
    let type = info.types
    if (type === 'historyPageNumber') this.history.historyPageNumber = params
    if (type === 'historySessions') this.history.historySessions = params
    if (this.history.historyPageNumber === 1) {
      this.current_session.list[0].isHistory = true
    }
    this.history.isHistory = true
    this.history.historyPageNumber++
    this.current_session.list.unshift(...params)
  }
  @Mutation
  public resetIsHistory() {
    this.history.isHistory = false
  }

  @Mutation
  private SET_SESSIONS(sessions: any) {
    // 更新好友列表会话信息
    this.friendslist = this.friendslist.map((friend: any) => {
      const findF = sessions.find((session: any) => session.to === friend.customerId)
      if (findF) {
        // friend.content = findF.lastMsg.type === 'image' ? '[图片消息]' : findF.lastMsg.text
        const type:string = findF.lastMsg.type || findF.msgType
        friend.content = type.toLowerCase() === 'text' ? findF.lastMsg.text : utils.mapMsgType(type)
        friend.unread = findF.unread
      }
      return friend
    })
    this.sessions = sessions
    Bus.$emit('updateSessions')
  }

  @Mutation
  private SET_CURRENT_SESSION(sessions: any) {
    this.current_session = sessions
  }

  @Mutation
  private SET_MSGS(msg: any) {
    let msgs:any = this.msgs
    msgs.push(msg)
    let msgTemp: any = JSON.parse(JSON.stringify(this.current_session.list[0]))
    msgTemp.flow = msg.flow

    msgTemp.content = msg.type === 'text' ? msg.text : msg.file.url
    // msg.type === 'image' ? 'PICTURE' : 'TEXT'
    msgTemp.type = utils.getType(msg.type)
    msgTemp.time = +new Date()
    if (msgTemp.refreshTime) delete msgTemp.refreshTime
    this.current_session.list.push(msgTemp)
    Bus.$emit('Chat_tag')
  }
  @Mutation
  private RESET_DIALOG() {
    this.dialogId = ''
    this.current_session = {
      list: []
    }
    this.customerName = ''
    this.toperson = '1'
  }

  @Action({ commit: 'SET_NIMS' })
  public setNims(nim: any) {
    return nim
  }

  @Action
  public Connect() {
    initNimSDK()
  }
  @Action({ commit: 'SET_CONNET_STATE' })
  public Disconnect(status: boolean) {
    //连接断开标识位
    return status
  }

  @Action({ commit: 'SET_USER_LIST' })
  public async UpdateUserUID() {
    const u: string | any = cookie.readCookie('uid')
    const res = await serviceDialogList({ serviceUserId: u })
    console.log('更新好友列表')
    return res.data
  }
  @Action({ commit: 'RESET_DIALOG', rawError: true })
  public async closeChat(dialogId: number) {
    await closeDialog({ dialogId })
    await this.UpdateUserUID()
    return ''
  }

  @Action({ commit: 'SET_CURRENT', rawError: true })
  public async toggleDialogTimeout(dialogId: number) {
    const state: string = this.autoClose === '1' ? '2' : '1'
    await cancelDialogTimeout({
      dialogId,
      state: state
    })
    await this.UpdateUserUID()
    return { params: state, types: 'autoClose' }
  }

  @Action({ commit: 'SET_MY_INFO' })
  public MyInfo(info:any) {
    return info
  }

  @Action({ commit: 'SET_SESSIONS' })
  public UpdateSessions(sessions: any) {
    return sessions
  }

  @Action({ commit: 'SET_MSGS' })
  public PutMsg(msg: any) {
    return msg
  }

  @Action({ commit: 'SET_CURRENT' })
  public setCurrent(info: any) {
    return info
  }

  @Action({ commit: 'SET_HISTORY' })
  public setHistory(info: any) {
    return info
  }


  @Action({ commit: 'SET_HISTORY', rawError: true })
  public async setHistorySessions() {
    // console.log('CCC', store.state.im)
    const res = await dialogSearch({
      customerId: store.state.im.toperson,
      serviceUserId: store.state.im.userUID,
      page_number: this.history.historyPageNumber,
      page_size: 1
    })
    let detail:any = {
      data: {
        list: []
      }
    }
    if (res.data && res.data.list && res.data.list.length !== 0) {
      detail = await dialogDetail({
        dialogId: res.data.list[0].dialogid,
        userId: cookie.readCookie('uid')
      })
      if (this.history.endTime === detail.data.endTime) {
        this.history.noMore = true
        return false
      }
      this.history.endTime = detail.data.endTime
    } else {
      this.history.noMore = true
    }
    return { params: detail.data.list,types: 'historySessions' }
  }
  @Action({ commit: 'SET_CURRENT_SESSION' })
  public setCurrentSession(info: any) {
    return info
  }

  @Action({ commit: 'SET_CURRENT' })
  public async getDialogDetail(dialogId:string) {
    const u: string | any = cookie.readCookie('uid')
    const res = await dialogDetail({ dialogId: dialogId,userId: u })
    // console.log('聊天记录res=>', res)
    let data: any = res.data
    this.setCurrentSession(data)
    // await this.setHistorySessions()
    Bus.$emit('Chat_tag')
    return { params: data.autoClose,types: 'autoClose' }
  }
  @Action({ commit: 'SET_CURRENT', rawError: true })
  public async queryCarList(userId: string) {
    console.log(userId)
    const res = await queryCarList({ userId })
    return { params: res.data,types: 'carList' }
  }
  @Action
  public async queryCarDetailInfo(vin: string) {
    const res = await queryCarDetailInfo({ vin, userId: this.toperson })
    return res.data
  }
  @Action({ commit: 'SET_CURRENT', rawError: true })
  public async queryProductUserInfo(serviceUserId: string) {
    const res = await queryProductUserInfo({ serviceUserId })
    return { params: res.data, types: 'chatUserInfo' }
  }
}

/*
<div class="item">
<div class="list">
<h5 class="ml5">{{webim.userRole?"用户信息":"车辆列表"}}</h5>
<div id="inforList">
<ul class="m-panel" ng-if="webim.userRole">
<li class="panel_item">
    <p>用户角色名：{{webim.inforGroup.userRoleName}}</p>
<div ng-if="webim.userRole && webim.userRole ==='product'">
    <p>一级经销商：{{webim.inforGroup.teamName}}</p>
<p ng-if="webim.inforGroup.secteamName">二级经销商：{{webim.inforGroup.secteamName}}</p>
</div>
<div ng-if="webim.userRole && webim.userRole ==='serve'">
    <p>一级服务站：{{webim.inforGroup.stationName}}</p>
<p ng-if="webim.inforGroup.secStationName">二级服务站：{{webim.inforGroup.secStationName}}</p>
</div>
</li>
</ul>
<p class="tlc mt5" ng-show="webim.inforGroup.length===0">无数据</p>
    </div>
    </div>

    </div>
*/


export const ImModule = getModule(Im)
