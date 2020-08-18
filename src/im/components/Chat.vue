<template>
  <div class="g-inherit m-article">
    <div class="m-tab chat-header">
      <div>
        <span class="m-tab-top">
            {{customerName || $t('im.noNick')}}
          </span>
      </div>
      <div>
        <!-- <span class="m-tab-top">
            {{howlong?'当前会话时长'+howlong:''}}
          </span> -->
        <!-- TODO -->
        <el-button type="primary" size='mini' @click="toggleDialogTimeOut">{{autoClose === '1' ? $t('common.cancel') : $t('common.restore')}}{{ $t('im.timeOutClose') }}</el-button>
        <!-- TODO -->
        <el-button type="primary" size='mini' @click="closeChat">{{ $t('im.finishService') }}</el-button>
      </div>
</div>
    <div class="m-chat-main">
      <ChatList type="session"
                :msglist="msgList"
                @msgs-loaded="msgsLoaded" />
      <ChatEditor type="session"
                  :dialog-id="dialogId"
                  :to="to" />
    </div>
  </div>
</template>

<script>
import pageUtil from '@/im/utils/page'
import ChatList from './ChatList'
import ChatEditor from './ChatEditor'
import { ImModule } from '@/im/store/modules/im'
import Bus from '@/utils/bus';
import utils from '@/im/utils';
export default {
  components: {
    ChatList,
    ChatEditor
  },
  data() {
    return {
      time: null,
      howlong: '',
      // msglist:[]
      dialogTimeOutStatus: false
    }
  },
  computed: {
    to() {
      return ImModule.toperson
    },
    dialogId() {
      return ImModule.dialogId
    },
    customerName() {
      return ImModule.customerName
    },
    autoClose() {
      return ImModule.autoClose
    },
    userInfos() {
      return ImModule.userInfos
    },
    msgList() {
      // 解析消息时间。delayTime可配置间隔。目前为两分钟
      return utils.parseMsgTime()
    }
  },
  // 进入该页面，文档被挂载
  mounted() {
    Bus.$on('Chat_tag', () => {
        pageUtil.scrollChatListDown()
        // console.log('监听到新消息.滚动到底部')
        //清空时间轮询
        //  clearInterval(this.time);
        //  this.timekeep(1000)
        /* let session = ImModule.current_session
          console.log(session)
         if(session && session.list){
            this.msglist = session.list
         }*/
    });
  },
  // 离开该页面，此时重置当前会话
  destroyed() {
    //TODO 离开时候调用退出接口

    //清空时间
    Bus.$off('Chat_tag')
  },
  methods: {
    msgsLoaded() {
      // if (!ImModule.history.isHistory) pageUtil.scrollChatListDown()
      if (!ImModule.history.isHistory) Bus.$emit('scrollChatListDown')
    },
    timekeep(sec) {
      this.time = setInterval(() => {
        let mm = 0; let ss = 0;
        if ((++sec) / 60 > 0) {
          mm = parseInt(sec / 60);
          ss = sec % 60;
        } else {
          sec++;
          ss = sec;
        }
        this.$nextTick(() => {
        this.howlong = mm + this.$t('common.min') + ss + this.$t('common.sec')
      })
      }, 1000);
    },
    closeChat() {
      this.$confirm(this.$t('im.closeDialogTips'), this.$t('common.notice'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        ImModule.closeChat(this.dialogId)
        ImModule.setCurrent({ params: {
            historyPageNumber: 1,
            historySessions: [],
            isHistory: false, // 是否是历史状态。判断是否滚动到消息底部
            endTime: '', // 历史记录的用来对比是否还有历史消息
            noMore: false
          },
          types: 'history' })
      }).catch(() => {

      });
    },
    async toggleDialogTimeOut() {
      // console.log('取消/恢复超时关闭')
      await ImModule.toggleDialogTimeout(this.dialogId)
    }
  }
}
</script>
<style  lang="scss" scoped>
.g-window .m-tab .m-tab-right {
  width: 5rem;
  right: -1rem;
}
.m-tab-right {
  display: flex;
  justify-content: flex-end;
}
.invalidHint {
  width: 100%;
  height: 2rem;
  line-height: 2rem;
  text-align: center;
  background-color: bisque;
  color: burlywood;
}
</style>
<style>
.g-window .vux-header .m-tab-top {
  width: 80%;
  margin: 0 10%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
