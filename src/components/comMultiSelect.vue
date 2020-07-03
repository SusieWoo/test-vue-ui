
<template>
  <div class="com-multiple-select">
    <el-select v-model="selectValue" placeholder="请选择">
    <el-option
      v-for="item in data"
      :key="item.id"
      :label="item.label"
      :value="item.id">
      <el-checkbox :v-model="item.id">{{item.label}}</el-checkbox>
    </el-option>
  </el-select>
  </div>
</template>
<script>
export default {
  name: "comMultiSelect",
  props: {
    // 选项数据
    data: {
      type: Array,
      required: true,
    }
  },
  data: function() {
    return {
        selectValue:''
    };
  },

  methods: {}
};
</script>
<style lang="scss" scoped>
.com-multiple-select {
}
</style>

