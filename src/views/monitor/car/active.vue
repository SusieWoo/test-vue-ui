<template>
  <div class="active-car">
    <header class="mb30 ml45">
      <i class="el-icon-warning" style="color:red; margin-right:10px" />
      <span>{{monitor.lockMessage}}</span>
    </header>
    <div>
      <el-form ref="activationModel" :rules="rules" :model="activationModel" label-width="120px">
        <el-form-item props="password" :label="$t('login.password')">
          <el-input
            style="width:370px"
            clearable
            type="password"
            v-model="activationModel.password"
            :placeholder="$t('login.ipassword')"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="margin-right:30px"
            @click="send"
          >{{$t('message.sendMsg')}}</el-button>
          <el-button type="primary" @click="reset">{{$t('common.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import CarService from "@/api/monitor/car";
import { stringify } from "qs";
export default {
  props: {
    carTip: {
      type: Object,
      require: true
    },
    active: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      loading: false,
      activationModel: {
        carId: "",
        password: "",
        carFKDate: null,
        content: null,
        sign: null,
        common: 0
      }
    };
  },
  computed: {
    rules() {
      return {
        password: [
          { required: true, message: this.$t("login.ipassword"), trigger: "blur" }
        ]
      };
    }
  },
  mounted() {
    this.getCarStatus();
  },
  methods: {
    async getCarStatus() {
      let obj = { carId: this.carTip.id };
      const re = await CarService.getCarStatus(obj);
      //代表状态滞后，即将跳转到状态一致的tab页面
      if (
        (this.active === "active" &&
          re.data.vehicleStatus !== 4 &&
          re.data.vehicleStatus !== 0) ||
        (this.active === "unactive" &&
          re.data.vehicleStatus !== 2 &&
          re.data.vehicleStatus !== 5)
      ) {
        if (re.data.isAlter === 1) {
          this.$message.warning(this.$t("monitor.carWarn"));
          this.$emit("changeTab", re.data.vehicleStatus);
        }
      }
    },
    send() {
      //先判断状态是否滞后
      this.getCarStatus();
      if (!this.carTip.id) {
        this.$message.warning(this.$t("monitor.caridWarn"));
        return;
      } else if (!this.activationModel.password) {
        return;
      }
      // this.$refs.activationModel.validate(valid => {
      //   if (valid) {
      this.loading = true;
      this.activationModel.carId = this.carTip.id;
      if (this.active === "active") {
        this.postActive();
      } else if (this.active === "unactive") {
        this.postUnActive();
      }
      //   } else {
      //     return false;
      //   }
      // });
    },
    postActive() {
      console.log("postActive");
      this.activationModel.sign = 1;
      //激活
      CarService.postActivation(this.activationModel)
        .then(
          res => {
            this.$message.success(this.$t("oil.operationSuccess"));
          },
          error => {}
        )
        .finally(() => {
          this.loading = false;
        });
    },
    postUnActive() {
      //关闭
      console.log("postUnActive");
      this.activationModel.sign = 0;
      CarService.postActivation(this.activationModel)
        .then(
          res => {
            this.$message.success(this.$t("oil.operationSuccess"));
          },
          error => {}
        )
        .finally(() => {
          this.loading = false;
        });
    },
    reset() {
      this.activationMod = {
        carId: "",
        password: null,
        carFKDate: null,
        content: null,
        sign: null,
        common: 0
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.active-car {
  padding: 10px;
  width: 100%;
  header {
    font-size: 14px;
  }
}
</style>
