<template>
  <div class="map-modal">
    <el-form-item :label="label" :prop="prop">
      <el-input
        :style="{width: valueWidth}"
        readonly
        v-bind="$attrs"
        :value="showValue"
        @focus="handleOpen"
      />
    </el-form-item>

    <el-dialog
      :close-on-click-modal="false"
      width="700px"
      :title="title"
      :visible.sync="dialogVisible"
    >
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="formInline.keywords" style="width: 300px" :placeholder="$t('ajComponents.addressSearchKeywrod')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">{{ $t('common.research') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear">{{ $t('common.clear') }}</el-button>
        </el-form-item>
      </el-form>
      <h-map
        style="height:300px;box-sizing: border-box"
        :center="center"
        :zoom="zoom"
        :layer-language="this.$i18n.locale"
        :zoom-ui="{alignment: 'right-bottom'}"
        :zoomrectangle-ui="false"
        :mapsettings-ui="false"
        :scalebar-ui="false"
        :distancemeasurement-ui="{alignment: 'right-top'}"
        @ready="mapReady"
      />
      <div class="bottom-form">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item :label="$t('ajComponents.GCJ02Lng')">
            <el-input
              v-model="formInline.lng"
              :placeholder="$t('ajComponents.placeLng')"
              @blur="handleInputLatLng($event, 1)"
            />
          </el-form-item>
          <el-form-item :label="$t('ajComponents.GCJ02Lat')">
            <el-input
              v-model="formInline.lat"
              :placeholder="$t('ajComponents.placeLat')"
              @blur="handleInputLatLng($event, 2)"
            />
          </el-form-item>
          <el-form-item :label="$t('ajComponents.addressDetails')">
            <el-input v-model="formInline.title" style="width: 520px" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" :disabled="!!!formInline.title" @click="handleConfirm">{{ $t('common.confirm') }}</el-button>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import utils from '@/utils/map';
const center = { lat: '39.907950481032636', lng: '116.38146057128907' };
export default {
  name: 'AjMapModal',
  props: {
    label: String,
    title: String,
    value: String,
    valueWidth: String,
    prop: String,
    centerInfo: {
      type: Object,
      default: () => center
    }
  },
  data() {
    return {
      showValue: this.value,
      platform: {},
      center: center,
      zoom: 10,
      dialogVisible: false,
      formInline: {
        keywords: '',
        ...center,
        title: ''
      },
      flag: false
    };
  },
  watch: {
    value(newv) {
      console.log('更新', newv);
      this.showValue = newv;
      this.formInline.title = newv;
    },
    /*centerInfo: {
      handler(newv, oldv) {
        if (oldv && newv.lat && newv.lng) {
          console.log('经纬度更新=> ', newv);
          this.flag = true;
          const parseLat = newv.lat > 300 ? newv.lat / 1000000 : newv.lat;
          const parseLng = newv.lng > 300 ? newv.lng / 1000000 : newv.lng;
          this.formInline.lat = parseLat;
          this.formInline.lng = parseLng;
          this.center = {
            lat: parseLat,
            lng: parseLng
          };
        }
      },
      deep: true
    }*/
  },
  mounted() {
    // console.log(this.value)
  },
  methods: {
    handleOpen() {
      this.dialogVisible = true;
    },
    //here地图
    mapReady({ H, map, ui, behavior, defaultLayers, platform }) {
      window.H = H;
      this.MAP = map;
      this.defaultLayers = defaultLayers;
      this.platform = platform;
      this.handleParsePosition(this.center);
      this.MAP.addEventListener('tap', evt => {
        this.formInline.title = '';
        let coord = map.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY
        );
        this.setMarker(coord);
        this.formInline.lat = coord.lat;
        this.formInline.lng = coord.lng;
        this.handleParsePosition(coord, 'init');
      });
    },
    setMarker(coord) {
      let parisMarker = new window.H.map.Marker(coord);
      parisMarker.icon.b.x = 7.5; // w的一半
      parisMarker.icon.b.y = 18; // h - 2
      parisMarker.icon.c.w = 15;
      parisMarker.icon.c.h = 20;
      let markders = this.MAP.getObjects();
      if (markders.length > 0) this.MAP.removeObjects(markders);
      this.MAP.addObject(parisMarker);
    },
    handleParsePosition(position, type) {
      utils.getRevGeocode(position).then(res => {
        if (!type || !this.flag) this.formInline.title = res.title;
        /* var geocoder = this.platform.getSearchService(),
            geocodingParameters = {
              qq: `street=${res.address.street};city=${res.address.city};country=${res.address.county}`
            };
            geocoder.geocode(
              geocodingParameters,
              (successRes) => {
                console.log('成功=>', successRes)
              },
              (err) => {
                console.log('失败=>', err)
              }
            ); */
      });
    },
    handleInputLatLng(e, type) {
      const obj = {
        lng: this.formInline.lng,
        lat: this.formInline.lat
      };
      if (type === 1) obj.lng = e.target.value;
      else obj.lat = e.target.value;
      this.MAP.setCenter(obj);
      this.MAP.setZoom(10);
      this.handleParsePosition(obj);
    },
    handleSearch() {
      if (this.formInline.keywords.trim() === '') {
        this.$message.error(this.$t('ajComponents.placeAddress'));
        return;
      }
      const pservice = this.platform.getSearchService();
      pservice.geocode(
        { q: this.formInline.keywords, lang: 'zh' },
        res => {
          const resD = res.items[0];
          if (!resD) {
            this.$message.error(this.$t('ajComponents.noSearchResult'));
            return;
          }
          this.formInline.title = resD.title;
          this.formInline.lat = resD.position.lat * 1000;
          this.formInline.lng = resD.position.lng * 1000;
          this.setMarker(resD.position);
          this.MAP.setCenter(resD.position);
          this.MAP.setZoom(10);
        },
        () => {
          this.$message.error(this.$t('ajComponents.errTip'));
        }
      );
    },
    clear() {
      this.formInline.keywords = '';
    },
    handleConfirm() {
      // console.log(this.formInline)
      this.$emit('input', this.formInline.title);
      this.$emit('confirm', this.formInline);
      this.showValue = this.formInline.title;
      this.clear();
      this.dialogVisible = false;
    }
  }
};
</script>

<style scoped lang="less">
.map-modal {
  /deep/ .here-map {
    position: relative !important;
    box-sizing: border-box;
  }
}
.demo-form-inline {
  /deep/ .el-form-item {
    margin-bottom: 20px;
  }
}
.bottom-form {
  padding-top: 20px;
}
</style>
