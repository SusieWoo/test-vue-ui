<template>
  <div style="display:flex">
    <CarDetails :query="this.$route.query" @setCarTip="setCarTip" @setCarDetail="setCarDetail"></CarDetails>
    <el-card v-loading="loading" shadow="always" style="margin-left:10px;width:100%">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="wh">
        <!--一汽用户查看的基本信息-->
        <el-tab-pane style="width:100%" :label="$t('car.basic')" name="info">
          <basic-info :carDetail="carDetail"></basic-info>
        </el-tab-pane>

        <el-tab-pane :label="$t('monitor.real')" name="onRoad">
          <road :carTip="carTip" v-if="carTip.id && activeName ==='onRoad'"></road>
        </el-tab-pane>
        <el-tab-pane :label="$t('monitor.reproduce')" name="reproduce">
          <reproduce :carTip="carTip" v-if="carTip.id && activeName ==='reproduce'"></reproduce>
        </el-tab-pane>

        <el-tab-pane
          :label="$t('monitor.lock')"
          name="lock"
          v-if="carTip.lockCarEnable==1&&carDetail.stdSalesStatus == $t('basicInfo.edit.sold') && (carTip.lockStauts === 2 || carTip.lockStauts === 6)"
        >
          <!-- <el-tab-pane label="锁车" name="lock"> -->
          <lock
            :carTip="carTip"
            lock="lock"
            v-if="carTip.id && activeName ==='lock'"
            @changeTab="changeLock"
          ></lock>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('monitor.unlock')"
          name="unLock"
          v-if="carTip.lockCarEnable==1&&carDetail.stdSalesStatus == $t('basicInfo.edit.sold')&& ( carTip.lockStauts === 3 || carTip.lockStauts === 7)"
        >
          <!-- <el-tab-pane label="解锁" name="unLock"> -->
          <lock
            :carTip="carTip"
            lock="unlock"
            v-if="carTip.id && activeName ==='unLock'"
            @changeTab="changeLock"
          ></lock>
        </el-tab-pane>
        <el-tab-pane
          v-if="(carTip.lockStauts === 0||carTip.lockStauts === 4)&&carTip.lockCarEnable === 1&&carDetail.stdSalesStatus === $t('basicInfo.edit.sold')"
          :label="$t('monitor.fActive')"
          name="actice"
        >
          <!-- <el-tab-pane label="防控激活" name="actice"> -->
          <active
            v-if="carTip.id && activeName ==='actice'"
            @changeTab="changeActive"
            :carTip="carTip"
            active="active"
          ></active>
        </el-tab-pane>
        <el-tab-pane
          v-if="(carTip.lockStauts == 2 ||carTip.lockStauts == 5)&&carTip.lockCarEnable === 1&&carDetail.stdSalesStatus === '已售'"
          :label="$t('monitor.fClosed')"
          name="unActive"
        >
          <!-- <el-tab-pane label="防控关闭" name="unActive"> -->
          <active
            v-if="carTip.id && activeName ==='unActive'"
            @changeTab="changeActive"
            :carTip="carTip"
            active="unactive"
          ></active>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import CarApi from "@/api/monitor/car";
import CarDetails from "@/components/CarDetail";
import basicInfo from "./basic";
import active from "./active";
import lock from "./lock";
import road from "./road";
import reproduce from "./reproduce";
export default {
  components: {
    CarDetails,
    basicInfo,
    active,
    lock,
    road,
    reproduce
  },
  data() {
    return {
      loading: false,
      carDetail: {},
      userType: "",
      carDetail: {
        chassisNum: "",
        plateNum: "",
        lastLng: this.$route.query.lng,
        lastLat: this.$route.query.lat
      },
      carTip: {
        online: ""
      },
      activeName: "info",

      userInfo: ""
    };
  },
  mounted() {
    if (this.$route.query.type) {
      this.activeName = this.$route.query.type;
    }
  },
  methods: {
    changeActive(val) {
      this.carTip.lockStauts = val;
      switch (val) {
        case 4:
        case 0: {
          this.activeName = "actice";
          break;
        }
        case 2:
        case 5: {
          this.activeName = "unActive";
          break;
        }
      }
      console.log(this.activeName);
    },
    changeLock(val) {
      this.carTip.lockStauts = val;
      switch (val) {
        case 2:
        case 6: {
          console.log("lock:val", val);
          this.activeName = "lock";
          break;
        }
        case 3:
        case 7: {
          console.log("unLock:val", val);
          this.activeName = "unLock";
          break;
        }
      }
    },

    handleClick(tab, event) {
      clearInterval(this.timerLock);
      this.timerLock = null;
    },

    setCarDetail(carDetail) {
      this.carDetail = carDetail;
    },
    setCarTip(carTip) {
      this.carTip = carTip;
    }
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.timerLock);
    this.timerLock = null;
    if (to.path === "/monitor/car") {
      to.meta.keepAlive = true;
      window.sessionStorage.setItem("TabsValue", to.path);
    } else {
      to.meta.keepAlive = false;
    }
    next();
  }
};
</script>
<style lang="scss" scoped>
.chassisNum {
  font-size: 20px;
  font-weight: bold;
  vertical-align: text-bottom;
}
.info-dealer {
  height: auto;
  min-height: 30px;
  line-height: 20px;
  padding: 0 10px 10px 0;
}
.colorG {
  color: #28d228ff;
}
.colorR {
  color: #ccc;
}
.colorB {
  color: #377cfd;
}
.desc {
  line-height: 50px;
  background: rgba(248, 248, 248, 1);
  width: 100px;
}
.location {
  height: auto;
  min-height: 20px;
  margin-bottom: 10px;
}
.t-info {
  color: #898989;
}
.el-card ::v-deep.el-card__body {
  padding: 10px;
}
.el-col-8 {
  font-size: 14px;
  padding-top: 4px;
  word-break: break-all;
}
.line {
  border-bottom: 1px solid rgba(238, 238, 238, 1);
}
</style>
