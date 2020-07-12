<template>
  <el-form-item :label="uploadConfig.label"
                :prop="uploadConfig.ruleName?uploadConfig.ruleName:'img'">
    <el-upload ref="uploadImg"
               :show-file-list="true"
               name="file"
               class="upload-demo"
               :action="actionUp"
               :on-success="onUploadSuccess"
               :on-progress="progress"
               :on-preview="handlePreview"
               :on-remove="onHandleRemove"
               :before-remove="beforeRemove"
               accept="image/png,image/gif,image/jpg,image/jpeg"
               list-type="picture-card"
               :multiple="multiple"
               :limit="uploadConfig.numLimt"
               :on-exceed="handleExceed"
               :before-upload="beforeUploadFile"
               :file-list="fileList"
               :drag="false">
      <el-button size="small"
                 type="primary">
        {{$t('common.clickUpload')}}
      </el-button>
      <div v-if="uploadConfig.notice"
           slot="tip"
           class="el-upload__tip">
        {{$t('common.notice')}}：{{uploadConfig.notice}}
      </div>
    </el-upload>
  </el-form-item>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'

interface iFileImg {
  filePath: string
  fileName: string
  fileType: string
}
interface iFileStract {
  url: string
}
interface iUploadParams {
  notice: string
  label: string
  sizeLimit: number
  numLimt: number
  ruleName?: string
}

@Component
export default class UploadImg extends Vue {
  @Prop() private uploadConfig!: iUploadParams
  @Prop() private uploadPath!: Array<iFileStract>
  private sizeInvalid: boolean = false
  private multiple: boolean = false
  private fileObjec: Array<iFileImg> = []
  private fileList: iFileStract[] = []
  private actionUp: string = this.$UPLOAD_API
  private uploadFinish!: boolean

  private handlePreview(file: any) {}
  private handleExceed(files: any, fileList: iFileStract[]) {
    this.$message.warning(
      '当前限制选择 ' +
        this.uploadConfig.numLimt +
        ' 个文件，本次选择了' +
        files.length +
        '个文件，共选择了' +
        (files.length + fileList.length) +
        '个文件'
    )
  }
  private beforeRemove(file: any, fileList: iFileStract[]) {
    // 由于设置了限制图片上传大小，当超过限制大小，组件会触发beforeRemove，这时无需询问是否移除
    if (this.sizeInvalid) {
      this.sizeInvalid = false
      return
    }
    return this.$confirm(this.$t('common.toDel') + file.name + '？')
  }
  private progress() {
    this.uploadFinish = false
  }

  @Emit()
  private onHandleRemove(file: any, fileList: iFileStract[]) {
    return file
  }

  @Emit()
  public onUploadSuccess(res: any) {
    this.uploadFinish = true
    if (res.status === 200) {
      const obj: iFileImg = {
        filePath: res.data[1].fullPath,
        fileName: res.data[1].fileName,
        fileType: res.data[1].ext_name
      }
      this.fileObjec.push(obj)
      return this.fileObjec
    } else {
      this.$message.error(
        `${this.$t('common.netError')},${this.$t('common.fileUploadFail')}`
      )
    }
  }
  private beforeUploadFile(file: any) {
    const size = file.size / 1024 / 1024
    const limit = this.uploadConfig.sizeLimit
    if (size > limit) {
      this.$notify.warning({
        title: `${this.$t('common.warning')}`,
        message: `${this.$t('common.fileSizeFail')}${limit}M`
      })
      this.sizeInvalid = true
      return false
    }
  }
  public changePath(p: Array<iFileStract>) {
    this.fileList = p
  }
}
</script>
