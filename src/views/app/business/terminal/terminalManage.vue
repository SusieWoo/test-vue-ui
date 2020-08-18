<template>
  <div class="terminal-page">
    <el-card class="card-panel">
      <el-form :inline="true" :model="querys" label-position="right" label-width="110px">
        <el-form-item :label="$t('business.terminal.id')">
          <el-input v-model="querys.terminalId" class="search-item" :placeholder="$t('business.terminal.placeTerminalId')" />
        </el-form-item>
        <el-form-item label="VIN">
          <el-input v-model="querys.vin" class="search-item" :placeholder="$t('business.terminal.placeVin')" />
        </el-form-item>
        <el-form-item :label="$t('business.terminal.bindCar')">
          <el-select v-model="querys.reStatus" :placeholder="$t('business.terminal.selectBindCar')">
            <el-option
              v-for="item in carsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('business.terminal.simCard')">
          <el-input v-model="querys.simNo" class="search-item" :placeholder="$t('business.terminal.placeSimCard')" />
        </el-form-item>
        <el-form-item :label="$t('business.terminal.deviceTagId')">
          <el-input v-model="querys.devLabelId" class="search-item" :placeholder="$t('business.terminal.placeDeviceTagId')" />
        </el-form-item>
         <com-search>
          <template>
            <span slot="item">
              <el-form-item :label="$t('business.terminal.associatedChassisNumber')">
                <el-input
                  v-model="querys.reChassis"
                  class="search-item"
                  :placeholder="$t('business.terminal.placeAssociatedChassisNumber')"
                />
              </el-form-item>
              <el-form-item :label="$t('business.terminal.associatedCarNumber')">
                <el-input
                  v-model="querys.reVehicleNum"
                  class="search-item"
                  :placeholder="$t('business.terminal.placeAssociatedCarNumber')"
                />
              </el-form-item>
              <el-form-item :label="$t('business.terminal.associatedDealer')">
                <el-input
                  v-model="querys.reAgent"
                  class="search-item"
                  :placeholder="$t('business.terminal.placeAssociatedDealer')"
                />
              </el-form-item>
              <!-- <el-form-item label="关联设备ID">
                <el-input
                  v-model="querys.car.chassisNum"
                  class="search-item"
                  placeholder="请输入关联设备ID"
                />
              </el-form-item>-->
              <el-form-item :label="$t('business.terminal.terminalType')">
                <el-select v-model="querys.type" :placeholder="$t('business.terminal.typeRule')">
                  <el-option value="" :label="$t('common.unlimited')" />
                  <el-option value="0" :label="`FK${$t('common.ctrl')}`" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('basicInfo.isSuooprtLock')">
                <el-select v-model="querys.lockCarSupport" :placeholder="$t('common.placeSelect')">
                  <el-option value="" :label="$t('common.unlimited')" />
                  <el-option value="1" :label="$t('common.yes')" />
                  <el-option value="0" :label="$t('common.no')" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('business.terminal.terminalModel')">
                <el-select v-model="querys.tmId" :placeholder="$t('business.terminal.selectTerminalModel')">
                  <el-option value="" :label="$t('common.unlimited')" />
                  <el-option
                    v-for="(item, index) in terminalModels"
                    :key="index"
                    :value="item.tmId"
                    :label="item.tmName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('business.terminal.wifiFactoryCtrl')">
                <el-select v-model="querys.wifiFactorySwitch" :placeholder="$t('business.terminal.selectWifiFactoryCtrl')">
                  <el-option value="" :label="$t('common.unlimited')" />
                  <el-option value="1" :label="$t('common.open')" />
                  <el-option value="0" :label="$t('common.close')" />
                  <el-option value="-2" :label="$t('common.unknown')" />
                  <el-option value="2" label="/" />
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="SIM卡缴费状态">
                <el-select v-model="querys.bindCar" placeholder="请选择SIM卡缴费状态">
                  <el-option value="1" label="不限" />
                  <el-option value="2" label="是" />
                  <el-option value="3" label="否" />
                </el-select>
              </el-form-item>-->
            </span>
          </template>
        </com-search>
        <br />
         <el-form-item label=" ">
          <el-button type="primary" style="width:117px" icon="el-icon-search" @click="getList">{{$t('common.search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPerm(20014)" type="primary" style="width:117px"  icon="el-icon-plus" @click="$router.push({name: 'terminalAddAndEdit', params: {type: 'add'}})">{{ $t('common.add') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="hasPerm(20034)" type="primary" style="width:117px" icon="el-icon-upload"   @click="importDialogVisible = true">{{ $t('business.terminal.importTerminal') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:117px"  icon="el-icon-delete" @click="clear">{{$t('common.clear')}}</el-button>
        </el-form-item>

      </el-form>
    </el-card>
    <el-table v-loading="loading" border class="t-table" stripe :data="tableData" style="width: 100%">
      <el-table-column type="index" :label="$t('common.serialNumber')" width="80" />
      <el-table-column prop="terminalId" :label="$t('business.terminal.id')" width="110" />
      <el-table-column prop="simNo" :label="$t('business.terminal.terminalSimCard')" width="110" />
      <el-table-column prop="typeName" :label="$t('business.terminal.terminalType')" width="110" />
      <el-table-column prop="modelName" :label="$t('business.terminal.terminalModel')" width="130" />
      <el-table-column prop="wifiFactorySwitch" :label="$t('business.terminal.wifiFactoryCtrl')" width="110" />
      <el-table-column prop="protocolName" :label="$t('business.terminal.protocolType')" width="220" />
      <el-table-column prop="reAgentName" :label="$t('business.terminal.ownedDealer')" width="280" />
      <el-table-column prop="vehicleId" :label="$t('business.terminal.ownedCar')" width="110" />
      <el-table-column prop="devLabelId" :label="$t('business.terminal.deviceTagId')" width="320" />
      <el-table-column prop="simMatch" :label="$t('business.terminal.drawingNumber')" width="150" />
      <el-table-column prop="mcuVer" label="mcuVer" width="320" />
      <el-table-column prop="appVer" label="appVer" width="220" />
      <el-table-column prop="lockCarSupport" :label="$t('basicInfo.isSuooprtLock')" width="110" />
      <el-table-column prop="createUser" :label="$t('carGroup.creater')" width="110" />
      <el-table-column prop="createTime" :label="$t('carGroup.createStartTime')" width="160" />
      <el-table-column prop="remark" :label="$t('common.remark')" width="150" />
      <el-table-column
              fixed="right"
              :label="$t('carGroup.operation')"
              width="120">
        <template slot-scope="scope">
          <el-button v-if="hasPerm(20015)" type="text" size="small" @click="$router.push({name: 'terminalAddAndEdit', params: {id: scope.row.id}})">
            {{ $t('carGroup.edit') }}
</el-button>
          <el-button v-if="hasPerm(20044)" type="text" size="small" style="color: red" @click="handleDel">{{ $t('common.del') }}</el-button>
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

    <el-dialog width="600px" :title="$t('business.terminal.importMore')" :visible.sync="importDialogVisible">
      <div>{{ $t('business.terminal.selectTemp') }}（<a style="color:#990000;" :href="tempDownloadUrl" download="">{{ $t('business.terminal.clickDownload') }}</a>）,{{ $t('business.terminal.tipsText') }}</div>
      <aj-upload :tips.sync="uploadTips" @success="handleUploadSuccess" />
      <el-button slot="footer" type="primary" @click="importDialogVisible = false">{{ $t('common.confirm') }}</el-button>
    </el-dialog>
  </div>
</template>

<script>
import comSearch from '@/components/comSearch';
import pagination from '@/components/pagination';
import ajUpload from '@/components/aj-upload'
import { listTerModel, queryTerminalList, importTerminal } from '@/api/business/businessService'
export default {
  name: 'TerminalManage',
  components: {
    comSearch,
    pagination,
    ajUpload
  },
  data() {
    return {
      tempDownloadUrl: '../../../../assets/terminalimport.xlsx',
      carsOptions: [
        {
          label: this.$t('common.unlimited'),
          value: -1
        },
        {
          label: this.$t('business.terminal.unBindCar'),
          value: 0
        },
        {
          label: this.$t('business.terminal.bindCar'),
          value: 1
        }
      ],
      terminalModels: [],
      querys: {
        page_number: 1,
        page_size: 10
      },
      loading: false,
      total: 0,
      tableData: [],
      importDialogVisible: false,
      uploadTips: []
    };
  },
  mounted () {
    this.getListTerModel()
    this.getList()
  },
  methods: {
    getListTerModel () {
      listTerModel().then(res => {
        this.terminalModels = res.data.list
      })
    },
    getList() {
      this.loading = true
      queryTerminalList(this.querys).then(res => {
        console.log(res)
        this.tableData = res.data.list
        this.total = res.data.total
        this.loading = false
      })
    },
    clear() {
      this.querys = {
        page_number: 1,
        page_size: 10
      }
    },
    handleDel() {
      this.$confirm(this.$t('common.confirmDel'), this.$t('common.notice'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {

      }).catch(() => {
      });
    },
    handleUploadSuccess (e) {
      importTerminal({ filePath: e.fullPath }).then(() => {
        this.getList()
        this.uploadTips.push({
          text: this.$t('business.terminal.importantSuccess'),
          type: 'success'
        })
      }).catch(err => {
        console.log('失败')
        this.uploadTips.push({
          text: err.message,
          type: 'error'
        })
      })
    }
  }
};
</script>

<style scoped>
</style>
