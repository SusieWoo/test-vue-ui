<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="filter-header mb5">
        <el-form :inline="true" :model="query">
          <el-col :span="6">
            <el-form-item>
              <el-input :placeholder="$t('oil.activityName')" v-model="query.activityName" class="input-with-select" clearable>
                <el-button slot="append" icon="el-icon-search" @click="search"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18"
                  class="search-btn-group">
            <el-col :span="24">
              <el-form-item class="fr">
                <el-button type="primary" @click="careateActivity">
                  {{$t('oil.newActivity')}}
                </el-button>
                <el-button type="primary" @click="crossGroup">
                  {{$t('oil.crossGroup')}}
                </el-button>
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="Data" :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}" border>
        <el-table-column prop="activityId" :label="$t('oil.activityId')" width="70" fixed="left"/>
        <el-table-column prop="activityName" :label="$t('oil.activity')" width="200"/>
        <el-table-column :label="$t('oil.registrationTime')" width="270">
          <template slot-scope="scope">
            {{scope.row.enrollStartDate + " 至 " + scope.row.enrollEndDate}}
          </template>
        </el-table-column>
        <el-table-column :label="$t('oil.activityTime')" width="270">
          <template slot-scope="scope">
            {{scope.row.enrollStartDate + " 至 " + scope.row.enrollEndDate}}
          </template>
        </el-table-column>
        <el-table-column prop="bannerTypeName" :label="$t('oil.currentState')" width="80">
          <template slot-scope="scope">
            {{scope.row.activateFlag==='1'?scope.row.activityStatusName:$t('oil.deactivated')}}
          </template>
        </el-table-column>
        <el-table-column prop="activitCreateDate" :label="$t('oil.createTime')" width="170"/>
        <el-table-column prop="activitCreatePerson" :label="$t('oil.founder')" width="150"/>
        <el-table-column fixed="right" :label="$t('oil.operation')" width="310">
          <template slot-scope="scope">
            <el-button type="text" @click="look(scope.row)">{{$t('oil.see')}}</el-button>
            <el-button type="text" @click="update(scope.row)">{{$t('oil.edit')}}</el-button>
            <el-button type="text" @click="recall(scope.row, 'showStatus')" v-if="scope.row.showStatus==='1'">{{$t('oil.withdraw')}}</el-button>
            <el-button type="text" @click="recall(scope.row, 'showStatus')" v-if="scope.row.showStatus==='0' && scope.row.activityStatus !== '0' && scope.row.activateFlag !== '0'" >{{$t('oil.launch')}}</el-button>
            <el-button type="text" @click="recall(scope.row, 'activateFlag')">{{scope.row.activateFlag==='1'?$t("oil.unEnable"):$t("oil.enable")}}</el-button>
            <el-button type="text" @click="live(scope.row)">{{$t('oil.activityData')}}</el-button>
            <el-button type="text" @click="rule(scope.row)">{{$t('oil.filterRule')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.page_number" :page-sizes="[10, 20, 30, 40]" :page-size="query.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"/>
    </el-row>
  </div>
</template>


<script>
import { queryList, updOilWearActivityStatus } from '@/api/oil/oilService';

export default {
  name: 'List',
  data () {
    return {
      Data: [],
      total: 0,
      query: {
        activityName: '',
        page_number: 1,
        page_size: 10,
      }
    };
  },
  mounted () {
    this.getList()
  },
  methods: {
    search () {
      this.query.page_number = 1
      this.getList()
    },
    // 新建活动
    careateActivity () {
      this.$router.push({
        path: '/competition/oilnew'
      })
    },
    // 夸活动组别
    crossGroup () {
      this.$router.push({
        path: '/competition/announcement'
      })
    },
    recall (row,name) {
      let self = this
      let title = ''
      let id = ''
      if (name === 'showStatus') {
        title = row[name] === '1' ? self.$t('oil.withdraw') : self.$t('oil.launch')
        id = 1
      } else {
        title = row[name] === '1' ? self.$t('oil.unEnable') : self.$t('oil.enable')
        id = 2
      }
      self.$confirm(self.$t('oil.confirmation') + ' ' + title + '？', title, {
        confirmButtonText: self.$t('common.confirm'),
        cancelButtonText: self.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        let status = row[name] === '1' ? '0' : '1'
        updOilWearActivityStatus(id, row.activityId, status).then(function () {
          self.$message.success(title + ' ' + self.$t('oil.success') + ' !');
          self.search()
        })
      }).catch(() => {
      })
    },
    look (row) {
      this.$router.push({
        path: '/competition/oilnew/look',
        query: {
          infos: row,
          isLook: true
        }
      })
    },
    update (row) {
      this.$router.push({
        path: '/competition/oilNew/edit',
        query: {
          infos: row,
          isEdit: true
        }
      })
    },
    rule (row) {
      this.$router.push({
        path: '/competition/filtration',
        query: {
          activityId: row.activityId
        }
      })
    },
    live (row) {
      let params = JSON.stringify(row)
      this.$router.push({
        path: '/competition/record',
        query: {
          rowData: params
        }
      })
    },
    handleCurrentChange (currentPage) {
      this.query.page_number = currentPage;
      this.getList();
    },
    handleSizeChange (pageSize) {
      this.query.page_size = pageSize;
      this.getList();
    },
    async getList () {
      const res = await queryList(this.query);
      this.Data = res.data.list;
      this.total = res.data.total;
    },
  },
};
</script>
<style lang="scss" scoped>
  .el-pagination {
    text-align: right;
    margin-top: 10px;
  }
</style>