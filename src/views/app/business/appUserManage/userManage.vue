<template>
	<div class="app-container">
    <el-card class="card-panel">
      <el-form :inline="true" :model="query" label-position="left">
        <el-row>
          <el-col :span="24" :offset="1">
            <!-- <el-form-item :label="'车辆归属'" label-width="120px">
              <el-select v-model="query.userIdentityFlag" :placeholder="'全部'" clearable>
                <el-option :label="'青汽'" :value="1"></el-option>
                <el-option :label="'无'" :value="3"></el-option>
                <el-option :label="'一汽+青汽'" :value="4"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item :label="$t('userManage.userID')" label-width="120px">
              <el-input v-model="query.registerUcId" :placeholder="$t('userManage.userIDPlaceHolder')" style="width: 220px"/>
            </el-form-item>
            <el-form-item :label="$t('userManage.userName')" label-width="120px">
              <el-input v-model="query.account" :placeholder="$t('userManage.userNamePlaceHolder')" style="width: 220px"/>
            </el-form-item>
            <el-form-item :label="$t('userManage.chassisNumber')" label-width="120px">
              <el-input v-model="query.keyWord" :placeholder="$t('userManage.chassisNumberPlaceHolder')" style="width: 220px"/>
            </el-form-item>
            <el-form-item :label="$t('userManage.tel')" label-width="120px">
              <el-input v-model="query.phone" :placeholder="$t('userManage.telPlaceHolder')" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <center>
              <el-form-item>
                <el-button style="width: 130px;" type="primary" icon="el-icon-search" @click="getList('search')">{{$t('userManage.search')}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button style="width: 130px;" type="primary" @click="bindCar">{{$t('userManage.bindCar')}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button style="width: 130px;" type="primary" @click="buildManage">{{$t('userManage.newManager')}}</el-button>
              </el-form-item>
              <el-form-item>
                <el-button style="width: 130px;" type="primary" @click="handleDownExcel">{{$t('userManage.batchExport')}}</el-button>
              </el-form-item>
              <com-search>
                <template>
                  <span slot="item">
                    <el-row>
                      <el-col :span='9'>
                        <el-form-item :label="$t('userManage.registrationTime')" label-width="70px">
                          <el-date-picker
                            style="width: 145px"
                            v-model="query.registerDateStart"
                            type="date"
                            :placeholder="$t('userManage.selectDate')"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptionsStart"
                          >
                          </el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('userManage.to')">
                          <el-date-picker
                            style="width: 145px"
                            v-model="query.registerDateEnd"
                            type="date"
                            :placeholder="$t('userManage.selectDate')"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptionsEnd"
                          >
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span='9'>
                        <el-form-item :label="$t('userManage.lastLoginTime')" label-width="100px">
                          <el-date-picker
                            style="width: 135px"
                            v-model="query.lastLogonTimeStart"
                            type="datetime"
                            :placeholder="$t('userManage.selectDate')"
                            value-format="yyyy-MM-dd HH:mm"
                            :picker-options="pickerOptionsStartCopy"
                          >
                          </el-date-picker>
                        </el-form-item>
                        <el-form-item :label="$t('userManage.to')">
                          <el-date-picker
                            style="width: 135px"
                            v-model="query.lastLogonTimeEnd"
                            type="datetime"
                            :placeholder="$t('userManage.selectDate')"
                            value-format="yyyy-MM-dd HH:mm"
                            :picker-options="pickerOptionsEndCopy"
                          >
                          </el-date-picker>
                        </el-form-item>
                      </el-col>
                      <el-col :span='6'>
                        <el-form-item :label="$t('userManage.createSource')" label-width="70px">
                          <el-select v-model="query.registeredSources" :placeholder="$t('userManage.all')" clearable style="width: 145px">
                            <el-option :label="$t('userManage.carTeamApp')" :value="2"></el-option>
                            <el-option :label="$t('userManage.carTeamWeb')" :value="4"></el-option>
                            <el-option :label="'tboss'" :value="3"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span='24' :offset="1">
                        <car-linkage
                          :model.sync="query.carModel"
                          :vehicle.sync="query.carSeries"
                          :discharge.sync="query.dischargeId"
                        />
                      </el-col>
                    </el-row>
                  </span>
                </template>
              </com-search>
            </center>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-table
      class='t-table'
      stripe :data="tableData"
      style="width: 100%; text-align: center;"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="50" align="center"></el-table-column>
      <el-table-column prop="ucId" align="center" :label="$t('userManage.userID')"></el-table-column>
      <el-table-column prop="phone" align="center" :label="$t('userManage.phone')"></el-table-column>
      <el-table-column prop="account" :label="$t('userManage.account')" align="center"></el-table-column>
      <el-table-column prop="accountName" :label="$t('userManage.accountName')" align="center"></el-table-column>
      <el-table-column align="center" :label="$t('userManage.createSource')">
        <template slot-scope="scope">
          {{showRegisteredLabel(scope.row.registered)}}
        </template>
      </el-table-column>
      <el-table-column prop="createName" align="center" :label="$t('userManage.creater')">
        <template slot-scope="scope">
          {{scope.row.registered!==3?'system':scope.row.createName}}
        </template>
      </el-table-column>
      <el-table-column prop="createDate" align="center" :label="$t('userManage.createTime')" sortable="custom"></el-table-column>
      <el-table-column prop="lastLogonTime" align="center" :label="$t('userManage.lastLoginTime')"></el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('userManage.operate')" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="look(scope.row)">{{$t('userManage.look')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="query.page_number"
      :limit.sync="query.page_size"
      @pagination="getList"
    />
    <Export
      :iframe-filter="iframeFilter"
      @exportMethod="emailExcel"
    />
	</div>
</template>

<script>
import comSearch from "@/components/comSearch";
import pagination from '@/components/pagination'; 
import { userListNew , userListExcelNew } from "@/api/business/businessService";
import carLinkage from "@/components/carLinkage/carLinkage";
import Export from '@/components/Export'

export default {
    name: 'UserManage',
    components: {
      comSearch,
      pagination,
      carLinkage,
      Export
    },
    data () {
      return {
        iframeFilter: {},
        total: 0,
        pickerOptionsStart: {
          disabledDate: time => {
            let endDateVal = this.query.registerDateEnd
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
        },
        pickerOptionsEnd: {
          disabledDate: time => {
            let beginDateVal = this.query.registerDateStart
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            }
          }
        },
        pickerOptionsStartCopy: {
          disabledDate: time => {
            let endDateVal = this.query.lastLogonTimeEnd
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
        },
        pickerOptionsEndCopy: {
          disabledDate: time => {
            let beginDateVal = this.query.lastLogonTimeStart
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            }
          }
        },
        value6: '',
        query: {
          page_number: 1,
          page_size: 10,
          sort: "createDate",
          sortType: '0'
        },
        tableData: []
      }
    },
    activated () {
      this.getList()
    },
    mounted () {
      this.getList()
    },
    methods: {
      async emailExcel (email) {
        await userListExcelNew(Object.assign({ email: email }, this.query))
        this.$message.success(this.$t('userManage.exporting'));
      },
      handleDownExcel () {
        this.iframeFilter = {
          data: {
            isEmail: true
          }
        }
      },
      showRegisteredLabel (row) {
        switch (row) {
          case 2:
            return this.$t('userManage.carTeamApp') 
          case 4:
            return this.$t('userManage.carTeamWeb') 
          case 3: 
            return 'Tboss' 
        }
      },
      bindCar () {

      },
      buildManage () {
        this.$router.push('/business/buildManager')
      },
      batchExport () {

      },
      edit (row) {
        this.$router.push({
          path: '/business/carGroupUpdate',
          query: {
            basicinfo : row,
            isEdit: true
          }  
        })
      },
      look (row) {
        this.$router.push({
          path: '/business/userDetail',
          query: {
            basicinfo : row
          }  
        })
      },
      async getList(flag) {
        if(flag==='search'){
          this.query.page_number = 1
        }
        const re = await userListNew(this.query);
        this.tableData = re.data.list
        this.total = re.data.total
      },
      handleSelectionChange () {

      },
      build () {
        this.$router.push('/business/carGroupBuild')
      },
      handleSortChange (column) {
        if(column.order == 'descending'){
          this.query.sortType = 0
        }else{
          this.query.sortType = 1
        }
        this.getList()
      }
    }
}
</script>
