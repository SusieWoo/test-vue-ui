<template>
  <div>
    <el-dialog title="导出说明" :visible.sync="visible" width="30%">
      <span class="message" v-html="message"></span>

      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="email" label="邮箱帐号">
          <el-input type="email" clearable v-model="form.email" placeholder="请输入正确的邮箱"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="commit">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 发送到邮箱，弹出框输入邮箱地址，发送邮件。
  name: "downloadToEmail",
  props: {
    // 输入宽度
    width: String,
    // 是否可用
    show: {
      type: Boolean,
      default: false
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    message: {
      type: String,
      required: false
    },
    fn: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      isCommit: false,
      email: "",
      visible: false,
      form: {
        email: ""
      },
      rules: {
        email: [
          { required: true, message: "请输入邮箱账号", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  watch:{
    show:function(){
      this.visible = this.show;
    }
  },
  mounted() {
    this.visible = this.show;
  },
  methods: {
    commit() {
      let t = this;
      this.$refs["form"].validate(valid => {
        if (valid) {
          t.commitFn();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    async commitFn() {
      this.$emit("email", this.form.email);
      const re = await this.fn();
      if (re) {
        this.isCommit = true;
      }
    }
  }
};
</script>

<style scoped lang="scss">

.message{
  margin-bottom: 10px;
  margin-left: 5px;;
}
</style>
