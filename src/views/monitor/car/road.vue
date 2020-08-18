<template>
  <div class="road">
    <h-map
      class="map"
      :center="center"
      :zoom="zoom"
      :layer-language="this.$i18n.locale"
      :zoomrectangle-ui="false"
      :mapsettings-ui="false"
      :scalebar-ui="false"
      :distancemeasurement-ui="false"
      @ready="mapReady"
    >
      <template slot="topRight">
        <div>
          <el-button @click="toggleStation" type="primary">
            <i class="el-icon-s-home"></i>{{$t('user.station')}}
          </el-button>
        </div>
      </template>

      <h-dom-marker
        v-if="makerPosition"
        :position="makerPosition"
        :icon="{url: icon_car, size:{width:'16px',height:'16px'}}"
        :rotation="Number(direction)"
      />
      <div v-if="showStation">
        <h-dom-marker
          v-for="(marker,index) of stationList"
          :key="index"
          :icon="{url:icon_station, size:{width:'16px',height:'16px'}}"
          :position="{lng: marker.lng, lat: marker.lat}"
        />
      </div>

      <!-- <h-info-bubble ref="bubble" :position="bubblePosition">
        <template>
          <pop-card
            v-loading="popCardLoading"
            :data="dialogInfo"
            :title="title"
            @onLocus="onLocus"
            @onFollow="onFollow"
          />
        </template>
      </h-info-bubble>-->
    </h-map>
  </div>
</template>
<script>
//实时在途
let timer;
import { deduplication } from "@/utils/rules";
import icon_car from "@/assets/images/VehicleStatusOnline1.png";
import icon_station from "@/assets/images/sm-park.png";
import CarService from "@/api/monitor/car";
import basic from "./basic";
export default {
  props: {
    carTip: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      icon_car: icon_car,
      icon_station: icon_station,
      center: { lat: "39.19501", lng: "116.13956" },
      mapStyle: "",
      zoom: 5,
      defaultLayers: null,
      makerPosition: "",
      lastPosition: {},
      direction: 0,
      stationList: [],
      showStation: false
    };
  },
  destroyed() {
    clearInterval(timer);
  },
  mounted() {
    let count = 0;
    timer = setInterval(() => {
      count++;
      this.getTimePosition(count);
    }, 5000);

    this.getStations();
  },
  methods: {
    toggleStation() {
      this.showStation = !this.showStation;

      console.log("toggleStation", this.showStation);
    },

    tapMarker() {},
    mapReady({ H, map, ui, behavior, defaultLayers, platform }) {
      window.H = H;
      this.MAP = map;
      this.defaultLayers = defaultLayers;
      this.getTimePosition();
    },
    async getStations() {
      const re = await CarService.queryStations({});

      this.stationList = re.data;
    },
    async getTimePosition(count) {
      if (!this.carTip.id) {
        return;
      }
      const re = await CarService.queryTimelyMonitor({ carId: this.carTip.id });
      if (re.data) {
        this.direction = re.data.direction ? re.data.direction : 0;
        /***赋值为了造假数据，联调时候删除**/
        re.data.lat = 39.19501;
        re.data.lng = 116.13956;

        if (count) {
          re.data.direction = (count % 360) * 30;
          re.data.lat = parseFloat(39.19501) - count / 100;
          re.data.lng = parseFloat(116.13956) - count / 100;
        }
        /***赋值为了造假数据，联调时候删除***/
        this.MAP.setCenter({ lat: re.data.lat, lng: re.data.lng });
        this.makerPosition = { lat: re.data.lat, lng: re.data.lng };
        this.direction = re.data.direction;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.road {
  position: relative;
  widows: 100%;
  height: 100%;
  .map {
    position: relative;
    height: calc(100vh - 250px);
    padding: 10px 0;
  }
}
</style>
