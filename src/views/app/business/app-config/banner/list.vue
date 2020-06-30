<template>
  <div class="banner">
    <div class="sdf">
      {{msg}}
    </div>
    <el-table :data="Data"
              :row-style="{paddingTop: '2px'}"
              :cell-style="{paddingTop: '2px', paddingBottom: '2px'}"
              border>
      <el-table-column prop="bannerIndex"
                       label="位置" />
      <el-table-column prop="bannerStatus"
                       label="状态">
        <template slot-scope="scope">
          {{scope.row.bannerStatus==='1'?'上线':'下线'}}
        </template>
      </el-table-column>
      <el-table-column prop="bannerName"
                       label="名称" />
      <el-table-column prop="bannerTypeName"
                       label="类型" />
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.imgPath"
               :alt="scope.row.name"
               style="max-height:100px" />
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     @click.native.prevent="delete(scope.row)">
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
  </div>
</template>

<script>
import { QueryBannerInfo } from '@/api/business/BannerService';

export default {
  name: 'List',
  props: {
    msg: {
      type: String,
      default: '',
    }
  },
  data () {
    return {
      Data: [],
      query: {
        page_number: 1,
        page_size: 10,
      },
      bannerStatus: [{ key: '1', value: '上线' }, { key: '0', value: '下线' }]
    };
  },
  mounted () {
    this.getDriver();
  },
  methods: {
    handleCurrentChange (currentPage) {
      this.query.page_number = currentPage;
      this.getDriver();
    },
    handleSizeChange (pageSize) {
      this.query.page_size = pageSize;
      this.getDriver();
    },
    async delete (row) {
      const res = await QueryBannerInfo(row.id)
      console.log(res)
    },
    async getDriver () {
      const params = {
        page_size: this.query.page_size,
        page_number: this.query.page_number,
        type: this.msg
      }
      const res = await QueryBannerInfo(params)
      this.Data = res.data.list;
      this.total = res.data.total;
    },
    beauty (num) {
      let filter = 'query' + num;
      this[filter].type = num;
      this[filter].bannerType = this[filter].bannerSetting;
      let params = this[filter];
      delete params.bannerSetting;
      return params
    },
    async getJson (num, params) {
      const data = await QueryBannerInfo(params).data;
      this['mydata' + num] = data.list;
      this['preTolal' + num] = (this['pageIndex' + num] - 1) * this['pageSize' + num];
      this['total' + num] = data.total;
    },
    async getList (num) {
      let params = this.beauty(num);
      if (num === 1) {
        this.getJson(num, params)
      } else if (num === 2) {
        if (params.bannerType === 1) {
          params.bannerType = 6;
        }
        this.getJson(num, params)
      } else {
        this.$message({
          message: '获取列表数据失败',
          type: 'warning'
        })
      }
    },
    init (currentPage) {
      this.currentPage = currentPage;
    }
  },
};
</script>

<style scoped>
.qqq {
  color: blue;
}
</style>