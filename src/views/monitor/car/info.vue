<template>
  <el-container class="view-container h">
    <CarDetails :query="this.$route.query" @getPhoneNumbers="getPhoneNumbers"
                @setCarTip="setCarTip" @setCarDetail="setCarDetail">
      <el-col>
        <el-card shadow="always" class="h">
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="wh">
            <!--一汽用户查看的基本信息-->
            <el-tab-pane label="基本信息" name="detailYY">
              <el-card shadow="never">
                <div slot="header">
                  <span>基本信息</span>
                </div>
                <el-col :span="24" class="h50 line">
                  <el-col :span="4" class="desc">VIN</el-col><el-col :span="8">{{carDetail.vin || '无'}}</el-col>
                  <el-col :span="4" class="desc">车型码</el-col><el-col :span="8">{{carDetail.carModel || '无'}}</el-col>
                </el-col>
                <el-col :span="24" class="h50 line">
                  <el-col :span="4" class="desc">车辆类型</el-col><el-col :span="8">{{carDetail.carType || '无'}}</el-col>
                  <el-col :span="4" class="desc">发动机类型</el-col><el-col :span="8">{{carDetail.engineType || '无'}}</el-col>
                </el-col>
                <el-col :span="24" class="h50 line">
                  <el-col :span="4" class="desc">发动机型号</el-col><el-col :span="8">{{carDetail.engineNumber || '无'}}</el-col>
                  <el-col :span="4" class="desc">后桥</el-col><el-col :span="8">{{carDetail.hq || '无'}}</el-col>
                </el-col>
                <el-col :span="24" class="h50 line">
                  <el-col :span="4" class="desc">变速箱</el-col><el-col :span="8">{{carDetail.bsx || '无'}}</el-col>
                  <el-col :span="4" class="desc">动力类型</el-col><el-col :span="8">{{carDetail.powerType || '无'}}</el-col>
                </el-col>
                <el-col :span="24" class="h50 line">
                  <el-col :span="4" class="desc">排放</el-col><el-col :span="8">{{carDetail.emission || '无'}}</el-col>
                  <el-col :span="4" class="desc">终端SIM卡</el-col><el-col :span="8">{{carDetail.sim || '无'}}</el-col>
                </el-col>
                <el-col :span="24" class="h50 line">
                  <el-col :span="4" class="desc">终端通讯号</el-col><el-col :span="8">{{carDetail.commId || '无'}}</el-col>
                </el-col>
              </el-card>
              <el-card shadow="never" class="mt20">
                <div slot="header">
                  <span>客户信息</span>
                </div>
                <el-col :span="24" class="h50 line">
                  <el-col :span="4" class="desc">客户姓名</el-col><el-col :span="8">{{carDetail.customerName || '无'}}</el-col>
                  <el-col :span="4" class="desc">客户证件号</el-col><el-col :span="8">{{carDetail.customerCode || '无'}}</el-col>
                </el-col>
                <el-col :span="24" class="h50 line">
                  <el-col :span="4" class="desc">发票号</el-col><el-col :span="8">{{carDetail.invoiceCode || '无'}}</el-col>
                  <el-col :span="4" class="desc">司机姓名</el-col><el-col :span="8">{{carDetail.driverName || '无'}}</el-col>
                </el-col>
                <el-col :span="24" class="h50 line">
                  <el-col :span="4" class="desc">司机电话</el-col><el-col :span="8">{{carDetail.driverPhone || '无'}}</el-col>
                </el-col>
              </el-card>
            </el-tab-pane>

            <!--青气用户查看的基本信息-->
            <!--<el-tab-pane label="基本信息" name="detailQY">
              <el-card shadow="never">
                <div slot="header">
                  <span>基本信息</span>
                </div>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">底盘号</el-col>
                  <el-col :span="12">{{carDetail.chassisNum || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line" v-if="carDetail.chassisNumOld && userType !=4">
                  <el-col :span="12" class="desc">改码前底盘号</el-col>
                  <el-col :span="12">{{carDetail.chassisNumOld}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">车牌号</el-col>
                  <el-col :span="12">{{carDetail.plateNum || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">FK控制器</el-col>
                  <el-col :span="12">{{carDetail.fkTer || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">FK控制器SIM（通信号）</el-col>
                  <el-col :span="12">{{carDetail.fkSim}} ({{carDetail.fkCommNum || '无'}})</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">车辆类型：</el-col>
                  <el-col :span="12">{{carDetail.carType || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">发动机类型：</el-col>
                  <el-col :span="12">{{carDetail.engineType || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">发动机号：</el-col>
                  <el-col :span="12">{{carDetail.engineNum || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">车架号：</el-col>
                  <el-col :span="12">{{carDetail.vin || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line" v-if="carDetail.vinOld && userType !== 4 ">
                  <el-col :span="12" class="desc">改码前车架号：</el-col>
                  <el-col :span="12">{{carDetail.vinOld}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line" v-if="carDetail.fuel == 0">
                  <el-col :span="12" class="desc">天然气容量(L)：</el-col>
                  <el-col :span="12">{{carDetail.oilCapacity || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line" v-if="carDetail.fuel == 1">
                  <el-col :span="12" class="desc">油箱容量(L)：</el-col>
                  <el-col :span="12">{{carDetail.oilCapacity || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">分渠销售状态：</el-col>
                  <el-col :span="12">{{carDetail.aakSalesStatus || '未售'}}</el-col>
                </el-col>
              </el-card>
              <el-card shadow="never" class="mt20">
                <div slot="header">
                  <span>售前转运信息</span>
                </div>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">出库日期：</el-col>
                  <el-col :span="12">{{carDetail.removalTime || '无'}}</el-col>
                </el-col>
              </el-card>
              <el-card shadow="never" class="mt20">
                <div slot="header">
                  <span>分渠销售信息</span>
                </div>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">分渠销售日期：</el-col>
                  <el-col :span="12">{{carDetail.aakSalesTime || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">购车总金额：</el-col>
                  <el-col :span="12">{{carDetail.carAmount || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">贷款总金额：</el-col>
                  <el-col :span="12">{{carDetail.loanAmount || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">剩余未还款：</el-col>
                  <el-col :span="12">{{carDetail.surplus || '无'}}</el-col>
                </el-col>
              </el-card>
              <el-card shadow="never" class="mt20">
                <div slot="header">
                  <span>客户信息</span>
                </div>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">客户名称：</el-col>
                  <el-col :span="12">{{carDetail.customer || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">联系方式：</el-col>
                  <el-col :span="12">{{carDetail.phone || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">上次保养时间：</el-col>
                  <el-col :span="12">{{carDetail.maintainTime || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">上次保养地点：</el-col>
                  <el-col :span="12">{{carDetail.maintainPlace || '无'}}</el-col>
                </el-col>
              </el-card>
              <el-card shadow="never" class="mt20">
                <div slot="header">
                  <span>车型信息</span>
                </div>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">驱动形式：</el-col>
                  <el-col :span="12">{{carDetail.driveForm || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">驱动厂家及型号：</el-col>
                  <el-col :span="12">{{carDetail.driveVender || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">发动机功率：</el-col>
                  <el-col :span="12">{{carDetail.enginePower || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">变速箱：</el-col>
                  <el-col :span="12">{{carDetail.gearbox || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">后桥：</el-col>
                  <el-col :span="12">{{carDetail.rearAxle || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">轴距：</el-col>
                  <el-col :span="12">{{carDetail.wheelbase || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">轮胎：</el-col>
                  <el-col :span="12">{{carDetail.tyre || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">速比：</el-col>
                  <el-col :span="12">{{carDetail.gearRatio || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">前桥1厂家：</el-col>
                  <el-col :span="12">{{carDetail.frontAxleFactoryOne || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">前桥1型号：</el-col>
                  <el-col :span="12">{{carDetail.frontAxleTypeOne || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">前桥2厂家：</el-col>
                  <el-col :span="12">{{carDetail.frontAxleFactoryTwo || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">前桥2型号：</el-col>
                  <el-col :span="12">{{carDetail.frontAxleTypeTwo || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">后桥1厂家：</el-col>
                  <el-col :span="12">{{carDetail.rearAxleFactoryOne || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">后桥1型号：</el-col>
                  <el-col :span="12">{{carDetail.rearAxleTypeOne || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">后桥2厂家：</el-col>
                  <el-col :span="12">{{carDetail.rearAxleFactoryTwo || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">后桥2型号：</el-col>
                  <el-col :span="12">{{carDetail.rearAxleTypeTwo || '无'}}</el-col>
                </el-col>
                <el-col :span="12" class="h50 line">
                  <el-col :span="12" class="desc">其他：</el-col>
                  <el-col :span="12">{{carDetail.other}}</el-col>
                </el-col>
              </el-card>
            </el-tab-pane>-->
            <el-tab-pane label="锁车" name="lock" v-if="hasPerm(1001) && carTip.businessStatus === 3 && (carTip.lockStauts === 2 || carTip.lockStauts === 6)">
              <el-card shadow="never">
                <div slot="header" class="mt20">
                  <span>车主： {{carDetail.ownerName || '无'}} <span v-if="carDetail.ownerPhone">({{carDetail.ownerPhone}})</span></span>
                </div>
                <div class="fl mt20" style="width: 50%">
                  <div class="mb20" v-if="this.userInfo.type === 5">
                    <span>手机号：</span>
                    <el-select v-model="lock.phone" class="wh130">
                      <el-option v-for="item in phoneNumbers" :key="item.phone" :label="item.showInfo" :value="item.phone"></el-option>
                    </el-select>
                    <el-button @click="sendCode(1)" :disabled="disableMsgCodeLock">{{ msgTitleLock }}</el-button>
                  </div>
                  <div class="mb20" v-if="this.userInfo.type === 5">
                    <span>验证码：</span><el-input v-model="lock.checkCode" type="text" class="wh130"></el-input>
                  </div>
                  <div>
                    <el-button type="business" @click="lockcar" v-if="carTip.lockStauts === 2" class="wh80">锁车</el-button>
                    <el-button type="business" @click="undo" v-if="carTip.lockStauts === 6" class="wh80">撤销</el-button>
                  </div>
                </div>
                <div class="fl mt20" style="width: 50%">
                  <div class="h40" style="color: red">
                    <img src="@/assets/images/icon-error.png" v-if="lockAlarm" class="wh20 mr12" style="vertical-align: bottom" />{{lockAlarm}}
                  </div>
                  <div v-for="item in lockDesc" class="mb10" style="height: auto; min-height: 30px; line-height: 24px">
                    {{item.createtime}} {{item.msg}}
                  </div>
                </div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="解锁" name="unLock" v-if="hasPerm(1002) && carTip.businessStatus === 3 && ( carTip.lockStauts === 3 || carTip.lockStauts === 7)">
              <el-card shadow="never">
                <div slot="header" class="mt20">
                  <span>车主： {{carDetail.ownerName || '无'}} <span v-if="carDetail.ownerPhone">({{carDetail.ownerPhone}})</span></span>
                </div>
                <div class="fl mt20" style="width: 50%">
                  <div class="mb20" v-if="this.userInfo.type === 5">
                    <span>手机号：</span>
                    <el-select v-model="unLock.phone" class="wh130">
                      <el-option v-for="item in phoneNumbers" :key="item.phone" :label="item.showInfo" :value="item.phone"></el-option>
                    </el-select>
                    <el-button @click="sendCode(0)" :disabled="disableMsgCodeUnlock">{{ msgTitleUnlock }}</el-button>
                  </div>
                  <div class="mb20" v-if="this.userInfo.type === 5">
                    <span>验证码：</span><el-input v-model="unLock.checkCode" type="text" class="wh130"></el-input>
                  </div>
                  <div>
                    <el-button type="business" @click="unLockCar" v-if="carTip.lockStauts === 3" class="wh130">解锁</el-button>
                    <el-button type="business" @click="undo" v-if="carTip.lockStauts === 7" class="wh80">撤销</el-button>
                  </div>
                </div>
                <div class="fl mt20" style="width: 50%">
                  <div class="h40" style="color: red">
                    <img src="@/assets/images/icon-error.png" v-if="unLockAlarm" class="wh20 mr12" style="vertical-align: bottom" />{{unLockAlarm}}
                  </div>
                  <div v-for="item in unLockDesc" class="mb10" style="height: auto; min-height: 30px; line-height: 24px">
                    {{item.createtime}} {{item.msg}}
                  </div>
                </div>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </CarDetails>
    <!--    <el-row type="flex" justify="center" :gutter="30">-->
    <!--      <el-col class="wh550">-->
    <!--        <el-card shadow="always" class="h" style="font-size: 14px;">-->
    <!--          <el-col :span='24'>-->
    <!--            <img src="@/assets/images/car_cover.png" width="100%" style="height: 22vh;">-->
    <!--          </el-col>-->
    <!--          <el-col :span="24" class="mt20 mb20 chassisNum">-->
    <!--            <span>{{carDetail.chassisNum}}{{ carDetail.plateNum?('('+ carDetail.plateNum+')'):' '}}</span><span class="chassisNum" :class="{colorG: carTip.online, colorR: !carTip.online}">{{carTip.online == 1?'在线':'离线'}}</span>-->
    <!--          </el-col>-->
    <!--          <el-col :span="24" class="h20 t-info">所属经销商：</el-col>-->
    <!--          <el-col :span="24" class="h30">{{carDetail.dealer || '无'}}</el-col>-->
    <!--          <el-col :span="24" class="h20 t-info">车辆类型：</el-col>-->
    <!--          <el-col :span="24" class="h30">{{carDetail.carType || '无'}}</el-col>-->
    <!--          <el-col :span="24" class="h20 t-info">发动机类型：</el-col>-->
    <!--          <el-col :span="24" class="h30">{{carDetail.engineType || '无'}}</el-col>-->
    <!--          <el-col :span="24" class="h20 t-info">末次有效位置：</el-col>-->
    <!--          <el-col :span="24" class="location" v-lastlocationval="{ lng: carDetail.lastLng, lat: carDetail.lastLat }"></el-col>-->
    <!--          <el-col :span="24" class="h20 t-info">末次有效位置时间：</el-col>-->
    <!--          <el-col :span="24" class="h30">{{carDetail.lastTime || '无'}}</el-col>-->
    <!--          <el-col :span="24" class="h20 t-info">车速：</el-col>-->
    <!--          <el-col :span="24" class="h30 colorB">{{carDetail.speed}} km/h</el-col>-->
    <!--          <el-col :span="24" class="h20 t-info">转速：</el-col>-->
    <!--          <el-col :span="24" class="h30 colorB">{{carDetail.rotation}} r/min</el-col>-->
    <!--          <el-col :span="24" class="h20 t-info">车辆ACC状态：</el-col>-->
    <!--          <el-col :span="24" class="h30 colorB">{{carDetail.acc || '无'}}</el-col>-->
    <!--          <el-col :span='24' class="pb10" style="text-align: center">-->
    <!--            <el-button size="medium" type="primary" @click="returnTo">返回地图</el-button>-->
    <!--          </el-col>-->
    <!--        </el-card>-->
    <!--      </el-col>-->
    <!--      <el-col>-->
    <!--        <el-card shadow="always" class="h">-->
    <!--          <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="wh">-->
    <!--            &lt;!&ndash;一汽用户查看的基本信息&ndash;&gt;-->
    <!--            <el-tab-pane label="基本信息" name="detailYY">-->
    <!--              <el-card shadow="never">-->
    <!--                <div slot="header">-->
    <!--                  <span>基本信息</span>-->
    <!--                </div>-->
    <!--                <el-col :span="24" class="h50 line">-->
    <!--                  <el-col :span="4" class="desc">VIN</el-col><el-col :span="8">{{carDetail.vin || '无'}}</el-col>-->
    <!--                  <el-col :span="4" class="desc">车型码</el-col><el-col :span="8">{{carDetail.carModel || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="24" class="h50 line">-->
    <!--                  <el-col :span="4" class="desc">车辆类型</el-col><el-col :span="8">{{carDetail.carType || '无'}}</el-col>-->
    <!--                  <el-col :span="4" class="desc">发动机类型</el-col><el-col :span="8">{{carDetail.engineType || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="24" class="h50 line">-->
    <!--                  <el-col :span="4" class="desc">发动机型号</el-col><el-col :span="8">{{carDetail.engineNumber || '无'}}</el-col>-->
    <!--                  <el-col :span="4" class="desc">后桥</el-col><el-col :span="8">{{carDetail.hq || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="24" class="h50 line">-->
    <!--                  <el-col :span="4" class="desc">变速箱</el-col><el-col :span="8">{{carDetail.bsx || '无'}}</el-col>-->
    <!--                  <el-col :span="4" class="desc">动力类型</el-col><el-col :span="8">{{carDetail.powerType || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="24" class="h50 line">-->
    <!--                  <el-col :span="4" class="desc">排放</el-col><el-col :span="8">{{carDetail.emission || '无'}}</el-col>-->
    <!--                  <el-col :span="4" class="desc">终端SIM卡</el-col><el-col :span="8">{{carDetail.sim || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="24" class="h50 line">-->
    <!--                  <el-col :span="4" class="desc">终端通讯号</el-col><el-col :span="8">{{carDetail.commId || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--              </el-card>-->
    <!--              <el-card shadow="never" class="mt20">-->
    <!--                <div slot="header">-->
    <!--                  <span>客户信息</span>-->
    <!--                </div>-->
    <!--                <el-col :span="24" class="h50 line">-->
    <!--                  <el-col :span="4" class="desc">客户姓名</el-col><el-col :span="8">{{carDetail.customerName || '无'}}</el-col>-->
    <!--                  <el-col :span="4" class="desc">客户证件号</el-col><el-col :span="8">{{carDetail.customerCode || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="24" class="h50 line">-->
    <!--                  <el-col :span="4" class="desc">发票号</el-col><el-col :span="8">{{carDetail.invoiceCode || '无'}}</el-col>-->
    <!--                  <el-col :span="4" class="desc">司机姓名</el-col><el-col :span="8">{{carDetail.driverName || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="24" class="h50 line">-->
    <!--                  <el-col :span="4" class="desc">司机电话</el-col><el-col :span="8">{{carDetail.driverPhone || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--              </el-card>-->
    <!--            </el-tab-pane>-->

    <!--            &lt;!&ndash;青气用户查看的基本信息&ndash;&gt;-->
    <!--            &lt;!&ndash;<el-tab-pane label="基本信息" name="detailQY">-->
    <!--              <el-card shadow="never">-->
    <!--                <div slot="header">-->
    <!--                  <span>基本信息</span>-->
    <!--                </div>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">底盘号</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.chassisNum || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line" v-if="carDetail.chassisNumOld && userType !=4">-->
    <!--                  <el-col :span="12" class="desc">改码前底盘号</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.chassisNumOld}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">车牌号</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.plateNum || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">FK控制器</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.fkTer || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">FK控制器SIM（通信号）</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.fkSim}} ({{carDetail.fkCommNum || '无'}})</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">车辆类型：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.carType || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">发动机类型：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.engineType || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">发动机号：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.engineNum || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">车架号：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.vin || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line" v-if="carDetail.vinOld && userType !== 4 ">-->
    <!--                  <el-col :span="12" class="desc">改码前车架号：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.vinOld}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line" v-if="carDetail.fuel == 0">-->
    <!--                  <el-col :span="12" class="desc">天然气容量(L)：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.oilCapacity || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line" v-if="carDetail.fuel == 1">-->
    <!--                  <el-col :span="12" class="desc">油箱容量(L)：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.oilCapacity || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">分渠销售状态：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.aakSalesStatus || '未售'}}</el-col>-->
    <!--                </el-col>-->
    <!--              </el-card>-->
    <!--              <el-card shadow="never" class="mt20">-->
    <!--                <div slot="header">-->
    <!--                  <span>售前转运信息</span>-->
    <!--                </div>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">出库日期：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.removalTime || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--              </el-card>-->
    <!--              <el-card shadow="never" class="mt20">-->
    <!--                <div slot="header">-->
    <!--                  <span>分渠销售信息</span>-->
    <!--                </div>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">分渠销售日期：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.aakSalesTime || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">购车总金额：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.carAmount || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">贷款总金额：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.loanAmount || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">剩余未还款：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.surplus || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--              </el-card>-->
    <!--              <el-card shadow="never" class="mt20">-->
    <!--                <div slot="header">-->
    <!--                  <span>客户信息</span>-->
    <!--                </div>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">客户名称：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.customer || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">联系方式：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.phone || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">上次保养时间：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.maintainTime || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">上次保养地点：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.maintainPlace || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--              </el-card>-->
    <!--              <el-card shadow="never" class="mt20">-->
    <!--                <div slot="header">-->
    <!--                  <span>车型信息</span>-->
    <!--                </div>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">驱动形式：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.driveForm || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">驱动厂家及型号：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.driveVender || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">发动机功率：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.enginePower || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">变速箱：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.gearbox || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">后桥：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.rearAxle || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">轴距：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.wheelbase || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">轮胎：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.tyre || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">速比：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.gearRatio || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">前桥1厂家：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.frontAxleFactoryOne || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">前桥1型号：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.frontAxleTypeOne || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">前桥2厂家：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.frontAxleFactoryTwo || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">前桥2型号：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.frontAxleTypeTwo || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">后桥1厂家：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.rearAxleFactoryOne || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">后桥1型号：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.rearAxleTypeOne || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">后桥2厂家：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.rearAxleFactoryTwo || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">后桥2型号：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.rearAxleTypeTwo || '无'}}</el-col>-->
    <!--                </el-col>-->
    <!--                <el-col :span="12" class="h50 line">-->
    <!--                  <el-col :span="12" class="desc">其他：</el-col>-->
    <!--                  <el-col :span="12">{{carDetail.other}}</el-col>-->
    <!--                </el-col>-->
    <!--              </el-card>-->
    <!--            </el-tab-pane>&ndash;&gt;-->
    <!--            <el-tab-pane label="锁车" name="lock" v-if="hasPerm(1001) && carTip.businessStatus === 3 && (carTip.lockStauts === 2 || carTip.lockStauts === 6)">-->
    <!--              <el-card shadow="never">-->
    <!--                <div slot="header" class="mt20">-->
    <!--                  <span>车主： {{carDetail.ownerName || '无'}} <span v-if="carDetail.ownerPhone">({{carDetail.ownerPhone}})</span></span>-->
    <!--                </div>-->
    <!--                <div class="fl mt20" style="width: 50%">-->
    <!--                  <div class="mb20" v-if="this.userInfo.type === 5">-->
    <!--                    <span>手机号：</span>-->
    <!--                    <el-select v-model="lock.phone" class="wh130">-->
    <!--                      <el-option v-for="item in phoneNumbers" :key="item.phone" :label="item.showInfo" :value="item.phone"></el-option>-->
    <!--                    </el-select>-->
    <!--                    <el-button @click="sendCode(1)" :disabled="disableMsgCodeLock">{{ msgTitleLock }}</el-button>-->
    <!--                  </div>-->
    <!--                  <div class="mb20" v-if="this.userInfo.type === 5">-->
    <!--                    <span>验证码：</span><el-input v-model="lock.checkCode" type="text" class="wh130"></el-input>-->
    <!--                  </div>-->
    <!--                  <div>-->
    <!--                    <el-button type="business" @click="lockcar" v-if="carTip.lockStauts === 2" class="wh80">锁车</el-button>-->
    <!--                    <el-button type="business" @click="undo" v-if="carTip.lockStauts === 6" class="wh80">撤销</el-button>-->
    <!--                  </div>-->
    <!--                </div>-->
    <!--                <div class="fl mt20" style="width: 50%">-->
    <!--                  <div class="h40" style="color: red">-->
    <!--                    <img src="@/assets/images/icon-error.png" v-if="lockAlarm" class="wh20 mr12" style="vertical-align: bottom" />{{lockAlarm}}-->
    <!--                  </div>-->
    <!--                  <div v-for="item in lockDesc" class="mb10" style="height: auto; min-height: 30px; line-height: 24px">-->
    <!--                    {{item.createtime}} {{item.msg}}-->
    <!--                  </div>-->
    <!--                </div>-->
    <!--              </el-card>-->
    <!--            </el-tab-pane>-->
    <!--            <el-tab-pane label="解锁" name="unLock" v-if="hasPerm(1002) && carTip.businessStatus === 3 && ( carTip.lockStauts === 3 || carTip.lockStauts === 7)">-->
    <!--              <el-card shadow="never">-->
    <!--                <div slot="header" class="mt20">-->
    <!--                  <span>车主： {{carDetail.ownerName || '无'}} <span v-if="carDetail.ownerPhone">({{carDetail.ownerPhone}})</span></span>-->
    <!--                </div>-->
    <!--                <div class="fl mt20" style="width: 50%">-->
    <!--                  <div class="mb20" v-if="this.userInfo.type === 5">-->
    <!--                    <span>手机号：</span>-->
    <!--                    <el-select v-model="unLock.phone" class="wh130">-->
    <!--                      <el-option v-for="item in phoneNumbers" :key="item.phone" :label="item.showInfo" :value="item.phone"></el-option>-->
    <!--                    </el-select>-->
    <!--                    <el-button @click="sendCode(0)" :disabled="disableMsgCodeUnlock">{{ msgTitleUnlock }}</el-button>-->
    <!--                  </div>-->
    <!--                  <div class="mb20" v-if="this.userInfo.type === 5">-->
    <!--                    <span>验证码：</span><el-input v-model="unLock.checkCode" type="text" class="wh130"></el-input>-->
    <!--                  </div>-->
    <!--                  <div>-->
    <!--                    <el-button type="business" @click="unLockCar" v-if="carTip.lockStauts === 3" class="wh130">解锁</el-button>-->
    <!--                    <el-button type="business" @click="undo" v-if="carTip.lockStauts === 7" class="wh80">撤销</el-button>-->
    <!--                  </div>-->
    <!--                </div>-->
    <!--                <div class="fl mt20" style="width: 50%">-->
    <!--                  <div class="h40" style="color: red">-->
    <!--                    <img src="@/assets/images/icon-error.png" v-if="unLockAlarm" class="wh20 mr12" style="vertical-align: bottom" />{{unLockAlarm}}-->
    <!--                  </div>-->
    <!--                  <div v-for="item in unLockDesc" class="mb10" style="height: auto; min-height: 30px; line-height: 24px">-->
    <!--                    {{item.createtime}} {{item.msg}}-->
    <!--                  </div>-->
    <!--                </div>-->
    <!--              </el-card>-->
    <!--            </el-tab-pane>-->
    <!--          </el-tabs>-->
    <!--        </el-card>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
  </el-container>
</template>
<script>
  import CarApi from '@/api/monitor/car'
  import CommonApi from '@/api/common'
  import lastlocationval from '@/directive/lastlocationval' // 逆地理
  import CarDetails from '@/components/CarDetail'
  export default {
    components: {
      CarDetails
    },
    directives: {
      lastlocationval
    },
    data() {
      return {
        userType: '',
        carDetail: {
          chassisNum: '',
          plateNum: '',
          lastLng: this.$route.query.lng,
          lastLat: this.$route.query.lat
        },
        carTip: {
          online: ''
        },
        activeName: '',
        // 锁车提示信息
        lockAlarm: '',
        lockDesc: '',
        lock: {
          phone: '',
          checkCode: ''
        },
        unLock: {
          phone: '',
          checkCode: ''
        },
        userInfo: this.GLOBAL.userInfo,
        // 解锁提示信息
        unLockAlarm: '',
        unLockDesc: '',
        phoneNumbers: [],
        msgTitleLock: '发送验证码',
        msgTitleUnlock: '发送验证码',
        disableMsgCodeLock: false,
        disableMsgCodeUnlock: false,
        timerLock: null,
        isJump: false
      }
    },
    mounted() {
      this.verifyCodeId = this.randomStr(16)
      if(this.$route.query.type === 'info') {
        this.activeName = 'detailYY'
      } else if(this.$route.query.type === 'lock') {
        this.activeName = 'lock'
      } else if(this.$route.query.type === 'unlock') {
        this.activeName = 'unLock'
      }
      this.getUserInfo()
      this.getIp()
    },
    methods: {
      // 生成随机数
      randomStr(range) {
        var str = ''
        var pos = ''
        var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        arr.concat(['i', 'j', 'k', 'l', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'])
        for (var i = 0; i < range; i++) {
          pos = Math.round(Math.random() * (arr.length - 1))
          str += arr[pos]
        }
        return str
      },
      // 获取用户信息
      getUserInfo() {
        CommonApi.getUserInfo({}).then(res => {
          this.userType = res.type
        }).catch(error => {
          this.$message({ message: error.message, type: 'error', duration: 5 * 1000 })
        })
      },

      handleClick(tab, event) {
        clearInterval(this.timerLock)
        this.timerLock = null
        console.log(tab, event)
      },
      // 获取手机号
      getPhoneNumbers(dealerId, carSign) {
        CarApi.getPhoneNum({ dealerId: dealerId, carSign: carSign }).then(res => {
          this.phoneNumbers = res
        }).catch(error => {
          this.$message({ message: error.message, type: 'error', duration: 5 * 1000 })
        })
      },
      // 获取操作人ip
      getIp() {
        CarApi.getIp({}).then(res => {
          this.ip = res.data.ip
        })
      },
      // 发送验证码
      sendCode(type) {
        var params = {}
        if(type) {
          if (this.disableMsgCodeLock) {
            return false
          }
          if (!this.lock.phone) {
            this.$message.error('请输入手机号！')
            return false
          }
          const reg = /^[1][0-9]{10}$/
          if(!reg.test(this.lock.phone)) {
            this.$message({ message: '手机号格式不正确！', type: 'error', duration: 5 * 1000 })
            return false
          }
          params = {
            phone: this.lock.phone,
            verifyCodeId: this.verifyCodeId
          }
          var secondLock = 60
          var _this = this
          _this.timePromiseLock = setInterval(function() {
            if (secondLock <= 0) {
              clearInterval(_this.timePromiseLock)
              _this.timePromiseLock = null
              _this.msgTitleLock = '重发验证码'
              _this.disableMsgCodeLock = false
            } else {
              _this.msgTitleLock = secondLock + '秒后重发'
              _this.disableMsgCodeLock = true
              secondLock--
            }
          }, 1000, 100)
        }else {
          if (this.disableMsgCodeUnuck) {
            return false
          }
          if (!this.unLock.phone) {
            this.$message.error('请输入手机号！')
            return false
          }
          const reg = /^[1][0-9]{10}$/
          if(!reg.test(this.unLock.phone)) {
            this.$message({ message: '手机号格式不正确！', type: 'error', duration: 5 * 1000 })
            return false
          }
          params = {
            phone: this.unLock.phone,
            verifyCodeId: this.verifyCodeId
          }
          var secondUnlock = 60
          var _this_ = this
          _this_.timePromiseUnlock = setInterval(function() {
            if (secondUnlock <= 0) {
              clearInterval(_this_.timePromiseUnlock)
              _this_.timePromiseUnlock = null
              _this_.msgTitleUnlock = '重发验证码'
              _this_.disableMsgCodeUnlock = false
            } else {
              _this_.msgTitleUnlock = secondUnlock + '秒后重发'
              _this_.disableMsgCodeUnlock = true
              secondUnlock--
            }
          }, 1000, 100)
        }
        CarApi.sendCode(params).then(res => {
          this.$message.success(res)
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      getCarStatus() {
        var getCarStatusParams = {
          carId: parseInt(this.carTip.id)
        }
        CarApi.getDesc(getCarStatusParams).then(res => {
          if (res.isAlter === 1) {
            this.$message.info('由于平台与终端状态不一致，平台状态自动跳转为与终端一致！')
            if(res.vehicleStatus === 2 || res.vehicleStatus === 3) {
              window.clearInterval(this.timerLock)
            }
            this.carTip.lockStauts = res.vehicleStatus
            switch (res.vehicleStatus) {
              case 2:
                this.activeName = 'lock'
                this.lock.phone = ''
                this.lock.checkCode = ''
                this.lockDesc = ''
                this.lockAlarm = ''
                break
              case 3:
                this.activeName = 'unLock'
                this.unLock.phone = ''
                this.unLock.checkCode = ''
                this.unLockDesc = ''
                this.unLockAlarm = ''
                break
            }
          }
          // 当用户不是点击操作 进行tab 跳转   this.carTip.lockStatus!=res.vehicleStatus 是为了处理2状态对应2个tab栏问题
          if(!this.isJump && this.carTip.lockStauts !== res.vehicleStatus) {
            this.switchItem(res)
          }else if(this.carTip.lockStauts === res.vehicleStatus) {
            this.switchItem(res)
          }
          this.isJump = false
        }).catch(error => {
          this.$message.error(error.message)
        })
      },
      switchItem(res) {
        if(res.vehicleStatus === 2 || res.vehicleStatus === 3) {
          window.clearInterval(this.timerLock)
          this.timerLock = null
        }
        this.carTip.lockStauts = res.vehicleStatus
        switch (res.vehicleStatus) {
          case 2:
            this.activeName = 'lock'
            this.lock.phone = ''
            this.lock.checkCode = ''
            this.lockDesc = ''
            this.lockAlarm = ''
            break
          case 3:
            this.activeName = 'unLock'
            this.unLock.phone = ''
            this.unLock.checkCode = ''
            this.unLockDesc = ''
            this.unLockAlarm = ''
            break
        }
      },
      // 锁车
      lockcar() {
        if(!this.lock.phone && this.userInfo.type === 5) {
          this.$message.error('请输入手机号！')
          return
        }
        if(!this.lock.checkCode && this.userInfo.type === 5) {
          this.$message.error('请输入验证码！')
          return
        }
        var paramsLock = {
          carId: this.carTip.id,
          carSign: this.carTip.carSign,
          // 锁车是1
          sign: 1,
          ip: this.ip,
          engineType: this.carDetail.engineType,
          phoneNumber: this.lock.phone,
          verifyCode: this.lock.checkCode,
          verifyCodeId: this.verifyCodeId,
          carOwner: this.carDetail.ownerName,
          ownerPhone: this.carDetail.ownerPhone
        }
        CarApi.lock(paramsLock).then(res => {
          this.lockAlarm = res.data.message
          if (!this.timerLock) {
            var _this1 = this
            CarApi.getDesc({ carId: this.carTip.id }).then(res => {
              this.lockDesc = res.list
            })
            _this1.getCarStatus()
            this.timerLock = setInterval(function() {
              _this1.getCarStatus()
            }, 15000)
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      // 撤销
      undo() {
        var undoParams = {}
        if(this.activeName === 'lock' && this.userInfo.type === 5) {
          if(!this.lock.phone) {
            this.$message.error('请输入手机号！')
            return
          }
          if(!this.lock.checkCode && this.userInfo.type === 5) {
            this.$message.error('请输入验证码！')
            return
          }
          undoParams = {
            carId: this.carTip.id,
            carSign: this.carTip.carSign,
            // 锁车是1
            type: 1,
            phoneNumber: this.lock.phone,
            verifyCode: this.lock.checkCode,
            verifyCodeId: this.verifyCodeId
          }
        }else {
          if(!this.unLock.phone && this.userInfo.type === 5) {
            this.$message.error('请输入手机号！')
            return
          }
          if(!this.unLock.checkCode && this.userInfo.type === 5) {
            this.$message.error('请输入验证码！')
            return
          }
          undoParams = {
            carId: this.carTip.id,
            carSign: this.carTip.carSign,
            // 解锁是0
            type: 0,
            phoneNumber: this.unLock.phone,
            verifyCode: this.unLock.checkCode,
            verifyCodeId: this.verifyCodeId
          }
        }
        CarApi.undo(undoParams).then(res => {
          this.$message.success(res)
          this.getCarStatus()
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      // 解锁
      unLockCar() {
        if(!this.unLock.phone && this.userInfo.type === 5) {
          this.$message.error('请输入手机号！')
          return
        }
        if(!this.unLock.checkCode && this.userInfo.type === 5) {
          this.$message.error('请输入验证码！')
          return
        }
        var paramsUnLock = {
          carId: this.carTip.id,
          carSign: this.carTip.carSign,
          // 解锁是0
          sign: 0,
          ip: this.ip,
          engineType: this.carDetail.engineType,
          phoneNumber: this.unLock.phone,
          verifyCode: this.unLock.checkCode,
          verifyCodeId: this.verifyCodeId,
          carOwner: this.carDetail.ownerName,
          ownerPhone: this.carDetail.ownerPhone
        }
        CarApi.unLock(paramsUnLock).then(res => {
          this.unLockAlarm = res.data.message
          if (!this.timerLock) {
            var _this2 = this
            CarApi.getDesc({ carId: this.carTip.id }).then(res => {
              this.unLockDesc = res.list
            })
            _this2.getCarStatus()
            this.timerLock = setInterval(function() {
              _this2.getCarStatus()
            }, 15000)
          }
        }).catch(err => {
          this.$message.error(err.message)
        })
      },
      setCarDetail(carDetail) {
        console.log('aa')
        this.carDetail = carDetail
      },
      setCarTip(carTip) {
        this.carTip = carTip
      }
    },
    beforeRouteLeave(to, from, next) {
      window.clearInterval(this.timerLock)
      this.timerLock = null
      if (to.path === '/monitor/car') {
        to.meta.keepAlive = true
        window.sessionStorage.setItem('TabsValue', to.path)
      } else {
        to.meta.keepAlive = false
      }
      next()
    }
  }
</script>
<style lang="scss" scoped>
  .chassisNum{
    font-size: 20px;
    font-weight: bold;
    vertical-align: text-bottom;
  }
  .info-dealer {
    height: auto;
    min-height: 30px;
    line-height: 20px;
    padding: 0 10px 10px 0;
  }
  .colorG {
    color: #28D228FF;
  }
  .colorR {
    color: #ccc;
  }
  .colorB {
    color: #377CFD;
  }
  .desc {
    line-height: 50px;
    background: rgba(248,248,248,1);
    width: 100px;
  }
  .location{
    height: auto;
    min-height: 20px;
    margin-bottom: 10px;
  }
  .t-info {
    color: #898989;
  }
  .el-card /deep/.el-card__body{
    padding: 10px;
  }
  .el-col-8{
    font-size: 14px;
    padding-top: 4px;
    word-break: break-all;
  }
  .line {
    border-bottom: 1px solid rgba(238,238,238,1);
  }
</style>
