<template>
  <div class="form-page">
    <h4>{{$t('business.dealer.basicInfo')}}</h4>
    <el-form ref="form" :model="form" :rules="rules" label-width="150px">
      <el-form-item :label="$t('user.dealerName')" prop="tname">
        <el-input v-model="form.tname" />
      </el-form-item>
      <el-form-item :label="$t('common.type')" prop="types">
        <el-checkbox-group v-model="form.types">
          <el-checkbox label="heavy" name="type">{{$t('business.dealer.zhongzhongCar')}}</el-checkbox>
          <el-checkbox label="light" name="type">{{$t('business.dealer.lightCar')}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        v-if="getType('heavy')"
        :label="$t('business.dealer.zhongzhongCarNo')"
        prop="dealerCode"
      >
        <el-input v-model="form.dealerCode" />
      </el-form-item>
      <el-form-item
        v-if="getType('light')"
        :label="$t('business.dealer.lightCarNo')"
        prop="dealerQkCode"
      >
        <el-input v-model="form.dealerQkCode" />
      </el-form-item>
      <SelectTable
        :key="1"
        v-model="form.pname"
        value-width="400px"
        :label="$t('business.dealer.area')"
        :placeholder="$t('business.dealer.selectArea')"
        :table-title="$t('business.dealer.area')"
        prop="pname"
        search-name="districtName"
        :column-list="columnList"
        :table-list="tableList"
        :total="total"
        @search="getDealer"
        @obj="getSelectDealer"
      />
      <h4>{{$t('business.dealer.outletsAddress')}}</h4>
      <MapModal
        v-model="form.companyAddress"
        :center-info="centerInfo"
        prop="companyAddress"
        value-width="400px"
        :title="$t('business.dealer.selectAddress')"
        :label="$t('business.dealer.dealerAddress')"
        :placeholder="$t('common.select')"
        @confirm="handleTeamPositionConfirm"
      />
      <el-form-item :label="$t('business.dealer.secondaryOutlets')">
        <div class="sub-form-container">
          <div v-for="(item, index) in inlineRowForms" :key="index" class="inline-row-forms">
            <div>
              <el-input
                v-model="item.name"
                style="width: auto"
                :placeholder="$t('business.dealer.outletsName')"
              />
            </div>
            <div>
              <el-input
                v-model="item.code"
                style="width: auto"
                :placeholder="$t('business.dealer.outletsNo')"
              />
            </div>
            <div>
              <!--            <el-input v-model="item.address" style="width: auto" placeholder="*网点地址" />-->
              <MapModal
                v-model="item.address"
                :center-info="{
                lat: item.latitude,
                lng: item.longitude
              }"
                :title="$t('business.dealer.selectAddress')"
                :placeholder="$t('common.select')"
                @confirm="handleItemAddressConfirm($event, item)"
              />
            </div>
            <div>
              <SelectInput
                v-model="item.riskArea"
                :placeholder="'*'+ $t('business.dealer.riskControlAreaRadius')"
              />
            </div>
            <div>
              <el-input
                v-model="item.coverRadius"
                style="width: auto"
                :placeholder="$t('business.dealer.coverageRadius')+'(KM)'"
              />
            </div>
            <div>
              <el-select
                v-model="item.pattern"
                :placeholder="$t('business.dealer.secondNetworkMode')"
              >
                <el-option :label="$t('business.dealer.selfEmployed')" :value="1" />
                <el-option :label="$t('business.dealer.cooperation')" :value="2" />
              </el-select>
            </div>
            <div>
              <el-select
                v-model="item.rank"
                :placeholder="$t('business.dealer.secondNetworkLevel')"
              >
                <el-option :label="$t('business.dealer.core')" :value="1" />
                <el-option :label="$t('business.dealer.important')" :value="2" />
                <el-option :label="$t('business.dealer.normal')" :value="3" />
              </el-select>
            </div>
            <div v-if="getType('heavy')">
              <el-checkbox-group v-model="item.checkList" style="text-align: center">
                <el-checkbox :label="1">{{$t('business.dealer.heavyTruckCollection')}}</el-checkbox>
                <el-checkbox :label="2">{{$t('business.dealer.heavyChuckLibrary')}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div v-if="getType('light')">
              <el-checkbox-group v-model="item.checkList2">
                <el-checkbox :label="1">{{$t('business.dealer.lightTruckCollection')}}</el-checkbox>
                <el-checkbox :label="2">{{$t('business.dealer.lightChuckLibrary')}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div>
              <SelectInput
                v-model="item.workRadius"
                :options="shoucheRadiusList"
                :placeholder="$t('business.dealer.closedCarRadius')"
              />
            </div>
            <div>
              <SelectInput
                v-model="item.workRadius2"
                :options="shoucheRadiusList"
                :placeholder="$t('business.dealer.diskLibraryRadius')"
              />
            </div>
            <div class="fixed">
              <div>
                <el-checkbox
                  v-model="item.isVirtual"
                  :label="$t('business.dealer.lightTruckMainNetwork')"
                  :true-label="1"
                  false-label
                  @change="handleVirtualChange(index)"
                />
                <div class="operating-box">
                  <i
                    v-if="index === inlineRowForms.length -1"
                    class="el-icon-circle-plus"
                    @click="addOrDelRow(1, index, item)"
                  ></i>
                  <i class="el-icon-remove" @click="addOrDelRow(2, index)"></i>
                  <el-switch v-model="item.isAble" :active-value="1" :inactive-value="0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <h4>{{$t('business.dealer.parametersOfTheLockCar')}}</h4>
      <el-form-item :label="$t('business.dealer.activeRadius')" prop="enableRadius">
        <el-select v-model="form.enableRadius" :placeholder="$t('common.select')">
          <el-option
            v-for="(item, index) in radiusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('business.dealer.lockRadius')" prop="lockRadius">
        <el-select v-model="form.lockRadius" :placeholder="$t('common.select')">
          <el-option
            v-for="(item, index) in lockRadiusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <h4>{{$t('monitor.car.contract')}}</h4>
      <el-form-item :label="$t('business.dealer.contactor')">
        <el-input v-model="form.companyLinkman" />
      </el-form-item>
      <el-form-item :label="$t('business.dealer.contactPhone')">
        <el-input v-model="form.companyLinktel" />
      </el-form-item>
      <el-form-item :label="$t('business.dealer.fax')">
        <el-input v-model="form.companyFax" />
      </el-form-item>
      <el-form-item :label="$t('business.dealer.postCode')">
        <el-input v-model="form.companyCode" />
      </el-form-item>
      <h4>{{$t('business.dealer.dealerImage')}}</h4>
      <aj-upload
        ref="ajUpload"
        :img-url="form.teamPicture"
        style="margin-bottom: 40px"
        :label="$t('business.dealer.uploadImage')"
        width="300px"
        :size="0.3"
        accept=".jpg, .png, .jpeg"
        :show-upload-button="false"
      />
      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="handleSubmit">{{$t('common.submit')}}</el-button>
        <el-button @click="$router.back()">{{$t('common.back')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  queryDistrictTip,
  addOrEditDealer,
  getSDealerDetail
} from "@/api/business/businessService";
import SelectTable from "@/components/selectTable";
import MapModal from "@/components/aj-mapModal";
import SelectInput from "@/components/aj-selectInput";
import ajUpload from "@/components/aj-upload";
import { objToStringFy } from "@/utils/rules";

const formInlineKeys = {
  name: "", // 网点名称
  code: "", // 网点编码
  longitude: "", // 网点地址经度
  latitude: "", // 网点地址纬度
  address: "", // 网点地址
  riskArea: "", // 风控半径区域
  coverRadius: "", // 覆盖半径
  pattern: "", // 二网模式
  rank: "", // 二网等级
  workRadius: "", // 收车半径
  workRadius2: "", // 收车半径
  checkList: [], // 重卡收车/盘库
  checkList2: [], // 轻卡收车/盘库

  isVirtual: "", // 轻卡主网点
  isAble: 0
  // isOpen: true // 解析成isAble 1 0
};
const latLngBei = 100000;
const numberBei = 1000;
export default {
  name: "AddAndEdit",
  components: {
    SelectTable,
    SelectInput,
    MapModal,
    ajUpload
  },
  data() {
    return {
      types: [],
      isLoading: false,
      form: {
        types: [],
        isZL: 0,
        tname: "",
        parentId: "",
        pname: "",
        dealerCode: "",
        dealerQkCode: "",
        companyAddress: "",
        companyLinkman: "",
        companyLinktel: "",
        companyFax: "",
        companyCode: "",
        teamLat: "",
        teamLon: "",
        enableRadius: "",
        lockRadius: "",
        teamPicture: "" // 上传的图片
      },
      rules: {
        tname: [
          { required: true, message: "请输入经销商名称", trigger: "blur" }
        ],
        types: [{ required: true, message: "请选择类型", trigger: "change" }],
        dealerCode: [
          { required: true, message: "请输入中重卡编码", trigger: "blur" }
        ],
        dealerQkCode: [
          { required: true, message: "请输入轻卡编码", trigger: "blur" }
        ],
        pname: [
          { required: true, message: "请选择所属经销商", trigger: "change" }
        ],
        companyAddress: [
          { required: true, message: "请选择经销商地址", trigger: "change" }
        ],

        enableRadius: [
          { required: true, message: "请选择激活半径", trigger: "change" }
        ],
        lockRadius: [
          { required: true, message: "请选择锁车半径", trigger: "change" }
        ]
      },
      tableList: [], //table渲染数据
      columnList: [], //table展示的列内容
      total: 0,
      /*checkList: [],
      checkList2: [],*/
      inlineRowForms: [],
      radiusList: [
        {
          label: "5KM",
          value: 5000
        },
        {
          label: "10KM",
          value: 10000
        },
        {
          label: "15KM",
          value: 15000
        },
        {
          label: "20KM",
          value: 20000
        },
        {
          label: "30KM",
          value: 30000
        },
        {
          label: "50KM",
          value: 50000
        }
      ],
      lockRadiusList: [
        {
          label: "2KM",
          value: 2000
        },
        {
          label: "5KM",
          value: 5000
        },
        {
          label: "10KM",
          value: 10000
        },
        {
          label: "15KM",
          value: 15000
        },
        {
          label: "20KM",
          value: 20000
        },
        {
          label: "30KM",
          value: 30000
        }
      ],
      shoucheRadiusList: [
        {
          label: "5KM",
          value: 5
        },
        {
          label: "10KM",
          value: 10
        },
        {
          label: "50KM",
          value: 50
        },
        {
          label: "100KM",
          value: 100
        },
        {
          label: "200KM",
          value: 200
        },
        {
          label: "300KM",
          value: 300
        },
        {
          label: "400KM",
          value: 400
        },
        {
          label: "500KM",
          value: 500
        },
        {
          label: "1000KM",
          value: 1000
        }
      ],
      centerInfo: {}
    };
  },
  computed: {
    getType() {
      return type => this.form.types.indexOf(type) > -1;
    },
    id() {
      return this.$route.params.id;
    }
  },
  mounted() {
    console.log(this.$route.params.id);
    if (this.$route.params.id) {
      this.getDetails();
    } else {
      this.inlineRowForms.push({ ...formInlineKeys });
    }
  },
  methods: {
    getDetails() {
      getSDealerDetail({ tid: this.id }).then(res => {
        // console.log(res)
        // this.form = res.data

        for (let key in this.form) {
          if (Object.prototype.hasOwnProperty.call(res.data, key)) {
            this.form[key] = res.data[key];
          }
        }
        this.form.teamLat = this.form.teamLat / latLngBei;
        this.form.teamLon = this.form.teamLon / latLngBei;
        this.form.types = this.types;
        /*this.centerInfo = {
          lng: res.data.teamLon,
          lat: res.data.teamLat
        }*/

        let result = [];
        res.data.secdTeam.forEach(item => {
          if (item.workType === 2) item.workRadius2 = item.workRadius;
          if (item.loadType === 1) {
            if (this.form.types.indexOf("heavy") < 0)
              this.form.types.push("heavy");
            if (item.checkList) {
              item.checkList.push(item.workType);
            } else {
              item.checkList = [item.workType];
            }
          }
          if (item.loadType === 2) {
            if (this.form.types.indexOf("light") < 0)
              this.form.types.push("light");
            if (item.checkList2) {
              item.checkList2.push(item.workType);
            } else {
              item.checkList2 = [item.workType];
            }
          }
          const findIndex = result.findIndex(rItem => rItem.name === item.name);
          if (findIndex < 0) {
            result.push(item); // 没找到重复的push
          } else {
            result[findIndex] = { ...result[findIndex], ...item };
          }
        });
        console.log("结果", result);
        this.inlineRowForms = result.map(item => {
          // item.isOpen = item.isAble === 1
          const obj = {};
          for (let key in formInlineKeys) {
            if (Object.prototype.hasOwnProperty.call(item, key)) {
              obj[key] = item[key];
            }
          }
          // return obj
          console.log(obj);
          obj.latitude = obj.latitude / latLngBei;
          obj.longitude = obj.longitude / latLngBei;
          obj.riskArea = obj.riskArea / numberBei;
          obj.workRadius = obj.workRadius / numberBei;
          obj.workRadius2 = obj.workRadius2 / numberBei;
          obj.coverRadius = obj.coverRadius / numberBei;
          return obj;
        });
      });
    },
    getSelectDealer(obj) {
      this.form.parentId = obj.id;
    },
    async getDealer(querys) {
      this.columnList = [
        {
          title: "序号",
          type: "index"
        },
        {
          title: "所属区域",
          prop: "districtName"
        },
        {
          title: "上级销售区域",
          prop: "pdistrictName"
        },
        {
          title: "联系人",
          prop: "linkMan"
        }
      ];
      // console.log(querys)
      const re = await queryDistrictTip({ ...querys, type: 0 });
      re.data.list.forEach(element => {
        element.value = element.districtName;
      });
      this.tableList = re.data.list;
      this.total = re.data.total;
    },
    addOrDelRow(type, index, rowItem) {
      console.log(rowItem);
      for (let key in rowItem) {
        if (rowItem[key] === "" && key !== "isVirtual") {
          this.$message.error("请填写二级网点信息");
          return;
        }
      }
      if (type === 1) {
        this.inlineRowForms.push({ ...formInlineKeys });
      } else {
        if (this.inlineRowForms.length > 1) {
          this.inlineRowForms.splice(index, 1);
        }
      }
    },
    handleTeamPositionConfirm(position) {
      console.log(position);
      this.form.teamLat = position.lat;
      this.form.teamLon = position.lng;
    },
    handleItemAddressConfirm(position, item) {
      console.log(position, item);
      item.address = position.title;
    },
    handleVirtualChange(curIndex) {
      this.inlineRowForms.forEach((item, index) => {
        if (curIndex !== index) {
          item.isVirtual = "";
        }
      });
    },
    delObjInfo(obj) {
      obj.riskArea = obj.riskArea * numberBei;
      obj.workRadius = obj.workRadius * numberBei;
      obj.coverRadius = obj.coverRadius * numberBei;
      obj.latitude = parseInt(obj.latitude * latLngBei);
      obj.longitude = parseInt(obj.longitude * latLngBei);
      // delete obj.isOpen;
      delete obj.checkList;
      delete obj.checkList2;
      delete obj.workRadius2;
      return obj;
    },
    handleSubmit() {
      console.log("提交");
      this.$refs["form"].validate(valid => {
        if (valid) {
          const abcArr = [];
          const copyInlieRowForms = [...this.inlineRowForms];
          copyInlieRowForms.forEach((item, index) => {
            // item.isAble = item.isOpen ? 1 : 0;
            if (item.checkList && item.checkList.length > 0) {
              item.checkList.forEach(it => {
                const obj = this.delObjInfo({
                  ...item,
                  workType: it,
                  loadType: 1,
                  workRadius: it === 1 ? item.workRadius : item.workRadius2
                }); // loadType 1中重卡 2轻卡
                abcArr.push(objToStringFy(obj));
              });
            }
            if (item.checkList2 && item.checkList2.length > 0) {
              item.checkList2.forEach(it => {
                const obj = this.delObjInfo({
                  ...item,
                  workType: it,
                  loadType: 2,
                  workRadius: it === 1 ? item.workRadius : item.workRadius2
                });
                abcArr.push(objToStringFy(obj));
              });
            }
          });
          console.log(abcArr, abcArr.length);
          const obj = {
            ...this.form,
            hySecdTeamList: JSON.stringify(abcArr),
            govCodePrvc: 110000,
            govCodeCity: 110100
          };
          delete obj.types;
          if (this.id) {
            obj.id = this.id;
          }
          const a = this.form.types.indexOf("heavy") > -1;
          const b = this.form.types.indexOf("light") > -1;
          obj.lightHeavyFlg = a && b ? 3 : a && !b ? 2 : 1;
          obj.teamLat = parseInt(obj.teamLat * latLngBei);
          obj.teamLon = parseInt(obj.teamLon * latLngBei);
          console.log(obj);
          this.$refs.ajUpload.upload().then(res => {
            obj.teamPicture = res.fullPath;
            this.isLoading = true;
            addOrEditDealer(
              objToStringFy({ dealermanager: obj }),
              this.$route.params.id ? 2 : 1
            )
              .then(() => {
                this.$message.success(this.id ? "修改成功" : "新增成功");
                this.$router.back();
              })
              .finally(() => {
                this.isLoading = false;
              });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.form-page {
  width: auto;
  //border: 1px solid red;
  .el-input {
    width: 400px;
  }

  .el-select {
    width: 400px;
  }
}

.sub-form-container {
  overflow: auto;
}

.inline-row-forms {
  display: flex;
  align-items: center;
  //overflow: auto;
  //white-space: nowrap;
  padding: 20px 0;
  //border-bottom: 1px solid red;
  position: relative;

  /deep/ .el-select {
    width: auto;
  }

  &:not(:first-child) {
    padding-top: 10px;
  }

  > div {
    display: flex;
    //display: inline-block;
    align-items: center;
    border-bottom: 1px solid #dcdfe6;
    text-align: center;

    /deep/ .el-checkbox {
      margin-right: 0;
    }

    height: 100px;
    min-width: 140px;
    padding-right: 10px;

    &.fixed {
      display: block;
      overflow: hidden;

      > div {
        padding-top: 15px;
        width: 100%;
        height: 100%;
        box-shadow: -5px 0 10px -5px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.fixed {
  position: sticky;
  z-index: 998;
  right: 0;
  background: #fff;
  padding-left: 10px;
}

.operating-box {
  display: flex;
  align-items: center;

  i {
    font-size: 20px;
    cursor: pointer;
    color: #fb713f;
  }

  > * {
    margin: 0 10px;
  }
}
</style>
