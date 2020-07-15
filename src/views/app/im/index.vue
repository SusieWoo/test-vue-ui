<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="当前会话">
        <Dialogue />
      </el-tab-pane>
      <el-tab-pane label="历史记录">
        33
      </el-tab-pane>
      <el-tab-pane label="当前在线">
        44
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import Dialogue from './components/dialogue.vue';
export default {
  components: {
    Dialogue
  },
  data () {
    return {

    };
  },
  mounted () {
  },
  methods: {
  }
}
</script>
