<template>
	<div class="app-container">
    <el-card class="card-panel">
      <el-form :inline="true" :model="query" label-position="left">
        <el-form-item :label="$t('library.partsName')" label-width="90px">
          <el-input v-model="query.partName" style="width: 120px"/>
        </el-form-item>
        <el-form-item :label="$t('library.partsVal')" label-width="90px">
          <el-input v-model="query.partValue" style="width: 120px"/>
        </el-form-item>
        <el-form-item :label="'SPN:'" label-width="90px">
          <el-input v-model="query.spn" style="width: 120px"/>
        </el-form-item>
        <el-form-item :label="'FMI:'" label-width="90px">
          <el-input v-model="query.fmi" style="width: 120px"/>
        </el-form-item>
        <el-form-item :label="$t('library.diagnostic')" label-width="90px">
          <el-input v-model="query.faultCode" style="width: 120px"/>
        </el-form-item>
        <el-form-item :label="$t('library.group')" label-width="90px">
          <el-input v-model="query.faultGroup" style="width: 120px"/>
        </el-form-item>
        <el-form-item :label="$t('library.diagnostic')" label-width="90px">
          <el-select
            v-model="query.faultLevel"
            style="width: 120px"
            :placeholder="$t('common.all')"
            clearable
          >
            <el-option value="S" :label="$t('library.serious')"></el-option>
            <el-option value="C" :label="$t('library.common')"></el-option>
            <el-option value="D" :label="$t('library.heating')"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('library.type')" label-width="90px">
          <el-select
            v-model="query.interventionType"
            style="width: 120px"
            :placeholder="$t('common.all')"
            clearable
          >
            <el-option :value="$t('library.cc')" :label="$t('library.cc')"></el-option>
            <el-option value="" :label="$t('library.empty')"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <center>
            <el-button style="width: 150px;" type="primary" icon="el-icon-search" @click="getList()">{{$t('common.search')}}</el-button>
            <el-button style="width: 150px;" type="primary" @click="add()">{{$t('common.add')}}</el-button>
            <el-button style="width: 150px;" type="primary" @click="del(delIds)" :disabled="!delIds.faultId.length">{{$t('common.mdelete')}}</el-button>
            <el-button style="width: 150px;" type="primary" @click="importFaults()">{{$t('common.import')}}</el-button>
            <el-button style="width: 150px;" type="primary" @click="handleDownExcel()">{{$t('common.export')}}</el-button>
          </center>
        </el-row>
      </el-form>
    </el-card>

    <el-table
      class='t-table'
      stripe
      :data="tableData"
      style="width: 100%; text-align: center;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="partName" align="center" :label="$t('library.parts')"></el-table-column>
      <el-table-column prop="partValue" align="center" :label="$t('library.partsVal')"></el-table-column>
      <el-table-column prop="faultGroup" align="center" :label="$t('library.group')"></el-table-column>
      <el-table-column prop="faultLevel" align="center" :label="$t('library.level')">
        <template slot-scope="scope">
          {{showFaultLevelLabel(scope.row.faultLevel)}}
        </template>
      </el-table-column>
      <el-table-column prop="interventionType" align="center" :label="$t('library.type')"></el-table-column>
      <el-table-column prop="faultCode" align="center" :label="$t('library.diagnostic')"></el-table-column>
      <el-table-column prop="spn" align="center" :label="'SPN'"></el-table-column>
      <el-table-column prop="fmi" align="center" :label="'FMI'"></el-table-column>
      <el-table-column prop="faultDes" align="center" :label="$t('library.desc')"></el-table-column>
      <el-table-column prop="updateTime" align="center" :label="$t('oil.updateTime')"></el-table-column>
      <el-table-column align="center" :label="$t('carGroup.operation')">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detail(scope.row)">{{$t('common.detail')}}</el-button>
          <el-button type="text" size="small" @click="update(scope.row)">{{$t('carGroup.edit')}}</el-button>
          <el-button type="text" size="small" @click="del(scope.row)">{{$t('common.del')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="query.page_number"
      :limit.sync="query.page_size"
      @pagination="getList"
    />
    <Import
      :title="$t('library.import')"
      :batchAddCarVis="batchAddCarVis"
      :limit="limit"
      :action="action"
      :accept="accept"
      :tip="tip"
      :demoURL="demoURL"
      :batchAddInfo="batchAddInfo"
      @handleSuccess = "handleSuccess"
      @cancelBatchAddCar = "cancelBatchAddCar"
    ></Import>
    <Export
      :iframe-filter="iframeFilter"
      @exportMethod="emailExcel"
    />
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVis"
      top="20vh"
      width="50%"
      :title="dialogType=='add'?$t('common.add'):dialogType=='detail'?$t('common.del'):dialogType=='update'?$t('common.edit'):''"
      :show-close="false"
    >
      <center>
        <el-form
          :inline="true"
          :model="addForm"
          label-position="left"
          :rules="addFormRuless"
          ref="addForm"
        >
          <el-row>
            <el-form-item :label="$t('library.parts')" label-width="150px" prop="partName">
              <el-input v-model="addForm.partName" class="dialogFormItem" :disabled="dialogType === 'detail'"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('library.partsVal')" label-width="150px" prop="partValue">
              <el-input v-model="addForm.partValue" class="dialogFormItem" :disabled="dialogType === 'detail'"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('library.group')" label-width="150px" prop="faultGroup">
              <el-input v-model="addForm.faultGroup" class="dialogFormItem" :disabled="dialogType === 'detail'"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('library.level')+'：'" label-width="150px" prop="faultLevel">
              <el-select
                v-model="addForm.faultLevel"
                class="dialogFormItem"
                :placeholder="$t('common.select')"
                clearable
                :disabled="dialogType === 'detail'"
              >
                <el-option value="S" :label="$t('library.serious')"></el-option>
                <el-option value="C" :label="$t('library.common')"></el-option>
                <el-option value="D" :label="$t('library.heating')"></el-option>
              </el-select>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('library.inter')" label-width="150px" prop="interventionType">
              <el-select
                v-model="addForm.interventionType"
                class="dialogFormItem"
                :placeholder="$t('common.select')"
                clearable
                :disabled="dialogType === 'detail'"
              >
                <el-option :value="$t('library.cc')" :label="$t('library.cc')"></el-option>
                <el-option value="" :label="$t('library.empty')"></el-option>
              </el-select>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('library.code')" label-width="150px" prop="faultCode">
              <el-input v-model="addForm.faultCode" class="dialogFormItem" :disabled="dialogType === 'detail'"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="'SPN：'" label-width="150px" prop="spn" class="is-required">
              <el-input v-model="addForm.spn" class="dialogFormItem" :disabled="dialogType === 'detail'"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="'FMI：'" label-width="150px" prop="fmi">
              <el-input v-model="addForm.fmi" class="dialogFormItem" :disabled="dialogType === 'detail'"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('library.desc')+'：'" label-width="150px" prop="faultDes">
              <el-input v-model="addForm.faultDes" class="dialogFormItem" type="textarea" :disabled="dialogType === 'detail'"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('library.widget')" label-width="150px" prop="faultComponent">
              <el-input v-model="addForm.faultComponent" class="dialogFormItem" type="textarea" :disabled="dialogType === 'detail'"/>
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('library.question')" label-width="150px" prop="causeProblems">
              <el-input
                v-model="addForm.causeProblems"
                class="dialogFormItem" 
                type="textarea"
                maxlength="2000"
                show-word-limit
                :disabled="dialogType === 'detail'"
              />
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('library.reason')" label-width="150px" prop="faultCause">
              <el-input
                v-model="addForm.faultCause"
                class="dialogFormItem"
                type="textarea"
                maxlength="2000"
                show-word-limit
                :disabled="dialogType === 'detail'"
              />
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item :label="$t('library.solution')" label-width="150px" prop="faultSolutions">
              <el-input
                v-model="addForm.faultSolutions"
                class="dialogFormItem"
                type="textarea"
                maxlength="2000"
                show-word-limit
                :disabled="dialogType === 'detail'"
              />
            </el-form-item>
          </el-row>

          <el-row>
            <el-form-item>
              <el-button type="warning" @click="cancel">{{$t('common.cancel')}}</el-button>
              <el-button type="primary" @click="submit" v-if="dialogType == 'add' || dialogType == 'update'">{{$t('common.submit')}}</el-button>
            </el-form-item>
          </el-row>

        </el-form>
      </center>
    </el-dialog>
	</div>
</template>

<script>
import {
  queryCarFaultBaseList , 
  exportRealtimeCarFaultList ,
  delCarFaultBaseInfo ,
  exportCarFaultBaseList ,
  importCarFaultBaseInfo ,
  saveCarFaultBaseInfo ,
  queryCarFaultBaseInfo
} from "@/api/business/businessService";
import pagination from '@/components/pagination'; 
import Export from '@/components/Export';
import Import from '@/components/import';

export default {
  name: 'Library',
  components: {
    pagination ,
    Export ,
    Import
  },
  data () {
    var checkSPN = (rule, value, callback) => {
      var reg = /^[0-9a-zA-Z/]+$/;
      if(!value) {
        return callback(new Error(this.$t('library.needSPN')));
      } else if (!reg.test(value)) {
        return callback(new Error(this.$t('library.formatSPN')  ));
      } else {
        callback();
      }
    };
    var checkFaultCode = (rule, value, callback) => {
      var reg = /^[0-9a-zA-Z/]+$/;
      if (!reg.test(value) && value) {
        return callback(new Error(this.$t('library.formatCode')));
      } else {
        callback();
      }
    };
    return {
      addFormRuless: {
        partName: [
          { required: true, message: this.$t('library.needWidget') , trigger: 'blur' }
        ],
        partValue: [
          { required: true, message:  this.$t('library.needValue'), trigger: 'blur' }
        ],
        faultGroup: [
          { required: true, message:  this.$t('library.needGroup'), trigger: 'blur' }
        ],
        faultLevel: [
          { required: true, message:  this.$t('library.needLevel'), trigger: 'change' }
        ],
        faultCode: [
          { validator: checkFaultCode, trigger: 'blur' }
        ],
        spn: [
          { validator: checkSPN, trigger: 'blur' }
        ],
        fmi: [
          { required: true, message:  this.$t('library.needDFMI'), trigger: 'change' }
        ],
        faultDes: [
          { required: true, message:  this.$t('library.needDesc'), trigger: 'change' }
        ],
      },
      addForm: {
        partName: '',
        partValue: '',
        faultGroup: '',
        faultLevel: '',
        interventionType: '',
        faultCode: '',
        spn: '',
        fmi: '',
        faultDes: '',
        faultComponent: '',
        causeProblems: '',
        faultCause: '',
        faultSolutions: ''
      },
      dialogType: '',
      dialogVis: false,
      tip: this.$t('library.remark'),
      batchAddInfo: null,
      action: 'https://sy.aerozhonghuan.com:44300/fsm/fsevice/uploadFile',
      demoURL: 'http://sy.aerozhonghuan.com:81/test/yiqi/web/qdfaw/tboss/assets/import/breakdown.xlsx',
      accept: '.xlsx,.xls',
      limit: 1,
      batchAddCarVis: false,
      iframeFilter: {},
      total: 0,
      tableData: [],
      query: {
        page_number: 1,
        page_size: 10
      },
      delIds: {
        faultId: []
      },
      updateParams: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    cancel () {
      this.$refs['addForm'].resetFields()
      this.dialogVis = false
      this.dialogType = ''
    },
    submit () {
      this.$refs['addForm'].validate(async (valid) => {
        if (valid) {
          if(this.dialogType == 'update'){
            this.addForm.createTime = this.updateParams.createTime
            this.addForm.createUser = this.updateParams.createUser
            this.addForm.updateTime = this.updateParams.updateTime
            this.addForm.updateUser = this.updateParams.updateUser
            this.addForm.faultId = this.updateParams.faultId
          } else {
            delete this.addForm.createTime
            delete this.addForm.createUser
            delete this.addForm.updateTime
            delete this.addForm.updateUser
            delete this.addForm.faultId
          }
          const re = await saveCarFaultBaseInfo(this.addForm);
          if(re.message == 'OK'){
            this.$message({
              message: this.$t('common.tips.operateSuccess'),
              type: 'success'
            });
            this.$refs['addForm'].resetFields()
            this.dialogVis = false
            this.dialogType = ''
            this.getList()
          } else {
            this.$message({
              message: this.$t('library.operateFail') ,
              type: 'error'
            });
          }
        } else {
          this.$message.error( this.$t('carGroupBuild.sunmitFault'))
          return false
        }
      });
    },
    add () {
      this.dialogVis = true
      this.dialogType = 'add'
    },
    detail (row) {
      this.dialogVis = true
      this.dialogType = 'detail'
      this.getAddFormInfo(row.faultId)
    },
    update (row) {
      this.updateParams.createTime = row.createTime
      this.updateParams.createUser = row.createUser
      this.updateParams.updateTime = row.updateTime
      this.updateParams.updateUser = row.updateUser
      this.updateParams.faultId = row.faultId
      this.dialogVis = true
      this.dialogType = 'update'
      this.getAddFormInfo(row.faultId)
    },
    async getAddFormInfo (faultId) {
      const re = await queryCarFaultBaseInfo({faultId});
      this.addForm.partName = re.data.partName
      this.addForm.partValue = re.data.partValue
      this.addForm.faultGroup = re.data.faultGroup
      this.addForm.faultLevel = re.data.faultLevel
      this.addForm.interventionType = re.data.interventionType
      this.addForm.faultCode = re.data.faultCode
      this.addForm.spn = re.data.spn
      this.addForm.fmi = re.data.fmi
      this.addForm.faultDes = re.data.faultDes
      this.addForm.faultComponent = re.data.faultComponent
      this.addForm.causeProblems = re.data.causeProblems
      this.addForm.faultCause = re.data.faultCause
      this.addForm.faultSolutions = re.data.faultSolutions
    },
    importFaults () {
      this.batchAddCarVis = true
    },
    async handleSuccess (response) {
      let params = {
        uuid: response.data.fullPath,
        fileType: response.data.ext_name,
      }
      const re = await importCarFaultBaseInfo(params)
      this.batchAddInfo = re.data
    },
    cancelBatchAddCar () {
      this.batchAddCarVis = false
      this.batchAddInfo = null
    },
    handleSelectionChange (val) {
      this.delIds.faultId = [];
      val.forEach(item => {
        this.delIds.faultId.push(item.faultId)
      })
      this.delIds.faultId = this.delIds.faultId.join()
    },
    del (row) {
      this.$confirm( this.$t('library.delete'),  this.$t('common.del'), {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(async () => {
        let re = await delCarFaultBaseInfo({faultId: row.faultId})
        if(re.message==="OK"){
          this.$message({
            message:  this.$t('common.tips.delSuccess'),
            type: 'success'
          });
        } else {
          this.$message({
            message: this.$t('library.deleteFail') ,
            type: 'error'
          });
        }
        this.getList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message:  this.$t('library.cancelDelete') 
        });          
      });
    },
    showFaultLevelLabel (row) {
      switch (row) {
        case 'S':
          return this.$t('library.serious') 
        case 'C':
          return  this.$t('library.common') 
        case 'D': 
          return  this.$t('library.heating') 
      }
    },
    handleDownExcel () {
      this.iframeFilter = {
        data: {
          isEmail: true
        }
      }
    },
    async emailExcel (email) {
      await exportCarFaultBaseList(Object.assign({ email: email }, this.query))
      this.$message.success( this.$t('export.receive') );
    },
    async getList() {
        let re = await queryCarFaultBaseList(this.query);
        this.tableData = re.data.list
        this.total = re.data.total
    },
    exportFault () {
      
    },
    showDetail (row) {
      console.log(row)
    }
  }
}
</script>

<style scoped>
  .dialogFormItem {
    width: 300px
  }
</style>
