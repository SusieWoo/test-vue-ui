<template>
    <div class="role">
        <el-card class="card-panel">
            <el-form :inline="true" :model="querys" label-position="right" label-width="110px">
                <el-form-item :label="$t('role.roleName')">
                    <el-input v-model="querys.name" class="search-item" :placeholder="$t('common.place')+$t('role.roleName')" />
                </el-form-item>
                <el-form-item :label="$t('role.roleType')">
                    <el-select v-model="type" class="search-item" :placeholder="$t('common.select')">
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
            </el-form>
        </el-card>
        <el-card>
            <el-button v-if="hasPerm(20005)" type="primary" icon="el-icon-plus" @click="goToEditOrAdd('')">{{ $t('common.add') }}</el-button>
        </el-card>
        <el-table v-loading="loading" class="t-table" stripe :data="tableData" style="width: 100%">
            <el-table-column prop="date" align="center" :label="$t('common.operate')" min-width="10%">
                <template slot-scope="scope">
                    <el-button v-if="hasPerm(20007)" type="text" size="small" @click="goToEditOrAdd(scope.row.id)">{{ $t('common.edit') }}</el-button>
                    <el-button v-if="hasPerm(20047)" type="text" size="small" class="ml-10" @click="del(scope.row)">{{$t('common.del')}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="carVin" align="center" :label="$t('role.number')" min-width="10%">
                <template slot-scope="scope">{{scope.$index + (querys.page_number - 1) * querys.page_size + 1}}</template>
            </el-table-column>
            <el-table-column prop="name" align="center" :label="$t('role.roleName')" min-width="15%" />
            <el-table-column prop="roleType" align="center" :label="$t('role.roleType')" min-width="15%" />
            <el-table-column prop="createAccount" align="center" :label="$t('role.operator')" min-width="15%" />
            <el-table-column prop="createTime" align="center" :label="$t('role.operateTime')" min-width="15%" />
            <el-table-column prop="updateTime" align="center" :label="$t('role.updateTime')" min-width="15%" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="querys.page_number" :limit.sync="querys.page_size" @pagination="getList" />
    </div>
</template>
<script>
    import { baseData, queryRoleList, delRole } from '@/api/system/role';
    import pagination from '@/components/pagination';
    export default {
        components: {
            pagination
        },
        data() {
            return {
                loading: false,
                roleTypeList: [],
                tableData: [],
                total: 0,
                type: '',
                querys: {
                    page_number: 1,
                    page_size: 10,
                    type: ''
                },
            }
        },
        mounted() {
            this.getRole()
            this.getList()
        },
        methods: {
            async getRole() {
                const re = await baseData({ type: 71 });
                this.roleTypeList = re.data
            },
            async getList() {
                this.loading = true;
                this.querys.type = this.type
                const re = await queryRoleList(this.querys);
                this.loading = false;
                this.tableData = re.data.list;
                this.total = re.data.total;
            },
            async delRole (id) {
                await delRole({ id: id })
                this.getList();
                this.$message.success(`${this.$t('role.delSuccess')}`)
            },
            clear() {
                this.type = ''
                this.querys = {
                    page_number: 1,
                    page_size: 10,
                    type: ''
                };
                this.getList();
            },
            goToEditOrAdd(id) {
                if (!id) id = null
                this.$router.push({
                    path: `role/${id}`,
                })
            },
            del(row) {
                this.$confirm(`${this.$t('common.toDel')}`, `${this.$t('common.del')}`, { type: 'warning' }).then(() => {
                    this.delRole(row.id)
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.role {
    .ml-10 {
        margin-left: 10px;
    }
}
</style>
