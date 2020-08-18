<template>
  <div class="vehicle-manage">
    <el-tabs v-model="excuteType" type="card">
      <el-tab-pane :label="$t('common.all')" name="all"></el-tab-pane>
      <el-tab-pane :label="$t('business.bindTeam')" name="1"></el-tab-pane>
      <el-tab-pane :label="$t('business.unbindHistory')" name="0"></el-tab-pane>
    </el-tabs>
    <!-- 查询条件start -->
    <el-card class="card-panel">
      <el-form :inline="true" :model="querys">
        <el-form-item :label="$t('business.vin')">
          <el-input v-model="querys.vin" :placeholder="$t('business.pvin')" />
        </el-form-item>
        <el-form-item :label="$t('business.phone')">
          <el-input type="number" v-model="querys.phone" :placeholder="$t('business.pphone')" />
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
              <el-form-item :label="$t('business.processingTime')">
                <el-date-picker
                  v-model="range"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  :start-placeholder="$t('common.beginDate')"
                  :end-placeholder="$t('common.endDate')"
                ></el-date-picker>
              </el-form-item>

              <el-form-item :label="$t('business.arStatus')">
                <el-select v-model="querys.arStatus" class="search-item" :placeholder="$t('business.scar')">
                  <el-option
                    v-for="item in statusList"
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
              <car-linkage
                :model.sync="querys.series"
                :vehicle.sync="querys.type"
                :discharge.sync="querys.dischargeId"
              />
            </span>
          </template>
        </com-search>
      </el-form>
    </el-card>
    <!-- 查询条件end -->

    <!-- 表格start -->
    <el-table v-loading="loading" class="t-table" stripe :data="tableData" style="width: 100%">
      <el-table-column prop="date" align="center" :label="$t('business.item')" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.excuteType==1?$t('common.bind'):scope.row.excuteType==0?$t('common.unbind'):''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="carVin" align="center" label="VIN" width="180"></el-table-column>
      <el-table-column prop="carStatus" align="center" :label="$t('business.current')" width="120"></el-table-column>
      <el-table-column
        prop="firstBind"
        align="center"
        :label="$t('business.firstBind')"
        width="120"
      >
        <template slot-scope="scope" align="center">
          <span>{{scope.row.firstBind==1?$t('common.yes'):scope.row.firstBind==0?$t('common.no'):''}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="teamName" align="center" :label="$t('business.team')" width="120"></el-table-column>
      <el-table-column
        prop="seriesName"
        align="center"
        :label="$t('business.carSeries')"
        width="80"
      ></el-table-column>
      <el-table-column prop="modelName" align="center" :label="$t('business.carType')" width="120"></el-table-column>
      <el-table-column
        prop="dischargeName"
        align="center"
        :label="$t('business.discharge')"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="provinceName"
        align="center"
        :label="$t('business.province')"
        width="80"
      ></el-table-column>
      <el-table-column prop="cityName" align="center" :label="$t('business.city')" width="80"></el-table-column>
      <el-table-column
        prop="excutePerson"
        align="center"
        :label="$t('business.opearator')"
        width="80"
      ></el-table-column>
      <el-table-column
        prop="excuteTime"
        align="center"
        :label="$t('business.processingTime')"
        min-width="160"
      ></el-table-column>
      <el-table-column fixed="right" align="center" :label="$t('common.operate')" min-width="120">
        <template slot-scope="scope">
          <el-popover placement="left" width="500" trigger="click">
            <div class="center">{{$t('business.detailData')}}</div>
            <div class="list">
              <span>{{$t('business.idCard')}}({{$t('business.oCode')}}):</span>
              <span class="red ml-10">{{detail.organizatione}}</span>
            </div>
            <div class="list">
              <span>{{$t("business.rNumber")}}:</span>
              <span class="red ml-10">{{detail.invoiceNo}}</span>
            </div>
            <div class="list">
              <span>{{$t('business.processingTime')}}:</span>
              <span class="red ml-10">{{detail.excuteTime}}</span>
            </div>
            <div class="list">
              <span>{{$t('business.opearator')}}:</span>
              <span class="red ml-10">{{detail.excutePerson}}</span>
            </div>

            <el-button
              slot="reference"
              type="text"
              @click="getDetail(scope.row.reviewId)"
              size="small"
            >{{$t('business.viewDetail')}}</el-button>
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
    <el-dialog :title="$t('business.confirm.unbind')" :visible.sync="bindDialogVisible" width="30%">
      <span class="red">*</span>
      <span>{{$t('business.confirm.unbindText')}}</span>

      <el-input
        style="margin-top:10px"
        type="textarea"
        :rows="4"
        :placeholder="$t('business.confirm.placehoder')"
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
  queryArea,
  carBindList,
  carBindDetail,
  carUnBind
} from "@/api/business/businessService";

const BaseData = require('@/data');
import pagination from "@/components/pagination";
import areaSelect from "@/components/areaSelect";
import carLinkage from "@/components/carLinkage/carLinkage";
import comSearch from "@/components/comSearch";
import { mapGetters } from "vuex";
export default {
  components: {
    comSearch,
    pagination,
    areaSelect,
    carLinkage
  },
  computed: {
    ...mapGetters(["getName"]),
    bindList() {
      return [
        { label: this.$t("common.all"), value: null },
        { label: this.$t("common.yes"), value: 1 },
        { label: this.$t("common.no"), value: 0 }
      ];
    },
    statusList() {
      return [
        { label: this.$t("common.all"), value: null },
        { label: this.$t("common.hasBind"), value: 1 },
        { label: this.$t("common.hasUnbind"), value: 0 }
      ];
    }
  },
  data() {
    return {
      total: 0,
      excuteType: "all",
      querys: {
        page_number: 1,
        page_size: 10
      },
      loading: false,
      range: [],
      tableData: [],
      detailList: [],
      detail: {},
      activeName: "",
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
        tbossUserName: this.getName
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
        carStatus: null,
        carVin: null,
        cityId: null,
        dischargeId: null,
        excuteEnd: null,
        excuteStart: null,
        excuteType: null,
        firstBind: null,
        model: null,
        phone: null,
        provinceId: null,
        series: null
      };
      this.getList();
    },
    async getList() {
      if (this.range.length > 0) {
        this.querys.excuteStart = this.range[0];
        this.querys.excuteEnd = this.range[1];
      }
      this.querys.excuteType =
        this.excuteType === "all" ? null : this.excuteType;
      this.loading = true;
      const re = await carBindList(this.querys);
      this.loading = false;
      this.tableData = re.data.list;
      this.total = re.data.total;
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