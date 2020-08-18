<template>
    <el-dialog :title="$t('user.team')" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false" :before-close="cancel" @open="getTeamTree" @close="close">
        <el-row>
            <el-col :span="24">
                <el-col :span="7">
                    <el-input v-model="keyword" />
                </el-col>
                <el-col :span="7" :offset="1">
                    <el-button type="primary" @click="getTeamTree">{{ $t('common.research') }}</el-button>
                    <el-button class="cancel" @click="keyword=null">{{ $t('common.clear') }}</el-button>
                </el-col>
                <el-col :span="7">
                    {{ $t('common.type') }}：
                    <el-select v-model="lightHeavyFlg">
                        <el-option v-for="item in lightHeavyFlgArr" :key="item.id" :label="item.name" :value="item.value" />
                    </el-select>
                </el-col>
            </el-col>
        </el-row>
        <div style="height: 58vh; overflow-y: auto;" class="mt20">
            <el-tree ref="tree" :data="teamTreeData" show-checkbox node-key="id"
                     highlight-current :props="defaultProps" :default-expanded-keys="[1]" />
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button class="cancel" @click="cancel">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="ok">{{ $t('common.confirm') }}</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import { getTeam } from '@/api/system/user'

    export default {
        name: 'Teamdialog',
        props: ['dialogVisible', 'type', 'data'],
        computed: {
            lightHeavyFlgArr() {
                return [{
                    name: `${this.$t('common.unlimited')}`,
                    value: '',
                    id: 0
                }, {
                    name: `${this.$t('user.zzk')}`,
                    value: 1,
                    id: 1
                }, {
                    name: `${this.$t('user.qk')}`,
                    value: 2,
                    id: 2
                }, {
                    name: `${this.$t('user.bothZzkQk')}`,
                    value: 3,
                    id: 3
                }]
            }
        },
        data() {
            return {
                keyword: null,
                lightHeavyFlg: '',
                query: {},
                teamTreeData: [],
                treeSelection: '',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        methods: {
            async getTeam() {
                const re = await getTeam(this.query)
                this.teamTreeData = re.data
                if (this.data.length) {
                    this.$refs.tree.setCheckedKeys(this.data)
                }
            },
            getTeamTree() {
                if (this.keyword) {
                    this.query['searchType'] = 1
                    this.query['name'] = this.keyword
                } else {
                    delete this.query.searchType
                    delete this.query.name
                }
                if (this.lightHeavyFlg) {
                    this.query['lightHeavyFlg'] = this.lightHeavyFlg
                } else {
                    delete this.query.lightHeavyFlg
                }
                this.getTeam()
            },
            cancel() {
                this.$emit('teamDialogClose', null)
            },
            ok() {
                let selectTreeNode = []
                this.treeSelection = this.$refs.tree.getCheckedNodes()
                this.treeSelection.forEach(item => {
                    if (!item.children) {
                        selectTreeNode.push(item)
                    }
                })
                this.$emit('teamDialog', selectTreeNode)
                this.$emit('teamDialogClose', null)
            },
            close() {
                this.$refs.tree.setCheckedKeys([])
            }
        }
    }
</script>
<style lang="scss" scoped>
    .el-button {
        &:focus{
            background: #377CFD;
            border-color: #377CFD;
        }
    }
    .el-button.cancel {
        &:focus {
            background: #fff;
            color: #377CFD;
            border-color: #377CFD;
        }
    }
    .el-select {
        width: 70%;
    }
</style>
