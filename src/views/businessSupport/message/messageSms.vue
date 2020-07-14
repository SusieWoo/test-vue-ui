<template>
  <div class="message-sms">
    <div style="height: 40px;background-color:#97a8be;" v-if="this.addFlag === '1'">{{$t('message.addMessage')}}</div>
    <div style="height: 40px;background-color:#97a8be;" v-if="this.addFlag === '0'">{{$t('message.reSendMsg')}}</div>
    <el-form ref="dataForm"
             :rules="rules"
             label-width="120px"
             :model="row">
      <el-form-item :label="$t('message.msgType')" prop="msgType">
        <el-select v-model="row.msgType"
                   class="search-item"
                   :placeholder="$t('common.select')">
          <el-option v-for="item in msgTypeList "
                     :key="item.value"
                     :label="item.name"
                     :value="item.value" />
        </el-select>
      </el-form-item>
      <div style="display: flex; flex-direction: row;">
        <el-form-item :label="$t('message.title')"
                      prop="title">
          <el-input v-model="row.title" />
        </el-form-item>
        <span>提示：标题信息不展示在用户短信中</span>
      </div>
      <el-form-item :label="$t('message.content')"
                    prop="content">
        <el-input v-model="row.content"
                  type="textarea"
                  :rows="2" />
      </el-form-item>
      <div style="display: flex; flex-direction: row;">
        <el-form-item :label="$t('message.targetUser')">
          <el-input v-model="row.phone" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="sendMsg('dataForm')">
            {{$t('common.addTo')}}
          </el-button>
          <el-button type="primary" @click.native="sendMsg('dataForm')">
            {{$t('common.import')}}
          </el-button>
        </el-form-item>
      </div>
      <el-form-item prop="content" label-width="120px">
        <el-input v-model="row.userPhoneNumbers"
                  type="textarea"
                  :rows="2" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native="sendMsg('dataForm')">
          {{$t('message.sendMsg')}}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    newSms,
    resendSms
  } from '@/api/business/messageService';
  import { checkString } from '@/utils/rules';
  import { TagsViewModule } from '@/store/modules/tags-view';
  import { basedata } from '@/api/public/PublicService';

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
          msgObject: [],
        },

        rules: {
          msgType: [
            { required: true, message: '必填', trigger: 'change' }
          ],
          title: [
            { required: true, message: '必填', trigger: 'change' },
            { validator: checkString, trigger: 'change' },
            { max: 40, message: '最多40个字', trigger: 'change' }
          ],
          content: [
            { required: true, message: '必填', trigger: 'change' },
            { validator: checkString, trigger: 'change' },
            { max: 500, message: '最多500个字', trigger: 'change' }
          ]
        },

        addFlag: '',
        msgTypeList: [],

      };
    },
    watch: {},
    created () {
      this.addFlag = this.$route.params.addFlag;
      this.msgId = this.$route.params.id;
    },
    mounted () {
      this.getMsgStyle();
      // 重发
      if (this.addFlag === '0') {
        this.getMessageDetail(this.msgId);
      }
    },
    methods: {
      // 消息类型
      async getMsgStyle () {
        const res = await basedata({ type: 'A', code: 'M003' });
        this.msgTypeList = res.data.list;
      },

      async sendMsg () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            newSms(this.row).then(() => {
              this.$message.success('消息新建成功！');
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
        const res = await resendSms({ id: msgId });
        this.row = res.data;
      },
    }
  };
</script>

<style lang="scss" scoped>
  .message-sms {
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