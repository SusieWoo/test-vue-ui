<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24"
              class="filter-header mb5">
        <el-form :inline="true"
                 :model="query">
          <el-col :span="6">
            <el-form-item>
              <el-input v-model="query.confNameOrId" clearable :placeholder="$t('oil.searchId')" >
                <el-button slot="append" icon="el-icon-search" @click="qurey"/>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18" class="search-btn-group">
            <el-col :span="24">
              <el-form-item class="fr">
                <el-button type="primary" @click="createRule">
                  {{$t('oil.createRule')}}
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
                border style="margin-bottom:10px;">
        <el-table-column prop="id"
                         :label="$t('oil.schemeId')" />
        <el-table-column prop="confName"
                         :label="$t('oil.schemeName')" width="200"/>
        <el-table-column prop="confType" :label="$t('oil.schemeType')">
          <template slot-scope="scope">
            {{scope.row.confType === 0 ? $t('oil.ranking') : (scope.row.confType === 1 ? $t('oil.luckDraw') : '')}}
          </template>
        </el-table-column>
        <el-table-column prop="flag"
                         :label="$t('oil.currentState')">
          <template slot-scope="scope">
            {{scope.row.flag?$t('oil.enable'):$t('oil.unEnable')}}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" :label="$t('oil.createTime')" :formatter="formatDate" width="200"/>
        <el-table-column prop="createUser" :label="$t('oil.founder')" />
        <el-table-column fixed="right"
                         :label="$t('oil.operation')">
          <template slot-scope="scope">
            <el-button type="text" @click="look(scope.row)">
              {{$t('oil.see')}}
            </el-button>
            <el-button type="text" @click="update(scope.row)">
              {{$t('oil.edit')}}
            </el-button>
            <el-button type="text" @click="onPublish(scope.row)">
              {{scope.row.flag?$t('oil.unEnable'):$t('oil.enable')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.page_number" :page-sizes="[10, 20, 30, 40]" :page-size="query.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"/>
    </el-row>
    <el-dialog :title="$t('oil.unEnable')" :visible.sync="dialogVisible" width="30%">
      <el-row>{{$t('oil.beingUsed')}}</el-row>
      <el-row v-for="(item,index) in activitys" :key="index" style="margin: 5px 0px;background: #ece7e7;padding: 5px 0px 5px 15px;">{{item.activityName}}</el-row>
      <el-row style="text-align:center;margin-top:10px;">
        <el-button @click="dialogVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>


<script>
  import { queryActivityPrizeConf, operateActivityPrizeConf, checkActivityPrizeConf } from '@/api/oil/oilService';

  export default {
    name: 'List',
    data () {
      return {
        Data: [],
        total: 0,
        query: {
          confNameOrId: '',
          page_number: 1,
          page_size: 10,
        },
        dialogVisible: false,
        activitys: []
      };
    },
    mounted () {
      this.init()
    },
    methods: {
      handleCurrentChange(currentPage) {
        this.query.page_number = currentPage
        this.getList()
      },
      handleSizeChange (pageSize) {
        this.query.page_size = pageSize
        this.getList()
      },
      async getList() {
        const params = this.query
        const res = await queryActivityPrizeConf(params)
        this.Data = res.data.list
        this.total = res.data.total
      },
      init() {
        this.getList()
      },
      qurey() {
        this.query.page_number = 1
        this.getList()
      },
      look(row) {
        this.$router.push({
          path: 'oilSet/oilSetLook',
          query: {
            rowData: row,
            isLook: true
          }
        })
      },
      update(row) {
        this.$router.push({
          path: 'oilSet/oilSetEdit',
          query: {
            rowData: row,
            isEdit: true
          }
        })
      },
      onPublish(row) {
        if (!row.flag) {
          this.$confirm(this.$t('oil.toEnable') + '？', this.$t('oil.enable'), { type: 'warning' }).then(() => {
            this.Conf(row.id,1)
          })
        } else {
          checkActivityPrizeConf(row.id).then((data) => {
            debugger
            if (data.data.length) {
              this.activitys = data.data
              this.dialogVisible = true
            } else {
              this.$confirm(this.$t('oil.toDisable') + '？', this.$t('oil.unEnable'), { type: 'warning' }).then(() => {
                this.Conf(row.id, 0)
              })
            }
          })
        }
      },
      formatDate(row) {
        let dates = new Date(row.createTime)
        let months = 1 + dates.getMonth() + ''
        let days = dates.getDate() + ''
        let hours = dates.getHours() + ''
        let minutes = dates.getMinutes() + ''
        let seconds = dates.getSeconds() + ''
        return dates.getFullYear() + '年' + months.padStart(2, '0') + '月' + days.padStart(2, '0') + '日' + ' ' + hours.padStart(2, '0') + ':' + minutes.padStart(2, '0') + ':' + seconds.padStart(2, '0')
      },
      createRule() {
        this.$router.push({
          path: 'oilSet/oilSetAdd'
        })
      },
      Conf(id, flag) {
        operateActivityPrizeConf(id, flag).then(() => {
          this.$message.success(this.$t('oil.operationSuccess'))
          this.qurey()
        })
      }
    },
  }
</script>
<style lang="scss" scoped>
  .app-container{
    ::v-deep .el-dialog__body{
      padding-top: 0px;
      padding-bottom: 10px;
    }
  }
</style>