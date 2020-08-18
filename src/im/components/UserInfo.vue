<template>
  <div class="g-inherit m-main p-session">
    <div class="u-list">
      <div class="m-tab">
        <h1 class="m-tab-top">
          {{ carUserInfo.userRole?$t('im.userInfo'):$t('im.carList') }}
        </h1>
        <el-input v-if="!carUserInfo.userRole" v-model="keywrod" :placeholder="$t('im.chassisCarNumberPlaceholder')" class="input-with-select" />
      </div>
      <el-scrollbar wrap-class="no-scroll-x" class="car-list">
        <template v-if="carUserInfo.userRole">
          <div class="car-list-item">
            <p>{{ $t('im.userRoleName') }}：{{carUserInfo.userRoleName}}</p>
            <template v-if="chatUserRole && chatUserRole==='product'">
              <p>{{ $t('im.oneDealer') }}：{{carUserInfo.teamName}}</p>
              <p v-if="carUserInfo.secteamName">{{ $t('im.secondDealer') }}：{{carUserInfo.secteamName}}</p>
            </template>
            <template v-if="chatUserRole && chatUserRole==='serve'">
              <p>{{ $t('im.oneServiceStation') }}：{{carUserInfo.stationName}}</p>
              <p v-if="carUserInfo.secStationName">{{ $t('im.secondServiceStation') }}：{{carUserInfo.secStationName}}</p>
            </template>
          </div>
        </template>
        <template v-if="carList.length > 0">
          <div v-for="(item, index) in carList" :key="index" class="car-list-item" @click="getCarDetail(item)">
            <p>VIN: {{item && item.vinId}}</p>
            <p>{{ $t('search.carno') }}: {{item && item.carNumber}} {{ $t('im.carSerise') }}: {{item && item.cab}}</p>
          </div>
        </template>
        <p v-if="dialogId && !carUserInfo.userRole && carList.length === 0" class="tips-p">{{ $t('common.noData') }}</p>
      </el-scrollbar>
    </div>

    <div v-if="showDetail" class="car-detail-pop">
      <div class="header">
        <i class="el-icon-close" @click="handleClose"></i>
      </div>
      <div class="row-title">
        {{ $t('im.userInfo') }}
      </div>
      <div>
        <p>{{ $t('im.userRealName') }}：{{ detailInfo.accountName }}</p>
        <p>{{ $t('dealer.contactPhone') }}：{{ detailInfo.phone }}</p>
      </div>
      <div class="row-title">
        {{ $t('im.carInfo') }}
      </div>
      <div>
        <p>{{ $t('im.carNumber') }}：{{ detailInfo.carCph }}</p>
        <p>{{ $t('im.engineType') }}：{{ detailInfo.engineType }}</p>
        <p>{{ $t('im.chassisCode') }}：{{ detailInfo.chassisCode }}</p>
        <p>{{ $t('im.carSeriseType') }}：{{ detailInfo.carSerise }}</p>
        <p>{{ $t('im.mileage') }}：{{ detailInfo.mileage }}</p>
        <p>{{ $t('im.buyTime') }}：{{ detailInfo.buyTime }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ImModule } from '@/im/store/modules/im'
export default {
  data() {
    return {
      showDetail: false,
      detailInfo: {},
      keywrod: ''
    }
  },
  computed: {
    carList() {
      return ImModule.carList.filter(item => item ? (item.vinId.indexOf(this.keywrod) > -1 || item.carNumber.indexOf(this.keyword) > -1) : null)
    },
    carUserInfo() {
      return ImModule.chatUserInfo
    },
    chatUserRole() {
      return ImModule.chatUserRole
    },
    dialogId() {
      return ImModule.dialogId
    }
  },
  methods: {
    getCarDetail(item) {
      if (!item) return
      ImModule.queryCarDetailInfo(item.vinId).then(res => {
        this.detailInfo = res
        this.showDetail = true
      })
    },
    handleClose() {
      this.showDetail = false
      this.detailInfo = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.m-main {
  position: relative;
  .car-detail-pop {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background: #fff;
    font-size: 14px;
    .header {
      padding: 10px;
      text-align: right;
      i {
        cursor: pointer;
      }
    }
    .row-title {
      padding: 10px;
      font-size: 16px;
      background: #E5F4FF;
    }
    p {
      padding: 6px 10px;
      font-size: 12px;
    }
  }
}
.u-list {
  padding: 0;
}
.car-list {
  height: 550px;
  .car-list-item {
    border-bottom: 1px solid #E5F4FF;
    padding: 15px 10px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background: #F5F5F5;
    }
  }
}
</style>
