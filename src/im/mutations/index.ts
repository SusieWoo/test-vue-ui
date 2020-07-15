// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
// this.$store.commit(method, params)
import state from '@/store/im/state'
import { cookie } from '@/utils/cookies'

export default {
  updateUserUID(loginInfo: any) {
    console.log('asdfsd')
    state.userUID = loginInfo.uid;
    (state as any).sdktoken = loginInfo.sdktoken
    cookie.setCookie('uid', loginInfo.uid)
    cookie.setCookie('sdktoken', loginInfo.sdktoken)
  },
}
