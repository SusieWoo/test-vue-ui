<template>
  <div class="bm-view">
    <h-map
      class="map"
      :center="center"
      :zoom="zoom"
      :layer-language="lang"
      :zoomrectangle-ui="false"
      :mapsettings-ui="false"
      :scalebar-ui="false"
      :zoom-ui="false"
      :distancemeasurement-ui="false"
      @ready="mapReady"
    >
      <template slot="bottomLeft">
        <player-box
          ref="toolbar"
          class="player"
          :distance="totalMile? '-' : `${totalMile}/${mileageTotal}`"
        />
      </template>
      <template slot="bottomRight">
        <el-card shadow="always">
          <ul>
            <li v-for="item in colors" :key="item.name">
              <i :style="{backgroundColor:item.key}" />
              {{ item.name }}
            </li>
          </ul>
        </el-card>
      </template>
      <!-- <h-info-bubble ref="bubble" :position="position">
      <template>
        <pop-card
          v-loading="popCardLoading"
          :data="dialogInfo"
          :title="title"
          :type="2"
        />
      </template>
      </h-info-bubble>-->
    </h-map>
    <div></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { trunk } from "@/store/modules/truck";
import car_point from "@/assets/images/car_point1.png";
import start_img from "@/assets/images/sm-start.png";
import end_img from "@/assets/images/sm-end.png";
import common from "@/utils/map.js";
// import PopCard from '@/components/Popcard'
import PlayerBox from "./player-box.vue";
import mapCommon from "@/utils/map.js";
import { debounce } from "@/utils/debounce";
import resize from "@/views/monitor/mixins/resize";

