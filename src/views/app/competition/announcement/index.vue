<template>
  <div class="announcement">
    <el-row>
      <el-col :span="24" class="header">
        <el-input :placeholder="$t('oil.searchActivityName')" v-model="query.crossActivityName" class="input-with-select" clearable>
          <el-button slot="append" icon="el-icon-search" @click="search"/>
        </el-input>
        <el-button type="primary" @click="create">{{$t('oil.newGroup')}}</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="Data" :cell-style="{'text-align':'center'}" :header-cell-style="{'text-align':'center'}" border>
        <el-table-column prop="id" :label="$t('oil.listId')" />
        <el-table-column prop="crossName" :label="$t('oil.listName')" />
        <el-table-column :label="$t('oil.startTime')" prop="activityStartDate" width="160"/>
        <el-table-column :label="$t('oil.endTime')" prop="activityEndDate" width="160"/>
        <el-table-column prop="bannerTypeName" :label="$t('oil.currentState')">
          <template slot-scope="scope">
            {{scope.row.isAble === 1 ? $t('oil.enabled') : $t('oil.deactivated')}}
          </template>
        </el-table-column>
        <el-table-column prop="crossActivityList" :label="$t('oil.relatedAcitivity')">
          <template slot-scope="scope">
            <div v-for="item in scope.row.crossActivityList" :key="item.activityId">{{$t('oil.activityId') + ': ' + item.activityId}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('oil.createTime')" width="160"/>
        <el-table-column prop="operationUserName" :label="$t('oil.founder')" />
        <el-table-column fixed="right" :label="$t('oil.operation')" label-wdith="100">
          <template slot-scope="scope">
            <el-button type="text" @click="recall(scope.row, 'isAble')">{{scope.row.isAble === 1 ? $t('oil.unEnable') : $t('oil.enable')}}</el-button>
            <el-button type="text" @click="recall(scope.row, 'showStatus')">{{scope.row.isAble === 1 ? $t('oil.withdraw') : $t('oil.launch')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.page_number" :page-sizes="[10, 20, 30, 40]" :page-size="query.page_size" layout="total, sizes, prev, pager, next, jumper" :total="total"/>
    </el-row>
    <el-dialog :title="$t('oil.crossActivity')" :visible.sync="dialogFormVisible" class="dialog" :showClose="false">
      <el-form :model="forms" label-width="130px" :rules="rules" ref="ruleForm">
        <el-form-item :label="$t('oil.selectActivityId')" prop="list">
          <el-select v-model="forms.list" :placeholder="$t('common.select')" :multiple="true">
            <el-option :label="item.activityId" :value="item.activityId" v-for="item in idList" :key="item.activityId"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('oil.groupName')" prop="crossActivityName">
          <el-input v-model="forms.crossActivityName" autocomplete="off" style="width:220px;" :placeholder="$t('oil.selectListName')"/>
        </el-form-item>
        <el-form-item :label="$t('oil.finalAward')" prop="isFinalStepAward">
          <el-radio v-model="forms.isFinalStepAward" label="1">{{$t('common.yes')}}</el-radio>
          <el-radio v-model="forms.isFinalStepAward" label="0">{{$t('common.no')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('oil.schemeId')" v-if="forms.isFinalStepAward === '1'" prop="awardConfId">
          <el-select v-model="forms.awardConfId" :placeholder="$t('common.select')">
            <el-option :label="item" :value="item" v-for="item in configsList" :key="item"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="onSubmit">{{$t('common.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
  import { addCrossActivity, queryCrossActivityList, updCrossActivityStatus, queryEffectiveActivityList, queryCrossActivityPrizeConfList } from '@/api/oil/oilService';

  export default {
    name: 'announcement',
    data () {
      return {
        Data: [],
        total: 0,
        query: {
          crossActivityName: '',
          page_number: 1,
          page_size: 10,
        },
        dialogFormVisible: false,
        forms: {
          list: '',
          crossActivityName: '',
          isFinalStepAward: '1',
          awardConfId: ''
        },
        rules: {
          list: [
            { required: true, message: this.$t('oil.selectActivityId'), trigger: 'blur' }
          ],
          isFinalStepAward: [
            { required: true, message: this.$t('oil.selectFinalAward'), trigger: 'blur' }
          ],
          awardConfId: [
            { required: true, message: this.$t('oil.selectSchemeId'), trigger: 'blur' }
          ],
          crossActivityName: [
            { required: true, message: this.$t('oil.selectListName'), trigger: 'blur' }
          ]
        },
        idList: [],
        configsList: []
      };
    },
    mounted () {
      this.getList()
      this._getIds()
      this._getConfigs()
    },
    methods: {
      create () {
        this.dialogFormVisible = true
      },
      search () {
        this.query.page_number = 1
        this.getList()
      },
      recall (item,name) {
        let self = this
        let txt = ''
        let status = ''
        let type = ''
        if (name === 'showStatus') {
          txt = item[name] === 1 ? self.$t('oil.withdraw') : self.$t('oil.launch')
          status = item[name] === 1 ? 0 : 1
          type = 1
        } else {
          txt = item[name] === 1 ? self.$t('oil.unEnable') : self.$t('oil.enable')
          status = item[name] === 1 ? 0 : 1
          type = 2
        }
        self.$confirm(self.$t('oil.confirmation') + txt + '？', txt, {
          confirmButtonText: self.$t('common.confirm'),
          cancelButtonText: self.$t('common.cancel'),
          type: 'warning'
        }).then(() => {
          updCrossActivityStatus(type,item.id,status).then(() => {
            self.$message.success(self.$t('oil.operationSuccess'))
            self.getList()
          })
        }).catch(() => {
        });
      },
      handleCurrentChange (currentPage) {
        this.query.page_number = currentPage;
        this.getList();
      },
      handleSizeChange (pageSize) {
        this.query.page_size = pageSize;
        this.getList();
      },
      async getList () {
        const res = await queryCrossActivityList(this.query);
        this.Data = res.data.list;
        this.total = res.data.total;
      },
      onSubmit () {
        let self = this
        self.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            addCrossActivity(self.forms).then(() => {
              self.dialogFormVisible = false
              self.$message.success(self.$t('oil.addSuccess') + '!')
              self.getList()
            })
          }
        })
      },
      cancel () {
        this.$refs['ruleForm'].resetFields()
        this.dialogFormVisible = false
      },
      _getIds () {
        queryEffectiveActivityList(0).then((data) => {
          if (data) {
            this.idList = data.data
          }
        })
      },
      _getConfigs () {
        queryCrossActivityPrizeConfList().then((data) => {
          this.configsList = data.data
        })
      }
    },
  };
</script>
<style lang="scss" scoped>
  .announcement{
    .header{
      margin-bottom: 10px;
      text-align: right;
      .input-with-select {
        width: 200px;
        margin-right: 20px;
      }
    }
    .el-pagination {
      text-align: right;
      margin-top: 10px;
    }
  }
</style>