<template>
  <el-tabs v-model="activeName"
           type="border-card"
           @tab-click="handleClick">
    <el-tab-pane :label="$t('business.appConfig.ownType')"
                 name="first">
      <List ref="list1" />
    </el-tab-pane>
    <el-tab-pane :label="$t('business.appConfig.driverType')"
                 name="second">
      <List ref="list2" />
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
        this.$refs.list1.handleTag(1)
      } else {
        this.$refs.list2.handleTag(2)
      }
    }
  }
};
</script>