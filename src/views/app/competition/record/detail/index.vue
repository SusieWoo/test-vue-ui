<template>
  <div class="recordDetail">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-select v-model="filters.groupType" @change="queryGroupModelList" >
          <el-option value="">{{$t('oil.groupType')}}</el-option>
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
        <el-select v-model="filters.prizeType" @change="query(1)">
          <el-option
              v-for="item in awardLevelCheck"
              :key="item.key"
              :label="item.value"
              :value="item.key"/>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="filters.infoType" @change="query(1)">
          <el-option
              v-for="item in userInfoCheck"
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
      <el-button type="primary" size="mini" @click="handleDownExcel">{{$t('common.export')}}</el-button>
      <el-button type="primary" size="mini" @click="query(1)">{{$t('common.research')}}</el-button>
    </el-row>
    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}">
        <el-table-column prop="groupName" :label="$t('oil.group')"/>
        <el-table-column prop="vin" :label="$t('business.vin')"/>
        <el-table-column prop="groupCarModel" :label="$t('oil.modelRange')"/>
        <el-table-column prop="userName" :label="$t('oil.userName')"/>
        <el-table-column prop="registrationAwards" :label="$t('oil.enrollPrizes')"/>
          <el-table-column prop="stepsAward" :label="$t('oil.phasePrizes')"/>
        <el-table-column prop="finalAward" :label="$t('oil.finalPrizes')"/>
        <el-table-column prop="awardName" :label="$t('oil.prizeName')"/>
        <el-table-column prop="activityGroupName" :label="$t('oil.idInfo')" wdith="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.idCard" class="form-control" v-if="scope.row.isShow"/>
            <span v-if="!scope.row.isShow">{{scope.row.idCard}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="activityGroupName" :label="$t('business.dealer.contactPerson')" wdith="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.consignee" class="form-control" v-if="scope.row.isShow"/>
            <span v-if="!scope.row.isShow">{{scope.row.consignee}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="activityGroupName" :label="$t('oil.address')" wdith="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.address" class="form-control" v-if="scope.row.isShow"/>
            <span v-if="!scope.row.isShow">{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="activityGroupName" :label="$t('business.dealer.contactPhone')" wdith="80">
          <template slot-scope="scope">
            <el-input v-model="scope.row.phone" class="form-control" v-if="scope.row.isShow"/>
            <span v-if="!scope.row.isShow">{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" :label="$t('oil.updateTime')"/>
        <el-table-column :label="$t('oil.operation')" width="200" v-if="activityStatus===3||activityStatus===4">
          <template slot-scope="scope">
            <el-button type="text" @click="editRule(scope.row)" v-if="!scope.row.isShow">{{$t('oil.editInfo')}}</el-button>
            <el-button type="text" @click="save(scope.row)" v-if="scope.row.isShow">{{$t('oil.saveInfo')}}</el-button>
            <el-button type="text" @click="cancel(scope.row)" v-if="scope.row.isShow">{{$t('oil.cancelEdit')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <Export
        :iframe-filter="iframeFilter"
        @exportMethod="emailExcel"
    />
  </div>
</template>

<script>
  import { queryRewardInformationList, queryActivityDataGroupModelList, editActivityCar, carTeamListExcel } from '@/api/oil/oilService'
  import Export from '@/components/Export'
  export default {
    name: 'recordDetail',
    components: {
      Export
    },
    data () {
      return {
        iframeFilter: {},
        oilInfo: {},
        activityStatus: 3,
        tableData: [],
        total: 0,
        editing: false,
        groupList: [],
        selectList: [],
        filters: {
          keyWord: '',
          activityId: '',
          rewardFlag: '0',
          groupType: '1',
          groupTypeName: this.$t('oil.oilList'),
          page_number: 1,
          page_size: 10,
          prizeType: '',
          infoType: ''
        },
        userInfoCheck: [
          { key: '', value: this.$t('oil.userInfoScreen') },
          { key: '1', value: this.$t('oil.addedInformation') },
          { key: '2', value: this.$t('oil.noInformation') }
        ],
        awardLevelCheck: [
          { key: '', value: this.$t('oil.awardStageScreen') },
          { key: '1', value: this.$t('oil.signAwards') },
          { key: '2', value: this.$t('oil.stepAwards') },
          { key: '3', value: this.$t('oil.finaledAward') }
        ],
        rankTypeList: [
          { key: '1' ,value: this.$t('oil.oilList') },
          { key: '2',value: this.$t('oil.reductionList') },
          { key: '3',value: this.$t('oil.crossList') }
        ]
      }
    },
    mounted () {
      this.oilInfo = this.$route.query.infos
      this.filters.activityId = this.oilInfo.activityId
      this.activityStatus = parseInt(this.oilInfo.activityStatus)
      this.queryGroupModelList()
    },
    methods: {
      async emailExcel (email) {
        await carTeamListExcel(Object.assign({ email: email }, this.filters))
        this.$message.success(this.$t('oil.exportEmail'));
      },
      handleDownExcel () {
        this.iframeFilter = {
          data: {
            isEmail: true
          }
        }
      },
      editRule (row) {
        this.editing = true
        this.oldData[row.indx].isShow = true
        this.tableData = JSON.parse(JSON.stringify(this.oldData))
      },
      getExecl () {},
      query (page) {
        if (this.editing) {
          this.$message.warning(this.$t('oil.unsaved'));
          return false;
        }
        this.filters.page_number = page;
        this.loadData();
      },
      async loadData () {
        this.filters.loadGroupId = this.filters.activityGroupId
        const res = await queryRewardInformationList(this.filters);
        this.tableData = res.data.list
        this.tableData.forEach((item,index) => {
          item.isShow = false
          item.indx = index
        })
        this.oldData = JSON.parse(JSON.stringify(this.tableData))
        this.total = res.data.total
      },
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
      save (row) {
        let self = this
        self.$confirm(self.$t('oil.confirmData') + '？', self.$t('oil.modification'), {
          confirmButtonText: self.$t('common.confirm'),
          cancelButtonText: self.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          editActivityCar(row, self.filters.groupId).then(() => {
            self.editing = false
            self.$message.success(self.$t('oil.operationSuccess') + '!')
            self.loadData()
          })
        }).catch(() => {
        })
      },
      cancel (row) {
        this.editing = false
        this.oldData[row.indx].isShow = false
        this.tableData = JSON.parse(JSON.stringify(this.oldData))
      }
    }
  }
</script>

<style scoped lang="scss">
  .recordDetail {
    ::v-deep .el-card__body{
      padding: 0 !important;
    }
  }
</style>
