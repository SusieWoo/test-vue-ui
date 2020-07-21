<template>
  <el-container class="view-form h">
    <el-row type="flex" justify="center" :gutter="30">
      <el-col class="wh700">
        <el-card shadow="always" class="h">
          <el-row type="flex" justify="center" :gutter="10" class="mt10">
            <el-col :span="24">
              <el-col :span="8">
                <el-select v-model="queryParams.searchType">
                  <el-option label="底盘号" value="1">底盘号</el-option>
                  <el-option
                    v-for="item in typeArr"
                    :key="item.id"
                    :label="item.value"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col :span="10">
                <el-input v-model="queryParams.searchText"></el-input>
              </el-col>
              <el-col :span="6">
                <el-button
                  type="primary"
                  @click="queryTree"
                  icon="el-icon-search"
                  style="padding: 11px"
                ></el-button>
              </el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18" class="mt16">
              <span>实时数据：</span>
              <el-switch
                v-model="realtime"
                active-color="#009cef"
                inactive-color="#bdbdbd"
                @change="changeCarTree"
              ></el-switch>
              <i
                title="刷新固化树"
                class="el-icon-refresh refreshTree"
                v-if="!realtime"
                @click="changeCarTree('refresh')"
              ></i>
            </el-col>
          </el-row>
          <el-tree
            v-loading.body="listLoading"
            :props="defaultProps"
            :data="treeData"
            node-key="id"
            :default-expanded-keys="expandedKeys"
            lazy
            :load="loadNode"
            @node-click="treeNodeClick"
            class="car-tree-height mt16"
            style="overflow-y: auto"
          >
            <span class="custom-tree-node" slot-scope="{ node }">
              <img v-if="!node.data.lastNode" src="@/assets/images/icon-fold.png" class="wh16" />
              <img
                v-if="node.data.carStauts === 0"
                src="@/assets/images/VehicleStatusOfflineInvalid1.png"
                class="wh16"
              />
              <img
                v-if="node.data.carStauts === 1"
                src="@/assets/images/VehicleStatusOnlineInvalid1.png"
                class="wh16"
              />
              <img
                v-if="node.data.carStauts === 2"
                src="@/assets/images/VehicleStatusOfflineStop1.png"
                class="wh16"
              />
              <img
                v-if="node.data.carStauts === 3"
                src="@/assets/images/VehicleStatusOnlineStop1.png"
                class="wh16"
              />
              <img
                v-if="node.data.carStauts === 6"
                src="@/assets/images/VehicleStatusOffline1.png"
                class="wh16"
              />
              <img
                v-if="node.data.carStauts === 7"
                src="@/assets/images/VehicleStatusOnline1.png"
                class="wh16"
              />
              <span>{{ node.label }}</span>
              <span v-if="node.data.lastNode">
                <resolveAddress :lat="node.data.lat" :lng="node.data.lng"></resolveAddress>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
      <el-col>
        <el-card
          shadow="always"
          class="h"
          :class="{'el-loading-mask': isFullscreen, mapFullscreenNo: !isFullscreen}"
        >
          <div class="fr">
            <el-button type="primary" @click="screenfull" class="fullscreen">
              <img src="@/assets/images/fullScreenBtn.png" />
              {{fullScreenBtn}}
            </el-button>
          </div>
          <div id="map" class="wh h"></div>
          <!--点击地图车辆标注点，显示弹框的组件-->
          <carInfo
            :dialogVisible="dialogVisible"
            :car="carInfoData"
            :tranLeft="tranLeft"
            :tranTop="tranTop"
            @carDialogClose="showRoleDialog"
          ></carInfo>
        </el-card>
      </el-col>
    </el-row>
  </el-container>
</template>
<script>
import _ from "lodash";
import "@/mock";
import BMap from "BMap";
import CarApi from "@/api/monitor/car";
import MapApi from "@/api/map";
import CarInfo from "@/components/CarInfo";
import ResolveAddress from "@/components/ResolveAddress";
//import screenfull from 'screenfull'

