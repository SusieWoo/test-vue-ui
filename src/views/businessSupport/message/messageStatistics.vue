<template>
  <div class="message-statistics">
        <!-- 查询条件start -->
        <el-card class="card-panel">
          <el-form :inline="true"
                   :model="querys"
                   label-position="left">
            <el-form-item>
              <el-input v-model="querys.title"
                        :placeholder="$t('message.pKeyTitle')" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="querys.sender"
                        :placeholder="$t('message.pKeySender')" />
            </el-form-item>

            <el-form-item :label="$t('message.sentTime')">
              <el-date-picker
                      v-model="rangeDateTime"
                      value-format="yyyy-MM-dd"
                      type="daterange"
                      unlink-panels
                      :clearable=false
                      :range-separator="$t('common.to')"
                      :picker-options="pickerOptions"
                      :start-placeholder="$t('common.beginDate')"
                      :end-placeholder="$t('common.endDate')"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="getStatisticsSmsDetail">
                {{$t('common.search')}}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <!-- 表格start -->
        <el-table class="t-table"
                  style="width: 100%"
                  stripe
                  :data="tableData"
                  :default-sort="{prop: 'sendCount', order: 'descending'}"
                  @sort-change="sortStatisticsTable">
          <el-table-column prop="title"
                           align="center"
                           :label="$t('message.title')" />
          <el-table-column prop="sender"
                           align="center"
                           :label="$t('message.sender')" />
          <el-table-column prop="sendCount"
                           sortable
                           align="center"
                           :label="$t('message.sendCnt')" />
          <el-table-column prop="sendSuccessCount"
                           align="center"
                           :label="$t('message.sendSuccessCnt')">
            <template slot-scope="statistics">
              <span>{{statistics.row.sendSuccessCount===null?'/':statistics.row.sendSuccessCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="readTotalCount"
                           align="center"
                           :label="$t('message.sendLinkCnt')">
            <template slot-scope="statistics">
              <span>{{statistics.row.readTotalCount===null?'/':statistics.row.readTotalCount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sendTime"
                           sortable
                           align="center"
                           :label="$t('message.sentTime')" />
        </el-table>
        <!-- 分页start -->
        <pagination v-show="total>0"
                    :total="total"
                    :page.sync="querys.page_number"
                    :limit.sync="querys.page_size"
                    @pagination="getStatisticsSmsDetail" />
  </div>
</template>

<script>
  import { statisticsSmsDetail } from '@/api/business/messageService';
  import pagination from '@/components/pagination';

  export default {
    components: {
      pagination
    },
    props: {},
    data () {
      return {
        total: 0,
        querys: {
          page_number: 1,
          page_size: 10,
          sendTotalOrder: '0',
          sortType: '2',
          startTime: '',
          endTime: '',
          sendType: '',
          msgType: ''
        },
        rangeDateTime: [],
        tableData: [],
        pickerOptions: {
          disabledDate: (time) => {
            return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
          }
        }
      };
    },
    watch: {},
    created () {
      this.querys.sendType = this.$route.params.sendType;
      this.querys.msgType = this.$route.params.msgType;
      this.rangeDateTime = this.$route.params.rangeDateTime;
      this.querys.startTime = this.rangeDateTime[0];
      this.querys.endTime = this.rangeDateTime[1];
    },
    mounted () {
      // this.fetchRangeDateTime();
      this.getStatisticsSmsDetail();
    },
    methods: {
      // async fetchRangeDateTime() {
      //
      //   let time1 = y + '-' + m1 + '-' + d1;
      //   let time2 = y + '-' + m2 + '-' + d2;
      //   this.rangeDateTime = [time2, time1];
      //   this.statisticsQuerys.startTime = time2;
      //   this.statisticsQuerys.endTime = time1;
      // },
      // 列表
      async getStatisticsSmsDetail () {
        const res = await statisticsSmsDetail(this.querys);
        this.tableData = res.data.list;
        this.total = res.data.total;
      },
      // 列表排序
      async sortStatisticsTable(column) {
        console.log(column);
        const order = column.order;
        const prop = column.prop;
        if (prop === 'sendCount') {
            //按照降序排序
          if (!order || order === 'descending') {
            this.querys.sendTotalOrder = '0';
          } else {
            //按照升序排序
            this.querys.sendTotalOrder = '1';
          }
          this.querys.sortType = '2';
        }
        if (prop === 'sendTime') {
          //按照降序排序
          if (!order || order === 'descending') {
            this.querys.sortType = '0';
          } else {
            //按照升序排序
            this.querys.sortType = '1';
          }
          this.querys.sendTotalOrder = '2';
        }
        this.getStatisticsSmsDetail();
      },
    }
  };
</script>
