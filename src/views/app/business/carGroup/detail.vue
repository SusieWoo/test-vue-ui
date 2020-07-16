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

        <el-row class="title-item">
          关联车辆 
        </el-row>

        <el-collapse v-model="activeNames" @change="handleCollapseChange">
          <el-collapse-item name="1">
            <template slot="title">
              <el-tag type="success">{{basicinfo.carTeamName}}</el-tag>
            </template
            <el-row class="info-row">
              <el-table
                class='t-table'
                stripe
                :data="carsData"
                style="width: 100%; text-align: center;"
              >
                <el-table-column prop="carVin" align="center" :label="'VIN'"></el-table-column>
                <el-table-column prop="carSerise" align="center" :label="'车系'"></el-table-column>
                <el-table-column prop="carModel" align="center" :label="'车型'"></el-table-column>
                <el-table-column prop="dischargeName" align="center" :label="'排放'"></el-table-column>
                <el-table-column prop="carNumber" align="center" :label="'车牌号'"></el-table-column>
                <el-table-column prop="salesDate" align="center" :label="'STD时间'"></el-table-column>
                <el-table-column prop="mbSalesDate" align="center" :label="'AAK时间'"></el-table-column>
              </el-table>
            </el-row>
          </el-collapse-item>
        </el-collapse>

      </center>
    </el-card>
	</div>
</template>

<script>
import { getAdminList , getCarList } from "@/api/business/businessService";

export default {
  name: 'CarGroupDetail',
  components: {

  },
  data () {
    return {
      activeNames: ['1'],
      basicinfo: {
        carTeamId: ''
      },
      adminsData: [],
      carsData: []
    }
  },
  activated() {
    this.basicinfo = this.$route.query.basicinfo
    this.getAdminList()
    this.getCarList()
  },
  methods: {
    handleCollapseChange () {

    },
    async getAdminList () {
      console.log(this.basicinfo)
      let params = {
        carTeamId: this.basicinfo.carTeamid
      }
      const admins = await getAdminList(params);
      this.adminsData = admins.data
    },
    async getCarList () {
      let params = {
        carTeamId: this.basicinfo.carTeamid,
        carTeamLevel: this.basicinfo.carTeamLevel,
        carTeamType: '0'
      }
      const cars = await getCarList(params);
      this.carsData = cars.data
    }
  }
}
</script>

<style scoped>

</style>
