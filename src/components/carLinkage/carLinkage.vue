<template>
  <div class="carLinkageBox">
    <div class="el-form-item">
      <div class="el-form-item__label">{{$t('common.carSeries')}}：</div>
      <div>
        <multiple-select :width="160" :data="modelList" v-model="chexing" @input="getVehicleList"></multiple-select>
      </div>
    </div>
    <div class="el-form-item">
      <div class="el-form-item__label">{{$t('common.carModel')}}：</div>
      <div>
        <multiple-select :width="160" :data="vehicleList" v-model="chexi" @input="getDischargeList"></multiple-select>
      </div>
    </div>
    <div class="el-form-item">
      <div class="el-form-item__label">{{$t('common.discharge')}}：</div>
      <div>
        <multiple-select :width="160" :data="dischargeList" v-model="paifang"></multiple-select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import multipleSelect from "../multipleSelect.vue";
import { Component, Watch, PropSync, Vue } from "vue-property-decorator";
import {
  querySeriesList,
  queryCarTypeList,
  queryEmissionList
} from "@/api/business/businessService.ts";

interface propList {
  id: string;
  label: string;
}

@Component({
  components: { multipleSelect }
})
export default class Pageination extends Vue {
  @PropSync("model", { type: String }) private chexing!: String;

  @PropSync("vehicle", { type: String }) private chexi!: String;

  @PropSync("discharge", { type: String }) private paifang!: String;

  private modelList: Array<propList> = [];
  private async getModelList(): Promise<any> {
    const res = await querySeriesList();
    this.modelList = this.arrOpen(res.data);
    return res;
  }

  private vehicleList: Array<propList> = [];
  private async getVehicleList(val: String): Promise<any> {
    this.vehicleList = [];
    this.dischargeList = [];
    if (!val) {
      return false;
    }
    const res = await queryCarTypeList({ carSeries: val });
    this.vehicleList = this.arrOpen(res.data);
    return res;
  }

  private dischargeList: Array<propList> = [];
  private async getDischargeList(val: String): Promise<any> {
    this.dischargeList = [];
    if (!val) {
      return false;
    }
    const res = await queryEmissionList({
      carSeries: this.chexing,
      carType: val
    });
    this.dischargeList = this.arrOpen(res.data);
    return res;
  }

  private arrOpen(arr: Array<string>): Array<propList> {
    const peak = arr.map((item: string) => {
      return { id: item, label: item };
    });
    return peak;
  }

  created() {
    this.getModelList();
  }
}
</script>

<style scoped lang="less">
.carLinkageBox {
  display: flex;
  flex-direction: row;
  div {
    line-height: 36px;
    height: 36px;
  }
  .el-form-item{
    display: flex;
  }
}
</style>
