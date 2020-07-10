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
              <el-button type="text" size="small" @click="buildManager">查看新建</el-button>
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
      @close="close"
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
                <el-input v-model="dialogForm.name" class="dialogFormItem"/>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item :label="'管理员账号：'" label-width="150px" prop="accountName">
                <el-input v-model="dialogForm.accountName" class="dialogFormItem"/>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item :label="'管理员密码：'" label-width="150px" prop="passWord">
                <el-input auto-complete="new-password" v-model="dialogForm.passWord" class="dialogFormItem"/>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item>
                <el-button type="warning" @click="cancel">取消</el-button>
                <el-button type="primary" @click="add">添加</el-button>
              </el-form-item>
            </el-row>

          </el-form>
        </center>
      </el-card>
    </el-dialog>
	</div>
</template>

<script>
import { getManagerData } from "@/api/business/businessService";

export default {
  name: 'CarGroupBuild',
  components: {

  },
  data () {
    return {
      isLook: fasle,
      loading: false,
      managers: [],
      buildForm: {

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
      buildManagerDialogVis: false
    }
  },
  mounted() {

  },
  methods: {
    cancel () {
      this.$refs['dialogForm'].resetFields()
      this.buildManagerDialogVis = false
    },
    add () {
      this.$refs['dialogForm'].resetFields()
      this.buildManagerDialogVis = false
    },
    async remoteMethod(query) {
      if (query !== '') {
        let params = {
          keyWord: query
        }
        this.loading = true;
        const re = await getManagerData(params);
        this.managers = re.data
        this.loading = false;
      } else {
        this.managers = [];
      }
    },
    buildManager () {
      this.buildManagerDialogVis = true
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
    margin-bottom: 25px !important;
  }
</style>
