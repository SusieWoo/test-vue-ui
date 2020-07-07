<template>
  <div class="car-manage">
    <!-- 查询条件start -->
    <el-card class="card-panel">
      <el-form :inline="true" :model="querys" label-position="left">
        <el-form-item :label="$t('basicInfo.bottomCarNo')">
          <el-input
            v-model="querys.car.chassisNum"
            :placeholder="$t('common.place')+$t('basicInfo.bottomCarNo')"
          />
        </el-form-item>
        <el-form-item :label="$t('basicInfo.carNo')">
          <el-input
            v-model="querys.car.carCph"
            :placeholder="$t('common.place')+$t('basicInfo.carNo')"
          />
        </el-form-item>
        <!-- <el-form-item :label="$t('business.motor')">
          <el-input v-model="querys.engineNum" :placeholder="$t('business.pmotor')" />
        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">{{$t('common.search')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-delete" @click="clear">{{$t('common.clear')}}</el-button>
        </el-form-item>

        <com-search>
          <template>
            <span slot="item"></span>
          </template>
        </com-search>
      </el-form>
    </el-card>
    <!-- 查询条件end -->

    <!-- 表格start -->
    <el-table  v-loading="loading" class="t-table" stripe :data="tableData" style="width: 100%">
      <el-table-column fixed="left" align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-popover placement="left" width="500" trigger="click">
            <div class="center">详情数据</div>
            <div class="list">
              <span>身份证(组织机构代码):</span>
              <span class="red ml-10">{{detail.organizatione}}</span>
            </div>
            <div class="list">
              <span>发票号:</span>
              <span class="red ml-10">{{detail.invoiceNo}}</span>
            </div>
            <div class="list">
              <span>处理时间:</span>
              <span class="red ml-10">{{detail.excuteTime}}</span>
            </div>
            <div class="list">
              <span>处理人:</span>
              <span class="red ml-10">{{detail.excutePerson}}</span>
            </div>
            <el-button
              slot="reference"
              type="text"
              @click="getDetail(scope.row.reviewId)"
              size="small"
            >查看详情</el-button>
          </el-popover>

          <el-button
            class="ml-10"
            type="text"
            @click="showDialog(scope.row.reviewId)"
            size="small"
          >{{$t('common.edit')}}</el-button>
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
      <el-table-column prop="car.carModelCode" align="center" label="车型码" width="120"></el-table-column>
      <el-table-column prop="" align="center" label="归属" width="120"></el-table-column>
      <el-table-column prop="car.dealerCode" align="center" label="经销商代码" width="80"></el-table-column>
      <el-table-column prop="car.companyName" align="center" label="所属经销商" width="120"></el-table-column>
      <el-table-column prop="car.qrCode" align="center" label="二维码" width="80"></el-table-column>
      <el-table-column prop="car.simNo" align="center" label="FK控制器SIM卡" width="80"></el-table-column>
      <el-table-column prop="car.vfactory" align="center" label="工厂代码" width="80"></el-table-column>
      <el-table-column prop="car.fuelValue" align="center" label="动力类型" width="80"></el-table-column>
      <el-table-column prop="car.onlineTime" align="center" label="下线(制造日期)" width="160"></el-table-column>
      <el-table-column prop="car.autoFlagStr" align="center" label="录入方式" width="80"></el-table-column>
      <el-table-column prop="car.carDate" align="center" label="录入平台时间/安装时间" width="160"></el-table-column>
      <el-table-column prop="car.tmFkName" align="center" label="终端型号" width="80"></el-table-column>
      <el-table-column prop="car.fkCode" align="center" label="FK控制器ID" width="80"></el-table-column>
      <el-table-column prop="car.salesStatusValue" align="center" label="STD销售状态" width="80"></el-table-column>
      <el-table-column prop="sale.salesDateStr" align="center" label="STD销售日期" width="160"></el-table-column>
      <el-table-column prop="car.aakStatusValue" align="center" label="AAK销售状态" width="80"></el-table-column>
      <el-table-column prop="car.mbSaleTime" align="center" label="AAK销售日期" width="160"></el-table-column>
      <el-table-column prop="car.cph" align="center" label="车牌号" width="80"></el-table-column>
      <el-table-column prop="car.removalTimeStr" align="center" label="出库日期" width="160"></el-table-column>
      <el-table-column prop="detail.engineTypeRear" align="center" label="发动机型号" width="80"></el-table-column>
      <el-table-column prop="car.engine_TYPE_VALUE" align="center" label="发动机类型" width="80"></el-table-column>
      <el-table-column prop="car.engineNumber" align="center" label="发动机号" width="80"></el-table-column>
      <el-table-column prop="car.bsx" align="center" label="变速箱" width="80"></el-table-column>
      <el-table-column prop="car.hq" align="center" label="后桥" width="80"></el-table-column>
      <el-table-column prop="car.qt" align="center" label="长换油" width="80"></el-table-column>
      <el-table-column prop="car.moniterCarType" align="center" label="是否监控车" width="80"></el-table-column>
      <el-table-column prop="car.firstGpsTimeStr" align="center" label="首次有效位置时间" width="160"></el-table-column>
      <el-table-column prop="car.firstAvalidPosition" align="center" label="首次有效位置" width="80"></el-table-column>
      <el-table-column prop="car.lastGpsDate" align="center" label="末次有效位置时间" width="160"></el-table-column>
      <el-table-column prop="car.addressDetail" align="center" label="末次有效位置" width="80"></el-table-column>
      <el-table-column prop="detail.frontAxleFactoryOne" align="center" label="前桥1厂家" width="80"></el-table-column>
      <el-table-column prop="detail.frontAxleTypeOne" align="center" label="前桥1型号" width="80"></el-table-column>
      <el-table-column prop="detail.frontAxleFactoryTwo" align="center" label="前桥2厂家" width="80"></el-table-column>
      <el-table-column prop="detail.frontAxleTypeTwo" align="center" label="前桥2型号" width="80"></el-table-column>
      <el-table-column prop="detail.rearAxleFactoryOne" align="center" label="后桥1厂家" width="80"></el-table-column>
      <el-table-column prop="detail.rearAxleTypeOne" align="center" label="后桥1型号" width="80"></el-table-column>
      <el-table-column prop="detail.rearAxleFactoryTwo" align="center" label="后桥2厂家" width="80"></el-table-column>
      <el-table-column prop="detail.rearAxleTypeTwo" align="center" label="后桥2型号" width="80"></el-table-column>
      <el-table-column prop="controller.lockCarSupportStr" align="center" label="终端支持锁车" width="80"></el-table-column>
      <el-table-column prop="car.isOpenStr" align="center" label="锁车功能状态" width="80"></el-table-column>
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

    <!-- 弹窗start -->
    <el-dialog title="确认解绑该车辆吗？" :visible.sync="bindDialogVisible" width="30%">
      <span class="red">*</span>
      <span>解绑操作将导致APP用户所加的车辆失效和数据丢失，请确认是否进行该操作。</span>

      <el-input
        style="margin-top:10px"
        type="textarea"
        :rows="4"
        placeholder="请输入原因(必填)，不能超过100字"
        v-model="reason"
      ></el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="bindDialogVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="unbindData">{{$t('common.unbind')}}</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗end -->
  </div>
