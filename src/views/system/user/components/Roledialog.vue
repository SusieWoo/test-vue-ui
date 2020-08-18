<template>
    <el-dialog :title="$t('message.role')" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false" :before-close="cancel" @open="getRoleGridData" @close="removeData">
        <el-table ref="table" :data="gridData" border height="50vh" :row-key="getRowKeys" :row-style="{height:'50px'}" @selection-change="getRoleSelection">
            <el-table-column align="center" type="selection" :reserve-selection="true" min-width="10%" />
            <el-table-column align="center" :label="$t('role.number')" min-width="10%">
                <template slot-scope="scope">{{scope.$index + (query.page_number - 1) * query.page_size + 1}}</template>
            </el-table-column>
            <el-table-column align="center" property="name" :label="$t('role.roleName')" min-width="40%" />
            <el-table-column align="center" property="roleType" :label="$t('role.roleType')" min-width="40%" />
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="query.page_number" :limit.sync="query.page_size" @pagination="getRoleGridData" />
        <div slot="footer" class="dialog-footer">
            <el-button class="cancel" @click="cancel">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="ok">{{ $t('common.confirm') }}</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import _ from 'lodash'
    import pagination from '@/components/pagination'
    import { roleByType } from '@/api/system/user'

    export default {
        name: 'Roledialog',
        components: {
            pagination
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            type: {
                type: String
            },
            index: {},
            roles: {
                type: String
            }
        },
        data() {
            return {
                total: null,
                query: {
                    type: '',
                    page_number: 1,
                    page_size: 10
                },
                gridData: [],
                roleSelection: []
            }
        },
        methods: {
            getRowKeys(row) {
                return row.code
            },
            async getRole() {
                const re = await roleByType(this.query)
                this.gridData = re.data.list
                this.total = re.data.total
                let roleIndex = ''
                let _this = this
                let roles = ''
                if (_this.roles) {
                    if (_this.roles.length) roles = _this.roles.split(',')
                } else {
                    roles = _this.roles
                }
                _.forEach(roles, function(item) {
                    roleIndex = _.findIndex(_this.gridData, function(o) { return o.name === item })
                    if (roleIndex >= 0) {
                        _this.$refs.table.toggleRowSelection(_this.gridData[roleIndex], true)
                    }
                })
            },
            getRoleGridData() {
                this.query.type = this.type
                this.getRole()
            },
            getRoleSelection(val) {
                this.roleSelection = val
            },
            cancel() {
                this.$emit('roleDialogClose', null)
            },
            ok() {
                this.$emit('roleDialog', this.roleSelection, this.index)
                this.$emit('roleDialogClose', null)
            },
            removeData() {
                this.$refs.table.clearSelection()
            }
        }
    }
</script>
