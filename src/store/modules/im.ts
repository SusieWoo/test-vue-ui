import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import state from '@/store/im/state'
import { cookie } from '@/utils/cookies'

export interface IImState {
  in: string
}

@Module({ dynamic: true, store, name: 'Ims' })
class Ims extends VuexModule implements IImState {
  public in = '0' // TODO

  @Mutation
  public SDKMutation(loginInfo: any) {
    this.in = '1'
  }

  @Action
  public async Connect() {
    // 操作为内容页刷新页面，此时无nim实例
    if (!state.nim) {
      let loginInfo: any = {
        uid: cookie.readCookie('uid'),
        sdktoken: cookie.readCookie('sdktoken'),
      }
      if (!loginInfo.uid) {
        // 无cookie，直接跳转登录页
        console.log('无历史登录记录，请重新登录')
      } else {
        // 有cookie，重新登录
        console.log(loginInfo)
        this.SDKMutation(loginInfo)
      }
    }
  }
}


export const ImModule = getModule(Ims)
