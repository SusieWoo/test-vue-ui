<template>
    <el-dialog :title="$t('login.setNewPassword')" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" :before-close="cancel">
        <el-row>
            <el-form class="first-login" label-width="150px" :model="queryParams" ref="form" :rules="rules">
                <el-col :span="24">
                    <el-form-item :label="$t('login.newPassword')" prop="newPassword">
                        <el-input class="pass" type="password" v-model="queryParams.newPassword" auto-complete="new-password" />
                    </el-form-item>
                    <el-form-item :label="$t('user.confirmPwd')" prop="confirmPwd">
                        <el-input class="pass" type="password" v-model="queryParams.confirmPwd" auto-complete="new-password" />
                    </el-form-item>
                </el-col>
                <el-col :span="18" :offset="2">
                    <el-form-item>
                        <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" size="medium" @click="save('form')">{{ $t('common.submit') }}</el-button>
                        <el-button size="medium" @click.native="cancel">{{ $t('common.cancel') }}</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
    </el-dialog>
</template>
<script>
export default {
    name: 'FirstLogin',
    props: ['dialogVisible', 'data'],
    data() {
        const password = (rule, value, callback) => {
            const reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?![\W_]*$)\S{8,16}$/
            if (!reg.test(value)) {
                return callback(new Error(`${this.$t('common.rules.password')}`))
            } else if (this.queryParams.newPassword === this.queryParams.oldPassword) {
                return callback(new Error(`${this.$t('common.rules.confirmPwd')}`))
            } else {
                if (this.queryParams.confirmPwd !== '') {
                    this.$refs.form.validateField('confirmPwd')
                }
                callback()
            }
        }
        const confirmPwdVali = (rule, value, callback) => {
            if (value !== this.queryParams.newPassword) {
                callback(new Error(`${this.$t('common.rules.pwdConfirmFail')}`))
            } else {
                callback()
            }
        }
        return {
            fullscreenLoading: false,
            queryParams: {
                newPassword: '',
                oldPassword: this.data
            },
            rules: {
                newPassword: [
                    { required: true, message: `${this.$t('common.place')}${this.$t('login.password')}`, trigger: 'blur' },
                    { validator: password, trigger: 'blur' }
                ],
                confirmPwd: [
                    { required: true, message: `${this.$t('common.place')}${this.$t('user.confirmPwd')}`, trigger: 'blur' },
                    { validator: confirmPwdVali, trigger: 'blur' }
                ]
            }
        }
    },
    watch: {
        data(val) {
            this.queryParams.oldPassword = val
        }
    },
    methods: {
        save(formName) {
            this.$refs[formName].validate((valid, obj) => {
                if (valid) {
                    this.$confirm(`${this.$t('login.sureChange')}`, `${this.$t('common.notice')}`, { type: 'warning' }).then(() => {
                        this.$emit('DialogReturn', this.queryParams)
                    })
                }
            })
        },
        cancel() {
            this.$emit('DialogClose', null)
        }
    }
}
</script>
<style lang="scss">
.first-login {
    .el-form-item {
        border: none;
        background: none!important;
        .el-input {
            border: 1px solid #1890ff;
            height: 38px;
            .el-input__inner {
                color: #000;
                height: 38px;
            }
        }
    }
}
</style>
