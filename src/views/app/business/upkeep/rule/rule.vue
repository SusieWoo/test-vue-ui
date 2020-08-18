<template>
    <div>
    <!-- tab切换 start-->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-loading.fullscreen.lock="fullscreenLoading">
        <el-tab-pane :label="$t('business.upkeep.basicMaintenance')" name="0">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
                <el-form-item v-for="(item,index) in getParseList" :key="index">
                    <h3 class="title-header">{{item.maintainName}}</h3>
                    <el-table
                            :data="item.maintainItemName"
                            height="150"
                            border
                            style="width: 80%"
                            :show-header="hiddenTableHeader">
                        <el-table-column
                                prop="category"
                                align="center">
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-row :gutter="20">
                    <el-col :span="12"
                            :offset="3">
                        <el-form-item :label="$t('business.upkeep.firstMileage')" prop="firstMileage" label-width="120px">
                            <el-input v-model="ruleForm.firstMileage" name="firstMileage"
                                      clearable>
                                <template slot="append">{{$t('common.kilometre')}}</template>
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('business.upkeep.circleMileage')" prop="circleMileage" label-width="120px">
                            <el-input v-model="ruleForm.circleMileage" name="circleMileage"
                                      clearable>
                                <template slot="prepend">{{$t('business.upkeep.firstGuaranteeAfter')}}</template>
                                <template slot="append">{{$t('common.kilometre')}}</template>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <h3 class="title-header">{{$t('business.upkeep.pushEndTime')}}</h3>
                <el-row :gutter="20">
                    <el-col :span="12"
                            :offset="3">
                        <el-form-item :label="$t('business.upkeep.AAKAfter')" prop="pushEndTime" label-width="100px">
                            <el-input v-model="ruleForm.pushEndTime" name="pushEndTime"
                                      clearable>
                                <template slot="append">{{$t('common.days')}}</template>
                            </el-input>
                        </el-form-item>
                        <el-button type="primary"
                                   @click="submitForm('ruleForm')">
                            {{$t('message.yesSave')}}
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-tab-pane>
        <!-- 其他tabstart-->
        <el-tab-pane v-for="item in tabsLists"
                     :key="item.value"
                     :label="item.name"
                     :name="item.value.toString()">
            <!-- 查询表单start-->
            <el-row :gutter="20">
                <el-col :span="24"
                        class="filter-header mb5">
                    <el-form :inline="true"
                             :model="query">
                        <el-col :span="18">
                            <el-form-item>
                                <el-input
                                        :placeholder="$t('business.bitem')"
                                        prefix-icon="el-icon-search"
                                        v-model="query.keyword">
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary"
                                           @click="getList()">
                                    {{$t('common.search')}}
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary"
                                           @click="onEdit(1)">
                                    {{$t('common.add')}}
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary"
                                           @click="onImport()">
                                    {{$t('common.import')}}
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </el-col>
            </el-row>
            <!-- 查询表单end-->

            <!-- 表格start-->
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        prop="maintainItemName"
                        :label="$t('business.upkeep.maintenanceItems')"
                        align="center">
                </el-table-column>
                <el-table-column
                        :label="$t('common.operate')"
                        align="center">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   @click="onEdit(2,scope.row)">
                            {{$t('common.edit')}}
                        </el-button>
                        <el-button type="text"
                                   @click="del(scope.row.maintainItemId)">
                            {{$t('common.del')}}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 表格end-->
            <!-- 分页start -->
            <pagination
                    v-show="total>0"
                    :total="total"
                    :page.sync="query.page_number"
                    :limit.sync="query.page_size"
                    @pagination="getList"
            />
            <!-- 分页 end -->
        </el-tab-pane>
    </el-tabs>
    <!-- tab切换 end-->
    <!-- 弹窗start -->
    <el-dialog :title="dialogData.title" :visible.sync="bindDialogVisible" width="50%" :append-to-body="true">
        <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules">
            <el-form-item :label="tabName" prop="maintainItemName" label-width="120px">
                <el-input v-model="dialogForm.maintainItemName" name="maintainItemName"
                          type="textarea" :rows="3" style="width: 95%" clearable>
                </el-input>
            </el-form-item>
            <el-row :gutter="20">
                <el-col :span="12"
                        :offset="8">
                    <el-form-item>
                        <el-button type="primary"
                                   @click="submitDialogForm('dialogForm')">
                            {{$t('common.confirm')}}
                        </el-button>
                        <el-button @click="resetForm()">{{$t('common.cancel')}}</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-dialog>
    <!-- 弹窗 end-->
    <my-dialog
        :title="this.$t('business.upkeep.maintenanceImport')"
        :batchAddCarVis.sync="batchAddCarVis"
        :limit="limit"
        :action="action"
        :accept="accept"
        :tip="tip"
        :tips="uploadTips"
        :demoURL="demoURL"
        @handleSuccess = "handleSuccess"
    ></my-dialog>
    </div>
</template>

