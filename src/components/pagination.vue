<template>
  <div :class="{'hidden':hidden}"
       class="pagination-container">
    <el-pagination :background="background"
                   :current-page.sync="currentPage"
                   :page-size.sync="pageSize"
                   :layout="layout"
                   :page-sizes="pageSizes"
                   :total="total"
                   v-bind="$attrs"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Pageination extends Vue {
  @Prop({ required: true }) private total!: Number
  @Prop({ default: false }) private hidden!: boolean
  @Prop({ default: true }) private background!: boolean
  @Prop({
    default: () => {
      ;[10, 20, 30, 50]
    }
  })
  private pageSizes!: object
  @Prop({ default: 'total, sizes, prev, pager, next, jumper' })
  private layout!: string
  @Prop({ default: 1 }) private page!: Number
  @Prop({ default: 20 }) private limit!: Number

  private get currentPage() {
    return this.page
  }
  private set currentPage(val) {
    this.$emit('update:page', val)
  }
  private get pageSize() {
    return this.limit
  }
  private set pageSize(val) {
    this.$emit('update:limit', val)
  }

  private handleSizeChange(val: number) {
    this.$emit('pagination', { page: this.currentPage, limit: val })
  }
  private handleCurrentChange(val: any) {
    this.$emit('pagination', { page: val, limit: this.pageSize })
  }
}
</script>

<style scoped>
.pagination-container {
  background: transparent;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
