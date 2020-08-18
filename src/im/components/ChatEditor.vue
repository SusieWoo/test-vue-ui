<template>
  <div class="m-chat-editor">
    <ChatEmoji v-show="isEmojiShown"
               :type="type"
               scene="p2p"
               :to="to"
               @add-emoji="addEmoji"
               @hide-emoji="hideEmoji" />
    <div class="m-chat-editor-main">
      <span class="u-editor-input">
        <!--<textarea v-model="msgToSent"
                  @focus='onInputFocus'></textarea>-->
        <el-input style="height: 100%" ref="msgInput" type="textarea" resize="none" v-model="msgToSent" placeholder="请输入内容" @focus='onInputFocus' />
      </span>
      <span class="u-editor-icons">
        <span
              class="u-editor-icon"
              @click.stop="showEmoji">
          <i class="u-icon-img"><img :src="icon1" /></i>
        </span>
        <span
              class="u-editor-icon"
              style="position: relative"
              @change="sendFileMsg">
          <i class="u-icon-img"><img :src="icon2" /></i>
          <input ref="fileToSent"
                 type="file" />
        </span>
        <el-button type="primary" size="small" @click="sendTextMsg">发送</el-button>
        <!--<span class="u-editor-send"
              @click="sendTextMsg">发 送</span>-->
      </span>
    </div>
  </div>
</template>

<script>
import ChatEmoji from './ChatEmoji'
import chatEditor1 from '@/im/images/im/chat-editor-1.png'
import chatEditor2 from '@/im/images/im/chat-editor-2.png'
import pageUtil from '@/im/utils/page'
import { sendMsg } from '@/im/initNimSDK'
import { ImModule } from '@/im/store/modules/im'
import Bus from '@/utils/bus';

export default {
  components: {
    ChatEmoji
  },
  props: {
    type: String,
    to: String,
    dialogId: [String, Number],
    invalid: {
      type: Boolean,
      default: false
    },
    invalidHint: {
      type: String,
      default: '您无权限发送消息'
    }
  },
  data() {
    return {
      isEmojiShown: false,
      msgToSent: '',
      icon1: chatEditor1,
      icon2: chatEditor2
    }
  },
  computed: {

  },
  watch: {

  },
    // 进入该页面，文档被挂载
  mounted() {
    Bus.$on('Chat_clear_input', data => {
         this.msgToSent = ''
    });
  },
  updated() {
    window.document.body.addEventListener('click', () => {
      this.isEmojiShown = false
    })
  },
  methods: {
    sendTextMsg() {
      if (/^\s*$/.test(this.msgToSent)) {
          this.$message({
              message: '请不要发送空消息',
              type: 'warning'
            });
        this.$refs.msgInput.focus()
        return
      } else if (this.msgToSent.length > 800) {
         this.$message({
              message: '请不要超过800个字',
              type: 'warning'
            });
        this.$refs.msgInput.focus()
        return
      }
      this.msgToSent = this.msgToSent.trim()
      const obj = {
        type: 'text',
        scene: 'p2p',
        to: this.to,
        text: this.msgToSent,
        dialogId: this.dialogId
      }
      sendMsg(obj)
      this.msgToSent = ''
      this.$refs.msgInput.focus()
    },
    sendFileMsg() {
      let ipt = this.$refs.fileToSent
      console.log('abc')
      if (ipt.value) {
        if (this.type === 'session') {
          //TODO
          const obj = {
            type: 'image',
            scene: 'p2p',
            to: this.to,
            dialogId: this.dialogId,
            fileInput: ipt
          }
          sendMsg(obj)
        }
      }
    },
    showEmoji() {
      this.isEmojiShown = !this.isEmojiShown
    },
    hideEmoji() {
      this.isEmojiShown = false
    },
    addEmoji(emojiName) {
      this.msgToSent += emojiName
      this.hideEmoji()
    },
    onInputFocus(e) {
      setTimeout(() => {
        e.target.scrollIntoView()
        pageUtil.scrollChatListDown()
      }, 200)
    }
  }
}
</script>

<style  lang="scss" scoped>

.u-editor-send.u-editor-receipt {
  background-color: #fefefe;
  border: #ccc solid 1px;
  color: black;
  padding: 0.1rem;
  margin-left: 0.1rem;
}
</style>
