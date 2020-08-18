<template>
  <div class="oilnew">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{$t('oil.activityTile')}}</span>
      </div>
      <el-form :model="filters" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item :label="$t('oil.activity')" prop="activityName">
          <el-input v-model="filters.activityName" style="width: 220px;" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('common.image')" prop="picUrl">
          <UploadImg ref='uploadImg' :upload-config="uploadConfig" :upload-finish="finishUpload" @on-upload-success="uploadSuccess" @on-handle-remove="handleRemove" />
        </el-form-item>
        <el-form-item :label="$t('oil.registrationTime')" class="enroll">
          <el-col :span="4">
            <el-form-item prop="enrollStartDate">
              <el-date-picker :disabled="isDisabled" @change="enrollChange(0)" v-model="filters.enrollStartDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('common.beginDate')"/>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="line">-</el-col>
          <el-col :span="4">
            <el-form-item prop="enrollEndDate">
              <el-date-picker :disabled="isDisabled" v-model="filters.enrollEndDate" @change="enrollChange(1)" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('common.endDate')"/>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('oil.activityTime')" class="enroll">
          <el-col :span="4">
            <el-form-item prop="activityStartDate">
              <el-date-picker :disabled="isDisabled" @change="enrollChange(2)" v-model="filters.activityStartDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('common.beginDate')"/>
            </el-form-item>
          </el-col>
          <el-col :span="2" class="line">-</el-col>
          <el-col :span="4">
            <el-form-item prop="activityEndDate">
              <el-date-picker :disabled="isDisabled" @change="enrollChange(3)" v-model="filters.activityEndDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" :placeholder="$t('common.endDate')"/>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('oil.textEdit')" prop="cpoywriterDetail">
          <el-button type="primary" @click="edit">{{$t('oil.textEdit')}}</el-button>
        </el-form-item>
        <el-form-item :label="$t('oil.refueling')" prop="openLike">
          <el-radio-group v-model="filters.openLike" :disabled="isDisabled">
            <el-radio label="1">{{$t('common.yes')}}</el-radio>
            <el-radio label="0">{{$t('common.no')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('oil.awards')" prop="awardRulesType">
          <el-select v-model="filters.awardRulesType" :placeholder="$t('common.placeSelect') + $t('oil.awards')" :disabled="isDisabled">
            <el-option :label="item.value" :value="item.key" v-for="item in gantTypeList" :key="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" v-if="!isDisabled">{{$t('oil.createNow')}}</el-button>
          <el-button @click="cancel()">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog :title="$t('oil.setUp') + '' + $t('oil.textEdit')" :visible.sync="isShow" width="40%" :showClose="false" :append-to-body="true" :lock-scroll="false" :close-on-click-modal="false">
      <el-form :model="cpoywriterDetail" :rules="cpoyRules" ref="cpoyForm" label-width="120px" class="demo-ruleForm">
        <el-form-item :label="$t('oil.activityDeatail')" prop="activityDetail">
          <el-input type="textarea" v-model="cpoywriterDetail.activityDetail" :disabled="isDisabled"/>
<!--          <div id="editor" style="width:370px;"></div>-->
        </el-form-item>
        <el-form-item :label="$t('oil.wechatTitle')" prop="activityWechartTitle">
          <el-input type="textarea" v-model="cpoywriterDetail.activityWechartTitle" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.wechatDesc')" prop="activityWechartSummary">
          <el-input type="textarea" v-model="cpoywriterDetail.activityWechartSummary" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.activityNotStart')" prop="activityNotStartedShare">
          <el-input type="textarea" v-model="cpoywriterDetail.activityNotStartedShare" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.registrationStage')" prop="enrollStageShare">
          <el-input type="textarea" v-model="cpoywriterDetail.enrollStageShare" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.activityStage')" prop="activityStageShare">
          <el-input type="textarea" v-model="cpoywriterDetail.activityStageShare" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.endActivity')" prop="activityEndStageShare">
          <el-input type="textarea" v-model="cpoywriterDetail.activityEndStageShare" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.errorData')" prop="abnormalData">
          <el-input type="textarea" v-model="cpoywriterDetail.abnormalData" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.reachingFinalStandard')" prop="reachingFinalStandard">
          <el-input type="textarea" v-model="cpoywriterDetail.reachingFinalStandard" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.reachingFinalNotStandard')" prop="reachingFinalNotStandard">
          <el-input type="textarea" v-model="cpoywriterDetail.reachingFinalNotStandard" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.notReachingFinalRanking')" prop="notReachingFinalRanking">
          <el-input type="textarea" v-model="cpoywriterDetail.notReachingFinalRanking" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.loadNotReachingFinalStandard')" prop="loadNotReachingFinalStandard">
          <el-input type="textarea" v-model="cpoywriterDetail.loadNotReachingFinalStandard" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.kickOut')" prop="kickOut">
          <el-input type="textarea" v-model="cpoywriterDetail.kickOut" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.notEnteringRanking')" prop="notEnteringRanking">
          <el-input type="textarea" v-model="cpoywriterDetail.notEnteringRanking" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.notAward')" prop="notAward">
          <el-input type="textarea" v-model="cpoywriterDetail.notAward" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.notEnrollCar')" prop="notEnrollCar">
          <el-input type="textarea" v-model="cpoywriterDetail.notEnrollCar" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.likeValue')" prop="likeValue">
          <el-input type="textarea" v-model="cpoywriterDetail.likeValue" :disabled="isDisabled"/>
        </el-form-item>
        <el-form-item :label="$t('oil.activityStop')" prop="activityStop">
          <el-input type="textarea" v-model="cpoywriterDetail.activityStop" :disabled="isDisabled"/>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button @click="cancel('detail')">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="save">{{$t('common.confirm')}}</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import UploadImg from '@/components/UploadImg'
  // import E from 'wangeditor'
  import { TagsViewModule } from '@/store/modules/tags-view'
  import { addOilActivityDetail, editOilActivityDetail, queryOilActivityDetail } from '@/api/oil/oilService';
  export default {
    name: 'oilnew',
    components: {
      UploadImg
    },
    data () {
      return {
        isDisabled: false,
        isShow: false,
        gantTypeList: [
          { key: '0' , value: this.$t('oil.distribution') },
          { key: '1', value: this.$t('oil.highValue') },
          { key: '2', value: this.$t('oil.lowValue') }
        ],
        filters: {
          activityName: '',
          enrollStartDate: '',
          enrollEndDate: '',
          activityStartDate: '',
          activityEndDate: '',
          openLike: '',
          awardRulesType: '',
          picUrl: '',
          cpoywriterDetail: ''
        },
        rules: {
          activityName: [
            { required: true, message: this.$t('oil.activityRequired'), trigger: 'change' }
          ],
          enrollStartDate: [
            { required: true, message: this.$t('oil.registrationTimeRequired'), trigger: 'change' }
          ],
          enrollEndDate: [
            { required: true, message: this.$t('oil.registrationTimeRequired'), trigger: 'change' }
          ],
          activityStartDate: [
            { required: true, message: this.$t('oil.activityTimeRequired'), trigger: 'change' }
          ],
          activityEndDate: [
            { required: true, message: this.$t('oil.activityTimeRequired'), trigger: 'change' }
          ],
          openLike: [
            { required: true, message: this.$t('oil.refuelingRequired'), trigger: 'change' }
          ],
          awardRulesType: [
            { required: true, message: this.$t('oil.awardsSelect'), trigger: 'change' }
          ],
          picUrl: [
            { required: true, message: this.$t('oil.imageRequired'), trigger: 'change' }
          ],
          cpoywriterDetail: [
            { required: true, message: this.$t('oil.textEditRequired'), trigger: 'change' }
          ]
        },
        uploadConfig: {
          sizeLimit: 2,
          numLimt: 1
        },
        finishUpload: true,
        cpoywriterDetail: {
          activityDetail: '',
          activityWechartTitle: '',
          activityWechartSummary: '',
          activityNotStartedShare: '',
          enrollStageShare: '',
          activityStageShare: '',
          activityEndStageShare: '',
          abnormalData: '',
          reachingFinalStandard: '',
          reachingFinalNotStandard: '',
          notReachingFinalRanking: '',
          loadNotReachingFinalStandard: '',
          kickOut: '',
          notEnteringRanking: '',
          notAward: '',
          notEnrollCar: '',
          likeValue: '',
          activityStop: ''
        },
        cpoyRules: {
          activityDetail: [
            { required: true, message: this.$t('oil.activityDeatail') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 500, message: this.$t('oil.less'), trigger: 'blur' }
          ],
          activityWechartTitle: [
            { required: true, message: this.$t('oil.wechatTitle') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 100, message: this.$t('oil.titleLess'), trigger: 'blur' }
          ],
          activityWechartSummary: [
            { required: true, message: this.$t('oil.wechatDesc') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 100, message: this.$t('oil.descLess'), trigger: 'blur' }
          ],
          activityNotStartedShare: [
            { required: true, message: this.$t('oil.activityNotStart') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 100, message: this.$t('oil.titleLess'), trigger: 'blur' },
            { max: 100, message: this.$t('oil.descLess'), trigger: 'blur' }
          ],
          enrollStageShare: [
            { required: true, message: this.$t('oil.registrationStage') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 100, message: this.$t('oil.descLess'), trigger: 'blur' }
          ],
          activityStageShare: [
            { required: true, message: this.$t('oil.activityStage') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 100, message: this.$t('oil.descLess'), trigger: 'blur' }
          ],
          activityEndStageShare: [
            { required: true, message: this.$t('oil.endActivity') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 100, message: this.$t('oil.descLess'), trigger: 'blur' }
          ],
          abnormalData: [
            { required: true, message: this.$t('oil.errorData') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 300, message: this.$t('oil.fonts'), trigger: 'blur' }
          ],
          reachingFinalStandard: [
            { required: true, message: this.$t('oil.reachingFinalStandard') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 300, message: this.$t('oil.fonts'), trigger: 'blur' }
          ],
          reachingFinalNotStandard: [
            { required: true, message: this.$t('oil.reachingFinalNotStandard') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 300, message: this.$t('oil.fonts'), trigger: 'blur' }
          ],
          notReachingFinalRanking: [
            { required: true, message: this.$t('oil.notReachingFinalRanking') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 300, message: this.$t('oil.fonts'), trigger: 'blur' }
          ],
          loadNotReachingFinalStandard: [
            { required: true, message: this.$t('oil.loadNotReachingFinalStandard') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 300, message: this.$t('oil.fonts'), trigger: 'blur' }
          ],
          kickOut: [
            { required: true, message: this.$t('oil.kickOut') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 300, message: this.$t('oil.fonts'), trigger: 'blur' }
          ],
          notEnteringRanking: [
            { required: true, message: this.$t('oil.notEnteringRanking') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 300, message: this.$t('oil.fonts'), trigger: 'blur' }
          ],
          notAward: [
            { required: true, message: this.$t('oil.notAward') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 300, message: this.$t('oil.fonts'), trigger: 'blur' }
          ],
          notEnrollCar: [
            { required: true, message: this.$t('oil.notEnrollCar') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 300, message: this.$t('oil.fonts'), trigger: 'blur' }
          ],
          likeValue: [
            { required: true, message: this.$t('oil.likeValue') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 300, message: this.$t('oil.fonts'), trigger: 'blur' }
          ],
          activityStop: [
            { required: true, message: this.$t('oil.activityStop') + '' + this.$t('oil.required'), trigger: 'change' },
            { max: 300, message: this.$t('oil.fonts'), trigger: 'blur' }
          ]
        }
      }
    },
    mounted () {
      if (this.$route.query.isEdit || this.$route.query.isLook) {
        this.vieworedit()
      }
      this.isDisabled = this.$route.query.isLook
    },
    methods: {
      vieworedit () {
        let self = this
        queryOilActivityDetail(self.$route.query.infos.activityId).then((data) => {
          self.filters = data.data
          self.$refs.uploadImg.fileList.push({ url: self.filters.picUrl })
          if (self.$route.query.isLook) {
            self.$refs.uploadImg.isEdit = true
          }
        })
      },
      edit () {
        this.isShow = true
        if (this.filters.cpoywriterDetail && Object.keys(this.filters.cpoywriterDetail)) {
          this.cpoywriterDetail = this.filters.cpoywriterDetail
        }
        // this.$nextTick(() => {
        //   let editor = new E('#editor')
        //   // 自定义菜单配置
        //   editor.customConfig.menus = [
        //     'head',// 标题
        //     'bold',// 粗体
        //     'italic',// 斜体
        //     'underline',// 下划线
        //     'strikeThrough',// 删除线
        //     'foreColor',// 文字颜色
        //     'backColor',// 背景颜色
        //     'justify',// 对齐方式
        //     // 'link',  // 插入链接
        //     'image'// 插入图片
        //   ]
        //   editor.customConfig.uploadImgShowBase64 = false
        //   editor.customConfig.onchange = (html) => {
        //     this.cpoywriterDetail.activityDetail = html
        //   }
        //   /*插入网络图片的校验*/
        //   editor.customConfig.linkImgCheck = (src) => {
        //     return true // 返回 true 表示校验成功
        //   }
        //   editor.create()
        //   if (this.cpoywriterDetail.activityDetail) {
        //     editor.txt.html(this.cpoywriterDetail.activityDetail)
        //   }
        // })
      },
      cancel (type) {
        if (!type) {
          this.$refs['ruleForm'].resetFields()
        } else {
          this.$refs['cpoyForm'].clearValidate()
          this.filters.cpoywriterDetail = this.cpoywriterDetail
          this.isShow = false
        }
        TagsViewModule.delView(this.$route)
        this.$router.go(-1)
      },
      submit () {
        let self = this
        self.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (self.$route.query.isEdit) {
              let obj = Object.assign(self.filters, self.filters.cpoywriterDetail)
              delete obj.cpoywriterDetail
              obj.activityId = self.$route.query.infos.activityId
              editOilActivityDetail(obj).then(() => {
                self.$message.success(self.$t('oil.editSuccess') + '！')
              })
            } else {
              let obj = Object.assign(self.filters, self.filters.cpoywriterDetail)
              delete obj.cpoywriterDetail
              addOilActivityDetail(obj).then(() => {
                self.$message.success(self.$t('oil.createActivitySuccess') + '！');
              })
            }
          }
        })
      },
      save () {
        this.$refs['cpoyForm'].validate((valid) => {
          if (valid) {
            this.isShow = false
            this.filters.cpoywriterDetail = this.cpoywriterDetail
          }
        })
      },
      enrollChange (flag) {
        if (flag === 0) {
          this.compareDate(this.filters.enrollStartDate,this.filters.enrollEndDate,true,false);
        } else if (flag === 1) {
          this.compareDate(this.filters.enrollStartDate,this.filters.enrollEndDate,false,false);
        } else if (flag === 2) {
          this.compareDate(this.filters.activityStartDate,this.filters.activityEndDate,true,true);
        } else if (flag === 3) {
          this.compareDate(this.filters.activityStartDate,this.filters.activityEndDate,false,true);
        }
      },
      compareDate (start, end, startFlag, activityFlag) {
        if (!start || start === '' || !end || end === '') return false;
        let s = new Date(start).getTime()
        let e = new Date(end).getTime()
        if (activityFlag) {
          if (s > e) {
            if (startFlag) {
              this.filters.activityStartDate = ''
              this.$message.warning(this.$t('oil.greaterThanTime'))
            } else {
              this.filters.activityEndDate = ''
              this.$message.warning(this.$t('oil.lessThanTime'));
            }
          }
        } else {
          if (s > e) {
            if (startFlag) {
              this.filters.enrollStartDate = ''
              this.$message.warning(this.$t('oil.greaterThanTime'));
            } else {
              this.filters.enrollEndDate = ''
              this.$message.warning(this.$t('oil.lessThanTime'))
            }
          } else if (s === e) {
            if (startFlag) {
              this.filters.enrollStartDate = ''
            } else {
              this.filters.enrollEndDate = ''
            }
            this.$message.warning(this.$t('oil.timeNotSame'))
          }
        }
      },
      uploadSuccess (res) {
        this.filters.picUrl = res[0].filePath
      },
      handleRemove (res) {
        this.filters.picUrl = ''
      }
    }
  }
</script>

<style scoped lang="scss">
  .oilnew{
    .line{
      padding-left: 59px;
      text-align: center;
    }
    ::v-deep .enroll{
      .el-form-item__label:before{
        content: "*";
        color: #ff4949;
        margin-right: 4px;
      }
    }
  }
</style>