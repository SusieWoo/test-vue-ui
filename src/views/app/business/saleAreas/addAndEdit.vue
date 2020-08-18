<template>
  <div class="form-page">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item :label="$t('business.saleArea.areaName')" prop="tName">
        <el-input v-model="form.tName" />
      </el-form-item>
      <SelectTable
        :key="1"
        v-model="form.pName"
        :label="$t('business.dealer.area')"
        :placeholder="$t('business.dealer.selectAreaDealer')"
        :table-title="$t('business.dealer.area')"
        prop="pName"
        search-name="districtName"
        :column-list="columnList"
        :table-list="tableList"
        :total="total"
        @search="getDealer"
        @obj="getSelectDealer"
      />
      <el-form-item prop="country" :label="$t('business.saleArea.country')">
        <el-radio-group v-model="form.country">
          <el-radio v-for="item in countryList" :key="item.id" disabled :label="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('business.saleArea.areaContactPerson')">
        <el-input v-model="form.tlinkMan" />
      </el-form-item>
      <el-form-item :label="$t('business.dealer.contactPhone')">
        <el-input v-model="form.tlinkTel" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">{{$t('common.submit')}}</el-button>
        <el-button @click="$router.back()">{{$t('common.back')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SelectTable from '@/components/selectTable';
import {
  queryDistrictTip,
  addOrEditDistrict,
  getDistrict
} from '@/api/business/businessService';
export default {
  name: 'SaleAerasAddAndEdit',
  components: {
    SelectTable
  },
  data() {
    return {
      form: {
        id: undefined,
        tName: '',
        pName: '',
        parentId: '',
        tlinkMan: '',
        tlinkTel: '',
        country: ''
      },
      dialogTableVisible: false,
      tableList: [], //table渲染数据
      columnList: [], //table展示的列内容
      total: 0,
      rules: {
        tName: [
          {
            required: true,
            message: this.$t('business.saleArea.selectAreaName'),
            trigger: 'blur'
          }
        ],
        pName: [
          {
            required: true,
            message: this.$t('business.dealer.selectAreaDealer'),
            trigger: 'change'
          }
        ],
        country: [
          {
            required: true,
            message: this.$t('business.saleArea.selectCountry'),
            trigger: 'change'
          }
        ]
      }
    };
  },
  computed: {
    countryList: function() {
      return [
        { id: 1, name: this.$t('business.saleArea.V') },
        { id: 2, name: this.$t('business.saleArea.P') },
        { id: 3, name: this.$t('business.saleArea.N') },
        { id: 4, name: this.$t('business.saleArea.C') }
      ];
    }
  },
  mounted() {
    if (this.$route.params.id) this.init();
  },
  methods: {
    async init() {
      const { data } = await getDistrict({ id: this.$route.params.id });
      this.form = {
        id: this.$route.params.id,
        tName: data.tName,
        pName: data.pName,
        parentId: data.parentId,
        tlinkMan: data.tlinkMan,
        tlinkTel: data.tlinkTel,
        country: data.country
      };
    },
    getSelectDealer(obj) {
      this.form.parentId = obj.id;
      this.form.country = obj.country;
    },
    async getDealer(querys) {
      this.columnList = [
        {
          title: this.$t('common.serialNumber'),
          type: 'index'
        },
        {
          title: this.$t('business.terminal.area'),
          prop: 'districtName'
        },
        {
          title: this.$t('business.dealer.topSaleArea'),
          prop: 'pdistrictName'
        },
        {
          title: this.$t('business.dealer.contactPerson'),
          prop: 'linkMan'
        }
      ];
      // console.log(querys)
      const re = await queryDistrictTip({ ...querys, type: 0 });
      re.data.list.forEach(element => {
        element.value = element.districtName;
      });
      this.tableList = re.data.list;
      this.total = re.data.total;
    },
    handleSubmit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          await addOrEditDistrict(this.form, !!this.$route.params.id);
          this.$message.success(
            this.$route.params.id
              ? this.$t('common.changeSuccess')
              : this.$t('common.addSuccess')
          );
          this.$router.back();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
