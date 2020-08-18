<template>
	<div class="app-container">
    <el-card>
      <center>
        <el-row class="title-item">
          {{$t('carGroupDetail.carTeamInfo')}}
        </el-row>

        <el-row class="info-row">
          <el-col :span="12">
            {{$t('carGroupDetail.carTeamID')}}<span class="basicinfo">{{basicinfo.carTeamid}}</span>
          </el-col>
          <el-col :span="12">
            {{$t('carGroupDetail.carTeamName')}}<span class="basicinfo">{{basicinfo.carTeamName}}</span>
          </el-col>
        </el-row>

        <el-row class="title-item">
          {{$t('carGroupDetail.manager')}} 
        </el-row>

        <el-row class="info-row">
          <el-table
            class='t-table'
            stripe :data="adminsData"
            style="width: 100%; text-align: center;"
          >
            <el-table-column prop="name" align="center" :label="$t('carGroupDetail.managerName')"></el-table-column>
            <el-table-column prop="accountName" align="center" :label="$t('carGroupDetail.managerAccount')"></el-table-column>
            <el-table-column prop="carTeamAccountPhone" align="center" :label="$t('carGroupDetail.managerPhone')"></el-table-column>
          </el-table>
        </el-row>

        <el-row class="title-item">
          {{$t('carGroupDetail.Cars')}} 
        </el-row>

        <el-collapse v-model="activeNames" @change="handleCollapseChange">
          <el-collapse-item name="1">
            <template slot="title">
              <el-tag type="success">{{basicinfo.carTeamName}}</el-tag>
            </template>
            <el-row class="info-row">
              <el-table
                class='t-table'
                stripe
                :data="carsData"
                style="width: 100%; text-align: center;"
              >
                <el-table-column prop="carVin" align="center" :label="'VIN'">
                  <template slot-scope="scope">
                    <el-button type="text" @click="goToEdit(scope.row.carId, 'detail')" size="small">{{scope.row.carVin}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="carSerise" align="center" :label="$t('carGroupDetail.series')"></el-table-column>
                <el-table-column prop="carModel" align="center" :label="$t('carGroupDetail.model')"></el-table-column>
                <el-table-column prop="dischargeName" align="center" :label="$t('carGroupDetail.discharge')"></el-table-column>
                <el-table-column prop="carNumber" align="center" :label="$t('carGroupDetail.licenseNo')"></el-table-column>
                <el-table-column prop="salesDate" align="center" :label="$t('carGroupDetail.STD')"></el-table-column>
                <el-table-column prop="mbSalesDate" align="center" :label="$t('carGroupDetail.AAK')"></el-table-column>
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
    goToEdit(id, type){
      this.$router.push(`/basicInfo/carManage/${id}/${type}`)
    },
    handleCollapseChange () {

    },
    async getAdminList () {
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
