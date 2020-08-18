<template>
  <el-container class="h pd-10">
    <el-card shadow="always" class="h">
      <el-row type="flex" justify="center" :gutter="10" class="mt10">
        <el-col :span="32">
          <el-col :span="8">
            <el-select v-model.trim="queryParams.searchType">
              <el-option :label="$t('basicInfo.bottomNo')" value="1">{{$t('basicInfo.bottomNo')}}</el-option>
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
          <el-col :span="3">
            <el-button
              type="primary"
              @click="queryTree"
              icon="el-icon-search"
              style="padding: 11px"
            ></el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" icon="el-icon-more" style="padding:11px;"></el-button>
          </el-col>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="18" class="mt16">
          <span>{{$t('monitor.data')}}：</span>
          <el-switch
            v-model="realtime"
            active-color="#009cef"
            inactive-color="#bdbdbd"
            @change="changeCarTree"
          ></el-switch>
          <i
            :title="$t('monitor.refresh')"
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
        </span>
      </el-tree>
    </el-card>
    <el-card id="rt-map" shadow="always" class="wh ml10">
      <div>
        <el-button type="primary" @click="clickFullScreen" class="fullscreen">
          <img src="@/assets/images/fullScreenBtn.png" />
          {{fullScreenBtn}}
        </el-button>
      </div>
      <div class="h map-area">
        <h-map
          style="height:300px"
          :center="center"
          :zoom="zoom"
          :layer-language="this.$i18n.locale"
          :zoomUi="{alignment: 'right-bottom'}"
          :zoomrectangleUi="false"
          :mapsettingsUi="false"
          :scalebarUi="false"
          :distancemeasurementUi="{alignment: 'right-top'}"
          @ready="mapReady"
        >
          <h-marker
            v-if="makerPosition"
            :position="makerPosition"
            :draggable="false"
            :volatility="true"
          ></h-marker>
        </h-map>
      </div>
      <!--点击地图车辆标注点，显示弹框的组件-->
      <carInfo
        :dialogVisible="dialogVisible"
        :car="carInfoData"
        :tranLeft="tranLeft"
        :tranTop="tranTop"
        @carDialogClose="showRoleDialog"
      ></carInfo>
    </el-card>
  </el-container>
</template>
<script>
import car_point_run from "@/assets/images/car_point1.png";
import CarApi from "@/api/monitor/car";
import CarInfo from "@/components/CarInfo";
import { debounce } from "@/utils/debounce";
import screenfull from "screenfull";

