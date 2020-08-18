<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="batchAddCarVis"
    :close-on-press-escape="false"
    :show-close="false"
    top="20vh"
    width="50%"
    :title="title"
  >
    <el-upload
      :limit="limit"
      ref="upload"
      :action="action"
      :file-list="fileList"
      :auto-upload="false"
      :accept="accept"
      :on-success="handleSuccess">
      <el-button slot="trigger" size="small" type="primary" style="width: 100px">{{$t('export.file')}}</el-button>
      <br/>
      <div slot="tip" class="el-upload__tip el-icon-info">{{this.tip}}</div>
    </el-upload>
    
    <el-row style="margin: 5px 0">
      <div style="display: inline-block; margin-right: 10px;">
        <el-button size="small" type="success" @click="submitUpload" style="width: 200px">{{$t('export.excel')}}</el-button>
      </div>
      <el-link :href="demoURL" target="_blank">
        <el-button size="small" type="info" style="width: 200px">{{$t('export.download')}}</el-button>
      </el-link>
    </el-row>
    
    <el-row style="margin: 20px 0" v-if="batchAddInfo">
      <center>
        <div>{{$t('export.inport')}}<span>{{batchAddInfo.sum}}</span>{{$t('export.among')}}&nbsp;<span class="el-icon-success" style="color: #67C23A"></span>&nbsp;{{$t('export.success')}}<span>{{batchAddInfo.trueNum}}</span>{{$t('export.item')}}&nbsp;<span class="el-icon-warning" style="color: #E6A23C"></span>&nbsp;{{$t('export.fault')}}<span>{{batchAddInfo.sum-batchAddInfo.trueNum}}</span>{{$t('export.item')}}</div>
        
        <div class="margin" v-if="batchAddInfo.carTeamExistsNum"><span class="el-icon-thumb transform"></span>&nbsp;{{$t('export.index')}}<span>{{batchAddInfo.carTeamExistsNum}}</span>{{$t('export.existWarn')}}</div>
        <div class="margin" v-if="batchAddInfo.systemExistsNum"><span class="el-icon-thumb transform"></span>&nbsp;{{$t('export.index')}}<span>{{batchAddInfo.systemExistsNum}}</span>{{$t('export.noCarInfo')}}</div>
        <div class="margin" v-if="batchAddInfo.existsNum"><span class="el-icon-thumb transform"></span>&nbsp;{{$t('export.index')}}<span>{{batchAddInfo.existsNum}}</span>，{{$t('export.repeat')}}</div>
        <div class="margin" v-if="batchAddInfo.errNum"><span class="el-icon-thumb transform"></span>&nbsp;{{$t('export.index')}}<span>{{batchAddInfo.errNum}}</span>，{{$t('export.formatErr')}}</div>
      
        <div v-if="batchAddInfo.sum-batchAddInfo.trueNum>0">{{$t('export.importCarNo')}}</div>
      </center>
    </el-row>

    <el-row style="margin-top: 40px;">
      <center>
        <el-button plain type="info" @click="cancelBatchAddCar" style="width: 100px">{{$t('export.notAdd')}}</el-button>
      </center>
    </el-row>

  </el-dialog>
</template>

<script>
export default {
  name: 'Import',
  props: {
    title: {
      type: String
    },
    batchAddCarVis: {
      type: Boolean,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    accept: {
      type: String
    },
    tip: {
      type: String
    },
    demoURL: {
      type: String
    },
    batchAddInfo: {

    }
  },
  data () {
    return {
      fileList: []
    }
  },
  methods: {
    cancelBatchAddCar () {
      this.$refs.upload.clearFiles()
      this.$emit('cancelBatchAddCar')
    },
    async handleSuccess (response) {
      this.$emit('handleSuccess',response)
    },
    submitUpload() {
      this.$refs.upload.submit();
    }
  }
}
</script>

<style scoped lang="scss">

</style>
