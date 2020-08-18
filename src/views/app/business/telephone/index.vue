<template>
  <el-tabs v-model="tabName"
           type="border-card"
           @tab-click="handleClick">
    <el-tab-pane :label="$t('business.telephone.usual')"
                 name="first">
      <List ref="list1"
            type='1' />
    </el-tab-pane>
    <el-tab-pane :label="$t('business.telephone.help')"
                 name="second">
      <List ref="list2"
            type='2' />
    </el-tab-pane>
    <el-tab-pane :label="$t('business.telephone.insurance')"
                 name="third">
      <List ref="list3"
            type='3' />
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
      tabName: 'first',
    };
  },
  mounted () {
    this.$refs.list1.handleTag()
  },
  methods: {
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.$refs.list1.handleTag()
      } else if (tab.name === 'second') {
        this.$refs.list2.handleTag()
      } else if (tab.name === 'third') {
        this.$refs.list3.handleTag()
      }
    }
  }
};
</script>