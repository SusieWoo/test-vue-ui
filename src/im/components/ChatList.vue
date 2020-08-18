<template>
  <el-scrollbar ref="chatList"
                style="height: 530px" wrap-class="no-scroll-x">
    <ul id="chat-list"
        class="m-chat-list p-chat-list"
    >
      <!--    <li>{{getCurMsgs.list}}</li>-->
      <!--<li
          class="u-msg item-time more-btn" @click="getHistory">
        &#45;&#45;&#45;&#45; 点击更多 &#45;&#45;&#45;&#45;
      </li>-->
      <li
          v-if="noMore"
          class="u-msg item-time">
        <div class="tips-msg">
          <span>已无更多记录</span>
        </div>
      </li>
      <li v-if="loading && !noMore">
        <div v-loading="loading" style="width: 30px;height: 30px;margin: 10px auto"></div>
      </li>
      <!--<li v-for="msg in msglist"
          :key="msg.time + Math.random()">{{msg.content}}</li>-->
      <ChatItem
          v-for="msg in msglist"
          :key="msg.time + Math.random()"
          :raw-msg="msg"
          :is-history='msg.isHistory'
          @msg-loaded="msgLoaded" />
    </ul>
  </el-scrollbar>

</template>
<script type="text/javascript">
import { ImModule } from '@/im/store/modules/im'
import ChatItem from './ChatItem'
import Bus from '@/utils/bus'
import utils from '@/im/utils';
import pageUtil from '@/im/utils/page';
export default {
  components: {
     ChatItem
  },
  props: {
    type: String, // 类型 session
    msglist: {
      type: Array,
      default() {
        return []
      }
    },
    isHistory: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      isFullImgShow: false,
      msgLoadedTimer: null,
      loading: false,
      offsetTop: 0,
      dialogId: ''
    }
  },
  computed: {
    noMore() {
      return this.$store.state.im.history.noMore
    },
    scrollBar() {
      return this.$refs.chatList.wrap
    }
  },
   mounted() {
     Bus.$on('Chat_tag', () => {
       if (this.dialogId !== ImModule.dialogId) {
         ImModule.setCurrent({ params: '', types: 'resetHistory' })
       }
       this.loading = false
       this.scrollToBottom()
       this.dialogId = ImModule.dialogId
     })
     Bus.$on('scrollChatListDown', () => {
       if (this.dialogId !== ImModule.dialogId) {
         this.scrollToBottom()
       }
     })
     this.handleScroll()
  },
  destroyed() {
    Bus.$off('Chat_tag')
    Bus.$off('scrollChatListDown')
  },
  methods: {
    handleScroll() {
      this.scrollBar.onmousewheel = e => {
        this.onScroll(e)
      }
    },
    onScroll(e) {
      if (!ImModule.history.noMore && !this.loading && this.scrollBar.scrollTop === 0 && e.deltaY < 0) {
        // console.log('获取历史消息')
        this.getHistory(this.offsetTop)
        this.loading = true
        if (this.offsetTop === 0) this.offsetTop = 1
      } else if (e.target.offsetHeight + this.scrollBar.scrollTop === e.target.scrollHeight && ImModule.history.isHistory) {
        // console.log('到底了, 重置历史状态，使新消息能重新滚动到底部~')
        ImModule.resetIsHistory()
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.scrollBar.scrollTop = this.scrollBar.scrollHeight;
        }, 100)
      })
    },
    msgLoaded() {
      clearTimeout(this.msgLoadedTimer)
      this.msgLoadedTimer = setTimeout(() => {
        this.$emit('msgs-loaded')
      }, 20)
    },
    getHistory(top) {
      // console.log(ImModule.setHistorySessions)
       setTimeout(() => {
         ImModule.setHistorySessions().then(() => {
           // console.log('完毕')
           this.loading = false
           this.scrollBar.scrollTop = 200
           // this.$refs.chatList.scrollTop = 101
         })
       }, 500)
    }
  }
}
</script>

<style  lang="scss" scoped>
.p-chat-list {
  //min-height: 530px;
  //height: 530px;
  //overflow-y: scroll;
  .u-icon {
    width: 1.4rem;
    height: 1.6rem;
    margin-right: 0.2rem;
    vertical-align: bottom;
  }
}
.more-btn {
  cursor: pointer;
}
</style>
