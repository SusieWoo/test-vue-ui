<template>
	<div class="app-container">
    <el-card>
      <center>
        <el-form
          :inline="true"
          :model="buildForm"
          label-position="left"
          :rules="ruless"
          ref="buildForm"
        >
          <el-row>
            <el-form-item :label="$t('carGroupBuild.teamName')" label-width="150px" prop="teamName">
              <el-input v-model="buildForm.teamName" class="formItem"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('carGroupBuild.setManager')" label-width="150px" prop="name" align="left">
              <el-select
                v-model="buildForm.name"
                class="formItem"
                filterable
                remote
                :remote-method="remoteMethod"
                :placeholder="$t('carGroupBuild.setManagerTip')"
                :loading="loading"
                @change="handleChange"
              >
                <el-option
                  v-for="item in managers"
                  :key="item.id"
                  :label="(item.name && item.name!=''?item.name:$t('noName')) + '（' + (item.phone && item.phone!=''?item.phone:$t('noPhone')) + '，' + (item.accountName&&item.accountName!=''?item.accountName:$t('noAccount')) + '）'"
                  :value="item.name">
                </el-option>
              </el-select>
              <br/>
              <el-button type="text" size="small" @click="buildManager">{{$t('carGroupBuild.buildManager')}}</el-button>
              <el-button type="text" size="small" @click="buildManager(true)" v-if="this.dialogForm.name">{{$t('carGroupBuild.showBuild')}}</el-button>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item>
              <el-button type="primary" @click="save" size="midium" style="width: 100px">{{$t('carGroupBuild.save')}}</el-button>
            </el-form-item>
          </el-row>

        </el-form>
      </center>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="buildManagerDialogVis"
      top="20vh"
      width="50%"
      :title="$t('carGroupBuild.buildManager')"
    >
      <el-card>
        <center>
          <el-form
            :inline="true"
            :model="dialogForm"
            label-position="left"
            :rules="dialogRuless"
            ref="dialogForm"
          >
            <el-row>
              <el-form-item :label="$t('carGroupBuild.managerName')" label-width="150px" prop="name">
                <el-input v-model="dialogForm.name" class="dialogFormItem" :disabled="isLook"/>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item :label="$t('carGroupBuild.managerAccount')" label-width="150px" prop="accountName" class="is-required">
                <el-input v-model="dialogForm.accountName" class="dialogFormItem" :disabled="isLook"/>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item :label="$t('carGroupBuild.passWord')" label-width="150px" prop="passWord" class="is-required">
                <el-input auto-complete="new-password" v-model="dialogForm.passWord" class="dialogFormItem" :disabled="isLook"/>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item>
                <el-button type="warning" @click="cancel" v-if="!isLook">{{$t('carGroupBuild.cancel')}}</el-button>
                <el-button type="primary" @click="add" v-if="!isLook">{{$t('carGroupBuild.add')}}</el-button>
              </el-form-item>
            </el-row>

          </el-form>
        </center>
      </el-card>
    </el-dialog>
    <Import
      :title="$t('carGroupBuild.BatchAddCarTip')"
      :batchAddCarVis="batchAddCarVis"
      :limit="limit"
      :action="action"
      :accept="accept"
      :tip="tip"
      :demoURL="demoURL"
      :batchAddInfo="batchAddInfo"
      @handleSuccess = "handleSuccess"
      @cancelBatchAddCar = "cancelBatchAddCar"
    ></Import>
	</div>
</template>

<script>
import { getManagerData , newAccount , batchAddCarList } from "@/api/business/businessService";
import { getUserInfo } from '@/api/users'
import Import from '@/components/import';

