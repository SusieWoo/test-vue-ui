<template>
	<div class="app-container">
    <el-card class="card-panel">
      <el-form :inline="true" :model="query" label-position="left">
        <el-row>
          <el-col :span="12" :offset="1">
            <el-form-item :label="$t('carGroup.groupName')+'：'" label-width="120px">
              <el-input v-model="query.keyWord" :placeholder="$t('carGroup.groupNamePlaceholder')" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getList">{{$t('common.search')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="build">{{$t('carGroup.build')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="">{{$t('carGroup.setVip')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="">{{$t('carGroup.export')}}</el-button>
            </el-form-item>
          </el-col>
          <com-search>
            <template>
              <span slot="item">
                <el-form-item :label="$t('carGroup.isCompany')+'：'" label-width="120px">
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
                </el-form-item>
                <el-form-item :label="$t('carGroup.createType')+'：'" label-width="120px">
                  <el-select v-model="query.createType" :placeholder="$t('carGroup.all')" clearable>
                    <el-option :label="$t('carGroup.yes')" :value="1"></el-option>
                    <el-option :label="$t('carGroup.no')" :value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('carGroup.createStartTime')+'：'" label-width="120px">
                  <el-date-picker
                    style="width: 100%"
                    v-model="query.createStartTime"
                    type="date"
                    :placeholder="$t('carGroup.startTimePlaceholder')"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsStart"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('carGroup.to')">
                  <el-date-picker
                    style="width: 100%"
                    v-model="query.createEndTime"
                    type="date"
                    :placeholder="$t('carGroup.endTimePlaceholder')"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsEnd"
                  >
                  </el-date-picker>
                </el-form-item>
              </span>
            </template>
          </com-search>
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
      <el-table-column prop="carTeamid" align="center" :label="$t('carGroup.id')"></el-table-column>
      <el-table-column prop="carTeamName" align="center" :label="$t('carGroup.groupName')"></el-table-column>
      <el-table-column align="center" :label="$t('carGroup.isCompany')">
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
      </el-table-column>
      <el-table-column prop="createUser" align="center" :label="$t('carGroup.creater')"></el-table-column>
      <el-table-column prop="createTime" align="center" :label="$t('carGroup.createStartTime')" sortable="custom"></el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('carGroup.operation')" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="look(scope.row)">{{$t('carGroup.look')}}</el-button>
          <el-button type="text" size="small">{{$t('carGroup.edit')}}</el-button>
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
	</div>
</template>

<script>
import comSearch from "@/components/comSearch";
import pagination from '@/components/pagination'; 
import { carTeamList } from "@/api/business/businessService";

export default {
    name: 'CarGroup',
    components: {
      comSearch,
      pagination 
    },
    data () {
      return {
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
    mounted () {
      this.getList()
    },
    methods: {
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
