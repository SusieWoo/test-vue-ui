<template>
  <el-container v-loading.fullscreen.lock="fullscreenLoading">
    <el-form ref="form"
             :rules="rules"
             label-width="100px"
             :model="row">
      <el-row :gutter="20">
        <el-col :span="24">
          <div slot="header">
            <span>信息</span>
          </div>
          <el-col :span="18"
                  :offset="2">
            <el-form-item label="上传">
              <el-upload ref="uploadImg"
                         class="upload-demo"
                         :action="this.UPLOAD_API"
                         :on-success="uploadSucHousePic"
                         :on-progress="progress"
                         :on-preview="handlePreview"
                         :on-remove="handleRemove"
                         :before-remove="beforeRemove"
                         accept="image/png,image/gif,image/jpg,image/jpeg"
                         list-type="picture-card"
                         multiple
                         :limit="uploadConfig.numLimt"
                         :on-exceed="handleExceed"
                         :before-upload="beforeUploadFile">
                <el-button size="small"
                           type="primary">
                  点击上传
                </el-button>
                <div slot="tip"
                     class="el-upload__tip">
                  提示：最大支持{{uploadConfig.sizeLimit}}M文件
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="App类型">
              <el-select v-model="row.bannerStatus">
                <el-option v-for="item in bannerStatus"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="跳转页面">
              <el-input v-model="row.name" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click.native="submit('form')">
                立即创建
              </el-button>
            </el-form-item>
          </el-col>
        </el-col>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { checkString } from '@/utils/rules'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer.vue'
export default {
  data () {
    return {
      row: {
        fileObjec: []
      },
      fullscreenLoading: false,
      uploadConfig: {
        sizeInvalid: false,
        sizeLimit: 2,
        numLimt: 1
      },
      finishUpload: true,
      rules: {
        activityName: [
          { required: true, message: '必填', trigger: 'change' },
          { validator: checkString, trigger: 'change' },
          { max: 100, message: '输入长度不可超过100', trigger: 'change' }
        ]
      },
      bannerStatus: [{ key: '1', value: '上线' }, { key: '0', value: '下线' }],
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning('当前限制选择 ' + this.uploadConfig.numLimt + ' 个文件，本次选择了' + files.length + '个文件，共选择了' + (files.length + fileList.length) + '个文件')
    },
    beforeRemove (file, fileList) {
      if (this.uploadConfig.sizeInvalid) {
        this.uploadConfig.sizeInvalid = false;
        return
      }
      return this.$confirm('确定移除' + file.name + '？')
    },
    reset () {
      if (this.endDate === '0') {
        this.row.activityEndDate = ''
      }
    },
    progress () {
      this.finishUpload = false
    },
    uploadSucHousePic (res) {
      this.finishUpload = true
      this.fullscreenLoading = false
      if (res.status === 200) {
        this.row.fileObjec.push({
          filePath: res.data[1].fullPath,
          fileName: res.data[1].fileName,
          fileType: res.data[1].ext_name
        })
      } else {
        this.$message.error('网络服务异常，文件上传失败')
      }
    },
    beforeUploadFile (file) {
      const size = file.size / 1024 / 1024
      const limit = this.uploadConfig.sizeLimit
      if (size > limit) {
        this.$notify.warning({
          title: '警告',
          message: `文件大小不得超过${limit}M`
        });
        this.uploadConfig.sizeInvalid = true;
        this.fullscreenLoading = true;
        return false
      }
    },
    submit (formName) {
      this.$refs[formName].validate((valid, obj) => {
        if (valid) {
          if (!this.finishUpload) {
            this.$message.error('请等待图片上传完成')
            return
          }
          const arg = this.row
          console.log(arg)
        } else {
          this.$refs[Object.keys(obj)[0]].focus()
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.el-form {
  width: 100%;
}
</style>
