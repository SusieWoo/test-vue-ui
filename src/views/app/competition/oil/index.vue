<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24"
              class="filter-header mb5">
        <el-form :inline="true"
                 :model="query">
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="query.activityName"
                        placeholder="搜索活动名称" />
            </el-form-item>
          </el-col>
          <el-col :span="18"
                  class="search-btn-group">
            <el-col :span="24">
              <el-form-item class="fr">
                <el-button type="primary"
                           @click="getList">
                  新建活动
                </el-button>
                <el-button type="primary"
                           @click="onEdit(false)">
                  跨活动组别
                </el-button>
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="Data"
                :row-style="{paddingTop: '2px'}"
                :cell-style="{paddingTop: '2px', paddingBottom: '2px'}"
                border>
        <el-table-column prop="bannerIndex"
                         label="活动ID" />
        <el-table-column prop="bannerName"
                         label="活动名称" />
        <el-table-column prop="bannerName"
                         label="报名时间" />
        <el-table-column prop="bannerTypeName"
                         label="活动时间" />
        <el-table-column prop="bannerTypeName"
                         label="当前状态" />
        <el-table-column prop="bannerTypeName"
                         label="创建时间" />
        <el-table-column fixed="right"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="del(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     :hide-on-single-page="false"
                     :current-page="query.page_number"
                     :page-sizes="[10,20,30,50]"
                     :page-size="query.page_size"
                     layout="prev, pager, next"
                     :total="total"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </el-row>
  </div>
</template>


<script>
import { QueryBannerInfo, DelBannerInfo } from '@/api/business/BannerService';

export default {
  name: 'List',
  data () {
    return {
      Data: [],
      total: 0,
      query: {
        type: 1,
        page_number: 1,
        page_size: 10,
      }
    };
  },
  mounted () {
    this.init()
  },
  methods: {
    handleCurrentChange (currentPage) {
      this.query.page_number = currentPage;
      this.getList();
    },
    handleSizeChange (pageSize) {
      this.query.page_size = pageSize;
      this.getList();
    },
    async delBannerInfo (id) {
      await DelBannerInfo(id)
      this.getList();
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
    },
    del (row) {
      this.$confirm('确定删除 ' + row.bannerName + ' banner吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delBannerInfo(row.id)
      }).catch(() => {
      });
    },
    async getList () {
      const params = this.query;
      const res = await QueryBannerInfo(params);
      this.Data = res.data.list;
      this.total = res.data.total;
    },
    init () {
      this.getList();
    }
  },
};
</script>
