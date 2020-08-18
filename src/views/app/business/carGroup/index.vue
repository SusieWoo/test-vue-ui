<template>
	<div class="app-container">
    <el-card class="card-panel">
      <el-form :inline="true" :model="query" label-position="left">
        <el-form-item :label="$t('carGroup.groupName')+'：'" label-width="120px">
          <el-input v-model="query.keyWord" :placeholder="$t('carGroup.groupNamePlaceholder')" style="width: 220px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList" style="width: 100px">{{$t('common.search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="build" style="width: 100px">{{$t('carGroup.build')}}</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="setVip">{{$t('carGroup.setVip')}}</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="handleDownExcel" style="width: 100px">{{$t('carGroup.export')}}</el-button>
        </el-form-item>
        <com-search>
          <template>
            <span slot="item">
              <!-- <el-form-item :label="$t('carGroup.isCompany')+'：'" label-width="120px">
                <el-select v-model="query.isCompany" :placeholder="$t('carGroup.all')" clearable>
                  <el-option :label="$t('carGroup.yes')" :value="1"></el-option>
                  <el-option :label="$t('carGroup.no')" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('carGroup.isGroup')+'：'" label-width="120px">
                <el-select v-model="query.isGroup" :placeholder="$t('carGroup.all')" clearable>
                  <el-option :label="$t('carGroup.yes')" :value="1"></el-option>
                  <el-option :label="$t('carGroup.no')" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('carGroup.isVip')+'：'" label-width="120px">
                <el-select v-model="query.isVip" :placeholder="$t('carGroup.all')" clearable>
                  <el-option :label="$t('carGroup.yes')" :value="1"></el-option>
                  <el-option :label="$t('carGroup.no')" :value="0"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item :label="$t('carGroup.createType')+'：'" label-width="120px">
                <el-select
                  v-model="query.createType"
                  :placeholder="$t('carGroup.all')"
                  clearable
                  size="samll"
                >
                  <el-option :label="$t('carGroup.yes')" :value="1"></el-option>
                  <el-option :label="$t('carGroup.no')" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('carGroup.createStartTime')+'：'" label-width="90px">
                <el-date-picker
                  v-model="query.createStartTime"
                  type="date"
                  :placeholder="$t('carGroup.startTimePlaceholder')"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptionsStart"
                  size="samll"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('carGroup.to')">
                <el-date-picker
                  v-model="query.createEndTime"
                  type="date"
                  :placeholder="$t('carGroup.endTimePlaceholder')"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptionsEnd"
                  size="samll"
                >
                </el-date-picker>
              </el-form-item>
            </span>
          </template>
        </com-search>
      </el-form>
    </el-card>

    <el-table
      class='t-table'
      stripe :data="tableData"
      style="width: 100%; text-align: center;"
      @sort-change="handleSortChange"
    >
      <!-- <el-table-column type="selection" width="50" align="center"></el-table-column> -->
      <el-table-column prop="carTeamid" align="center" :label="$t('carGroup.id')"></el-table-column>
      <el-table-column prop="carTeamName" align="center" :label="$t('carGroup.groupName')"></el-table-column>
      <!-- <el-table-column align="center" :label="$t('carGroup.isCompany')">
        <template slot-scope="scope" align="center">
          <span>{{scope.row.isCompany=='0'?$t('common.no'):scope.row.isCompany=='1'?$t('carGroup.yes'):''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('carGroup.isGroup')">
        <template slot-scope="scope" align="center">
          <span>{{scope.row.isGroup=='0'?$t('common.no'):scope.row.isGroup=='1'?$t('carGroup.yes'):''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('carGroup.isVip')">
        <template slot-scope="scope" align="center">
          <span>{{scope.row.isVip=='0'?$t('common.no'):scope.row.isVip=='1'?$t('carGroup.yes'):''}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="createUser" align="center" :label="$t('carGroup.creater')"></el-table-column>
      <el-table-column prop="createTime" align="center" :label="$t('carGroup.createStartTime')" sortable="custom"></el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('carGroup.operation')" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="look(scope.row)">{{$t('carGroup.look')}}</el-button>
          <el-button type="text" size="small" @click="edit(scope.row)">{{$t('carGroup.edit')}}</el-button>
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
import { carTeamList , carTeamListExcel } from "@/api/business/businessService";
import Export from '@/components/Export'

export default {
    name: 'CarGroup',
    components: {
      comSearch,
      pagination,
      Export
    },
    data () {
      return {
        iframeFilter: {},
        //idList: [],
        total: 0,
        pickerOptionsStart: {
          disabledDate: time => {
            let endDateVal = this.query.createEndTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
        },
        pickerOptionsEnd: {
          disabledDate: time => {
            let beginDateVal = this.query.createStartTime
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            }
          }
        },
        value6: '',
        query: {
          page_number: 1,
          page_size: 10,
          sortType: 0,
          createStartTime: null,
          createEndTime: null
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
      // async setVip () {
      //   let params = {
      //     id : this.idList.join(),
      //     type: 0,
      //     isVip: 1
      //   }
      //   const re = await modifyCarTeamVip(params)
      // },
      async emailExcel (email) {
        await carTeamListExcel(Object.assign({ email: email }, this.query))
        this.$message.success('后台正在导出，稍后请查收邮件');
      },
      handleDownExcel () {
        this.iframeFilter = {
          data: {
            isEmail: true
          }
        }
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
          path: '/business/carGroupDetail',
          query: {
            basicinfo : row
          }  
        })
      },
      async getList() {
        let params = {}
        for(let key in this.query){
          if(this.query[key] || (this.query[key]==0)){
            params[key] = this.query[key]
          }
        }
        const re = await carTeamList(params);
        this.tableData = re.data.list
        this.total = re.data.total
      },
      // handleSelectionChange (val) {
      //   this.idList = []
      //   val.forEach(item => {
      //     this.idList.push(item.carTeamid)
      //   })
      // },
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
