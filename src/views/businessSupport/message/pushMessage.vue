<template>
  <div class="message-manage">
    <el-tabs v-model="activeType"
             type="card">
      <el-tab-pane :label="$t('message.pushMessage')"
                   name="0" />
      <el-tab-pane :label="$t('message.smsMessage')"
                   name="1" />
      <el-tab-pane :label="$t('message.statisticsMessage')"
                   name="2" />
    </el-tabs>

    <!-- 查询条件start -->
    <div class="pushMsg">
      <!--        <el-card class="card-panel" :visible.sync="bindDialogVisible">-->
      <el-form :inline="true"
               :model="querys"
               label-position="left">
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-edit"
                     @click="pushMessageAdd">{{$t('common.add')}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="querys.keyWord"
                    :placeholder="$t('message.pKeyWord')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     @click="getNoticeList">{{$t('common.search')}}</el-button>
        </el-form-item>
        <com-search>
          <template>
            <span slot="item">
              <el-form-item :label="$t('message.dateTime')">
                <el-select v-model="querys.timeRange"
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
                <el-select v-model="querys.targetType"
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
                <el-select v-model="querys.noticeType"
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
                <el-select v-model="querys.msgType"
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

      <!-- 表格start -->
      <el-table class="t-table"
                stripe
                :data="tableData"
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
          <template slot-scope="scope"
                    align="center">
            <span>{{scope.row.targetType===0?'全部用户':scope.row.targetType===1?'部分用户':scope.row.targetType===2?'特定用户':''}}</span>
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
          <template slot-scope="scope">
            <el-button type="primary"
                       @click="resend(scope.row.id)">{{$t('common.reSend')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格end-->
      <!-- 分页start -->
      <pagination v-show="total>0"
                  :total="total"
                  :page.sync="querys.page_number"
                  :limit.sync="querys.page_size"
                  @pagination="getNoticeList" />
      <!-- 分页 end -->
    </div>
    <!--        </el-card>-->
    <!-- 查询条件end -->
  </div>
</template>

<script>
import { noticeList } from '@/api/business/messageService';
import { basedata } from '@/api/public/PublicService';
import pagination from '@/components/pagination';
import comSearch from '@/components/comSearch';

export default {
  components: {
    comSearch,
    pagination
  },
  data () {
    return {
      total: 0,
      querys: {
        page_number: 1,
        page_size: 10,
        keyWord: '',
        timeRange: '',
        noticeType: '',
        targetType: '',
        msgType: ''
      },
      msgTypeList: [],
      tableData: [],
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
      activeType: 0,
      bindDialogVisible: false,
    };
  },
  watch: {},
  mounted () {
    this.getMsgStyle();
    this.getNoticeList();
  },
  methods: {
    async pushMessageAdd () {
      await this.$router.push({ name: 'pushMessageAdd', params: { addFlag: '1', id: null } })
    },
    async resend (id) {
      await this.$router.push({ name: 'pushMessageAdd', params: { addFlag: '0', id: id } })
    },
    async getMsgStyle () {
      const res = await basedata({ type: 'A', code: 'M003' });
      this.msgTypeList = res.data.list;
    },
    async getNoticeList () {
      const res = await noticeList(this.querys);
      this.tableData = res.data.list;
      this.total = res.data.total;
    }
  }
};
</script>

<style lang="scss" scoped>
.message-manage {
  .collapse-select {
    padding: 0 20px;
  }

  .ml-10 {
    margin-left: 10px;
  }

  .list {
    padding: 10px 5px;
    border-bottom: 1px solid #dfe6ec;
  }

  .red {
    color: $red;
  }

  .center {
    text-align: center;
    border-bottom: 1px solid #dfe6ec;
    padding-bottom: 10px;
  }
}
</style>