export default {
  name: "TruckMap",
  components: {
    // PopCard,
    PlayerBox
  },
  mixins: [resize],
  props: {
    index: {
      type: Number,
      default: 0,
      required: true
    }
  },
  data() {
    return {
      colors: common.speedColors,
      playShow: false,
      mileageTotal: "",
      popCardLoading: false,
      dialogInfo: {
        teamName: "",
        speed: 0,
        reportTime: 0,
        status: "",
        lat: "",
        lng: "",
        address: ""
      },
      title: "",
      center: { lat: "14.685278", lng: "121.019718" },
      group: null,
      first: null,
      map: null,
      zoom: 13,
      points: [], // 原始轨迹
      pointArray: [], // 轨迹分段
      CAR: null,
      CAR_START: null,
      CAR_END: null,
      POLYLINE: [],
      position: { lng: 0, lat: 0 },
      times: 1000, // 定义播放倍速
      play_index: 0, // 播放第几个点
      vin: ""
    };
  },
  computed: {
    ...mapGetters(["truckAllPoints", "lang"]),
    /*
     * 计算总里程
     * */
    totalMile() {
      let total = 0;
      console.log("play_index:", this.play_index);
      if (this.play_index >= 0) {
        const points = this.points.slice(0, this.play_index + 1);
        points.map(value => {
          total = parseFloat(total) + value.diffDistance;
        });
        return parseFloat(total).toFixed(2);
      }
      return 0;
    }
  },
  mounted() {
    this.$_resizeHandler = debounce(() => {
      if (this.MAP) {
        this.MAP.getViewPort().resize();
      }
    }, 100);
    this.$EventBus.$on("truck_player_onPlay", s => {
      if (s === 1) {
        this.onPlay(s);
      } else {
        this.onPause(s);
      }
    });
    this.$EventBus.$on("truck_player_onGo", foot => {
      this.onGo(foot);
    });
    this.$EventBus.$on("set_truck_player_times", times => {
      this.times = times;
    });
    this.$EventBus.$on("set_truck_mileageTotal", mileageTotal => {
      this.mileageTotal = mileageTotal;
    });
    this.$EventBus.$on("truck_init", () => {
      console.log("busEvent:on trigger");
      if (this.MAP.getObjects() && this.MAP.getObjects().length > 0) {
        console.log("getObjects:on trigger");
        this.MAP.removeObjects(this.MAP.getObjects());
      }
      if (this.truckAllPoints && this.truckAllPoints.length > 1) {
        this.points = this.truckAllPoints;
        this.mapInit();
        this.playShow = true;
      } else {
        this.playShow = false;
        if (this.player) {
          clearTimeout(this.player);
        }
        this.CHANGE_ALL_POINTES([]);
      }
      this.$EventBus.$emit("truck_list_filterDisabled", false);
    });
    this.$route.params && this.$route.params.vinCode
      ? (this.vin = this.$route.params.vinCode)
      : null;
  },
  beforeDestroy() {
    if (this.player) {
      clearTimeout(this.player);
    }
    this.$EventBus.$off("truck_player_onPlay");
    this.$EventBus.$off("truck_player_switch");
    this.$EventBus.$off("truck_player_onGo");
    this.$EventBus.$off("truck_init");
    this.CHANGE_PLAY_INDEX(0);
    this.CHANGE_ALL_POINTES([]);
    this.CHANGE_PLAY_STATUS(0);
  },
  methods: {
    ...mapMutations({
      CHANGE_PLAY_STATUS: "CHANGE_PLAY_STATUS",
      CHANGE_PLAY_INDEX: "CHANGE_PLAY_INDEX",
      CHANGE_ALL_POINTES: "CHANGE_ALL_POINTES"
    }),
    // 点击窗口事件
    infoW(env, marker) {
      // 更换窗口位置
      this.bubblePosition = env.target.getGeometry();
      this.vin = marker.vin;
      // this.$refs.bubble.originInstance.open()
      this.getTruckState(marker);
      // 以点击点为中心
      this.MAP.setCenter(env.target.getGeometry());
    },
    getTruckState(marker) {
      // 清空上一个窗口的数据
      this.title = "";
      this.dialogInfo.lat = "";
      this.dialogInfo.lng = "";
      this.dialogInfo.status = "";
      this.dialogInfo.teamName = "";
      this.dialogInfo.reportTime = "";
      this.dialogInfo.address = "";
      if (marker) {
        this.title = marker.truckPlate;
        this.dialogInfo.lat = marker.latitude;
        this.dialogInfo.lng = marker.longitude;
        // 轨迹回放无状态，仅显示速度
        this.dialogInfo.status = 2;
        this.dialogInfo.speed = marker.speed;
        this.dialogInfo.teamName = marker.orgName;
        this.dialogInfo.reportTime = marker.reportTime;
        this.dialogInfo.address = marker.address;
      }
    },
    // 关闭窗口
    onClose() {
      this.dialog_IsShow = false;
    },
    /*
     * 清空开始结束点和车辆点
     * */
    mapClearPoint() {
      this.MAP.removeObject(this.CAR);
      this.MAP.removeObject(this.CAR_START);
      this.MAP.removeObject(this.CAR_END);
    },
    mapCenter() {
      mapCommon.setCenter(this.MAP, this.points[0], 12);
    },
    mapSomePoints() {
      this.CAR_START = null;
      this.CAR_END = null;
      this.CAR_START = common.setMarker(this.points[0], {
        url: start_img,
        width: 30,
        height: 30
      });
      this.CAR_END = common.setMarker(this.points[this.points.length - 1], {
        url: end_img,
        width: 30,
        height: 30
      });
      this.CAR_START.setZIndex(998);
      this.CAR_END.setZIndex(998);
      this.MAP.addObject(this.CAR_START);
      this.MAP.addObject(this.CAR_END);
      this.CAR = common.setMarker(
        this.points[this.index],
        mapCommon.setDomIcon({
          url: car_point,
          style: { width: "30px", height: "30px", cursor: "pointer" }
        })
      );
      this.setCar(this.points[this.index]);
    },
    /*
     * 画出车辆对象
     * */
    setCar(point) {
      this.CAR.setGeometry(common.setPoint(point));
      /* 注意，接口返回角度是逆时针得到的角度，此处角度加负号*/
      this.CAR.setIcon(
        mapCommon.setDomIcon({
          url: car_point,
          style: {
            width: "30px",
            height: "30px",
            cursor: "pointer",
            transform: `rotate(${point.direction}deg)`
          }
        })
      );
      this.CAR.setZIndex(999);
      this.MAP.addObject(this.CAR);
      this.MAP.setCenter(common.setPoint(point));
      this.position.lat = point.latitude;
      this.position.lng = point.longitude;
      const that = this;
      that.CAR.addEventListener("tap", function($event) {
        that.infoW($event, point);
      });
      this.getTruckState(point);
    },

    /*
     * 播放
     * */
    onPlay() {
      this.$EventBus.$emit("truck_list_filterDisabled", true);
      const timeOutFunc = () => {
        let i = this.play_index;
        if (i < this.points.length - 1) {
          i++;
          this.play_index = i;
          this.CHANGE_PLAY_INDEX(i);
          this.setCar(this.points[i]);
          // 定义播放器
          this.player = setTimeout(() => {
            timeOutFunc();
          }, this.times);
        } else {
          setTimeout(() => {
            this.play_index = 0;
            this.CHANGE_PLAY_INDEX(this.play_index);
            this.CHANGE_PLAY_STATUS(0);
          }, this.times);
          this.$EventBus.$emit("truck_list_filterDisabled", false);
        }
      };
      setTimeout(() => {
        timeOutFunc();
      }, this.times);
    },
    /*
     * 暂停
     * */
    onPause() {
      if (this.player) {
        clearTimeout(this.player);
      }
    },
    /*
     * 前进和后退
     * */
    onGo(index) {
      this.play_index = index;
      this.CHANGE_PLAY_INDEX(this.play_index);
      this.setCar(this.points[index]);
    },

    mapTruckColor() {
      // 增加 try catch 避免删除不存在的对象
      try {
        for (const p of this.POLYLINE) {
          console.log(p);
          if (p) {
            this.MAP.removeObject(p);
          }
        }
      } catch (e) {
        console.log(e);
      }
      this.POLYLINE = [];
      console.log("pointArray:", this.pointArray);
      this.pointArray.map(item => {
        const polyline = common.polylineArray(item);
        console.log("polyline", polyline);
        this.POLYLINE.push(polyline);
        this.MAP.addObject(polyline);
      });
    },
    pointInit(s) {
      const func = s ? "autoColor" : "speedColor";
      this.pointArray = common[func](this.points);
      this.mapTruckColor();
    },
    mapInit() {
      if (this.MAP.getObjects() && this.MAP.getObjects().length > 0) {
        this.MAP.removeObjects(this.MAP.getObjects());
      }
      this.pointInit(false);
      this.mapSomePoints();
      this.mapCenter();
    },
    mapReady({ BMap, map }) {
      window.BMap = BMap;
      this.MAP = map;
      if (this.points && this.points.length > 0) {
        this.mapInit();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.bm-view {
  position: relative;
  height: calc(100vh - 250px);

  border-radius: 4px;
  width: 100%;
  min-height: 570px;
  padding: 10px 0;
}
.map {
  width: 100%;
  height: 100%;
  position: absolute;
}
.player {
  background-color: #000c2f;
  opacity: 0.75;
  height: 60px;
  border-bottom: 1px transparent solid;
  border-image: linear-gradient(
      to right,
      #162e62,
      #a9b8d4,
      #162f64,
      #b3bfd1,
      #1f3a73
    )
    1 10;
}
.el-card {
  width: 150px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 9;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  ul {
    list-style-type: none;
    padding: 0 0;
  }
  li {
    line-height: 20px;
    i {
      display: inline-block;
      width: 12px;
      height: 12px;
      vertical-align: center;
      margin-right: 5px;
      border-radius: 50px;
    }
  }
}
</style>
