<template>
  <span>{{address}}</span>
</template>
<script>
  import mapApi from '@/api/map'

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
          resolve(mapApi.revgeocode(this.lng,this.lat))
        }).then(res => {
          this.address = res
        })
      }
    }
  }
</script>