<script>
import {
    queryDataDict,
    queryMaintainSet,
    maintainSet,
    getMaintainItemList,
    editMaintainItem,
    importMaintainItem,
    delMaintainItem
} from "@/api/business/businessService";
import { Num } from '@/utils/rules';
import pagination from "@/components/pagination";
import MyDialog from './import';
export default {
    name: "rule",
    components: {
        pagination,
        MyDialog
    },
    data() {
        return {
            activeName: '0',
            tabsLists: '',
            basicsList: [],
            tableData: [],
            hiddenTableHeader: false,
            fullscreenLoading: true,
            bindDialogVisible: false,
            dialogData: {},
            tabName: '',
            tabValue: '',
            total: 0,
            batchAddCarVis: false,
            demoURL: 'http://sy.aerozhonghuan.com:81/test/yiqi/web/qdfaw/tboss/assets/import/addUpkeep.xlsx',
            tip: this.$t('message.importWarn'),//上传最大数量提示
            accept: '.xlsx,.xls',//接受上传的文件类型
            action: process.env.VUE_APP_UPLOAD_FILE_API,//upload地址
            limit: 1,
            uploadTips: [],//错误信息列表
            batchAddInfo: null,
            query: {
                maintainItemCode: '',
                page_number: 1,
                page_size: 10,
                keyword: ''
            },
            ruleForm: {
                pushEndTime: '',
                circleMileage: '',
                firstMileage: ''
            },
            rules: {
                firstMileage: [
                    { required: true, message: this.$t('business.upkeep.machineFirstWarn'), trigger: 'blur' },
                    { validator: Num, trigger: 'change' }
                ],
                circleMileage: [
                    { required: true, message: this.$t('business.upkeep.machineCircleWarn'), trigger: 'blur' },
                    { validator: Num, trigger: 'change' }
                ],
                pushEndTime: [
                    { required: true, message: this.$t('business.upkeep.daysWarn'), trigger: 'change' },
                    { validator: Num, trigger: 'change' }
                ],
            },
            dialogForm: {
                maintainItemName: '',
                maintainItemId: ''
            },
            dialogRules: {
                maintainItemName:[
                    { required: true, message: this.$t('business.upkeep.required'), trigger: 'blur' }
                ],
            },

        };
    },
    computed: {
        getParseList () {
            return this.basicsList.map(item => {
                item.maintainItemName  = item.maintainItemName.map(v => {
                    return {
                        category: v
                    }
                })
                this.fullscreenLoading = false
                return item
            })
        }
    },
    mounted() {
        this.getTabsList();
        this.getBasicsList();
    },
    methods: {
        async getTabsList() {
            const res = await queryDataDict();
            this.tabsLists = res.data.list;
        },
        async getBasicsList() {
            const res = await queryMaintainSet();
            this.basicsList = res.data.list;
            this.ruleForm.firstMileage = res.data.firstMileage;
            this.ruleForm.circleMileage = res.data.circleMileage;
            this.ruleForm.pushEndTime = res.data.pushEndTime;
        },
        /*tab切换*/
        handleClick(tab, event) {
            this.tabName = tab.label;
            this.tabValue = tab.name;
            this.getList();
        },
        /*基础保养提交*/
        submitForm (formName) {
            this.$refs[formName].validate((valid, obj) => {
                if (valid) {
                    this.add(this.ruleForm)
                } else {
                    return false
                }
            })
        },
        async add (query) {
            const params = query;
            await maintainSet(params);
            this.$message.success(this.$t('common.success'))
        },
        /*列表数据查询*/
        async getList (e) {
            const params = this.query;
            params.maintainItemCode = this.tabValue;
            const res = await getMaintainItemList(params);
            this.tableData = res.data.list;
            this.total = res.data.total;
        },
        /*2编辑/1新增*/
        onEdit (e,res) {
            let type = e;
            this.bindDialogVisible = true;
            if(type == 1){//新增
                this.dialogData.title = this.$t('common.add')
                this.dialogData.type = 1
                this.dialogForm.maintainItemCode = this.tabValue
            }else if(type == 2){//编辑
                this.dialogData = res;
                this.dialogData.title = this.$t('common.edit')
                this.dialogData.type = 2
                this.dialogForm.maintainItemId = res.maintainItemId;
                this.dialogForm.maintainItemName = res.maintainItemName
            }

        },
        /*编辑/新增提交*/
        submitDialogForm (formName) {
            this.$refs[formName].validate((valid, obj) => {
                if (valid) {
                    this.addDialog(this.dialogForm)
                } else {
                    return false
                }
            })
        },
        async addDialog (query) {
            const params = query;
            await editMaintainItem(params,this.dialogData.type);
            this.$message.success(this.$t('common.success'))
            this.$refs.dialogForm.resetFields()
            this.getList(this.tabValue);
            this.bindDialogVisible = false;
        },
        /*取消*/
        resetForm () {
            this.bindDialogVisible = false
            this.$refs.dialogForm.resetFields()
        },
        /*删除*/
        del (id) {
            this.$confirm(this.$t('common.confirmDel') , this.$t('common.notice'), {
                confirmButtonText: this.$t('common.confirm'),
                cancelButtonText: this.$t('common.cancel'),
                type: 'warning'
            }).then(() => {
                this.removeItem(id)
            }).catch(() => {
            });
        },
        async removeItem (res) {
            const data = await delMaintainItem(res)
            this.$message.success(this.$t('common.delSuccess'));
            this.getList(this.tabValue);
        },
        /*导入*/
        onImport () {
            this.batchAddCarVis = true
        },
        handleSuccess (e) {
            const params = {}
            this.uploadTips = []
            params.maintainItemCode = this.tabValue;
            params.fileType = e.ext_name;
            params.uuid = e.fullPath
            importMaintainItem(params).then(() => {
                this.getList(this.tabValue)
                this.uploadTips.push({
                    text: this.$t('business.terminal.importantSuccess'),
                    type: 'success'
                })
            }).catch(err => {
                this.uploadTips.push({
                    text: err.message,
                    type: 'error'
                })
                console.log(this.uploadTips)
            })
        }
    }
}
</script>

<style scoped>
    .title-header{
        background: #d6def0;
        padding-left: 15px;
        line-height: 36px;
        font-size: 17px;
        font-weight: bold;
    }
    .el-table{
        margin: 0px auto;
    }
    .el-tab-pane{
        padding-bottom: 50px;
    }
    .el-form {
        width: 100%;
    }
    .el-textarea{
        margin-top: 3px;
    }
</style>
