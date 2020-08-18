<template>
  <li class="u-msg session-chat"
    :class="{
      'item-me': msg.flow==='out',
      'item-you': msg.flow==='in',
      'item-time': msg.refreshTime,
      'item-tip': msg.type==='tip'
    }">
    <p v-if="msg.retract" class="u-msg item-time">{{$t('im.retract')}}</p>
    <div v-if="isHistory" class="tips-msg">
      <span>{{$t('im.aboutHis')}}</span>
    </div>
    <div v-if="msg.refreshTime" class="tips-msg">
      <span>{{msg.refreshTime}}</span>
    </div>
    <div v-else-if="msg.type==='tip'" class="tip">{{msg.showText}}</div>
    <div
      :idClient="msg.msgidClient"
      :time="msg.time"
      :flow="msg.flow"
      :type="msg.type"
    >

      <div class="msg-head">
        <!--<el-image :src="msg.avatar" class="icon u-circle">
          <div slot="error" class="image-slot">
            <i class="el-icon-s-custom"></i>
          </div>
       </el-image>-->
         <img class="chat-avatar" :src="msg.flow === 'in' ? headPic : servePic" onerror="onerror=null;src='https://uat-iov-tboss.fawjiefang.com.cn/tboss/assets/webim/default-icon.png'" />
      </div>

     <!-- TODO 表情 -->
      <span v-if="msg.type==='TEXT'" class="msg-text" v-html="msg.showText"></span>
      <span v-else-if="msg.type==='PICTURE'" class="msg-text" ref="mediaMsg" @click="viewImg(msg.content)"></span>
      <span v-else-if="msg.type==='VIDEO'" class="msg-text" ref="mediaMsg"></span>
      <span v-else-if="msg.type==='AUDIO'" class="msg-text" ref="mediaMsg"></span>
      <span v-else class="msg-text" v-html="msg.content"></span>
    </div>
  </li>
</template>

<script type="text/javascript">
  import util from '../utils'
  import config from '../configs'
  import emojiObj from '../configs/emoji'
  import { ImModule } from '@/im/store/modules/im'
  import servePic from '@/im/images/im/serve-icon.png'

export default {
    name: 'ChatItem',
    props: {
      rawMsg: {
        type: Object,
        default () {
          return {}
        }
      },
      isHistory: {
        type: Boolean,
        default() {
          return false
        }
      },
      type: String
    },
    data () {
      return {
        msg: '',
        isFullImgShow: false,
        currentAudio: null,
        servePic: servePic
      }
    },
    computed: {
      headPic() {
        return ImModule.headPic
      },
    },
    beforeMount () {
      let item = Object.assign({}, this.rawMsg)
      if (item.type === 'timeTag') {
        // 标记发送的时间
        item.showText = item.content
      } else if (item.type === 'TEXT') {
        // 文本消息
        item.showText = util.escape(item.content)
        if (/\[[^\]]+\]/.test(item.content)) {
          let emojiItems = item.showText.match(/\[[^\]]+\]/g)
          emojiItems.forEach(text => {
            let emojiCnt = emojiObj.emojiList.emoji
            if (emojiCnt[text]) {
              item.showText = item.showText.replace(text, `<img class="emoji-small" src="${emojiCnt[text].img}">`)
            }
          })
        }
      } else if (item.type === 'PICTURE') {
        // 原始图片全屏显示
        item.originLink = item.content
      } else if (item.type === 'VIDEO') {
        // ...
        item.videoLink = item.content
      } else if (item.type === 'AUDIO') {
        item.audioSrc = item.content
        // item.showText = Math.round(item.file.dur / 1000) + '" 点击播放'
      } else {
        item.showText = `[${util.mapMsgType(item)}],请到手机或电脑客户端查看`
      }
      this.msg = item
    },
    mounted () {
      let item = this.msg
      // 有时序问题的操作
      this.$nextTick(() => {
        let media = null
        if (item.type === 'PICTURE') {
          // 图片消息缩略图
          media = new Image()
          media.src = item.content + '?imageView&thumbnail=180x0&quality=85'
        } else if (item.type === 'TEXT') {
          // 贴图表情
          media = new Image()
          media.className = 'emoji-big'
          media.src = item.imgUrl
        } else if (item.type === 'VIDEO') {
          media = document.createElement('video')
          media.src = item.content
          // media.style.width = '80%'
          media.autoStart = false
          media.preload = 'metadata'
          media.controls = 'controls'
        } else if (item.type === 'AUDIO') {
          media = document.createElement('audio')
          media.controls = true // 这样控件才能显示出来
          media.style.width = '240px'
          media.controlsList = 'nodownload'
          media.src = item.content
        }
        if (media) {
          if (this.$refs.mediaMsg) {
            this.$refs.mediaMsg.appendChild(media)
          }
          media.onload = () => {
            this.$emit('msg-loaded')
          }
          media.onerror = () => {
            this.$emit('msg-loaded')
          }
        } else {
          this.$emit('msg-loaded')
        }
      }) // end this.nextTick
    },
    methods: {
      viewImg(url) {
        window.open(url)
      }
      /*playAudio (src) {
        if (!this.currentAudio) {
          this.currentAudio = new Audio(src)
          this.currentAudio.play()
          this.currentAudio.onended = () => {
            this.currentAudio = null
          }
        }
      }*/
    }
  }
</script>

<style lang="scss" scoped>
.chat-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
  .p-chat-history {
    .u-msg {
      .msg-link {
        display: none;
      }
    }
  }

  .msg-unread {
    position: relative;
    float: right;
    top: 0.3rem;
    right: 0.5rem;
    font-size: 0.9rem;
    color: #0091e4;
  }
</style>
