<template>
  <div class="g-inherit m-main p-session">
    <div class="u-list">
      <div class="m-tab">
        <h1 class="m-tab-top">
          {{username}}
        </h1>
      </div>
      <el-scrollbar wrap-class="no-scroll-x" class="friend-list">
        <el-row v-for="(session, index) in sessionlist" :key="session.id"
                :gutter="20"
                class="u-list-item"
                :class="{'active': activeIndex === index}"
                type="flex"
                align="middle"
                :session-id="session.dialogId"
                @click.native="enterChat(session, index)">
          <el-col :span="5">
            <el-image :src="avatar(session.customerId)" class="icon u-circle">
              <div slot="error" class="image-slot">
                <i class="el-icon-s-custom"></i>
              </div>
            </el-image>
          </el-col>
          <el-col :span="19">
            <div>
              <p>{{session.customerName || $t('im.noNick')}}</p>
              <p class="msg-desc">
                <span class="desc-content">{{session.content}}</span>
                <!-- TODO 未读数 -->
                <span v-show="session.unread > 0" class="u-unread">{{session.unread}}</span>
              </p>
</div>
          </el-col>
</el-row>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { ImModule } from '@/im/store/modules/im'
import { setCurrSession } from '@/im/initNimSDK'


export default {
  data() {
    return {
      activeIndex: null
    }
  },
  computed: {
    sessionlist() {
      return ImModule.friendslist
    },
    username() {
      return ImModule.username
    },
    // TODO 未读数
    sysMsgUnread() {
      let temp = ImModule.sysMsgUnread
      let sysMsgUnread = temp.unread || 0
      let customSysMsgUnread = ImModule.customSysMsgUnread
      return sysMsgUnread + customSysMsgUnread
    },
  },
  watch: {
    '$store.state.im.dialogId'(newv) {
      if (!newv) this.activeIndex = null
    }
  },
  mounted() {

  },
  methods: {
    avatar(customerId) {
      return process.env.VUE_APP_USERCENTER_API + 'queryPicById?userId=' + customerId
    },
    enterChat(array, index) {
      ImModule.MyInfo({ params: '',types: 'userRole' })
      ImModule.MyInfo({ params: '',types: 'userRoleCode' })
      // console.log(ImModule.toperson, array.customerId)
      if (ImModule.toperson === array.customerId) {
          return false;
        } else {
          this.activeIndex = index
          let toperson = array.customerId
          let dialogId = array.dialogId
          ImModule.setCurrent({ params: toperson,types: 'toperson' })
          ImModule.setCurrent({ params: dialogId,types: 'dialogId' })
          ImModule.setCurrent({ params: array.customerName,types: 'customerName' })
          ImModule.setCurrent({ params: process.env.VUE_APP_USERCENTER_API + 'queryPicById?userId=' + toperson,types: 'headPic' })
          // ImModule.setCurrent({params:0,types:'historyPageNumber'})
          // ImModule.setCurrent({ params: '', types: 'resetHistory' })
          //获取聊天记录
          setCurrSession(toperson)
          //得到接口会话内容
           ImModule.getDialogDetail(dialogId);
          this.getRightInfo(array)
        }
    },
    getRightInfo(item) {
      ImModule.setCurrent({ params: [],types: 'carList' })
      ImModule.setCurrent({ params: '',types: 'userRole' })
      this.userRole = ''
      if (item.userRole !== '1' && item.userRole !== '2') {
        this.userRoleCode = item.userRole;
        if (['53','54','51','52','55','21','12','27','510','58','59'].indexOf(item.userRole) !== -1) {
          this.userRole = 'product';
          ImModule.setCurrent({ params: 'product',types: 'chatUserRole' })
        } else if (['32','31'].indexOf(item.userRole) !== -1) {
          this.userRole = 'serve';
          ImModule.setCurrent({ params: 'serve',types: 'chatUserRole' })
        }
      }
      this.getCarInfo(this.userRole, item)
    },
    getCarInfo(from, item) {
      if (from) {
        // 获取个人信息
        /*SalesTwoService.queryProductUserInfo(vm.toperson)
            .then(function(data){
                  vm.inforGroup=data;
                }
            ).catch(function(err){
          $rootScope.catchError(err);
        });*/
        ImModule.queryProductUserInfo(item.customerId)
      } else {
        // 获取车辆列表
        ImModule.queryCarList(item.customerId)
      }
    }
  }
}
</script>

<style  lang="scss" scoped>
.p-session {
  .vux-cell-primary {
    max-width: 70%;
  }
}
.u-list-item {
  &.active, &:hover {
    background: #F5F5F5;
  }
}
.friend-list {
  height: 590px;
}
.msg-desc {
  white-space: nowrap;
  //text-overflow: ellipsis;
  overflow: hidden;
  color: #999;
  font-size: 14px;
  display: flex;
  align-items: center;
  height: 30px;
  .desc-content {
    flex: 1;
  }
  .u-unread {
    background: red;
    border-radius: 10px;
    min-width: 20px;
    height: 20px;
    color: #fff;
    text-align: center;
    line-height: 20px;
    width: auto;
    padding: 0 5px;
  }
}
</style>
