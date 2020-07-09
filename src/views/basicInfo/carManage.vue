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
                  :placeholder="$t('common.place')+$t('basicInfo.dealer')"
                />
              </el-form-item>
              <el-form-item :label="$t('basicInfo.sim')">
                <el-input
                  class="search-item"
                  v-model="querys.car.sim"
                  :placeholder="$t('common.place')+$t('basicInfo.sim')"
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
                  <el-option value label="不限" selected="selected"></el-option>
                  <el-option value="0" label="STD已售"></el-option>
                  <el-option value="1" label="STD未售"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('basicInfo.stype')">
                <el-select
                  class="search-item"
                  v-model="querys.detail.fuel"
                  :placeholder="$t('common.select')"
                >
                  <el-option value label="不限" selected="selected"></el-option>
                  <el-option value="0" label="柴油车"></el-option>
                  <el-option value="1" label="天然气车"></el-option>
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
                  <el-option value label="不限" selected="selected"></el-option>
                  <el-option value="0" label="AAK已售"></el-option>
                  <el-option value="1" label="AAk未售"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('basicInfo.isSuooprtLock')">
                <el-select
                  class="search-item"
                  v-model="querys.lockInfo.lockCarSupport"
                  :placeholder="$t('common.select')"
                >
                  <el-option value label="不限" selected="selected"></el-option>
                  <el-option value="0" label="否"></el-option>
                  <el-option value="1" label="是"></el-option>
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

              <el-form-item :label="$t('basicInfo.belong')">
                <el-select
                  class="search-item"
                  v-model="querys.car.belongTo"
                  :placeholder="$t('common.select')"
                >
                  <el-option value label="不限" selected="selected"></el-option>
                  <el-option value="0" label="长春"></el-option>
                  <el-option value="1" label="青岛"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item :label="$t('basicInfo.lockStatus')">
                <el-select
                  class="search-item"
                  v-model="querys.lockInfo.isOpeno"
                  :placeholder="$t('common.select')"
                >
                  <el-option value label="不限" selected="selected"></el-option>
                  <el-option value="0" label="已关闭"></el-option>
                  <el-option value="1" label="已开启"></el-option>
                  <el-option value="2" label="开启中"></el-option>
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
      <el-button type="primary" icon="el-icon-plus">新增</el-button>
      <el-button type="primary" @click="lock(1)" icon="el-icon-check">开启锁车功能</el-button>
      <el-button type="primary" @click="lock(0)"  icon="el-icon-close">关闭锁车功能</el-button>
      <el-button type="primary" icon="el-icon-download">导出本页</el-button>
      <el-button type="primary" icon="el-icon-download">导出全部</el-button>
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
      <el-table-column fixed="left" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button slot="reference" type="text" @click="getDetail(scope.row)" size="small">查看详情</el-button>

          <el-button class="ml-10" type="text" size="small">{{$t('common.edit')}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="left"
        prop="car.sturctureNum"
        align="center"
        label="车架号(改码前)"
        width="180"
      ></el-table-column>
      <el-table-column fixed="left" prop="car.chassisNum" align="center" label="底盘号" width="90"></el-table-column>
      <el-table-column prop="car.car_TYPE_VALUE" align="center" label="车辆类型" width="120"></el-table-column>
      <el-table-column prop="car.carModelCode" align="center" label="车型码" width="180"></el-table-column>
      <el-table-column prop align="center" label="归属" width="120"></el-table-column>
      <el-table-column prop="car.dealerCode" align="center" label="经销商代码" width="160"></el-table-column>
      <el-table-column prop="car.companyName" align="center" label="所属经销商" width="290"></el-table-column>
      <el-table-column prop="car.qrCode" align="center" label="二维码" width="160"></el-table-column>
      <el-table-column prop="car.simNo" align="center" label="FK控制器SIM卡" width="160"></el-table-column>
      <el-table-column prop="car.vfactory" align="center" label="工厂代码" width="160"></el-table-column>
      <el-table-column prop="car.fuelValue" align="center" label="动力类型" width="160"></el-table-column>
      <el-table-column prop="car.onlineTime" align="center" label="下线(制造日期)" width="160"></el-table-column>
      <el-table-column prop="car.autoFlagStr" align="center" label="录入方式" width="160"></el-table-column>
      <el-table-column prop="car.carDate" align="center" label="录入平台时间/安装时间" width="180"></el-table-column>
      <el-table-column prop="car.tmFkName" align="center" label="终端型号" width="160"></el-table-column>
      <el-table-column prop="car.fkCode" align="center" label="FK控制器ID" width="160"></el-table-column>
      <el-table-column prop="car.salesStatusValue" align="center" label="STD销售状态" width="160"></el-table-column>
      <el-table-column prop="sale.salesDateStr" align="center" label="STD销售日期" width="160"></el-table-column>
      <el-table-column prop="car.aakStatusValue" align="center" label="AAK销售状态" width="160"></el-table-column>
      <el-table-column prop="car.mbSaleTime" align="center" label="AAK销售日期" width="160"></el-table-column>
      <el-table-column prop="car.cph" align="center" label="车牌号" width="160"></el-table-column>
      <el-table-column prop="car.removalTimeStr" align="center" label="出库日期" width="160"></el-table-column>
      <el-table-column prop="detail.engineTypeRear" align="center" label="发动机型号" width="160"></el-table-column>
      <el-table-column prop="car.engine_TYPE_VALUE" align="center" label="发动机类型" width="160"></el-table-column>
      <el-table-column prop="car.engineNumber" align="center" label="发动机号" width="160"></el-table-column>
      <el-table-column prop="car.bsx" align="center" label="变速箱" width="160"></el-table-column>
      <el-table-column prop="car.hq" align="center" label="后桥" width="160"></el-table-column>
      <el-table-column prop="car.qt" align="center" label="长换油" width="160"></el-table-column>
      <el-table-column prop="car.moniterCarType" align="center" label="是否监控车" width="160"></el-table-column>
      <el-table-column prop="car.firstGpsTimeStr" align="center" label="首次有效位置时间" width="160"></el-table-column>
      <el-table-column prop="car.firstAvalidPosition" align="center" label="首次有效位置" width="160"></el-table-column>
      <el-table-column prop="car.lastGpsDate" align="center" label="末次有效位置时间" width="160"></el-table-column>
      <el-table-column prop="car.addressDetail" align="center" label="末次有效位置" width="160"></el-table-column>
      <el-table-column prop="detail.frontAxleFactoryOne" align="center" label="前桥1厂家" width="160"></el-table-column>
      <el-table-column prop="detail.frontAxleTypeOne" align="center" label="前桥1型号" width="160"></el-table-column>
      <el-table-column prop="detail.frontAxleFactoryTwo" align="center" label="前桥2厂家" width="160"></el-table-column>
      <el-table-column prop="detail.frontAxleTypeTwo" align="center" label="前桥2型号" width="160"></el-table-column>
      <el-table-column prop="detail.rearAxleFactoryOne" align="center" label="后桥1厂家" width="160"></el-table-column>
      <el-table-column prop="detail.rearAxleTypeOne" align="center" label="后桥1型号" width="160"></el-table-column>
      <el-table-column prop="detail.rearAxleFactoryTwo" align="center" label="后桥2厂家" width="160"></el-table-column>
      <el-table-column prop="detail.rearAxleTypeTwo" align="center" label="后桥2型号" width="160"></el-table-column>
      <el-table-column
        prop="controller.lockCarSupportStr"
        align="center"
        :label="$t('basicInfo.isSuooprtLock')"
        width="160"
      ></el-table-column>
      <el-table-column prop="car.isOpenStr" align="center" label="锁车功能状态" width="160"></el-table-column>
      <el-table-column prop="car.remark" align="center" label="备注" width="160"></el-table-column>
      <el-table-column prop="car.lastupdatetime" align="center" label="锁车状态更新时间" width="160"></el-table-column>
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

  </div>
</template>

<script>
import { queryCar, queryCarBasicData, operateCar } from "@/api/basicInfo/index";

import pagination from "@/components/pagination";
import multipleSelect from "@/components/multipleSelect";
import comSearch from "@/components/comSearch";

export default {
  components: {
    multipleSelect,
    comSearch,
    pagination
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
      carType: [],
      engineType: [],
      tableData: [],
      vfactoryList: [
        { label: "不限", value: "" },
        { label: "QK00001", value: "QK00001轻卡" },
        { label: "QK00002", value: "QK00002轻卡" },
        { label: "QD00001", value: "QD00001重卡" },
        { label: "QA00022", value: "QA00022重卡" },
        { label: "LZ00001", value: "LZ00001重卡" },
        { label: "LZ00002", value: "LZ00002轻卡" },
        { label: "QA00016", value: "QA00016重卡" },
        { label: "T", value: "T重卡" }
      ]
    };
  },
  watch: {},
  mounted() {
    this.getList();
    this.getBasic();
  },
  methods: {
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
        this.$message.warning("请勾选锁车车辆");
        return;
      }
      const statusStr = isOpen == 1 ? "开启！" : "关闭！";
      const ids = this.multipleSelection.map(item => {
        return item.car.carId;
      }).join(",")
      console.log(ids);
      this.$confirm(`确定${statusStr}锁车功能?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let obj = {
            isOpen: isOpen,
            carIds: ids,
            constraint: ""
          };

          operateCar(obj).then(re => {
            if (re.data) {
              t.$message.warning(
                `车辆${re}不处于防控关闭状态,无法${statusStr}`
              );
            } else {
              t.$message.success("操作成功");
              t.getList();
            }
          });
        })
        .catch(() => {});
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