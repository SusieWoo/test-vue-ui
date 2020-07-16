<template>
  <div class="vehicle-manage">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane :label="$t('common.all')" name="all"></el-tab-pane>
      <el-tab-pane :label="$t('business.bindTeam')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('business.unbindHistory')" name="0"></el-tab-pane>
    </el-tabs>

    <!-- 查询条件start -->
    <el-card class="card-panel">
      <el-form :inline="true" :model="querys" label-position="left">
        <el-form-item :label="$t('business.vin')">
          <el-input v-model="querys.vin" :placeholder="$t('business.pvin')" />
        </el-form-item>
        <el-form-item :label="$t('business.phone')">
          <el-input type="number" v-model="querys.phone" :placeholder="$t('business.pphone')" />
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
            <span slot="item">
              <el-form-item :label="$t('business.firstBind')">
                <el-select
                  v-model="querys.firstBind"
                  class="search-item"
                  :placeholder="$t('common.select')"
                >
                  <el-option
                    v-for="item in bindList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="处理时间">
                <el-date-picker
                  v-model="querys.excuteStart"
                  value-format="yyyy-MM-dd"
                  class="search-item"
                  type="date"
                  :placeholder="$t('common.beginDate')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="至">
                <el-date-picker
                  v-model="querys.excuteEnd"
                  class="search-item"
                  value-format="yyyy-MM-dd"
                  type="date"
                  :placeholder="$t('common.endDate')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('business.carSeries')">
                <multiple-select :width="160" isLabelData :data="treeData" v-model="querys.series"></multiple-select>
              </el-form-item>
              <el-form-item :label="$t('business.carType')">
                <el-select v-model="querys.type" multiple class="search-item" placeholder="请选择车系">
                  <el-option
                    v-for="(item,index) in seriesList "
                    :key="index"
                    :label="item"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('business.discharge')">
                <el-input v-model="querys.dischargeId" placeholder="请选择排放" />
              </el-form-item>

              <el-form-item :label="$t('business.arStatus')">
                <el-select v-model="querys.arStatus" class="search-item" placeholder="请选择当前车辆状态">
                  <el-option
                    v-for="item in bindList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <area-select
                :aclass="'search-item'"
                :provinceId.sync="querys.provinceId"
                :cityId.sync="querys.cityId"
              ></area-select>
            </span>
          </template>
        </com-search>
      </el-form>
    </el-card>
    <!-- 查询条件end -->

    <!-- 表格start -->
    <el-table v-loading="loading" class="t-table" stripe :data="tableData" style="width: 100%">
      <el-table-column prop="date" align="center" label="事项" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.excuteType==1?$t('common.bind'):scope.row.excuteType==0?$t('common.unbind'):''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="carVin" align="center" label="VIN" width="180"></el-table-column>
      <el-table-column prop="carStatus" align="center" label="车辆当前状态" width="120"></el-table-column>
      <el-table-column prop="firstBind" align="center" label="车辆首次绑定" width="120">
        <template slot-scope="scope" align="center">
          <span>{{scope.row.firstBind==1?'是':scope.row.firstBind==0?'否':''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" align="center" label="车队" width="120"></el-table-column>
      <el-table-column prop="seriesName" align="center" label="车系" width="80"></el-table-column>
      <el-table-column prop="modelName" align="center" label="车型" width="120"></el-table-column>
      <el-table-column prop="dischargeName" align="center" label="排放" width="80"></el-table-column>
      <el-table-column prop="provinceName" align="center" label="所属省" width="80"></el-table-column>
      <el-table-column prop="cityName" align="center" label="所属市" width="80"></el-table-column>
      <el-table-column prop="excutePerson" align="center" label="处理人" width="80"></el-table-column>
      <el-table-column prop="excuteTime" align="center" label="处理时间" min-width="160"></el-table-column>
      <el-table-column fixed="right" align="center" label="操作" min-width="120">
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
            v-if="scope.row.excuteType==1"
            type="text"
            @click="showDialog(scope.row.reviewId)"
            size="small"
          >{{$t('common.unbind')}}</el-button>
        </template>
      </el-table-column>
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
import {
  queryCarPropertyForMaintains,
  queryArea,
  carBindList,
  carBindDetail,
  carUnBind
} from "@/api/business/businessService";

import pagination from "@/components/pagination";
import areaSelect from "@/components/areaSelect";
import multipleSelect from "@/components/multipleSelect";
import comSearch from "@/components/comSearch";

export default {
  components: {
    multipleSelect,
    comSearch,
    pagination,
    areaSelect
  },
  data() {
    return {
      total: 0,
      querys: {
        page_number: 1,
        page_size: 10,
        carStatus: "",
        carVin: "",
        cityId: "",
        dischargeId: "",
        excuteEnd: "",
        excuteStart: "",
        excuteType: "",
        firstBind: "",
        model: "",
        phone: "",
        provinceId: "",
        series: ""
      },
      loading: false,
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
      if (re.resultCode === 200) {
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

    clear() {
      this.querys = {
        page_number: 1,
        page_size: 10,
        carStatus: "",
        carVin: "",
        cityId: "",
        dischargeId: "",
        excuteEnd: "",
        excuteStart: "",
        excuteType: "",
        firstBind: "",
        model: "",
        phone: "",
        provinceId: "",
        series: ""
      };
      this.getList();
    },
    async getList() {
      console.log("search", this.querys);
      this.loading = true;
      const re = await carBindList(this.querys);
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
.vehicle-manage {
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