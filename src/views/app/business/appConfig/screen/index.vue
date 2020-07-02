<template>
  <el-container class="view-form">
    <el-form ref="form"
             :rules="rules"
             label-width="220px"
             :model="row">
      <el-row type="flex"
              justify="center">
        <el-col :span="24">
          <div slot="header">
            <span>信息</span>
          </div>
          <el-col :span="18"
                  :offset="2">
            <el-form-item label="上传">
              <el-upload class="upload-demo"
                         :action="this.UPLOAD_API"
                         :on-success="_uploadSucHousePic"
                         :on-progress="_progress"
                         :on-preview="_handlePreview"
                         :on-remove="_handleRemove"
                         :before-remove="_beforeRemove"
                         multiple
                         :limit="10"
                         :on-exceed="_handleExceed"
                         :file-list="row.fileArray">
                <el-button size="small"
                           type="primary">
                  点击上传
                </el-button>
                <div slot="tip"
                     class="el-upload__tip">
                  提示：最大支持5M文件，如果文件较大，请先压缩文件
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
          </el-col>
        </el-col>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { checkString } from '@/utils/rules'
export default {
  data () {
    return {
      row: {
      },
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
    _handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    _handlePreview (file) {
      console.log(file)
    },
    _handleExceed (files, fileList) {
      this.$message.warning('当前限制选择 10 个文件，本次选择了' + files.length + '个文件，共选择了' + (files.length + fileList.length) + '个文件')
    },
    _beforeRemove (file, fileList) {
      return this.$confirm('确定移除' + file.name + '？')
    },
    _reset () {
      if (this.endDate === '0') {
        this.row.activityEndDate = ''
      }
    },
    _progress () {
      this.finishUpload = false
    },
    _uploadSucHousePic (res) {
      this.finishUpload = true
      if (res.status === 200) {
        this.fileObjec.push({
          filePath: res.data.filePath,
          fileName: res.data.fileName,
          fileType: res.data.fileType
        })
      } else {
        this.$message.error('网络服务异常，文件上传失败')
      }
    }
  }
}
</script>
