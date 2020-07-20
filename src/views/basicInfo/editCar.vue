<template>
  <div class="editCar">
    <!-- <el-tabs v-model="carTypeFlag" type="card" @tab-click="getBasicData">
      <el-tab-pane label="青岛" name="1"></el-tab-pane>
      <el-tab-pane label="长春" name="0"></el-tab-pane>
    </el-tabs>-->
    <div class="content">
      <div>
        <span>车辆基本资料</span>
        <el-divider></el-divider>
      </div>
      <div class="pd-10">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px" label-position="right">
          <el-form-item prop="row.car.chassisNum" label="底盘号">
            <el-input clearable v-model="form.row.car.chassisNum" placeholder="请输入底盘号"></el-input>
          </el-form-item>
          <el-form-item label="车辆二维码">
            <el-input clearable v-model="form.row.car.qrCode" placeholder="请输入车辆二维码"></el-input>
          </el-form-item>
          <el-form-item prop="row.car.carModelCode" label="车型码">
            <el-input clearable v-model="form.row.car.carModelCode" placeholder="请输入车型码"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="dealer.name" label="所属经销商">
            <el-input
              v-on:click.native="openDialog('所属经销商')"
              v-model="form.dealer.name"
              placeholder="请选择所属经销商"
            ></el-input>
          </el-form-item>-->

          <select-table
            label="所属经销商"
            placeholder="请选择所属经销商"
            tableTitle="所属经销商"
            prop="dealer.name"
            searchName="fruzzy"
            :dialogVisible="dialogVisible"
            :columnList="columnList"
            :tableList="dealerList"
            @search="getDealer"
            :total="total"
            v-model="form.dealer.name"
          ></select-table>

          <el-form-item prop="dealer.name" label="sim卡号">
            <el-input
              v-on:click.native="openDialog('关联终端')"
              v-model="form.dealer.name"
              placeholder="请选择关联sim卡号"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { queryCarBasicData, queryDealer } from "@/api/basicInfo/index";
import pagination from "@/components/pagination";
import selectTable from "@/components/selectTable";
export default {
  // 发送到邮箱，弹出框输入邮箱地址，发送邮件。
  name: "editCar",
  components: {
    pagination,
    selectTable
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
      const re = await queryCarBasicData(obj);
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
