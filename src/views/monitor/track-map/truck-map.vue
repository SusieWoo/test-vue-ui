<template>
  <div>
    <div class="bm-view">
      <baidu-map
        class="bm-view"
        :map-click="false"
        :center="center"
        :zoom="zoom"
        :min-zoom="5"
        :max-zoom="15"
        :scroll-wheel-zoom="true"
        @ready="mapReady">
        <pop-card
          v-if="dialog_IsShow"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :position="{lng: position.lng, lat: position.lat}"
          :data="dialogInfo"
          :title="title"
          :type="2"
          :active="active"
          @mouseover.native="active = true"
          @mouseleave.native="active = false"
          @onClose="onClose" />
      </baidu-map>
    </div>
    <player-box class="player" />
  </div>

</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import car_point from '@/assets/images/car_point1.png';
import start_img from '@/assets/images/sm-start.png';
import end_img from '@/assets/images/sm-end.png';
import park_img from '@/assets/images/sm-park.png'
import Bus from '@/utils/eventBus.js';
import common from '@/utils/commonMap.js'
import PopCard from '@/components/Popcard'
import PlayerBox from './player-box.vue'

export default {
  name: 'TruckMap',
  components: {
    PopCard,
    PlayerBox
  },
  props: {
    index:{
      type: Number,
      default: 0,
      required: true
    }
  },
  data() {
    return {
      playShow: false,
      loading: false,
      dialogInfo: {
        teamName: '',
        speed: 0,
        oil: 0,
        autoState: '',
        time: '',
        location: ''
      },
      dialog_IsShow: false,
      active: false,
      title: '',
      center: { lng: 116.404, lat: 39.915 },
      group: null,
      first: null,
      map: null,
      zoom: 11,
      points: [], // 原始轨迹
      pointArray: [], // 轨迹分段
      CAR:null,
      CAR_START:null,
      CAR_END:null,
      POLYLINE:[],
      PARKS: [],
      position:{ lng: 0, lat: 0 },
      times: 500, // 定义播放倍速
      play_index: 0, // 播放第几个点
      vin: ''
    }
  },
  computed: {
    ...mapGetters([
      'truckAllPoints'
    ])
  },
  mounted() {
    Bus.$on('truck_player_onPlay', (s) => {
      if(s === 1) {
        this.onPlay(s)
      }else{
        this.onPause(s)
      }
    });
    Bus.$on('truck_player_times', (s) => {
      this.times = s
    });
    Bus.$on('truck_player_onGo', (foot) => {
      this.onGo(foot)
    });
    Bus.$on('truck_init', () => {
      this.MAP.clearOverlays()
      if(this.truckAllPoints && this.truckAllPoints.length > 1) {
        this.points = this.truckAllPoints
        this.mapInit()
        this.playShow = true
      }else{
        this.playShow = false
        if (this.player) {
          clearTimeout(this.player);
        }
        this.CHANGE_ALL_POINTES([]);
      }
      Bus.$emit('truck_list_filterDisabled', false)
    });
    Bus.$on('truck_stop_init', (parksPoints) => {
      this.PARKS.forEach(park => {
        this.MAP.removeOverlay(park)
      })
      this.mapParkPoints(parksPoints)
    });
    this.$route.params && this.$route.params.vinCode ?this.vin = this.$route.params.vinCode:null
  },
  beforeDestroy() {
    if (this.player) {
      clearTimeout(this.player);
    }
    Bus.$off('truck_player_onPlay')
    Bus.$off('truck_player_times')
    Bus.$off('truck_player_onGo')
    Bus.$off('truck_init')
    this.CHANGE_PLAY_INDEX(0);
    this.CHANGE_ALL_POINTES([]);
    this.CHANGE_PLAY_STATUS(0);
  },
  methods: {
    ...mapMutations({
      'CHANGE_PLAY_STATUS':'truck/CHANGE_PLAY_STATUS',
      'CHANGE_PLAY_INDEX':'truck/CHANGE_PLAY_INDEX',
      'CHANGE_ALL_POINTES':'truck/CHANGE_ALL_POINTES'
    }),
    // 点击窗口事件
    infoW(marker) {
      // 更换窗口位置
      this.position.lat = marker.latitude
      this.position.lng = marker.longitude
      // 显示窗口加载
      this.dialog_IsShow = true
      // 加载当前窗口数据
      this.getTruckState(marker)
    },
    getTruckState(marker) {
      // 清空上一个窗口的数据
      this.title = ''
      this.dialogInfo.autoState = ''
      this.dialogInfo.teamName = ''
      this.dialogInfo.speed = 0
      this.dialogInfo.oil = 0
      this.dialogInfo.time = ''
      this.dialogInfo.location = ''
      if(marker) {
        this.title = marker.truckPlate
        this.dialogInfo.autoState = marker.autoDriverFlag
        this.dialogInfo.teamName = marker.teamName
        this.dialogInfo.speed = marker.speed
        this.dialogInfo.oil = marker.avgOil
        this.dialogInfo.time = marker.reportTime
        this.dialogInfo.location = marker.address
      }

    },
    // 关闭窗口
    onClose() {
      this.dialog_IsShow = false
    },
    /*
       * 清空开始结束点和车辆点
       * */
    mapClearPoint() {
      this.MAP.removeOverlay(this.CAR);
      this.MAP.removeOverlay(this.CAR_START);
      this.MAP.removeOverlay(this.CAR_END);
    },
    mapCenter() {
      var point = new BMap.Point(this.points[0].longitude, this.points[0].latitude)
      this.MAP.centerAndZoom(point, 7)
    },
    mapParkPoints(parksPoints) {
      this.PARKS = []
      parksPoints.forEach(point => {
        const park = common.setMarker(point, { url: park_img, width: 30, height: 30 })
        park.setZIndex(998)
        this.MAP.addOverlay(park)
        this.PARKS.push(park)
      })
    },
    mapSomePoints() {
      this.CAR_START = null
      this.CAR_END = null
      console.log(this.points[0])
      this.CAR_START = common.setMarker(this.points[0], { url: start_img, width: 30, height: 30 });
      this.CAR_END = common.setMarker(this.points[this.points.length - 1], { url: end_img, width: 30, height: 30 });
      this.CAR_START.setTop(true);
      this.CAR_END.setTop(true);
      this.MAP.addOverlay(this.CAR_START);
      this.MAP.addOverlay(this.CAR_END);
      this.CAR = common.setMarker(this.points[this.index], { url: car_point, width: 33, height: 33 });
      this.setCar(this.points[this.index]);

      this.PARKS.forEach(park => {
        this.MAP.addOverlay(park)
      })
    },
    /*
       * 画出车辆对象
       * */
    setCar(point) {
      this.CAR.setPosition(common.setPoint(point));
      /* 注意，接口返回角度是逆时针得到的角度，此处角度加负号*/
      this.CAR.setRotation(point.direction);
      this.CAR.setTop(true);
      this.MAP.addOverlay(this.CAR);
      this.MAP.setCenter(common.setPoint(point));
      this.position.lat = point.latitude
      this.position.lng = point.longitude
      const that = this;
      that.CAR.addEventListener('click', function(e) {
        that.infoW(point)
      })
      this.getTruckState(point);
    },

    /*
       * 播放
       * */
    onPlay() {
      Bus.$emit('truck_list_filterDisabled', true)
      const timeOutFunc = () => {
        let i = this.play_index;
        if (i < this.points.length - 1) {
          i++;
          this.play_index = i
          this.CHANGE_PLAY_INDEX(i)
          this.setCar(this.points[i])
          // 定义播放器
          this.player = setTimeout(() => {
            timeOutFunc()
          }, this.times);
        } else {
          setTimeout(() => {
            this.play_index = 0
            this.CHANGE_PLAY_INDEX(this.play_index)
            this.CHANGE_PLAY_STATUS(0)
          }, this.times)
          Bus.$emit('truck_list_filterDisabled', false)
        }
      };
      setTimeout(() => {
        timeOutFunc()
      }, this.times)
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
      this.play_index = index
      this.CHANGE_PLAY_INDEX(this.play_index)
      this.setCar(this.points[index])
    },

    mapTruckColor() {
      for(const p of this.POLYLINE) {
        this.MAP.removeOverlay(p)
      }
      this.POLYLINE = [];
      this.pointArray.map((item) => {
        const polyline = common.polylineArray(item)
        this.POLYLINE.push(polyline);
        this.MAP.addOverlay(polyline)
      })
    },
    pointInit(s) {
      const func = s?'autoColor':'speedColor';
      this.pointArray = common[func](this.points)
      this.mapTruckColor()
    },
    mapInit() {
      this.MAP.clearOverlays()
      this.pointInit(false)
      this.mapSomePoints()
      this.mapCenter()
    },
    mapReady({ BMap, map }) {
      window.BMap = BMap
      this.MAP = map
      if(this.points && this.points.length > 0) {
        this.mapInit();
      }
    },
    /*
       * 计算总里程
       * */
    totalMile(points, i) {
      let total = 0;
      if (i >= 0) {
        points = points.slice(0, i + 1)
      }
      points.map((value) => {
        total = parseFloat(total) + value.diffDistance
      })
      return parseFloat(total).toFixed(2);
    }
  }
}
</script>
<style scoped>
  .bm-view {
    border-radius:4px;
    width: 100%;
    min-height: 610px;
    height: calc(100vh - 162px);
    overflow: hidden;
  }
  .player{
    width: 100%;
    height: 80px;
  }

</style>
