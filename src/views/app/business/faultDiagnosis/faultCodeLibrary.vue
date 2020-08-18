<template>
  <el-tabs
    v-model="activeName"
    type="border-card"
  >
    <el-tab-pane
      :label="$t('faultCodeLibrary.faultCodeLibrary')"
      name="library"
    >
      <library></library>
    </el-tab-pane>
    <el-tab-pane
      :label="$t('faultCodeLibrary.fmi')"
      name="fmi"
    >
      <fmi></fmi>
    </el-tab-pane>
    <el-tab-pane
      :label="$t('faultCodeLibrary.groupSetting')"
      name="group"
    >
      <group></group>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Library from './faultCodeLibrary/library'
import Fmi from './faultCodeLibrary/fmi'
import Group from './faultCodeLibrary/groupSetting'

export default {
  name: 'FaultCodeLibrary',
  components: {
    Library , 
    Fmi ,
    Group
  },
  data () {
    return {
      activeName: 'library'
    }
  },
  activated() {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style scoped>

</style>
