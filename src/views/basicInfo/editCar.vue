<template>
  <div class="editCar">
    <el-tabs v-model="carTypeFlag" type="card" @tab-click="getBasicData">
      <el-tab-pane label="前装车辆" name="1"></el-tab-pane>
      <el-tab-pane label="后装车辆" name="0"></el-tab-pane>
    </el-tabs>
    <div class="content">
      <div v-if="carTypeFlag==='1'">
        <div>
          <span>车辆基本资料</span>
          <el-divider></el-divider>
        </div>
        <div class="pd-10">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="130px"
            label-position="right"
          >
            <el-form-item prop="row.car.chassisNum" label="底盘号">
              <el-input clearable v-model="form.row.car.chassisNum" placeholder="请输入底盘号"></el-input>
            </el-form-item>
            <el-form-item label="车辆二维码">
              <el-input clearable v-model="form.row.car.qrCode" placeholder="请输入车辆二维码"></el-input>
            </el-form-item>
            <el-form-item prop="row.car.carModelCode" label="车型码">
              <el-input clearable v-model="form.row.car.carModelCode" placeholder="请输入车型码"></el-input>
            </el-form-item>
            <el-form-item prop="dealer.name" label="所属经销商">
              <el-input
                v-on:click.native="openDialog('所属经销商')"
                v-model="form.dealer.name"
                placeholder="请选择所属经销商"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div v-if="carTypeFlag==='0'">
        <div class="pd-10">
          <el-form
            ref="formBack"
            :model="formBack"
            :rules="rulesBack"
            label-width="130px"
            label-position="right"
          >
            <el-form-item prop="chassisNum" label="底盘号">
              <el-input clearable v-model="formBack.row.car.chassisNum" placeholder="请输入底盘号"></el-input>
            </el-form-item>
            <el-form-item label="车辆二维码">
              <el-input clearable v-model="formBack.row.car.qrCode" placeholder="请输入车辆二维码"></el-input>
            </el-form-item>
            <el-form-item label="车辆二维码">
              <el-input clearable v-model="formBack.row.car.qrCode" placeholder="请输入车辆二维码"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="800px"
    >
      <div class="search">
        <el-input class="params mr-10" clearable v-model="querys.fruzzy" placeholder="请输入关键字"></el-input>
        <el-button class="mr-10" @click="getDealer" type="primary" icon="el-icon-search">查询</el-button>
        <el-button type="primary" @click="clear" icon="el-icon-delete">清空</el-button>
      </div>
      <el-table
        v-if="columnList.length>0"
        @row-click="rowClick"
        :data="dealerList"
        stripe
        style="width: 100%"
      >
        <el-table-column
          v-for="(item,index) in columnList"
          :key="index"
          :label="item.title"
          :width="item.width"
        >
          <template slot-scope="scope">
            <span>{{scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="querys.page_number"
        :limit.sync="querys.page_size"
        @pagination="getDealer"
      />
    </el-dialog>
  </div>
</template>

<script>
import { queryBasicData, queryDealer } from "@/api/basicInfo/index";
import pagination from "@/components/pagination";
export default {
  // 发送到邮箱，弹出框输入邮箱地址，发送邮件。
  name: "editCar",
  components: {
    pagination
  },
  data() {
    return {
      carTypeFlag: "1",
      cacheDataFront: [],
      cacheDataBack: [],
      dialogVisible: false,
      total: 0,
      querys: {
        page_number: 1,
        page_size: 10
      },
      dealerList: [], //table渲染数据
      columnList: [], //table展示的列内容
      title: "",
      form: {
        row: {
          car: { chassisNum: "", carModelCode: "" }
        },
        dealer: { name: "" }
      },
      formBack: {
        row: {
          car: { chassisNum: "" }
        }
      },

      rules: {
        row: {
          car: {
            chassisNum: [
              { required: true, message: "请输入底盘号", trigger: "blur" }
            ],
            carModelCode: [
              { required: true, message: "请输入车型码", trigger: "blur" }
            ]
          }
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
  },
  methods: {
    openDialog(title) {
      this.dialogVisible = true;
      this.title = title;
      this.getDealer();
    },
    rowClick(row) {
      this.form.dealer.name = row.tname;
      this.form.dealer.id = row.id;

      this.dialogVisible = false;
    },
    clear() {
      this.querys = {
        page_number: 1,
        page_size: 10
      };
      this.form.dealer.name = "";
      this.getDealer();
    },
    async getDealer() {
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

      const re = await queryDealer(this.querys);
      this.dealerList = re.data.list;
      this.total = re.data.total;
    },
    async getBasicData() {
      //缓存数据，防止点击tab重复请求
      if (this.carTypeFlag === "1") {
        if (this.cacheDataFront) {
          return;
        }
      } else if (this.carTypeFlag === "0") {
        if (this.cacheDataBack) {
          return;
        }
      }
      const obj = {
        carType: 2,
        engineType: 40,
        serverVersion: 3,
        carTypeFlag: this.carTypeFlag
      };
      const re = await queryBasicData(obj);
      if (this.carTypeFlag === "1") {
        this.cacheDataFront = re.data;
      } else if (this.carTypeFlag === "0") {
        this.cacheDataBack = re.data;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.editCar {
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
