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
            <el-form-item :label="$t('buildManager.managerName')" label-width="150px" prop="name" class="is-required">
              <el-input v-model="buildForm.name" class="formItem" :placeholder="$t('buildManager.managerNameUnexpected')"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('buildManager.managerAccount')" label-width="150px" prop="accountName" class="is-required">
              <el-input v-model="buildForm.accountName" class="formItem" :placeholder="$t('buildManager.accountNameUnexpected')"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('buildManager.passWord')" label-width="150px" prop="passWord" class="is-required">
              <el-input auto-complete="new-password" v-model="buildForm.passWord" class="formItem" :placeholder="$t('buildManager.passWordUnexpected')"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('buildManager.team')" label-width="150px" prop="teamName" align="left">
              <el-select
                v-model="buildForm.teamName"
                class="formItem"
                filterable
                remote
                :remote-method="remoteMethod"
                :placeholder="$t('buildManager.teamPlaceholder')"
                :loading="loading"
                @change="handleChange"
              >
                <el-option
                  v-for="item in teams"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
              <br/>
              <el-button type="text" size="small" @click="buildManager">{{$t('buildManager.newTeam')}}</el-button>
              <el-button type="text" size="small" @click="buildManager(true)" v-if="this.dialogForm.teamName">{{$t('buildManager.showBuild')}}</el-button>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item>
              <el-button type="primary" @click="save" size="midium" style="width: 100px">{{$t('buildManager.save')}}</el-button>
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
      :title="$t('buildManager.newManager')"
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
              <el-form-item :label="$t('buildManager.teamName')" label-width="150px" prop="teamName">
                <el-input v-model="dialogForm.teamName" class="dialogFormItem" :disabled="isLook"/>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item>
                <el-button type="warning" @click="cancel" v-if="!isLook">{{$t('buildManager.cancel')}}</el-button>
                <el-button type="primary" @click="add" v-if="!isLook">{{$t('buildManager.add')}}</el-button>
              </el-form-item>
            </el-row>

          </el-form>
        </center>
      </el-card>
    </el-dialog>
	</div>
</template>

<script>
import { getManagerData , newAccount , batchAddCarList , queryCarTeamByName } from "@/api/business/businessService";
import { getUserInfo } from '@/api/users'
import Import from '@/components/import';

export default {
  name: 'BuildManager',
  components: {
    Import
  },
  data () {
    var checkName = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9]{2,20}$/;
      if(!value) {
        return callback(new Error(this.$t('buildManager.managerNameRequired')));
      } else if (!reg.test(value)) {
        return callback(new Error(this.$t('buildManager.managerNameWarn')));
      } else {
        callback();
      }
    };
    var checkTeamName = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9!_\-\u4e00-\u9fa5]+$/;
      if(!value) {
        return callback(new Error(this.$t('buildManager.teamNameRequired')));
      } else if (!reg.test(value)) {
        return callback(new Error(this.$t('buildManager.teamNameWarn')));
      } else if (value.length>32) {
        return callback(new Error(this.$t('buildManager.teamNameMax')));
      } else {
        callback();
      }
    };
    var checkAccountName = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9!_@#$%^&*\.\+\-=]+$/;
      if(!value) {
        return callback(new Error(this.$t('buildManager.managerAccountRequired')));
      } else if (value.search(/[a-zA-Z]+/)==-1) {
        return callback(new Error(this.$t('buildManager.aTozRequire')));
      } else if (!reg.test(value)) {
        return callback(new Error(this.$t('buildManager.managerAccountWarn')));
      } else if (value.length<6) {
        return callback(new Error(this.$t('buildManager.managerAccountMin')));
      } else if (value.length>20) {
        return callback(new Error(this.$t('buildManager.managerAccountMax')));
      } else {
        callback();
      }
    };
    var checkPassWord = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9!_@#$%^&*\.\+\-=]+$/;
      if(!value) {
        return callback(new Error(this.$t('buildManager.managerPasswordRequired')));
      } else if (!reg.test(value)) {
        return callback(new Error(this.$t('buildManager.managerPasswordWarn')));
      } else if (value.length<6) {
        return callback(new Error(this.$t('buildManager.managerPasswordMin')));
      } else if (value.length>20) {
        return callback(new Error(this.$t('buildManager.managerPasswordMax')));
      } else {
        callback();
      }
    };
    return {
      accountName: '',
      demoURL: 'http://sy.aerozhonghuan.com:81/test/yiqi/web/qdfaw/tboss/assets/import/addCarList.xlsx',
      tip: this.$t('buildManager.tip'),
      accept: '.xlsx,.xls',
      action: 'http://sy.aerozhonghuan.com:81/fsm/fsevice/uploadFile',
      limit: 1,
      batchAddInfo: null,
      teamId: '',
      isLook: false,
      loading: false,
      teams: [],
      teamsCopy: [],
      buildForm: {
        createType:'tboss',
        type: 2
      },
      dialogForm: {
        teamName: ''
      },
      dialogRuless: {
        teamName: [
          { validator: checkTeamName, trigger: 'blur' }
        ]
      },
      ruless: {
        name: [
          { validator: checkName, trigger: 'blur' },
        ],
        accountName: [
          { validator: checkAccountName, trigger: 'blur' }
        ],
        passWord: [
          { validator: checkPassWord, trigger: 'blur' }
        ],
        teamName: [
          { required: true, message: this.$t('buildManager.selectTeam'), trigger: 'change' }
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
    handleChange () {
      if(this.$refs['dialogForm']){
        this.$refs['dialogForm'].resetFields()
      }
    },
    save () {
      this.$refs['buildForm'].validate(async (valid) => {
        if (valid) {
          if (this.dialogForm.passWord) param.passWord = this.dialogForm.passWord
          let param = {}
          param.name = this.buildForm.name
          param.accountName = this.buildForm.accountName
          param.passWord = this.buildForm.passWord
          param.teamName = this.buildForm.teamName
          param.createType = 'tboss'
          param.type = '1'
          param.tbossName = this.accountName
          if(this.teams.length){
            let fil = this.teamsCopy.filter(item => {
              return item.name === this.buildForm.teamName
            })
            param.carTeamId = fil[0].id
          }else{
            param.isCompany = 0
            param.isGroup = 0
            param.isVip = 0
          }
          const re = await newAccount(param);
          if(re.message == 'OK'){
            this.$message({
              message: this.$t('buildManager.buildSuccess'),
              type: 'success'
            });
            if(this.$refs['buildForm']){
              this.$refs['buildForm'].resetFields()
            }
            if(this.$refs['dialogForm']){
              this.$refs['dialogForm'].resetFields()
            }
            this.teams = []
            this.teamsCopy = []
            this.$router.go(-1)
          } else {
            this.$message({
              message: this.$t('buildManager.buildFault'),
              type: 'error'
            });
          }
        } else {
          this.$message.error(this.$t('buildManager.submitFault'))
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
          this.buildForm.teamName = this.dialogForm.teamName
          this.teams = []
          this.teamsCopy = []
        } else {
          this.$message.error(this.$t('buildManager.submitFault'))
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
        const re = await queryCarTeamByName(params);
        this.teams = JSON.parse(JSON.stringify(re.data))
        this.teamsCopy = JSON.parse(JSON.stringify(re.data))
        this.loading = false;
      } else {
        this.teams = [];
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
    margin-top: 50px !important;
  }
  .margin {
    margin: 15px 0;
  }
  .transform {
    transform: rotate(90deg);
    color: #E6A23C;
  }
</style>
