<template>
  <div class="dialogue">
    <div class="chat">
      3
    </div>
    <div class="info">
      5
    </div>
  </div>
</template>
<script>
import { ImModule } from '@/store/modules/im'
import { cookie } from '@/utils/cookies'
import { initNimSDK } from '@/im/initNimSDK'

export default {
  name: 'Dialogue',
  props: {
    type: {
      type: String,
      default: '1'
    }
  },
  data () {
    return {

    };
  },

  mounted () {
    //TODO 用户信息目前写死
    cookie.setCookie('uid', 'a91cbc7077a54215b3762a5b5c0f3313')
    cookie.setCookie('sdktoken', '021b65267869e99a8fa55634b03ce3b3')
    // 提交sdk连接请求
    ImModule.Connect()
    // TODO
    //this.$store.dispatch('updateRefreshState')
    initNimSDK()
  },
  methods: {
  },
};
</script>

<style lang="less" scoped>
.dialogue {
  width: 100%;
}
.chat {
  float: left;
  width: calc(100% - 240px);
  background: red;
}
.info {
  width: 240px;
  float: left;
  background: green;
}
</style>