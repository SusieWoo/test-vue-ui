<template>
    <div class="dictate">
        <el-card class="card-panel">
            <el-form :inline="true" :model="querys" label-position="right" label-width="110px">
                <el-form-item :label="$t('basicInfo.bottomCarNo')">
                    <el-input v-model="querys.chassisNo" class="search-item" :placeholder="$t('common.place')+$t('basicInfo.bottomCarNo')" />
                </el-form-item>
                <el-form-item :label="$t('basicInfo.sim')">
                    <el-input v-model="querys.simNo" class="search-item" :placeholder="$t('common.place')+$t('basicInfo.sim')" />
                </el-form-item>
                <el-form-item :label="$t('dictate.terminalId')">
                    <el-input v-model="querys.terminalId" class="search-item" :placeholder="$t('common.place')+$t('dictate.terminalId')" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="getList">{{$t('common.search')}}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-delete" @click="clear">{{$t('common.clear')}}</el-button>
                </el-form-item>
                <com-search>
                    <template>
                        <span slot="item">
                            <el-form-item :label="$t('dictate.commandDir')">
                                <el-select v-model="querys.commandDir" class="search-item">
                                    <el-option v-for="item in commandDirArr" :key="item.id" :label="item.value" :value="item.code" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('dictate.commandType')">
                                <el-select v-model="querys.commandType" class="search-item">
                                    <el-option v-for="item in commandTypeArr" :key="item.id" :label="item.value" :value="item.code" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('common.status')">
                                <el-select v-model="querys.commandStatus" class="search-item">
                                    <el-option v-for="item in commandStatusArr" :key="item.id" :label="item.value" :value="item.code" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('dictate.commandTime')">
                                <el-date-picker v-model="commandTime" class="search-item-date-range" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange"
                                                :start-placeholder="$t('dictate.startTime')" :end-placeholder="$t('dictate.endTime')" />
                            </el-form-item>
                        </span>
                    </template>
                </com-search>
            </el-form>
        </el-card>
        <el-card>
            <el-button v-if="hasPerm(20029)" type="primary" icon="el-icon-search" @click="exportData">{{ $t('common.export') }}</el-button>
        </el-card>
        <el-table v-loading="loading" class="t-table" stripe :data="tableData" style="width: 100%">
            <el-table-column prop="carVin" align="center" :label="$t('role.number')" width="100" fixed="left">
                <template slot-scope="scope">{{scope.$index + (querys.page_number - 1) * querys.page_size + 1}}</template>
            </el-table-column>
            <el-table-column prop="chassisNo" align="center" :label="$t('basicInfo.bottomCarNo')" width="120" fixed="left" />
            <el-table-column prop="carNum" align="center" :label="$t('basicInfo.carNo')" width="120" fixed="left" />
            <el-table-column prop="simNo" align="center" :label="$t('basicInfo.sim')" width="120" />
            <el-table-column prop="terminalId" align="center" :label="$t('dictate.terminalId')" width="120" />
            <el-table-column prop="team" align="center" :label="$t('basicInfo.dealer')" width="150" />
            <el-table-column prop="reCustom" align="center" :label="$t('dictate.customer')" width="120" />
            <el-table-column prop="dir" align="center" :label="$t('dictate.commandDir')" width="120" />
            <el-table-column prop="type" align="center" :label="$t('dictate.commandType')" width="120" />
            <el-table-column prop="status" align="center" :label="$t('common.status')" width="120" />
            <el-table-column prop="userNickname" align="center" :label="$t('user.name')" width="120" />
            <el-table-column prop="operateIp" align="center" :label="$t('dictate.operateIp')" width="120" />
            <el-table-column prop="operateUser" align="center" :label="$t('dictate.operate')" width="120" />
            <el-table-column prop="operateTime" align="center" :label="$t('dictate.operateTime')" width="120" />
            <el-table-column prop="des" align="center" :label="$t('dictate.operateDes')" width="120" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="querys.page_number" :limit.sync="querys.page_size" @pagination="getList" />
        <Export :iframe-filter="iframeFilter" @exportMethod="emailExcel"/>
    </div>
</template>
<script>
    import { baseData, queryList, exportDictate } from '@/api/system/dictate'
    import pagination from '@/components/pagination'
    import comSearch from '@/components/comSearch'
    import Export from '@/components/Export'

    export default {
        components: {
            comSearch,
            pagination,
            Export
        },
        computed: {
            commandDirArr() {
                return [
                    { value: this.$t('user.unLimit'), id: 1, code: '-1' },
                    { value: this.$t('dictate.pToP'), id: 2, code: '2' },
                    { value: this.$t('dictate.terminalToP'), id: 3, code: '1' },
                    { value: this.$t('dictate.pToTerminal'), id: 4, code: '0' }
                ]
            },
            commandStatusArr() {
                return [
                    { value: `${this.$t('user.unLimit')}`, id: 1, code: '-4' },
                    { value: `${this.$t('dictate.success')}`, id: 2, code: '1' },
                    { value: `${this.$t('dictate.fail')}`, id: 3, code: '0' },
                    { value: `${this.$t('dictate.messageError')}`, id: 4, code: '2' },
                    { value: `${this.$t('dictate.terminalNotSupport')}`, id: 5, code: '3' },
                    { value: `${this.$t('dictate.alarmConfirm')}`, id: 6, code: '4' },
                    { value: `${this.$t('dictate.terminalOffLine')}`, id: 7, code: '5' },
                    { value: `${this.$t('dictate.terminalUnregistered')}`, id: 8, code: '6' },
                    { value: `${this.$t('dictate.waitNoResponse')}`, id: 9, code: '-3' },
                    { value: `${this.$t('dictate.executing')}`, id: 10, code: '-2' },
                    { value: `${this.$t('dictate.invalidOperateType')}`, id: 11, code: '10' },
                    { value: `${this.$t('dictate.invalidLimitType')}`, id: 12, code: '11' },
                    { value: `${this.$t('dictate.carShutdown')}`, id: 13, code: '12' },
                    { value: `${this.$t('dictate.abnormalCommunicate')}`, id: 14, code: '13' }
                ]
            }
        },
        data() {
            return {
                loading: false,
                tableData: [],
                total: 0,
                commandTime: [],
                commandTypeArr: [],
                querys: {
                    page_number: 1,
                    page_size: 10,
                    commandDir: '-1',
                    commandType: '-1',
                    commandStatus: '-4'
                },
                iframeFilter: {},
            }
        },
        mounted() {
            this.getCommandType()
            this.getList()
        },
        methods: {
            async getCommandType() {
                let re = await baseData({ type: 52 });
                re.data = [{ id: 0, value: this.$t('common.unlimited'), code: '-1' }].concat(re.data)
                this.commandTypeArr = re.data
            },
            async getList() {
                this.loading = true;
                this.querys.beginTime = this.commandTime ? this.commandTime[0] : ''
                this.querys.endTime = this.commandTime ? this.commandTime[1] : ''
                const re = await queryList(this.querys);
                this.loading = false;
                this.tableData = re.data.list;
                this.total = re.data.total;
            },
            clear() {
                this.querys = {
                    page_number: 1,
                    page_size: 10,
                    commandDir: '-1',
                    commandType: '-1',
                    commandStatus: '-4'
                };
                this.commandTime = []
                this.getList();
            },
            exportData () {
                this.iframeFilter = {
                    data: {
                        isEmail: true
                    }
                }
            },
            async emailExcel (email) {
                await exportDictate(Object.assign({ email: email }, this.query))
                this.$message.success(this.$t('export.receive'));
            }
        }
    }
</script>
