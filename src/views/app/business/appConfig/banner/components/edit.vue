<template>
  <el-dialog :title="edit?'编辑':'新建' + 'banner'"
             :visible.sync="open"
             :before-close="cancel"
             append-to-body>
    <el-form ref="form"
             :rules="rules"
             label-width="100px"
             :model="row">
      <el-row :gutter="20">
        <el-col :span="20"
                :offset="1">
          <el-form-item :label="$t('common.title')"
                        prop="name">
            <el-input v-model="row.name" />
          </el-form-item>
          <el-form-item :label="$t('common.type')"
                        prop="bannerType">
            <el-select v-model="row.bannerType"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in bannerTypeList"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <UploadImg :upload-config="uploadConfig"
                     :upload-finish="finishUpload"
                     @on-upload-success="uploadSuccess"
                     @on-handle-remove="handleRemove" />
          <el-form-item :label="$t('business.appConfig.bannerLink')"
                        prop="bannerLink">
            <el-input v-model="row.bannerLink" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submit('form')">
              立即创建
            </el-button>
            <el-button type="primary"
                       @click="cancel()">
              取 消
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { basedata } from '@/api/public/PublicService';
import { ViewData } from '@/data'
import { checkUrl } from '@/utils/rules'
import UploadImg from '@/components/UploadImg'
import { setAd } from '@/api/business/BannerService';
export default {
  components: {
    UploadImg
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      fileObjec: [],
      edit: false,
      bannerTypeList: [],
      row: {
        appType: '0',
        imgUrl: null,
        accTarget: null,
        tm: 5
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
          { max: 5, trigger: 'change' }
        ],
        bannerType: [
          { required: true, message: '必填', trigger: 'change' }
        ],
        bannerLink: [
          { validator: checkUrl, trigger: 'change' }
        ],
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
      this.fileObjec = res;
    },
    handleRemove (res) {
      if (this.fileObjec[0].filePath === res.response.data[1].fullPath) {
        this.fileObjec = [];
      }
    },
    async getStyle () {
      let type = null;
      switch (this.type) {
        case 1: type = 'A';
          break;
        case 2: type = 'B';
          break;
        default: type = 'A';
      }
      const res = await basedata({ type: type, code: 'BAN1' })
      this.bannerTypeList = res.data.list;
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
    },
    toOpen (isEdit) {
      this.edit = isEdit
      this.init()
    },
    init () {
      if (this.edit) this.getStyle();
    },
    cancel: function () {
      this.$emit('confirm')
    }
  }
}
</script>