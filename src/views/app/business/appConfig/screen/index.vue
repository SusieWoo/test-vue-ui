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
            <UploadImg :upload-config="uploadConfig"
                       :upload-finish="finishUpload"
                       @on-upload-success="uploadSuccess"
                       @on-handle-remove="handleRemove" />
            <el-form-item label="App类型">
              <el-select v-model="row.appType">
                <el-option v-for="item in appArr"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="跳转页面"
                          prop="name">
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
import { ViewData } from '@/data'
import { checkString } from '@/utils/rules'
import UploadImg from '@/components/UploadImg'

export default {
  components: {
    UploadImg
  },
  data () {
    return {
      row: {
        fileObjec: []
      },
      //得到数据 APP类型
      appArr: ViewData.operateAppScreen.appTypeList,
      fullscreenLoading: false,
      finishUpload: true,
      uploadConfig: {
        notice: '建议比例和分辨率：1080*1920',
        label: '广告页图片',
        sizeLimit: 2,
        numLimt: 1
      },
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'change' },
          { validator: checkString, trigger: 'change' },
          { max: 3, message: '输入长度不可超过3', trigger: 'change' }
        ]
      },
      bannerStatus: [{ key: '1', value: '上线' }, { key: '0', value: '下线' }],
    }
  },
  methods: {
    reset () {
      if (this.endDate === '0') {
        this.row.activityEndDate = ''
      }
    },
    uploadSuccess (res) {
      this.row.fileObjec = res;
      console.log(this.row.fileObjec)
    },
    handleRemove (res) {
      if (this.row.fileObjec[0].filePath === res.response.data[1].fullPath) {
        this.row.fileObjec = [];
      }
      console.log(this.row.fileObjec)
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
