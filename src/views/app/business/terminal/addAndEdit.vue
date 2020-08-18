<template>
  <div class="form-page">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item :label="$t('business.terminal.id')" prop="terminalId">
        <el-input v-model="form.terminalId" :placeholder="$t('business.terminal.idPlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('business.terminal.terminalSimCard')" prop="simNo">
        <el-input v-model="form.simNo" :maxlength="11" :placeholder="$t('business.terminal.simPlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('business.terminal.peitaoSimLabel')">
        <el-input v-model="form.simMatch" :maxlength="50" />
      </el-form-item>
      <el-form-item :label="$t('business.terminal.terminalCommunicationLabel')" prop="communicationId">
        <el-input v-model="form.communicationId" :maxlength="11" :placeholder="$t('business.terminal.simPlaceholder')" />
      </el-form-item>
      <el-form-item :label="$t('business.terminal.terminalType')" prop="type">
        <el-select v-model="form.type">
          <el-option :label="`FK${$t('common.ctrl')}`" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('business.terminal.terminalModel')">
        <el-select v-model="form.model">
          <el-option v-for="(item, index) in modalList" :key="index" :label="item.tmName" :value="item.tmId+''" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('business.terminal.terminalProtocol')" prop="protocol">
        <el-select v-model="form.protocol">
          <el-option v-for="(item, index) in protocolList" :key="index" :label="item.typeName" :value="item.typeId" />
        </el-select>
      </el-form-item>
      <SelectTable
          :key="1"
          v-model="form.reAgentName"
          :label="$t('business.terminal.ownedDealer')"
          :placeholder="$t('business.dealer.selectAreaDealer')"
          :table-title="$t('business.terminal.ownedDealer')"
          prop="reAgentName"
          search-name="fruzzy"
          :column-list="columnList"
          :table-list="tableList"
          :total="total"
          @search="getDealer"
          @obj="getSelectDealer"
      />
      <el-form-item :label="$t('business.terminal.deviceTagId')">
        <el-input v-model="form.devLabelId" />
      </el-form-item>
      <el-form-item :label="$t('common.media')">
        <el-checkbox-group v-model="form.camera">
          <el-checkbox v-for="(item, index) in mediaList" :key="index" :label="item.id+''" name="type">{{item.value}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="MIC">
        <el-radio-group v-model="form.mic">
          <el-radio :label="1">{{$t('message.yes')}}</el-radio>
          <el-radio :label="0">{{$t('message.no')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('common.remark')">
        <el-input v-model="form.remark" type="textarea" rows="5" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isloading" @click="handleSubmit">{{$t('common.submit')}}</el-button>
        <el-button @click="$router.back()">{{$t('common.back')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SelectTable from '@/components/selectTable'
import { queryDealer } from '@/api/basicInfo';
import { listTerModel, protocol, getBaseData, addOrEditTerminal, getTerminalDetail } from '@/api/business/businessService'
export default {
  name: 'AddAndEdit',
  components: {
    SelectTable
  },
  data() {
    return {
      form: {
        terminalId: '',
        simNo: '',
        simMatch: '',
        communicationId: '',
        type: '',
        model: '',
        protocol: '',
        reAgentName: '',
        reAgent: '',
        devLabelId: '',
        camera: [],
        mic: '',
        remark: '',
      },
      isloading:false,
      dialogTableVisible: false,
      modalList: [],
      protocolList: [],
      mediaList: [],
      tableList: [], //table渲染数据
      columnList: [], //table展示的列内容
      total: 0,
      rules: {
        terminalId: [
          { required: true, message: this.$t('business.terminal.idRule'), trigger: 'blur' }
        ],
        simNo: [
          { required: true, message: this.$t('business.terminal.simRule'), trigger: 'change' },
          { min: 11, max: 11, message: this.$t('business.terminal.simPlaceholder'), trigger: 'change' }
        ],
        communicationId: [
          { required: true, message: this.$t('business.terminal.communicationRule'), trigger: 'change' },
          { min: 11, max: 11, message: this.$t('business.terminal.simPlaceholder'), trigger: 'change' }
        ],
        type: [
          { required: true, message: this.$t('business.terminal.typeRule'), trigger: 'change' }
        ],
        protocol: [
          { required: true, message: this.$t('business.terminal.selectTerminalProtocol'), trigger: 'change' }
        ],
        reAgentName: [
          { required: true, message: this.$t('business.dealer.selectAreaDealer'), trigger: 'change' }
        ],
        /*model: [
          { required: true, message: this.$t('business.terminal.modelRule'), trigger: 'change' }
        ],*/
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.init()
    if (this.$route.params.id) this.getDetail()
  },
  methods: {
    getDetail() {
      getTerminalDetail({ id: this.id }).then(res => {
        for (let key in this.form) {
          if (Object.prototype.hasOwnProperty.call(res.data, key)) {
            if (key === 'camera') {
              if (res.data[key]) {
                if (res.data[key].length === 1) this.form[key] = res.data[key].split('')
                else this.form[key] = res.data[key].split(',')
              }
            } else if (key === 'mic') {
              if (res.data[key] === '1') this.form[key] = parseInt(res.data[key])
              else this.form[key] = res.data[key]
            } else if (key === 'communicationId') {
              this.form[key] = res.data[key] + ''
            } else {
              this.form[key] = res.data[key]
            }
          }
        }
      })
    },
    init () {
      listTerModel().then(res => {
        this.modalList = res.data.list
      })
      protocol().then(res => {
        this.protocolList = res.data
      })
      getBaseData({ type: 57 }).then(res => {
        this.mediaList = res.data
      })
    },
    getSelectDealer(obj) {
      this.form.reAgent = obj.id;
    },
    async getDealer(querys) {
      this.columnList = [
        {
          title: this.$t('business.terminal.dealerName'),
          prop: 'tname',
          width: '260'
        },
        {
          title: this.$t('business.terminal.dealerNo'),
          prop: 'dealerCode',
          width: '200'
        },
        {
          title: this.$t('business.terminal.area'),
          prop: 'pname',
          width: '160'
        },
        {
          title: this.$t('business.terminal.BrandManagement'),
          prop: 'manageBrand',
          width: '180'
        }
      ];
      const re = await queryDealer(querys);
      re.data.list.forEach(element => {
        element.value = element.tname;
      });
      this.tableList = re.data.list;
      this.total = re.data.total;
    },
    handleSubmit() {
      const t = this;
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const obj = { ...this.form }
          obj.camera = obj.camera.join(',')
          if (this.id) obj['id'] = this.id
          console.log(obj)
          this.isloading = true;
          addOrEditTerminal(obj, this.id ? 'update' : 'add').then(() => {
            this.$message.success(this.id ? this.$t('common.changeSuccess') : this.$t('common.addSuccess'))
            this.$router.back()
          }).finally(()=>{
            this.isloading = false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
