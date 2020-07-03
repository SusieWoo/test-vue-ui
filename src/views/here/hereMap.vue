<template>
  <div class="here">test
    <div class="map-area">
    <h-map 
    :center="{ lat: 41.481175, lng: 123.253118 }"
    :zoom="12.5"
    :style="{ height: '500px' }"
    :map-style="mapStyle"
    layer-language="zh"
    :mapsettings-ui="false"
    @ready="mapReady"
    >
    <template slot="topLeft">
      <span>1212</span>
    </template>
    <template slot="top">
      <span>1212</span>
    </template>
    <template slot="topRight">
      <span>1212</span>
    </template>
     <h-marker :position="{ lat: 41.481175, lng: 123.253118 }" :draggable="true" :volatility="true">
      <template slot="infoBubble"><span>22222</span></template>
    </h-marker>
     <h-dom-marker
      :position="{lat: 41.481175, lng: 123.253118 }"
      :draggable="true"
      :volatility="true"
      :rotation="180"
    />
    </h-map>
    </div>
   
  </div>
  
</template>

<script>

export default {
  name: "Dashboard",
  components: {},
  data() {
    return {
      value2: 50,
      mapStyle: '',
      // car_point_run: car_point_run,
      polyline: undefined,
      marker: undefined
    };
  },
  mounted() {
    setTimeout(() => {
      // Bus.$emit('XXXX-a', {
      //   res:1111
      // });
    }, 1000);
  },
  destroyed() {}
};
</script>

<style scoped>
.qqq {
  color: blue;
}
.map-area{
  width: 800px ;
  height: 800px;
  
  position: relative;
}
</style>
<style >

</style>
