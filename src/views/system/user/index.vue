<template>
    <div class="user">
        <el-card class="card-panel">
            <el-form :inline="true" :model="querys" label-position="right" label-width="110px">
                <el-form-item :label="$t('user.account')">
                    <el-input v-model="querys.accountName" class="search-item" :placeholder="$t('common.place')+$t('user.account')" />
                </el-form-item>
                <el-form-item :label="$t('user.userType')">
                    <el-select v-model="accountType" class="search-item" :placeholder="$t('common.select')">
                        <el-option :label="$t('common.all')" :value="''" />
                        <el-option v-for="item in roleTypeList" :key="item.id" :label="item.value" :value="item.code" />
                    </el-select>
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
                            <el-form-item :label="$t('user.pastDue')">
                                <el-select v-model="pastDue" class="search-item">
                                    <el-option v-for="item in pastDueArr" :key="item.id" :label="item.value" :value="item.code" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('user.operator')">
                                <el-input v-model="querys.createAccount" class="search-item" :placeholder="$t('user.operator')" maxlength="16" />
                            </el-form-item>
                            <el-form-item :label="$t('user.associatedDealer')">
                                <el-input v-model="querys.dealerName" class="search-item" :placeholder="$t('user.associatedDealer')" maxlength="16" />
                            </el-form-item>
                            <el-form-item :label="$t('user.roleName')">
                                <el-input v-model="querys.roleName" class="search-item" :placeholder="$t('user.roleName')" maxlength="16" />
                            </el-form-item>
                            <el-form-item :label="$t('user.name')">
                                <el-input v-model="querys.accountNickname" class="search-item" :placeholder="$t('user.name')" maxlength="16" />
                            </el-form-item>
                            <el-form-item :label="$t('user.department')">
                                <el-select v-model="deptId" class="search-item">
                                    <el-option :label="$t('common.all')" :value="''" />
                                    <el-option v-for="item in department" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item :label="$t('user.ownerRole')">
                                <el-input v-model="querys.aName" class="search-item" :placeholder="$t('user.ownerRole')" />
                            </el-form-item>
                            <el-form-item :label="$t('user.lockStatus')">
                                <el-select v-model="lockAccount" class="search-item">
                                    <el-option v-for="item in lockAccountArr" :key="item.id" :label="item.value" :value="item.code" />
                                </el-select>
                            </el-form-item>
                        </span>
                    </template>
                </com-search>
            </el-form>
        </el-card>
        <el-card>
            <el-button v-if="hasPerm(20002)" type="primary" icon="el-icon-plus" @click="goToEditOrAdd('')">{{ $t('common.add') }}</el-button>
        </el-card>
        <el-table v-loading="loading" class="t-table" stripe :data="tableData" style="width: 100%">
            <el-table-column prop="date" align="center" :label="$t('common.operate')" width="150" fixed="left">
                <template slot-scope="scope">
                    <el-button v-if="hasPerm(20003)" type="text" size="small" @click="goToEditOrAdd(scope.row.accountId)">{{ $t('common.edit') }}</el-button>
                    <el-button v-if="hasPerm(20048)" type="text" size="small" class="ml-10" @click="del(scope.row)">{{$t('common.del')}}</el-button>
                    <el-button type="text" size="small" class="ml-10" @click="resetPassword(scope.row)">{{$t('user.resetPassword')}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="carVin" align="center" :label="$t('role.number')" width="100" fixed="left">
                <template slot-scope="scope">{{scope.$index + (querys.page_number - 1) * querys.page_size + 1}}</template>
            </el-table-column>
            <el-table-column prop="accountName" align="center" :label="$t('user.account')" width="120" fixed="left" />
            <el-table-column prop="accountType" align="center" :label="$t('user.userType')" width="120" fixed="left" />
            <el-table-column prop="accountNickname" align="center" :label="$t('user.name')" width="120" fixed="left" />
            <el-table-column prop="role" align="center" :label="$t('user.roleName')" width="150" fixed="left" />
            <el-table-column prop="deptName" align="center" :label="$t('user.department')" width="120" fixed="left" />
            <el-table-column prop="dealerCode" align="center" :label="$t('user.dealerCode')" width="180" />
            <el-table-column prop="name" align="center" :label="$t('user.dealerName')" width="180" />
            <el-table-column prop="accountLinktel" align="center" :label="$t('user.tel')" width="180" />
            <el-table-column prop="lockAccount" align="center" :label="$t('user.lockStatus')" width="120" />
            <el-table-column prop="expiredStatus" align="center" :label="$t('user.pastDue')" width="120" />
            <el-table-column prop="termVilidate" align="center" :label="$t('user.ableTime')" width="120" />
            <el-table-column prop="createAccount" align="center" :label="$t('user.operator')" width="120" />
            <el-table-column prop="accountDate" align="center" :label="$t('user.operatorTime')" width="170" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="querys.page_number" :limit.sync="querys.page_size" @pagination="getList" />
    </div>
</template>
<script>
    import { baseData, queryDepartment, queryUserList, delUser, resetPassWord } from '@/api/system/user'
    import pagination from '@/components/pagination'
    import comSearch from '@/components/comSearch'

    export default {
        components: {
            comSearch,
            pagination
        },
        computed: {
            pastDueArr() {
                return [
                    { value: this.$t('user.unLimit'), id: 1, code: '' },
                    { value: this.$t('user.normal'), id: 2, code: '0' },
                    { value: this.$t('user.expire'), id: 3, code: '1' }
                ]
            },
            lockAccountArr() {
                return [
                    { value: this.$t('user.unLimit'), id: 1, code: '' },
                    { value: this.$t('user.normal'), id: 2, code: '0' },
                    { value: this.$t('user.locked'), id: 3, code: '1' }
                ]
            }
        },
        data() {
            return {
                loading: false,
                roleTypeList: [],
                tableData: [],
                total: 0,
                department: [],
                accountType: '',
                pastDue: '',
                deptId: '',
                lockAccount: '',
                querys: {
                    page_number: 1,
                    page_size: 10
                },
            }
        },
        mounted() {
            this.getRole()
            this.getList()
            this.getDepartment()
        },
        methods: {
            async getRole() {
                const re = await baseData({ type: 71 });
                this.roleTypeList = re.data
            },
            async getDepartment() {
                const re = await queryDepartment({});
                this.department = re.data;
            },
            async getList() {
                this.loading = true;
                this.querys.accountType = this.accountType
                this.querys.pastDue = this.pastDue
                this.querys.deptId = this.deptId
                this.querys.lockAccount = this.lockAccount
                const re = await queryUserList(this.querys);
                this.loading = false;
                this.tableData = re.data.list;
                this.total = re.data.total;
            },
            async delUser (id) {
                await delUser({ accountId: id })
                this.getList();
                this.$message.success(`${this.$t('role.delSuccess')}`)
            },
            async resetPass(id) {
                await resetPassWord({ accountId: id })
                this.$message.success(`${this.$t('user.resetSuccess')}`)
            },
            clear() {
                this.accountType = ''
                this.pastDue = ''
                this.deptId = ''
                this.lockAccount = ''
                this.querys = {
                    page_number: 1,
                    page_size: 10
                };
                this.getList();
            },
            goToEditOrAdd(id) {
                if (!id) id = null
                this.$router.push({
                    path: `user/${id}`,
                })
            },
            del(row) {
                this.$confirm(`${this.$t('common.toDel')}`, `${this.$t('common.del')}`, { type: 'warning' }).then(() => {
                    this.delUser(row.accountId)
                })
            },
            resetPassword(row) {
                this.$confirm(`${this.$t('user.askIsReset')}` + row.accountName + `${this.$t('user.thePassword')}`, `${this.$t('user.resetPassword')}`, { type: 'warning' }).then(() => {
                    this.resetPass(row.accountId)
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .user {
        .ml-10 {
            margin-left: 10px;
        }
    }
</style>
