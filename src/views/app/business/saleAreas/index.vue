<template>
  <div class="saleAeras-page">
    <el-card class="card-panel">
      <el-form :inline="true" :model="querys" label-position="right" label-width="110px">
        <el-form-item :label="$t('business.saleArea.areaName')">
          <el-input v-model="querys.tname" class="search-item" :placeholder="$t('business.saleArea.selectAreaName')" />
        </el-form-item>
        <el-form-item :label="$t('business.saleArea.areaContactPerson')">
          <el-input v-model="querys.tlinkman" class="search-item" :placeholder="$t('business.saleArea.selectAreaContactPerson')" />
        </el-form-item>
        <SelectTable
            :key="1"
            v-model="querys.pName"
            :label="$t('business.dealer.area')"
            :placeholder="$t('business.dealer.selectAreaDealer')"
            :table-title="$t('business.dealer.area')"
            prop="pName"
            search-name="districtName"
            :column-list="columnList"
            :table-list="tableList"
            :total="total"
            @search="getDealer"
            @obj="getSelectDealer"
        />
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">{{$t('common.search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-delete" @click="clear">{{$t('common.clear')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPerm(20020)" type="primary" @click="$router.push({name: 'saleAreasAddAndEdit'})">{{$t('common.add')}}</el-button>
        </el-form-item>
      </el-form>
  </el-card>
    <el-table v-loading="loading" border class="t-table" stripe :data="tableData" style="width: 100%">
      <el-table-column type="index" :label="$t('common.serialNumber')" width="80" />
      <el-table-column prop="tName" :label="$t('business.saleArea.areaName')" />
      <el-table-column prop="pName" :label="$t('business.dealer.area')" />
      <el-table-column prop="tlinkMan" :label="$t('business.saleArea.communityContact')" />
      <el-table-column prop="tlinkTel" :label="$t('business.saleArea.communityContactPhone')" />
      <el-table-column
          fixed="right"
          :label="$t('common.operate')"
          width="120">
        <template slot-scope="scope">
          <el-button v-if="hasPerm(20021)" type="text" size="small" @click="$router.push({name: 'saleAreasAddAndEdit', params: {id: scope.row.id}})">{{$t('common.edit')}}</el-button>
          <el-button v-if="hasPerm(20046)" type="text" size="small" style="color: red" @click="handleDel(scope.row)">{{$t('common.del')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="querys.page_number"
        :limit.sync="querys.page_size"
        @pagination="getList"
    />
</div>
</template>

<script>
import { queryDistrictTip, queryDistrictList, deleteDistrict } from '@/api/business/businessService';
import SelectTable from '@/components/selectTable'
import pagination from '@/components/pagination';
export default {
  name: 'Index',
  components: {
    SelectTable,
    pagination
  },
  data () {
    return {
      querys: {
        page_number: 1,
        page_size: 10
      },
      tableList: [], //table渲染数据
      columnList: [], //table展示的列内容
      total: 0,
      loading: false,
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      queryDistrictList(this.querys).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
      }).finally(() => this.loading = false)
    },
    getSelectDealer(obj) {
      this.querys.parentId = obj.id;
    },
    async getDealer(querys) {
      this.columnList = [
        {
          title: this.$t('common.serialNumber'),
          type: 'index'
        },
        {
          title: this.$t('business.terminal.area'),
          prop: 'districtName'
        },
        {
          title: this.$t('business.dealer.topSaleArea'),
          prop: 'pdistrictName'
        },
        {
          title: this.$t('business.dealer.contactPerson'),
          prop: 'linkMan'
        }
      ];
      // console.log(querys)
      const re = await queryDistrictTip({ ...querys, type: 0 });
      re.data.list.forEach(element => {
        element.value = element.districtName;
      });
      this.tableList = re.data.list;
      this.total = re.data.total;
    },
    clear() {
      this.querys = {
        page_number: 1,
        page_size: 10
      }
    },
    handleDel(row) {
      this.$confirm(this.$t('common.confirmDel'), this.$t('common.notice'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        deleteDistrict({ tid: row.id, tName: row.tName }).then(() => {
          this.$message.success(this.$t('common.delSuccess'))
          this.getList()
        })
      }).catch(() => {
      });
    }
  }
}
</script>

<style scoped>

</style>
