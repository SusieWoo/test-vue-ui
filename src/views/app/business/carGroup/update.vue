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
            <el-form>
              <el-form-item prop="teamName">
                车队名称:<span class="basicinfo">
                          <el-input
                            v-model="basicinfo.carTeamName"
                            class="formItem"
                            @input="changeCarTeamName"
                          />
                        </span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <el-row>
          <el-button
            type="primary"
            @click="save"
            :disabled="!hasChanged"
            size="small"
            style="width: 100px"
          >
            保存
          </el-button>
        </el-row>

        <el-row class="title-item">
          <el-col :span='1'>
            管理员
          </el-col>
          <el-col class="addBtn" :span='1'>
            <el-button
              type="text"
              size="small"
              @click="addAdmin"
              icon="el-icon-circle-plus"
            >
            {{'添加管理员'}}
            </el-button> 
          </el-col>
        </el-row>

        <el-row class="info-row">
          <el-cord>
            
          </el-cord>
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
            <el-table-column align="center" :label="'操作'">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="delateAdmin(scope.row)" icon="el-icon-remove-outline">{{'删除管理员'}}</el-button>
              </template>
            </el-table-column>
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
import { getAdminList , getCarList , modifyCarTeam , delCarTeamManager } from "@/api/business/businessService";

export default {
  name: 'CarGroupUpdate',
  components: {

  },
  data () {
    return {
      hasChanged: false,
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
    addAdmin () {

    },
    delateAdmin (row) {
      if (this.adminsData.length == 1) {
        this.$message({
          message: '当前车队管理员只有一个，不得删除。如需删除该管理员请先添加新的管理员',
          type: 'warning'
        });
      } else {
        this.$confirm('确定要删除该管理员吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let params = {
            teamId: this.basicinfo.carTeamid,
            id: row.managerId
          }
          const delManager = await delCarTeamManager(params)
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getAdminList()
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    },
    changeCarTeamName () {
      this.hasChanged = true
    },
    async save () {
      let params = {
        teamId: this.basicinfo.carTeamid,
        isCompany: 0,
        isGroup: 0,
        isVip: 0,
        teamName: this.basicinfo.carTeamName
      }
      const modify = await modifyCarTeam(params);
      if (modify.message == 'OK') {
        this.$message({
          message: '修改成功',
          type: 'success'
        });
      } else {
        this.$message({
          message: '修改失败',
          type: 'error'
        });
      }
      this.hasChanged = false
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
  .addBtn {
    display: inline-block;
    padding-left: 10px;
  }
</style>
