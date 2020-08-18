<template>
  <el-container style="max-width:350px">
    <el-card shadow="always" style="font-size: 14px;">
      <el-col :span="24">
        <img src="@/assets/images/car_cover.png" width="100%" style="height: 22vh;" />
      </el-col>
      <el-col :span="24" class="mt20 mb20 chassisNum">
        <span>{{carDetail.chassisNum}}{{ carDetail.plateNum?('('+ carDetail.plateNum+')'):' '}}</span>
        <span
          class="chassisNum"
          :class="{colorG: carTip.online, colorR: !carTip.online}"
        >{{carTip.online == 1?$t('monitor.info.online'):$t('monitor.info.offline')}}</span>
      </el-col>
      <el-col :span="24" class="h20 t-info">{{ $t('monitor.info.dealer')}}：</el-col>
      <el-col :span="24" class="h30">{{carDetail.dealer || $t('common.none')}}</el-col>
      <el-col :span="24" class="h20 t-info">{{ $t('monitor.info.carType')}}：</el-col>
      <el-col :span="24" class="h30">{{carDetail.carType || $t('common.none')}}</el-col>
      <el-col :span="24" class="h20 t-info">{{ $t('monitor.info.engineType')}}：</el-col>
      <el-col :span="24" class="h30">{{carDetail.engineType || $t('common.none')}}</el-col>
      <el-col :span="24" class="h20 t-info">{{ $t('monitor.info.lastlocation')}}：</el-col>
      <el-col
        :span="24"
        class="location"
        v-lastlocation="{ lng: carDetail.lastLng, lat: carDetail.lastLat }"
      ></el-col>
      <el-col :span="24" class="h20 t-info">{{$t('monitor.info.lasttime')}}：</el-col>
      <el-col :span="24" class="h30">{{carDetail.lastTime || $t('common.none')}}</el-col>
      <el-col :span="24" class="pb10" style="text-align: center">
        <el-button size="medium" type="primary" @click="returnTo">{{$t('monitor.info.back')}}</el-button>
      </el-col>
    </el-card>
  </el-container>
</template>
<script>
import CarApi from "@/api/monitor/car";

import lastlocation from '@/directive/lastlocation/index' // 逆地理

export default {
  directives: {
    lastlocation
  },
  props: ["query"],
  data() {
    return {
      carDetail: {
        chassisNum: "",
        plateNum: "",
        lastLng: this.$route.query.lng,
        lastLat: this.$route.query.lat
      },
      carTip: {
        online: ""
      }
    };
  },
  mounted() {
    this.queryCarInfo();
  },
  methods: {
    // 获取详情
    queryCarInfo() {
      CarApi.queryCarInfo({ carId: this.query.id })
        .then(res => {
          this.carDetail = res.data;
          if (this.query.type === "info") {
            this.$emit("getPhoneNumbers", res.data.teamId, res.data.carSign);
            this.$emit("setCarDetail", res.data);
          }
          // this.getPhoneNumbers(res.teamId, res.carSign)
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
          });
        });
      CarApi.queryCarTip({ id: this.query.id })
        .then(res => {
          this.carTip = res.data;
          this.$emit("setCarTip",  res.data);
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
          });
        });
    },
    returnTo() {
      this.$router.push({ path: "/monitor/car" });
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
}
.location {
  height: auto;
  min-height: 20px;
  margin-bottom: 10px;
}
.t-info {
  color: #898989;
}
.el-card ::deep .el-card__body {
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