export default {
  components: {
    CarInfo
  },
  created() {
    this.loadingMap = true;
    this.fullScreenBtn = this.$t('monitor.fullscreen')
    this.initScreenfull();

  },
  destroyed() {
    this.destroyScreenfull();
  },
  computed: {
  
    typeArr() {
      return [
        {
          value: this.$t("monitor.search.carno"),
          code: 2
        },
        {
          value: this.$t("monitor.search.sim"),
          code: 3
        },
        {
          value: this.$t("monitor.search.group"),
          code: 4
        },
        {
          value: this.$t("monitor.search.deviceId"),
          code: 5
        }
      ];
    }
  },
  data() {
    return {
      // 默认中心
      makerPosition: "",
      center: { lat: "22.2917", lng: "114.1872" },
      mapStyle: "",
      zoom: 3,
      // 加载等待
      listLoading: false,
      // 判断点击全屏
      isFullscreen: false,
      fullScreenBtn: "",
      // 查询树条件类型
      // 车辆树数据
      treeData: [],
      // 树默认展开节点
      expandedKeys: [],
      // 树的默认设置
      defaultProps: {
        label: "name",
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
      isSearch: false,
      loadingMap: true
    };
  },
  mounted() {
    this.$_resizeHandler = debounce(() => {
      console.log("resize");
      if (this.MAP) {
        this.MAP.getViewPort().resize();
      }
    }, 100);
  },
  methods: {
    // 查询
    queryTree() {
      this.isSearch = false;
      // 如果没有查询条件，调用异步树；返之，调用查询树
      if (!this.queryParams.searchText) {
        this.setSolidifyTree();
      } else {
        this.simpleQueryTree();
      }
    },
    // 展开树节点执行函数
    loadNode(node, resolve) {
      if (!this.isSearch) {
        if (!node.data.lastNode) {
          if (this.realtime) {
            CarApi.queryAsyncTree({
              id: node.data.id,
              factoryType: node.data.factoryType,
              checked: false
            })
              .then(res => {
                res.data &&
                  res.data.forEach(item => {
                    item.lastNode = !item.isParent;
                    item.children = [];
                  });
                return resolve(res.data);
              })
              .catch(error => {
                this.$message({
                  message: error.message,
                  type: "error",
                  duration: 5 * 1000
                });
              });
          } else {
            this.listLoading = true;
            CarApi.querySolidifyTree({
              id: node.data.id
            })
              .then(res => {
                res.data = JSON.parse(res.data);
                res.data &&
                  res.data.forEach(item => {
                    item.lastNode = !item.isParent;
                    item.children = [];
                  });
                return resolve(res.data);
              })
              .catch(error => {
                this.$message({
                  message: error.message,
                  type: "error",
                  duration: 5 * 1000
                });
              })
              .finally(re => {
                this.listLoading = false;
              });
          }
        }
      } else {
        console.log(node.data.children);
        return resolve(JSON.parse(node.data.children));
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
        this.setSolidifyTree();
      } else {
        this.$confirm(this.$t("monitor.confirm"), this.$t("common.notice"), {
          type: "warning"
        })
          .then(() => {
            this.setAsyncTree();
          })
          .catch(() => {
            this.realtime = !this.realtime;
          });
      }
    },
    // 异步树
    setAsyncTree() {
      this.listLoading = true;
      CarApi.queryAsyncTree({})
        .then(res => {
          this.listLoading = false;
          this.treeData = [];
          res.data = JSON.parse(res.data);
          res.data &&
            res.data.forEach(item => {
              item.lastNode = !item.isParent;
              item.children = [];
            });
          this.treeData = res.data;
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
      this.listLoading = true;
      CarApi.querySolidifyTree({})
        .then(res => {
          this.treeData = [];
          var _this = this;
          res = JSON.parse(res.data);
          if (res && res.length) {
            this.treeData = res;
          }
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
          });
        })
        .finally(re => {
          this.listLoading = false;
        });
    },
    // 查询树
    simpleQueryTree() {
      let _this = this;
      this.listLoading = true;
      this.isSearch = true;
      this.treeData = [];
      this.expandedKeys = [];
      CarApi.querySearchTree(this.queryParams)
        .then(res => {
          this.formatSearchTree(res.data);
          if (this.treeData.length > 0) {
            this.getLastNode(this.treeData);
          }
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
          });
        })
        .finally(re => {
          this.listLoading = false;
        });
    },
    formatSearchTree(list) {
      let _this = this;
      list.forEach((item, index) => {
        item.children = [];
        item.lastNode = !item.isParent;
      });
      //拆开树，重新组装
      this.getParent(list);
    },
    getParent(list) {
      list.forEach((element, index, arr) => {
        if (index < arr.length - 1) {
          element.children.push(arr[index + 1]);
        }
      });
      this.treeData.push(list[0]);
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
      CarApi.queryCarLoc({ id: data.did })
        .then(res => {
          res = res.data;
          if (res.lat && res.lng) {
            //地图打点
            this.MAP.setCenter({ lat: res.lat, lng: res.lng });
            this.MAP.setZoom(6);
            this.makerPosition = { lat: res.lat, lng: res.lng };
          } else {
            this.$message.warning(this.$t("monitor.confirm.noposition"));
          }
        })
        .catch(error => {
          this.$message({
            message: error.message,
            type: "error",
            duration: 5 * 1000
          });
        });
      CarApi.queryCarTip({ id: data.did }).then(res => {
        this.carInfoData = res.data;
      });
    },
    showRoleDialog() {
      this.dialogVisible = !this.dialogVisible;
    },

    // 初始化全屏插件begin
    initScreenfull() {
      if (screenfull.isEnabled) {
        screenfull.on("change", () => {
          this.isFullscreen = screenfull.isFullscreen;
        });
      }
    },
    destroyScreenfull() {
      if (screenfull.isEnabled) {
        screenfull.off("change", () => {
          this.isFullscreen = screenfull.isFullscreen;
        });
      }
    },
    clickFullScreen() {
      // 点击全屏
      if (!screenfull.isEnabled) {
        this.$message({
          message: "you browser can not work",
          type: "warning"
        });
        return false;
      }
      const rtMap = document.getElementById("rt-map");
      // 全屏
      this.fullScreenBtn = !this.isFullscreen ? this.$t("monitor.returnscreen") :this.$t("monitor.fullscreen");
      screenfull.toggle(rtMap);
    },
    // 初始化全屏插件end

    //here地图
    mapReady({ H, map, ui, behavior, defaultLayers, platform }) {
      window.H = H;
      this.MAP = map;
      this.defaultLayers = defaultLayers;
      setTimeout(() => {
        this.getViewPoint(1);
      }, 1000);

      this.setUpClickListener(map);
    },
    getViewPoint(teamId) {
      const _this = this;
      const view = this.MAP.getViewModel()
        .getLookAtData()
        .bounds.getBoundingBox();
      console.log(view.getBottomRight());
      console.log(view.getTopLeft());
      const objectTopLeftScreen = view.getTopLeft();
      const objectBottomRightScreen = view.getBottomRight();
      this.getPolymerize({
        leftLng: objectTopLeftScreen.lng,
        leftLat: objectTopLeftScreen.lat,
        rightLng: objectBottomRightScreen.lng,
        rightLat: objectBottomRightScreen.lat,
        teamId
      });
    },
    //双击放大，获取点击的坐标
    setUpClickListener(map) {
      const _this = this;
      this.MAP.addEventListener("dbltap", function(evt) {
        let coord = map.screenToGeo(
          evt.currentPointer.viewportX,
          evt.currentPointer.viewportY
        );
        this.zoom = map.getZoom();
        _this.getViewPoint(1); //放大重新获取聚合点
      });
    },

    //接口获取聚合点信息
    async getPolymerize(p) {
      const obj = {
        level: this.zoom,
        leftLng: p.leftLng,
        leftLat: p.leftLat,
        rightLng: p.rightLng,
        rightLat: p.rightLat,
        teamId: p.teamId
      };
      const re = await CarApi.queryPolymerize(obj);
      const pointList = re.data;
      if (pointList.length > 0) {
        this.polyMerize(pointList);
      }
    },

    //地图聚合
    polyMerize(pointList) {
      var dataPoints = pointList.map(function(item) {
        return new H.clustering.DataPoint(item.lat, item.lng, item.count);
      });
      var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
        clusteringOptions: {
          // Maximum radius of the neighbourhood
          eps: 80,
          // minimum weight of points required to form a cluster
          minWeight: 2
        }
      });
      var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);
      this.MAP.addLayer(clusteringLayer);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "carInfo") {
      from.meta.keepAlive = true;
    } else {
      from.meta.keepAlive = false;
    }
    next();
  }
};
</script>
<style scoped lang="scss">
.el-card ::v-deep.el-card__body {
  height: calc(100vh - 150px);
}
.el-tree {
  height: 90%;
}
.car-tree-height {
  @media screen and (max-height: 1080px) and (min-height: 900px) {
    max-height: 65vh;
  }
  @media screen and (max-height: 900px) and (min-height: 600px) {
    max-height: 55vh;
  }
}
.fullscreen {
  // border-radius: 30px;
  padding: 10px 24px;
  img {
    width: 14px;
    margin-right: 6px;
    vertical-align: bottom;
  }
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
.map-area {
  position: relative;
  height: calc(100vh - 250px);
  padding: 10px 0;
}

.wh {
  width: 100%;
}

.mt10 {
  margin-top: 10px;
}
.mt16 {
  margin-top: 16px;
}
</style>