export default {
  components: {
    ResolveAddress,
    CarInfo
  },
  data() {
    return {
      // 加载等待
      listLoading: true,
      // 是否全屏
      isFullscreen: false,
      fullScreenBtn: "全屏查看",
      // 查询树条件类型
      typeArr: [
        {
          value: "车牌号",
          code: 2
        },
        {
          value: "SIM卡号",
          code: 3
        },
        {
          value: "经销商",
          code: 4
        }
      ],
      // 车辆树数据
      treeData: [],
      // 树默认展开节点
      expandedKeys: [],
      // 树的默认设置
      defaultProps: {
        label: "label",
        children: "children",
        // 是否是叶子节点
        isLeaf: "lastNode"
      },
      queryParams: {
        searchType: "1"
      },
      // 地图
      map: null,
      // 地图弹框显隐
      dialogVisible: false,
      // 地图弹框字段
      carInfoData: {},
      // 弹框位置
      tranLeft: 0,
      tranTop: 0,
      // 是否是实时数据
      realtime: false,
      // 是否是查询树
      isSearch: false
    };
  },
  mounted() {
    this.queryTree();
    // 初始化地图
    this.map = new BMap.Map("map");
    // 设置地图中心点
    this.map.centerAndZoom("北京", 10);
    // 支持缩放
    this.map.enableScrollWheelZoom(true);
  },
  methods: {
    // 查询
    queryTree() {
      this.isSearch = false;
      // 如果没有查询条件，调用异步树；返之，调用查询树
      if (!this.queryParams.searchText) {
        this.setSolidifyTree();
      } else {
        this.simpleQueryTree(this.queryParams);
      }
    },
    // 展开树节点执行函数
    loadNode(node, resolve) {
      if (node.level === 1) {
        this.listLoading = false;
        return resolve(this.treeData[0]["children"]);
      } else if (node.level > 1) {
        if (!this.isSearch) {
          if (!node.data.lastNode) {
            if (this.realtime) {
              CarApi.queryAsyncTree({
                id: node.data.id,
                factoryType: node.data.factoryType,
                checked: false
              })
                .then(res => {
                  return resolve(res);
                })
                .catch(error => {
                  this.$message({
                    message: error.message,
                    type: "error",
                    duration: 5 * 1000
                  });
                });
            } else {
              CarApi.querySolidifyTree({
                id: node.data.id,
                factoryType: node.data.factoryType,
                checked: false
              })
                .then(res => {
                  res = JSON.parse(res);
                  return resolve(res);
                })
                .catch(error => {
                  this.$message({
                    message: error.message,
                    type: "error",
                    duration: 5 * 1000
                  });
                });
            }
          }
        } else {
          return resolve(node.data.children);
        }
      }
    },
    // 树节点点击事件
    treeNodeClick(data) {
      if (data.lastNode) {
        const event = window.event;
        this.tranLeft = event.clientX + 80;
        this.tranTop = event.clientY - 200;
        this.dialogVisible = true;
        this.showMarker(data);
      }
    },
    // 树切换
    changeCarTree(type) {
      if (!this.realtime || type === "refresh") {
        this.listLoading = true;
        this.setSolidifyTree();
      } else {
        this.$confirm("开启实时数据后车辆树加载会变慢，确定开启?", "提示", {
          type: "warning"
        })
          .then(() => {
            this.listLoading = true;
            this.setAsyncTree();
          })
          .catch(() => {
            this.realtime = !this.realtime;
          });
      }
    },
    // 异步树
    setAsyncTree() {
      CarApi.queryAsyncTree({})
        .then(res => {
          this.treeData = [];
          var _this = this;
          if (res.length) {
            this.treeData.push(_.find(res, { id: "2" }));
            this.treeData[0]["children"] = [];
            // 默认展开到2级节点
            this.expandedKeys.push("2");
            res.forEach(item => {
              if (item.id !== "2") {
                _this.treeData[0]["children"].push(item);
              }
            });
          }
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
          });
        });
    },
    setSolidifyTree() {
      CarApi.querySolidifyTree({})
        .then(res => {
          this.treeData = [];
          var _this = this;
          res = JSON.parse(res);
          if (res) {
            if (res.length) {
              this.treeData.push(_.find(res, { id: "2" }));
              this.treeData[0]["children"] = [];
              // 默认展开到2级节点
              this.expandedKeys.push("2");
              res.forEach(element => {
                if (item) {
                  if (item.id !== "2") {
                    _this.treeData[0]["children"].push(item);
                  }
                }
              });
            }
          }
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
          });
        });
    },
    // 查询树
    simpleQueryTree() {
      this.listLoading = true;
      this.isSearch = true;
      this.treeData = [];
      this.expandedKeys = [];
      CarApi.querySearchTree(this.queryParams)
        .then(res => {
          this.treeData = res;
          if (res) {
            if (res.length) {
              this.getLastNode(res);
            }
          }
          this.listLoading = false;
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
          });
        });
    },
    // 递归展开查询树所有子节点
    getLastNode(res) {
      res.forEach(item => {
        if (!item.lastNode) {
          this.expandedKeys.push(item.id);
          this.getLastNode(item.children);
        }
      });
    },
    // 点击树节点地图打点
    showMarker(data) {
      this.map.clearOverlays();
      CarApi.queryCarLoc({ id: data.did, carSign: data.factoryType })
        .then(res => {
          data.carStauts = res.carStauts;
          if (res.lat && res.lng) {
            var myIcon = MapApi.setIcon(
              CarApi.getDirectIcon(res.carStauts, res.direction),
              30,
              30
            );
            var marker = MapApi.setMarker(res.lng, res.lat, myIcon);
            this.map.centerAndZoom(MapApi.setPoint(res.lng, res.lat), 10);
            this.map.addOverlay(marker);
            // 点击车辆图标显示详情弹框
            var _this = this;
            marker.addEventListener("click", function(e) {
              if (document.body.clientWidth - e.clientX > 500) {
                _this.tranLeft = e.clientX + 30;
              } else {
                _this.tranLeft =
                  document.body.clientWidth -
                  530 -
                  (document.body.clientWidth - e.clientX);
              }
              if (document.body.clientHeight - e.clientY > 350) {
                _this.tranTop = e.clientY - 80;
              } else if (
                document.body.clientHeight - e.clientY < 350 &&
                document.body.clientHeight - e.clientY > 180
              ) {
                _this.tranTop =
                  document.body.clientHeight -
                  200 -
                  (document.body.clientHeight - e.clientY);
              } else {
                _this.tranTop =
                  document.body.clientHeight -
                  320 -
                  (document.body.clientHeight - e.clientY);
              }
              _this.dialogVisible = true;
            });
          }
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
          });
        });
      CarApi.queryCarTip({ id: data.did, carSign: data.factoryType }).then(
        res => {
          this.carInfoData = res;
        }
      );
    },
    showRoleDialog() {
      this.dialogVisible = !this.dialogVisible;
    },
    // 全屏事件
    screenfull() {
      this.isFullscreen = !this.isFullscreen;
      this.fullScreenBtn = this.isFullscreen ? "退出全屏" : "全屏查看";
      // screenfull.toggle() 浏览器也全屏
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "carInfo") {
      from.meta.keepAlive = true;
    } else {
      from.meta.keepAlive = false;
    }
    this.listLoading = false;
    next();
  }
};
</script>
<style scoped lang="scss">
.el-card /deep/.el-card__body {
  height: 100%;
}
.el-tree {
  height: 90%;
}
.car-tree-height {
  @media screen and (max-height: 1080px) and (min-height: 900px) {
    max-height: 65vh;
  }
  @media screen and (max-height: 900px) and (min-height: 600px) {
    max-height: 50vh;
  }
}
.fullscreen {
  border-radius: 30px;
  padding: 10px 24px;
  img {
    width: 14px;
    margin-right: 6px;
    vertical-align: bottom;
  }
}
.el-loading-mask {
  position: fixed;
  z-index: 2003;
}
.mapFullscreenNo {
  position: inherit;
}
.refreshTree {
  font-size: 20px;
  font-weight: bold;
  color: #1a66f3;
  vertical-align: middle;
  margin-left: 20px;
  cursor: pointer;
}
.h {
  height: 100%;
}

.wh {
  width: 100%;
}
</style>
