<template>
  <el-dialog title="banner"
             :visible.sync="open"
             :before-close="cancel"
             append-to-body>
    <div slot="footer"
         class="dialog-footer flex-center">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary"
                 @click="confirm()">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: 0
    },
    type: {
      type: Number,
      default: 1
    }

  },
  data () {
    return {
    }
  },
  watch: {
    open (val) {
      if (val) {
        console.log(1)
      }
    }
  },
  mounted () {
    console.log(this.open, this.id, this.type);
  },
  methods: {
    cancel: function () {
      this.$emit('confirm')
    },
    confirm: function () {
      this.$emit('confirm')
    },
  }
}
</script>

<style lang="scss" scoped>
ul {
  li {
    list-style: none;
  }
}
.radio-self {
  width: 100%;
  padding: 8px 0;
  &:first-child {
    margin-left: 30px;
    margin-top: 8px;
  }
}
</style>