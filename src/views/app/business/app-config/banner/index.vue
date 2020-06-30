<template>
  <el-tabs v-model="activeName"
           type="border-card"
           @tab-click="handleClick">
    <el-tab-pane label="车主版"
                 name="first">
      <List :msg="type" />
    </el-tab-pane>
    <el-tab-pane label="司机版"
                 name="second">
      <List :msg="type" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import List from './list.vue';
export default {
  components: {
    List
  },
  data () {
    return {
      activeName: 'first',
      type: 1
    };
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.type = 1;
      } else {
        this.type = 2;
      }
    }
  }
};
</script>