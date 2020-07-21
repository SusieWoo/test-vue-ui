<template>
  <el-dialog
    :title="(isEdit?'编辑':'新建') + 'banner'"
    :visible.sync="open"
    :before-close="cancel"
    append-to-body
  >
    <el-form
      ref="form"
      v-loading.fullscreen.lock="fullscreenLoading"
      :rules="rules"
      label-width="120px"
      :model="row"
    >
      <el-row :gutter="20">
        <el-col :span="20" :offset="1">
          <el-form-item :label="$t('business.telephone.联系人名称')" prop="name">
            <el-input v-model="row.name" clearable/>
          </el-form-item>
          <el-form-item v-if="type == 1" :label="$t('business.telephone.车系选择')" prop="carType">
            <el-select
              v-model="row.carType"
              clearable
              placeholder="请选择"
              @change="change"
              :disabled="isEdit"
            >
              <el-option
                v-for="item in carTypeList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('business.telephone.联系方式')" prop="tel">
            <el-input v-model="row.tel" clearable />
          </el-form-item>

          <UploadImg  v-if="type == 3"
            ref="uploadImg"
            :upload-config="uploadConfig"
            :upload-finish="finishUpload"
            @on-upload-success="uploadSuccess"
            @on-handle-remove="handleRemove"
          />

          <el-form-item>
            <el-button type="primary" @click="submit('form')">保存</el-button>
            <el-button type="primary" @click="cancel()">取 消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import UploadImg from "@/components/UploadImg";
import { querySeriesList } from "@/api/business/businessService";
import { updTelephoneList , addTelephoneBaseList } from '@/api/business/businessService';

export default {
  components: {
    UploadImg
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    type:{
      type: String
    }
  },

  data() {
    return {
      isEdit: false,
      carTypeList: [],
      row: {
        type:this.type
      },
      fullscreenLoading: false,
      finishUpload: true,
      uploadConfig: {
        label: "图片",
        sizeLimit: 2,
        numLimt: 1
      },
      rules: {
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 30, trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '必填', trigger: 'blur' },
          { max: 20, trigger: 'blur' },
          /* todo 正则 */
        ],
      },

    };
  },
  async mounted() {
    const arr = await querySeriesList({});
    this.carTypeList = arr.data.map((item) => {
      return { value: item, name: item };
    });
  },
  methods: {
    toOpen(row){
      if(!row){
        this.isEdit = false;
        return
      }
      this.isEdit = true;
      const { carTypeName , imgPath , name , tel , id } = row;
      this.row.id = id;
      this.row.name = name;
      this.row.tel = tel;
      if(this.type == 1){
        this.row.carType = carTypeName;
      }
      if(this.type == 3){
        this.row.imgPath = imgPath;
      }
    },
    change(e){
      console.log(e)
    },
    uploadSuccess(res) {
      this.row.imgPath = res[0].filePath;
    },
    handleRemove(res) {
      this.row.imgPath = "";
    },
    submit(formName) {
      this.$refs[formName].validate((valid, obj) => {
        if (valid) {
          if (!this.finishUpload) {
            this.$message.error("请等待图片上传完成");
            return;
          }
          this.add();
        } else {
          return false;
        }
      });
    },
    async add(){
      let res ;
      if(this.isEdit){
        res = await updTelephoneList(this.row);
      }else{
        res = await addTelephoneBaseList(this.row);
      }
      this.$message({
        type: 'success',
        message:  this.isEdit?'编辑':'新建' + '成功!'
      });
      this.cancel();
    },
    cancel: function() {
      this.row = {type:this.type};
      this.$emit("confirm");
    }
  }
};
</script>