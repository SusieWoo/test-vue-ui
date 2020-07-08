<template>
  <div class="home">
    <HelloWorld msg="from home.vue" />
    <car-linkage :model.sync="chexing" :vehicle.sync="chexi" :discharge.sync="paifang"></car-linkage>

    <el-slider v-model="value2" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import Bus from "@/common/bus.ts";
import carLinkage from "@/components/carLinkage/carLinkage.vue";


import multipleSelect from "@/components/multipleSelect";

Bus.$on("XXXX-a", data => {});

export default {
  name: "Dashboard",
  components: {
    HelloWorld,
    carLinkage,
    multipleSelect
  },
  data() {
    return {
      chexing: "",
      chexi: "",
      paifang: "",

      qqqqq: "",

      qqqqqList: [],

      value2: 50
    };
  },
  methods: {
    output(val) {
      console.log(val);
    },
    arrOpen(arr) {
      const peak = arr.map(item => {
        return { id: item, label: item };
      });
      return peak;
    }
  },
  mounted() {
    setTimeout(() => {
      Bus.$emit("XXXX-a", {
        res: 1111
      });
    }, 1000);

  },
  destroyed() {}
};
</script>

<style scoped>
.qqq {
  color: blue;
}
</style>