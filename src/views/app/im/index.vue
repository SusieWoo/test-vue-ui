<template>
  <div class="app-container">
    <el-tabs v-model="curTabName" type="border-card" @tab-click="handleTabChange">
      <el-tab-pane :label="$t('im.curSession')" name="curSession">
        <Dialogue />
      </el-tab-pane>
      <el-tab-pane :label="$t('im.history')" name="history">
        <el-card class="card-panel">
          <el-form :inline="true" :model="querys">
            <el-form-item :label="$t('im.sessionTime.title')">
              <el-select v-model="days" @change="handleDaysChange">
                <el-option value="all" :label="$t('im.sessionTime.all')" />
                <el-option value="1" :label="$t('im.sessionTime.today')" />
                <el-option value="7" :label="$t('im.sessionTime.day7')" />
                <el-option value="30" :label="$t('im.sessionTime.day30')" />
                <el-option value="custom" :label="$t('im.sessionTime.custom')" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="days === 'custom'">
              <el-date-picker
                  v-model="value1"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  :range-separator="$t('im.sessionTime.to')"
                  :start-placeholder="$t('im.sessionTime.startTime')"
                  :end-placeholder="$t('im.sessionTime.endTime')"
                  :picker-options="pickerOptions"
                  @change="handleCustomDateChange" />
            </el-form-item>
            <el-form-item :label="$t('im.username')">
              <el-input v-model="querys.customerName" :placeholder="$t('im.placeUsername')">
                <el-button slot="append" icon="el-icon-search" @click="getList" />
              </el-input>
            </el-form-item>
          </el-form>
        </el-card>
        <el-table
            :data="tableData"
            style="width: 100%">
          <el-table-column prop="customerName" :label="$t('im.username')" width="180" />
          <el-table-column prop="userRoleName" :label="$t('im.role')" width="180" />
          <el-table-column prop="startTime" :label="$t('im.sessionStartTime')" />
          <el-table-column prop="endTime" :label="$t('im.sessionEndTime')" />
          <el-table-column prop="endTime" :label="$t('common.operate')">
            <template slot-scope="scope">
              <el-button type="text" @click="handleViewChatHistory(scope.row, scope.$index)">{{ $t('carGroup.look') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="querys.page_number"
            :limit.sync="querys.page_size"
            @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('im.onlineNow')" name="online">
        <el-card class="card-panel">
          <el-form :inline="true" :model="querys2">
            <el-form-item :label="$t('im.username')">
              <el-input v-model="querys2.serverUserName" :placeholder="$t('im.placeUsername')">
                <el-button slot="append" icon="el-icon-search" @click="getOnlineList" />
              </el-input>
            </el-form-item>
          </el-form>
        </el-card>
        <el-table
            :data="onelineTableData"
            style="width: 100%">
          <el-table-column prop="serverUserName" :label="$t('im.username')" width="180" />
          <el-table-column prop="telephone" :label="$t('common.tel')" width="180" />
          <el-table-column prop="loginTimes" :label="$t('im.loginTime')" />
        </el-table>
        <pagination
            v-show="total2>0"
            :total="total2"
            :page.sync="querys2.page_number"
            :limit.sync="querys2.page_size"
            @pagination="getOnlineList"
        />
      </el-tab-pane>
    </el-tabs>

    <!--历史记录弹窗-->
    <el-dialog :visible.sync="dialogChatHistoryVisible">
      <p slot="title"><span style="margin-right: 40px">{{chatNick}}</span>{{chatTime}}</p>
      <ChatList :msglist="msgList" />
      <div slot="footer">
        <el-button type="primary" :loading="loading" @click="callbackChat">{{ $t('im.callbackChat') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import Dialogue from './components/dialogue.vue';
import pagination from '@/components/pagination';
import ChatList from '@/im/components/ChatList';
import { getChatHistory, dialogSearch, dialogDetail, createTboosDialog, queryOnlineServerList } from '@/api/business/imService';
import { cookie } from '@/im/utils/cookies';
import { ImModule } from '@/im/store/modules/im';

export default {
  components: {
    Dialogue,
    pagination,
    ChatList
  },
  data () {
    return {
      curTabName: 'curSession',
      tableData: [],
      onelineTableData: [],
      total: 0,
      total2: 0,
      querys: {
        page_number: 1,
        page_size: 10,
        customerName: '',
        startTime: this.$moment().subtract('days', 7).format('YYYY-MM-DD'),
        endTime: this.$moment().format('YYYY-MM-DD'),
      },
      querys2: {
        page_number: 1,
        page_size: 10,
        serverUserName: ''
      },
      days: '7',
      value1: '',
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime();
        }
      },
      dialogChatHistoryVisible: false,
      msgList: [],
      chatNick: '',
      chatTime: '',
      detail: {},
      loading: false
    };
  },
  mounted () {
  },
  methods: {
    handleTabChange(tab) {
      const { index } = tab
      if (index === '1') {
        // console.log('历史记录')
        this.getList()
      } else if (index === '2') {
        // console.log('当前在线')
        this.getOnlineList()
      }
    },
    handleDaysChange(e) {
      // console.log(e)
      this.value1 = ''
      if (e === 'all') {
        this.querys.startTime = undefined
        this.querys.endTime = undefined
      } else if (e === 'custom') {
        // console.log('自定义')
        return
      } else {
        // console.log('时间')
        const day = parseInt(e)
        this.querys.startTime = day === 1 ? this.$moment().format('YYYY-MM-DD') : this.$moment().subtract('days', e).format('YYYY-MM-DD')
        this.querys.endTime = this.$moment().format('YYYY-MM-DD')
      }
      this.getList()
    },
    handleCustomDateChange(e) {
      if (e.length > 0) {
        this.querys.startTime = e[0]
        this.querys.endTime = e[1]
        this.getList()
      }
    },
    async getList() {
      const res = await getChatHistory(this.querys)
      this.tableData = res.data.list
      this.total = res.data.total
    },
    async getOnlineList() {
      const res = await queryOnlineServerList(this.querys2)
      this.onelineTableData = res.data.list
      this.total2 = res.data.total
    },
    async handleViewChatHistory(row, index) {
      const res = await dialogSearch({ page_number: 1 })
      this.dialogId = res.data.list[index].dialogid
      this.detail = await dialogDetail({
        dialogId: this.dialogId,
        userId: cookie.readCookie('uid')
      })
      let fmtStr = 'YYYY-MM-DD HH:mm'
      this.chatNick = this.detail.data.nickName
      this.chatTime = `${this.$moment(parseInt(this.detail.data.createTime)).format(fmtStr)} ~ ${this.$moment(parseInt(this.detail.data.endTime)).format(fmtStr)}`
      this.msgList = this.detail.data.list
      this.dialogChatHistoryVisible = true
    },
    callbackChat() {
      this.loading = true
      createTboosDialog({
        serverUserId: ImModule.userUID,
        customerId: this.detail.data.customerId
      }).then(() => {
        this.$message.success({
          message: this.$t('im.callbackSuccessTips'),
          duration: 3000
        });
        setTimeout(() => {
          this.loading = false
          this.curTabName = 'curSession'
          this.dialogChatHistoryVisible = false
          ImModule.UpdateUserUID()
        }, 3000)
      })
    }
  }
}
</script>
