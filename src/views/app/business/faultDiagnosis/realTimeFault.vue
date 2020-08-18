<template>
	<div class="app-container">
    <el-card class="card-panel">
      <el-form :inline="true" :model="query" label-position="left">
        <el-row>
          <el-col :span="14">
            <el-form-item :label="$t('realTimeFault.carNo')" label-width="80px">
              <el-input v-model="query.carNumber" style="width: 120px"/>
            </el-form-item>
            <el-form-item :label="'VIN:'" label-width="80px">
              <el-input v-model="query.vin" style="width: 120px"/>
            </el-form-item>
            <el-form-item :label="$t('realTimeFault.faultGroup')" label-width="80px">
              <el-input v-model="query.faultGroup" style="width: 120px"/>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('realTimeFault.faultLevel')" label-width="80px">
              <el-select
                v-model="query.faultLevel"
                style="width: 120px"
                :placeholder="$t('realTimeFault.all')"
                clearable
              >
                <el-option value="S" :label="$t('realTimeFault.sFault')"></el-option>
                <el-option value="C" :label="$t('realTimeFault.cFault')"></el-option>
                <el-option value="D" :label="$t('realTimeFault.dFault')"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('realTimeFault.interventionType')" label-width="80px">
              <el-select
                v-model="query.interventionType"
                style="width: 120px"
                :placeholder="$t('realTimeFault.all')"
                clearable
              >
                <el-option :value="$t('realTimeFault.serviceIntervention')" :label="$t('realTimeFault.serviceIntervention')"></el-option>
                <el-option value="" :label="$t('realTimeFault.void')"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <center>
            <el-form-item>
              <el-button style="width: 150px;" type="primary" icon="el-icon-search" @click="getList()">{{$t('realTimeFault.search')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button style="width: 150px;" type="primary" @click="handleDownExcel()">{{$t('realTimeFault.exportFaults')}}</el-button>
            </el-form-item>
          </center>
        </el-row>
      </el-form>
    </el-card>

    <el-row class="title-item" v-if="this.total">
      {{$t('realTimeFault.currentFaultNum')}}{{this.total}}
    </el-row>

    <el-table
      class='t-table'
      stripe
      :data="tableData"
      style="width: 100%; text-align: center;"
    >
      <el-table-column prop="carModel" align="center" :label="$t('realTimeFault.carType')"></el-table-column>
      <el-table-column prop="vin" align="center" :label="'VIN'"></el-table-column>
      <el-table-column prop="partName" align="center" :label="$t('realTimeFault.partsName')"></el-table-column>
      <el-table-column prop="partValue" align="center" :label="$t('realTimeFault.partsValue')"></el-table-column>
      <el-table-column prop="faultGroup" align="center" :label="$t('realTimeFault.faultGroup')"></el-table-column>
      <el-table-column prop="faultLevel" align="center" :label="$t('realTimeFault.faultLevel')"></el-table-column>
      <el-table-column prop="interventionType" align="center" :label="$t('realTimeFault.interventionType')"></el-table-column>
      <el-table-column prop="faultCode" align="center" :label="$t('realTimeFault.faultCode')"></el-table-column>
      <el-table-column prop="spn" align="center" :label="'SPN'"></el-table-column>
      <el-table-column prop="fmi" align="center" :label="'FMI'"></el-table-column>
      <el-table-column prop="faultDesc" align="center" :label="$t('realTimeFault.desc')"></el-table-column>
      <el-table-column prop="faultTimeAll" align="center" :label="$t('realTimeFault.startTime')" min-width="120"></el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('realTimeFault.operate')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDetail(scope.row)">{{$t('realTimeFault.detail')}}</el-button>
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
import { queryCarFaultList , exportRealtimeCarFaultList } from "@/api/business/businessService";
import pagination from '@/components/pagination'; 
import Export from '@/components/Export'

export default {
  name: 'RealTimeFault',
  components: {
    pagination ,
    Export
  },
  data () {
    return {
      iframeFilter: {},
      total: 0,
      tableData: [],
      query: {
        carNumber: '',
        vin: ''
      },
    }
  },
  activated() {

  },
  mounted() {
    
  },
  methods: {
    handleDownExcel () {
      this.iframeFilter = {
        data: {
          isEmail: true
        }
      }
    },
    async emailExcel (email) {
      await exportRealtimeCarFaultList(Object.assign({ email: email }, this.query))
      this.$message.success(this.$t('realTimeFault.exporting'));
    },
    async getList() {
      if( !this.query.carNumber && !this.query.vin ){
        this.$message({
          message: this.$t('realTimeFault.searchWarn'),
          type: 'error'
        });
      } else {
        let re = await queryCarFaultList(this.query);
        this.tableData = re.data.list
        this.total = re.data.faultCount
      }
    },
    exportFault () {
      
    },
    showDetail (row) {
      console.log(row)
    }
  }
}
</script>

<style scoped>

</style>