export default {
  name: 'CarGroupBuild',
  components: {
    Import
  },
  data () {
    var checkTeamName = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9!_\-\u4e00-\u9fa5]+$/;
      if(!value) {
        return callback(new Error(this.$t('carGroupBuild.teamNameRequire')));
      } else if (!reg.test(value)) {
        return callback(new Error(this.$t('carGroupBuild.teamNameUnexpected')));
      } else if (value.length>32) {
        return callback(new Error(this.$t('carGroupBuild.teamNameMaxTip')));
      } else {
        callback();
      }
    };
    var checkAccountName = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9!_@#$%^&*\.\+\-=]+$/;
      if(!value) {
        return callback(new Error(this.$t('carGroupBuild.managerAccountRequire')));
      } else if (value.search(/[a-zA-Z]+/)==-1) {
        return callback(new Error(this.$t('carGroupBuild.aTozRequire')));
      } else if (!reg.test(value)) {
        return callback(new Error(this.$t('carGroupBuild.managerAccountUnexpected')));
      } else if (value.length<6) {
        return callback(new Error(this.$t('carGroupBuild.minTip')));
      } else if (value.length>20) {
        return callback(new Error(this.$t('carGroupBuild.maxTip')));
      } else {
        callback();
      }
    };
    var checkPassWord = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9!_@#$%^&*\.\+\-=]+$/;
      if(!value) {
        return callback(new Error(this.$t('carGroupBuild.possWordRequired')));
      } else if (!reg.test(value)) {
        return callback(new Error(this.$t('carGroupBuild.possWordUnexpected')));
      } else if (value.length<6) {
        return callback(new Error(this.$t('carGroupBuild.possWordMinTip')));
      } else if (value.length>20) {
        return callback(new Error(this.$t('carGroupBuild.possWordMaxTip')));
      } else {
        callback();
      }
    };
    return {
      accountName: '',
      demoURL: 'http://sy.aerozhonghuan.com:81/test/yiqi/web/qdfaw/tboss/assets/import/addCarList.xlsx',
      tip: this.$t('carGroupBuild.BatchAddCarMaxTip'),
      accept: '.xlsx,.xls',
      action: 'http://sy.aerozhonghuan.com:81/fsm/fsevice/uploadFile',
      limit: 1,
      batchAddInfo: null,
      teamId: '',
      batchAddCarVis: false,
      isLook: false,
      loading: false,
      managers: [],
      managersCopy: [],
      buildForm: {
        createType:'tboss',
        type: 2
      },
      dialogForm: {
        name: '',
        accountName: '',
        passWord: ''
      },
      ruless: {
        teamName: [
          { validator: checkTeamName, trigger: 'blur' }
        ],
        name: [
          { required: true, message: this.$t('carGroupBuild.managerRequired'), trigger: 'change' }
        ]
      },
      dialogRuless: {
        name: [
          { required: true, message: this.$t('carGroupBuild.nameRequired'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$t('carGroupBuild.nameUnexpected'), trigger: 'blur' }
        ],
        accountName: [
          { validator: checkAccountName, trigger: 'blur' }
        ],
        passWord: [
          { validator: checkPassWord, trigger: 'blur' }
        ]
      },
      buildManagerDialogVis: false,
      fileList: []
    }
  },
  activated() {
    this.getAccountName ()
  },
  methods: {
    cancelBatchAddCar () {
      this.batchAddCarVis = false
      if(this.$refs['buildForm']){
        this.$refs['buildForm'].resetFields()
      }
      if(this.$refs['dialogForm']){
        this.$refs['dialogForm'].resetFields()
      }
      this.managers = []
      this.managersCopy = []
      this.batchAddInfo = null
      this.$router.go(-1)
    },
    async handleSuccess (response) {
      let params = {
        uuid: response.data.fullPath,
        fileType: response.data.ext_name,
        reviewer: this.accountName,
        teamId: this.teamId
      }
      const batchAdd = await batchAddCarList(params)
      this.batchAddInfo = batchAdd.data
    },
    handleChange () {
      if(this.$refs['dialogForm']){
        this.$refs['dialogForm'].resetFields()
      }
    },
    save () {
      this.$refs['buildForm'].validate(async (valid) => {
        if (valid) {
          let param = {}
          param.teamName = this.buildForm.teamName
          param.name = this.buildForm.name
          param.createType = 'tboss'
          param.type = '2'
          param.tbossName = this.accountName    
          if(this.managers.length){
            let fil = this.managersCopy.filter(item => {
              return item.name === this.buildForm.name
            })
            param.managerId = fil[0].id
          }
          if (this.dialogForm.accountName) param.accountName = this.dialogForm.accountName
          if (this.dialogForm.passWord) param.passWord = this.dialogForm.passWord
          param.isCompany = 0
          param.isGroup = 0
          param.isVip = 0
          const re = await newAccount(param);
          if(re.message == 'OK'){
            this.batchAddCarVis = true
            this.teamId = re.data
          } else {
            this.$message({
              message: this.$t('carGroupBuild.buildFault'),
              type: 'error'
            });
          }
        } else {
          this.$message.error(this.$t('carGroupBuild.sunmitFault'))
          return false
        }
      });
    },
    cancel () {
      this.$refs['dialogForm'].resetFields()
      this.buildManagerDialogVis = false
    },
    add () {
      this.$refs['dialogForm'].validate(async (valid) => {
        if (valid) {
          this.buildManagerDialogVis = false
          this.buildForm.name = this.dialogForm.name
          this.managers = []
          this.managersCopy = []
        } else {
          this.$message.error(this.$t('carGroupBuild.sunmitFault'))
          return false
        }
      });
    },
    async remoteMethod(query) {
      if (query !== '') {
        let params = {
          keyWord: query
        }
        this.loading = true;
        const re = await getManagerData(params);
        this.managers = JSON.parse(JSON.stringify(re.data))
        this.managersCopy = JSON.parse(JSON.stringify(re.data))
        this.loading = false;
      } else {
        this.managers = [];
      }
    },
    buildManager (flag) {
      this.buildManagerDialogVis = true
      if(flag===true){
        this.isLook = true
      }else{
        if(this.$refs['dialogForm']){
          this.$refs['dialogForm'].resetFields()
        }
        this.isLook = false
      }
    },
    async getAccountName () {
      const user = await getUserInfo()
      this.accountName = user.data.username
    }
  }
}
</script>

<style scoped>
  .formItem {
    width: 600px
  }
  .dialogFormItem {
    width: 300px
  }
  .el-form-item {
    margin-top: 100px !important;
  }
  .margin {
    margin: 15px 0;
  }
  .transform {
    transform: rotate(90deg);
    color: #E6A23C;
  }
</style>
