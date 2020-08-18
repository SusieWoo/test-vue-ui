<template>
  <el-dialog :title="(isEdit?$t('common.edit'):$t('common.add'))"
             :visible.sync="open"
             :before-close="cancel"
             append-to-body>
    <el-form ref="form"
             v-loading.fullscreen.lock="fullscreenLoading"
             :rules="rules"
             label-width="120px"
             :model="row">
      <el-row :gutter="20">
        <el-col :span="20"
                :offset="1">
          <el-form-item :label="$t('business.appConfig.appCustom')">
            <el-checkbox v-model="from0"
                         :label="$t('business.appConfig.ownType')"
                         name="fromApp"
                         :disabled="isEdit"
                         @change="getStyle" />
            <el-checkbox v-model="from1"
                         :label="$t('business.appConfig.driverType')"
                         name="fromApp"
                         :disabled="isEdit"
                         @change="getStyle" />
          </el-form-item>
          <el-form-item :label="$t('common.title')"
                        prop="name">
            <el-input v-model="row.name"
                      clearable />
          </el-form-item>
          <el-form-item :label="$t('common.type')"
                        prop="bannerType">
            <el-select v-if="!isEdit"
                       v-model="row.bannerType"
                       clearable
                       :placeholder="$t('common.select')"
                       @change="change">
              <el-option v-for="item in style"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value" />
            </el-select>
            <el-input v-if="isEdit"
                      v-model="row.bannerTypeName"
                      disabled />
          </el-form-item>
          <UploadImg ref='uploadImg'
                     :upload-config="uploadConfig"
                     :upload-finish="finishUpload"
                     @on-upload-success="uploadSuccess"
                     @on-handle-remove="handleRemove" />
          <p style="margin-left:120px;margin-bottom:10px;">
            {{noticeTxt }}
          </p>
          <el-form-item v-if="row.bannerType===1||row.bannerType===2||row.bannerType===5||row.bannerType===6"
                        :label="$t('business.appConfig.bannerLink')"
                        prop="bannerLink">
            <el-input v-model="row.bannerLink"
                      clearable />
          </el-form-item>
          <el-form-item v-if="row.bannerType===4||row.bannerType===5"
                        :label="$t('business.appConfig.color')"
                        prop="color">
            <el-input v-model="row.color"
                      clearable />
          </el-form-item>
          <el-form-item v-if="row.bannerType===3"
                        :label="$t('business.appConfig.appLink')"
                        prop="appLink">
            <el-input v-model="row.appLink"
                      clearable />
          </el-form-item>
          <el-form-item v-if="row.bannerType===7||row.bannerType===8"
                        :label="$t('business.appConfig.bannerLink')"
                        prop="bannerLink2">
            <el-input v-model="row.bannerLink"
                      clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       @click="submit('form')">
              {{$t('common.save')}}
            </el-button>
            <el-button type="primary"
                       @click="cancel()">
              {{$t('common.cancel')}}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import { basedata } from '@/api/public/PublicService';
