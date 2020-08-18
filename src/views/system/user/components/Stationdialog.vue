<template>
    <el-dialog :title="$t('user.station')" :visible.sync="dialogVisible" width="700px" :close-on-click-modal="false" :before-close="cancel" @open="getStationTree" @close="close">
        <el-row>
            <el-col :span="24">
                <el-col :span="7">
                    <el-input v-model="keyword" />
                </el-col>
                <el-col :span="7" :offset="1">
                    <el-button type="primary" @click="getStationTree">{{ $t('common.research') }}</el-button>
                    <el-button class="cancel" @click="keyword=null">{{ $t('common.clear') }}</el-button>
                </el-col>
            </el-col>
        </el-row>
        <div style="height: 58vh; overflow-y: auto;" class="mt20">
            <el-tree ref="tree" :data="stationTreeData" show-checkbox node-key="id"
                     highlight-current :props="defaultProps" :default-expanded-keys='["1"]' />
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button class="cancel" @click="cancel">{{ $t('common.cancel') }}</el-button>
            <el-button type="primary" @click="ok">{{ $t('common.confirm') }}</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import { getStation } from '@/api/system/user'

    export default {
        name: 'Stationdialog',
        props: ['dialogVisible', 'type', 'data'],
        data() {
            return {
                keyword: null,
                query: {},
                stationTreeData: [],
                treeSelection: '',
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        methods: {
            async getStation() {
                const re = await getStation(this.query)
                this.stationTreeData = [re.data]
                if (this.data.length) {
                    this.$refs.tree.setCheckedKeys(this.data)
                }
            },
            getStationTree() {
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
                this.getStation()
            },
            cancel() {
                this.$emit('stationDialogClose', null)
            },
            ok() {
                let selectTreeNode = []
                this.treeSelection = this.$refs.tree.getCheckedNodes()
                this.treeSelection.forEach(item => {
                    //if (!item.children) {
                        selectTreeNode.push(item)
                    //}
                })
                this.$emit('stationDialog', selectTreeNode)
                this.$emit('stationDialogClose', null)
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
