<template>
  <div>
    <el-popover ref="popover" @hide="hidePopover" placement="bottom-start" trigger="click">
      <div class="center">
        <el-button @click="selectAll" type="text">全选</el-button>
        <el-button @click="selectNone" type="text">取消全选</el-button>
      </div>
      <el-tree
        ref="tree"
        class="select-tree"
        highlight-current
        show-checkbox
        :data="data"
        :style="`min-width: ${width-25}px`"
        :props="defaultProps"
        :default-checked-keys="defaultKeys"
        node-key="id"
        @check-change="onCheckNode"
      />
      <el-input
        :style="`width: ${width}px`"
        slot="reference"
        ref="input"
        v-model="labelData"
        clearable
        readonly
        :disabled="disabled"
        suffix-icon="el-icon-arrow-down"
        :placeholder="placeholder"
      />
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "SelectTree",

  props: {
    // 接收绑定参数
    value: [String, Array],
    // 输入框宽度
    width: Number,

    placeholder: String,

    // 是否可用
    disabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      required: true
    },
    // isLabelData : true 返回label，false返回value
    isLabelData: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      defaultKeys: [],

      List: [],
      labelData: "",
      valueData: ""
    };
  },
  watch: {
    data: function() {
      this.selectNone();
      this.changeValue();
    },
    value: function(val) {
      this.tempValue = val;
    },
    tempValue: function(val) {
      this.$emit("input", val);
    }
  },
  methods: {
    selectAll() {
      const arr = this.data.map(item => {
        return item.id;
      });
      this.defaultKeys = arr;
      this.List = this.data;
    },
    selectNone() {
      this.$refs.tree.setCheckedKeys([]);
      this.List = [];
    },
    onCheckNode(data, checked, indeterminate) {
      let duplicateArr = this.List.filter(item => {
        return item.id === data.id;
      });
      if (checked) {
        //选择
        if (duplicateArr.length == 0) {
          this.List.push(data);
        }
      } else {
        //取消选择
        this.List = this.List.filter(item => {
          return item.id !== data.id;
        });
      }
    },
    changeValue() {
      const labelArr = this.List.map(item => {
        return item.label;
      });
      const idArr = this.List.map(item => {
        return item.id;
      });
      this.labelData = labelArr.join(",");
      this.valueData = idArr.join(",");
    },
    hidePopover() {
      this.changeValue();
      this.$emit("input", this.isLabelData ? this.labelData : this.valueData);
    }
  }
};
</script>

<style scoped lang="scss">
.center {
  // text-align: center;
  // padding: 0 27px;
  display: flex;
  justify-content: space-around;
}
.mr-20 {
  margin-right: 20px;
}
.select-tree {
  max-height: 200px;
  overflow: scroll;
  padding: 5px 0;
}
</style>
