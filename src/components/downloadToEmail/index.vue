<template>
  <div>
    <el-dialog :title="$t('export.desc')" :visible.sync="visible" width="30%">
      <div class="message">
        <span v-html="message"></span>
      </div>

      <el-form v-if="showbtn" ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="email" :label="$t('export.email')">
          <el-input type="email" clearable v-model="form.email" :placeholder="$t('export.input')"></el-input>
        </el-form-item>
      </el-form>

      <span v-if="showbtn" slot="footer" class="dialog-footer">
        <el-button @click="visible = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" :loading="loading" @click="commit">{{$t('common.submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 发送到邮箱，弹出框输入邮箱地址，发送邮件。
  name: "downloadToEmail",
  props: {
    // 展示dialog
    show: {
      type: Boolean,
      default: false
    },
    //显示
    showbtn: {
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
      loading: false,
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
  watch: {
    show: function() {
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
          this.loading = true;
          t.commitFn();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    commitFn() {
      this.$emit("email", this.form.email);
      this.fn(this.form.email);
      this.loading = false
    }
  }
};
</script>

<style scoped lang="scss">
.message {
  margin-bottom: 10px;
  margin-left: 5px;
}
</style>
