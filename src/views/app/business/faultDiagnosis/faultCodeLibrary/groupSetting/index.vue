<template>
	<div class="app-container">
    <el-card class="card-panel">
      <el-form :inline="true" :model="query" label-position="left">
        <el-form-item :label="$t('groupSetting.faultGroup')" label-width="90px">
          <el-input v-model="query.groupNumber" style="width: 120px"/>
        </el-form-item>
        <el-form-item :label="$t('groupSetting.powerType')" label-width="90px">
          <el-select 
            v-model="query.powerType" 
            style="width: 120px"
            :placeholder="$t('groupSetting.all')"
            clearable
          >
            <el-option
              v-for="item in powerTypeList"
              :label="item.name"
              :value="item.name"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('groupSetting.discharge')" label-width="90px">
          <el-select 
            v-model="query.dischargeType" 
            style="width: 120px"
            :placeholder="$t('groupSetting.all')"
            clearable
          >
            <el-option
              v-for="item in dischargeTypeList"
              :label="item.name"
              :value="item.name"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('groupSetting.ecuType')" label-width="90px">
          <el-select 
            v-model="query.ecuType" 
            style="width: 120px"
            :placeholder="$t('groupSetting.all')"
            clearable
          >
            <el-option
              v-for="item in ecuTypeList"
              :label="item.name"
              :value="item.name"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('groupSetting.ecuVersion')" label-width="90px">
          <el-select 
            v-model="query.ecuVersion" 
            style="width: 120px"
            :placeholder="$t('groupSetting.all')"
            clearable
          >
            <el-option
              v-for="item in ecuVersionList"
              :label="item.name"
              :value="item.name"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('groupSetting.engineBrand')" label-width="100px">
          <el-select 
            v-model="query.engineBrand" 
            style="width: 120px"
            :placeholder="$t('groupSetting.all')"
            clearable
          >
            <el-option
              v-for="(item , index) in engineBrandList"
              :label="item.engineBrand"
              :value="item.engineBrand"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('groupSetting.engineType')" label-width="90px">
          <el-input v-model="query.engineModel" style="width: 120px"/>
        </el-form-item>

        <el-row>
          <center>
            <el-button style="width: 150px;" type="primary" icon="el-icon-search" @click="getList()">{{$t('common.search')}}</el-button>
            <el-button style="width: 150px;" type="primary" @click="add()">{{$t('common.add')}}</el-button>
            <el-button style="width: 150px;" type="primary" @click="handleDownExcel()">{{$t('common.export')}}</el-button>
          </center>
        </el-row>
      </el-form>
    </el-card>

    <el-table
      class='t-table'
      stripe
      :data="tableData"
      style="width: 100%; text-align: center;"
    >
      <el-table-column type="index" width="55" :label="$t('common.index')"></el-table-column>
      <el-table-column prop="groupNumber" align="center" :label="$t('groupSetting.faultGroup')"></el-table-column>
      <el-table-column prop="powerType" align="center" :label="$t('groupSetting.powerType')"></el-table-column>
      <el-table-column prop="dischargeType" align="center" :label="$t('groupSetting.discharge')"></el-table-column>
      <el-table-column prop="ecuType" align="center" :label="$t('groupSetting.ecuType')"></el-table-column>
      <el-table-column prop="ecuVersion" align="center" :label="$t('groupSetting.ecuVersion')"></el-table-column>
      <el-table-column prop="engineBrand" align="center" :label="$t('groupSetting.engineBrand')"></el-table-column>
      <el-table-column prop="updatedBy" align="center" :label="$t('groupSetting.operater')"></el-table-column>
      <el-table-column prop="updatedTime" align="center" :label="$t('groupSetting.lastUpdateTime')"></el-table-column>
      <el-table-column align="center" :label="$t('groupSetting.operate')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detail(scope.row)">{{$t('groupSetting.detail')}}</el-button>
          <el-button type="text" size="small" @click="update(scope.row)">{{$t('groupSetting.update')}}</el-button>
          <el-button type="text" size="small" @click="del(scope.row)">{{$t('groupSetting.delete')}}</el-button>
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
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVis"
      top="20vh"
      width="50%"
      :title="dialogType=='add'?$t('common.add'):dialogType=='detail'?$t('common.del'):dialogType=='update'?$t('common.edit'):''"
      :show-close="false"
    >
      <center>
        <el-form
          :inline="true"
          :model="addForm"
          label-position="left"
          :rules="addFormRuless"
          ref="addForm"
        >
          <el-row>
            <el-form-item :label="$t('groupSetting.faultGroup')" label-width="150px" prop="partName">
              <el-input v-model="addForm.groupNumber" class="dialogFormItem" :disabled="dialogType === 'detail'"/>
            </el-form-item>
          </el-row>
          
        </el-form>
      </center>
    </el-dialog>
	</div>
</template>

<script>
import {
  queryFaultGroupList ,
  queryDataDictList ,
  queryAllEngineBrand ,
  queryAllEngineModel ,
  exportFaultGroupList ,
  queryFaultGroupInfo ,
  delFaultGroupInfo ,
  saveFaultGroupInfo
} from "@/api/business/businessService";
import pagination from '@/components/pagination'; 
import Export from '@/components/Export';
import Import from '@/components/import';

export default {
  name: 'Group',
  components: {
    pagination ,
    Export ,
    Import
  },
  data () {
    return {
      addFormRuless: {},
      addForm: {},
      dialogVis: false,
      dialogType: '',
      engineBrandList: [],
      ecuVersionList: [],
      dischargeTypeList: [],
      powerTypeList: [],
      ecuTypeList: [],
      total: 0,
      query: {
        page_number: 1,
        page_size: 10
      },
      tableData: []
    }
  },
  mounted() {
    this.getList()
    this.getAList()
    this.getBList()
    this.getCList()
    this.getDList()
    this.getAllEngineBrand()
    this.getAllEngineModel()
  },
  methods: {
    add () {
      this.dialogVis = true
      this.dialogType = 'add'
    },
    async getList() {
        const re = await queryFaultGroupList(this.query);
        this.tableData = re.data.list
        this.total = re.data.total
    },
    async getAList() {
        const re = await queryDataDictList({code: 'FA01'});
        this.powerTypeList = re.data
    },
    async getBList() {
        const re = await queryDataDictList({code: 'FA02'});
        this.dischargeTypeList = re.data
    },
    async getCList() {
        const re = await queryDataDictList({code: 'FA03'});
        this.ecuTypeList = re.data
    },
    async getDList() {
        const re = await queryDataDictList({code: 'FA04'});
        this.ecuVersionList = re.data
    },
    async getAllEngineBrand() {
        const re = await queryAllEngineBrand();
        this.engineBrandList = re.data
    },
    async getAllEngineModel() {
        const re = await queryAllEngineModel();
    },
    del (row) {
      console.log(row)
      this.$confirm(this.$t('groupSetting.deleteConfirm'), this.$t('groupSetting.tip'), {
        confirmButtonText: this.$t('groupSetting.confirm'),
        cancelButtonText: this.$t('groupSetting.cancel'),
        type: 'warning'
      })
      .then(async () => {
        let re = await delFaultGroupInfo({id: row.id})
        if(re.message==="OK"){
          this.$message({
            message:  this.$t('groupSetting.deleteSuccess'),
            type: 'success'
          });
        } else {
          this.$message({
            message: this.$t('groupSetting.deleteFault'),
            type: 'error'
          });
        }
        this.getList()
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message:  this.$t('groupSetting.canceled') 
        });          
      });
    },
  }
}
</script>

<style scoped>
  .dialogFormItem {
    width: 300px
  }
</style>