import { checkUrl, checkColor } from '@/utils/rules'
import UploadImg from '@/components/UploadImg'
import { AddBannerInfo, UpdateBannerInfo } from '@/api/business/BannerService';
/*
   *  v2.26修改。已于孟高洁确认，当车队和司机都选择的时候，下拉没有1,7,8。
   *  所有下拉都不会返回type是6的。mengqs在新建司机首页bannar，库里会插入6，这时仅当编辑时，详情返回type=6的情况
   *  {1:"首页banner"},{2:"福利社页banner"},{3:"福利社页福利区图片"},{4:"推荐购车背景"},{5:"被推荐购车背景"},{7:"首页浮标"},{8:"首页推荐位"}]
   *  /basedata 下拉筛选规则：7浮标，8推荐位
   *  type：A （车队搜索下拉，车队新建，1~5，没7，没8）
   *  type：B （司机搜索下拉，1~8，都要有）（前端特殊处理，选1传6）
   *  type：C （司机新建，1~7，有7，没8）
   *  type：D （司机和车队新建，只有2，3，4，5）
   *
   *  建议分辨率
   *  车队-新建-1080*640
   *  司机-新建-1080*360
   *  车队-编辑-bannerType=1
   *  司机-编辑-bannerType=6
   *
   * */
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
    }
  },

  data() {
    return {
      noticeTxt: '',
      style: '',
      isEdit: false,
      bannerTypeList: [],
      params: {},
      from0: false,
      from1: false,
      row: {
      },
      fullscreenLoading: false,
      finishUpload: true,
      rules: {
        from: [
          { required: true, message: this.$t('common.rules.required'), trigger: 'change' }
        ],
        name: [
          { required: true, message: this.$t('common.rules.required'), trigger: 'change' },
          { max: 50, trigger: 'change' }
        ],
        bannerType: [
          { required: true, message: this.$t('common.rules.required'), trigger: 'change' }
        ],
        bannerLink: [
          { required: true, message: this.$t('common.rules.required'), trigger: 'change' },
          { validator: checkUrl, trigger: 'change' }
        ],
        bannerLink2: [
          { max: 500, trigger: 'change' }
        ],
        color: [
          { required: true, message: this.$t('common.rules.required'), trigger: 'change' },
          { validator: checkColor, trigger: 'change' }
        ],
        appLink: [
          { required: true, message: this.$t('common.rules.required'), trigger: 'change' },
        ],
      },
    }
  },
  computed: {
    uploadConfig() {
      return {
        label: this.$t('common.image'),
        sizeLimit: 2,
        numLimt: 1
      }
    },
    bannerStatus() {
      return [{ key: '1', value: this.$t('common.data.onOrOff[0]') }, { key: '0', value: this.$t('common.data.onOrOff[1]') }]
    },
  },
  methods: {
    getStyle() {
      this.row.bannerType = '';
      this.getBannerTypeList();
      this.resetSize();
    },
    reset() {
      if (this.endDate === '0') {
        this.row.activityEndDate = ''
      }
    },
    /*类型修改*/
    change() {
      this.resetSize();
      this.resetData();
    },
    resetData() {
      if (this.row.bannerLink) this.row.bannerLink = '';
      if (this.row.appLink) this.row.appLink = '';
      if (this.row.color) this.row.color = '';
    },
    /*
   * 司机版的 首页banner，建议比例和分辨率1000x350 车队版的 首页banner，建议比例和分辨率1080x460
   * */
    resetSize() {
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
      this.noticeTxt = size ? this.$t('common.noticePic') + size : '';
    },
    uploadSuccess(res) {
      this.row.imgPath = res[0].filePath;
    },
    handleRemove(res) {
      this.row.imgPath = ''
    },
    async getBannerTypeList() {
      let type = 'A';
      if (this.from0 && !this.from1) { //仅车队
        type = 'A';
      } else if (!this.from0 && this.from1) { //仅司机(submit的时候bannerType传的是1时候，由后端处理成6再存)
        type = 'C';
      } else { //车队和司机 同时选中与同时不选中时
        type = 'D';
      }
      const res = await basedata({ type: type, code: 'BAN1' })
      this.style = res.data.list;
    },
    async add(row) {
      const params = row;
      if (!params.imgPath) {
        this.$message.warning(this.$t('common.tips.uploadImg'))
        return false
      }
      this.fullscreenLoading = true
      if (!(this.row.bannerType === 4 || this.row.bannerType === 5)) {
        this.row.color = ''
      }
      let type = [];
      if (this.form0) type.push('1')
      if (this.form1) type.push('2')
      this.row.type = type.join(',');

      this.isEdit ? await UpdateBannerInfo(params) : await AddBannerInfo(params);
      this.$message.success(this.$t('common.tips.operateSuccess'))
      this.fullscreenLoading = false
      this.cancel()
    },
    submit(formName) {
      this.$refs[formName].validate((valid, obj) => {
        if (valid) {
          if (!this.finishUpload) {
            this.$message.error(this.$t('common.tips.finishUpload'))
            return
          }
          this.add(this.row)
        } else {
          return false
        }
      })
    },
    toOpen(isEdit, params, type) {
      this.isEdit = isEdit
      this.params = params
      this.type = type
      if (this.type === 1) {
        this.from0 = true;
      } else {
        this.from1 = true
      }
      if (this.isEdit) {
        this.row = {
          bannerType: parseInt(this.params.bannerType),
          bannerTypeName: this.params.bannerTypeName,
          name: this.params.bannerName,
          type: this.type,
          imgPath: this.params.imgPath,
          bannerLink: this.params.bannerType !== '3' ? this.params.bannerLink : '',
          appLink: this.params.bannerType === '3' ? this.params.bannerLink : '',
          color: this.params.color,
          id: this.params.id
        }
        this.$nextTick(() => {
          this.$refs.uploadImg.changePath([{ url: this.params.imgPath }]);
        })
      } else {
        this.row = {
          type: this.type
        };
        this.$nextTick(() => {
          this.$refs.uploadImg.changePath([]);
        })
      }
      this.init()
    },
    init() {
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