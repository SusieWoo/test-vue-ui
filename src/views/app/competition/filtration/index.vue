<template>
  <div class="filtration">
    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}">
        <el-table-column prop="activityGroupId" :label="$t('oil.groupId')"/>
        <el-table-column prop="activityGroupName" :label="$t('oil.groupName')" width="150"/>
        <el-table-column prop="name" :label="$t('oil.modelRange')" width="200">
          <template slot-scope="scope">
            <el-row v-for='g in scope.row.groupCarModelList' :key="g.id">{{g}}</el-row>
          </template>
        </el-table-column>
        <el-table-column prop="groupType" :label="$t('common.type')"/>
        <el-table-column prop="name" :label="$t('route.oilSet')" width="120">
          <template slot-scope="scope">
            <el-row>{{$t('oil.registrationAward')}}：{{scope.row.awardRule ? scope.row.awardRule.registrationAwards : ''}}</el-row>
            <el-row>{{$t('oil.ultimateRewards')}}：{{scope.row.awardRule ? scope.row.awardRule.finalAward : ''}}</el-row>
          </template>
        </el-table-column>
        <el-table-column prop="createDate" :label="$t('oil.createTime')" width="140"/>
        <el-table-column prop="userName" :label="$t('oil.founder')" width="100"/>
        <el-table-column :label="$t('oil.operation')" width="200">
          <template slot-scope="scope">
            <el-button type="text" @click="editGroup(scope.row)">{{$t('oil.editGroup')}}</el-button>
            <el-button type="text" @click="editRule(scope.row)">{{$t('oil.editRules')}}</el-button>
            <el-button type="text" @click="editAward(scope.row)">{{$t('oil.editAwards')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="filters.page_number" :page-sizes="[10, 20, 30, 40]" :page-size="filters.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"/>
    <el-dialog :title="$t('oil.addGroup')" class="" :visible.sync="isShow" width="50%" :showClose="false" :append-to-body="true" :lock-scroll="false" :close-on-click-modal="false">
      <el-form :model="cars" :rules="carRules" class="events">
        <el-row>
          <el-col>
            <el-form-item :label="$t('oil.groupName')" prop="crossActivityName" label-width="50px">
              <el-input type="text" v-model="cars.crossActivityName"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item prop="carSeries">
              <el-select v-model="cars.carSeries" :placeholder="$t('oil.vehicle')"  @change="getSelectCarTypeData">
                <el-option :label="item" :value="item" v-for="(item, index) in carSeriesList" :key="index"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="carType">
              <el-select @change="getSelectCarDriveFromData" v-model="cars.carType" :placeholder="$t('oil.category')" :disabled="!(cars.carSeries && carTypeList && carTypeList.length)">
                <el-option :label="item" :value="item" v-for="(item, index) in carTypeList" :key="index"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="carDriveFrom">
              <el-select @change="getSelectCarPsFromData" v-model="cars.carDriveFrom" :placeholder="$t('oil.driving')" :disabled="!(cars.carType && carDriveFromList && carDriveFromList.length)">
                <el-option :label="item" :value="item" v-for="(item, index) in carDriveFromList" :key="index"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="ps">
              <el-select v-model="cars.ps" :placeholder="$t('oil.horsepower')" :disabled="!(cars.carDriveFrom && horsePowerList && horsePowerList.length)">
                <el-option :label="item" :value="item" v-for="(item, index) in horsePowerList" :key="index"/>
              </el-select>
            </el-form-item>
          </el-col>
          <!--<el-col :span="4">-->
          <!--<el-button type="primary" @click="addAllowModel" :disabled="!(cars.carDriveFrom && cars.ps && cars.carType && cars.carSeries)">{{$t('oil.addGroup')}}</el-button>-->
          <!--</el-col>-->
        </el-row>
      </el-form>
      <el-row type="flex" justify="center" v-for="(item,index) in models" :key="index" style="margin-bottom: 10px;" class="events">
        <el-col :span="20" style="padding-left:20px;">{{item}}</el-col>
        <el-col :span="4">
          <el-button type="danger" circle sizi="mini" class="reduce" @click="remove(index)">-</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top:20px;">
        <el-button @click="cancelGroup">{{$t('common.cancel')}}</el-button>
        <!--<el-button type="primary" @click="submitGroup">{{$t('common.confirm')}}</el-button>-->
      </el-row>
    </el-dialog>
    <el-dialog :title="$t('oil.setAwardRule')" class="" :visible.sync="isAwards" width="40%" :showClose="false" :append-to-body="true" :lock-scroll="false" :close-on-click-modal="false">
      <el-form :model="awards" :rules="awardRules" ref="awardForm" label-width="120px" class="demo-ruleForm events">
<!--        <el-form-item :label="$t('oil.grouping')" prop="groupName">-->
<!--          <el-input type="text" v-model="awards.groupName"/>-->
<!--        </el-form-item>-->
        <el-form-item :label="$t('oil.anyAward')" prop="registrationAwardsFlag">
          <el-radio v-model="awards.registrationAwardsFlag" label="1">{{$t('common.yes')}}</el-radio>
          <el-radio v-model="awards.registrationAwardsFlag" label="0">{{$t('common.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('oil.schemeId')" prop="registrationAwards.confId" v-if="awards.registrationAwardsFlag === '1'">
          <el-input type="text" v-model="awards.registrationAwards.confId"/>
        </el-form-item>
        <el-form-item :label="$t('oil.stageAward')" prop="stepsAwardFlag">
          <el-radio v-model="awards.stepsAwardFlag" label="1">{{$t('common.yes')}}</el-radio>
          <el-radio v-model="awards.stepsAwardFlag" label="0">{{$t('common.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('oil.schemeId')" prop="stepsAward.confId" v-if="awards.stepsAwardFlag === '1'">
          <el-input type="text" v-model="awards.stepsAward.confId"/>
        </el-form-item>
        <el-form-item :label="$t('oil.times')" prop="stepsAward.drawNum" v-if="awards.stepsAwardFlag === '1'">
          <el-input type="text" v-model="awards.stepsAward.confId"/>
        </el-form-item>
        <el-form-item :label="$t('oil.intervalTime')" prop="stepsAward.intervals" v-if="awards.stepsAwardFlag === '1'">
          <el-input type="text" v-model="awards.stepsAward.intervals"/>
        </el-form-item>
        <el-form-item :label="$t('oil.finalAward')" prop="finalAwardFlag">
          <el-radio v-model="awards.finalAwardFlag" label="1">{{$t('common.yes')}}</el-radio>
          <el-radio v-model="awards.finalAwardFlag" label="0">{{$t('common.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('oil.schemeId')" prop="finalAward.confId" v-if="awards.finalAwardFlag === '1'">
          <el-input type="text" v-model="awards.finalAward.confId"/>
        </el-form-item>
        <el-form-item :label="$t('oil.times')" prop="finalAward.drawNum" v-if="awards.finalAwardFlag === '1'">
          <el-input type="text" v-model="awards.finalAward.confId"/>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" style="margin-top: 20px;">
        <el-button @click="isAwards = false">{{$t('common.cancel')}}</el-button>
        <!--<el-button type="primary" @click="submitAward">{{$t('common.confirm')}}</el-button>-->
      </el-row>
    </el-dialog>
    <el-dialog :title="$t('oil.setRules')" class="" :visible.sync="isRank" width="62%" :showClose="false" :append-to-body="true" :lock-scroll="false" :close-on-click-modal="false">
      <el-form :model="ranks" :rules="rankRules" ref="rankForm" label-width="175px" class="ranks events">
        <el-form-item :label="$t('oil.selectType')" prop="groupType">
          <el-select v-model="ranks.groupType" :placeholder="$t('common.placeSelect')" @change="changeGroupType">
            <el-option :label="item.value" :value="item.key" v-for="item in rankTypeList" :key="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('oil.lowest')" prop="groupMileage">
          <el-input type="text" v-model="ranks.groupMileage" style="width:220px"/>
        </el-form-item>
        <el-form-item :label="$t('oil.daily')" prop="groupMinMileage">
          <el-input type="text" v-model="ranks.groupMinMileage" style="width:220px"/>
        </el-form-item>
        <el-form-item :label="$t('oil.finalRanking')" class="filter enroll" v-if="ranks && ranks.finalRankingOilWearFilterList && ranks.finalRankingOilWearFilterList.length > 0">
          <el-row type="flex" justify="start"  v-for="(items,index) in ranks.finalRankingOilWearFilterList" :key="index" style="width:100%;margin-bottom:10px;margin-left:20px;" :gutter="10">
            <el-col>{{index + 1}}.{{index === 0 ? $t('oil.if'):$t('oil.or')}}{{$t('oil.mileage')}}≥</el-col>
            <el-col>
              <el-input type="text" v-model="items.mileageThreshold"/>
            </el-col>
            <el-col :span="8">
              ,{{$t('oil.need')}}
            </el-col>
            <el-col>
              <el-input type="text" v-model="items.maxValue"/>
            </el-col>
            <el-col>
              ＞{{$t('oil.oilConsumption')}}≥
            </el-col>
            <el-col>
              <el-input type="text" v-model="items.minValue"/>
            </el-col>
            <el-col>
              <el-button @click="add(ranks.finalRankingOilWearFilterList)" v-if="items.mileageThreshold && items.maxValue && items.minValue && ranks.finalRankingOilWearFilterList.length < 10" circle size="mini">+</el-button>
              <el-button @click="remove(index, ranks.finalRankingOilWearFilterList)" v-if="ranks.finalRankingOilWearFilterList.length > 1" circle size="mini">-</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('oil.setGroup')" prop="groupByLoad" class="enroll">
          <el-radio v-model="ranks.groupByLoad" label="1">{{$t('common.yes')}}</el-radio>
          <el-radio v-model="ranks.groupByLoad" label="0">{{$t('common.no')}}</el-radio>
        </el-form-item>
        <el-form-item class="filter enroll" v-if="ranks.groupByLoad === '1' && ranks.loadGroupingList && ranks && ranks.loadGroupingList.length > 0">
          <el-row v-for="(item,index) in ranks.loadGroupingList" :key="index" style="width:100%" :gutter="10">
            <el-row type="flex" justify="start" style="padding-left: 20px;" :gutter="0">
              <el-col :span="22">
                {{index + 1 + '. '}}&nbsp;<el-input type="text" v-model="item.groupName"/>
              </el-col>
              <el-col :span="20">
                <el-input type="text" v-model="item.maxTkm"/>
              </el-col>
              <el-col :span="10">
                >t/km≥
              </el-col>
              <el-col :span="20">
                <el-input type="text" v-model="item.minTkm"/>
              </el-col>
              <el-col>
                <el-button @click="add(ranks.loadGroupingList)" v-if="addGroup(item)" circle size="mini">+</el-button>
                <el-button @click="remove(index,ranks.loadGroupingList)" v-if="ranks.loadGroupingList.length > 1" circle size="mini">-</el-button>
              </el-col>
            </el-row>
            <el-row style="padding-left: 20px;margin-top: 10px;"><span class="final">*</span>{{$t('oil.finalFilter')}}</el-row>
            <div v-if="item && item.list && item.list.length > 0">
              <el-row v-for="(loadItem,index) in item.list" :key="index" style="width:100%;margin:10px 0px;padding-left:40px;" :gutter="10" type="flex" justify="start">
                <el-col>{{index + 1}}.{{index === 0 ? $t('oil.if'):$t('oil.or')}}{{$t('oil.mileage')}}≥</el-col>
                <el-col>
                  <el-input type="text" v-model="loadItem.mileageThreshold"/>
                </el-col>
                <el-col :span="8">
                  ，{{$t('oil.need')}}
                </el-col>
                <el-col>
                  <el-input type="text" v-model="loadItem.maxValue"/>
                </el-col>
                <el-col>
                  ＞{{$t('oil.oilConsumption')}}≥
                </el-col>
                <el-col>
                  <el-input type="text" v-model="loadItem.minValue"/>
                </el-col>
                <el-col>
                  <el-button @click="add(item.list)" v-if="loadItem.mileageThreshold && loadItem.maxValue && loadItem.minValue && item.list.length < 10" circle size="mini">+</el-button>
                  <el-button @click="remove(index,item.list)" v-if="item.list.length > 1" circle size="mini">-</el-button>
                </el-col>
              </el-row>
            </div>
          </el-row>
        </el-form-item>
        <el-form-item :label="$t('oil.fuelConsumption')" class="filter enroll" v-if="ranks.groupType !=='2' && ranks.selfOilWearThresholdList">
          <el-row v-for="(item,index) in ranks.selfOilWearThresholdList" :key="index" style="width:100%;padding-left: 20px;margin-bottom: 10px;" :gutter="10" type="flex" justify="start">
            <el-col>{{index + 1}}.{{index === 0 ? $t('oil.if'):$t('oil.or')}}{{$t('oil.mileage')}}≥</el-col>
            <el-col>
              <el-input type="text" v-model="item.mileageThreshold"/>
            </el-col>
            <el-col :span="8">
              ，{{$t('oil.need')}}
            </el-col>
            <el-col>
              <el-input type="text" v-model="item.maxValue"/>
            </el-col>
            <el-col>
              ＞{{$t('oil.oilConsumption')}}≥
            </el-col>
            <el-col>
              <el-input type="text" v-model="item.minValue"/>
            </el-col>
            <el-col>
              <el-button @click="add(ranks.selfOilWearThresholdList)" v-if="item.mileageThreshold && item.maxValue && item.minValue && ranks.selfOilWearThresholdList.length < 10" circle size="mini">+</el-button>
              <el-button @click="remove(index,ranks.selfOilWearThresholdList)" v-if="ranks.selfOilWearThresholdList.length > 1" circle size="mini">-</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="enroll" :label="$t('oil.percentageRange')" v-if="ranks.groupType ==='2' && ranks.selfOilWearPer">
          <el-row :gutter="20" type="flex" justify="start">
            <el-col :span="4">
              <el-input type="text" v-model="ranks.selfOilWearPer.maxValue"/>
            </el-col>
            <el-col :span="4" style="text-align:center;">
              ＞{{$t('oil.percentage')}}＞
            </el-col>
            <el-col :span="4">
              <el-input type="text" v-model="ranks.selfOilWearPer.minValue"/>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form >
      <el-row type="flex" justify="center" style="margin-top: 20px;">
        <el-button @click="isRank = false">{{$t('common.cancel')}}</el-button>
<!--        <el-button type="primary" @click="isRank = false">{{$t('common.confirm')}}</el-button>-->
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import { queryActivityFilterRuleList, carModelDataDict, queryOilActivityGroupPrizeRuleDetail, queryOilActivityGroupRankRuleDetail } from '@/api/oil/oilService';
  export default {
    name: 'filtration',
    data () {
      return {
        isShow: false,
        isAwards: false,
        isRank: false,
        filters: {
          page_number: 1,
          page_size: 10,
          activityId: ''
        },
        total: 0,
        tableData: [],
        cars: {
          carSeries: '',
          carType: '',
          carDriveFrom: '',
          ps: '',
          crossActivityName: ''
        },
        carSeriesList: [],
        carTypeList: [],
        carDriveFromList: [],
        horsePowerList: [],
        models: [],
        carRules: {
          crossActivityName: [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
          carSeries: [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
          carType: [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
          carDriveFrom: [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
          ps: [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ]
        },
        awards: {
          groupName: '',
          registrationAwardsFlag: '',
          registrationAwards: {
            confId: ''
          },
          stepsAwardFlag: '',
          stepsAward: {
            confId: '',
            drawNum: '',
            intervals: ''
          },
          finalAwardFlag: '',
          finalAward: {
            confId: '',
            drawNum: ''
          }
        },
        awardRules: {
          groupName: [
            { required: true, message: this.$t('oil.required'), trigger: 'blur' }
          ],
          'registrationAwards.confId': [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
          'stepsAward.confId': [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
          'stepsAward.drawNum': [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
          'stepsAward.intervals': [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
          'finalAward.confId': [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
          'finalAward.drawNum': [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ]
        },
        rankTypeList: [
          { key: '1' , value: '油耗榜' },
          { key: '2', value: '降幅榜' },
          { key: '3', value: '跨幅榜' }
        ],
        ranks: {
          groupType: '',
          groupMileage: '',
          groupMinMileage: '',
          finalRankingOilWearFilterList: [{}],
          selfOilWearPer: {
            maxValue: '',
            minValue: ''
          },
          selfOilWearThresholdList: [{}],
          groupByLoad: '',
          loadGroupingList: [{
            list: [{}]
          }]
        },
        rankRules: {
          groupType: [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
          groupMileage: [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
          groupMinMileage: [
            { required: true, message: this.$t('oil.required'), trigger: 'change' }
          ],
        }
      }
    },
    mounted() {
      this.filters.activityId = this.$route.query.activityId
      this.getLoadData()
    },
    methods: {
      editAward(row) {
        this.getAwardDetail(row)
        this.isAwards = true
      },
      getAwardDetail(row) {
        queryOilActivityGroupPrizeRuleDetail(row).then((data) => {
         this.awards = data.data
          if (this.awards.finalAwardFlag === '0' && !this.awards.finalAward) {
            this.awards.finalAward = [{
              confId: '',
              drawNum: ''
            }]
          }
          if (this.awards.registrationAwardsFlag === '0' && !this.awards.registrationAwards) {
            this.awards.registrationAwards = [{
              confId: ''
            }]
          }
          if (this.awards.stepsAwardFlag === '0' && !this.awards.stepsAward) {
            this.awards.stepsAward = [{
              confId: '',
              drawNum: '',
              intervals: ''
            }]
          }
        })
      },
      submitAward() {
      },
      editGroup(row) {
        this.getSelectCarSeriesData()
        this.models = row.groupCarModelList
        this.cars.crossActivityName = row.activityGroupName
        this.isShow = true
      },
      cancelGroup() {
        this.isShow = false
      },
      submitGroup() {
        if (this.models.length === 0) {
          this.$message.warning('请添加车辆！')
          return false
        }
      },
      editRule(row) {
        this.isRank = true
        this.getRuleDetail(row)
      },
      changeGroupType() {
        if (this.ranks.groupType === '2' && !this.ranks.selfOilWearThresholdList) {
          this.ranks.selfOilWearThresholdList = [{}]
        }
      },
      getRuleDetail(row) {
        let self = this
        queryOilActivityGroupRankRuleDetail(row).then((data) => {
          self.ranks = data.data
        })
      },
      getLoadData() {
        let self = this
        queryActivityFilterRuleList(this.filters).then((data) => {
          self.tableData = data.data.list
          self.total = data.data.total
        })
      },
      add(array) {
        array.push({})
      },
      remove(index, array) {
        array.splice(index,1)
      },
      addGroup (item) {
        let sef = (item.groupName && item.maxTkm && item.minTkm && this.ranks.loadGroupingList.length < 10)
        let child = true;
        for (let i = 0; i < item.list.length; i++) {
          let obj = item.list[i];
          if (!obj.mileageThreshold || !obj.maxValue || !obj.minValue) {
            child = false;
            break
          }
        }
        return sef && child
      },
      handleCurrentChange (currentPage) {
        this.filters.page_number = currentPage;
        this.getLoadData();
      },
      handleSizeChange (pageSize) {
        this.filters.page_size = pageSize;
        this.getLoadData();
      },
      // 级联初始查车系
      getSelectCarSeriesData() {
        let self = this
        carModelDataDict()
            .then(function (data) {
              self.carSeriesList = data.data.carSeriesNameList
            })
      },
      // 级联查车辆大类
      getSelectCarTypeData() {
        let self = this
        self.cars.carType = ''
        self.cars.carDriveFrom = ''
        self.cars.ps = ''
        carModelDataDict({ carSeries: self.cars.carSeries })
            .then(function (data) {
              self.carTypeList = data.data.carTypeList
            })
      },
      //级联查驱动形式
      getSelectCarDriveFromData() {
        let self = this
        self.cars.carDriveFrom = ''
        self.cars.ps = ''
        carModelDataDict({ carSeries: self.cars.carSeries, carType: self.cars.carType })
            .then(function (data) {
              self.carDriveFromList = data.data.carDriveFromList;
            })
      },
      // 级联查马力
      getSelectCarPsFromData() {
        let self = this
        self.cars.ps = ''
        carModelDataDict({ carSeries: self.cars.carSeries, carType: self.cars.carType, carDriveFrom: self.cars.carDriveFrom })
            .then(function (data) {
              self.horsePowerList = data.data.horsePowerList;
            })
      },
      // 添加允许参与活动的车型
      addAllowModel() {
        if (!this.cars.carSeries || !this.cars.carDriveFrom || !this.cars.ps) {
          return false
        }
        let text = this.cars.carSeries + '  ' + this.cars.carType + '  ' + this.cars.ps + 'Ps  ' + this.cars.carDriveFrom
        this.models.push(text)
      },
      // 删除允许参与活动的车型
      remove(index, c) {
        this.models.splice(index, 1)
      }
    }
  }
</script>

<style scoped lang="scss">
  .filtration{
    .el-pagination{
      text-align:right;
      margin-top: 10px;
    }
  }
  ::v-deep .enroll{
    .el-form-item__label:before{
      content: "*";
      color: #ff4949;
      margin-right: 4px;
    }
    .final{
      color: #ff4949;
      margin-right: 4px;
    }
  }
  ::v-deep .filter{
    display: flex;
    flex-direction: column;
    .el-form-item__content {
      margin-left: 0px !important;
    }
    .el-input{
      width: 120px;
    }
  }
  ::v-deep .ranks {
    .el-form-item__label {
      text-align: left;
    }
  }
  ::v-deep .reduce{
    width: 10px;
    height: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .events{
    pointer-events: none;
  }
</style>