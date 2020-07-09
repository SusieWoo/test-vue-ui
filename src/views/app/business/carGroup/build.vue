<template>
	<div class="app-container">
    <el-card class="card-panel">
      <center>
        <el-form
          :inline="true"
          :model="buildForm"
          label-position="left"
          :rules="ruless"
        >
          <el-row>
            <el-form-item :label="'车队名称'" label-width="150px" prop="teamName" align="left">
              <el-input v-model="buildForm.teamName" class="formItem"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="'是否企业客户'" label-width="150px" align="left">
              <el-checkbox v-model="buildForm.isCompany" align="left" class="formItem">是</el-checkbox>
            </el-form-item>
          </el-row>

          <el-row v-if="buildForm.isCompany">
            <el-form-item :label="'企业名称'" label-width="150px" prop="companyName" align="left">
              <el-input v-model="buildForm.companyName" class="formItem"/>
            </el-form-item>
          </el-row>

          <el-row v-if="buildForm.isCompany">
            <el-form-item :label="'统一社会信用代码'" label-width="150px" prop="creditCode" align="left">
              <el-input v-model="buildForm.creditCode" class="formItem"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="'是否集团客户'" label-width="150px" align="left">
              <el-checkbox v-model="buildForm.isGroup" align="left" class="formItem">是</el-checkbox>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="'是否VIP'" label-width="150px" align="left">
              <el-checkbox v-model="buildForm.isVip" align="left" class="formItem">是</el-checkbox>
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
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-row>

        </el-form>
      </center>
    </el-card>
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
      loading: false,
      managers: [],
      buildForm: {
        isCompany: true,
        isGroup: false,
        isVip: false
      },
      ruless: {
        teamName: [
          { required: true, message: '请输入车队名称', trigger: 'blur' },
        ],
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
        ],
        creditCode: [
          { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
        ],
      }
    }
  },
  mounted() {

  },
  methods: {
    async remoteMethod(query) {
      if (query !== '') {
        let params = {
          keyWord: query
        }
        this.loading = true;
        const re = await getManagerData(params);
        setTimeout(() => {
          this.loading = false;
          this.managers = this.list.filter(item => {
            return item.label.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.managers = [];
      }
    }
  }
}
</script>

<style scoped>
  .formItem {
    width: 800px
  }
  .el-form-item {
    margin-bottom: 25px !important;
  }
</style>
