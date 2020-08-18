import Vue from 'vue';
import { cookie } from '@/im/utils/cookies'
import { ImModule } from '@/im/store/modules/im'
import config from './configs'
import { Message } from 'element-ui';
import Bus from '@/utils/bus';

const SDK = require('@/im/sdk/NIM_Web_SDK_v5.0.0.js')
let nim: any = {}

//连接成功
const onConnect = async () => {
  ImModule.Disconnect(true)
  ImModule.UpdateUserUID()
}

//发生错误
const onError = (event: any) => {
  Message({
    message: '网络连接状态异常',
    type: 'warning'
  });
  // TODO 连接异常处理是否关闭该页面？
  // location.href = config.loginUrl
}

// 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
const onWillReconnect = (obj: any) => {
  console.log('【云信】正在尝试第' + obj.retryCount + '次重连', obj);
}

//此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
const onDisconnect = (error: any) => {
  console.log('【云信】连接处于断开，原因：' + error.message + '，错误码：' + error.code);
  ImModule.Disconnect(false);//丢失连接，contacting断开
  if (error) {
    switch (error.code) {
      // 账号或者密码错误, 请跳转到登录页面并提示错误
      case 302:
        Message({
          message: error.message,
          type: 'warning'
        });
        break;
      // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
      case 417:
        break;
      // 被踢, 请提示错误后跳转到登录页面
      case 'kicked':
        break;
      default:
        break;
    }
  }
}

//当前登录帐号在其它端的状态发生改变了
const onLoginPortsChange = (loginPorts: any) => {
  console.log('【云信】当前登录帐号在其它端的状态发生改变了', loginPorts);
}

/*
       收到我的名片
       */
const onMyInfo = (user: any) => {
  console.log('【云信】收到我的名片', user);
  ImModule.MyInfo({ params: user, types: 'username' })
}

/*
   收到用户名片列表
   */
const onUsers = (users: any) => {
  console.log('【云信】收到用户名片列表', users);
}

/*
     用户名片更新了
     */
const onUpdateUser = (user: any) => {
  console.log('【云信】用户名片更新了', user);
}

/*
      收到会话列表
      */
const onSessions = (sessions: any) => {
  console.log(sessions)
  const dataSessions = nim.mergeSessions(ImModule.sessions, sessions);
  ImModule.UpdateSessions(dataSessions)

  //TODO 收到会话 更新  8.3
  // LeftSessionList(vm.data.sessions);
}

/*
       会话更新了
       */
const onUpdateSession = (session: any) => {
  // console.log('会话更新了=>', session)
  if (session.lastMsg.status !== 'success') return
  if (session && session.lastMsg && session.lastMsg.custom) {
    if (session.lastMsg.custom.dialogState !== undefined) {
      // TODO 8.3
      // vm.getImHistoryList();
      // if (vm.toperson == session.to) {
      //   vm.toperson = '1';
      //   vm.chartbox = false;
      //   vm.setCurrSession();
      // }
      // LeftSessionList(vm.data.sessions);
    }
  }
  const dataSessions = nim.mergeSessions(ImModule.sessions, session);
  const parseDialogId: number = parseInt(JSON.parse(session.lastMsg.custom).dialogId)
  if ((ImModule.dialogId === '' || parseInt(ImModule.dialogId) !== parseDialogId) && ImModule.friendslist.findIndex(item => item.dialogId === parseDialogId) < 0) {
    // console.log('更新会话列表')
    ImModule.UpdateUserUID()
  }
  ImModule.UpdateSessions(dataSessions)
  // LeftSessionList(vm.data.sessions);
}
/*
     离线消息
     */
const onOfflineMsgs = (obj: any) => {
  // TODO 8.3
  //pushMsgIm(obj.msgs);
}
/*
       收到消息
       */
const onMsg = (msg: any) => {
  console.log('收到新消息', msg)
  // TODO 8.3
  if (ImModule.toperson === msg.from) { //判断是否为当前对话
    ImModule.PutMsg(msg)
  }
}

