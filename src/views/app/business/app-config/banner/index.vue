<template>
  <el-tabs v-model="activeName"
           type="border-card"
           @tab-click="handleClick">
    <el-tab-pane label="车主版"
                 name="first">
      <List ref="list" />
    </el-tab-pane>
    <el-tab-pane label="司机版"
                 name="second">
      <List ref="list" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import List from './components/list.vue';
export default {
  components: {
    List
  },
  data () {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.$refs.list.handleTag(1)
      } else {
        this.$refs.list.handleTag(2)
      }
    }
  }
};
</script>