<template>
  <div class="dialogue">
    <div class="list">
      <Session />
    </div>
    <div class="chat">
      <Chat v-if="isInChat" />
    </div>
    <div class="info">
      <UserInfo v-if="isInChat" />
    </div>
  </div>
</template>
<script>
import { ImModule } from '@/im/store/modules/im'
import { cookie } from '@/im/utils/cookies'

import Chat from '@/im/components/Chat.vue'
import Session from '@/im/components/Session.vue'
import UserInfo from '@/im/components/UserInfo.vue'
import { logged, queryUserInfo } from '@/api/business/imService';

export default {
  name: 'Dialogue',
  components: {
    Chat,
    Session,
    UserInfo
  },
  props: {
    type: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      userAccount: '',
      userToken: ''
    };
  },
  computed: {
    isInChat() {
      return ImModule.dialogId !== ''
    }
  },

  mounted() {
    //TODO 用户信息目前写死

    this.CrmLoginWebim()
  },
  methods: {
    async CrmLoginWebim() {
      await logged({});
      const res = await queryUserInfo({ userId: '732945b2d2e14bbf9785d2b5d7cbdea6', type: '2' });
      const data = res.data;
      if (data && data.accountId && data.token) {
        this.userAccount = data.accountId;
        this.userToken = data.token;
        cookie.setCookie('uid', this.userAccount)
        cookie.setCookie('sdktoken', this.userToken)
        // $timeout(webImScript(), 2000);
        // 提交sdk连接请求
        ImModule.Connect()
      } else {
        this.$message({
          message: this.$t('im.accountError'),
          type: 'warning'
        });
        // $interval.cancel($rootScope.webimLeftInterval);//禁止轮询
      }
    },
  },
};
</script>

<style lang="less" scoped>
.dialogue {
  width: 100%;
}
</style>
