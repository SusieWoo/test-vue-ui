<template>
  <div class="message-push">
    <h3 class="title-header" v-if="this.addFlag === '1'">{{$t('message.addMessage')}}</h3>
    <h3 class="title-header" v-if="this.addFlag === '0'">{{$t('message.reSendMsg')}}</h3>
    <el-form ref="dataForm"
             :rules="rules"
             label-width="120px"
             :model="row">
      <el-form-item v-if="this.addFlag === '0'" :label="$t('message.createUser')">
        <el-input v-model="row.userName" :disabled="true"/>
      </el-form-item>
      <el-form-item v-if="this.addFlag === '0'" :label="$t('message.createTime')">
        <el-input v-model="row.createTime" :disabled="true"/>
      </el-form-item>
      <el-form-item :label="$t('message.describe')"
                    prop="describe">
        <el-input v-model="row.describe" />
      </el-form-item>
      <el-form-item :label="$t('message.title')"
                    prop="title">
        <el-input v-model="row.title" />
      </el-form-item>
      <el-form-item :label="$t('message.content')"
                    prop="content">
        <el-input v-model="row.content"
                  type="textarea"
                  :rows="2" />
      </el-form-item>
      <el-form-item :label="$t('message.targetUrl')"
                    prop="targetUrl">
        <el-input v-model="row.targetUrl" />
      </el-form-item>
      <el-form-item :label="$t('message.targetUser')">
        <el-radio-group v-model="row.targetUser">
          <el-radio :label="0">{{$t('message.allUser')}}</el-radio>
          <el-radio :label="1">{{$t('message.partUser')}}</el-radio>
          <el-radio :label="2">{{$t('message.specialUser')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="row.targetUser === 1"
           style="display:flex; flex-direction:row; padding-left:50px;">
        <el-form-item :label="$t('message.carSeries')"
                      prop="seriseId">
          <el-select v-model="seriseId"
                     class="search-item"
                     :placeholder="$t('common.select')"
                     @change="getCarTypeList">
            <el-option v-for="item in carSeriesList"
                       :key="item.seriseId"
                       :label="item.seriseName"
                       :value="item.seriseId" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('message.carType')"
                      prop="modelId">
          <el-select v-model="row.modelId"
                     class="search-item"
                     :placeholder="$t('common.select')">
            <el-option v-for="item in carTypeList"
                       :key="item.modelId"
                       :label="item.modelName"
                       :value="item.modelName" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('message.role')"
                      prop="role">
          <el-select v-model="row.role"
                     class="search-item"
                     :placeholder="$t('common.select')">
            <el-option v-for="item in roleList"
                       :key="item.role"
                       :label="item.label"
                       :value="item.role" />
          </el-select>
        </el-form-item>
      </div>
      <!-- TODO 左右移动选择框-->
      <div v-if="row.targetUser === 2">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item>
              <el-input size="medium" v-model="keyWord" :placeholder="$t('message.inputMobile')"/>
            </el-form-item>
          </el-col>
          <el-col :span="2">
              <el-button :disabled="!keyWord" :loading="loading" type="primary" @click="searchUsers(keyWord)">
                {{$t('common.search')}}
              </el-button>
          </el-col>
          <el-col :span="2">
              <el-button type="primary" @click.native="importFile()">
                {{$t('common.import')}}
              </el-button>
          </el-col>
        </el-row>
        <el-form-item>
          <el-transfer
                  v-model="row.userInfo"
                  :format="{
                        noChecked: '${total}',
                        hasChecked: '${checked}/${total}'
                      }"
                  :data="appUserData"
                  :props="{
                        key: 'userIds',
                        label: 'phone'
                      }"
          ></el-transfer>
        </el-form-item>
      </div>

