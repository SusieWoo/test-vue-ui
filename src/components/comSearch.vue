<template>
  <div class="com-search">
    <el-form-item>
      <el-button
        type="text"
        :icon="[isShow?'el-icon-caret-bottom':'el-icon-caret-top']"
        @click="toggleShow"
      >高级筛选</el-button>
    </el-form-item>
    <el-card v-if="isShow" class="card-panel">
      <slot name="item"></slot>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ComSearch extends Vue {
  private isShow: boolean = false;
  private toggleShow() {
    this.isShow = !this.isShow;
  }
}
</script>

<style scoped lang="scss">
.com-search {
  display: inline;
  margin-left: 10px;
}
</style>
