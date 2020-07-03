<template>
  <div class="vehicle-manage">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="all"></el-tab-pane>
      <el-tab-pane label="绑定车队" name="1"></el-tab-pane>
      <el-tab-pane label="解绑记录" name="0"></el-tab-pane>
    </el-tabs>
    <el-card class="card-panel">
      <el-form :inline="true" :model="querys" label-position="left">
        <el-form-item label="车辆VIN">
          <el-input v-model="querys.vin" placeholder="请输入车辆VIN" />
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input v-model="querys.phone" placeholder="请输入用户手机号" />
        </el-form-item>
        <el-form-item label="发动机号">
          <el-input v-model="querys.engineNum" placeholder="请输入发动机号" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
        </el-form-item>

        <com-search>
          <template>
            <span slot="item">
              <el-form-item label="车辆首次绑定">
                <el-select v-model="querys.firstBind" class="search-item" placeholder="请选择">
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
                  class="search-item"
                  type="date"
                  placeholder="选择起始日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="至">
                <el-date-picker
                  v-model="querys.excuteEnd"
                  class="search-item"
                  type="date"
                  placeholder="选择截止日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="车系">
                <multiple-select :width="160" isLabelData :data="treeData" v-model="querys.series"></multiple-select>
              </el-form-item>
              <el-form-item label="车型">
                <el-select v-model="querys.type" multiple class="search-item" placeholder="请选择车系">
                  <el-option
                    v-for="(item,index) in seriesList "
                    :key="index"
                    :label="item"
                    :value="index"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="排放：">
                <el-input v-model="querys.dischargeId" placeholder="请选择排放" />
              </el-form-item>

              <el-form-item label="当前车辆状态">
                <el-select v-model="querys.arStatus" class="search-item" placeholder="请选择当前车辆状态">
                  <el-option
                    v-for="item in bindList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="所属省：">
                <el-select
                  v-model="querys.provinceId"
                  @change="changeArea"
                  class="search-item"
                  placeholder="请选择省"
                >
                  <el-option
                    v-for="item in ProvinceList "
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="市：">
                <el-select v-model="querys.cityId" class="search-item" placeholder="请选择市">
                  <el-option
                    v-for="item in cityList "
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </span>
          </template>
        </com-search>
      </el-form>
    </el-card>


  </div>
</template>

<script>
import {
  queryCarPropertyForMaintains,
  queryArea
} from "@/api/business/businessService";

import multipleSelect from "@/components/multipleSelect";
import comSearch from "@/components/comSearch";
export default {
  components: {
    multipleSelect,
    comSearch
  },
  data() {
    return {
      activeName: "",
      querys: {
        provinceId: ""
      },
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
      multiValue: ""
    };
  },
  watch: {},
  mounted() {
    this.getSeriesList();
    this.getProvinceList();
  },
  methods: {
    handleClick(tab, event) {
      console.log(this.multiValue);
    },
    getList() {},
    async getSeriesList() {
      const re = await queryCarPropertyForMaintains();
      this.seriesList = re.data;
      this.treeData = this.seriesList.map((item, index, arr) => {
        return {
          id: index.toString(),
          label: item
        };
      });
      // console.log(this.treeData )
    },
    changeArea() {
      // console.log(this.querys.provinceId);
      this.querys.cityId = ""
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
.collapse-select {
  padding: 0 20px;
}
</style>