<template>
	<div class="app-container">
    <el-card class="card-panel">
      <el-form :inline="true" :model="query" label-position="left">
        <el-row>
          <el-col :span="16" :offset="1">
            <el-form-item label="车队名称：" label-width="120px">
              <el-input v-model="query.keyWord" placeholder="请输入车队名称" style="width: 220px"/>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getList">{{$t('common.search')}}</el-button>
            </el-form-item>
          </el-col>
          <com-search>
            <template>
              <span slot="item">
                <el-form-item label="是否企业：" label-width="120px">
                  <el-select v-model="query.isCompany" placeholder="全部">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="不是" :value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否集团客户：" label-width="120px">
                  <el-select v-model="query.isGroup" placeholder="全部">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="不是" :value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否VIP：" label-width="120px">
                  <el-select v-model="query.isVip" placeholder="全部">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="不是" :value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否tboss创建：" label-width="120px">
                  <el-select v-model="query.createType" placeholder="全部">
                    <el-option label="是" :value="1"></el-option>
                    <el-option label="不是" :value="0"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="创建时间：" label-width="120px">
                  <el-date-picker
                    style="width: 100%"
                    v-model="query.createStartTime"
                    type="date"
                    placeholder="选择合同开始日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsStart"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="至">
                  <el-date-picker
                    style="width: 100%"
                    v-model="query.createEndTime"
                    type="date"
                    placeholder="选择合同结束日期"
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
    >
      <el-table-column type="selection" width="50" align="center" label="当前页"></el-table-column>
      <el-table-column prop="carTeamid" align="center" label="车队ID"></el-table-column>
      <el-table-column prop="carTeamName" align="center" label="车队名称"></el-table-column>
      <el-table-column align="center" label="是否企业">
        <template slot-scope="scope" align="center">
          <span>{{scope.row.isCompany=='0'?'否':scope.row.isCompany=='1'?'是':''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否集团客户">
        <template slot-scope="scope" align="center">
          <span>{{scope.row.isGroup=='0'?'否':scope.row.isGroup=='1'?'是':''}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否VIP">
        <template slot-scope="scope" align="center">
          <span>{{scope.row.isVip=='0'?'否':scope.row.isVip=='1'?'是':''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" align="center" label="创建人"></el-table-column>
      <el-table-column prop="createTime" align="center" label="创建时间"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="120">
        <template>
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
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
    mounted() {
      this.getList()
    },
    methods: {
      async getList() {
        const re = await carTeamList(this.query);
        this.tableData = re.data.list
        this.total = re.data.total
      },
      handleSelectionChange () {

      }
    }
}
</script>
