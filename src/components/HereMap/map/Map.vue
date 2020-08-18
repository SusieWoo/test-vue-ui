<template>
  <div>
    <div ref="map" class="here-map" style="width: 100%; height: 100%; position: absolute;" />
    <div class="H_ui">
      <div class="H_l_top H_l_left">
        <slot name="topLeft" />
      </div>
      <div class="H_l_top H_l_center">
        <slot name="top" />
      </div>
      <div class="H_l_top H_l_right">
        <slot name="topRight" />
      </div>
      <div class="H_l_left H_l_top">
        <slot name="leftTop" />
      </div>
      <div class="H_l_left H_l_middle">
        <slot name="left" />
      </div>
      <div class="H_l_left H_l_bottom">
        <slot name="leftBottom" />
      </div>
      <div class="H_l_right H_l_top ">
        <slot name="rightTop" />
      </div>
      <div class="H_l_right H_l_middle">
        <slot name="right" />
      </div>
      <div class="H_l_right H_l_bottom">
        <slot name="rightBottom" />
      </div>
      <div class="H_l_bottom H_l_left">
        <slot name="bottomLeft" />
      </div>
      <div class="H_l_bottom H_l_center">
        <slot name="bottom" />
      </div>
      <div class="H_l_bottom H_l_right">
        <slot name="bottomRight" />
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'HereMap',
  props: {
    apiKey: {
      type: String
    },
    customUICss: {
      type: Boolean
    },
    center: {
      type: Object
    },
    zoom: {
      type: Number
    },
    mapType: {
      type: Object,
      // available value for tile : vector/raster
      // available value for type when tile is vector : normal
      // available value for layer when tile is vector and type is normal : map/truck/traffic/trafficincidents
      // available value for type when tile is raster : normal/satellite/terrain
      // available value for layer when tile is raster and type is normal : map/mapnight/base/basenight/xbase/xbasenight/trafficincidents/transit/labels
      // available value for layer when tile is raster and type is satellite/terrain : map/base/xbase/labels
      default: () => ({ tile: 'vector', type: 'normal', layer: 'map' })
    },
    mapStyle: {
      // yaml format
      type: String
    },
    zoomUi: {
      type: [Object, Boolean],
      default: () => ({ zoomSpeed: 4, fractionalZoom: true, alignment: 'right-bottom', slider: false, sliderSnaps: false })
    },
    zoomrectangleUi: {
      type: [Object, Boolean],
      default: () => ({ alignment: 'right-bottom' })
    },
    mapsettingsUi: {
      type: [Object, Boolean],
      default: () => ({ alignment: 'bottom-right', baseLayers: [], layers: [] })
    },
    scalebarUi: {
      type: [Object, Boolean],
      default: () => ({ alignment: 'bottom-right' })
    },
    distancemeasurementUi: {
      type: [Object, Boolean],
      default: () => ({ alignment: 'bottom-right' })
    },
    layerLanguage: {
      type: String,
      // available value: en-US/de-DE/es-ES/fi-FI/fr-FR/it-IT/nl-NL/pl-PL/pt-BR/pt-PT/ru-RU/tr-TR/zh-CN
      default: 'en'
    },
    uiLanguage: {
      type: String,
      default: 'en-US'
    }
  },
  computed: {
  },
  watch: {
    //经度
    'center.lng'(val, oldVal) {
      const { H, map, zoom, center } = this
      if (val !== oldVal && val >= -180 && val <= 180) {
        map.setCenter(new H.geo.Point(center.lat, val))
        map.setZoom(zoom)
      }
    },
    //纬度
    'center.lat'(val, oldVal) {
      const { H, map, zoom, center } = this
      if (val !== oldVal && val >= -74 && val <= 74) {
        map.setCenter(new H.geo.Point(val, center.lng))
        map.setZoom(zoom)
      }
    },
    zoom(val, oldVal) {
      const { map } = this
      if (val !== oldVal) {
        map.setZoom(val)
      }
    },
    layerLanguage(val, oldVal) {
      const { map, platform, mapType } = this
      const { tile, type, layer } = mapType
      if (val !== oldVal) {
        const defaultLayers = platform.createDefaultLayers({
          lg: val
        })
        map.setBaseLayer(defaultLayers[tile][type][layer])
      }
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    init(H) {
      if (this.map) {
        return
      }
      const $el = this.$refs.map
      const apiKey = this.apiKey || this._HMap().apiKey
      const platform = new H.service.Platform({
        'apikey': apiKey
      })
      this.platform = platform
      const defaultLayers = platform.createDefaultLayers({
        lg: this.layerLanguage
      })
      const { tile, type, layer } = this.mapType
      const { center, zoom, mapStyle } = this
      const map = new H.Map($el, defaultLayers[tile][type][layer], {
        zoom: zoom,
        center: { lng: center.lng, lat: center.lat },
        pixelRatio: window.devicePixelRatio || 1
      })
      this.map = map

      if (mapStyle) {
        const baseLayer = map.getBaseLayer()
        baseLayer.getProvider().setStyle(new H.map.Style(mapStyle))
      }

      const mapEvents = new H.mapevents.MapEvents(map)
      const behavior = new H.mapevents.Behavior(mapEvents)
      this.behavior = behavior

      const ui = new H.ui.UI(map, {
        zoom: this.zoomUi,
        zoomrectangle: this.zoomrectangleUi,
        mapsettings: this.mapsettingsUi,
        scalebar: this.scalebarUi,
        distancemeasurement: this.distancemeasurementUi,
        locale: this.uiLanguage
      })
      // const ui = H.ui.UI.createDefault(map, defaultLayers)
      this.ui = ui

      // add a resize listener to make sure that the map occupies the whole container
      window.addEventListener('resize', () => {
        map.getViewPort().resize()
      })

      this.$emit('ready', { H, map, ui, behavior, defaultLayers, platform })
    },
    initMap(H) {
      this.H = H
      this.init(H)
    },
    // core script, for render maps, map layers, map objects
    getMapCoreScript() {
      if (!global.H) {
        global.H = {}
        global.H._preloader = new Promise(resolve => {
          const $script = document.createElement('script')
          $script.src = 'https://js.api.here.com/v3/3.1/mapsjs-core.js'
          $script.onload = function() {
            resolve(global.H)
          }
          global.document.body.appendChild($script)
        })
        return global.H._preloader
      } else if (!global.H._preloader) {
        return Promise.resolve(global.H)
      } else {
        return global.H._preloader
      }
    },
    // service script, supports map tile retrieval, routing, geocoding, etc.
    getMapServiceScript() {
      if (!global.H.service) {
        global.H.service = {}
        global.H.service._preloader = new Promise(resolve => {
          const $script = document.createElement('script')
          $script.src = 'https://js.api.here.com/v3/3.1/mapsjs-service.js'
          $script.onload = function() {
            resolve(global.H.service)
          }
          global.document.body.appendChild($script)
        })
        return global.H.service._preloader
      } else if (!global.H.service._preloader) {
        return Promise.resolve(global.H.service)
      } else {
        return global.H.service._preloader
      }
    },
    // event script, enable user-interaction with the map, including map panning and pinch-to-zoom.
    getMapEventScript() {
      if (!global.H.mapevents) {
        global.H.mapevents = {}
        global.H.mapevents._preloader = new Promise(resolve => {
          const $script = document.createElement('script')
          $script.src = 'https://js.api.here.com/v3/3.1/mapsjs-mapevents.js'
          $script.onload = function() {
            resolve(global.H.mapevents)
          }
          global.document.body.appendChild($script)
        })
        return global.H.mapevents._preloader
      } else if (!global.H.mapevents._preloader) {
        return Promise.resolve(global.H.mapevents)
      } else {
        return global.H.mapevents._preloader
      }
    },
    // ui script, pre-built cross-browser UI components (such as base map settings, zoom control, map scale) that can be added to the map.
    getMapUIScript() {
      if (!global.H.ui || !global.H.ui.UI) {
        const customUICss = this.customUICss || this._HMap().customUICss
        if (!customUICss) {
          import('../ui-theme/mapjs-ui.css')
        }

        global.H.ui = {}
        global.H.ui._preloader = new Promise(resolve => {
          const $script = document.createElement('script')
          $script.src = 'https://js.api.here.com/v3/3.1/mapsjs-ui.js'
          $script.onload = function() {
            resolve(global.H.ui)
          }
          global.document.body.appendChild($script)
          /* const $link = document.createElement('link')
          $link.rel = 'stylesheet'
          $link.href = 'https://js.api.here.com/v3/3.1/mapsjs-ui.css'
          global.document.head.appendChild($link)*/
        })
        return global.H.ui._preloader
      } else if (!global.H.ui._preloader) {
        return Promise.resolve(global.H.ui.UI)
      } else {
        return global.H.ui._preloader
      }
    },
    // clustering script, marker clustering.
    getMapClusteringScript() {
      if (!global.H.clustering) {
        global.H.clustering = {}
        global.H.clustering._preloader = new Promise(resolve => {
          const $script = document.createElement('script')
          $script.src = 'https://js.api.here.com/v3/3.1/mapsjs-clustering.js'
          $script.onload = function() {
            resolve(global.H.clustering)
          }
          global.document.body.appendChild($script)
        })
        return global.H.clustering._preloader
      } else if (!global.H.clustering._preloader) {
        return Promise.resolve(global.H.clustering)
      } else {
        return global.H.clustering._preloader
      }
    },
    async reset() {
      const { getMapCoreScript, getMapServiceScript, getMapUIScript, getMapEventScript, getMapClusteringScript, initMap } = this
      getMapCoreScript().then(H => {
        Promise.all([getMapServiceScript(), getMapUIScript(), getMapEventScript(), getMapClusteringScript()]).then(() => {
          initMap(H)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  [class^=H_l_] {
    pointer-events: visiblePainted;
    pointer-events: auto;
  }
</style>
