<template>
  <div>
    <el-card shadow="never">
      <div slot="header">
        <span>{{$t("monitor.basic")}}</span>
      </div>
      <div class="car-row-table">
        <li class="small">
          <ul>{{$t("basicInfo.bottomNo")}}</ul>
          <ul>{{$t("basicInfo.carNo")}}</ul>
          <ul>{{$t("monitor.car.fk")}}</ul>
          <ul>{{$t("monitor.info.engineType")}}</ul>
          <ul>{{$t("monitor.car.cNo")}}</ul>
          <ul>{{$t("monitor.car.container")}}</ul>
        </li>
        <li class="max">
          <ul>{{carDetail.plateNum || $t("common.none") }}</ul>
          <ul>{{carDetail.fkSim}} ({{carDetail.fkCommNum ||$t("common.none") }})</ul>
          <ul>{{carDetail.engineType || $t("common.none") }}</ul>
          <ul>{{carDetail.vin || $t("common.none") }}</ul>
          <ul>{{carDetail.oilCapacity || $t("common.none") }}</ul>
        </li>
        <li class="small">
          <ul>{{$t("monitor.car.preBtmNo")}}</ul>
          <ul>{{$t("monitor.car.kfId")}}</ul>
          <ul>{{$t("monitor.info.carType")}}</ul>
          <ul>{{$t("business.motor")}}</ul>
          <ul>{{$t("monitor.car.preCNo")}}</ul>
          <ul>{{$t("monitor.car.salesStatus")}}</ul>
        </li>
        <li class="max">
          <ul>{{carDetail.chassisNumOld || $t("common.none") }}}}</ul>
          <ul>{{carDetail.fkTer || $t("common.none") }}}}</ul>
          <ul>{{carDetail.carType || $t("common.none") }}}}</ul>
          <ul>{{carDetail.engineNum || $t("common.none") }}}}</ul>
          <ul>{{carDetail.vinOld || $t("common.none") }}}}</ul>
          <ul>{{carDetail.aakSalesStatus || $t("common.none") }}}}</ul>
        </li>
      </div>
    </el-card>
    <el-card shadow="never" class="mt20">
      <div slot="header">
        <span>{{ $t("monitor.car.preSalesInfo")}}</span>
      </div>
      <div class="car-row-table">
        <li class="small">
          <ul>{{ $t("monitor.car.outdate")}}</ul>
        </li>
        <li class="max">
          <ul>{{carDetail.removalTime ||  $t("common.none")}}</ul>
        </li>
      </div>
    </el-card>

    <el-card shadow="never" class="mt20">
      <div slot="header">
        <span>{{ $t("monitor.car.salesInfo")}}</span>
      </div>
      <div class="car-row-table">
        <li class="small">
          <ul>{{$t("monitor.car.salesDate")}}</ul>
          <ul>{{$t("monitor.car.loanAmount")}}</ul>
        </li>
        <li class="max">
          <ul>{{carDetail.aakSalesTime ||  $t("common.none")}}</ul>
          <ul>{{carDetail.loanAmount}}</ul>
        </li>
        <li class="small">
          <ul>{{$t("monitor.car.carAmount")}}</ul>
          <ul>{{$t("monitor.car.overdraftAmount")}}</ul>
        </li>
        <li class="max">
          <ul>{{carDetail.carAmount}}</ul>
          <ul>{{carDetail.surplus}}</ul>
        </li>
      </div>
    </el-card>
    <el-card shadow="never" class>
      <div slot="header">
        <span>{{$t("monitor.car.cInfo")}}</span>
      </div>
      <div class="car-row-table">
        <li class="small">
          <ul>{{$t("monitor.car.cName")}}</ul>
          <ul>{{$t("monitor.car.lastTime")}}</ul>
        </li>
        <li class="max">
          <ul>{{carDetail.customer || $t("common.none")}}</ul>
          <ul>{{carDetail.maintainTime|| $t("common.none")}}</ul>
        </li>
        <li class="small">
          <ul>{{$t("monitor.car.contract")}}</ul>
          <ul>{{$t("monitor.car.lastLocation")}}</ul>
        </li>
        <li class="max">
          <ul>{{carDetail.phone|| $t("common.none")}}</ul>
          <ul>{{carDetail.maintainPlace|| $t("common.none")}}</ul>
        </li>
      </div>
    </el-card>
    <el-card shadow="never" class="mt20">
      <div slot="header">
        <span>{{$t("monitor.car.catType")}}</span>
      </div>
      <div class="car-row-table">
        <li class="small">
          <ul> {{$t("monitor.car.driveType")}} </ul>
          <ul> {{$t("monitor.car.enginePower")}} </ul>
          <ul> {{$t("monitor.car.RA")}} </ul>
          <ul> {{$t("monitor.car.tires")}} </ul>
          <ul> {{$t("monitor.car.f1Factory")}}</ul>
          <ul> {{$t("monitor.car.f2Factory")}} </ul>
          <ul> {{$t("monitor.car.b2Factory")}} </ul>
          <ul> {{$t("monitor.car.b2Factory")}} </ul>
        </li>
        <li class="max">
          <ul>{{carDetail.driveForm || $t("common.none")}}</ul>
          <ul>{{carDetail.enginePower|| $t("common.none")}}</ul>
          <ul>{{carDetail.rearAxle|| $t("common.none")}}</ul>
          <ul>{{carDetail.tyre|| $t("common.none")}}</ul>
          <ul>{{carDetail.frontAxleFactoryOne|| $t("common.none")}}</ul>
          <ul>{{carDetail.frontAxleFactoryTwo|| $t("common.none")}}</ul>
          <ul>{{carDetail.rearAxleFactoryOne|| $t("common.none")}}</ul>
          <ul>{{carDetail.rearAxleFactoryTwo|| $t("common.none")}}</ul>
        </li>
        <li class="small">
          <ul>{{$t("monitor.car.ft")}}</ul>
          <ul>{{$t("monitor.car.gearbox")}}</ul>
          <ul>{{$t("monitor.car.wheelbase")}}</ul>
          <ul>{{$t("monitor.car.speedRatio")}}</ul>
          <ul>{{$t("monitor.car.f1Type")}}</ul>
          <ul>{{$t("monitor.car.f2Type")}}</ul>
          <ul>{{$t("monitor.car.b1Type")}}</ul>
          <ul>{{$t("monitor.car.b2Type")}}</ul>
        </li>
        <li class="max">
          <ul>{{carDetail.driveVender || $t("common.none")}}</ul>
          <ul>{{carDetail.gearbox|| $t("common.none")}}</ul>
          <ul>{{carDetail.wheelbase|| $t("common.none")}}</ul>
          <ul>{{carDetail.gearRatio|| $t("common.none")}}</ul>
          <ul>{{carDetail.frontAxleTypeOne|| $t("common.none")}}</ul>
          <ul>{{carDetail.frontAxleTypeTwo|| $t("common.none")}}</ul>
          <ul>{{carDetail.rearAxleTypeOne|| $t("common.none")}}</ul>
          <ul>{{carDetail.rearAxleTypeTwo|| $t("common.none")}}</ul>
        </li>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    carDetail: {
      type: Object,
      require:true
    }
  },
  data() {
    return {
 
    };
  }
};
</script>
<style lang="scss" scoped>
.chassisNum {
  font-size: 20px;
  font-weight: bold;
  vertical-align: text-bottom;
}
.el-card ::v-deep.el-card__body {
  padding: 10px;
}

.car-row-table {
  text-align: center;
  display: flex;
  li {
    // min-width: 200px;
    ul {
      height: 40px;
      // border-right: 0.5px solid #e6ebf5;
      border-bottom: 0.5px solid #e6ebf5;
      padding: 10px;
      &:last-child {
        border-bottom: none;
        // border-right: none;
      }
    }
  }
  .small {
    width: 200px !important;
    background: #ccc;
  }
  .max {
    min-width: 200px;
  }
}
</style>