<!--        <span slot-scope="{ option }">{{ option.name }} - {{ option.phone }}</span>-->

      <el-form-item :label="$t('message.noticeType')">
        <el-radio v-model="row.noticeType"
                  :label="0">
          {{$t('message.appMsg')}}
        </el-radio>
      </el-form-item>
      <el-form-item :label="$t('message.sendTime')">
        <el-radio-group v-model="row.sendType">
          <el-radio :label="0">{{$t('message.pushNow')}}</el-radio>
          <el-radio :label="1">{{$t('message.pushTiming')}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="row.sendType === 1"
                    prop="sendTime">
        <el-date-picker v-model="row.sendTime"
                        class="search-item"
                        value-format="yyyy-MM-dd HH:mm"
                        type="datetime"
                        :placeholder="$t('common.selectDate')" />
      </el-form-item>

      <el-form-item :label="$t('message.validityTime')">
        <el-radio-group v-model="row.validity">
          <el-radio :label="0">{{$t('message.noSave')}}</el-radio>
          <el-radio :label="1">{{$t('message.yesSave')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="row.validity === 1">
        <el-select v-model="row.saveDays"
                   class="search-item"
                   :placeholder="$t('common.select')">
          <el-option v-for="item in daysList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
        <el-select v-model="row.saveHours"
                   class="search-item"
                   :placeholder="$t('common.select')">
          <el-option v-for="item in hoursList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value" />
        </el-select>
        <span>{{$t('message.saveMsg')}}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click.native="sendMsg('dataForm')">
          {{$t('message.sendMsg')}}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  carSeriesList,
  carTypeList,
  newNotice,
  resendNotice,
  userIdByPhoneAndVin
} from '@/api/business/messageService';
import { checkString, checkUrl } from '@/utils/rules';
import { TagsViewModule } from '@/store/modules/tags-view';
//import { basedata } from '@/api/public/PublicService';
//import comSearch from '@/components/comSearch';

export default {
  components: {
    //comSearch,
  },
  props: {},
  data () {
    return {
      row: {
        targetUser: 0,
        seriseId: '',
        modelId: '',
        noticeType: 0,
        sendType: 0,
        validity: 0,
        saveDays: 6,
        saveHours: 24,
        userIds: '',
        userInfo: [],
      },

      rules: {
        describe: [
          { required: true, message: this.$t('message.required'), trigger: 'change' },
          { validator: checkString, trigger: 'change' },
          { max: 20, message: this.$t('message.upTo20Words'), trigger: 'change' }
        ],
        title: [
          { required: true, message: this.$t('message.required'), trigger: 'change' },
          { validator: checkString, trigger: 'change' },
          { max: 60, message: this.$t('message.upTo60Words'), trigger: 'change' }
        ],
        content: [
          { required: true, message: this.$t('message.required'), trigger: 'change' },
          { validator: checkString, trigger: 'change' },
          { max: 500, message: this.$t('message.upTo500Words'), trigger: 'change' }
        ],
        targetUrl: [
          { validator: checkUrl, trigger: 'change' }
        ],
        seriseId: [
          { required: true, message: this.$t('message.required'), trigger: ['blur', 'change'] }
        ],
        modelId: [
          { required: true, message: this.$t('message.required'), trigger: ['blur', 'change'] }
        ],
        role: [
          { required: true, message: this.$t('message.required'), trigger: ['blur', 'change'] }
        ],
        sendTime: [
          { required: true, message: this.$t('message.required'), trigger: ['blur', 'change'] }
        ]
      },

      carSeries: '',
      carSeriesList: [],
      carTypeList: [],
      addFlag: '',
      msgId: '',

      keyWord: '',
      appUserData: [],
      userInfo: [],
      loading: false,
      roleList: [
        { label: this.$t('message.owner'), role: 0 },
        { label: this.$t('message.driver'), role: 1 },
        { label: this.$t('message.administrators'), role: 2 }
      ],
      daysList: [
        { label: '6' + this.$t('message.days'), value: 6 },
        { label: '5' + this.$t('message.days'), value: 5 },
        { label: '4' + this.$t('message.days'), value: 4 },
        { label: '3' + this.$t('message.days'), value: 3 },
        { label: '2' + this.$t('message.days'), value: 2 },
        { label: '1' + this.$t('message.days'), value: 1 },
        { label: '0' + this.$t('message.days'), value: 0 },
      ],
      hoursList: [
        { label: '24h', value: 24 },
        { label: '23h', value: 23 },
        { label: '22h', value: 22 },
        { label: '21h', value: 21 },
        { label: '20h', value: 20 },
        { label: '19h', value: 19 },
        { label: '18h', value: 18 },
        { label: '17h', value: 17 },
        { label: '16h', value: 16 },
        { label: '15h', value: 15 },
        { label: '14h', value: 14 },
        { label: '13h', value: 13 },
        { label: '12h', value: 12 },
        { label: '11h', value: 11 },
        { label: '10h', value: 10 },
        { label: '9h', value: 9 },
        { label: '8h', value: 8 },
        { label: '7h', value: 7 },
        { label: '6h', value: 6 },
        { label: '5h', value: 5 },
        { label: '4h', value: 4 },
        { label: '3h', value: 3 },
        { label: '2h', value: 2 },
        { label: '1h', value: 1 },
        { label: '0h', value: 0 },
      ]
    };
  },
  watch: {},
  created () {
    this.addFlag = this.$route.params.addFlag;
    this.msgId = this.$route.params.id;
  },
  mounted () {
    this.getCarSeriesList(10)
    // 重发
    if (this.addFlag === '0') {
      this.getMessageDetail(this.msgId);
    }
  },
  methods: {
    async getCarSeriesList (id) {
      const res = await carSeriesList({ brandId: id })
      this.carSeriesList = res.data;
    },
    async getCarTypeList (id) {
      this.row.modelId = '';
      let obj = {};
      obj = this.carSeriesList.find((lst) => {
        return lst.seriseId === id;
      });
      this.row.seriseId = obj ? obj.seriseName : '';
      if (!this.row.seriseId) return
      const re = await carTypeList({ seriseId: id });
      this.carTypeList = re.data;
    },
    async sendMsg () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          newNotice(this.row).then(() => {
            this.$message.success(this.$t('message.messageCreatedSuccessfully') + '！');
            //删除tab标签
            TagsViewModule.delView(this.$route);
            //返回
            this.$router.go(-1);
          }).catch(err => {
            console.error(err)
          })
        }
      })
    },
    async getMessageDetail (msgId) {
      const res = await resendNotice({ id: msgId });
      const seriseName = res.data.seriseId;

      let obj = {};
      obj = this.carSeriesList.find((lst) => {
        return lst.seriseName === seriseName;
      });
      this.seriseId = obj ? obj.seriseId : '';
      // 车型
      if (this.seriseId) this.getCarTypeList(this.seriseId);

      this.row = res.data;
      this.row.describe = res.data.descInfo;
      this.row.noticeType = 0;
      this.row.validity = res.data.validity;
    },
    async searchUsers (keyWord) {
      this.loading = true
      const res = await userIdByPhoneAndVin({ keyWord: keyWord });
      this.appUserData = res.data;
      this.loading = false
    }
  }
};
</script>

<style lang="scss" scoped>
.message-push {
  .title-header{
    background: #d6def0;
    padding-left: 15px;
    line-height: 36px;
    font-size: 17px;
    font-weight: bold;
  }
  .collapse-select {
    padding: 0 20px;
  }

  .ml-10 {
    margin-left: 10px;
  }

  .list {
    padding: 10px 5px;
    border-bottom: 1px solid #dfe6ec;
  }

  .red {
    color: $red;
  }

  .center {
    text-align: center;
    border-bottom: 1px solid #dfe6ec;
    padding-bottom: 10px;
  }
}

.el-form {
  width: 100%;
}

</style>
