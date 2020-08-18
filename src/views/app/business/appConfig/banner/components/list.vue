<template>
  <div>
    <el-row>
      <el-col :span="24"
              class="filter-header mb5">
        <el-form :inline="true"
                 :model="query">
          <el-col :span="18">
            <el-form-item :label="$t('business.appConfig.titleKeyword')">
              <el-input v-model="query.name"
                        clearable
                        :placeholder="$t('business.appConfig.searchTitleKeyword')" />
            </el-form-item>
            <el-form-item :label="$t('common.status')">
              <el-select v-model="query.bannerStatus"
                         clearable
                         :placeholder="$t('common.placeSelect')">
                <el-option v-for="item in bannerStatus"
                           :key="item.key"
                           :label="item.value"
                           :value="item.key" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('common.type')">
              <el-select v-model="query.bannerType"
                         clearable
                         :placeholder="$t('common.placeSelect')">
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
                           @click="getList">
                  {{$t('common.research')}}
                </el-button>
                <el-button type="primary"
                           @click="onEdit(false)">
                  {{$t('common.create')}}
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
                         :label="$t('business.appConfig.index')" />
        <el-table-column prop="bannerStatus"
                         :label="$t('common.status')">
          <template slot-scope="scope">
            {{scope.row.bannerStatus==='1'?$t('common.online'):$t('common.offline')}}
          </template>
        </el-table-column>
        <el-table-column prop="bannerName"
                         :label="$t('common.name')" />
        <el-table-column prop="bannerTypeName"
                         :label="$t('common.type')" />
        <el-table-column :label="$t('common.image')">
          <template slot-scope="scope">
            <el-image :src="scope.row.imgPath"
                      :preview-src-list="[scope.row.imgPath]"
                      fit="contain" />
          </template>
        </el-table-column>
        <el-table-column fixed="right"
                         :label="$t('common.operate')">
          <template slot-scope="scope">
            <el-button v-if="!(scope.$index ===0) && (Data[(scope.$index-1)].bannerType === scope.row.bannerType)"
                       type="text"
                       @click="up(scope.row,scope.$index)">
              {{$t('business.appConfig.moveUp')}}
            </el-button>
            <!-- -->
            <el-button v-if="!(scope.$index === (Data.length-1)) && (Data[(scope.$index+1)].bannerType === scope.row.bannerType)"
                       type="text"
                       @click="down(scope.row,scope.$index)">
              {{$t('business.appConfig.moveDown')}}
            </el-button>
            <el-button type="text"
                       @click="onlineNot(scope.row)">
              {{scope.row.bannerStatus==='0'?$t('common.online'):$t('common.offline')}}
            </el-button>
            <el-button type="text"
                       @click="onEdit(true,scope.row)">
              {{$t('common.edit')}}
            </el-button>
            <el-button type="text"
                       @click="del(scope.row)">
              {{$t('common.del')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="query.page_number"
        :limit.sync="query.page_size"
        @pagination="getList"
    />
    </el-row>
    <Edit
          ref="editDialog"
          :open="showModal"
          :type="type"
          @confirm="closeModal" />
  </div>
</template>

<script>
import { QueryBannerInfo, MoveBannerInfo, DelBannerInfo, UpdateBannerOnline } from '@/api/business/BannerService';
import { BaseData } from '@/data'
import pagination from '@/components/pagination';
import { basedata } from '@/api/public/PublicService';
import Edit from './edit';

export default {
  name: 'List',
  components: {
    Edit,
    pagination
  },
  data () {
    return {
      Data: [],
      type: 1,
      isEdit: false,
      total: 0,
      showModal: false,
      query: {
        type: 1,
        page_number: 1,
        page_size: 10,
      },
      bannerTypeList: []
    };
  },
  computed: {
    bannerStatus() {
        return BaseData.onOrOff(this)
      } ,
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
    closeModal (pageSize) {
      this.showModal = false;
      this.getList();
    },
    async getSortInsurance (Sort) {
      await MoveBannerInfo(Sort)
      this.getList();
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
    async upOrDown (id, status) {
      await UpdateBannerOnline({
        id: id,
        banner_status: status
      })
      this.getList();
      this.$message({
        type: 'success',
        message: `${this.$t('common.tips.operateSuccess')}!`
      });
    },
    onlineNot (row) {
      let status = '1';
      let word = this.$t('business.confirm.onLine');
      if (row.bannerStatus === '1') {
        status = '0';
        word = this.$t('business.confirm.offLine')
      }
      this.$confirm(word , this.$t('common.notice'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.upOrDown(row.id, status)
      }).catch(() => {
      });
    },
    onEdit (isEdit, row) {
      this.showModal = true
      this.$refs.editDialog.toOpen(isEdit, row, this.type);
    },
    async delBannerInfo (id) {
      await DelBannerInfo(id)
      this.getList();
      this.$message({
        type: 'success',
        message: 'common.tips.delSuccess'
      });
    },
    del (row) {
      this.$confirm(`${this.$t('common.toDel')}` + row.bannerName + ' ？', this.$t('common.notice'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.delBannerInfo(row.id)
      }).catch(() => {
      });
    },
    async getList () {
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
      this.getList()
      this.getStyle()
    },
    init () {
      this.getList();
      this.getStyle();
    }
  },
};
</script>

<style lang="less" scoped>
.el-image {
  height: 40px;
}
</style>