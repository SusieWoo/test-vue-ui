<template>
  <div class="home">
    <HelloWorld msg="from home.vue" />
    <el-slider v-model="value2" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Dashboard",
  components: {
    HelloWorld
  },
  data() {
      return {
          value2: 50
      };
  }
};
</script>
