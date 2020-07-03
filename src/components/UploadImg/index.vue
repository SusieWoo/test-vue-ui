<template>
  <el-form-item label="上传"
                prop="img">
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
</template>

<script lang="ts" scope>
import { Vue } from "vue-property-decorator";

@Component({
  name: "UploadImg"
})
interface fileImg {
  filePath: string;
  fileName: string;
  fileType: string;
}
export default class extends Vue {
  get uploadConfig() {
    return {
      sizeInvalid: false,
      sizeLimit: 2,
      numLimt: 1,
      finishUpload: false
    };
  }
  get fileObjec() {
    return [];
  }
  private handleRemove(file: any, fileList: number[]) {
    console.log(file, fileList);
  }

  private handlePreview(file: any) {
    console.log(file);
  }
  private handleExceed(files: any, fileList: number[]) {
    this.$message.warning(
      "当前限制选择 " +
        this.uploadConfig.numLimt +
        " 个文件，本次选择了" +
        files.length +
        "个文件，共选择了" +
        (files.length + fileList.length) +
        "个文件"
    );
  }
  private beforeRemove(file: any, fileList: number[]) {
    if (this.uploadConfig.sizeInvalid) {
      this.uploadConfig.sizeInvalid = false;
      return;
    }
    return this.$confirm("确定移除" + file.name + "？");
  }
  private progress() {
    this.uploadConfig.finishUpload = false;
  }
  private uploadSucHousePic(res: any) {
    this.uploadConfig.finishUpload = true;
    if (res.status === 200) {
      const obj: fileImg = {
        filePath: res.data[1].fullPath,
        fileName: res.data[1].fileName,
        fileType: res.data[1].ext_name
      };
      this.fileObjec.push(obj);
    } else {
      this.$message.error("网络服务异常，文件上传失败");
    }
  }
  private beforeUploadFile(file: any) {
    const size = file.size / 1024 / 1024;
    const limit = this.uploadConfig.sizeLimit;
    if (size > limit) {
      this.$notify.warning({
        title: "警告",
        message: `文件大小不得超过${limit}M`
      });
      this.uploadConfig.sizeInvalid = true;
      return false;
    }
  }
}
</script>
