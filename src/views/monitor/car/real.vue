<template>
  <el-container class="view-container h">
    <CarDetails :query="this.$route.query"></CarDetails>
    <div id="real" class="wh h"></div>
  </el-container>
</template>
<script>
  import lastlocationval from '@/directive/lastlocationval' // 逆地理
  import CarDetails from '@/components/CarDetail'
  import BMap from 'BMap'
  import MapApi from '@/utils/map'
  export default {
    components: {
      CarDetails
    },
    directives: {
      lastlocationval
    },
    data() {
      return {
        center: { lng: 0, lat: 0 },
        zoom: 3,
        map: null,
        historyPath: [
          {
            'lng': 116.297611,
            'lat': 40.047363
          },
          {
            'lng': 116.302839,
            'lat': 40.048219
          },
          {
            'lng': 116.308301,
            'lat': 40.050566
          }
        ],
        paths: [],
      }
    },
    mounted() {
      this.initMap()
    },
    methods: {
      initMap() {
        // 初始化地图
        this.map = new BMap.Map('real')
        // 清空地图点信息
        this.map.clearOverlays()
        // 设置地图中心点
        // this.map.centerAndZoom('北京', 10)
        this.map.centerAndZoom(MapApi.setPoint(116.297611, 40.047363), 17)
        this.map.addControl(MapApi.addControl())
        // 支持缩放
        this.map.enableScrollWheelZoom(true)
        this.paths = MapApi.speedColor(this.historyPath)
        this.paths.map((item) => {
          const polyline = MapApi.polylineArray(item)
          this.map.addOverlay(polyline)
        })
        const l = this.historyPath.length - 1
        const marker = this.historyPath[l]
        this.map.centerAndZoom(MapApi.setPoint(marker.lng, marker.lat), 17)
        const lmarker = MapApi.setMarker(marker)
        lmarker.setRotation(marker.direction)
        this.map.addOverlay(lmarker)
        let paths = [
          {
          'lng': 116.305732,
          'lat': 40.054957
          },
          {
            'lng': 116.305742,
            'lat': 40.054957
          },
          {
            'lng': 116.305752,
            'lat': 40.054957
          },
          {
            'lng': 116.305762,
            'lat': 40.054957
          },
          {
            'lng': 116.305772,
            'lat': 40.054957
          },
          {
            'lng': 116.304754,
            'lat': 40.057953
          },
          {
            'lng': 116.306487,
            'lat': 40.058312
          },
          {
            'lng': 116.307223,
            'lat': 40.056379
          }
        ]
        let i = 0
        const timer = setInterval(()=>{
          if (i < paths.length) {
            this.historyPath.push(paths[i])
            i++
            this.map.clearOverlays()
            this.paths = MapApi.speedColor(this.historyPath)
            this.paths.map((item) => {
              const polyline = MapApi.polylineArray(item)
              this.map.addOverlay(polyline)
            })
            const l = this.historyPath.length - 1
            const marker = this.historyPath[l]
            this.map.centerAndZoom(MapApi.setPoint(marker.lng, marker.lat), 17)
            const icon = '/src/assets/images/sm-park.png'
            // 显示当前点
            const lmarker = MapApi.setMarker(marker)
            lmarker.setRotation(marker.direction)
            this.map.addOverlay(lmarker)
          } else {
            clearInterval(timer)
          }
        }, 2000)
      },

    }
  }
</script>
<style lang="scss" scoped>
  .BMap_noprint{
    background-size: cover;
  }
  .wh{
    min-height: 600px;
    padding-top: 30px;
    margin-top: 10px;
  }
  .bm-view {
    width: 100%;
    height: auto;
    padding: 10px 0;
  }
  .scatter {
    width: 100%;
    height: 100%;
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 3px 10px 10px 10px;
    .list{
      width: 300px;
      margin-right: 10px;
    }
    .map{
      width:calc(100% - 280px);
    }
  }
  .el-card{
    position: absolute;
    bottom: 20px;
    right:20px;
    z-index: 9;
    background-color:rgba(0,0,0,0.6) ;
    color:#fff;
    border: none;
    li{
      line-height: 20px;
      i{
        display: inline-block;
        width:12px;
        height:12px;
        vertical-align: center;
        margin-right:5px;
        border-radius: 50px;
      }
    }
  }
</style>
