<template>
  <el-container v-loading.fullscreen.lock="fullscreenLoading">
    <el-form ref="form"
             :rules="rules"
             label-width="100px"
             :model="row">
      <el-row :gutter="20">
        <el-col :span="12"
                :offset="3">
          <UploadImg :upload-config="uploadConfig"
                     :upload-finish="finishUpload"
                     @on-upload-success="uploadSuccess"
                     @on-handle-remove="handleRemove" />
          <el-form-item :label="$t('business.appConfig.appType')"
                        prop="appType">
            <el-select v-model="row.appType">
              <el-option v-for="item in appArr"
                         :key="item.key"
                         :label="item.value"
                         :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('business.appConfig.accTarget')"
                        prop="accTarget">
            <el-input v-model="row.accTarget"
                      clearable />
          </el-form-item>
          <el-form-item :label="$t('business.appConfig.tm')"
                        prop="tm">
            <el-input v-model="row.tm"
                      clearable>
              <template slot="append">{{$t('common.seconds')}}</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submit('form')">
              {{$t('business.appConfig.create')}}
            </el-button>
            <el-button type="primary"
                       @click="goBack()">
              {{$t('common.cancel')}}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-container>
</template>

<script>
import { ViewData } from '@/data'
import { Num, checkUrl } from '@/utils/rules'
import UploadImg from '@/components/UploadImg'
import { setAd } from '@/api/business/BannerService';
import { TagsViewModule } from '@/store/modules/tags-view';

export default {
  components: {
    UploadImg
  },
  data () {
    return {
      fileObjec: [],
      row: {
        appType: '0',
        imgUrl: null,
        accTarget: null,
        tm: 5
      },
      fullscreenLoading: false,
      finishUpload: true,
      rules: {
        tm: [
          { required: true, message: '必填', trigger: 'change' },
          { validator: Num, trigger: 'change' }
        ],
        appType: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        accTarget: [
          { validator: checkUrl, trigger: 'change' }
        ],
      },
    }
  },
  computed:{
       uploadConfig() {
         return {
            notice: this.$t('common.noticePic') + '1080*1920',
            label: this.$t('business.appConfig.adsPic'),
            sizeLimit: 2,
            numLimt: 1
         }
      },
      appArr() {
         return ViewData.operateAppScreen.appTypeList(this)
      },
  },
  methods: {
    reset () {
      if (this.endDate === '0') {
        this.row.activityEndDate = ''
      }
    },
    uploadSuccess (res) {
      this.fileObjec = res;
    },
    handleRemove (res) {
      if (this.fileObjec[0].filePath === res.response.data[1].fullPath) {
        this.fileObjec = [];
      }
    },
    async add (query) {
      const params = query;
      if (this.fileObjec && this.fileObjec[0] && this.fileObjec[0].filePath) {
        params.imgUrl = this.fileObjec[0].filePath
      } else {
        this.$message.warning('请上传图片')
        return false
      }
      this.fullscreenLoading = true
      await setAd(params);
      this.$message.success('操作成功')
      this.fullscreenLoading = false
    },
    goBack () {
      TagsViewModule.delView(this.$route);
      this.$router.go(-1);
    },
    submit (formName) {
      this.$refs[formName].validate((valid, obj) => {
        if (valid) {
          if (!this.finishUpload) {
            this.$message.error('请等待图片上传完成')
            return
          }
          this.add(this.row)
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-form {
  width: 100%;
}
</style>
