<template>
  <span>{{address}}</span>
</template>
<script>
  import MapApi from '@/api/map'

  export default {
    name: 'resolveAddress',
    props: ['lat', 'lng'],
    data() {
      return {
        address: ''
      }
    },
    mounted() {
      this.getAddress()
    },
    methods: {
      getAddress() {
        new Promise(resolve => {
          resolve(MapApi.reverseCodeAddress(this.lat, this.lng))
        }).then(res => {
          this.address = res
        })
      }
    }
  }
</script>
