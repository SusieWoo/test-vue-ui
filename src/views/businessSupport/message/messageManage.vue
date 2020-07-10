<template>
  <div class="message-manage">
    <el-tabs v-model="activeType" type="card">
      <!-- *****************推送消息***************** -->
      <el-tab-pane :label="$t('route.messagePush')" name="0">
        <!-- 查询条件start -->
        <el-card class="card-panel">
          <el-form :inline="true"
                   :model="pushQuerys"
                   label-position="left">
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-edit"
                         @click="pushMessageAdd">
                {{$t('common.add')}}
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-input v-model="pushQuerys.keyWord"
                        :placeholder="$t('message.pKeyWord')" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="getNoticeList">
                {{$t('common.search')}}
              </el-button>
            </el-form-item>
            <com-search>
              <template>
              <span slot="item">
                <el-form-item :label="$t('message.dateTime')">
                  <el-select v-model="pushQuerys.timeRange"
                             clearable
                             class="search-item"
                             :placeholder="$t('common.select')">
                    <el-option v-for="item in timeList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.targetUser')">
                  <el-select v-model="pushQuerys.targetType"
                             clearable
                             class="search-item"
                             :placeholder="$t('common.select')">
                    <el-option v-for="item in userList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.noticeType')">
                  <el-select v-model="pushQuerys.noticeType"
                             clearable
                             class="search-item"
                             :placeholder="$t('common.select')">
                    <el-option v-for="item in noticeList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.msgType')">
                  <el-select v-model="pushQuerys.msgType"
                             clearable
                             class="search-item"
                             :placeholder="$t('common.select')">
                    <el-option v-for="item in msgTypeList "
                               :key="item.value"
                               :label="item.name"
                               :value="item.value" />
                  </el-select>
                </el-form-item>
              </span>
              </template>
            </com-search>
          </el-form>
        </el-card>
        <!-- 表格start -->
        <el-table class="t-table"
                  stripe
                  :data="pushTableData"
                  style="width: 100%">
          <el-table-column prop="title"
                           align="center"
                           :label="$t('message.title')" />
          <el-table-column prop="creatorName"
                           align="center"
                           :label="$t('message.createUser')" />
          <el-table-column prop="targetType"
                           align="center"
                           :label="$t('message.targetUser')">
            <template slot-scope="push">
              <span>{{push.row.targetType===0?'全部用户':push.row.targetType===1?'部分用户':push.row.targetType===2?'特定用户':''}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime"
                           align="center"
                           :label="$t('message.createTime')" />
          <el-table-column prop="pv"
                           align="center"
                           :label="$t('message.pv')" />
          <el-table-column prop="uv"
                           align="center"
                           :label="$t('message.uv')" />
          <el-table-column fixed="right"
                           align="center"
                           label="操作">
            <template slot-scope="push">
              <el-button type="primary"
                         @click="pushMessageResend(push.row.id)">
                {{$t('common.reSend')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页start -->
        <pagination v-show="pushTotal>0"
                    :total="pushTotal"
                    :page.sync="pushQuerys.page_number"
                    :limit.sync="pushQuerys.page_size"
                    @pagination="getNoticeList" />
      </el-tab-pane>

      <!-- *****************短消息***************** -->
      <el-tab-pane :label="$t('route.messageSms')" name="1">
        <!-- 查询条件start -->
        <el-card class="card-panel">
          <el-form :inline="true"
                   :model="smsQuerys"
                   label-position="left">
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-edit"
                         @click="smsMessageAdd">
                {{$t('common.add')}}
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-input v-model="smsQuerys.title"
                        :placeholder="$t('message.pKeyWord')" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="getSmsMessageList">
                {{$t('common.search')}}
              </el-button>
            </el-form-item>
            <com-search>
              <template>
              <span slot="item">
                <el-form-item :label="$t('message.msgType')">
                  <el-select v-model="smsQuerys.msgType"
                             clearable
                             class="search-item"
                             :placeholder="$t('common.select')">
                    <el-option v-for="item in msgTypeList "
                               :key="item.value"
                               :label="item.name"
                               :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('message.dateTime')">
                  <el-select v-model="smsQuerys.timeRange"
                             clearable
                             class="search-item"
                             :placeholder="$t('common.select')">
                    <el-option v-for="item in timeList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value" />
                  </el-select>
                </el-form-item>
              </span>
              </template>
            </com-search>
          </el-form>
        </el-card>
        <!-- 表格start -->
        <el-table class="t-table"
                  style="width: 100%"
                  stripe
                  :data="smsTableData"
                  :default-sort="{prop: 'createTime', order: 'descending'}"
                  @sort-change="sortSmsTable">
          <el-table-column prop="title"
                           align="center"
                           :label="$t('message.title')" />
          <el-table-column prop="msgTypeName"
                           align="center"
                           :label="$t('message.msgType')" />
          <el-table-column prop="name"
                           align="center"
                           :label="$t('message.createUser')" />
          <el-table-column prop="createTime"
                           sortable
                           align="center"
                           :label="$t('message.createTime')" />
          <el-table-column fixed="right"
                           align="center"
                           label="操作">
            <template slot-scope="sms">
              <el-button type="primary"
                         @click="smsMessageResend(sms.row.id)">
                {{$t('common.reSend')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页start -->
        <pagination v-show="smsTotal>0"
                    :total="smsTotal"
                    :page.sync="smsQuerys.page_number"
                    :limit.sync="smsQuerys.page_size"
                    @pagination="getSmsMessageList" />
      </el-tab-pane>

      <!-- *****************消息统计******************* -->
      <el-tab-pane :label="$t('route.messageStatistics')" name="2">
        <!-- 查询条件start -->
        <el-card class="card-panel">
          <el-form :inline="true"
                   :model="statisticsQuerys"
                   label-position="left">
            <el-form-item :label="$t('message.sendMsgType')">
              <el-select v-model="statisticsQuerys.sendType"
                         class="search-item"
                         clearable
                         :placeholder="$t('common.select')"
                         @change="getSmsMsgTypeList">
                <el-option v-for="item in sendTypeList"
                           :key="item.value"
                           :label="item.name"
                           :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('message.carType')">
              <el-select v-model="statisticsQuerys.msgType"
                         class="search-item"
                         clearable
                         :placeholder="$t('common.select')">
                <el-option v-for="item in smsMsgTypeList"
                           :key="item.msgType"
                           :label="item.msgTypeName"
                           :value="item.msgType" />
              </el-select>
            </el-form-item>
<!--            <el-form-item :label="$t('message.dateRange')">-->
<!--              <el-date-picker-->
<!--                      v-model="statisticsQuerys.startTime"-->
<!--                      :picker-options="pickerOptions0"-->
<!--                      value-format="yyyy-MM-dd"-->
<!--                      class="search-item"-->
<!--                      type="date"-->
<!--                      :placeholder="$t('common.beginDate')"-->
<!--              />-->
<!--            </el-form-item>-->
<!--            <el-form-item label="至">-->
<!--              <el-date-picker-->
<!--                      v-model="statisticsQuerys.endTime"-->
<!--                      :picker-options="pickerOptions1"-->
<!--                      class="search-item"-->
<!--                      value-format="yyyy-MM-dd"-->
<!--                      type="date"-->
<!--                      :placeholder="$t('common.endDate')"-->
<!--              />-->
<!--            </el-form-item>-->

            <el-form-item :label="$t('message.dateRange')">
              <el-date-picker
                      v-model="rangeDateTime"
                      value-format="yyyy-MM-dd"
                      type="daterange"
                      unlink-panels
                      :range-separator="$t('common.to')"
                      :picker-options="pickerOptions"
                      :start-placeholder="$t('common.beginDate')"
                      :end-placeholder="$t('common.endDate')"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="getStatisticsSmsList">
                {{$t('common.search')}}
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="getStatisticsSmsList">
                {{$t('common.export')}}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <!-- 表格start -->
        <el-table class="t-table"
                  style="width: 100%"
                  stripe
                  :data="statisticsTableData"
                  :default-sort="{prop: 'sendTotalCount', order: 'descending'}"
                  @sort-change="sortStatisticsTable">
          <el-table-column prop="sendTypeName"
                           align="center"
                           :label="$t('message.sendMsgType')" />
          <el-table-column prop="msgTypeName"
                           align="center"
                           :label="$t('message.type')" />
          <el-table-column prop="sendTotalCount"
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
          <el-table-column fixed="right"
                           align="center"
                           :label="$t('common.operate')">
            <template slot-scope="statistics">
              <el-button type="primary" v-if="(statistics.row.sendApp === 6 || statistics.row.sendApp === 7) &&
               (statistics.row.msgTypeName.indexOf('手动发放') > -1 || statistics.row.msgTypeName.indexOf('促活类') > -1)"
                         @click="statisticsSmsDetail(statistics.row.sendApp, statistics.row.msgType)">
                {{$t('common.detail')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页start -->
        <pagination v-show="statisticsTotal>0"
                    :total="statisticsTotal"
                    :page.sync="statisticsQuerys.page_number"
                    :limit.sync="statisticsQuerys.page_size"
                    @pagination="getStatisticsSmsList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  noticeList,
  smsMessageList,
  statisticsSmsList,
  smsMsgTypeList
} from '@/api/business/messageService';
import { basedata } from '@/api/public/PublicService';
import pagination from '@/components/pagination';
import comSearch from '@/components/comSearch';

export default {
  components: {
    comSearch,
    pagination
  },
  props: {},
  data () {
    return {
      pushTotal: 0,
      smsTotal: 0,
      statisticsTotal: 0,
      pushQuerys: {
        page_number: 1,
        page_size: 10
      },
      smsQuerys: {
        page_number: 1,
        page_size: 10,
        sortType: 0
      },
      statisticsQuerys: {
        page_number: 1,
        page_size: 10,
        sendTotalOrder: 0,
        msgType: null,
        startTime: '',
        endTime: ''
      },
      rangeDateTime: [],
      msgTypeList: [],
      sendTypeList: [],
      smsMsgTypeList: [],
      pushTableData: [],
      smsTableData: [],
      statisticsTableData: [],
      timeList: [
        { label: '全部', value: 0 },
        { label: '最近一周', value: 1 },
        { label: '最近一个月', value: 2 },
        { label: '最近三个月', value: 3 },
        { label: '最近六个月', value: 4 },
        { label: '最近一年', value: 5 }
      ],
      userList: [
        { label: '全部用户', value: 0 },
        { label: '部分用户', value: 1 },
        { label: '特定用户', value: 2 }
      ],
      noticeList: [
        { label: '全部方式', value: null },
        { label: 'APP', value: 0 }
      ],
      pickerOptions: {
        disabledDate: (time) => {
            return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
        }
      },
      // pickerOptions0: {
      //   disabledDate: (time) => {
      //     if (this.statisticsQuerys.endTime) {
      //       return time.getTime() > Date.now() - 24 * 60 * 60 * 1000 ||
      //               time.getTime() > new Date(this.statisticsQuerys.endTime).getTime();
      //     } else {
      //       return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
      //     }
      //   }
      // },
      // pickerOptions1: {
      //   disabledDate: (time) => {
      //     return time.getTime() < new Date(this.statisticsQuerys.startTime).getTime() - 24 * 60 * 60 * 1000 ||
      //             time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
      //   }
      // },
      //activeType: 0,
      //bindDialogVisible: false,
    };
  },
  watch: {},
  created () {
  },
  mounted () {
    this.getMsgStyle();
    this.getSendType();
    this.fetchRangeDateTime();
    this.getNoticeList();
    this.getSmsMessageList();
    this.getStatisticsSmsList();
  },
  methods: {
    async fetchRangeDateTime() {
      let date = new Date();
      let y = date.getFullYear();
      let m1 = date.getMonth() + 1;
      let m2 = date.getMonth() - 2;
      let d1 = date.getDate() - 1;
      let d2 = date.getDate();
      if (m1 >= 1 && m1 <= 9) {
        m1 = '0' + m1;
      }
      if (m2 >= 1 && m2 <= 9) {
        m2 = '0' + m2
      }
      if (d1 >= 0 && d1 <= 9) {
        d1 = '0' + d1
      }
      if (d2 >= 0 && d2 <= 9) {
        d2 = '0' + d2
      }
      let time1 = y + '-' + m1 + '-' + d1;
      let time2 = y + '-' + m2 + '-' + d2;
      this.rangeDateTime = [time2, time1];
      this.statisticsQuerys.startTime = time2;
      this.statisticsQuerys.endTime = time1;
    },
    // 消息类型
    async getMsgStyle () {
      const res = await basedata({ type: 'A', code: 'M003' });
      this.msgTypeList = res.data.list;
    },
    // 发送端
    async getSendType () {
      const res = await basedata({ type: 'B', code: 'S001' });
      this.sendTypeList = res.data.list;
    },
    //类型
    async getSmsMsgTypeList (id) {
      this.statisticsQuerys.msgType = null;
      if (id === null || id === '') {
        this.smsMsgTypeList = null;
      } else {
        const re = await smsMsgTypeList({ sendType: id });
        this.smsMsgTypeList = re.data;
      }
    },

    // 推送消息列表
    async getNoticeList () {
      const res = await noticeList(this.pushQuerys);
      this.pushTableData = res.data.list;
      this.pushTotal = res.data.total;
    },
    // 新增推送消息
    async pushMessageAdd () {
      await this.$router.push({ name: 'MessagePush', params: { addFlag: '1', id: null } })
    },
    // 重发推送消息
    async pushMessageResend (id) {
      await this.$router.push({ name: 'MessagePush', params: { addFlag: '0', id: id } })
    },

    // 短消息列表
    async getSmsMessageList () {
      const res = await smsMessageList(this.smsQuerys);
      this.smsTableData = res.data.list;
      this.smsTotal = res.data.total;
    },
    // 短消息排序
    async sortSmsTable(column) {
      console.log(column);
      const sortingType = column.order;
      //按照降序排序
      if (sortingType === 'descending') {
        this.smsQuerys.sortType = 0;
      } else {
        //按照升序排序
        this.smsQuerys.sortType = 1;
      }
      this.getSmsMessageList();
    },
    // 新增SMS消息
    async smsMessageAdd () {
      await this.$router.push({ name: 'MessageSms', params: { addFlag: '1', id: null } })
    },
    // 重发SMS消息
    async smsMessageResend (id) {
      await this.$router.push({ name: 'MessageSms', params: { addFlag: '0', id: id } })
    },
    // 消息统计列表
    async getStatisticsSmsList () {
      this.statisticsQuerys.startTime = this.rangeDateTime[0];
      this.statisticsQuerys.endTime = this.rangeDateTime[1];
      const res = await statisticsSmsList(this.statisticsQuerys);
      this.statisticsTableData = res.data.list;
      this.statisticsTotal = res.data.total;
    },
    // 消息统计列表排序
    async sortStatisticsTable(column) {
      const sortingType = column.order;
      //按照降序排序
      if (sortingType === 'descending') {
        this.statisticsQuerys.sendTotalOrder = 0;
      } else {
        //按照升序排序
        this.statisticsQuerys.sendTotalOrder = 1;
      }
      this.getStatisticsSmsList();
    },
    // 消息统计详情
    async statisticsSmsDetail() {
    }
  }
};
</script>
