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
          {{row.test1}}{{row.test2}}
          <el-form-item label="APP端">
            <el-checkbox v-model="row.from0"
                         label="司机端"
                         name="type" />
            <el-checkbox v-model="row.from1"
                         label="车队端"
                         name="type" />
          </el-form-item>
          <el-form-item :label="$t('common.title')"
                        prop="name">
            <el-input v-model="row.name" />
          </el-form-item>
          <el-form-item :label="$t('common.type')"
                        prop="bannerType">
            <el-select v-model="row.bannerType"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in style"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <UploadImg :upload-config="uploadConfig"
                     :upload-finish="finishUpload"
                     @on-upload-success="uploadSuccess"
                     @on-handle-remove="handleRemove" />
          <p v-if="noticeTxt !== ''"
             style="margin-left:100px">
            {{noticeTxt }}
          </p>
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
      noticeTxt: '',
      fileObjec: [],
      style: '',
      edit: false,
      bannerTypeList: [],
      params: {},
      row: {
      },
      //得到数据 APP类型
      appArr: ViewData.operateAppScreen.appTypeList,
      fullscreenLoading: false,
      finishUpload: true,
      uploadConfig: {
        label: '图片',
        sizeLimit: 2,
        numLimt: 1,
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
  mounted () {

  },
  methods: {
    reset () {
      if (this.endDate === '0') {
        this.row.activityEndDate = ''
      }
    },
    change () {
      this.resetSize();
      this.resetData();
    },
    resetData () {
      if (this.row.bannerLink) this.row.bannerLink = '';
      if (this.row.appLink) this.row.appLink = '';
      if (this.row.color) this.row.color = '';
    },
    /*
   * 司机版的 首页banner，建议比例和分辨率1000x350 车队版的 首页banner，建议比例和分辨率1080x460
   * */
    resetSize () {
      let size = '';
      switch (this.row.bannerType) {
        case 1:/*车队版首页banner*/
          size = '1080x460';
          if (this.type === 2) {
            size = '1000x350';
          }
          break;
        case 2:
          size = '1080*640'; break;
        case 3:/*福利社页福利区图片*/
          size = '900*120'; break;
        case 4:/*推荐购车背景*/
          size = '1080*1080'; break;
        case 5:/*被推荐购车背景*/
          size = '1080*1080'; break;
        case 6:/*司机版首页banner*/
          size = '1000x350'; break;
        case 7:/*首页浮标*/
          size = '300*300'; break;
        case 8:/*首页推荐位*/
          size = '320*240'; break;
        default:
          size = '';
      }
      this.noticeTxt = size ? '建议比例和分辨率：' + size : '';
      console.log(this.noticeTxt)
    },
    uploadSuccess (res) {
      this.fileObjec = res;
    },
    handleRemove (res) {
      if (this.fileObjec[0].filePath === res.response.data[1].fullPath) {
        this.fileObjec = [];
      }
    },
    async getBannerTypeList () {
      let type = 'A';
      if (this.row.from0 && !this.row.from1) { //仅车队
        type = 'A';
      } else if (!this.row.from0 && this.row.from1) { //仅司机(submit的时候bannerType传的是1时候，由后端处理成6再存)
        type = 'C';
      } else { //车队和司机 同时选中与同时不选中时
        type = 'D';
      }
      const res = await basedata({ type: type, code: 'BAN1' })
      this.style = res.data.list;
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
    toOpen (isEdit, params) {
      this.edit = isEdit
      this.params = params
      if (this.edit) {
        this.row = {
          bannerType: parseInt(this.params.bannerType),
          bannerTypeName: this.params.bannerTypeName,
          name: this.params.bannerName,
          type: this.type,
          imgPath: this.params.imgPath,
          bannerLink: this.params.bannerType !== 3 ? this.params.bannerLink : '',
          appLink: this.params.bannerType === 3 ? this.params.bannerLink : '',
          color: this.params.color,
          id: this.params.id
        }
      } else {
        this.row = {
          type: this.type
        };
      }
      console.log(this.row)
      this.init()
    },
    init () {
      /*获取图片尺寸*/
      this.resetSize();
      this.getBannerTypeList();
    },
    cancel: function () {
      this.$emit('confirm')
    }
  }
}
</script>