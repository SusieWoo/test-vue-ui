<template>
  <div class="editCar">
    <!-- <el-tabs v-model="carTypeFlag" type="card" @tab-click="getBasicData">
      <el-tab-pane label="青岛" name="1"></el-tab-pane>
      <el-tab-pane label="长春" name="0"></el-tab-pane>
    </el-tabs>-->
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
          <span>车辆基本资料</span>
          <el-divider></el-divider>
        </div>
        <div class="pd-10">
          <el-form-item prop="detail.fuel" label="动力类型">
            <el-radio-group v-model="form.detail.fuel">
              <el-radio label="1">柴油车</el-radio>
              <el-radio label="0">天然气车</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="car.chassisNum" label="底盘号">
            <el-input clearable v-model="form.car.chassisNum" placeholder="请输入底盘号"></el-input>
          </el-form-item>
          <el-form-item label="车辆二维码">
            <el-input clearable v-model="form.car.qrCode" placeholder="请输入车辆二维码"></el-input>
          </el-form-item>
          <el-form-item prop="car.carModelCode" label="车型码">
            <el-input clearable v-model="form.car.carModelCode" placeholder="请输入车型码"></el-input>
          </el-form-item>
          <el-form-item prop="car.carType" label="车辆类型">
            <el-select v-model="form.car.carType" placeholder="请选择车辆类型">
              <el-option
                v-for="item in carList"
                :key="item.id"
                :label="item.dataValue"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <select-table
            label="所属经销商"
            :key="1"
            placeholder="请选择所属经销商"
            tableTitle="所属经销商"
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
            label="FK控制器"
            placeholder="请选择FK控制器"
            tableTitle="FK控制器"
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
          <span>车辆信息</span>
          <el-divider></el-divider>
        </div>

        <div class="pd-10">
          <el-form-item prop="car.chassisNum" label="车架号">
            <el-input clearable v-model="form.car.vechicleVin" placeholder="请输入车架号"></el-input>
          </el-form-item>
          <el-form-item prop="detail.engineType" label="发动机类型">
            <el-select v-model="form.detail.engineType" placeholder="请选择发动机类型">
              <el-option
                v-for="item in engineList"
                :key="item.id"
                :label="item.dataValue"
                :value="item.dataCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发动机型号">
            <el-input clearable v-model="form.car.carModelCode" placeholder="请输入发动机型号"></el-input>
          </el-form-item>
          <el-form-item label="发动机号">
            <el-input clearable v-model="form.car.carModelCode" placeholder="请输入发动机号"></el-input>
          </el-form-item>
          <el-form-item label="油箱/天然气容量(L)">
            <el-input clearable v-model="form.car.carModelCode" placeholder="请输入油箱/天然气容量(L)"></el-input>
          </el-form-item>
          <el-form-item prop="car.vfactory" label="工厂代码">
            <el-select v-model="form.car.vfactory" placeholder="请选择工厂代码">
              <el-option
                v-for="item in vfactoryList"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item prop="car.vfactory" label="工厂代码">
            <el-radio-group v-model="form.car.vfactory">
              <el-radio label="QK00001轻卡" value="QK00001"></el-radio>
              <el-radio label="QK00002轻卡" value="QK00002"></el-radio>
              <el-radio label="QD00001重卡" value="QD00001"></el-radio>
              <el-radio label="QA00022重卡" value="QA00022"></el-radio>
              <br />
              <el-radio label="LZ00001重卡" value="LZ00001"></el-radio>
              <el-radio label="LZ00002轻卡" value="LZ00002"></el-radio>
              <el-radio label="QA00016重卡" value="QA00016"></el-radio>
              <el-radio label="T重卡" value="T"></el-radio>
              <el-radio label="QL001重卡" value="QL001"></el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item label="前桥1厂家">
            <el-input clearable v-model="form.detail.frontAxleFactoryOne" placeholder="请输入前桥1厂家"></el-input>
          </el-form-item>
          <el-form-item label="前桥1型号">
            <el-input clearable v-model="form.detail.frontAxleTypeOne" placeholder="请输入前桥1型号"></el-input>
          </el-form-item>
          <el-form-item label="前桥2厂家">
            <el-input clearable v-model="form.detail.frontAxleFactoryTwo" placeholder="请输入前桥2厂家"></el-input>
          </el-form-item>
          <el-form-item label="前桥2型号">
            <el-input clearable v-model="form.detail.frontAxleTypeTwo" placeholder="请输入前桥2型号"></el-input>
          </el-form-item>
          <el-form-item label="后桥1厂家">
            <el-input clearable v-model="form.detail.rearAxleFactoryOne" placeholder="请输入后桥1厂家"></el-input>
          </el-form-item>
          <el-form-item label="后桥1型号">
            <el-input clearable v-model="form.detail.rearAxleTypeOne" placeholder="请输入后桥1型号"></el-input>
          </el-form-item>
          <el-form-item label="后桥2厂家">
            <el-input clearable v-model="form.detail.rearAxleFactoryTwo" placeholder="请输入后桥2厂家"></el-input>
          </el-form-item>
          <el-form-item label="后桥2型号">
            <el-input clearable v-model="form.detail.rearAxleTypeTwo" placeholder="请输入后桥2型号"></el-input>
          </el-form-item>
        </div>

        <div>
          <span>售前转运信息</span>
          <el-divider></el-divider>
        </div>
        <div class="pd-10">
          <el-form-item prop="car.online" label="下线日期">
            <el-date-picker
              v-model="form.car.online"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择下线日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="car.removeTime" label="出库日期">
            <el-date-picker
              v-model="form.car.removeTime"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择出库日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="STD销售状态">
            <el-select v-model="form.sale.saleStatus" :placeholder="$t('common.select')">
              <el-option value="0" label="已售"></el-option>
              <el-option value="1" label="未售"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.sale.saleStatus==='0'" prop="sale.saleDate" label="STD销售日期">
            <el-date-picker
              v-model="form.sale.saleDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择STD销售日期"
            ></el-date-picker>
          </el-form-item>
        </div>

        <div v-if="form.sale.saleStatus==='0'">
          <span>分渠销售信息</span>
          <el-divider></el-divider>
        </div>
        <div class="pd-10" v-if="form.sale.saleStatus==='0'">
          <el-form-item label="AAK销售状态">
            <el-select v-model="form.sale.mbSalesStatus" placeholder="请选择AAK销售状态">
              <el-option value="0" label="已售"></el-option>
              <el-option value="1" label="未售"></el-option>
            </el-select>
          </el-form-item>
          <span v-if="form.sale.mbSalesStatus =='0'">
            <el-form-item prop="sale.mbSalesDate" label="AAK销售日期">
              <el-date-picker
                v-model="form.car.mbSalesDate"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="请选择AAK销售日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="车牌号">
              <el-input clearable v-model="form.car.carCph" placeholder="请输入底盘号"></el-input>
            </el-form-item>

            <el-form-item label="车牌颜色">
              <el-select v-model="form.car.color" placeholder="请选择车牌颜色">
                <el-option
                  v-for="item in colorList"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <select-table
              label="所属客户"
              placeholder="请选择所属客户"
              tableTitle="所属客户"
              searchName="fruzzy"
              :columnList="columnList"
              :tableList="tableList"
              @search="getBusinesses"
              :total="total"
              v-model="form.business.businessName"
              @obj="getSelectBusiness"
            ></select-table>
            <el-form-item label="证件号">
              <!-- <span> {{businessCode}}</span> -->
              <el-input clearable disabled v-model="businessCode"></el-input>
            </el-form-item>
            <el-form-item prop="sale.invoiceNumber" label="发票号">
              <el-input clearable v-model="form.sale.invoiceNumber"></el-input>
            </el-form-item>
            <el-form-item label="购车总金额（万）">
              <el-input clearable v-model="form.sale.carAmount"></el-input>
            </el-form-item>
            <el-form-item label="贷款总金额（万）">
              <el-input clearable v-model="form.sale.loanAmount"></el-input>
            </el-form-item>
            <el-form-item label="未还总金额（万）">
              <el-input clearable v-model="form.sale.surplus"></el-input>
            </el-form-item>
          </span>
        </div>

        <div>
          <span>车辆图片</span>
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
        <el-button type="primary" @click="submit" :loading="loading">确定</el-button>
        <el-button type="primary">取消</el-button>
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
  queryCar
} from "@/api/basicInfo/index";
import pagination from "@/components/pagination";
import selectTable from "@/components/selectTable";
import UploadImg from "@/components/UploadImg";
import { objToStringFy } from "@/utils/rules";
export default {
  // 发送到邮箱，弹出框输入邮箱地址，发送邮件。
  name: "editCar",
  components: {
    pagination,
    selectTable,
    UploadImg
  },
  data() {
    return {
      // carTypeFlag: "1",
      // cacheDataFront: [],
      // cacheDataBack: [],
      loading: false,
      businessCode: "",
      total: 0,
      engineList: [],
      carList: [],
      colorList: [],
      tableList: [], //table渲染数据
      columnList: [], //table展示的列内容
      vfactoryList: [
        { label: "QK00001", value: "QK00001轻卡" },
        { label: "QK00002", value: "QK00002轻卡" },
        { label: "QD00001", value: "QD00001重卡" },
        { label: "QA00022", value: "QA00022重卡" },
        { label: "LZ00001", value: "LZ00001重卡" },
        { label: "LZ00002", value: "LZ00002轻卡" },
        { label: "QA00016", value: "QA00016重卡" },
        { label: "T重卡", value: "T" }
      ],
      title: "",
      finishUpload: true,
      uploadConfig: {
        label: "图片上传",
        sizeLimit: 2,
        numLimt: 1,
        ruleName: "rulename"
      },
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

      rules: {
        car: {
          chassisNum: [
            { required: true, message: "请输入底盘号", trigger: "blur" }
          ],
          carType: [
            { required: true, message: "请选择车辆类型", trigger: "change" }
          ],
          carModelCode: [
            { required: true, message: "请输入车型码", trigger: "blur" }
          ]
        },
        controller: {
          sim: [
            { required: true, message: "请选择所属经销商", trigger: "click" }
          ]
        },
        detail: {
          fuel: [
            { required: true, message: "请选择动力类型", trigger: "change" }
          ],
          engineType: [
            { required: true, message: "请选择动力类型", trigger: "change" }
          ]
        },
        dealer: {
          name: [
            { required: true, message: "请选择所属经销商", trigger: "click" }
          ]
        }
      },
      rulesBack: {
        chassisNum: [
          { required: true, message: "请输入底盘号", trigger: "blur" }
        ]
      }
    };
  },

  mounted() {
    this.getBasicData();
    this.getBaseData();
    if (this.$route.params.id) {
      this.getCarDetail();
    }
  },
  methods: {
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
        console.log(this.form.dealer.id)
      }
    },
    async getDealer(querys) {
      this.columnList = [
        {
          title: "经销商名称",
          prop: "tname",
          width: "260"
        },
        {
          title: "经销商编码(重卡/轻卡)",
          prop: "dealerCode",
          width: "200"
        },
        {
          title: "所属区域",
          prop: "pname",
          width: "160"
        },
        {
          title: "经营品牌",
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
        this.$message.warning("请先选择经销商");
        return;
      }
      this.columnList = [
        {
          title: "序号",
          prop: "index",
          width: "80"
        },
        {
          title: "终端ID",
          prop: "tCode",
          width: "200"
        },
        {
          title: "SIM卡",
          prop: "sim",
          width: "160"
        },
        {
          title: "类型",
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
          title: "序号",
          prop: "index",
          width: "80"
        },
        {
          title: "客户名称",
          prop: "businessName",
          width: "260"
        },
        {
          title: "所属省市",
          prop: "addressName",
          width: "160"
        },
        {
          title: "联系方式",
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
    submit() {
      this.$refs["form"].validate((valid, obj) => {
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
    async add() {
      this.form = objToStringFy(this.form);
      const re = await updateCar(this.form);
      if (re.code === 200) {
        this.$message.success("车辆保存成功");
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
</style>
