<template>
  <div>
    <iframe :src="iframeSrc" style="display: none;"></iframe>
    <el-dialog
      width="550px"
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="dialogPvVisible"
      :before-close="clearAddform"
      @submit.native.prevent
    >
      <el-form ref="addForm" :model="addForm">
        <el-form-item label-width="80px" :label="$t('user.email')+'：'" prop="email" :rules="ruless.email">
          <el-input v-model="addForm.email" size="small" :maxlength="50" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="childMethod">{{$t('common.submit')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validateEmail } from "@/utils/rules";
export default {
  props: {
    iframeFilter: {
      type: Object,
      required: true,
      default() {
        return {
          data: {
            isEmail: false
          }
        };
      }
    }
  },
  computed:{
    title(){
      return this.$t('export.exceed')
    }
  },
  data() {
    return {
      addForm: {
        email: ""
      },
      // title: "信息数据量过大，请输入邮箱接收",
      iframeSrc: null,
      dialogPvVisible: false,
      ruless: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { max: 50, message: "请输入50个以内的字符", trigger: "change" },
          { validator: validateEmail, trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    "iframeFilter.data": function(val, oldVal) {
      if (val && val.isEmail) {
        this.dialogPvVisible = true;
      } else {
        this.iframeSrc = val;
      }
    }
  },
  methods: {
    clearAddform() {
      this.$refs["addForm"].resetFields();
      this.dialogPvVisible = false;
    },
    childMethod() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.$emit("exportMethod", this.addForm.email);
          this.clearAddform();
        } else return false;
      });
    }
  }
};
</script>
