<template>
  <el-dialog :title="(isEdit ? $t('common.edit'): $t('common.add'))"
             :visible.sync="open"
             :before-close="cancel"
             append-to-body>
    <el-form ref="form"
             v-loading.fullscreen.lock="fullscreenLoading"
             :rules="rules"
             label-width="120px"
             :model="row">
      <el-row :gutter="20">
        <el-col :span="20"
                :offset="1">
          <el-form-item :label="$t('business.telephone.name')"
                        prop="name">
            <el-input v-model="row.name"
                      clearable />
          </el-form-item>
          <el-form-item v-if="type === '1'"
                        :label="$t('business.telephone.series')"
                        prop="carType">
            <el-select v-model="row.carType"
                       clearable
                       :placeholder="$t('common.select')"
                       :disabled="isEdit">
              <el-option v-for="item in carTypeList"
                         :key="item.value"
                         :label="item.name"
                         :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('business.telephone.phone')"
                        prop="tel">
            <el-input v-model="row.tel"
                      clearable />
          </el-form-item>

          <UploadImg v-if="type === '3'"
                     ref="uploadImg"
                     :upload-config="uploadConfig"
                     :upload-finish="finishUpload"
                     @on-upload-success="uploadSuccess"
                     @on-handle-remove="handleRemove" />

          <el-form-item>
            <el-button type="primary"
                       @click="submit('form')">
              {{$t('common.save')}}
            </el-button>
            <el-button type="primary"
                       @click="cancel()">
              {{$t('common.cancel')}}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import UploadImg from '@/components/UploadImg';
import { publicTel } from '@/utils/rules';
import { queryCarPropertyForMaintains } from '@/api/public/PublicService';
import { updTelephoneList, addTelephoneBaseList } from '@/api/business/businessService';


export default {
  components: {
    UploadImg
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    }
  },

  data() {
    return {
      isEdit: false,
      carTypeList: [],
      fullscreenLoading: false,
      finishUpload: true,
      row: {
        name: '',
        tel: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('common.rules.required'), trigger: 'blur' },
          { max: 30, trigger: 'blur' }
        ],
        tel: [
          { required: true, message: this.$t('common.rules.required'), trigger: 'blur' },
          { validator: publicTel, trigger: 'change' },
          { max: 20, trigger: 'blur' }
        ],
      },

    };
  },
  computed: {
    uploadConfig() {
      return {
        label: this.$t('common.image'),
        sizeLimit: 2,
        numLimt: 1
      }
    },
  },
  mounted() {
    this.carList()
    this.row.type = this.type
  },
  methods: {
    async carList() {
      const arr = await queryCarPropertyForMaintains({ propertyName: '1' });
      this.carTypeList = arr.data.map((item) => {
        return { value: item, name: item };
      });
    },
    toOpen(row) {
      if (!row) {
        this.isEdit = false;
        this.row = {
          id: '',
          name: '',
          tel: '',
          imgPath: '123456'
        }
        return
      }
      this.isEdit = true;
      const { carTypeName, imgPath, name, tel, id } = row;
      this.row.id = id;
      this.row.name = name;
      this.row.tel = tel;
      this.row.imgPath = '123456' //这里原来就是传的123456，不知为何。不传会报错
      if (this.type === '1') {
        this.row.carType = carTypeName;
      }
      if (this.type === '3') {
        this.row.imgPath = imgPath;
        this.$nextTick(() => {
          this.$refs.uploadImg.changePath([{ url: this.row.imgPath }]);
        })
      }
    },
    uploadSuccess(res) {
      this.row.imgPath = res[0].filePath;
    },
    handleRemove(res) {
      this.row.imgPath = '';
    },
    submit(formName) {
      this.$refs[formName].validate((valid, obj) => {
        if (valid) {
          if (!this.finishUpload) {
            this.$message.error(this.$t('common.tips.finishUpload'));
            return;
          }
          this.add();
        } else {
          return false;
        }
      });
    },
    async add() {
      this.row.type = this.type;
      if (this.isEdit) {
        await updTelephoneList(this.row);
      } else {
        await addTelephoneBaseList(this.row);
      }
      this.$message({
        type: 'success',
        message: this.isEdit ? this.$t('common.save') : this.$t('common.tips.operateSuccess') + '!'
      });
      this.cancel();
    },
    cancel: function () {
      this.$emit('confirm');
    }
  }
};
</script>