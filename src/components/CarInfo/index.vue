<template>
  <el-dialog
    title
    :visible.sync="dialogVisible"
    top="3vh"
    :before-close="cancel"
    :modal="false"
    width="500px"
    @open="open"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :style="styleObject"
  >
    <el-row>
      <el-col :span="24">
        <img src="@/assets/images/icon-car.png" />
        <span class="chassisNum">{{car.chassisNum}}{{ car.plateNum?('('+ car.plateNum+')'):' '}}</span>
        <span
          class="chassisNum"
          :class="{colorG: car.online, colorR: !car.online}"
        >{{car.online == 1?$t('monitor.info.online'):$t('monitor.info.offline')}}</span>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">{{ $t('monitor.info.dealer')}}：</el-col>
        <el-col :span="14">{{car.dealer ||  $t('common.none')}}</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">{{ $t('monitor.info.customer')}}：</el-col>
        <el-col :span="14">{{car.customer ||  $t('common.none')}}</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">{{ $t('monitor.info.rpTime')}}：</el-col>
        <el-col :span="14">{{car.gpstime ||  $t('common.none')}}</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">{{$t('monitor.info.lockStatus')}}:</el-col>
        <el-col :span="14">{{filterLockStatus(car.lockStauts)}}</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">{{$t('monitor.info.totalMiles')}}</el-col>
        <el-col :span="14">{{car.todayMilleage || 0}}KM</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">{{$t('monitor.info.status')}}</el-col>
        <el-col :span="14">{{car.accStauts ||  $t('common.none')}}</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">{{$t('monitor.info.breakdown')}}</el-col>
        <el-col :span="14">{{car.fault ||  $t('common.none')}}</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">{{$t('monitor.info.weight')}}</el-col>
        <el-col :span="14">{{car.carLoad || 0}}</el-col>
      </el-col>
      <el-col :span="24" style="min-height: 26px; height: auto">
        <el-col :span="10">{{$t('monitor.info.lastlocation')}}</el-col>
        <el-col :span="14" v-lastlocation="{ lng: car.lng, lat: car.lat }"></el-col>
      </el-col>

      <el-col :span="24" class="mb20">
        <el-button
          type="primary"
          size="small"
          class="infoBtn"
          :disabled="loading"
          @click="carInfoPage('info')"
        >{{$t("monitor.detail")}}</el-button>
        <el-button
          type="primary"
          size="small"
          class="infoBtn"
          :disabled="loading"
          @click="carInfoPage('onRoad')"
        >{{$t("monitor.real")}}</el-button>
        <el-button
          type="primary"
          size="small"
          class="infoBtn"
          :disabled="loading"
          @click="carInfoPage('reproduce')"
        >{{$t("monitor.reproduce")}}</el-button>
        <el-button
          type="primary"
          size="small"
          class="infoBtn"
          :disabled="loading"
          @click="carInfoPage('active')"
        >{{$t("monitor.fActive")}}</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import lastlocation from "@/directive/lastlocation/index"; // 逆地理
import { mapActions } from "vuex";

export default {
  name: "carInfo",
  // '弹框显隐', '字段集合', '弹框的左侧位置', '弹框上方位置'
  props: ["dialogVisible", "car", "tranLeft", "tranTop"],
  directives: {
    lastlocation
  },

  computed: {
    typeNames: function() {
      return {
        info: this.$t("monitor.detail"),
        real: this.$t("monitor.real"),
        reproduce: this.$t("monitor.reproduce")
      };
    },
    filterLockStatus() {
      return function(value) {
        if(value===undefined){
          return;
        }
        console.log(value);
        let re = "";
        switch (value) {
          case 0:
            re = this.$t("monitor.status.unactive");
            break;
          case 2:
            re = this.$t("monitor.status.actived");
            break;
          case 3:
            re = this.$t("monitor.status.locked");
            break;
          case 4:
            re = this.$t("monitor.status.activing");
            break;
          case 5:
            re = this.$t("monitor.status.canel");
            break;
          case 6:
            re = this.$t("monitor.status.locking");
            break;
          case 7:
            re = this.$t("monitor.status.unlock");
            break;
          default:
            re = this.$t("monitor.status.unactive");
        }
        return re;
      };
    }
  },
  data() {
    return {
      loading: true,
      // 弹框显示位置
      styleObject: {
        left: 0,
        top: 0
      }
    };
  },
  watch: {
    // 点击地图标注点后，弹框重定位
    tranLeft(n) {
      this.styleObject.left = n + "px";
    },
    tranTop(n) {
      this.styleObject.top = n + "px";
    },
    // 防止数据没加载时，进入详情页id为空报错
    car(n) {
      if (n) {
        this.loading = false;
      }
    }
  },
  methods: {
    // 跳转到车辆详情
    carInfoPage(type) {
      const route = {
        path: `car/info`,
        wholePath: `/monitor/car/info`,
        roleId: 1,
        meta: {
          title: `${this.$t("monitor.carManage")} - ${this.typeNames[type]}`
        },
        query: {
          id: this.car.id,
          lng: this.car.lng,
          lat: this.car.lat,
          type: type
        }
      };
      this.$router.push(route);
    },
    // 打开dialog，设置弹框位置
    open() {
      this.styleObject.left = this.tranLeft + "px";
      this.styleObject.top = this.tranTop + "px";
    },
    cancel() {
      // 通过父组件关闭弹框
      this.$emit("carDialogClose", null);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "carInfo") {
      from.meta.keepAlive = true;
    } else {
      from.meta.keepAlive = false;
    }
    next();
  }
};
</script>
<style lang="scss" scoped>
.el-col-24 {
  height: 26px;
  font-size: 15px;
}
::v-deep .el-dialog {
  position: absolute;
}
.el-dialog__wrapper {
  width: 500px;
  max-height: 400px;
}
.chassisNum {
  margin: 0 6px;
  font-weight: bold;
  font-size: 16px;
  color: #000;
}
.colorG {
  color: #28d228ff;
}
.colorR {
  color: #ccc;
}
::v-deep .el-dialog .el-dialog__headerbtn {
  top: 8px;
}
.infoBtn,
.lockBtn,
.unLockBtn {
  width: 80px;
  margin-right: 8px;
  border-radius: 30px;
  border: none;
}
.infoBtn {
  background: linear-gradient(to right, #378bfd, #1b62e7);
}
.lockBtn,
.unLockBtn {
  background: linear-gradient(to right, #1bd0c8, #09bdb5);
}
</style>