export const initNimSDK = () => {
  if (ImModule.nim) {
    (ImModule.nim as any).disconnect()
  }
  const loginInfo = {
    uid: cookie.readCookie('uid'),
    sdktoken: cookie.readCookie('sdktoken'),
  }
  nim = SDK.NIM.getInstance({
    // debug: true,
    isHistoryable: true,//是否存储云端历史
    isRoamingable: false,//是否支持漫游
    isOfflinable: true,// 是否要存离线
    isUnreadable: true,//是否计入消息未读数
    isSyncable: true,//是否支持发送者多端同步

    appKey: process.env.VUE_APP_IM_APPKEY,
    account: cookie.readCookie('uid'),
    token: cookie.readCookie('sdktoken'),
    // transports: ['websocket'],
    // db: false,
    // syncSessionUnread: true,
    // autoMarkRead: true, // 默认为true
    onconnect: onConnect,
    onerror: onError,
    onwillreconnect: onWillReconnect,
    ondisconnect: onDisconnect,//丢失连接
    onloginportschange: onLoginPortsChange,
    onmyinfo: onMyInfo,
    onusers: onUsers,
    onupdateuser: onUpdateUser,
    onsessions: onSessions,
    onupdatesession: onUpdateSession,
    onofflinemsgs: onOfflineMsgs,
    onmsg: onMsg
  });
  (window as any).nim = nim;
}
// ---------------------------nim 初始化------------------------------------
const nimSendText = (obj:any) => {
   nim.sendText({
        scene: 'p2p',
        to: obj.to,
        text: obj.text,
        custom: '{"dialogId":"' + obj.dialogId + '"}',
        done: onSendMsgDone,
        needMsgReceipt: obj.needMsgReceipt || false
      })
}

const nimSendCustomMsg = (obj:any) => {
  nim.sendCustomMsg({
      scene: obj.scene,
      to: obj.to,
      pushContent: obj.pushContent,
      content: JSON.stringify(obj.content),
      done: onSendMsgDone
    })
}

const onSendMsgDone = (error:any, msg:any) => {
  console.log(error ? '发送失败' : '发送成功=>', error || msg)
  if (error) {
    // 被拉黑
    if (error.code === 7101) {
      msg.status = 'success'
      Message({
        message: error.message,
        type: 'warning'
      });
    } else {
      Message({
        message: error.message,
        type: 'warning'
      });
    }
    return
  }
  ImModule.PutMsg(msg)
}

// 发送普通消息
export const sendMsg = (obj:any) => {
  obj = obj || {}
  let type = obj.type || ''
  switch (type) {
    case 'text':
      nimSendText(obj)
      break
    case 'custom':
      nimSendCustomMsg(obj)
          break
    case 'image':
      nimSendFileMsg(obj)
  }
}

export const nimSendFileMsg = (obj: any) => {
  nim.sendFile({
    scene: 'p2p',
    to: obj.to,
    type: obj.type,
    fileInput: obj.fileInput,
    fastPass: '{"w":200,"h":110}',
    custom: '{"dialogId":"' + obj.dialogId + '"}',
    beginupload: function(upload: any) {
      // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
      // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
    },
    uploadprogress: function(obj: any) {
      console.log('文件总大小: ' + obj.total + 'bytes');
      console.log('已经上传的大小: ' + obj.loaded + 'bytes');
      console.log('上传进度: ' + obj.percentage);
      console.log('上传进度文本: ' + obj.percentageText);
    },
    uploaddone: function(error: any, file: any) {
      console.log(error);
      console.log(file);
      console.log('上传' + (!error ? '成功' : '失败'));
    },
    beforesend: function(msg: any) {
      console.log('正在发送p2p image消息, id=' + msg.idClient);
      // pushMsg(msg);
    },
    done: onSendMsgDone
  });
}
// 删除会话
export const deleteSession = () => {
  nim.deleteSession({
    scene: 'p2p',
    to: 'p2p-1',
    done: deleteSessionDone
  });
}

const deleteSessionDone = (err: any, msg: any) => {
  console.log('删除会话=>', err, msg)
}

//设置当前会话
export const setCurrSession = (toperson:any) => {
  nim.setCurrSession('p2p-' + toperson);
  nim.resetSessionUnread('p2p-' + toperson);
  clearmessageText()
}

//清空输入框 //TODO
export const clearmessageText = () => {
  Bus.$emit('Chat_clear_input');
}

