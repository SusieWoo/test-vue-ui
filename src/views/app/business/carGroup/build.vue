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
            <el-form-item :label="'车队名称'" label-width="150px" prop="teamName">
              <el-input v-model="buildForm.teamName" class="formItem"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="'指派管理员'" label-width="150px" prop="name" align="left">
              <el-select
                v-model="buildForm.name"
                class="formItem"
                filterable
                remote
                :remote-method="remoteMethod"
                :placeholder="'请输入管理员账号或姓名或手机号进行查询（没有找到管理员可以‘新建管理员’）'"
                :loading="loading"
                @change="handleChange"
              >
                <el-option
                  v-for="item in managers"
                  :key="item.id"
                  :label="(item.name && item.name!=''?item.name:'无姓名') + '（' + (item.phone && item.phone!=''?item.phone:'无手机号') + '，' + (item.accountName&&item.accountName!=''?item.accountName:'无账号') + '）'"
                  :value="item.name">
                </el-option>
              </el-select>
              <br/>
              <el-button type="text" size="small" @click="buildManager">新建管理员</el-button>
              <el-button type="text" size="small" @click="buildManager(true)" v-if="this.dialogForm.name">查看新建</el-button>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item>
              <el-button type="primary" @click="save" size="midium" style="width: 100px">保存</el-button>
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
      title="新建管理员"
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
              <el-form-item :label="'管理员名称：'" label-width="150px" prop="name">
                <el-input v-model="dialogForm.name" class="dialogFormItem" :disabled="isLook"/>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item :label="'管理员账号：'" label-width="150px" prop="accountName">
                <el-input v-model="dialogForm.accountName" class="dialogFormItem" :disabled="isLook"/>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item :label="'管理员密码：'" label-width="150px" prop="passWord">
                <el-input auto-complete="new-password" v-model="dialogForm.passWord" class="dialogFormItem" :disabled="isLook"/>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item>
                <el-button type="warning" @click="cancel" v-if="!isLook">取消</el-button>
                <el-button type="primary" @click="add" v-if="!isLook">添加</el-button>
              </el-form-item>
            </el-row>

          </el-form>
        </center>
      </el-card>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="batchAddCarVis"
      top="20vh"
      width="50%"
      title="是否需要批量加车？"
    >
      <el-upload
        :limit="1"
        ref="upload"
        action="http://sy.aerozhonghuan.com:81/fsm/fsevice/uploadFile"
        :file-list="fileList"
        :auto-upload="false"
        accept=".xlsx,.xls"
        :on-success="handleSuccess">
        <el-button slot="trigger" size="small" type="primary" style="width: 100px">选取文件</el-button>
        <br/>
        <div slot="tip" class="el-upload__tip el-icon-info">每次批量导入最多支持1000条数据</div>
      </el-upload>
      
      <el-row style="margin: 5px 0">
        <div style="display: inline-block; margin-right: 10px;">
          <el-button size="small" type="success" @click="submitUpload" style="width: 200px">EXCEL导入</el-button>
        </div>
        <el-link href="http://sy.aerozhonghuan.com:81/test/yiqi/web/qdfaw/tboss/assets/import/addCarList.xlsx" target="_blank">
          <el-button size="small" type="info" style="width: 200px">模板下载</el-button>
        </el-link>
      </el-row>
      
      <el-row style="margin: 20px 0" v-if="batchAddInfo">
        <center>
          <div>导入<span>{{batchAddInfo.sum}}</span>条，其中：&nbsp;<span class="el-icon-success" style="color: #67C23A"></span>&nbsp;成功<span>{{batchAddInfo.trueNum}}</span>条，&nbsp;<span class="el-icon-warning" style="color: #E6A23C"></span>&nbsp;失败<span>{{batchAddInfo.sum-batchAddInfo.trueNum}}</span>条</div>
          
          <div class="margin" v-if="batchAddInfo.carTeamExistsNum"><span class="el-icon-thumb transform"></span>&nbsp;序号<span>{{batchAddInfo.carTeamExistsNum}}</span>，车队中已存在，请勿重复加车</div>
          <div class="margin" v-if="batchAddInfo.systemExistsNum"><span class="el-icon-thumb transform"></span>&nbsp;序号<span>{{batchAddInfo.systemExistsNum}}</span>，车辆信息在系统中没有记录，无法添加</div>
          <div class="margin" v-if="batchAddInfo.existsNum"><span class="el-icon-thumb transform"></span>&nbsp;序号<span>{{batchAddInfo.existsNum}}</span>，数据重复</div>
          <div class="margin" v-if="batchAddInfo.errNum"><span class="el-icon-thumb transform"></span>&nbsp;序号<span>{{batchAddInfo.errNum}}</span>，数据格式不正确</div>
        
          <div v-if="batchAddInfo.sum-batchAddInfo.trueNum>0">请修改对应序号的车辆数据后再进行导入！</div>
        </center>
      </el-row>

      <el-row style="margin-top: 40px;">
        <center>
          <el-button plain type="info" @click="cancelBatchAddCar" style="width: 100px">暂不添加</el-button>
        </center>
      </el-row>

    </el-dialog>
	</div>
</template>

<script>
import { getManagerData , newAccount , batchAddCarList } from "@/api/business/businessService";
import { getUserInfo } from '@/api/users'

export default {
  name: 'CarGroupBuild',
  components: {

  },
  data () {
    return {
      batchAddInfo: null,
      accountName: '',
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
          { required: true, message: '请输入车队名称', trigger: 'blur' },
        ]
      },
      dialogRuless: {

      },
      buildManagerDialogVis: false,
      fileList: []
    }
  },
  mounted() {
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
    async getAccountName () {
      const user = await getUserInfo()
      this.accountName = user.data.accountName
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleChange () {
      if(this.$refs['dialogForm']){
        this.$refs['dialogForm'].resetFields()
      }
    },
    async save () {
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
      }
    },
    cancel () {
      this.$refs['dialogForm'].resetFields()
      this.buildManagerDialogVis = false
    },
    add () {
      this.buildManagerDialogVis = false
      this.buildForm.name = this.dialogForm.name
      this.managers = []
      this.managersCopy = []
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
