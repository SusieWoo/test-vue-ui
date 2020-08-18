<template>
  <div>
    <el-row>
      <el-col :span="24" class="filter-header mb5">
        <el-form :inline="true" :model="query">
          <el-col :span="16">
            <el-form-item>
              <car-linkage
                :model.sync="query.carSerise"
                :vehicle.sync="query.carModel"
                :discharge.sync="query.dischargeId"
              ></car-linkage>
            </el-form-item>
            <el-form-item :label="$t('business.care.userTel')">
              <el-input v-model="query.userTel" :placeholder="$t('business.care.userTelPla')" />
            </el-form-item>
            <el-form-item :label="$t('business.care.uploadTime')">
              <el-date-picker
                v-model="query.uploadTimeStart"
                value-format="yyyy-MM-dd"
                class="search-item"
                type="date"
                :placeholder="$t('common.beginDate')"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="至">
              <el-date-picker
                v-model="query.uploadTimeEnd"
                class="search-item"
                value-format="yyyy-MM-dd"
                type="date"
                :placeholder="$t('common.endDate')"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="getList">{{$t('common.search')}}</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-table
        :data="list"
        :row-style="{paddingTop: '2px'}"
        :cell-style="{paddingTop: '2px', paddingBottom: '2px'}"
        border
      >
        <el-table-column prop="userTel" :label="$t('business.care.userTel')" />

        <el-table-column prop="carSerise" :label="$t('common.name')" />

        <el-table-column prop="carModel" :label="$t('common.carSeries')" />

        <el-table-column prop="dischargeName" :label="$t('common.carModel')" />

        <el-table-column prop="uploadTime" :label="$t('common.discharge')" />


        <el-table-column fixed="right" :label="$t('common.operate')">
          <template slot-scope="scope">

            <el-button type="text" @click="onEdit(scope.row)">{{$t('common.edit')}}</el-button>

          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        :hide-on-single-page="false"
        :current-page="query.page_number"
        :page-sizes="[10,20,30,50]"
        :page-size="query.page_size"
        layout="prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
</template>

<script>
import carLinkage from "@/components/carLinkage/carLinkage.vue";
import {
  callCenter
} from "@/api/business/businessService";

export default {
  name: "List",
  components: {
    carLinkage
  },
  props: {
    type: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      list: [],
      isEdit: false,
      total: 0,
      showModal: false,
      query: {
        page_number: 1,
        page_size: 10,
        chexing: "",
        chexi: "",
        paifang: ""
      }
    };
  },
  mounted() {
    this.query.type = this.type;
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.query.page_number = currentPage;
      this.getList();
    },
    handleSizeChange(pageSize) {
      this.query.page_size = pageSize;
      this.getList();
    },


    onEdit(row) {
      this.showModal = true;
      this.$refs.editDialog.toOpen(row);
    },

    async getList() {
      const params = this.query;
      let res = await callCenter(params);
      this.list = res.data.list;
      this.total = res.data.total;
    }



  }
};
</script>

<style lang="less" scoped>
.el-image {
  height: 40px;
}
</style>