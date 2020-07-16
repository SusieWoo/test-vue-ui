<template>
  <div class="login-container">
    <div class="login-container">
      <el-form ref="loginForm"
               :model="loginForm"
               :rules="loginRules"
               class="login-form"
               autocomplete="on"
               label-position="left">
        <div class="title-container">
          <h3 class="title">
            Login Form
          </h3>
        </div>

        <el-form-item prop="userName">
          <span class="svg-container">
            <svg-icon name="user" />
          </span>
          <el-input ref="userName"
                    v-model="loginForm.userName"
                    name="userName"
                    type="text"
                    autocomplete="on"
                    placeholder="用户名"
                    @change="checkUser" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon name="password" />
          </span>
          <el-input :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="密码"
                    name="password"
                    autocomplete="on"
                    @keyup.enter.native="handleLogin" />
          <span class="show-pwd"
                @click="showPwd">
            <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'" />
          </span>
        </el-form-item>

        <el-form-item v-if="showVerifyImg" prop="verifyCode">
          <span class="svg-container">
            <svg-icon name="user" />
          </span>
          <el-input ref="verifyCode"
                    v-model="loginForm.verifyCode"
                    name="verifyCode"
                    type="text"
                    autocomplete="off"
                    style="width: 54%"
                    placeholder="图形验证码" />
          <img v-if="verifyImg" :src="verifyImg" class="verifyImg" title="验证码" @click="changeVerify" />
          <el-button class="smscodeBtn verifyCode" type="primary" @click.native.prevent="changeVerify">看不清</el-button>
        </el-form-item>

        <el-form-item v-if="showMsgCode" prop="msgCode">
          <span class="svg-container">
            <svg-icon name="user" />
          </span>
          <el-input ref="msgCode"
                    v-model="loginForm.msgCode"
                    name="msgCode"
                    type="text"
                    autocomplete="off"
                    style="width: 67%"
                    placeholder="手机验证码" />
          <el-button class="smscodeBtn" type="primary" :disabled="disableMsgCode" @click="sendMsgCode">{{msgTitle}}</el-button>
        </el-form-item>
        <p v-if="showUserTelephone" style="font-size: 14px">{{userTelephone}}</p>

        <el-button :loading="loading"
                   type="primary"
                   style="width:100%; margin-bottom:30px;"
                   @click.native.prevent="handleLogin">
          登陆
        </el-button>
      </el-form>
    </div>
    <!-- 首次登陆弹窗 -->
    <FirstLogin :dialog-visible="firstLoginDialogVisible" :data="loginForm.password" @DialogClose="showFirstLoginDialog" @DialogReturn="FirstLoginDialogReturn" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { isValidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect/index.vue'
import { getVerifyCode, isShowVerifyCode, getMsgCode, resetPassword } from '@/api/users'
import FirstLogin from '@/components/firstLogin/index.vue';
@Component({
  name: 'Login',
  components: {
    LangSelect,
    FirstLogin
  }
})
export default class extends Vue {
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('用户名不能为空'))
    } else {
      callback()
    }
  }
  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (!value) {
      callback(new Error('密码不能为空'))
    } else {
      callback()
    }
  }
  private loginRules = {
    userName: [{ validator: this.validateUsername, trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }]
  }
  private loginForm = {
    userName: '',
    password: '',
    msgCode: null,
    verifyCode: null,
    verifyCodeId: '',
    mobileVerifyCodeId: ''
  }
  private verifyImg = null
  private showVerifyImg = false
  private showMsgCode = false
  private firstLoginDialogVisible = false

  // 是否禁用获取验证码
  private disableMsgCode = false
  private passwordType = 'password'
  private loading = false
  private showDialog = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  mounted() {
    this.loginForm.verifyCodeId = this.randomStr(16)
    this.loginForm.mobileVerifyCodeId = this.randomStr(16)

    if (this.loginForm.userName === '') {
      (this.$refs.userName as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private randomStr(range: any) {
    let str = ''
    let pos = null
    let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    arr.concat(['i', 'j', 'k', 'l', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
    for (let i = 0; i < range; i++) {
      pos = Math.round(Math.random() * (arr.length - 1))
      str += arr[pos]
    }
    return str
  }

  private async changeVerify() {
    const res = await getVerifyCode(this.loginForm.verifyCodeId)
    this.verifyImg = res.data.fullPath
  }

  private async checkUser() {
    const res = await isShowVerifyCode(this.loginForm.userName)
    this.showMsgCode = !!res.data.flag
    this.loginForm.msgCode = null
    if (this.showVerifyImg) {
      this.changeVerify()
    }
  }
  // 首次登陆需要改密码
  private showFirstLoginDialog() {
    this.firstLoginDialogVisible = !this.firstLoginDialogVisible
  }
  private async FirstLoginDialogReturn(obj: any) {
    this.firstLoginDialogVisible = !this.firstLoginDialogVisible
    await resetPassword(obj)
    await UserModule.LogOut()
    location.reload()
  }

  private timePromise: NodeJS.Timer | null = null
  private msgTitle = '获取验证码'
  private showUserTelephone = false
  private userTelephone: any
  private async sendMsgCode() {
    if (this.disableMsgCode) {
      return false
    }
    let _this = this
    await getMsgCode(this.loginForm).then(res => {
      let second = 90
      _this.timePromise = setInterval(function() {
        if (second <= 0) {
          clearInterval(Number(_this.timePromise))
          _this.timePromise = null
          _this.msgTitle = '重发验证码'
          _this.disableMsgCode = false
        } else {
          _this.msgTitle = second + '秒后重发'
          _this.disableMsgCode = true
          second--
        }
      }, 1000, 100)
      _this.$message({ message: '验证码发送成功，请注意接收', type: 'success', duration: 5 * 1000 })
      _this.userTelephone = res.data || ''
      this.showUserTelephone = !!res.data
    })
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
      if (valid) {
        this.loading = true
        let params = {
          userName: this.loginForm.userName,
          password: this.loginForm.password,
          verifyCodeId: this.loginForm.verifyCodeId,
          mobileVerifyCodeId: this.loginForm.mobileVerifyCodeId
        }
        if (this.loginForm.verifyCode && this.loginForm.verifyCode !== '') {
          params = Object.assign({
            verifyCode: this.loginForm.verifyCode
          }, params)
        }
        if (this.loginForm.msgCode && this.loginForm.msgCode !== '') {
          params = Object.assign({
            mobileVerifyCode: this.loginForm.msgCode
          }, params)
        }
        await UserModule.Login(params).finally(() => {
          setTimeout(() => {
            this.loading = false
          }, 0.5 * 1000)
        })
        if (UserModule.isFirstLogin === 1 || UserModule.isShowVerifyCode === true) {
          if (UserModule.isFirstLogin === 1) {
            this.showFirstLoginDialog()
            return
          }
          if (UserModule.isShowVerifyCode === true) {
            this.showVerifyImg = true
            this.changeVerify()
          }
        } else {
          this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery
          })
        }
          // Just to simulate the time of the request
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
</script>

<style lang="less">
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      -webkit-appearance: none;
      color: #fff;
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-transition-delay: 111111s;
      -webkit-transition: color 11111s ease-out, background-color 111111s ease-out;
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #fff;
  }
}
</style>
<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 140px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    color: #fff;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .verifyImg {
    vertical-align: middle;
    width: 80px;
    height: 35px;
    cursor: pointer;
    margin-right: 5px;
  }
  .smscodeBtn {
    vertical-align: middle;
  }
  .verifyCode{
    position: absolute;
    top: 6px;
    right: 6px;
  }
}
</style>
