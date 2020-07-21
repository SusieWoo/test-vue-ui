<template>
  <div>
    <el-row>
      <el-col :span="6" style="text-align: center;line-height:40px;">
        <div style="display: inline-block;">
          <span>{{ truckAllPoints && truckAllPoints[0] ?truckAllPoints[0].reportTime:'-' }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <el-slider
          :key="truckAllPoints.length"
          style="vertical-align: middle;"
          :value="truckPlayIndex"
          :show-tooltip="false"
          :max="truckAllPoints.length?truckAllPoints.length - 1:0"
          @input="moveSlider"
          @change="changeSlider"
        />
      </el-col>
      <el-col :span="6" style="text-align: center;line-height:40px;">
        <div style="display: inline-block;">
          <span>{{ truckAllPoints && truckAllPoints[truckAllPoints.length - 1]?truckAllPoints[truckAllPoints.length - 1].reportTime:'-' }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <div class="flex">
        <div class="flex flex-start switch">
          <el-radio-group v-model="play_state" size="mini">
            <el-radio-button label="慢速" />
            <el-radio-button label="正常" />
            <el-radio-button label="快速" />
            <el-radio-button label="极快" />
          </el-radio-group>
        </div>
        <div class="flex row center playAll">
          <i class="el-icon-d-arrow-left" @click="go(-1)"></i>
          <img v-if="truckPlayStatus===1" class="button" src="@/assets/images/pause.png" alt="暂停" @click="play">
          <img v-if="truckPlayStatus!==1" class="button" src="@/assets/images/play.png" alt="播放" @click="play">
          <i class="el-icon-d-arrow-right" @click="go(1)"></i>
        </div>

      </div>
    </el-row>
    <!--<div class="flex row flex-start">
      <div class="flex row center playAll">
        <i class="el-icon-d-arrow-left" @click="go(-1)"></i>
        <img v-if="truckPlayStatus===1" class="button" src="@/assets/images/pause.png" alt="暂停" @click="play">
        <img v-if="truckPlayStatus!==1" class="button" src="@/assets/images/play.png" alt="播放" @click="play">
        <i class="el-icon-d-arrow-right" @click="go(1)"></i>
      </div>
      <div class="flex column flex-start progress">
        <div class="progress-up">
          <span style="color: #789cfc">{{ options.totalDistance?options.totalDistance + 'km/':'-' }}{{ options.totalRuntime }}</span>
        </div>
        <div class="progress-middle">
          <el-slider
            :key="truckAllPoints.length"
            style="vertical-align: middle;"
            :value="truckPlayIndex"
            :show-tooltip="false"
            :max="truckAllPoints.length?truckAllPoints.length - 1:0"
            @input="moveSlider"
            @change="changeSlider"
          />
        </div>
        <div class="progress-down">
          <div style="display: inline-block">
            <span>{{ truckAllPoints && truckAllPoints[0] ?truckAllPoints[0].reportTime:'-' }}</span>
          </div>
          <div style="margin-right: 30px; display: inline-block; float: right">
            <span>{{ truckAllPoints && truckAllPoints[truckAllPoints.length - 1]?truckAllPoints[truckAllPoints.length - 1].reportTime:'-' }}</span>
          </div>
        </div>
      </div>
      <div class="flex center switch">
        <el-radio-group v-model="play_state" size="mini">
          <el-radio-button label="慢速" />
          <el-radio-button label="正常" />
          <el-radio-button label="快速" />
          <el-radio-button label="极快" />
        </el-radio-group>
      </div>
    </div>-->
  </div>

</template>

<script>
import Bus from '@/utils/eventBus.js';
import { mapGetters, mapMutations } from 'vuex';
import { debounce } from '@/utils'

export default {
  data() {
    return {
      play_state: '正常',
      value2:0,
      options:{
        runtime: '',
        totalDistance: '',
        totalRuntime: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'truckAllPoints',
      'truckPlayIndex',
      'truckPlayStatus'
    ])
  },
  watch: {
    play_state: function(val) {
      if (val === '慢速') {
        Bus.$emit('truck_player_times', 1000)
      }
      if (val === '正常') {
        Bus.$emit('truck_player_times', 500)
      }
      if (val === '快速') {
        Bus.$emit('truck_player_times', 250)
      }
      if (val === '极快') {
        Bus.$emit('truck_player_times', 100)
      }
    }
  },
  mounted() {
    Bus.$on('truck_init', () => {
      if(!this.truckAllPoints || this.truckAllPoints.length < 1) {
        this.CHANGE_PLAY_STATUS(0)
        this.CHANGE_PLAY_INDEX(0)
      }
    });
  },
  beforeDestroy() {
    Bus.$off('truck_init')
  },
  methods: {
    ...mapMutations({
      'CHANGE_PLAY_INDEX':'truck/CHANGE_PLAY_INDEX',
      'CHANGE_PLAY_STATUS':'truck/CHANGE_PLAY_STATUS' // 播放状态 0.待开始  1.待暂停或停止
    }),
    changeStatus() {
      this.CHANGE_PLAY_STATUS(this.truckPlayStatus === 0?1:0)
      Bus.$emit('truck_player_onPlay', this.truckPlayStatus);
    },
    play() {
      if (this.truckAllPoints.length === 0) {
        this.$message({
          message: '当前无轨迹',
          type: 'warning'
        });
        Bus.$emit('truck_list_filterDisabled', false)
        return false
      }
      this.changeStatus()
    },
    go(foot) {
      const index = this.truckPlayIndex + foot
      if (index > this.truckAllPoints.length - 1 || index < 0) {
        this.$message({
          message: '已经到头了',
          type: 'warning'
        });
        return false
      }
      Bus.$emit('truck_player_onGo', index);
    },
    moveSlider(s) {
      if(s !== this.truckPlayIndex) {
        /* 防抖*/
        debounce(this.CHANGE_PLAY_INDEX(s), 100)
      }
    },
    changeSlider() {
      if(this.truckAllPoints.length === 0) {
        return
      }
      if(this.truckPlayStatus === 1) {
        this.CHANGE_PLAY_STATUS(0)
        Bus.$emit('truck_player_onPlay', this.truckPlayStatus);
      }
      Bus.$emit('truck_player_onGo', this.truckPlayIndex);
    }
  }
}
</script>
<style lang="scss" scoped>
  .playAll{
    min-width: 130px;
    height: 59px;
    .playLR{
      width: 18px;
      height: 18px;
      cursor:pointer;
    }

    .button{
      width:40px;
      height: 40px;
      margin-left: 5px;
      margin-right: 5px;
      cursor:pointer;
    }
  }

  .switch {
    min-width: 200px;
    height: 59px;
    /deep/ .el-radio-button--mini .el-radio-button__inner {
      padding: 7px 7px;
      background-color: rgba(0,0,0,0.6);
      border: 0;
      color: #fff;
    }
    /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background-color: #fff;
      color: #000;
      border: 0;
      box-shadow: -1px 0 0 0 #000;
    }
  }

  .progress {
    width: 100%;
    min-width: 400px;
    height: 59px;

    .progress-up {
      font-size: 10px;
      width: calc(100% - 130px);
      left: 140px;
      top: 3px;
      height: 10px;
    }
    .progress-middle{
      min-width: 400px;
      height: 59px;
      width: 90%;
      padding: 17px 20px;
      /deep/.el-slider__bar{
        background: #21cbfa;
        background: linear-gradient(to right,  #21cbfa 0%,#1a56e8 100%);
        height: 5px;
      }
      /deep/.el-slider__runway{
        background: #4b5367;
        height: 5px;
        margin: 10px 0;
      }
      /deep/.el-slider__button-wrapper{
        top: -16px;
      }
    }

    .progress-down{
      margin-top: 9px;
      font-size: 10px;
      width: calc(100% - 320px);
      top: 34px;
      left: 140px;
      right: 180px;
      height: 20px;
    }
  }

  // position
  .flex{
    display: -webkit-flex; /* Safari */
    display: flex;
  }

  .row{
    flex-direction: row;
  }

  .column{
    flex-direction: column;
  }

  .center {
    justify-content: center;
    align-items: center;
  }

  .flex-start {
    justify-content: flex-start;
    align-items: center;
  }

  .flex-end {
    justify-content: flex-end;
    align-items: center;
  }

  .flex-end-two {
    justify-content: flex-end;
    align-items: flex-end;
  }

  .space-between {
    justify-content: space-between;
    align-items: center;
  }

  :root .custom-theme{filter:none;}
</style>
