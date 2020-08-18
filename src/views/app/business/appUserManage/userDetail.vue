<template>
	<div class="app-container">
    <el-card>

      <el-row class="title-item">
        {{$t('userDetail.userInfo')}}
      </el-row>

      <el-row class="info-row">
        <el-col :span="11" :offset="2">
          {{$t('userDetail.phone')}}<span class="basicinfo">{{basicinfo.phone}}</span>
        </el-col>
        <el-col :span="11">
          {{$t('userDetail.userName')}}<span class="basicinfo">{{basicinfo.accountName}}</span>
        </el-col>
      </el-row>

      <el-row class="info-row">
        <el-col :span="11" :offset="2">
          {{$t('userDetail.userID')}}<span class="basicinfo">{{basicinfo.ucId}}</span>
        </el-col>
        <el-col :span="11">
          {{$t('userDetail.account')}}<span class="basicinfo">{{basicinfo.account}}</span>
        </el-col>
      </el-row>

      <el-row class="info-row">
        <el-col :span="11" :offset="2">
          {{$t('userDetail.licenseType')}}<span class="basicinfo">{{basicinfo.license}}</span>
        </el-col>
        <el-col :span="11">
          {{$t('userDetail.createTime')}}<span class="basicinfo">{{basicinfo.createDate}}</span>
        </el-col>
      </el-row>

      <el-row class="info-row">
        <el-col :span="11" :offset="2">
          {{$t('userDetail.trueName')}}<span class="basicinfo">{{basicinfo.userName}}</span>
        </el-col>
        <el-col :span="11">
          {{$t('userDetail.creater')}}<span class="basicinfo">{{basicinfo.createName}}</span>
        </el-col>
      </el-row>

      <el-row class="info-row">
        <el-col :span="11" :offset="2">
          {{$t('userDetail.idNo')}}<span class="basicinfo">{{basicinfo.identityCard}}</span>
        </el-col>
        <el-col :span="11">
          {{$t('userDetail.createSource')}}<span class="basicinfo">{{basicinfo.registered}}</span>
        </el-col>
      </el-row>

      <el-row class="info-row">
        <el-col :span="11" :offset="2">
          {{$t('userDetail.registeredSource')}}<span class="basicinfo">{{basicinfo.registerOrigin}}</span>
        </el-col>
        <el-col :span="11">
          {{$t('userDetail.refereeAccount')}}<span class="basicinfo">{{basicinfo.recommendPerson}}</span>
        </el-col>
      </el-row>

      <el-row class="info-row">
        <el-col :span="11" :offset="2">
          {{$t('userDetail.refereePhone')}}<span class="basicinfo">{{basicinfo.recommendPhone}}</span>
        </el-col>
        <el-col :span="11">
          {{$t('userDetail.refereeSource')}}<span class="basicinfo">{{basicinfo.recommendOrigin}}</span>
        </el-col>
      </el-row>

      <el-row class="info-row">
        <el-col :span="11" :offset="2">
          {{$t('userDetail.firstLogonTime')}}<span class="basicinfo">{{basicinfo.firstLoginDate}}</span>
        </el-col>
      </el-row>

      <el-row class="title-item">
        <el-col :span='1.5'>
          {{$t('userDetail.bindCars')}}
        </el-col>
        <el-col class="addBtn" :span='1'>
          <el-button
            plain
            type="primary"
            size="small"
            @click="unbind"
          >
          {{$t('userDetail.unbind')}}
          </el-button> 
        </el-col>
      </el-row>

      <el-row class="info-row">
        <el-table
          class='t-table'
          stripe
          :data="carsData"
          style="width: 100%; text-align: center;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="carRole" align="center" :label="$t('userDetail.identity')">
            <template slot-scope="scope">
              {{showCarRoleLabel(scope.row.carRole)}}
            </template>
          </el-table-column>
          <el-table-column prop="vin" align="center" :label="'VIN'">
            <template slot-scope="scope">
              <el-button type="text" @click="goToEdit(scope.row.carId, 'detail')" size="small">{{scope.row.vin}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="carSerise" align="center" :label="$t('userDetail.carSeries')"></el-table-column>
          <el-table-column prop="carModel" align="center" :label="$t('userDetail.carModel')"></el-table-column>
          <el-table-column prop="dischargeName" align="center" :label="$t('userDetail.discharge')"></el-table-column>
          <el-table-column prop="carNumber" align="center" :label="$t('userDetail.carNo')"></el-table-column>
          <el-table-column prop="invoiceNo" align="center" :label="$t('userDetail.invoiceNumber')"></el-table-column>
          <el-table-column prop="invoicePhoto" align="center" :label="$t('userDetail.photo')">
            <template slot-scope="scope">
              <img :src="scope.row.invoicePhoto" :alt="$t('userDetail.photo')" style="width:150px;">
            </template>
          </el-table-column>
          <el-table-column prop="salesDate" align="center" :label="$t('userDetail.STD')"></el-table-column>
          <el-table-column prop="mbSalesDate" align="center" :label="$t('userDetail.AAK')"></el-table-column>
          <el-table-column prop="driveing" align="center" :label="$t('userDetail.whetherDriving')">
            <template slot-scope="scope">
              {{scope.row.driveing*1>0?$t('userDetail.yes'):$t('userDetail.no')}}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="query.page_number"
          :limit.sync="query.page_size"
          @pagination="getCarList"
        />
      </el-row>

      <el-row class="title-item">
        {{$t('userDetail.bindCarTeams')}}
      </el-row>

      <el-row class="info-row">
        <el-table
          class='t-table'
          stripe
          :data="teamsData"
          style="width: 100%; text-align: center;"
        >
          <el-table-column prop="carRole" align="center" :label="$t('userDetail.identity')">
            <template slot-scope="scope">
              {{showCarRoleLabel(scope.row.carRole)}}
            </template>
          </el-table-column>
          <el-table-column prop="teamName" align="center" :label="$t('userDetail.carTeamName')">
            <template slot-scope="scope">
              <el-button type="text" @click="goToGroup(scope.row)" size="small">{{scope.row.teamName}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="teamCarNum" align="center" :label="$t('userDetail.carNum')"></el-table-column>
          <el-table-column prop="teamDriverNum" align="center" :label="$t('userDetail.driverNum')"></el-table-column>
        </el-table>
      </el-row>

    </el-card>
	</div>
</template>

<script>
import { 
  userBaseInfo ,
  userInfoCar ,
  userInfoCarTeam
} from "@/api/business/businessService";
import pagination from '@/components/pagination';

export default {
  name: 'UserDetail',
  components: {
    pagination
  },
  data () {
    return {
      query: {
        page_number: 1,
        page_size: 20
      },
      total: 0,
      basicinfo: {
        account: null,
        accountName: null,
        carOwner: null,
        createDate: null,
        createName: null,
        firstLoginDate: null,
        id: null,
        identityCard: null,
        lastLogonTime: null,
        license: null,
        phone: null,
        recommendOrigin: null,
        recommendPerson: null,
        recommendPhone: null,
        registerOrigin: null,
        registered: null,
        role: null,
        ucId: null,
        userName: null
      },
      carsData: [],
      teamsData: []
    }
  },
  activated() {
    this.getUserBaseInfo()
  },
  mounted() {
    this.getUserBaseInfo()
  },
  methods: {
    goToGroup (row) {
      let params = {
        carTeamid: row.teamId ,
        carTeamName: row.teamName ,
        carTeamLevel: row.carTeamLevel
      }
      this.$router.push({
        path: '/business/carGroupDetail',
        query: {
          basicinfo : params
        }  
      })
    },
    goToEdit(id, type){
      this.$router.push(`/basicInfo/carManage/${id}/${type}`)
    },
    handleSelectionChange(val) {
      console.log(val)
    },
    showCarRoleLabel (row) {
      let arr = row.split(',')
      let arr2 = []
      arr.forEach((item , index) => {
        if (item == '0') {
          arr2[index] = this.$t('userDetail.manager')
        } else if (item == '1') {
          arr2[index] = this.$t('userDetail.manager')
        } else if (item == '2') {
          arr2[index] = this.$t('userDetail.driver')
        } else if (item == '3') {
          arr2[index] = this.$t('userDetail.owner')
        }
      })
      return arr2.join()
    },
    async getCarList () {
      let params = {
        id: this.basicinfo.id,
        page_number: this.query.page_number,
        page_size: this.query.page_size
      }
      const cars = await userInfoCar(params);
      this.carsData = cars.data.list
      this.total = cars.data.total
    },
    async getTeamList () {
      let params = {
        id: this.basicinfo.id
      }
      const re = await userInfoCarTeam(params);
      this.teamsData = re.data.list
    },
    unbind () {

    },
    async getUserBaseInfo () {
      let re = await userBaseInfo({phone:  this.$route.query.basicinfo.phone})
      this.basicinfo = re.data
      this.basicinfo.createName = this.basicinfo.registered!=3?'system':this.basicinfo.createName
      this.basicinfo.registered = this.basicinfo.registered==1?this.$t('userDetail.driverApp'):this.basicinfo.registered==2?this.$t('userDetail.ownerApp'):this.basicinfo.registered==3?'Tboss':this.basicinfo.registered==4?this.$t('userDetail.teamWeb'):''
      this.basicinfo.license = this.basicinfo.license==1?'A1':this.basicinfo.license==2?'A2':this.basicinfo.license==3?'B1':this.basicinfo.license==4?'B2':this.basicinfo.license==5?'C1':this.basicinfo.license==6?'C2':'C3'
      this.getCarList()
      this.getTeamList()
    }
  }
}
</script>

<style scoped>
  .addBtn {
    display: inline-block;
    padding-left: 10px;
  }
</style>
