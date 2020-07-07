<template>
  <span>
    <el-form-item :label="$t('business.province')">
      <el-select
        v-model="provinceId"
        @change="changeProvince"
        :class="aclass"
        :disabled="disabled"
        :placeholder="$t('common.place') + $t('business.province')"
      >
        <el-option
          v-for="item in ProvinceList "
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('business.city')">
      <el-select
        v-model="cityId"
         :class="aclass"
        :disabled="disabled"
        :placeholder="$t('common.place') + $t('business.city')"
        @change="changeCity"
      >
        <el-option v-for="item in cityList " :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-form-item>
  </span>
</template>

<script>
import { queryArea } from "@/api/business/businessService";
export default {
  name: "areaSelect",
  props: {
    // 输入宽度
    width: String,
    // 是否可用
    disabled: {
      type: Boolean,
      default: false
    },
    //类名
    aclass: {
      type: String,
      required: false
    },
    province: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      provinceId: "",
      cityId: "",
      ProvinceList: [],
      cityList: []
    };
  },
  mounted() {
    this.getProvinceList();
  },
  methods: {
    async getProvinceList(id) {
      const re = await queryArea(id);
      if (id) {
        this.cityList = re.data;
      } else {
        this.ProvinceList = re.data;
      }
    },
    changeProvince() {
      this.cityId = "";
      this.getProvinceList(this.provinceId);
    },
    changeCity() {
      this.$emit("update:provinceId", this.provinceId);
      this.$emit("update:cityId", this.cityId);
    }
  }
};
</script>

<style scoped lang="scss">
</style>
