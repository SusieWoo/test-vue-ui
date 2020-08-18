<template>
  <div class="dealer-management-page">
    <el-card class="card-panel">
      <el-form :inline="true" :model="form" label-position="right" label-width="110px">
        <el-form-item :label="$t('business.terminal.dealerName')">
          <el-input v-model="form.tname" class="search-item" :placeholder="$t('business.terminal.selectDealerName')" />
        </el-form-item>
        <el-form-item :label="$t('business.dealer.dealerNo')">
          <el-input v-model="form.dealerCode" class="search-item" :placeholder="$t('business.dealer.selectDealerNo')" />
        </el-form-item>
        <SelectTable
            :key="1"
            v-model="form.viewpname"
            :label="$t('business.dealer.area')"
            :placeholder="$t('business.dealer.selectAreaDealer')"
            :table-title="$t('business.dealer.area')"
            prop="name"
            search-name="districtName"
            :column-list="columnList"
            :table-list="tableList"
            :total="total"
            @search="getDealer"
            @obj="getSelectDealer"
        />
        <el-form-item :label="$t('business.dealer.isStrategy')">
          <el-select v-model="form.reStatus">
            <el-option value="" :label="$t('common.unlimited')" />
            <el-option value="1" :label="$t('common.yes')" />
            <el-option value="0" :label="$t('common.no')" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">{{$t('common.search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-delete" @click="clear">{{$t('common.clear')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPerm(20017)" type="primary" @click="$router.push({name: 'dealerAddAndEdit'})">{{$t('common.add')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPerm(20035)" type="primary" @click="exportAll">{{$t('business.dealer.exportAll')}}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table v-loading="loading" border class="t-table" stripe :data="tableData" style="width: 100%">
      <el-table-column type="index" :label="$t('common.serialNumber')" width="80" />
      <el-table-column prop="syncSignStatus" :label="$t('business.dealer.syncTags')" width="110">
        <template slot-scope="scope">
          <span>{{scope.row.syncSignStatus === 200 ? $t('common.success') : $t('common.fail')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tname" :label="$t('business.terminal.dealerName')" width="280" />
      <el-table-column prop="dealerCode" :label="$t('business.dealer.ZhongjuCarNo')" width="100" />
      <el-table-column prop="dealerQkCode" :label="$t('business.dealer.lightCarNo')" width="100" />
      <el-table-column prop="pname" :label="$t('business.terminal.area')" width="120" />
      <el-table-column prop="companyAddress" :label="$t('business.dealer.dealerAddress')" width="280" />
      <el-table-column prop="lng" :label="$t('common.lng')" width="100" />
      <el-table-column prop="lat" :label="$t('common.lat')" width="100" />
      <el-table-column prop="enableRadius" :label="`${$t('business.dealer.activeRadius')}(KM)`" width="120" />
      <el-table-column prop="lockRadius" :label="`${$t('business.dealer.lockRadius')}(KM)`" width="120" />
      <el-table-column prop="companyLinkman" :label="$t('business.dealer.contactPerson')" width="100" />
      <el-table-column prop="companyLinktel" :label="$t('business.dealer.contactPhone')" width="150" />
      <el-table-column prop="tAccountName" :label="$t('business.dealer.createPerson')" width="100" />
      <el-table-column prop="tDate" :label="$t('business.dealer.createTime')" width="160" />

      <el-table-column
          fixed="right"
          :label="$t('common.operate')"
          width="150">
        <template slot-scope="scope">
          <el-button v-if="hasPerm(20018)" type="text" size="small" @click="$router.push({name: 'dealerAddAndEdit', params: {id: scope.row.id}})">{{$t('common.edit')}}</el-button>
          <el-button v-if="hasPerm(20045)" type="text" size="small" style="color: red" @click="handleDel(scope.row)">{{$t('common.del')}}</el-button>
          <el-switch v-model="scope.row.isAble" :active-value="1" inactive-value="0" style="margin-left: 10px;" @change="toggleDelaerStatus(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="form.page_number"
        :limit.sync="form.page_size"
        @pagination="getList"
    />
    <ExportToEmail :show="showExportModal" :message="emailTipsContent" :fn="downloadFn" />

    <el-dialog
        :title="$t('common.notice')"
        :visible.sync="exportSuccessModal"
        width="30%">
      <div v-html="exportSuccessTips"></div>
      <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="exportSuccessModal = false">{{$t('common.confirm')}}</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryDistrictTip, querySDealer, enableOrDisable, delDealer, exportSDealer } from '@/api/business/businessService'
import SelectTable from '@/components/selectTable'
import pagination from '@/components/pagination';
import ExportToEmail from '@/components/downloadToEmail';
export default {
  name: 'DealerManagement',
  components: {
    SelectTable,
    pagination,
    ExportToEmail
  },
  data () {
    return {
      form: {
        page_number: 1,
        page_size: 10
      },
      carsOptions: [],
      tableList: [], //table渲染数据
      columnList: [], //table展示的列内容
      total: 0,
      loading: false,
      tableData: [],
      showExportModal: false,
      emailTipsContent: '',
      exportSuccessModal: false,
      exportSuccessTips: ''
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
      this.loading = true
      const res = await querySDealer(this.form)
      this.tableData = res.data.list
      this.total = res.data.total
      this.loading = false
    },
    getSelectDealer(obj) {
      this.form.pId = obj.id;
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
    handleDel(row) {
      this.$confirm(this.$t('common.confirmDel'), this.$t('common.notice'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        // tid: 1184 dealerCode: 112233
        delDealer({ tid: row.id, dealerCode: row.dealerCode }).then(() => {
          this.$message.success(this.$t('common.del') + this.$t('common.success'))
          this.getList()
        })
      }).catch(() => {
      });
    },
    toggleDelaerStatus(row) {
      console.log(row)
      // return
      enableOrDisable({ state: row.isAble, tId: row.id }).then(() => {
        this.$message.success(row.isAble === 1 ? this.$t('business.dealer.dealerIsActive') : this.$t('business.dealer.dealerIsInActive'))
        this.getList()
      })
    },
    exportAll(email = undefined) {
      exportSDealer({ email: typeof email === 'string' ? email : undefined }).then(res => {
        if (res.resultCode === 670205) {
          this.showExportModal = true
          this.emailTipsContent = res.message
        } else if (res.resultCode === 200) {
          this.showExportModal = false
          this.exportSuccessModal = true
          this.exportSuccessTips = res.message
        }
      })
    },
    downloadFn(email) {
      console.log('downloadFn')
      this.exportAll(email)
    },
    clear() {
      this.form = {
        page_number: 1,
        page_size: 10
      }
    },
  }
}
</script>

<style scoped>

</style>
