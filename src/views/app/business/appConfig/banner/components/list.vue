<template>
  <div>
    <el-row>
      <el-col :span="24"
              class="filter-header mb5">
        <el-form :inline="true"
                 :model="query">
          <el-col :span="18">
            <el-form-item label="标题关键字">
              <el-input v-model="query.name"
                        placeholder="搜索标题关键字" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="query.bannerStatus">
                <el-option v-for="item in bannerStatus"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item label="类型">
              <el-select v-model="query.bannerSetting">
                <el-option v-for="item in bannerTypeList"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6"
                  class="search-btn-group">
            <el-col :span="24">
              <el-form-item class="fr">
                <el-button type="primary"
                           @click="getDriver">
                  查询
                </el-button>
                <el-button type="primary"
                           @click="edit">
                  新建
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
        <el-table-column label="图片"
                         class="img">
          <template slot-scope="scope">
            <img :src="scope.row.imgPath"
                 :alt="scope.row.name"
                 style="height:40px;" />
          </template>
        </el-table-column>
        <el-table-column fixed="right"
                         label="操作">
          <template slot-scope="scope">
            <!--   -->
            <el-button v-if="!(scope.$index ===0) && (Data[(scope.$index-1)].bannerType === scope.row.bannerType)"
                       type="text"
                       @click="up(scope.row,scope.$index)">
              上移
            </el-button>
            <!-- -->
            <el-button v-if="!(scope.$index === (Data.length-1)) && (Data[(scope.$index+1)].bannerType === scope.row.bannerType)"
                       type="text"
                       @click="down(scope.row,scope.$index)">
              下移
            </el-button>
            <el-button type="text"
                       @click="on(scope)">
              {{scope.row.bannerStatus==='0'?'上线':'下线'}}
            </el-button>
            <el-button type="text"
                       @click="edit(scope)">
              编辑
            </el-button>
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
    <Edit :id="editId"
          :open="showModal"
          :type="type"
          @confirm="closeModal" />
  </div>
</template>

<script>
import { QueryBannerInfo, MoveBannerInfo, DelBannerInfo } from '@/api/business/BannerService';
import { basedata } from '@/api/public/PublicService';
import Edit from './edit';

export default {
  name: 'List',
  components: {
    Edit
  },
  data () {
    return {
      Data: [],
      type: 1,
      showModal: false,
      query: {
        type: 1,
        page_number: 1,
        page_size: 10,
      },
      bannerStatus: [{ key: '1', value: '上线' }, { key: '0', value: '下线' }],
      bannerTypeList: []
    };
  },
  mounted () {
    this.init()
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
    closeModal (pageSize) {
      this.showModal = false;
    },
    async getSortInsurance (Sort) {
      await MoveBannerInfo(Sort)
      this.getDriver();
    },
    async up (obj, s) {
      const Id = obj.id;
      let idChange = null;
      let typeChange = null;
      if (!s - 1 < 0) {
        idChange = this.Data[s - 1].id;
        typeChange = this.Data[s - 1].bannerType;
      } else {
        return;
      }

      const SortInsurance = {
        moveToType: obj.bannerType,
        moveId: Id,
        moveType: typeChange,
        moveToId: idChange
      };
      this.getSortInsurance(SortInsurance);
    },
    async down (obj, s) {
      const Id = obj.id;
      let idChange = this.Data[s + 1].id;
      let typeChange = this.Data[s + 1].bannerType;

      const SortInsurance = {
        moveToType: obj.bannerType,
        moveId: Id,
        moveType: typeChange,
        moveToId: idChange
      };
      this.getSortInsurance(SortInsurance);
    },
    async on (row) {
      const res = await QueryBannerInfo(this.query)
      console.log(row, res)
    },
    edit (row) {
      this.showModal = true
    },
    async delBannerInfo (id) {
      await DelBannerInfo(id)
      this.getDriver();
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
    async getDriver () {
      const params = this.query;
      if (this.query.type === 2 && params.bannerType && params.bannerType === 1) {
        params.bannerType = 6;
      }
      const res = await QueryBannerInfo(params);
      this.Data = res.data.list;
      this.total = res.data.total;
    },
    /*
   * 类型
   *  type：A （车队搜索下拉，车队新建，1~5，没7，没8）
   *  type：B （司机搜索下拉，1~8，都要有）（前端特殊处理，选1传6）
   * */
    async getStyle () {
      let type = null;
      switch (this.type) {
        case 1: type = 'A';
          break;
        case 2: type = 'B';
          break;
        default: type = 'A';
      }
      const res = await basedata({ type: type, code: 'BAN1' })
      this.bannerTypeList = res.data.list;
    },
    handleTag (type) {
      this.type = type
      this.query.type = this.type
      this.getDriver()
      this.getStyle()
    },
    init () {
      this.getDriver();
      this.getStyle();
    }
  },
};
</script>

<style lang="less" scoped>
el-table-column.img {
  text-align: center;
  image {
    height: 50px;
  }
}
</style>