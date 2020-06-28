<template>
  <div class="home">
    <HelloWorld msg="from home.vue" />
    <div class="qqq">
      123123123123
    </div>
    <el-slider v-model="value2" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue';


export default {
  name: 'Dashboard',
  components: {
    HelloWorld
  },
  data() {
      return {
          value2: 50
      };
  },
  mounted() {
    setTimeout(() => {
      this.$bus.$emit('XXXX-a', {
        res:1111
      });
    },1000);
  },
  destroyed() {

  }
};
</script>

<style scoped>
  .qqq{
    color: blue;
  }
</style>