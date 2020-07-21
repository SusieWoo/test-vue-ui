<template>
  <el-dialog title="" :visible.sync="dialogVisible" top="3vh" :before-close="cancel" :modal="false" width="500px" @open="open" :close-on-click-modal="false" :destroy-on-close="true" :style="styleObject">
    <el-row>
      <el-col :span="24">
        <img src="@/assets/images/icon-car.png"/> <span class="chassisNum">{{car.chassisNum}}{{ car.plateNum?('('+ car.plateNum+')'):' '}}</span><span class="chassisNum" :class="{colorG: car.online, colorR: !car.online}">{{car.online == 1?'在线':'离线'}}</span>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">车系：</el-col>
        <el-col :span="14">{{car.carSeries || '无'}}</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">车型：</el-col>
        <el-col :span="14">{{car.carType || '无'}}</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">驱动形式：</el-col>
        <el-col :span="14">{{car.driveType || '无'}}</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">司机电话：</el-col>
        <el-col :span="14">{{car.driverPhone || '无'}}</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">行驶里程：</el-col>
        <el-col :span="14">{{car.mileage || 0}}KM</el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">近30天平均百公里油耗：</el-col>
        <el-col :span="14">{{car.avgOil || 0}}L/100KM</el-col>
      </el-col>
      <el-col :span="24" style="min-height: 26px; height: auto">
        <el-col :span="10">末次有效位置：</el-col>
        <el-col :span="14" v-lastlocation="{ lng: car.lng, lat: car.lat }"></el-col>
      </el-col>
      <el-col :span="24">
        <el-col :span="10">末次有效位置时间：</el-col>
        <el-col :span="14">{{car.gpstime || '无'}}</el-col>
      </el-col>
      <el-col :span="24" class="mb20">
        <el-button type="primary" size="medium" class="infoBtn" :disabled="loading" @click='carInfoPage("info")'>车辆详情</el-button>
        <el-button type="primary" size="medium" class="infoBtn" :disabled="loading" @click='carInfoPage("real")'>实时在途</el-button>
        <el-button type="primary" size="medium" class="infoBtn" :disabled="loading" @click='carInfoPage("reproduce")'>在途重现</el-button>
        <el-button type="primary" size="medium" class="lockBtn" :disabled="loading" @click.native='carInfoPage("lock")'  v-if="hasPerm(1001) && car.lockStauts === 2 && car.businessStatus === 3">锁车</el-button>
        <el-button type="primary" size="medium" class="unLockBtn" :disabled="loading" @click.native='carInfoPage("unlock")' v-if="hasPerm(1002) &&  car.lockStauts === 3 && car.businessStatus === 3">解锁</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
  import lastlocation from '@/directive/lastlocation' // 逆地理
  import { mapActions } from 'vuex'

  export default {
    name: 'carInfo',
    // '弹框显隐', '字段集合', '弹框的左侧位置', '弹框上方位置'
    props: ['dialogVisible', 'car', 'tranLeft', 'tranTop'],
    directives: {
      lastlocation
    },
    data() {
      return {
        loading: true,
        // 弹框显示位置
        styleObject: {
          left: 0,
          top: 0
        },
        typeNames: {
          info: '详情',
          real: '实时在途',
          reproduce: '在途重现'
        }
      }
    },
    watch: {
      // 点击地图标注点后，弹框重定位
      tranLeft(n) {
        this.styleObject.left = n + 'px'
      },
      tranTop(n) {
        this.styleObject.top = n + 'px'
      },
      // 防止数据没加载时，进入详情页id为空报错
      car(n) {
        if(n) {
          this.loading = false
        }
      }
    },
    methods: {
      ...mapActions({
        handleOpen2: 'editableTabs'
      }),
      // 跳转到车辆详情
      carInfoPage(type) {
        const route = {
          path: `car/${type}`,
          wholePath: `/monitor/car/${type}`,
          roleId: 1,
          meta: {
            title: `车辆管理 - ${this.typeNames[type]}`
          },
          query: {
            id: this.car.id,
            carSign: this.car.carSign,
            lng: this.car.lng,
            lat: this.car.lat,
            type: type
          }
        }
        this.handleOpen2(route)
      },
      // 打开dialog，设置弹框位置
      open() {
        this.styleObject.left = this.tranLeft + 'px'
        this.styleObject.top = this.tranTop + 'px'
      },
      cancel() {
        // 通过父组件关闭弹框
        this.$emit('carDialogClose', null)
      }
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'carInfo') {
        from.meta.keepAlive = true
      }else{
        from.meta.keepAlive = false
      }
      next()
    }
  }
</script>
<style lang="scss" scoped>
  .el-col-24{
    height: 26px;
    font-size: 15px;
  }
  /deep/ .el-dialog{
    position: absolute;
  }
  .el-dialog__wrapper{
    width: 500px;
    max-height: 400px;
  }
  .chassisNum {
    margin: 0 6px;
    font-weight: bold;
    font-size: 16px;
    color: #000;
  }
  .colorG {
    color: #28D228FF;
  }
  .colorR {
    color: #ccc;
  }
  /deep/ .el-dialog .el-dialog__headerbtn {
    top: 8px;
  }
  .infoBtn, .lockBtn, .unLockBtn {
    width: 103px;
    margin-right: 8px;
    border-radius: 40px;
    border: none;
  }
  .infoBtn{
    background:linear-gradient(to right, #378BFD, #1B62E7);
  }
  .lockBtn, .unLockBtn {
    background:linear-gradient(to right, #1BD0C8, #09BDB5);
  }
</style>
