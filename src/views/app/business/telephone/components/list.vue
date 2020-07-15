<template>
  <div>
    <el-row>
      <el-col :span="24"
              class="filter-header mb5">
        <el-form :inline="true"
                 :model="query">
          <el-col :span="18">
            <el-form-item>
              <el-input v-model="query.name"
                        clearable
                        :placeholder="$t('business.appConfig.searchTitleKeyword')" />
            </el-form-item>
          </el-col>
          <el-col :span="6"
                  class="search-btn-group">
            <el-col :span="24">
              <el-form-item class="fr">
                <el-button type="primary"
                           @click="getList">
                  {{$t('common.research')}}
                </el-button>
                <el-button type="primary"
                           @click="onEdit()">
                  {{$t('common.create')}}
                </el-button>
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="list"
                :row-style="{paddingTop: '2px'}"
                :cell-style="{paddingTop: '2px', paddingBottom: '2px'}"
                border>
        <el-table-column prop="tel"
                         :label="$t('common.tel')" />

        <el-table-column prop="name"
                         :label="$t('common.name')" />

        <el-table-column v-if="type==='1'"
                         prop="carTypeName"
                         :label="$t('common.carSeries')" />

        <el-table-column v-if="type==='3'"
                         :label="$t('common.image')">
          <template slot-scope="scope">
            <el-image :src="scope.row.imgPath"
                      :preview-src-list="[scope.row.imgPath]"
                      fit="contain" />
          </template>
        </el-table-column>

        <el-table-column fixed="right"
                         :label="$t('common.operate')">
          <template slot-scope="scope">
            <el-button v-if="!(scope.$index ===0) && (list[(scope.$index-1)].bannerType === scope.row.bannerType)"
                       type="text"
                       @click="up(scope.row,scope.$index)">
              {{$t('business.appConfig.moveUp')}}
            </el-button>
            <!-- -->
            <el-button v-if="!(scope.$index === (list.length-1)) && (list[(scope.$index+1)].bannerType === scope.row.bannerType)"
                       type="text"
                       @click="down(scope.row,scope.$index)">
              {{$t('business.appConfig.moveDown')}}
            </el-button>

            <el-button type="text"
                       @click="onEdit(scope.row)">
              {{$t('common.edit')}}
            </el-button>
            <el-button type="text"
                       @click="del(scope.row)">
              {{$t('common.del')}}
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
    <Edit ref="editDialog"
          :open="showModal"
          :type="type"
          @confirm="closeModal" />
  </div>
</template>

<script>
import { queryUrgentCall, delUrgentCall, sortUrgentCall } from '@/api/business/businessService';
import Edit from './edit';

export default {
  name: 'List',
  components: {
    Edit
  },
  props: {
    type: {
      type: String,
      default: '1'
    }
  },
  data () {
    return {
      list: [],
      isEdit: false,
      total: 0,
      showModal: false,
      query: {
        type: 1,
        page_number: 1,
        page_size: 10,
      }
    };
  },
  mounted () {
    this.query.type = this.type
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
    closeModal (pageSize) {
      this.showModal = false;
      this.getList();
    },

    async getSortInsurance (Sort) {
      await sortUrgentCall(Sort)
      this.getList();
    },
    async up (obj, s) {
      let idChange = null;
      let sortChange = null;
      if (!s - 1 < 0) {
        idChange = this.list[s - 1].id;
        sortChange = this.list[s - 1].sort;
      } else {
        return;
      }

      const SortInsurance = {
        id: obj.id,
        sort: obj.sort,
        id_change: idChange,
        sort_change: sortChange
      };
      this.getSortInsurance(SortInsurance);
    },
    async down (obj, s) {
      let idChange = this.list[s + 1].id;
      let sortChange = this.list[s + 1].sort;

      const SortInsurance = {
        id: obj.id,
        sort: obj.sort,
        id_change: idChange,
        sort_change: sortChange
      };
      this.getSortInsurance(SortInsurance);
    },
    onEdit (row) {
      this.showModal = true
      this.$refs.editDialog.toOpen(row);
    },
    async delUrgentCall (id) {
      await delUrgentCall(id)
      this.getList();
      this.$message({
        type: 'success',
        message: '删除成功!'
      });
    },
    del (row) {
      this.$confirm('确定删除 ' + row.name + ' 吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delUrgentCall(row.id)
      }).catch(() => {
      });
    },
    async getList () {
      const params = this.query;
      let res = await queryUrgentCall(params);
      this.list = res.data.list;
      this.total = res.data.total;
    },
    handleTag (type) {
      this.getList()
    }
  },
};
</script>

<style lang="less" scoped>
.el-image {
  height: 40px;
}
</style>