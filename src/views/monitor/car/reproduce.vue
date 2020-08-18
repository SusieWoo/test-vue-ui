<template>
  <div class="reproduce">
    <!-- <div class="map"> -->
    <div>
      <el-date-picker
        v-model="range"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        :start-placeholder="$t('im.startTime')"
        :end-placeholder="$t('im.endTime')"
      ></el-date-picker>

      <el-button
        class="ml10 mb10"
        :loading="loading"
        @click="search"
        type="primary"
        icon="el-icon-search"
      >{{$t('common.search')}}</el-button>
      <el-button class="ml10 mb10" @click="exportTrace('route')" icon="el-icon-download">{{$t('monitor.track.index.exportTrack')}}</el-button>
      <el-button class="ml10 mb10" @click="exportTrace('car')" icon="el-icon-download">{{$t('monitor.track.index.exportCarCondition')}}</el-button>
      <el-button class="ml10 mb10" @click="exportTrace('data')" icon="el-icon-download">{{$t('monitor.track.index.exportData')}}</el-button>

      <div>{{$t('monitor.track.index.point')}}:{{point}} &nbsp; {{$t('monitor.track.index.totalMiles')}}:{{miles}} KM &nbsp; {{$t('monitor.track.index.totalOil')}}:{{oil}} L</div>
    </div>
    <truck-map :index="0" />
    <Export :iframe-filter="iframeFilter" @exportMethod="emailExcel" />
  </div>
  <!-- </div> -->
</template>
<script>
//在途重现
import { mapMutations } from "vuex";
import CarService from "@/api/monitor/car";
import TruckMap from "./../track-map/truck-map.vue";
import { truck } from "@/store/modules/truck";
import Export from "@/components/Export";
export default {
  props: {
    carTip: {
      type: Object,
      require: true
    }
  },
  components: {
    TruckMap,
    Export
  },
  data() {
    return {
      range: [],
      point: 0,
      miles: 0,
      oil: 0,
      tracePoints: [],
      searchIndex: 0,
      loading: false,
      iframeFilter: {
      },
      exportType: ""
    };
  },
  destroyed() {},
  mounted() {},
  methods: {
    ...mapMutations({
      CHANGE_ALL_POINTES: "CHANGE_ALL_POINTES"
    }),
    async emailExcel(email) {
      let obj = {
        carId: this.carTip.id,
        beginDate: this.range[0],
        endDate: this.range[1],
        email: email
      };
      if (this.exportType === "route") {
        obj.level = 11;
        obj.isAll = -1;
        const re = await CarService.exportTraces(obj);
        if (re) {
          this.$message.success(this.$t('export.receive'));
        }
      } else if (this.exportType === "car") {
        obj.level = 11;
        obj.isAll = 0;
        const re = await CarService.exportTraces(obj);
        if (re) {
          this.$message.success(this.$t('export.receive'));
        }
      } else if (this.exportType === "data") {
        const re = await CarService.exportTimelyData(obj);
        if (re) {
          this.$message.success(this.$t('export.receive'));
        }
      }
    },
    async search() {
      if (this.range.length === 0) {
        this.$message.warning($t('monitor.track.index.selectTime'));
        return;
      }
      this.queryConsum();
      this.loading = true;
      let obj = {
        carId: this.carTip.id,
        beginDate: this.range[0],
        endDate: this.range[1],
        level: 11
      };
      /**删掉begin */
      //  this.tracePoints = [];
      // for (var i = 0; i < 100; i++) {
      //   this.tracePoints.push({
      //     lat: parseFloat(14.685278) + (1 / 100),
      //     lon: parseFloat(121.019718) - (1 / 100),
      //     diffDistance:30
      //   });
      // }

      // if (this.tracePoints.length > 0) {
      //   this.CHANGE_ALL_POINTES(this.tracePoints);
      // }
      // this.searchIndex += 1;
      //  this.$EventBus.$emit("truck_init");
      //   this.$EventBus.$emit('set_truck_mileageTotal', 120)
      /**删掉 end*/
      const re = await CarService.trackVacuate(obj);
      this.loading = false;
      re.data.forEach((item, index, array) => {
        if (!item.statue.match(/未定位/)) {
          this.tracePoints.push(item);
        }
      });
      for (var i = 0; i < 100; i++) {
        this.tracePoints.push({
          lat: parseFloat(14.685278) + 1 / 100,
          lng: parseFloat(121.019718) + 1 / 100
        });
      }

      if (this.tracePoints.length > 0) {
        this.CHANGE_ALL_POINTES(this.tracePoints);
        this.$EventBus.$emit("truck_init");
      }
    },
    async queryConsum() {
      let obj = {
        carId: this.carTip.id,
        beginDate: this.range[0],
        endDate: this.range[1],
        level: 18
      };
      const re = await CarService.queryConsumption(obj);
      if (re.data) {
        this.miles = re.data.mileage;
        this.oil = re.data.oilConsumption;
        this.$EventBus.$emit("set_truck_mileageTotal", this.miles);
      }
    },
    exportTrace(type) {
      if(this.range.length===0){
        this.$message.warning($t('monitor.track.index.selectTime'));
        return;
      }
      this.exportType = type; 
      this.iframeFilter = {
        data: {
          isEmail: true
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.reproduce {
  position: relative;
  widows: 100%;
  height: 100%;
}
</style>
