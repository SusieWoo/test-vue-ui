import state from '@/store/im/state'
import { cookie } from '@/utils/cookies'
// import commit from './mutations'

const SDK = require('@/assets/sdk/NIM_Web_SDK_v5.0.0.js')

export const initNimSDK = () => {
  if (state.nim) {
    (state.nim as any).disconnect()
  }
  const loginInfo = {
    uid: cookie.readCookie('uid'),
    sdktoken: cookie.readCookie('sdktoken'),
  }
  const nim = SDK.NIM.getInstance({
    debug: true,
    appKey: 'c00c966c7a57684dd99c528487993b83',
    account: cookie.readCookie('uid'),
    token: cookie.readCookie('sdktoken'),
    transports: ['websocket'],
    db: false,
    syncSessionUnread: true,
    syncRobots: true,
    autoMarkRead: true, // 默认为true
    onconnect: function onConnect() {
      if (loginInfo) {
        // 连接上以后更新uid
        // commit.updateUserUID(loginInfo)
      }
    },
  });
  (window as any).nim = state.nim = nim;
}
