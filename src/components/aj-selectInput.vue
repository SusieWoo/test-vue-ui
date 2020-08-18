<template>
  <div class="select-input">
    <el-input :value="value" v-bind="$attrs" @input="$emit('input', $event)" />
    <div class="select-container">
      <el-select
          style="width: 100%"
          :placeholder="$t('common.placeSelect')" value="" @change="$emit('input', $event)">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
      </el-select>
      <i class="el-icon-arrow-down"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AjSelectInput',
  props: {
    value: [String, Number],
    options: {
      type: Array,
      default: () => [
        {
          label: '10KM',
          value: 10
        },
        {
          label: '20KM',
          value: 20
        },
        {
          label: '50KM',
          value: 50
        }
      ]
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="less">
  .select-input {
    position: relative;
    //overflow: hidden;
    .select-container {
      height: 100%;
      width: 20px;
      position: absolute;
      right: 0;
      top: 0;
      /deep/ .el-select {
        opacity: 0;
        height: 100%;
        z-index: 2;
      }
      /deep/ .el-input {
        overflow: hidden;
        input {
          width: 20px;
          padding: 0;
        }
      }
      > .el-icon-arrow-down {
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 1;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
