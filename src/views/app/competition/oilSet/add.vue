<template>
  <el-card class="box-card">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item :label="$t('oil.schemeName')" prop="confName">
        <el-input v-model="ruleForm.confName" style="width:215px;" :placeholder="$t('oil.enterScheme')" :disabled="$route.query.isLook"/>
      </el-form-item>
      <el-form-item :label="$t('oil.schemeType')" prop="confType">
        <el-select v-model="ruleForm.confType" :placeholder="$t('oil.selectSchemeType')" :disabled="$route.query.isLook || $route.query.isEdit || ruleForm.data.length > 0">
          <el-option :label="$t('oil.luckDraw')" value="1"/>
          <el-option :label="$t('oil.ranking')" value="0"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('oil.awardContent')" prop="data">
        <el-row style="text-align:right;" v-if="!$route.query.isLook">
          <el-button type="primary" @click="addAward">{{$t('oil.addAwards')}}</el-button>
        </el-row>
        <el-table :data="ruleForm.data" :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}">
          <el-table-column :label="$t('oil.sort')" type="index" width="80"/>
          <el-table-column prop="prizeImgUrl" :label="$t('common.image')">
            <template slot-scope="scope">
              <img :src="scope.row.prizeImgUrl" alt="" width="100"/>
            </template>
          </el-table-column>
          <el-table-column :label="$t('oil.awardName')" prop="prizeName"/>
          <el-table-column prop="prizeType" :label="$t('oil.awardType')" v-if="ruleForm.confType === '1'"/>
          <el-table-column prop="prizeNum" :label="$t('oil.awardNum')" v-if="ruleForm.confType === '1'" />
          <el-table-column prop="probability" :label="$t('oil.winning')" v-if="ruleForm.confType === '1'">
            <template slot-scope="scope">
              {{scope.row.probability + '%'}}
            </template>
          </el-table-column>
          <el-table-column prop="prizeMinValue" :label="$t('oil.scopeAwards')" v-if="ruleForm.confType === '0'">
            <template slot-scope="scope">{{scope.row.prizeMinValue + ' - ' + scope.row.prizeMaxValue}}</template>
          </el-table-column>
          <el-table-column prop="prizeLimit" :label="$t('oil.restrictions')" v-if="ruleForm.confType === '1'">
            <template slot-scope="scope">{{scope.row.prizeLimit === '-1' ? '' : scope.row.prizeLimit}}</template>
          </el-table-column>
          <el-table-column prop="numRemainPrize" :label="$t('oil.prizeValue')" v-if="ruleForm.confType === '1'"/>
          <el-table-column :label="$t('common.operate')" v-if="!$route.query.isLook" width="160">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="edit(scope.row,scope.$index)" >{{$t('common.edit')}}</el-button>
              <el-button size="mini" @click="removePrice(scope.$index)" >{{$t('common.del')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item v-if="!$route.query.isLook">
        <el-button type="primary" @click="saveRule">{{$t('oil.saveProduct')}}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :title="$t('oil.addAwards')" :visible.sync="dialogFormVisible" label-width="100" width="40%" style="height: auto;" :showClose="false" :append-to-body="true" :lock-scroll="false" :close-on-click-modal="false">
      <el-form :model="formAwards" :rules="awardRules" ref="form" class="demo-ruleForm" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item :label="$t('oil.awardName')" prop="prizeName">
              <el-input v-model="formAwards.prizeName" autocomplete="off" :placeholder="$t('oil.enterAwardName')"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('oil.awardPic')" prop="prizeImgUrl">
              <UploadImg ref='uploadImg' :upload-config="uploadConfig" :upload-finish="finishUpload" @on-upload-success="uploadSuccess" @on-handle-remove="handleRemove" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('oil.awardType')" prop="prizeType">
              <el-select v-model="formAwards.prizeType" :placeholder="$t('oil.selectAwardType')" style="width:200px;">
                <el-option :label="item.value" :value="item.key" v-for="(item,index) in finalAward" :key="index"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('oil.awardNum')" prop="prizeNum" v-if="ruleForm.confType === '1'">
              <el-input v-model="formAwards.prizeNum" autocomplete="off" :placeholder="$t('oil.prizesNum')"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('oil.prizeValue')" prop="prizeCost">
              <el-input v-model="formAwards.prizeCost" autocomplete="off" :placeholder="$t('oil.prizesValue')"/>
              <span>{{$t('oil.prizeValueRange')}}</span>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('oil.scopeAwards')" v-if="ruleForm.confType === '0'" class="enroll">
              <el-col :span="9">
                <el-form-item  prop="prizeMinValue">
                  <el-input v-model="formAwards.prizeMinValue" autocomplete="off" :placeholder="$t('oil.startingRank')" style="width:150px"/>
                </el-form-item>
              </el-col>
             <el-col :span="2" style="padding-right:5px;text-align:center;">
               <span>-</span>
             </el-col>
              <el-col :span="9">
                <el-form-item prop="prizeMaxValue">
                  <el-input v-model="formAwards.prizeMaxValue" autocomplete="off" :placeholder="$t('oil.endingRank')" style="width:150px"/>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('oil.winning')" prop="prizeProbability" v-if="ruleForm.confType === '1'">
              <el-input v-model="formAwards.prizeProbability" autocomplete="off" :placeholder="$t('oil.prizesNumber')" style="width:400px"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('oil.restrictions')" prop="prizeLimit" v-if="ruleForm.confType === '1'">
              <el-input v-model="formAwards.prizeLimit" autocomplete="off" :placeholder="$t('oil.prizeTimes')" style="width:400px"/>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center;">
            <el-form-item>
              <el-button @click="cancel">{{$t('common.cancel')}}</el-button>
              <el-button type="primary" @click="saveAward">{{$t('common.confirm')}}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </el-card>
</template>

<script>
  import UploadImg from '@/components/UploadImg'
  import { checkOnlyPrizeCost, getPrizeDetail, addConfigure, editConfigure } from '@/api/oil/oilService';
  export default {
    name: 'addSet',
    components: {
      UploadImg
    },
    data() {
      let checkNum = (rule, value, callback) => {
        let reg = /^(?:0|[1-9]\d{0,4}|[1-4]\d{0,5}|500000)$/
        if (!reg.test(value)) {
          callback(new Error(this.$t('oil.prizeNum')))
        } else {
          callback()
        }
      }
      let checkCost = (rule, value, callback) => {
        let reg = /(^[1-9][0-9]{0,5}$)|(^1000000$)/
        if (!reg.test(value)) {
          callback(new Error(this.$t('oil.prizeInteger')))
        } else {
          callback()
        }
      }
      let checkMin = (rule, value, callback) => {
        let reg = /^[1-9]\d*$/
        if (!reg.test(value)) {
          callback(new Error(this.$t('oil.integer')))
        } else {
          callback()
        }
      }
      let checkMax = (rule, value, callback) => {
        let reg = /^[1-9]\d*$/
        if (!reg.test(value)) {
          callback(new Error(this.$t('oil.integer')))
        } else {
          callback()
        }
      }
      let checkProbability = (rule, value, callback) => {
        let reg = /^(!0|[1-9]\d{0,1}|100)$/
        if (!reg.test(value)) {
          callback(new Error(this.$t('oil.positiveInteger')))
        } else {
          callback()
        }
      }
      return {
        finalAward: [
          { key: '1', value: this.$t('oil.integral') },
          { key: '0', value: this.$t('oil.material') },
          { key: '2', value: this.$t('oil.fictitious') }
        ],
        uploadConfig: {
          sizeLimit: 2,
          numLimt: 1
        },
        finishUpload: true,
        rules: {
          confName: [
            { required: true, message: this.$t('oil.enterScheme'), trigger: 'change' }
          ],
          confType: [
            { required: true, message: this.$t('oil.selectSchemeType'), trigger: 'change' }
          ],
          data: [
            { required: true, message: this.$t('oil.addAwardContent'), trigger: 'change' }
          ]
        },
        ruleForm: {
          confType: '1',
          confName: '',
          data: []
        },
        oiltype: '',
        dialogFormVisible: false,
        formAwards: {
          prizeName: '',
          prizeImgUrl: '',
          prizeType: '',
          prizeNum: '',
          prizeCost: '',
          prizeMinValue: '',
          prizeMaxValue: '',
          prizeProbability: '',
          prizeLimit: ''
        },
        awardRules: {
          prizeName: [
            { required: true, message: this.$t('oil.enterAwardName'), trigger: 'change' },
            { max: 10, message: this.$t('oil.maxName'), trigger: 'change' }
          ],
          prizeImgUrl: [
            { required: true, message: this.$t('oil.prizePicture'), trigger: 'change' }
          ],
          prizeType: [
            { required: true, message: this.$t('oil.prizeType'), trigger: 'change' }
          ],
          prizeNum: [
            { required: true, message: this.$t('oil.prizesNum'), trigger: 'change' },
            { validator: checkNum, trigger: 'change' }
          ],
          prizeCost: [
            { required: true, message: this.$t('oil.prizesValue'), trigger: 'change' },
            { validator: checkCost, trigger: 'change' }
          ],
          prizeMinValue: [
            { required: true, message: this.$t('oil.startingRank'), trigger: 'change' },
            { validator: checkMin, trigger: 'change' }
          ],
          prizeMaxValue: [
            { required: true, message: this.$t('oil.endingRank'), trigger: 'change' },
            { validator: checkMax, trigger: 'change' }
          ],
          prizeProbability: [
            { required: true, message: this.$t('oil.enterWinning'), trigger: 'change' },
            { validator: checkProbability, trigger: 'change' }
          ]
        },
        indx: '-1',
      }
    },
    mounted() {
      if (this.$route.query.isLook || this.$route.query.isEdit) {
        this.getDetail()
      }
    },
    methods: {
      saveRule() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let obj = JSON.parse(JSON.stringify(this.ruleForm))
            if (obj.data.length <= 0) {
              return this.$message.warning(this.$t('oil.addAward') + '!')
            }
            let flag = this.ruleForm.data.some((item) => {
              return item.prizeCost === this.formAwards.prizeCost
            })
            if (flag) return this.$message.warning(this.$t('oil.prizeRepeated') + '!')
            if (this.$route.query.isLook || this.$route.query.isEdit) {
              obj.confId = this.$route.query.rowData.id
            }
            let rate = 0
            obj.data.forEach((item) => {
              if (item.probability) {
                rate += parseInt(item.probability)
                item.prizeProbability = item.probability
                delete item.probability
              }
              if (item.numRemainPrize) delete item.numRemainPrize
            })
            obj.list = obj.data
            delete obj.data
            if (rate !== 100 && obj.confType === '1') { // 抽奖情况下
              this.$message.warning(this.$t('oil.addUp'))
              return false
            }
            if (this.$route.query.isEdit) {
              editConfigure(obj).then(() => {
                this.$message.success(this.$t('oil.awardEditing') + '！')
              })
            } else {
              addConfigure(obj).then(() => {
                this.$message.success(this.$t('oil.awardAdding') + '！')
              })
            }
          }
        })
      },
      addAward() {
        this.dialogFormVisible = true
      },
      edit(row, index) {
        this.indx = index
        this.formAwards = JSON.parse(JSON.stringify(row))
        this.formAwards.prizeProbability = this.formAwards.probability
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['uploadImg'].fileList.push({ url: this.formAwards.prizeImgUrl })
        })
      },
      saveAward() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.ruleForm.confType === '1' && this.formAwards.prizeLimit) {
              let reg = /^[1-9]\d*|0$/
              if (!reg.test(this.formAwards.prizeLimit)) {
                return this.$message.warning(this.$t('oil.negative'))
              }
            }
            if (this.ruleForm.confType === '0' && (this.formAwards.prizeMinValue > this.formAwards.prizeMaxValue)) return this.$message.warning('开始名次应小于结束名次!')
            let flag = this.ruleForm.data.some((item) => {
              return item.prizeCost === this.formAwards.prizeCost
            })
            if (flag && !this.$route.query.isEdit) return this.$message.warning(this.$t('oil.prizeExits') + '!')
            checkOnlyPrizeCost(this.formAwards.prizeCost, this.formAwards.prizeId).then(() => {
              this.dialogFormVisible = false
              if (this.formAwards.prizeProbability) this.formAwards.probability = this.formAwards.prizeProbability
              if (this.formAwards.prizeNum) this.formAwards.numRemainPrize = this.formAwards.prizeNum
              if (this.indx !== '-1') {
                this.ruleForm.data[this.indx] = JSON.parse(JSON.stringify(this.formAwards))
              } else {
                this.ruleForm.data.push(JSON.parse(JSON.stringify(this.formAwards)))
              }
              this.$refs['uploadImg'].fileList = []
              this.$refs['form'].resetFields()
            })
          }
        })
      },
      cancel() {
        this.dialogFormVisible = false
        this.$refs['form'].resetFields()
        this.$refs['uploadImg'].fileList = []
      },
      uploadSuccess(res) {
        this.formAwards.prizeImgUrl = res[0].filePath
      },
      handleRemove(res) {
        this.formAwards.prizeImgUrl = ''
      },
      removePrice(index) {
        this.ruleForm.data.splice(index,1)
      },
      getDetail() {
        getPrizeDetail(this.$route.query.rowData.id).then((data) => {
          this.ruleForm = data.data
          this.ruleForm.data = data.data.list
          delete this.ruleForm.list
          this.ruleForm.data.forEach((item) => {
            if (item.prizeLimit === '-1') {
              item.prizeLimit = ''
            }
          })
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .el-input{
    width: 200px;
  }
  ::v-deep .el-dialog__body{
    padding: 10px 20px;
  }
  ::v-deep .enroll{
    .el-form-item__label:before{
      content: "*";
      color: #ff4949;
      margin-right: 4px;
    }
  }
</style>