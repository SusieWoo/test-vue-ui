<template>
  <div class="record">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-select v-model="filters.groupType" @change="queryGroupModelList" >
          <el-option value="">{{$t('oil.groupTypeScreen')}}</el-option>
          <el-option
              v-for="item in rankTypeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
              />
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="filters.groupId" :disabled="!filters.groupType" @change="getSelect" >
          <el-option value="">{{$t('oil.groupRangeScreen')}}</el-option>
          <el-option
              v-for="item in groupList"
              :key="item.activityGroupId"
              :label="item.activityGroupName"
              :value="item.activityGroupId"/>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="filters.activityGroupId" @change="query(1)" :disabled="!filters.groupId">
          <el-option value="">{{$t('oil.loadRangeScreen')}}</el-option>
          <el-option
              v-for="item in selectList.loadGroupingList"
              :key="item.activityGroupId"
              :label="item.activityGroupName"
              :value="item.activityGroupId"/>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="filters.groupCarModelId" @change="query(1)" :disabled="!filters.groupId">
          <el-option value="">{{$t('oil.carRangeScreen')}}</el-option>
          <el-option
              v-for="item in selectList.activityGroupModelList"
              :key="item.id"
              :label="item.modelName"
              :value="item.id"/>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="filters.rewardFlag" @change="query(1)">
          <el-option value="">{{$t('oil.userRangeScreen')}}</el-option>
          <el-option
              v-for="item in userRankCheck"
              :key="item.key"
              :label="item.value"
              :value="item.key"/>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input :placeholder="$t('oil.activity')" v-model="filters.keyWord" class="input-with-select" clearable>
          <el-button slot="append" icon="el-icon-search" @click="query(1)"/>
        </el-input>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end" style="margin: 10px 0px;">
      <el-button type="primary" size="mini" :disabled="isDisabled" @click="query(1)">{{$t('common.research')}}</el-button>
      <el-button type="primary" size="mini" @click="seeInfos">{{$t('route.RecordDetail')}}</el-button>
      <el-button type="primary" size="mini" :disabled="isDisabled" @click="onPublish">{{$t('oil.release')}}</el-button>
      <el-button type="primary" size="mini" :disabled="isDisabled" @click="handleDownExcel">{{$t('common.export')}}</el-button>
    </el-row>
    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}">
        <el-table-column prop="groupTypeName" :label="$t('oil.groupType')"/>
        <el-table-column prop="groupName" :label="$t('oil.groupTypeName')"/>
        <el-table-column prop="loadGroupName" :label="$t('oil.loadRange')"/>
        <el-table-column prop="vin" :label="$t('business.vin')"/>
        <el-table-column prop="carRange" :label="$t('oil.carRange')"/>
        <el-table-column prop="phone" :label="$t('oil.userName')"/>
        <el-table-column prop="avgOilWearOfActivity" :label="$t('oil.averageFuel')" width="120"/>
        <el-table-column prop="totalMileage" :label="$t('oil.totalMileage')"/>
        <el-table-column prop="activityGroupName" :label="$t('oil.totalFuel')" width="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.totalOilWear" class="form-control" v-if="scope.row.isShow"/>
            <span v-if="!scope.row.isShow">{{scope.row.totalOilWear}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ranking" :label="$t('oil.currentRanking')"/>
        <el-table-column prop="likeCount" :label="$t('oil.refuelingValue')"/>
        <el-table-column :label="$t('common.operate')" width="200" v-if="activityStatus===3||activityStatus===4">
          <template slot-scope="scope">
            <el-button type="text" :disabled="editing||scope.row.stopFlag === '1'|| isDisabled" @click="stop(scope.row.activityId,scope.row.carId,scope.row.phone,scope.row.stopFlag)" v-if="!scope.row.isShow">{{scope.row.stopFlag === '1'?$t('oil.terminated'):$t('oil.activityEnd')}}</el-button>
            <el-button type="text" @click="editRule(scope.row)" v-if="!scope.row.isShow">{{$t('oil.editInfo')}}</el-button>
            <el-button type="text" @click="save(scope.row)" v-if="scope.row.isShow">{{$t('oil.saveInfo')}}</el-button>
            <el-button type="text" @click="cancel(scope.row)" v-if="scope.row.isShow">{{$t('oil.cancelEdit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="filters.page_number" :page-sizes="[10, 20, 30, 40]" :page-size="filters.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"/>
    <Export
        :iframe-filter="iframeFilter"
        @exportMethod="emailExcel"
    />
  </div>
</template>

<script>
  import Export from '@/components/Export'
  import { ActivityDeleteVin, queryActivityUserList, queryActivityDataGroupModelList, oilActivityRelease, editActivityCarTotalOilWearData } from '@/api/oil/oilService';
  export default {
    name: 'record',
    components: {
      Export
    },
    data () {
      return {
        params: '',
        groupList: [],
        selectList: '',
        isDisabled: false,
        editing: false,
        rankTypeList: [
          { key: '1' ,value: this.$t('oil.oilList') },
          { key: '2',value: this.$t('oil.reductionList') },
          { key: '3',value: this.$t('oil.crossList') }
        ],
        userRankCheck: [
          { key: '0', value: this.$t('oil.standardUsers') },
          { key: '1', value: this.$t('oil.endUsers') }
        ],
        activityStatus: '',
        tableData: [],
        total: 0,
        filters: {
          keyWord: '',
          activityId: '',
          rewardFlag: '0',
          groupType: '1',
          groupTypeName: this.$t('oil.oilList'),
          groupCarModelId: '',
          page_number: 1,
          page_size: 10,
          activityGroupId: ''
        },
        oldData: [],
        iframeFilter: {},
      }
    },
    mounted() {
      this.params = JSON.parse(this.$route.query.rowData)
      this.filters.activityId = this.params.activityId
      this.activityStatus = parseInt(this.params.activityStatus)
      this.queryGroupModelList()
    },
    methods: {
      // 活动数据列表
      async loadData () {
        this.filters.loadGroupId = this.filters.activityGroupId
        const res = await queryActivityUserList(this.filters);
        this.tableData = res.data.list
        this.tableData.forEach((item,index) => {
          item.isShow = false
          item.indx = index
        })
        this.oldData = JSON.parse(JSON.stringify(this.tableData))
        this.total = res.data.total
      },
      // 保存修改
      save (row) {
        let self = this
        self.$confirm(self.$t('oil.confirmData') + '？', self.$t('oil.modification'), {
          confirmButtonText: self.$t('common.confirm'),
          cancelButtonText: self.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          editActivityCarTotalOilWearData(row, self.filters.groupId).then(() => {
            self.editing = false
            self.$message.success(self.$t('oil.operationSuccessful'))
            self.waiting()
          })
        }).catch(() => {
        })
      },
      waiting () {
        let ss = 30
        this.isDisabled = true
        let timer = setInterval(function () {
          ss--
          if (ss > 0) {
            this.search = ss + 's'
          } else {
            this.search = this.$t('oil.research')
            this.isDisabled = false
            this.loadData()
            clearInterval(timer)
          }
        },1000)
      },
      cancel (row) {
        this.editing = false
        this.oldData[row.indx].isShow = false
        this.tableData = JSON.parse(JSON.stringify(this.oldData))
      },
      // 修改
      editRule (row) {
        if (row.stopFlag === '1') {
          this.$message.warning(this.$t('oil.InactiveActivity'))
          return false
        }
        //正在编辑。
        this.editing = true
        this.oldData[row.indx].isShow = true
        this.tableData = JSON.parse(JSON.stringify(this.oldData))
      },
      // 终止活动
      stop (activityId,carId,name) {
        let self = this
        self.$confirm(self.$t('oil.afterActivityKickOut'), self.$t('oil.activityEnd'), {
          confirmButtonText: self.$t('common.confirm'),
          cancelButtonText: self.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          ActivityDeleteVin(activityId, carId).then(() => {
            self.$message.success(self.$t('oil.operationSuccessful'))
            self.waiting()
          })
        }).catch(() => {
        })
      },
      // 查看获奖信息
      seeInfos () {
        this.$router.push({
          path: '/competition/detail',
          query: {
            infos: this.$route.query.rowData
          }
        })
      },
      // 列表筛选下拉
      async queryGroupModelList () {
        const res = await queryActivityDataGroupModelList(this.filters.activityId, this.filters.groupType)
        if (res && res.data && res.data.length > 0) {
          this.groupList = res.data
          this.filters.groupId = res.data[0].activityGroupId
          this.filters.groupTypeName = this.rankTypeList.filter((item) => {
            return item.key === this.filters.groupType
          })[0].value
          this.getSelect()
        } else {
          this.groupList = [];
          this.filters.groupId = '';
          this.filters.groupName = '';
          this.filters.groupTypeName = '';
          this.query(1)
        }
      },
      // 得到载重值和车型
      getSelect () {
        this.selectList = this.groupList.filter((item) => {
          return item.activityGroupId === this.filters.groupId
        })[0]
        if (this.selectList) {
          this.filters.groupName = this.selectList.activityGroupName
        } else {
          this.filters.groupName = ''
        }
        this.query(1)
      },
      // 搜索
      query (page) {
        if (this.isDisabled) {
          this.$message.warning(this.$t('oil.calculated'))
          return false
        }
        if (this.editing) {
          this.$message.warning(this.$t('oil.unsaved'))
          return false
        }
        this.filters.page_number = page
        this.loadData()
      },
      // 导出
      async emailExcel (email) {
        // await carTeamListExcel(Object.assign({ email: email }, this.filters))
        this.$message.success(this.$t('oil.exportEmail'));
      },
      handleDownExcel () {
        this.iframeFilter = {
          data: {
            isEmail: true
          }
        }
      },
      // 发布
      onPublish () {
        let self = this
        if (self.params.activateFlag === '0') {
          self.$message.warning(self.$t('oil.unablePublish'));
          return false;
        } else if (self.params.activityStatus === '5') {
          self.$message.warning(self.$t('oil.cannotPublished'));
          return false;
        }
        self.$confirm(self.$t('oil.cannotRevoked') + '？', self.$t('oil.confirmRelease'), {
          confirmButtonText: self.$t('oil.release'),
          cancelButtonText: self.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          oilActivityRelease(self.params.activityId).then(() => {
            self.$message.success(self.$t('oil.publishSuccess') + '！')
          })
        }).catch(() => {
        })
      },
      // 改变条数
      handleSizeChange (page) {
        this.filters.page_size = page
        this.loadData()
      },
      // 改变页数
      handleCurrentChange (page) {
        this.filters.page_number = page
        this.loadData()
      }
    }
  }
</script>

<style scoped lang="scss">
  .record {
    .el-pagination{
      text-align: right;
      margin-top: 10px;
    }
    ::v-deep .el-card__body{
      padding: 0 !important;
    }
  }
</style>