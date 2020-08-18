<template>
	<div class="app-container">
    <el-card>
      <center>
        <el-row class="title-item">
          {{$t('carGroupUpdate.carTeamInfo')}}
        </el-row>

        <el-row class="info-row">
          <el-col :span="12">
            {{$t('carGroupUpdate.teamID')}}<span class="basicinfo">{{basicinfo.carTeamid}}</span>
          </el-col>
          
          <el-col :span="12">
            <el-form>
              <el-form-item prop="teamName">
                {{$t('carGroupUpdate.teamName')}}
                <span class="basicinfo">
                  <el-input
                    v-model="basicinfo.carTeamName"
                    class="formItem"
                    @input="changeCarTeamName"
                  />
                </span>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

        <el-row>
          <el-button
            type="primary"
            @click="save"
            :disabled="!hasChanged"
            size="small"
            style="width: 100px"
          >
            {{$t('carGroupUpdate.save')}}
          </el-button>
        </el-row>

        <el-row class="title-item">
          <el-col :span='1.5'>
            {{$t('carGroupUpdate.manager')}}
          </el-col>
          <el-col class="addBtn" :span='1'>
            <el-button
              type="text"
              size="small"
              @click="addAdmin"
              icon="el-icon-circle-plus"
            >
            {{$t('carGroupUpdate.addManager')}}
            </el-button> 
          </el-col>
        </el-row>

        <el-row class="info-row" v-if="showAddAdminForm">
          <el-card>
            <el-form
              :inline="true"
              :model="addAdminForm"
              :rules="ruless"
              ref="addAdminForm"
            >
              <el-col :span="24" align="left">
                <el-form-item prop="name" align="left">
                  <el-select
                    size="small"
                    v-model="addAdminForm.name"
                    class="formItem"
                    filterable
                    remote
                    :remote-method="remoteMethod"
                    :placeholder="$t('carGroupUpdate.managerPlaceHolder')"
                    :loading="loading"
                    @change="handleChange"
                    style="width: 600px"
                  >
                    <el-option
                      v-for="item in managers"
                      :key="item.id"
                      :label="(item.name && item.name!=''?item.name:$t('carGroupUpdate.noName')) + '（' + (item.phone && item.phone!=''?item.phone:$t('carGroupUpdate.noPhone')) + '，' + (item.accountName&&item.accountName!=''?item.accountName:$t('carGroupUpdate.noAccount')) + '）'"
                      :value="item.name"
                    >
                    </el-option>
                  </el-select>
                  <br/>
                  <el-button type="text" size="small" @click="buildManager">{{$t('carGroupUpdate.newManamger')}}</el-button>
                </el-form-item>

                <el-form-item>
                  <el-button
                    size="small"
                    style="width: 100px"
                    type="primary"
                    @click="saveAdd"
                    :disabled="!addAdminForm.name"
                  >
                  {{$t('carGroupUpdate.confirm')}}
                  </el-button>
                </el-form-item>
              </el-col>

            </el-form>
          </el-card>

          <el-dialog
            :close-on-click-modal="false"
            :visible.sync="buildManagerDialogVis"
            top="20vh"
            width="50%"
            :title="$t('carGroupUpdate.newManamger')"
          >
            <el-card>
              <center>
                <el-form
                  :inline="true"
                  :model="dialogForm"
                  label-position="left"
                  :rules="dialogRuless"
                  ref="dialogForm"
                >
                  <el-row>
                    <el-form-item :label="$t('carGroupUpdate.managerName')" label-width="150px" prop="name">
                      <el-input v-model="dialogForm.name" class="dialogFormItem"/>
                    </el-form-item>
                  </el-row>

                  <el-row>
                    <el-form-item :label="$t('carGroupUpdate.managerAccount')" label-width="150px" prop="accountName" class="is-required">
                      <el-input v-model="dialogForm.accountName" class="dialogFormItem"/>
                    </el-form-item>
                  </el-row>

                  <el-row>
                    <el-form-item :label="$t('carGroupUpdate.password')" label-width="150px" prop="passWord" class="is-required">
                      <el-input auto-complete="new-password" v-model="dialogForm.passWord" class="dialogFormItem"/>
                    </el-form-item>
                  </el-row>

                  <el-row>
                    <el-form-item>
                      <el-button type="warning" @click="cancel">{{$t('carGroupUpdate.cancel')}}</el-button>
                      <el-button type="primary" @click="add">{{$t('carGroupUpdate.add')}}</el-button>
                    </el-form-item>
                  </el-row>
                </el-form>
              </center>
            </el-card>
          </el-dialog>
        </el-row>

        <el-row class="info-row">
          <el-table
            class='t-table'
            stripe :data="adminsData"
            style="width: 100%; text-align: center;"
          >
            <el-table-column prop="name" align="center" :label="$t('carGroupUpdate.managerName')"></el-table-column>
            <el-table-column prop="accountName" align="center" :label="$t('carGroupUpdate.managerAccount')"></el-table-column>
            <el-table-column prop="carTeamAccountPhone" align="center" :label="$t('carGroupUpdate.managerPhone')"></el-table-column>
            <el-table-column align="center" :label="$t('carGroupUpdate.operate')">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="delateAdmin(scope.row)" icon="el-icon-remove-outline">{{$t('carGroupUpdate.deleteManager')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>

        <el-row class="title-item">
          {{$t('carGroupUpdate.bindCars')}} 
        </el-row>

        <el-collapse v-model="activeNames" @change="handleCollapseChange">
          <el-collapse-item name="1">
            <template slot="title">
              <el-tag type="success">{{basicinfo.carTeamName}}</el-tag>
            </template>
            <el-row>
              <el-col class="addBtn" :span='2'>
                <el-button
                  type="text"
                  size="small"
                  @click="addCar"
                  icon="el-icon-circle-plus"
                >
                {{$t('carGroupUpdate.addCar')}}
                </el-button> 
              </el-col>
              <el-col class="addBtn" :span='2'>
                <el-button
                  type="text"
                  size="small"
                  @click="batchAddCar"
                  icon="el-icon-circle-plus"
                >
                {{$t('carGroupUpdate.batchAddCar')}}
                </el-button> 
              </el-col>
            </el-row>
            <el-row class="info-row">
              <el-table
                class='t-table'
                stripe
                :data="carsData"
                style="width: 100%; text-align: center;"
              >
                <el-table-column prop="carVin" align="center" :label="'VIN'">
                  <template slot-scope="scope">
                    <el-button type="text" @click="goToEdit(scope.row.carId, 'detail')" size="small">{{scope.row.carVin}}</el-button>
                  </template>
                </el-table-column>
                <el-table-column prop="carSerise" align="center" :label="$t('carGroupUpdate.series')"></el-table-column>
                <el-table-column prop="carModel" align="center" :label="$t('carGroupUpdate.model')"></el-table-column>
                <el-table-column prop="dischargeName" align="center" :label="$t('carGroupUpdate.discharge')"></el-table-column>
                <el-table-column prop="carNumber" align="center" :label="$t('carGroupUpdate.licenseNo')"></el-table-column>
                <el-table-column prop="salesDate" align="center" :label="$t('carGroupUpdate.STD')"></el-table-column>
                <el-table-column prop="mbSalesDate" align="center" :label="$t('carGroupUpdate.AAK')"></el-table-column>
              </el-table>
              <pagination
                v-show="total>0"
                :total="total"
                :page.sync="query.page_number"
                :limit.sync="query.page_size"
                @pagination="getCarList"
              />
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </center>
      <Import
        :title="$t('carGroupUpdate.batchAddCar')"
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
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addCarDialogVis"
      top="20vh"
      width="75%"
      :title="$t('carGroupUpdate.addCar')"
    >
      <div style="text-align: center">
        <el-row style="margin-bottom: 30px">
          <el-col align="center">
            <el-input
              v-model="vin"
              class="formItem"
              :placeholder="$t('carGroupUpdate.vinPlaceHolder')"
              size="small"
              style="width: 56%;"
              @input="handleInputChange"
            />
            <el-button
              type="info"
              plain
              @click="searchVin"
              size="small"
              :disabled="!moreThanEight"
            >
              {{$t('carGroupUpdate.search')}}
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-transfer
            style="text-align: left; display: inline-block"
            v-model="transferValue"
            :titles="[$t('carGroupUpdate.selectCar'), $t('carGroupUpdate.selectedCar')]"
            :format="{
              noChecked: '${total}',
              hasChecked: '${checked}/${total}'
            }"
            @change="handleChange"
            :data="transferData">
            <span slot-scope="{ option }">{{ option.label }}</span>
          </el-transfer>
        </el-row>
        <el-row style="margin-top: 30px;">
          <el-col :span="2" :offset="10">
            <el-button @click="dialogCancel" size="small"  type="info" plain>{{$t('carGroupUpdate.cancel')}}</el-button>
          </el-col>
          <el-col :span="2">
            <el-button @click="dialogConfirm" size="small" type="info" >{{$t('carGroupUpdate.confirm')}}</el-button>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
	</div>
</template>

<script>
import { 
  getAdminList , 
  getCarList , 
  modifyCarTeam , 
  delCarTeamManager , 
  getManagerData , 
  addCarTeamManager , 
  newAccount , 
  batchAddCarList ,
  addCarByVin ,
  addCarTeamCar
} from "@/api/business/businessService";
import { getUserInfo } from '@/api/users'
import Import from '@/components/import';
import pagination from '@/components/pagination'; 

export default {
  name: 'CarGroupUpdate',
  components: {
    Import ,
    pagination
  },
  data () {
    var checkAccountName = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9!_@#$%^&*\.\+\-=]+$/;
      if(!value) {
        return callback(new Error(this.$t('carGroupUpdate.managerAccountRequire')));
      } else if (value.search(/[a-zA-Z]+/)==-1) {
        return callback(new Error(this.$t('carGroupUpdate.aTozRequire')));
      } else if (!reg.test(value)) {
        return callback(new Error(this.$t('carGroupUpdate.managerAccountUnexpected')));
      } else if (value.length<6) {
        return callback(new Error(this.$t('carGroupUpdate.managerAccountMinTip')));
      } else if (value.length>20) {
        return callback(new Error(this.$t('carGroupUpdate.managerAccountMaxTip')));
      } else {
        callback();
      }
    };
    var checkPassWord = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9!_@#$%^&*\.\+\-=]+$/;
      if(!value) {
        return callback(new Error(this.$t('carGroupUpdate.managerPasswordRequire')));
      } else if (!reg.test(value)) {
        return callback(new Error(this.$t('carGroupUpdate.managerPasswordUnexpected')));
      } else if (value.length<6) {
        return callback(new Error(this.$t('carGroupUpdate.managerPasswordMinTip')));
      } else if (value.length>20) {
        return callback(new Error(this.$t('carGroupUpdate.managerPasswordMaxTip')));
      } else {
        callback();
      }
    };
    return {
      total: 0,
      moreThanEight: false,
      transferValue: [],
      transferData: [],
      vin: '',
      addCarDialogVis: false,
      batchAddInfo: null,
      tip: this.$t('carGroupUpdate.importWarn'),
      accept: '.xlsx,.xls',
      action: 'http://sy.aerozhonghuan.com:81/fsm/fsevice/uploadFile',
      demoURL: 'http://sy.aerozhonghuan.com:81/test/yiqi/web/qdfaw/tboss/assets/import/addCarList.xlsx',
      limit: 1,
      batchAddCarVis: false,
      accountName: '',
      showAddAdminForm: false,
      dialogForm: {
        name: '',
        accountName: '',
        passWord: ''
      },
      dialogRuless: {
        name: [
          { required: true, message: this.$t('carGroupUpdate.managerNameRequire'), trigger: 'blur' },
          { min: 2, max: 20, message: this.$t('carGroupUpdate.managerNameUnexpected'), trigger: 'blur' }
        ],
        accountName: [
          { validator: checkAccountName, trigger: 'blur' }
        ],
        passWord: [
          { validator: checkPassWord, trigger: 'blur' }
        ]
      },
      managersCopy: [],
      managers: [],
      loading: false,
      addAdminForm: {},
      hasChanged: false,
      activeNames: ['1'],
      basicinfo: {
        carTeamId: ''
      },
      adminsData: [],
      carsData: [],
      ruless: {},
      buildManagerDialogVis: false,
      query: {
        page_number: 1,
        page_size: 20
      },
    }
  },
  activated() {
    this.basicinfo = this.$route.query.basicinfo
    this.getAdminList()
    this.getCarList()
    this.getAccountName ()
  },
  methods: {
    goToEdit(id, type){
      this.$router.push(`/basicInfo/carManage/${id}/${type}`)
    },
    async dialogConfirm () {
      let params = {
        teamId: this.basicinfo.carTeamid,
        reviewer: this.accountName,
      }
      params.carId = this.transferValue.join()
      let carVins = []
      this.transferData.filter((item,index) => {
        return params.carId.indexOf(item.key) > -1
      }).forEach((item , index) => {
        carVins.push(item.label)
      })
      params.carVin = carVins.join()
      const dialogAddCar = await addCarTeamCar(params);
      if (dialogAddCar.message == 'OK') {
        this.$message({
          message: this.$t('carGroupUpdate.addSuccess'),
          type: 'success'
        });
        this.dialogCancel()
      } else {
        this.$message({
          message: this.$t('carGroupUpdate.addFault'),
          type: 'error'
        });
      }
    },
    dialogCancel () {
      this.moreThanEight = false
      this.transferValue = []
      this.transferData = []
      this.vin = ''
      this.addCarDialogVis = false
      this.getCarList()
    },
    handleInputChange (val) {
      if(val.length>=8){
        this.moreThanEight = true
      } else {
        this.moreThanEight = false
      }
    },
    async searchVin () {
      let params = {
        keyWord: this.vin
      }
      const cars = await addCarByVin(params);
        if (cars.message == 'OK') {
          this.$message({
            message: this.$t('carGroupUpdate.searchSuccess'),
            type: 'success'
          });
          this.transferData = []
          cars.data.forEach((item , index) => {
            this.transferData.push({})
            this.transferData[index].key = item.carId*1
            this.transferData[index].label = item.carVin
          });
        } else {
          this.$message({
            message: this.$t('carGroupUpdate.searchFault'),
            type: 'error'
          });
        }
    },
    addCar () {
      this.addCarDialogVis = true
    },
    batchAddCar () {
      this.batchAddCarVis = true
    },
    async handleSuccess (response) {
      let params = {
        uuid: response.data.fullPath,
        fileType: response.data.ext_name,
        reviewer: this.accountName,
        teamId: this.basicinfo.carTeamid
      }
      const batchAdd = await batchAddCarList(params)
      this.batchAddInfo = batchAdd.data
    },
    cancelBatchAddCar () {
      this.batchAddCarVis = false
      this.batchAddInfo = null
    },
    async getAccountName () {
      const user = await getUserInfo()
      this.accountName = user.data.username
    },
    async saveAdd () {
      let params = {
        teamId: this.basicinfo.carTeamid
      }
      if(this.managers.length){
        let fil = this.managersCopy.filter(item => {
          return item.name === this.addAdminForm.name
        })
        params.id = fil[0].id
        params.userPhone = fil[0].phone
      }
      const modify = await addCarTeamManager(params);
        if (modify.message == 'OK') {
          this.$message({
            message: this.$t('carGroupUpdate.appendSuccess'),
            type: 'success'
          });
        } else {
          this.$message({
            message: this.$t('carGroupUpdate.appendFault'),
            type: 'error'
          });
        }
      if(this.$refs['addAdminForm']){
        this.$refs['addAdminForm'].resetFields()
      }
      this.managers = []
      this.managersCopy = []
      this.getAdminList()
      this.showAddAdminForm = false
    },
    add () {
      this.$refs['dialogForm'].validate(async (valid) => {
        if (valid) {
          let params = {
            name: this.dialogForm.name,
            accountName: this.dialogForm.accountName,
            passWord: this.dialogForm.passWord,
            carTeamId: this.basicinfo.carTeamid,
            createType: 'tboss',
            type: '1',
            tbossName: this.accountName
          }
          const re = await newAccount(params);
          if(re.message == 'OK'){
            this.$message({
              message: this.$t('carGroupUpdate.createManagerAndBindSuccess'),
              type: 'success'
            });
            this.buildManagerDialogVis = false
            if(this.$refs['addAdminForm']){
              this.$refs['addAdminForm'].resetFields()
            }
            if(this.$refs['dialogForm']){
              this.$refs['dialogForm'].resetFields()
            }
            this.managers = []
            this.managersCopy = []
            this.getAdminList()
            this.showAddAdminForm = false
          } else {
            this.$message.error(this.$t('carGroupUpdate.addFault'))
            return false
          }
        } else {
          this.$message.error(this.$t('carGroupUpdate.submitFault'))
          return false
        }
      });
    },
    cancel () {
      this.$refs['dialogForm'].resetFields()
      this.buildManagerDialogVis = false
    },
    buildManager (flag) {
      this.buildManagerDialogVis = true
      if(this.$refs['dialogForm']){
        this.$refs['dialogForm'].resetFields()
      }
    },
    handleChange () {
      if(this.$refs['dialogForm']){
        this.$refs['dialogForm'].resetFields()
      }
    },
    async remoteMethod(query) {
      if (query !== '') {
        let params = {
          keyWord: query
        }
        this.loading = true;
        const re = await getManagerData(params);
        this.managers = JSON.parse(JSON.stringify(re.data))
        this.managersCopy = JSON.parse(JSON.stringify(re.data))
        this.loading = false;
      } else {
        this.managers = [];
      }
    },
    addAdmin () {
      this.showAddAdminForm = !this.showAddAdminForm
    },
    delateAdmin (row) {
      if (this.adminsData.length == 1) {
        this.$message({
          message: this.$t('carGroupUpdate.deleteWarn'),
          type: 'warning'
        });
      } else {
        this.$confirm(this.$t('carGroupUpdate.deleteConfirm'), this.$t('carGroupUpdate.tip'), {
          confirmButtonText: this.$t('carGroupUpdate.confirm'),
          cancelButtonText: this.$t('carGroupUpdate.cancel'),
          type: 'warning'
        }).then(async () => {
          let params = {
            teamId: this.basicinfo.carTeamid,
            id: row.managerId
          }
          const delManager = await delCarTeamManager(params)
            .then(() => {
              this.$message({
                type: 'success',
                message: this.$t('carGroupUpdate.deleteSuccess')
              });
              this.getAdminList()
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('carGroupUpdate.canceled')
          });          
        });
      }
    },
    changeCarTeamName () {
      this.hasChanged = true
    },
    async save () {
      let params = {
        teamId: this.basicinfo.carTeamid,
        isCompany: 0,
        isGroup: 0,
        isVip: 0,
        teamName: this.basicinfo.carTeamName
      }
      const modify = await modifyCarTeam(params);
      if (modify.message == 'OK') {
        this.$message({
          message: this.$t('carGroupUpdate.changeSuccess'),
          type: 'success'
        });
      } else {
        this.$message({
          message: this.$t('carGroupUpdate.changeFault'),
          type: 'error'
        });
      }
      this.hasChanged = false
    },
    handleCollapseChange () {

    },
    async getAdminList () {
      let params = {
        carTeamId: this.basicinfo.carTeamid
      }
      const admins = await getAdminList(params);
      this.adminsData = admins.data
    },
    async getCarList () {
      let params = {
        carTeamId: this.basicinfo.carTeamid,
        carTeamLevel: this.basicinfo.carTeamLevel,
        carTeamType: '1',
        page_number: this.query.page_number,
        page_size: this.query.page_size
      }
      const cars = await getCarList(params);
      this.carsData = cars.data.list
      this.total = cars.data.total
    }
  }
}
</script>

<style scoped>
  .addBtn {
    display: inline-block;
    padding-left: 10px;
  }
</style>
