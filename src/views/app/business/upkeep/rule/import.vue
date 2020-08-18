<template>
    <el-dialog
        :close-on-click-modal="false"
        :visible.sync="batchAddCarVis"
        :close-on-press-escape="false"
        :show-close="true"
        top="20vh"
        width="50%"
        :title="title"
    >
        <el-row :gutter="10">
            <el-col :span="3">
                <el-upload
                    :limit="limit"
                    ref="upload"
                    :action="action"
                    :accept="accept"
                    :show-file-list="false"
                    :on-success = "handleSuccess"
                    :on-change='handleChange'>
                    <el-button size="small" type="primary">{{$t('export.file')}}</el-button>
                </el-upload>
            </el-col>
            <el-col :span="9">
                <el-input readonly v-model="name"></el-input>
            </el-col>
            <el-col :span="3">
                <el-link :href="demoURL" target="_blank">
                    <el-button size="small" type="primary">{{$t('export.download')}}</el-button>
                </el-link>
            </el-col>
        </el-row>
        <div class="el-upload__tip el-icon-info">{{this.tip}}</div>
        <div v-if="resultTips.length > 0" class="alerts">
            <el-alert
                    v-for="(item, index) in resultTips"
                    :key="index"
                    style="margin-bottom: 10px"
                    :closable="false"
                    :title="item.text"
                    :type="item.type" />
        </div>
        <el-row :gutter="20">
            <el-col :span="12" :offset="8">
                <el-button type="primary" :loading="loading" @click="submitUpload()">{{$t('common.import')}}</el-button>
                <el-button @click="cancelBatchAddCar()">{{$t('common.cancel')}}</el-button>
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
    import { uploadFile } from '@/api/public/PublicService'
    export default {
        name: 'Import',
        props: {
            title: {
                type: String
            },
            batchAddCarVis: {
                type: Boolean,
                required: true,
            },
            limit: {
                type: Number,
                required: true,
            },
            action: {
                type: String,
                required: true,
            },
            accept: {
                type: String
            },
            tip: {
                type: String
            },
            demoURL: {
                type: String
            },
            tips: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                fileList: [],
                name:'',
                file: null,
                uploadResult: {
                    success: {
                        text: this.$t('ajComponents.uploadSuccess'),
                        type: 'success'
                    },
                    error: {
                        text: this.$t('ajComponents.errTips'),
                        type: 'error'
                    }
                },
                resultTips: this.tips,
                loading: false
            }
        },
        watch: {
            tips(newv, oldv) {
                this.resultTips.push(...newv)
            }
        },
        methods: {
            handleChange(file, fileList) {
                this.name = file.name
                this.file = file
                this.fileList = fileList
                this.$refs.upload.clearFiles()
            },
            cancelBatchAddCar () {
                this.$refs.upload.clearFiles()
                this.name = ''
                this.$emit('update:batchAddCarVis', false)
                //this.$emit('update:resultTips', [])
            },
            handleSuccess (e) {
                console.log(e)
            },
            submitUpload () {
                console.log(this.file)
                this.$emit('handleSuccess', this.file)
                // this.resultTips = []
                // this.loading = true
                // const formData = new FormData()
                // formData.append('file', this.file)
                // formData.append('token', this.$store.state.user.token)
                // uploadFile(formData).then(res => {
                //     console.log(res)
                //     this.resultTips.push(this.uploadResult.success)
                //     this.$emit('handleSuccess', res.data)
                //     resolve(res.data)
                // }).catch(() => {
                //     this.resultTips.push(this.uploadResult.error)
                // }).finally(() => this.loading = false)
            }
        }
    }
</script>

<style scoped lang="scss">
    .el-row{
        margin-top: 10px;
    }
</style>
