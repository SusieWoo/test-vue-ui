<template>
    <div class="editUser">
        <div class="content">
            <el-form ref="form" inline :model="ruleForm" :rules="rules" label-width="130px" label-position="right">
                <div>
                    <span>{{ $t('role.basicInfo') }}</span>
                    <el-divider />
                </div>
                <div class="pd-10">
                    <el-form-item :label="$t('user.userType')" prop="accountType">
                        <el-select v-model="ruleForm.accountType" class="search-item" :placeholder="$t('common.select')" @change="userTypeChange">
                            <el-option v-for="item in roleTypeList" :key="item.id" :label="item.value" :value="item.code" />
                        </el-select>
                    </el-form-item>
                    <div v-for="(item, index) in ruleForm.user" :key="item.id">
                        <el-form-item v-if="ruleForm.accountType === '5'" :label="$t('user.number')" :prop="'user.'+index+'.numbers'" :rules="rules.number">
                            <el-select v-model="item.numbers" class="search-item" @change="changeAccountNums(index)">
                                <el-option value="1">1</el-option>
                                <el-option value="2">2</el-option>
                                <el-option value="3">3</el-option>
                                <el-option value="4">4</el-option>
                                <el-option value="5">5</el-option>
                                <el-option value="6">6</el-option>
                                <el-option value="7">7</el-option>
                                <el-option value="8">8</el-option>
                                <el-option value="9">9</el-option>
                                <el-option value="10">10</el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="item.showAccountName" :label="$t('user.accountName')" :prop="'user.'+index+'.accountName'" :rules="rules.accountName">
                            <el-input v-model="item.accountName" class="search-item" />
                        </el-form-item>
                        <el-form-item v-for="(x, i) in item.accountNums" v-else :key="x.name" :label="x.text" :prop="'user.'+index+'.accountNums.'+ i + '.accountName'" :rules="rules.accountName">
                            <el-input v-model="item.accountNums[i].accountName" class="search-item" />
                        </el-form-item>
                        <el-form-item v-if="!isEdit && ruleForm.user.length === 1" :label="$t('login.password')" prop="accountPwd" class="mb30">
                            <el-input v-model="ruleForm.accountPwd" type="password" class="search-item" auto-complete="new-password" />
                        </el-form-item>
                        <el-form-item v-if="!isEdit && ruleForm.user.length === 1" :label="$t('user.confirmPwd')" prop="confirmPwd" class="mb30">
                            <el-input v-model="ruleForm.confirmPwd" type="password" class="search-item" auto-complete="new-password" />
                        </el-form-item>
                        <el-form-item :label="$t('user.tel')" :prop="'user.'+index+'.accountLinktel'" :rules="rules.accountLinktel">
                            <el-input v-model="item.accountLinktel" class="search-item" />
                        </el-form-item>
                        <el-form-item :label="$t('user.email')">
                            <el-input v-model="item.email" class="search-item" />
                        </el-form-item>
                        <el-form-item :label="$t('user.name')" :prop="'user.'+index+'.accountNickname'" :rules="rules.accountNickname">
                            <el-input v-model="item.accountNickname" class="search-item" />
                        </el-form-item>
                        <el-form-item :label="$t('user.department')" :prop="'user.'+index+'.deptId'" :rules="rules.department">
                            <el-select v-model="item.deptId" class="search-item" :placeholder="$t('common.select')">
                                <el-option :label="$t('common.all')" :value="''" />
                                <el-option v-for="x in departmentArr" :key="x.deptId" :label="x.deptName" :value="x.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('user.tip')" :prop="'user.'+index+'.accountDescribe'" :rules="rules.accountDescribe">
                            <el-input v-model="item.accountDescribe" type="textarea" class="search-item" />
                        </el-form-item>
                        <div>
                            <span>{{ $t('user.useStates') }}</span>
                            <el-divider />
                        </div>
                        <div class="pd-10">
                            <el-form-item prop="lockAccount" class="ml-130">
                                <el-checkbox v-model="item.lockAccount" true-label="1" false-label="0">{{ $t('user.lockStatus') }}</el-checkbox>
                            </el-form-item>
                            <el-form-item v-if="ruleForm.user.length === 1" :label="$t('user.termVilidate')" prop="termVilidate">
                                <el-input v-model="ruleForm.termVilidate" class="search-item" />
                            </el-form-item>
                        </div>
                        <div>
                            <span>{{ $t('user.roleInfo') }}</span>
                            <el-divider />
                        </div>
                        <div class="pd-10 pb-60">
                            <el-form-item :label="$t('message.role')" :prop="'user.'+index+'.roles'" :rules="rules.roles">
                                <el-input v-model="item.roles" readonly @click.native="showRoleDialog(index)" />
                            </el-form-item>
                            <el-form-item v-if="ruleForm.accountType !== '1'" :label="teamName" :prop="'user.'+index+'.teams'" :rules="rules.teams">
                                <el-input v-model="item.teams" readonly @click.native="showTeamDialog(index)" />
                            </el-form-item>
                            <el-form-item v-if="ruleForm.accountType === '2'" :label="$t('user.station')">
                                <el-input v-model="item.stations" readonly @click.native="showStationDialog(index)" />
                            </el-form-item>
                        </div>
                        <div v-if="ruleForm.user.length>1 && index !== 0 && ruleForm.accountType === '5' && !isEdit" class="pd-10 center">
                            <el-form-item>
                                <el-button size="medium" type="primary" @click="removeUser(index)">{{ $t('user.delUser') }}</el-button>
                            </el-form-item>
                        </div>
                        <Roledialog :dialog-visible="item.dialogTableRole" :type="ruleForm.accountType" :roles="item.roles" :index="index" @roleDialogClose="showRoleDialog(index)" @roleDialog="roleDialogReturn($event, index)" />
                        <Teamdialog :dialog-visible="item.dialogTableTeam" :type="ruleForm.accountType" :data="item.teamData" :index="index" @teamDialogClose="showTeamDialog(index)" @teamDialog="showTeamDialogReturn($event, index)" />
                        <Stationdialog :dialog-visible="item.dialogTableStation" :type="ruleForm.accountType" :data="item.stationsId" :index="index" @stationDialogClose="showStationDialog(index)" @stationDialog="showStationDialogReturn($event, index)" />
                    </div>
                </div>
                <div class="pd-10 pb-60">
                    <el-form-item v-if="!isEdit && ruleForm.user.length !== 1" :label="$t('login.password')" prop="password" class="mb30">
                        <el-input v-model="ruleForm.accountPwd" type="password" class="search-item" auto-complete="new-password" />
                    </el-form-item>
                    <el-form-item v-if="!isEdit && ruleForm.user.length !== 1" :label="$t('user.confirmPwd')" prop="confirmPwd" class="mb30">
                        <el-input v-model="ruleForm.confirmPwd" type="password" class="search-item" auto-complete="new-password" />
                    </el-form-item>
                    <el-form-item v-if="ruleForm.user.length !== 1" :label="$t('user.termVilidate')" prop="termVilidate">
                        <el-input v-model="ruleForm.termVilidate" class="search-item" />
                    </el-form-item>
                </div>
                <div class="pd-10 center">
                    <el-form-item>
                        <el-button v-if="ruleForm.accountType === '5' && !isEdit" v-loading.fullscreen.lock="fullscreenLoading" type="primary" size="medium" @click="addUser">{{ $t('user.addUser') }}</el-button>
                        <el-button v-loading.fullscreen.lock="fullscreenLoading" type="primary" size="medium" @click="save('form')">{{ $t('common.confirm') }}</el-button>
                        <el-button size="medium" @click.native="$router.go(-1)">{{ $t('common.cancel') }}</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import { baseData, queryDepartment, add, getDetail } from '@/api/system/user'
    import { letterOrNumber16, mobilePhone } from '@/utils/rules'
    import Roledialog from './components/Roledialog'
    import Teamdialog from './components/Teamdialog'
    import Stationdialog from './components/Stationdialog'

    export default {
        components: {
            Roledialog,
            Teamdialog,
            Stationdialog
        },
        data() {
            const password = (rule, value, callback) => {
                const reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?![\W_]*$)\S{8,16}$/
                if (!reg.test(value)) {
                    return callback(new Error(`${this.$t('common.rules.password')}`))
                } else {
                    let _this = this
                    if (_this.ruleForm.confirmPwd !== '') {
                        _this.$refs.form.validateField('confirmPwd')
                    }
                    callback()
                }
            }
            const confirmPwdVali = (rule, value, callback) => {
                if (value !== this.ruleForm.accountPwd) {
                    return callback(new Error(`${this.$t('common.rules.pwdConfirmFail')}`))
                } else {
                    callback()
                }
            }
            return {
                fullscreenLoading: false,
                isEdit: false,
                roleTypeList: [],
                departmentArr: [],
                rules: {
                    accountType: [
                        { required: true, message: `${this.$t('common.select')}${this.$t('user.userType')}`, trigger: 'blur' }
                    ],
                    number: [
                        { required: true, message: `${this.$t('common.select')}${this.$t('user.number')}`, trigger: 'blur' }
                    ],
                    accountName: [
                        { required: true, message: `${this.$t('common.place')}${this.$t('user.accountName')}`, trigger: 'blur' },
                        { validator: letterOrNumber16, trigger: 'blur' }
                    ],
                    accountPwd: [
                        { required: true, message: `${this.$t('common.place')}${this.$t('login.password')}`, trigger: 'blur' },
                        { validator: password, trigger: 'blur' }
                    ],
                    confirmPwd: [
                        { required: true, message: `${this.$t('common.place')}${this.$t('user.confirmPwd')}`, trigger: 'blur' },
                        { validator: confirmPwdVali, trigger: 'blur' }
                    ],
                    accountLinktel: [
                        { required: true, message: `${this.$t('common.place')}${this.$t('user.tel')}`, trigger: 'blur' },
                        { validator: mobilePhone, trigger: 'blur' }
                    ],
                    accountNickname: [
                        { required: true, message: `${this.$t('common.place')}${this.$t('user.name')}`, trigger: 'blur' },
                        { min: 1, max: 30, message: `${this.$t('user.nameLimit')}`, trigger: 'blur' }
                    ],
                    department: [
                        { required: true, message: `${this.$t('common.select')}${this.$t('user.department')}`, trigger: 'blur' }
                    ],
                    accountDescribe: [
                        { max: 200, message: `${this.$t('common.place')}${this.$t('user.tipLimit')}`, trigger: 'blur' }
                    ],
                    termVilidate: [
                        { required: true, message: `${this.$t('common.select')}${this.$t('user.termVilidate')}`, trigger: 'blur' }
                    ],
                    roles: [
                        { required: true, message: `${this.$t('common.select')}${this.$t('message.role')}`, trigger: 'blur' }
                    ],
                    teams: [
                        { required: true, message: `${this.$t('common.select')}${this.$t('user.team')}`, trigger: 'blur' }
                    ]
                },
                teamName: '',
                ruleForm: {
                    accountType: '1',
                    termVilidate: '2025-10-01',
                    user: [{
                        showAccountName: true,
                        accountName: '',
                        accountNums: [{
                            accountName: ''
                        }],
                        role: '',
                        team: '',
                        roles: '',
                        roleNames: '',
                        showTeam: false,
                        dialogTableRole: false,
                        dialogTableTeam: false,
                        dialogTableStation: false,
                        teams: '',
                        teamNames: '',
                        teamData: [],
                        stations: '',
                        serviceStation: [],
                        stationsId: []
                    }]
                }
            }
        },
        mounted() {
            this.getRole()
            this.getDepartment()
            if (this.$route.params.id !== 'null') {
                this.isEdit = true
                this.getDetail()
            }
        },
        methods: {
            async getRole() {
                const re = await baseData({ type: 71 });
                this.roleTypeList = re.data
            },
            async getDepartment() {
                const re = await queryDepartment({});
                this.departmentArr = re.data
            },
            async getDetail() {
                let _this = this
                const re = await getDetail({ accountId: _this.$route.params.id })
                _this.$set(_this.ruleForm.user, 0, re.data)
            },
            async add() {
                let params = []
                this.ruleForm.user.forEach((item, index) => {
                    params.push({})
                    let role = []
                    item.role.forEach(i => {
                        role.push(i.code)
                    });
                    this.$set(params[index],'accountType', this.ruleForm.accountType)
                    if (item.accountName) {
                        this.$set(params[index],'accountName', [item.accountName])
                    } else {
                        let accountName = []
                        item.accountNums.forEach(i => {
                            accountName.push(i.accountName)
                        })
                        this.$set(params[index],'accountName', accountName)
                    }
                    this.$set(params[index],'numbers', item.numbers || '')
                    this.$set(params[index],'accountPwd', this.ruleForm.accountPwd)
                    this.$set(params[index],'confirmPwd', this.ruleForm.confirmPwd)
                    this.$set(params[index],'accountLinktel', item.accountLinktel)
                    this.$set(params[index],'email', item.email)
                    this.$set(params[index],'accountNickname', item.accountNickname)
                    this.$set(params[index],'deptId', item.deptId)
                    this.$set(params[index],'accountDescribe', item.accountDescribe)
                    this.$set(params[index],'lockAccount', item.lockAccount)
                    this.$set(params[index],'termVilidate', this.ruleForm.termVilidate)
                    this.$set(params[index],'role', role.join(','))
                })
                const re = await add({ data: params });
                if (re.resultCode === 200) {
                    if (this.type === 'add') this.$message.success(`${this.$t('user.addSuccess')}`);
                    else this.$message.success(`${this.$t('user.editSuccess')}`);
                    this.$router.back(-1)
                }
            },
            userTypeChange() {
                this.ruleForm.user[0].numbers = '1';
                if (this.ruleForm.user[0].accountNums[0].accountName) {
                    this.ruleForm.user[0].accountNums = [];
                }
                if (this.ruleForm.user[0].accountName) {
                    this.ruleForm.user[0].accountName = '';
                }
                this.ruleForm.user[0].showAccountName = true;
                this.ruleForm.user[0].role = '';
                this.ruleForm.user[0].roleNames = '';
                this.ruleForm.user[0].roles = '';
                this.ruleForm.user[0].teams = ''
                this.ruleForm.user[0].teamNames = ''
                this.ruleForm.user[0].teamData = []
                this.ruleForm.user[0].stations = ''
                this.ruleForm.user[0].serviceStation = []
                this.ruleForm.user[0].stationsId = []
                this.ruleForm.user = this.ruleForm.user.slice(0,1);
                if (this.ruleForm.accountType === '2') {
                    this.teamName = `${this.$t('basicInfo.dealer')}${this.$t('user.team')}`
                } else if (this.ruleForm.accountType === '5') {
                    this.teamName = `${this.$t('user.team')}`
                }
            },
            changeAccountNums(index) {
                this.ruleForm.user[index].accountNums = [];
                let count = parseInt(this.ruleForm.user[index].numbers)

                if (count > 1) {
                    this.ruleForm.user[index].showAccountName = false;
                    for (let i = 0; i < count; i++) {
                        this.ruleForm.user[index].accountNums.push({ text: `${this.$t('user.accountName')}` + (i + 1), id: 'name' + i, accountName: '' });
                    }
                } else {
                    this.ruleForm.user[index].showAccountName = true;
                }
            },
            addUser() {
                this.ruleForm.user.push({
                    showAccountName: true,
                    numbers: '1',
                    accountName: '',
                    accountNums: [{
                        accountName: ''
                    }],
                    role: '',
                    team: '',
                    roles: '',
                    roleNames: '',
                    showTeam: false,
                    dialogTableRole: false,
                    dialogTableTeam: false,
                    dialogTableStation: false,
                    teams: '',
                    teamNames: '',
                    teamData: [],
                    stations: '',
                    serviceStation: [],
                    stationsId: []
                });
            },
            removeUser(index) {
                if (index !== 0) {
                    this.ruleForm.user.splice(index,1);
                }
            },
            showRoleDialog(index) {
                this.ruleForm.user[index].dialogTableRole = !this.ruleForm.user[index].dialogTableRole
            },
            roleDialogReturn(data, index) {
                let rolesData = []
                data.forEach(item => {
                    rolesData.push(item.name)
                });
                this.ruleForm.user[index].roles = rolesData.join(',')
                this.ruleForm.user[index].roleNames = ''
                this.ruleForm.user[index].role = data || [];
            },
            showTeamDialog(index) {
                this.ruleForm.user[index].dialogTableTeam = !this.ruleForm.user[index].dialogTableTeam
            },
            showTeamDialogReturn(data, index) {
                let teamData = []
                if (data) {
                    data.forEach(item => {
                        teamData.push(item.name)
                        this.ruleForm.user[index].teamData.push(item.id)
                    });
                    this.ruleForm.user[index].teams = teamData.join(',')
                    this.ruleForm.user[index].team += this.ruleForm.user[index].teamData.join(',')
                } else {
                    this.ruleForm.user[index].teams = ''
                }
                this.ruleForm.user[index].team = data || [];
            },
            showStationDialog(index) {
                this.ruleForm.user[index].dialogTableStation = !this.ruleForm.user[index].dialogTableStation
            },
            showStationDialogReturn(data, index) {
                this.ruleForm.user[index].serviceStation = data;
                let dealResult = [];
                let dealId = []
                let _this = this
                data.forEach((item, index) => {
                    //if (!item.isParent) {
                        dealResult.push(item.name)
                        dealId.push(item.id)
                    //}
                })
                _this.ruleForm.user[index].stations = dealResult.join(',');
                _this.ruleForm.user[index].stationsId = dealId
            },
            save(formName) {
                this.$refs[formName].validate((valid, obj) => {
                    if (valid) {
                        this.add()
                    }
                })
            }
        }
    }
</script>
<style scoped lang="scss">
    .editUser {
        .search-item {
            width: 200px!important;
        }
        .el-form-item {
            width: 100%;
        }
        .center {
            text-align: center;
        }
        .content {
            width: 100%;
            padding: 20px;
        }
        .ml-130 {
            margin-left: 130px;
        }
        .pd-10 {
            padding: 10px 0;
        }
        .pb-60 {
            padding-bottom: 60px;
        }
        .mr-10 {
            margin-right: 10px;
        }
        .search {
            padding-bottom: 20px;
            border-bottom: 1px solid #ccc;
            .params {
                width: 260px;
            }
        }
    }
</style>