</template>

<script>
import { queryCar } from "@/api/basicInfo/index";

import {
  queryCarPropertyForMaintains,
  queryArea,
  carBindList,
  carBindDetail,
  carUnBind
} from "@/api/business/businessService";

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
      total: 0,
      querys: {
        page_number: 1,
        page_size: 10,
        loading:false,
        business: {},
        car: {},
        controller: {},
        dealer: {},
        detail: {},
        lockInfo: {},
        excuteType: {},
        terminal: {}
      },
      tableData: [],
      detailList: [],
      detail: {},
      activeName: "",
      bindList: [
        { label: "全部", value: null },
        { label: "是", value: 1 },
        { label: "否", value: 0 }
      ],
      statusList: [
        { label: "全部", value: null },
        { label: "已绑定", value: 1 },
        { label: "已解绑", value: 0 }
      ],
      seriesList: [],
      ProvinceList: [],
      cityList: [],
      treeData: [],
      multiValue: "",
      dialogVisible: false,
      bindDialogVisible: false,
      reason: "",
      eviewId: ""
    };
  },
  watch: {},
  mounted() {
    this.getSeriesList();
    this.getProvinceList();
    this.getList();
  },
  methods: {
    unbindData(id) {
      if (!this.reason) {
        this.$message.warning(this.$t("business.reasonAlert"));
        return false;
      }
      this.unBindFn();
    },
    async unBindFn() {
      const params = {
        reviewId: this.reviewId,
        advice: this.reason,
        tbossUserName: "lianxue"
      };
      const re = await carUnBind(params);
      if (re.data.resultCode === 200) {
        this.$message.success("解绑成功");
        this.getList();
      }
    },

    async getDetail(id) {
      const re = await carBindDetail({ reviewId: id });
      this.detail = re.data;
    },
    showDialog(id) {
      this.bindDialogVisible = true;
      this.reviewId = id;
    },

    clear() {},

    async getList() {
      this.loading = true;
      console.log("search");
      const re = await queryCar(this.querys);
       this.loading = false;
      this.tableData = re.data.list;
      this.total = re.data.total;
    },

    async getSeriesList() {
      const re = await queryCarPropertyForMaintains();
      this.seriesList = re.data;
      this.treeData = this.seriesList.map((item, index, arr) => {
        return {
          id: index.toString(),
          label: item
        };
      });
    },
    changeArea() {
      this.querys.cityId = "";
      this.getProvinceList(this.querys.provinceId);
    },
    async getProvinceList(id) {
      const re = await queryArea(id);
      if (id) {
        this.cityList = re.data;
      } else {
        this.ProvinceList = re.data;
      }
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