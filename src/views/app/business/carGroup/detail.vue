<template>
	<div class="app-container">
    <el-card>
      <center>
        <el-row class="title-item">
          车队信息
        </el-row>

        <el-row class="info-row">
          <el-col :span="12">
              车队ID:<span class="basicinfo">{{basicinfo.carTeamid}}</span>
          </el-col>
          <el-col :span="12">
            车队名称:<span class="basicinfo">{{basicinfo.carTeamName}}</span>
          </el-col>
        </el-row>

        <el-row class="title-item">
          管理员 
        </el-row>

        <el-row class="info-row">
          <el-table
            class='t-table'
            stripe :data="adminsData"
            style="width: 100%; text-align: center;"
          >
            <el-table-column prop="name" align="center" :label="'管理员名称'"></el-table-column>
            <el-table-column prop="accountName" align="center" :label="'管理员账户'"></el-table-column>
            <el-table-column prop="carTeamAccountPhone" align="center" :label="'管理员手机号码'"></el-table-column>
          </el-table>
        </el-row>
      </center>
    </el-card>
	</div>
</template>

<script>
import { getAdminList } from "@/api/business/businessService";

export default {
  name: 'CarGroupDetail',
  components: {

  },
  data () {
    return {
      basicinfo: {
        carTeamId: ''
      },
      adminsData: []
    }
  },
  activated() {
    this.basicinfo = this.$route.query.basicinfo
    this.getAdminList()
  },
  methods: {
    async getAdminList () {
      console.log(this.basicinfo)
      let params = {
        carTeamId: this.basicinfo.carTeamid
      }
      const admins = await getAdminList(params);
      this.adminsData = admins.data
    }
  }
}
</script>

<style scoped>

</style>
