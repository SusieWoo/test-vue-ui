<template>
  <el-container class="view-form">
    <el-form ref="form"
             :rules="rules"
             label-width="220px"
             :model="row">
      <el-row type="flex"
              justify="center">
        <el-col :span="24">
          <el-card shadow="hover">
            <div slot="header">
              <span>信息</span>
            </div>
            <el-col :span="18"
                    :offset="2">
              <el-form-item label="上传">
                <el-upload multiple
                           :limit="10">
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
            </el-col>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      finishUpload: true,
      fullscreenLoading: false,
      time: '',
      endDate: '0',
      fileObjec: [],
      fileList: [],
      options: [
        { label: '1', value: 1 },
        { label: '自定义', value: 0 }
      ]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
