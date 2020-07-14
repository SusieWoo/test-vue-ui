<template>
	<div class="app-container">
    <el-card>
      <center>
        <el-form
          :inline="true"
          :model="buildForm"
          label-position="left"
          :rules="ruless"
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
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary" style="width: 100px">选取文件</el-button>
        <br/>
        <div slot="tip" class="el-upload__tip el-icon-info">每次批量导入最多支持1000条数据</div>
      </el-upload>
      
      <el-row style="margin: 50px 0">
        <el-button size="small" type="success" @click="submitUpload" style="width: 100px">EXCEL导入</el-button>
        <el-link href="http://sy.aerozhonghuan.com:81/test/yiqi/web/qdfaw/tboss/assets/import/addCarList.xlsx" target="_blank">
          <el-button size="small" type="info" style="width: 100px">模板下载</el-button>
        </el-link>
      </el-row>
    </el-dialog>
	</div>
</template>

<script>
import { getManagerData , newAccount } from "@/api/business/businessService";
import { getUserInfo } from '@/api/users'

export default {
  name: 'CarGroupBuild',
  components: {

  },
  data () {
    return {
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

  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
      const user = await getUserInfo()
      param.tbossName = user.data.accountName
      // param.tbossName = 'guowang'
      param.isCompany = 0
      param.isGroup = 0
      param.isVip = 0
      if(this.managers.length){
        let fil = this.managersCopy.filter(item => {
          return item.name === this.buildForm.name
        })
        param.managerId = fil[0].id
      }
      if (this.dialogForm.accountName) param.accountName = this.dialogForm.accountName
      if (this.dialogForm.passWord) param.passWord = this.dialogForm.passWord
      const re = await newAccount(param);
      if(re.message == 'OK'){
        this.batchAddCarVis = true
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
</style>
