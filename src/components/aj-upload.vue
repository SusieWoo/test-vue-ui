<template>
  <div class="aj-upload">
    <div class="upload-container">
      <span style="margin-right: 10px">{{label}}</span>
      <div class="upload-file-name" :style="{width}">
        {{ name || placeholder }}
      </div>
      <el-upload
          class="upload-demo"
          :show-file-list="false"
          :action="action"
          :accept="accept"
          :before-upload="handleBefore">
        <el-button size="small" type="primary">{{ fileBtnText }}</el-button>
      </el-upload>
      <p class="tips-p">{{getTips}}</p>
      <el-button v-if="showUploadButton" size="small" type="primary" :loading="loading" :disabled="!file" @click="upload">{{ confirmBtnText }}</el-button>
    </div>
    <div v-if="resultTips.length > 0" class="alerts">
      <el-alert
          v-for="(item, index) in resultTips"
          :key="index"
          style="margin-bottom: 10px"
          :closable="false"
          :title="item.text"
          :type="item.type" />
    </div>

    <div class="result-container">
<!--      <img style="width: 200px;margin-top: 10px;object-fit: cover" :src="parseImgUrl" />-->
      <el-image
          v-if="parseImgUrl"
          style="width: 200px; height: 200px"
          :src="parseImgUrl"
          :title="$t('common.viewImg')"
          fit="cover"
          :preview-src-list="srcList" />
    </div>
  </div>
</template>

<script>
import { uploadFile } from '@/api/public/PublicService'
export default {
  name: 'AjUpload',
  props: {
    label: String,
    placeholder: String,
    width: String,
    imgUrl: String,
    showUploadButton: {
      type: Boolean,
      default: true
    },
    action: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 4
    },
    fileBtnText: {
      type: String,
      default () {
        return this.$t('ajComponents.selectFile')
      }
    },
    confirmBtnText: {
      type: String,
      default () {
        return this.$t('ajComponents.import')
      }
    },
    accept: {
      type: String,
      default: '.xlsx,.xls,.csv,.txt'
    },
    tips: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      name: '',
      parseImgUrl: '',
      uploadResult: {
        success: {
          text: this.$t('ajComponents.uploadSuccess'),
          type: 'success'
        },
        error: {
          text: this.$t('ajComponents.errTips'),
          type: 'error'
        }
      },
      resultTips: this.tips,
      loading: false,
      file: null,
      srcList: []
    }
  },
  computed: {
    getSizeTips() {
      return this.size < 1 ? this.size * 1000 + 'KB' : this.size + 'M'
    },
    getTips() {
      // 上传不超过300K的PNG、JPG、JPEG格式图片文件
      return this.$t('ajComponents.tips', { size: this.getSizeTips, accept: this.accept.replace(/,/g, '、').replace(/\./g, '') })
      // return `上传不超过${this.getSizeTips}的${this.accept.replace(/,/g, '、').replace(/\./g, '')}格式文件`
    }
  },
  watch: {
    tips(newv) {
      this.resultTips.push(...newv)
    },
    imgUrl(newv) {
      this.parseImgUrl = newv
      this.srcList = [newv]
    }
  },
  methods: {
    handleBefore(file, fileList) {
      if (file.size > this.size * 1024 * 1024) {
        this.$message.error(`${this.$t('ajComponents.maxTip')}${this.getSizeTips}`)
        return false
      }
      if (this.accept.trim().split(',').indexOf(file.name.substring(file.name.lastIndexOf('.'))) < 0) {
        this.$message.error(`${this.$t('common.select')} ${this.accept.split(',').join(' ')} ${this.$t('common.type')}`)
        return false
      }
      if ('.jpg,.png,.jpeg'.indexOf(file.name.substring(file.name.lastIndexOf('.'))) > -1) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = res => {
          this.parseImgUrl = res.target.result
          this.srcList = [res.target.result]
        }
      }
      this.resultTips = []
      this.name = file.name
      this.file = file
      if (this.autoUpload) this.upload()
      return false
    },
    upload() {
      this.resultTips = []
      this.$emit('update:tips', [])
      if (this.file) {
        return new Promise((resolve, reject) => {
          this.loading = true
          const formData = new FormData()
          formData.append('file', this.file)
          formData.append('token', this.$store.state.user.token)
          uploadFile(formData).then(res => {
            this.resultTips.push(this.uploadResult.success)
            this.$emit('success', res.data)
            resolve(res.data)
          }).catch(() => {
            this.resultTips.push(this.uploadResult.error)
            // eslint-disable-next-line no-return-assign
          }).finally(() => this.loading = false)
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.aj-upload {
  padding: 10px 0;
}

.upload-container {
  display: flex;
  padding: 10px 0;
  align-items: center;

  .el-button {
    margin: 0 5px;
  }
}

.upload-file-name {
  border: 1px solid #1890FF;
  padding: 0 6px;
  box-sizing: border-box;
  height: 32px;
  line-height: 30px;
  width: 200px;
  overflow: auto;
  margin-right: 10px;
}
.result-container {
  padding-left: 75px;
}
</style>
