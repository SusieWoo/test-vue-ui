<template>
  <div class="lock-car">
    <header class="mb30 ml45">
      <i class="el-icon-warning" style="color:red; margin-right:10px" />
      <span v-if="lock==='unlock'">{{monitor.lockWarn}}</span>
      <span v-if="lock==='lock'">{{monitor.activeWarn}}</span>
    </header>
    <div>
      <el-form ref="lockModel" :rules="rules" :model="lockModel" label-width="120px">
        <el-form-item :label="$t('login.password')">
          <el-input
            props="password"
            style="width:370px"
            clearable
            v-model="lockModel.password"
            :placeholder="$t('login.ipassword')"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" style="margin-right:30px" @click="send">{{$t('message.sendMsg')}}</el-button>
          <el-button type="primary" @click="reset">{{$t('message.reset')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import CarService from "@/api/monitor/car";
export default {
  props: {
    carTip: {
      type: Object,
      require: true
    },
    lock: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      loading: false,
      lockModel: {
        carId: "",
        password: null,
        sign: null,
        lockMethod: "1",
        lockParam: null,
        content: null
      },
      rules: {
        password: [{ required: true, message: $t('login.ipassword'), trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.getCarStatus();
  },
  methods: {
    async getCarStatus() {
      let obj = { carId: this.carTip.id };
      const re = await CarService.getCarStatus(obj);
      re.data.isAlter = 1;
      re.data.vehicleStatus = 2;
      //代表状态滞后，即将跳转到状态一致的tab页面
      if (
        (this.lock === "lock" &&
          re.data.vehicleStatus !== 2 &&
          re.data.vehicleStatus !== 6) ||
        (this.lock === "unlock" &&
          re.data.vehicleStatus !== 3 &&
          re.data.vehicleStatus !== 7)
      ) {
        if (re.data.isAlter === 1) {
          this.$message.warning(
            $t('monitor.carWarn')
          );
          this.$emit("changeTab", re.data.vehicleStatus);
        }
      }
    },
    send() {
      if (!this.carTip.id) {
        this.$message.warning("carId为空");
        return;
      } else if (!this.lockModel.password) {
        this.$message.warning($t('monitor.pwdWarn'));
        return;
      }
      this.loading = true;
      this.lockModel.carId = this.carTip.id;
      if (this.lock === "lock") {
        this.postLock();
      } else if (this.lock === "unlock") {
        this.postUnLock();
      }
    },
    postLock() {
      this.lockModel.sign = 1;
      //锁车
      CarService.postLockCar(this.lockModel)
        .then(
          res => {
            this.$message.success($t('oil.operationSuccess'));
          },
          error => {}
        )
        .finally(() => {
          this.loading = false;
        });
    },
    postUnLock() {
      //解锁
      this.lockModel.sign = 0;
      CarService.postLockCar(this.lockModel)
        .then(
          res => {
            this.$message.success($t('oil.operationSuccess'));
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
.lock-car {
  padding: 10px;
  width: 100%;
  header {
    font-size: 14px;
  }
}
</style>
