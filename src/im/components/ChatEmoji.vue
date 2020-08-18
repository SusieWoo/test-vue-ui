<template>
  <div class="m-chat-emoji">
    <div class="emoji-content">
      <div class="cnt">
        <span v-bind:key="item.key" v-for="item in currEmoji.list"
              class="emoji-item"
              :class="{'pinup-item':item.type==='pinup'}"
              @click.stop="selectEmoji(item)">
          <img :src="item.img" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import emojiObj from '@/im/configs/emoji'
import { sendMsg } from '@/im/initNimSDK'
function genEmojiList(type, emojiList) {
  let result = {}
  for (let name in emojiList) {
    let emojiMap = emojiList[name]
    let list = []
    for (let key in emojiMap) {
      list.push({
        type,
        name,
        key,
        img: emojiMap[key].img
      })
    }
    if (list.length > 0) {
      result[name] = {
        type,
        name,
        list,
        album: list[0].img
      }
    }
  }
  return result
}

export default {
  props: {
    type: String,
    scene: String,
    to: String
  },
  data() {
    return {
      currType: 'emoji',
      currAlbum: 'emoji'
    }
  },
  computed: {
    emoji() {
      return genEmojiList('emoji', emojiObj.emojiList)
    },
    currEmoji() {
      if (this.currType === 'emoji') {
        return this.emoji[this.currAlbum]
      } else if (this.currType === 'pinup') {
        return this.pinup[this.currAlbum]
      }
      return []
    }
  },
  methods: {
    selectAlbum(album) {
      this.currType = album.type
      this.currAlbum = album.name
    },
    selectEmoji(emoji) {
      if (this.currType === 'emoji') {
        // 由触发父组件事件，增加表情文案
        this.$emit('add-emoji', emoji.key)
      } else if (this.currType === 'pinup') {
        if (this.type === 'session') {
          sendMsg({
            type: 'custom',
            scene: this.scene,
            to: this.to,
            pushContent: '[贴图表情]',
            content: {
              type: 3,
              data: {
                catalog: this.currAlbum,
                chartlet: emoji.key
              }
            }
          })
        }
        this.$emit('hide-emoji')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.m-chat-emoji {
  z-index: 1000;
  position: absolute;
  background: #fff;
  bottom: 50px;
  height: 162px;
  overflow: auto;
  right: 130px;
  width: 300px;
  //border-top: 1px solid #ccc;
  box-shadow: 0 0 5px 0 rgba(0,0,0,.1);
  border-radius: 10px;
  .emoji-channel {
    position: relative;
    width: 100%;
    height: auto;
    margin: 0 1rem;
    .emoji-album {
      display: inline-block;
      padding: 0.1rem;
      width: 1.8rem;
      height: 1.8rem;
      border-right: 1px solid #f0f0f0;
      img {
        margin: 0;
        display: block;
        width: inherit;
        height: inherit;
      }
      &.active {
        background-color: #f0f0f0;
      }
    }
  }
  .emoji-content {
    position: relative;
    width: 100%;
    height: 10rem;
    background: #fff;
    border-radius: 10px;
    overflow-y: auto;
    .cnt {
      position: relative;
      display: block;
      margin: 0.4rem auto;
      text-align: left;
    }
    .emoji-item {
      display: inline-block;
      width: 28px;
      height: 28px;
      padding: 2px;
      vertical-align: middle;
      /*border: 1px solid #fff;*/
      /*margin-left: -1px;*/
      /*margin-bottom: -1px;*/
      img {
        width: inherit;
        height: inherit;
      }
    }
    .pinup-item {
      width: 44px;
      height: 44px;
    }
  }
}
</style>
