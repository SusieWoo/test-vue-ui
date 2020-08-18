<template>
  <div class="car-manage">
    <!-- 查询条件start -->
    <el-card class="card-panel">
      <el-form :inline="true" :model="querys" label-position="right" label-width="110px">
        <el-form-item :label="$t('basicInfo.bottomCarNo')">
          <el-input
            class="search-item"
            v-model="querys.car.chassisNum"
            :placeholder="$t('common.place')+$t('basicInfo.bottomCarNo')"
          />
        </el-form-item>
        <el-form-item :label="$t('basicInfo.carNo')">
          <el-input
            v-model="querys.car.carCph"
            class="search-item"
            :placeholder="$t('common.place')+$t('basicInfo.carNo')"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">{{$t('common.search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-delete" @click="clear">{{$t('common.clear')}}</el-button>
        </el-form-item>

        <com-search>
          <template>
            <span slot="item">
              <el-form-item :label="$t('basicInfo.carType')">
                <multiple-select :width="160" :data="carType " v-model="querys.dealer.tname"></multiple-select>
              </el-form-item>
              <el-form-item :label="$t('basicInfo.dealer')">
                <el-input
                  class="search-item"
                  v-model="querys.car.chassisNum"
                  :placeholder="$t('common.place')+ $t('basicInfo.dealer')"
                />
              </el-form-item>
              <el-form-item :label="$t('basicInfo.sim')">
                <el-input
                  class="search-item"
                  v-model="querys.car.sim"
                  :placeholder="$t('common.place')+ $t('basicInfo.sim')"
                />
              </el-form-item>
              <el-form-item :label="$t('basicInfo.motivitor')">
                <el-input
                  class="search-item"
                  v-model="querys.detail.engineNumber"
                  :placeholder="$t('common.place')"
                />
              </el-form-item>

              <el-form-item :label="$t('basicInfo.motorType')">
                <multiple-select
                  :width="160"
                  :data="engineType "
                  v-model="querys.detail.engineType"
                ></multiple-select>
              </el-form-item>

              <el-form-item :label="$t('basicInfo.std')">
                <el-select
                  class="search-item"
                  v-model="querys.car.stdStatus"
                  :placeholder="$t('common.select')"
                >
                  <el-option value :label="$t('common.unlimited')" selected="selected"></el-option>
                  <el-option value="0" :label="$t('basicInfo.stdSold')"></el-option>
                  <el-option value="1" :label="$t('basicInfo.stdUnsold')"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('basicInfo.stype')">
                <el-select
                  class="search-item"
                  v-model="querys.detail.fuel"
                  :placeholder="$t('common.select')"
                >
                  <el-option value :label="$t('common.unlimited')" selected="selected"></el-option>
                  <el-option value="0" :label="$t('basicInfo.DV')"></el-option>
                  <el-option value="1" :label="$t('basicInfo.NGV')"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('business.motor')">
                <el-input
                  class="search-item"
                  v-model="querys.detail.engineNumber"
                  :placeholder="$t('common.place')"
                />
              </el-form-item>

              <el-form-item :label="$t('basicInfo.firstOnlineDate')">
                <el-date-picker
                  class="search-item-date-range"
                  v-model="querys.car.nettingDate"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  :start-placeholder="$t('common.select')+$t('basicInfo.firstOnlineDate')"
                ></el-date-picker>
              </el-form-item>

              <el-form-item :label="$t('basicInfo.produceDate')">
                <el-date-picker
                  v-model="querys.car.online"
                  value-format="yyyy-MM-dd"
                  class="search-item-date-range"
                  type="daterange"
                  :start-placeholder="$t('common.select')"
                ></el-date-picker>
              </el-form-item>

              <el-form-item :label="$t('basicInfo.aak')">
                <el-select
                  class="search-item"
                  v-model="querys.car.aakStatus"
                  :placeholder="$t('common.select')"
                >
                  <el-option value :label="$t('common.unlimited')" selected="selected"></el-option>
                  <el-option value="0" :label="$t('basicInfo.aakSold')"></el-option>
                  <el-option value="1" :label="$t('basicInfo.aakUnsold')"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('basicInfo.isSuooprtLock')">
                <el-select
                  class="search-item"
                  v-model="querys.lockInfo.lockCarSupport"
                  :placeholder="$t('common.select')"
                >
                  <el-option value :label="$t('common.unlimited')" selected="selected"></el-option>
                  <el-option value="0" :label="$t('common.no')"></el-option>
                  <el-option value="1" :label="$t('common.yes')"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('basicInfo.factoryCode')">
                <el-select
                  class="search-item"
                  v-model="querys.car.vfactory"
                  :placeholder="$t('common.select')"
                >
                  <el-option
                    v-for="item in vfactoryList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('basicInfo.lockStatus')">
                <el-select
                  class="search-item"
                  v-model="querys.lockInfo.isOpeno"
                  :placeholder="$t('common.select')"
                >
                  <el-option value :label="$t('common.unlimited')" selected="selected"></el-option>
                  <el-option value="0" :label="$t('basicInfo.closed')"></el-option>
                  <el-option value="1" :label="$t('basicInfo.started')"></el-option>
                  <el-option value="2" :label="$t('basicInfo.starting')"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('basicInfo.bottomNo')">
                <el-input
                  class="search-item"
                  style="min-width:400px"
                  v-model="querys.lockInfo.multiCars"
                  :placeholder="$t('basicInfo.bottomNoMore')"
                />
              </el-form-item>
            </span>
          </template>
        </com-search>
      </el-form>
    </el-card>
    <!-- 查询条件end -->
    <el-card>
      <el-button v-if="hasPerm(20010)" type="primary" @click="goToEdit(0)" icon="el-icon-plus">{{$t('common.add')}}</el-button>
      <el-button v-if="hasPerm(20030)" type="primary" @click="lock(1)" icon="el-icon-check">{{$t('basicInfo.lock')}}</el-button>
      <el-button v-if="hasPerm(20031)" type="primary" @click="lock(0)" icon="el-icon-close">{{$t('basicInfo.closeLock')}}</el-button>
      <el-button
        v-if="hasPerm(20032)"
        type="primary"
        @click="downloadSome"
        icon="el-icon-download"
      >{{$t('basicInfo.export')}}</el-button>
      <el-button
        v-if="hasPerm(20033)"
        type="primary"
        @click="downloadAll"
        icon="el-icon-download"
      >{{$t('basicInfo.exportAll')}}</el-button>
    </el-card>
    <!-- 表格start -->
    <el-table
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      v-loading="loading"
      class="t-table"
      stripe
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column fixed="left" align="center" :label="$t('common.operate')" width="120">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            type="text"
            v-if="hasPerm(20012)"
            @click="goToEdit(scope.row.car.carId, 'detail')"
            size="small"
          >{{$t("business.viewDetail")}}</el-button>
          <el-button
            class="ml-10"
            type="text"
            v-if="hasPerm(20011)"
            @click="goToEdit(scope.row.car.carId)"
            size="small"
          >{{$t('common.edit')}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="left"
        property="sturctureNum"
        prop="car.sturctureNum"
        align="center"
        :label="$t('basicInfo.cid')"
        width="180"
      ></el-table-column>
      <el-table-column
        fixed="left"
        property="chassisNum"
        prop="car.chassisNum"
        align="center"
        :label="$t('basicInfo.bottomNo')"
        width="90"
      ></el-table-column>

      <el-table-column
        property="car_TYPE_VALUE"
        prop="car.car_TYPE_VALUE"
        align="center"
        :label="$t('monitor.basic.carType')"
        width="120"
      ></el-table-column>
      <el-table-column
        property="carModelCode"
        prop="car.carModelCode"
        align="center"
        :label="$t('basicInfo.carModelCode')"
        width="180"
      ></el-table-column>

      <el-table-column
        property="dealerCode"
        prop="car.dealerCode"
        align="center"
        :label="$t('basicInfo.dealerCode')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="companyName"
        prop="car.companyName"
        align="center"
        :label="$t('basicInfo.bdealer')"
        width="290"
      ></el-table-column>
      <el-table-column
        property="qrCode"
        prop="car.qrCode"
        align="center"
        :label="$t('basicInfo.qrCode')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="simNo"
        prop="car.simNo"
        align="center"
        :label="$t('basicInfo.fksim')"
        width="160"
      ></el-table-column>

      <el-table-column
        property="vfactory"
        prop="car.vfactory"
        align="center"
        :label="$t('basicInfo.factoryCode')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="fuelValue"
        prop="car.fuelValue"
        align="center"
        :label="$t('basicInfo.stype')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="onlineTime"
        prop="car.onlineTime"
        align="center"
        :label="$t('basicInfo.productDate')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="autoFlagStr"
        prop="car.autoFlagStr"
        align="center"
        :label="$t('basicInfo.inputWay')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="carDate"
        prop="car.carDate"
        align="center"
        :label="$t('basicInfo.inputTime')"
        width="180"
      ></el-table-column>
      <el-table-column
        property="tmFkName"
        prop="car.tmFkName"
        align="center"
        :label="$t('basicInfo.deviceCode')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="fkCode"
        prop="car.fkCode"
        align="center"
        :label="$t('monitor.car.fkId')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="salesStatusValue"
        prop="car.salesStatusValue"
        align="center"
        :label="$t('basicInfo.stdStatus')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="salesDateStr"
        prop="sale.salesDateStr"
        align="center"
        :label="$t('basicInfo.stdDate')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="aakStatusValue"
        prop="car.aakStatusValue"
        align="center"
        :label="$t('basicInfo.aakStatus')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="mbSaleTime"
        prop="car.mbSaleTime"
        align="center"
        :label="$t('basicInfo.aakDate')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="cph"
        prop="car.cph"
        align="center"
        :label="$t('monitor.search.carno')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="removalTimeStr"
        prop="car.removalTimeStr"
        align="center"
        :label="$t('monitor.car.outdate')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="engineTypeRear"
        prop="detail.engineTypeRear"
        align="center"
        :label="$t('basicInfo.motivitor')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="engine_TYPE_VALUE"
        prop="car.engine_TYPE_VALUE"
        align="center"
        :label="$t('basicInfo.motorType')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="engineNumber"
        prop="car.engineNumber"
        align="center"
        :label="$t('business.motor')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="bsx"
        prop="car.bsx"
        align="center"
        :label="$t('monitor.car.gearbox')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="hq"
        prop="car.hq"
        align="center"
        :label="$t('monitor.car.RA')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="qt"
        prop="car.qt"
        align="center"
        :label="$t('basicInfo.change')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="moniterCarType"
        prop="car.moniterCarType"
        align="center"
        :label="$t('basicInfo.isSurCar')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="firstGpsTimeStr"
        prop="car.firstGpsTimeStr"
        align="center"
        :label="$t('basicInfo.firstTime')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="firstAvalidPosition"
        prop="car.firstAvalidPosition"
        align="center"
        :label="$t('basicInfo.firstLocation')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="lastGpsDate"
        prop="car.lastGpsDate"
        align="center"
        :label="$t('monitor.info.lasttime')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="addressDetail"
        prop="car.addressDetail"
        align="center"
        :label="$t('monitor.info.lastlocation')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="frontAxleFactoryOne"
        prop="detail.frontAxleFactoryOne"
        align="center"
        :label="$t('monitor.car.f1Factory')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="frontAxleTypeOne"
        prop="detail.frontAxleTypeOne"
        align="center"
        :label="$t('monitor.car.f1Type')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="frontAxleFactoryTwo"
        prop="detail.frontAxleFactoryTwo"
        align="center"
        :label="$t('monitor.car.f2Factory')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="frontAxleTypeTwo"
        prop="detail.frontAxleTypeTwo"
        align="center"
        :label="$t('monitor.car.f2Type')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="rearAxleFactoryOne"
        prop="detail.rearAxleFactoryOne"
        align="center"
        :label="$t('monitor.car.b1Factory')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="rearAxleTypeOne"
        prop="detail.rearAxleTypeOne"
        align="center"
        :label="$t('monitor.car.b1Type')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="rearAxleFactoryTwo"
        prop="detail.rearAxleFactoryTwo"
        align="center"
        :label="$t('monitor.car.b2Factory')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="rearAxleTypeTwo"
        prop="detail.rearAxleTypeTwo"
        align="center"
        :label="$t('monitor.car.b2Type')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="lockCarSupportStr"
        prop="controller.lockCarSupportStr"
        align="center"
        :label="$t('basicInfo.isSuooprtLock')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="isOpenStr"
        prop="car.isOpenStr"
        align="center"
        :label="$t('basicInfo.lockStatus')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="remark"
        prop="car.remark"
        align="center"
        :label="$t('common.remark')"
        width="160"
      ></el-table-column>
      <el-table-column
        property="lastupdatetime"
        prop="car.lastupdatetime"
        align="center"
        :label="$t('basicInfo.lsTime')"
        width="160"
      ></el-table-column>
    </el-table>
    <!-- 表格end-->
    <!-- 分页start -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="querys.page_number"
      :limit.sync="querys.page_size"
      @pagination="getList"
    />
    <!-- 分页 end -->

    <el-dialog title="$t('common.notice')" :visible.sync="dialogVisible" width="30%">
      <span>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >{{$t('common.selectAll')}}</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedColumn" @change="handleCheckedChange">
          <el-checkbox
            v-for="(item,index) in columnList"
            :label="item.value"
            :key="index"
          >{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button
          :loading="btnLoading"
          @click="downloadSave"
          type="primary"
        >{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
    <download-toemail
      :show="showEmail"
      :showbtn="showEmailBtn"
      :message="message"
      @email="getEmail"
      :fn="sendMail"
    ></download-toemail>
  </div>
</template>

<script>
import {
  queryCar,
  queryCarBasicData,
  operateCar,
  downloadCar
} from "@/api/basicInfo/index";

import pagination from "@/components/pagination";
import multipleSelect from "@/components/multipleSelect";
import comSearch from "@/components/comSearch";
import downloadToemail from "@/components/downloadToEmail";

export default {
  components: {
    multipleSelect,
    comSearch,
    pagination,
    downloadToemail
  },
  computed: {
    vfactoryList() {
      return [
        { label:this.$t('common.unlimited'), value: "" },
        { label: "QK00001"+ this.$t('basicInfo.lightTruck'), value: "QK00001" },
        { label: "QK00002"+ this.$t('basicInfo.lightTruck'), value: "QK00002" },
        { label: "QD00001"+ this.$t('basicInfo.weightTruck'), value: "QD00001" },
        { label: "QA00022"+ this.$t('basicInfo.weightTruck'), value: "QA00022" },
        { label: "LZ00001"+ this.$t('basicInfo.weightTruck'), value: "LZ00001" },
        { label: "LZ00002"+ this.$t('basicInfo.lightTruck'), value: "LZ00002" },
        { label: "QA00016"+ this.$t('basicInfo.weightTruck'), value: "QA00016" },
        { label: "T"+ this.$t('basicInfo.weightTruck'), value: "T" }
      ];
    }
  },
  data() {
    return {
      multipleSelection: [],
      total: 0,
      loading: false,
      querys: {
        page_number: 1,
        page_size: 10,
        business: {},
        car: { stdStatus: "" },
        controller: {},
        dealer: {},
        detail: {},
        lockInfo: {},
        excuteType: {},
        terminal: {}
      },
      btnLoading: false,
      carType: [],
      engineType: [],
      tableData: [],

      dialogVisible: false,
      checkedColumn: [],
      checkAll: false,
      isIndeterminate: null,
      columnList: [],
      message: "",
      showEmail: false,
      showEmailBtn: true
    };
  },
  watch: {},
  mounted() {
    this.getList();
    this.getBasic();
  },
  methods: {
    goToEdit(id, type) {
      this.$router.push({
        path: `carManage/${id}/${type}`
      });
    },
    getEmail(val) {
      this.querys.email = val;
    },
    sendMail() {
      if (!this.querys.email) {
        this.$message(this.$t("basicInfo.message.email"));
        return;
      }
      this.downloadEmails();
    },
    initDialog() {
      this.isIndeterminate = null;
      this.checkedColumn = [];
      this.checkAll = false;
    },
    downloadAll() {
      this.initDialog();
      this.querys.downloadFlag = 1;
      this.download(true);
    },
    downloadSome() {
      this.initDialog();
      this.querys.downloadFlag = null;
      this.querys.email = "";
      if (this.tableData.length === 0) {
        this.$message.warning(this.$t("basicInfo.message.nodataWarn"));
        return;
      }
      this.download(true);
    },
    download() {
      //导出本页
      let arr = this.$refs.multipleTable.$children.map(item => {
        return { label: item.label, value: item.property };
      });
      //筛选掉空列
      arr = arr.filter(item => {
        return item.value !== undefined;
      });

      this.columnList = arr;
      this.dialogVisible = true;
    },
    formatQuerys(obj) {
      for (let i in obj) {
        if (obj[i] instanceof Object) {
          obj[i] = JSON.stringify(obj[i]);
        }
      }
    },
    downloadEmails() {
      let t = this;
      downloadCar(this.querys)
        .then(re => {
          if (re.resultCode === 200) {
            this.message = re.message;
            this.showEmailBtn = false;
          }
        })
        .catch(() => {})
        .finally(() => {});
    },

    downloadSave() {
      let t = this;
      //构建数据结构
      if (this.checkedColumn.length === 0) {
        this.$message.warning(this.$t("basicInfo.message.selectColumn"));
        return;
      }

      this.btnLoading = true;
      let arr = [];
      this.columnList.forEach(item => {
        for (let i = 0; i < this.checkedColumn.length; i++) {
          if (item.value === this.checkedColumn[i]) {
            arr.push({
              [`${item.value}`]: item.label
            });
          }
        }
      });
      this.querys.metadata = arr;
      //格式化对象
      this.formatQuerys(this.querys);

      downloadCar(this.querys)
        .then(re => {
          // this.btnLoading = false;
          if (re.resultCode === 200) {
            window.open(re.data);
            this.dialogVisible = false;
            this.$message(this.$t("basicInfo.message.downloadSuccess"));
          } else if (re.resultCode === 670205) {
            this.dialogVisible = false;
            this.message = re.message;
            this.showEmail = true;
          }
        })
        .catch(() => {
          // this.btnLoading = false;
        })
        .finally(() => {
          this.btnLoading = false;
        });
    },
    handleCheckedChange(val) {
      this.isIndeterminate = true;
      if (this.checkedColumn.length == this.columnList.length) {
        this.isIndeterminate = false;
      }
    },
    handleCheckAllChange(val) {
      this.checkAll = val;
      this.isIndeterminate = false;
      this.checkedColumn = this.checkAll
        ? this.columnList.map(item => {
            return itemright.value;
          })
        : [];
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    clear() {
      this.querys = {
        page_number: 1,
        page_size: 10,
        business: {},
        car: { stdStatus: "" },
        controller: {},
        dealer: {},
        detail: {},
        lockInfo: {},
        excuteType: {},
        terminal: {}
      };
    },

    async getList() {
      this.loading = true;
      const re = await queryCar(this.querys);
      this.loading = false;
      this.tableData = re.data.list;
      this.total = re.data.total;
    },
    async getBasic() {
      let query = {
        carType: 2,
        engineType: 40,
        serverVersion: 3
      };
      const re = await queryCarBasicData(query);
      this.engineType = re.data.engineType.map((item, index, arr) => {
        return {
          id: item.id,
          label: item.dataValue
        };
      });
      this.carType = re.data.carType.map((item, index, arr) => {
        return {
          id: item.id,
          label: item.dataValue
        };
      });
    },
    lock(isOpen) {
      let t = this;
      if (this.multipleSelection.length === 0) {
        this.$message.warning(this.$t("basicInfo.message.carWarn"));
        return;
      }
      const ids = this.multipleSelection
        .map(item => {
          return item.car.carId;
        })
        .join(",");
      this.$confirm(
        isOpen == 1
          ? this.$t("basicInfo.message.confirmOn")
          : this.$t("basicInfo.message.confirmOff"),
        this.$t("common.notice"),
        {
          confirmButtonText: this.$t("common.conform"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          let obj = {
            isOpen: isOpen,
            carIds: ids,
            constraint: ""
          };

          operateCar(obj).then(re => {
            if (re.data) {
              let msg =
                isOpen == 1
                  ? this.$t("basicInfo.message.on")
                  : this.$t("basicInfo.message.off");
              t.$message.warning(msg);
            } else {
              t.$message.success(this.$t("common.tips.operateSuccess"));
              t.getList();
            }
          });
        })
        .catch(() => {});
    },
    getDetail(row) {
      console.log(row);
      this.$router.push({
        path: `carManage/${id}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.car-manage {
  .collapse-select {
    padding: 0 20px;
  }
  .ml-10 {
    margin-left: 10px;
  }
  .list {
    padding: 10px 5px;
    border-bottom: 1px solid #dfe6ec;
  }
  .red {
    color: $red;
  }
  .center {
    text-align: center;
    border-bottom: 1px solid #dfe6ec;
    padding-bottom: 10px;
  }
}
</style>
