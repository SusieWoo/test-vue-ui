<template>
    <el-dialog title="用户首次登陆请设置新的登陆密码" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false" :before-close="cancel">
        <el-row>
            <el-form class="first-login" label-width="150px" :model="queryParams" ref="form" :rules="rules">
                <el-col :span="24">
                    <el-form-item label="新密码：" prop="newPassword">
                        <el-input class="pass" type="password" v-model="queryParams.newPassword" auto-complete="new-password" />
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="confirmPwd">
                        <el-input class="pass" type="password" v-model="queryParams.confirmPwd" auto-complete="new-password" />
                    </el-form-item>
                </el-col>
                <el-col :span="18" :offset="2">
                    <el-form-item>
                        <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" size="medium" @click="save('form')">提交</el-button>
                        <el-button size="medium" @click.native="cancel">取消</el-button>
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
        // 密码校验
        const password = (rule, value, callback) => {
            const reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?![\W_]*$)\S{8,16}$/
            if (!reg.test(value)) {
                return callback(new Error('密码由8-16位，必须包含数字、大写、小写字母！'))
            } else if (this.queryParams.newPassword === this.queryParams.oldPassword) {
                return callback(new Error('新密码不能与旧密码相同！'))
            } else {
                if (this.queryParams.confirmPwd !== '') {
                    this.$refs.form.validateField('confirmPwd')
                }
                callback()
            }
        }
        // 确认密码校验
        const confirmPwdVali = (rule, value, callback) => {
            if (value !== this.queryParams.newPassword) {
                callback(new Error('两次输入密码不一致!'))
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
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { validator: password, trigger: 'blur' }
                ],
                confirmPwd: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
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
                    this.$confirm('确定修改吗?', '提示', { type: 'warning' }).then(() => {
                        this.$emit('DialogReturn', this.queryParams)
                    })
                }
            })
        },
        cancel() {
            // 通过父组件关闭弹框
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
