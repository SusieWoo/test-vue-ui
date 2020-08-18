<template>
  <div class="editCar">
    <div class="content">
      <el-form
        ref="form"
        inline
        :model="form"
        :rules="rules"
        label-width="130px"
        label-position="right"
      >
        <div>
          <span>{{$t('basicInfo.edit.v')}}</span>
          <el-divider></el-divider>
        </div>
        <div class="pd-10">
          <el-form-item prop="detail.fuel" :label="$t('basicInfo.stype')">
            <el-radio-group v-model="form.detail.fuel">
              <el-radio label="1">{{$t('basicInfo.DV')}}</el-radio>
              <el-radio label="0">{{$t('basicInfo.NGV')}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="car.chassisNum" :label="$t('basicInfo.bottomNo')">
            <el-input
              clearable
              v-model="form.car.chassisNum"
              :placeholder="$t('basicInfo.iBottomNo')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('basicInfo.edit.qrcode')">
            <el-input
              clearable
              v-model="form.car.qrCode"
              :placeholder="$t('basicInfo.edit.iQrcode')"
            ></el-input>
          </el-form-item>
          <el-form-item prop="car.carModelCode" :label="$t('basicInfo.carModelCode')">
            <el-input
              clearable
              v-model="form.car.carModelCode"
              :placeholder="$t('basicInfo.edit.iCarModelCode')"
            ></el-input>
          </el-form-item>
          <el-form-item prop="car.carType" :label="$t('basicInfo.carType')">
            <el-select v-model="form.car.carType" :placeholder="$t('basicInfo.edit.sCarType')">
              <el-option
                v-for="item in carList"
                :key="item.id"
                :label="item.dataValue"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <select-table
            :label="$t('basicInfo.bdealer')"
            :key="1"
            :placeholder="$t('basicInfo.sbdealer')"
            :tableTitle="$t('basicInfo.bdealer')"
            prop="dealer.name"
            searchName="fruzzy"
            :columnList="columnList"
            :tableList="tableList"
            @search="getDealer"
            :total="total"
            v-model="form.dealer.name"
            @obj="getSelectDealer"
          ></select-table>

          <select-table
            :key="2"
            v-show="form.dealer.id"
            :label="$t('basicInfo.edit.fk')"
            :placeholder="$t('basicInfo.edit.sfk')"
            :tableTitle="$t('basicInfo.edit.fk')"
            prop="controller.sim"
            searchName="fruzzy"
            :columnList="columnList"
            :tableList="tableList"
            @search="getTerminal"
            :total="total"
            v-model="form.controller.sim"
            @obj="getSelectSim"
          ></select-table>
        </div>

        <div>
          <span>{{$t('basicInfo.edit.vi')}}</span>
          <el-divider></el-divider>
        </div>

        <div class="pd-10">
          <el-form-item prop="car.chassisNum" :label="$t('basicInfo.edit.vId')">
            <el-input
              clearable
              v-model="form.car.vechicleVin"
              :placeholder="$t('basicInfo.edit.iVId')"
            ></el-input>
          </el-form-item>
          <el-form-item prop="detail.engineType" :label="$t('basicInfo.motorType')">
            <el-select
              v-model="form.detail.engineType"
              :placeholder="$t('basicInfo.edit.sMotorType')"
            >
              <el-option
                v-for="item in engineList"
                :key="item.id"
                :label="item.dataValue"
                :value="item.dataCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('basicInfo.motivitor')">
            <el-input
              clearable
              v-model="form.car.carModelCode"
              :placeholder="$t('basicInfo.edit.iMotivitor')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('business.motor')">
            <el-input
              clearable
              v-model="form.car.carModelCode"
              :placeholder="$t('basicInfo.edit.imotor')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('basicInfo.edit.oil')">
            <el-input
              clearable
              v-model="form.car.carModelCode"
              :placeholder="$t('basicInfo.edit.ioil')"
            ></el-input>
          </el-form-item>
          <el-form-item prop="car.vfactory" :label="$t('basicInfo.factoryCode')">
            <el-select v-model="form.car.vfactory" :placeholder="$t('basicInfo.edit.sfactory')">
              <el-option
                v-for="item in vfactoryList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('monitor.car.f1Factory')">
            <el-input
              clearable
              v-model="form.detail.frontAxleFactoryOne"
              :placeholder="$t('monitor.car.if1Factory')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('monitor.car.f1Type')">
            <el-input
              clearable
              v-model="form.detail.frontAxleTypeOne"
              :placeholder="$t('monitor.car.if1Type')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('monitor.car.f2Factory')">
            <el-input
              clearable
              v-model="form.detail.frontAxleFactoryTwo"
              :placeholder="$t('monitor.car.if2Factory')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('monitor.car.f2Type')">
            <el-input
              clearable
              v-model="form.detail.frontAxleTypeTwo"
              :placeholder="$t('monitor.car.if2Type')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('monitor.car.b1Factory')">
            <el-input
              clearable
              v-model="form.detail.rearAxleFactoryOne"
              :placeholder="$t('monitor.car.ib1Factory')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('monitor.car.b1Type')">
            <el-input
              clearable
              v-model="form.detail.rearAxleTypeOne"
              :placeholder="$t('monitor.car.ib1Type')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('monitor.car.b2Factory')">
            <el-input
              clearable
              v-model="form.detail.rearAxleFactoryTwo"
              :placeholder="$t('monitor.car.ib2Factory')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('monitor.car.b2Type')">
            <el-input
              clearable
              v-model="form.detail.rearAxleTypeTwo"
              :placeholder="$t('monitor.car.ib2Type')"
            ></el-input>
          </el-form-item>
        </div>

        <div>
          <span>{{$t('monitor.car.preSalesInfo')}}</span>
          <el-divider></el-divider>
        </div>
        <div class="pd-10">
          <el-form-item prop="car.online" :label="$t('basicInfo.edit.offline')">
            <el-date-picker
              v-model="form.car.online"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('basicInfo.edit.soffline')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="car.removeTime" :label="$t('monitor.car.outdate')">
            <el-date-picker
              v-model="form.car.removeTime"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('basicInfo.edit.sodate')"
            ></el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('basicInfo.stdStatus')">
            <el-select v-model="form.sale.saleStatus" :placeholder="$t('common.select')">
              <el-option value="0" :label="$t('basicInfo.edit.sold')"></el-option>
              <el-option value="1" :label="$t('basicInfo.edit.unsold')"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="form.sale.saleStatus==='0'"
            prop="sale.saleDate"
            :label="$t('basicInfo.stdDate')"
          >
            <el-date-picker
              v-model="form.sale.saleDate"
              value-format="yyyy-MM-dd"
              type="date"
              :placeholder="$t('basicInfo.edit.sstd')"
            ></el-date-picker>
          </el-form-item>
        </div>

        <div v-if="form.sale.saleStatus==='0'">
          <span>{{$t('monitor.car.salesInfo')}}</span>
          <el-divider></el-divider>
        </div>
        <div class="pd-10" v-if="form.sale.saleStatus==='0'">
          <el-form-item :label="$t('basicInfo.aakStatus')">
            <el-select v-model="form.sale.mbSalesStatus" :placeholder="$t('basicInfo.edit.saak')">
              <el-option value="0" :label="$t('basicInfo.edit.sold')"></el-option>
              <el-option value="1" :label="$t('basicInfo.edit.unsold')"></el-option>
            </el-select>
          </el-form-item>
          <span v-if="form.sale.mbSalesStatus =='0'">
            <el-form-item prop="sale.mbSalesDate" :label="$t('basicInfo.aakDate')">
              <el-date-picker
                v-model="form.car.mbSalesDate"
                value-format="yyyy-MM-dd"
                type="date"
                :placeholder="$t('basicInfo.edit.saakDate')"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('monitor.search.carno')">
              <el-input
                clearable
                v-model="form.car.carCph"
                :placeholder="$t('basicInfo.iBottomNo')"
              ></el-input>
            </el-form-item>

            <el-form-item :label="$t('basicInfo.edit.vcolor')">
              <el-select v-model="form.car.color" :placeholder="$t('basicInfo.edit.pvcolor')">
                <el-option
                  v-for="item in colorList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <select-table
              :label="$t('monitor.info.customer')"
              :placeholder="$t('basicInfo.edit.scustomer')"
              :tableTitle="$t('monitor.info.customer')"
              searchName="fruzzy"
              :columnList="columnList"
              :tableList="tableList"
              @search="getBusinesses"
              :total="total"
              v-model="form.business.businessName"
              @obj="getSelectBusiness"
            ></select-table>
            <el-form-item :label="$t('basicInfo.edit.idCard')">
              <!-- <span> {{businessCode}}</span> -->
              <el-input clearable disabled v-model="businessCode"></el-input>
            </el-form-item>
            <el-form-item prop="sale.invoiceNumber" :label="$t('business.rNumber')">
              <el-input clearable v-model="form.sale.invoiceNumber"></el-input>
            </el-form-item>
            <el-form-item :label="$t('basicInfo.edit.price')">
              <el-input clearable v-model="form.sale.carAmount"></el-input>
            </el-form-item>
            <el-form-item :label="$t('basicInfo.edit.loan')">
              <el-input clearable v-model="form.sale.loanAmount"></el-input>
            </el-form-item>
            <el-form-item :label="$t('basicInfo.edit.unrepay')">
              <el-input clearable v-model="form.sale.surplus"></el-input>
            </el-form-item>
          </span>
        </div>

        <div>
          <span>{{$t('basicInfo.edit.picture')}}</span>
          <el-divider></el-divider>
        </div>
        <div class="pd-10">
          <UploadImg
            ref="uploadImg"
            :upload-config="uploadConfig"
            :upload-finish="finishUpload"
            @on-upload-success="uploadSuccess"
            @on-handle-remove="handleRemove"
          />
        </div>
      </el-form>
      <div class="pd-10 center">
        <el-button type="primary" @click="submit" :loading="loading">{{$t('common.confirm')}}</el-button>
        <el-button type="primary" @click="cancel">{{$t("common.cancel")}}</el-button>
      </div>
    </div>

    <div class="detail-info" style="padding-bottom: 50px" v-if="$route.params.type === 'detail'">
      <div style="padding-top: 40px">
        <span>{{$t('basicInfo.edit.adminInfo')}}</span>
        <el-divider></el-divider>
      </div>
      <el-table :data="carBaseInfoData.carOwnerList" style="width: 100%">
        <el-table-column prop="ownerName" :label="$t('basicInfo.edit.admin')" width="180"></el-table-column>
        <el-table-column prop="identityCard" :label="$t('basicInfo.edit.idCard')" width="180"></el-table-column>
        <el-table-column prop="ownerPhone" :label="$t('business.dealer.contactPhone')"></el-table-column>
        <el-table-column prop="invoiceNo" :label="$t('business.rNumber')"></el-table-column>
        <el-table-column prop="boundTime" :label="$t('basicInfo.edit.bindDate')"></el-table-column>
      </el-table>
      <div style="padding-top: 40px">
        <span>{{$t('basicInfo.edit.driver')}}</span>
        <el-divider></el-divider>
      </div>
      <el-table :data="carBaseInfoData.carDriverList" style="width: 100%">
        <el-table-column prop="teamName" :label="$t('basicInfo.edit.team')" width="180"></el-table-column>
        <el-table-column prop="identityCard" :label="$t('basicInfo.edit.master')" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.subDriverName === 'main' ? $t('basicInfo.edit.main') : scope.row.subDriverName === 'sub' ?$t('basicInfo.edit.sub') : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="driverPhone" :label="$t('basicInfo.edit.driverPhoneNo')"></el-table-column>
        <el-table-column prop="driverName" :label="$t('basicInfo.edit.driverName')"></el-table-column>
      </el-table>
      <div style="padding-top: 40px">
        <span>{{$t('basicInfo.edit.bteam')}}</span>
        <el-divider></el-divider>
      </div>

      <div class="car-team-list">
        <div class="row" v-for="(item, index) in treeData" :key="index">
          <i class="el-icon-s-flag"></i>
          <div class="item" v-for="(it, idx) in item.teamName" :key="idx">
            <span @click="viewCarTeam(item.currentLevel[idx], item.teamId[idx])">{{it}}</span>
            <i class="el-icon-caret-right" v-if="idx < item.teamName.length - 1"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  queryCarBasicData,
  queryDealer,
  queryTerminal,
  getBaseData,
  queryBusinesses,
  updateCar,
  queryCar,
  carBaseInfo
} from "@/api/basicInfo/index";
import pagination from "@/components/pagination";
import selectTable from "@/components/selectTable";
import UploadImg from "@/components/UploadImg";
import { objToStringFy } from "@/utils/rules";
import { parse } from "qs";
export default {
  // 发送到邮箱，弹出框输入邮箱地址，发送邮件。
  name: "editCar",
  components: {
    pagination,
    selectTable,
    UploadImg
  },
  computed: {
    vfactoryList() {
      return [
        {
          label: "QK00001" + this.$t("basicInfo.lightTruck"),
          value: "QK00001"
        },
        {
          label: "QK00002" + this.$t("basicInfo.lightTruck"),
          value: "QK00002"
        },
        {
          label: "QD00001" + this.$t("basicInfo.weightTruck"),
          value: "QD00001"
        },
        {
          label: "QA00022" + this.$t("basicInfo.weightTruck"),
          value: "QA00022"
        },
        {
          label: "LZ00001" + this.$t("basicInfo.weightTruck"),
          value: "LZ00001"
        },
        {
          label: "LZ00002" + this.$t("basicInfo.lightTruck"),
          value: "LZ00002"
        },
        {
          label: "QA00016" + this.$t("basicInfo.weightTruck"),
          value: "QA00016"
        },
        { label: "T" + this.$t("basicInfo.weightTruck"), value: "T" }
      ];
    },
    uploadConfig() {
      return {
        label: this.$t("basicInfo.edit.uploadImg"),
        sizeLimit: 2,
        numLimt: 1,
        ruleName: "rulename"
      };
    },
    rules() {
      return {
        car: {
          chassisNum: [
            { required: true, message: this.$t("basicInfo.iBottomNo") , trigger: "blur" }
          ],
          carType: [
            { required: true, message:this.$t("basicInfo.sCarType") , trigger: "change" }
          ],
          carModelCode: [
            { required: true, message: this.$t("basicInfo.iCarModelCode") , trigger: "blur" }
          ]
        },
        controller: {
          sim: [
            { required: true, message: this.$t("basicInfo.sBdealer") , trigger: "click" }
          ]
        },
        detail: {
          fuel: [
            { required: true, message:this.$t("basicInfo.sMotivator")  , trigger: "change" }
          ],
          engineType: [
            { required: true, message: this.$t("basicInfo.sMotivator") , trigger: "change" }
          ]
        },
        dealer: {
          name: [
            { required: true, message:this.$t("basicInfo.sBdealer") , trigger: "click" }
          ]
        }
      };
    },
    rulesBack() {
      return {
        chassisNum: [
          { required: true, message: this.$t("basicInfo.iBottomNo"),trigger: "blur" }
        ]
      };
    }
  },

  data() {
    return {
      loading: false,
      businessCode: "",
      total: 0,
      engineList: [],
      carList: [],
      colorList: [],
      tableList: [], //table渲染数据
      columnList: [], //table展示的列内容
      title: "",
      finishUpload: true,
      form: {
        car: { chassisNum: "", carModelCode: "", carType: "" },
        controller: { sim: "", id: "" },
        detail: { fuel: "", engineType: "" },
        sale: { saleStatus: "", carAmount: "", loanAmount: "", surplus: "" },
        business: { businessName: "" },

        dealer: { name: "" }
      },
      formBack: {
        row: {
          car: { chassisNum: "" }
        }
      },

      carBaseInfoData: {},
      treeData: []
    };
  },

  mounted() {
    this.getBasicData();
    this.getBaseData();
    if (this.$route.params.id) {
      this.getCarDetail();
    }
    console.log(this.$route);
    if (this.$route.params.type === "detail") {
      this.getCarBaseInfo();
    }
  },
  methods: {
    getCarBaseInfo() {
      carBaseInfo({ carId: "100001" }).then(res => {
        this.carBaseInfoData = res.data;
        this.treeData = res.data.carTeamList.map(item => {
          item.currentLevel = item.currentLevel.split(",");
          item.teamId = item.teamId.split(",");
          item.teamName = item.teamName.split(",");
          return item;
        });
      });
    },
    viewCarTeam(level, id) {
      console.log(level, id);
      let params = {
        carTeamId: id,
        carTeamid: id,
        carTeamLevel: level,
        carTeamType: "0"
      };
      this.$router.push({
        path: "/business/carGroupDetail",
        query: {
          basicinfo: params
        }
      });
    },
    handleRemove(res) {
      this.form.imgPath = "";
    },
    uploadSuccess(res) {
      this.form.imgPath = res[0].filePath;
    },
    getSelectDealer(obj) {
      this.form.dealer.id = obj.id;
    },
    getSelectSim(obj) {
      this.form.controller.id = obj.id;
    },
    getSelectBusiness(obj) {
      this.form.business.id = obj.cid;
      this.businessCode = obj.businessCode;
    },
    clear() {
      this.querys = {
        page_number: 1,
        page_size: 10
      };
      this.form.dealer.name = "";
      this.getDealer();
    },
    async getCarDetail() {
      const re = await queryCar({ car: { id: this.$route.params.id } });
      if (re.data.list.length > 0) {
        this.form = re.data.list[0];
        this.form.dealer.name = re.data.list[0].dealer.tname;
        this.form.controller.sim = re.data.list[0].controller.simNo;
      }
    },
    async getDealer(querys) {
      this.columnList = [
        {
          title: this.$t("user.dealerName"),
          prop: "tname",
          width: "260"
        },
        {
          title:this.$t("business.terminal.dealerNo"),
          prop: "dealerCode",
          width: "200"
        },
        {
          title:this.$t("business.terminal.area") ,
          prop: "pname",
          width: "160"
        },
        {
          title:this.$t("business.terminal.BrandManagement") ,
          prop: "manageBrand",
          width: "180"
        }
      ];
      const re = await queryDealer(querys);
      re.data.list.forEach(element => {
        element.value = element.tname;
      });
      this.tableList = re.data.list;
      this.total = re.data.total;
    },
    async getTerminal(querys) {
      if (!this.form.dealer.id) {
        this.$message.warning(this.$t('basicInfo.edit.selectDealer'));
        return;
      }
      this.columnList = [
        {
          title: this.$t('role.number'),
          prop: "index",
          width: "80"
        },
        {
          title: this.$t('dictate.terminalId'),
          prop: "tCode",
          width: "200"
        },
        {
          title:this.$t('basicInfo.edit.sim') ,
          prop: "sim",
          width: "160"
        },
        {
          title: this.$t('message.type'),
          prop: "type_name",
          width: "260"
        }
      ];
      this.tableList = [];
      querys.dealer = { id: this.form.dealer.id };
      querys.terminal = { tstyle: "0" };

      const re = await queryTerminal(querys);
      re.data.list.forEach((element, index) => {
        element.value = element.sim; //value必传
        element.index = index + 1;
      });
      this.tableList = re.data.list;
      this.total = re.data.total;
    },
    async getBusinesses(querys) {
      this.columnList = [
        {
          title: this.$t('role.number'),
          prop: "index",
          width: "80"
        },
        {
          title:this.$t('monitor.car.cName'),
          prop: "businessName",
          width: "260"
        },
        {
          title:this.$t('basicInfo.edit.bProvince'),
          prop: "addressName",
          width: "160"
        },
        {
          title:this.$t('monitor.car.contract'),
          prop: "linkTelpone",
          width: "180"
        }
      ];
      this.tableList = [];
      querys.ctype = -1;

      const re = await queryBusinesses(querys);
      re.data.list.forEach((element, index) => {
        element.value = element.businessName; //value必传
        element.index = index + 1;
      });
      this.tableList = re.data.list;
      this.total = re.data.total;
    },
    async getBasicData() {
      //缓存数据，防止点击tab重复请求
      // if (this.carTypeFlag === "1") {
      //   if (this.cacheDataFront) {
      //     return;
      //   }
      // } else if (this.carTypeFlag === "0") {
      //   if (this.cacheDataBack) {
      //     return;
      //   }
      // }
      const obj = {
        carType: 2,
        engineType: 40,
        serverVersion: 3
        // carTypeFlag: 1
      };
      const re = await queryCarBasicData(obj);
      if (re.data.engineType) {
        this.engineList = re.data.engineType;
      }
      if (re.data.carType) {
        this.carList = re.data.carType;
      }
      // if (this.carTypeFlag === "1") {
      //   this.cacheDataFront = re.data;
      // } else if (this.carTypeFlag === "0") {
      //   this.cacheDataBack = re.data;
      // }
    },
    async getBaseData() {
      const obj = {
        type: 1
      };
      const re = await getBaseData(obj);
      this.colorList = re.data;
    },
    cancel() {
      this.$router.go(-1);
    },
    submit() {
      this.$refs["form"].validate((valid, obj) => {
        if (valid) {
          if (!this.finishUpload) {
            this.$message.error(this.$t('business.telephone.finishUpload'));
            return;
          }
          this.add();
        } else {
          return false;
        }
      });
    },
    async add() {
      this.form = objToStringFy(this.form);
      const re = await updateCar(this.form);
      if (re.code === 200) {
        this.$message.success(this.$t("basicInfo.edit.saveSuc"));
      }
    }
  }
};
</script>

<style scoped lang="scss">
.editCar {
  .center {
    text-align: center;
  }
  .content {
    width: 800px;
    padding: 20px;
  }
  .pd-10 {
    padding: 10px 0;
  }
  .mr-10 {
    margin-right: 10px;
  }
  .search {
    // display: flex;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    .params {
      width: 260px;
    }
  }
}
.car-team-list {
  .el-icon-s-flag {
    padding: 0 5px;
  }
  i {
    color: #999;
  }
  .el-icon-caret-right {
    padding: 0 10px;
  }
}
.row {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #e6ebf5;
  .item {
    span {
      color: #1890ff;
      cursor: pointer;
    }
  }
}
</style>
