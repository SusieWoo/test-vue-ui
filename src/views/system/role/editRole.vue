<template>
    <div class="editRole">
        <div class="content">
            <el-form ref="form" inline :model="querys" :rules="rules" label-width="130px" label-position="right">
                <div>
                    <span>{{ $t('role.basicInfo') }}</span>
                    <el-divider />
                </div>
                <div class="pd-10">
                    <el-form-item :label="$t('role.roleName')" prop="name">
                        <el-input v-model="querys.name" />
                    </el-form-item>
                    <el-form-item :label="$t('role.roleType')" prop="roleType">
                        <el-select v-model="querys.roleType" style="width: 250px" @change="getRoleTree('', querys.roleType)">
                            <el-option v-for="item in roleTypeList" :key="item.id" :label="item.value" :value="item.code" />
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <span>{{ $t('role.roleInfo') }}</span>
                    <el-divider />
                </div>
                <div class="pd-10">
                    <el-form-item :label="$t('role.permissionName')" class="roleTree">
                        <el-tree ref="tree" :data="roleTree" show-checkbox node-key="id" :check-strictly="true"
                                 highlight-current :props="defaultProps" style="min-width: 250px" @check-change="checkChange" />
                    </el-form-item>
                </div>
                <div class="pd-10 center">
                    <el-form-item>
                        <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" size="medium" @click="save('form')">{{ $t('common.confirm') }}</el-button>
                        <el-button size="medium" @click.native="returnTo">{{ $t('common.cancel') }}</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { baseData, getRoleTree, add, detail, edit } from '@/api/system/role';
    export default {
        data() {
            return {
                fullscreenLoading: false,
                querys: {},
                roleTypeList: [],
                roleTree: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                rules: {
                    name: [
                        { required: true, message: `${this.$t('role.roleNameEmptyAlert')}`, trigger: 'blur' },
                        { min: 1, max: 16, message: `${this.$t('role.roleNameLimitAlert')}`, trigger: 'change' }
                    ],
                    roleType: [
                        { required: true, message: `${this.$t('role.roleTypeEmptyAlert')}`, trigger: 'blur' }
                    ]
                }
            }
        },
        mounted() {
            this.getRole()
            if (this.$route.params.id !== 'null') {
                this.getDetail()
                this.type = 'edit'
            } else {
                this.getRoleTree('', 1)
                this.type = 'add'
            }
        },
        methods: {
            async getRole() {
                const re = await baseData({ type: 71 });
                this.roleTypeList = re.data
            },
            async getRoleTree(permissions, roleType) {
                const re = await getRoleTree({ roleType: roleType });
                this.roleTree = re.data
                if (permissions) {
                    const roleIds = []
                    permissions.forEach(item => {
                        roleIds.push(item.id)
                    })
                    this.$refs.tree.setCheckedKeys(roleIds)
                }
            },
            async add() {
                let re
                if (this.type === 'add') {
                    re = await add(this.querys).finally(() => {
                        this.fullscreenLoading = false
                    })
                } else {
                    re = await edit(this.querys).finally(() => {
                        this.fullscreenLoading = false
                    })
                }
                if (re.resultCode === 200) {
                    if (this.type === 'add') this.$message.success(`${this.$t('role.addSuccess')}`);
                    else this.$message.success(`${this.$t('role.editSuccess')}`);
                    this.$router.back(-1)
                }
            },
            async getDetail() {
                let _this = this
                const re = await detail({ id: _this.$route.params.id })
                this.querys = re.data
                this.getRoleTree(re.data.permissions, re.data.roleType)
            },
            checkChange(a, b, c) {
                if (b) {
                    this.findChildren(a, true)
                } else {
                    if (a.children) {
                        this.findChildren(a, false)
                    }
                }
            },
            findChildren(current, type) {
                this.$refs.tree.setChecked(current.id, type, true)
                const d = current.children
                if (d) {
                    d.forEach(a => {
                        this.findChildren(a, type)
                    })
                }
            },
            save(formName) {
                this.$refs[formName].validate((valid, obj) => {
                    if (valid) {
                        this.querys.permission = this.$refs.tree.getCheckedKeys().toString()
                        if (!this.querys.permission) {
                            this.$message.error(`${this.$t('role.roleEmptyAlert')}`)
                            return false
                        }
                        this.fullscreenLoading = true
                        delete this.querys.permissions
                        this.add()
                    } else {
                        return false
                    }
                })
            },
            returnTo() {
                this.$router.push({ path: '/system/role' })
            }
        }
    }
</script>
<style scoped lang="scss">
.editRole {
    .center {
        text-align: center;
    }
    .content {
        width: 100%;
        padding: 20px;
    }
    .pd-10 {
        padding: 10px 0;
    }
    .mr-10 {
        margin-right: 10px;
    }
    .search {
        // display: flex;
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
        .params {
            width: 260px;
        }
    }
}
</style>
