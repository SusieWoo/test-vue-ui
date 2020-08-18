<template>
  <div class="flex row flex-start">
    <div class="flex row center playAll">
      <img src="@/assets/images/playLeft.png" class="playLR" :alt="$t('monitor.track.player_box.back')" @click="go(-1)" />
      <img
        v-if="truckPlayStatus===1"
        class="button"
        src="@/assets/images/pause.png"
        :alt="$t('monitor.track.player_box.pause')"
        @click="play"
      />
      <img
        v-if="truckPlayStatus!==1"
        class="button"
        src="@/assets/images/play.png"
        :alt="$t('monitor.track.player_box.play')"
        @click="play"
      />
      <img src="@/assets/images/playRight.png" alt="$t('monitor.track.player_box.onward')" class="playLR" @click="go(1)" />
    </div>
    <div class="flex column flex-start progress">
      <div class="progress-up">
      </div>
      <div class="progress-middle center">
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
      <!-- <div class="progress-down">
        <div style="display: inline-block">
          <span
            style="color: #fff"
          >{{ truckAllPoints && truckAllPoints[0] ?truckAllPoints[0].reportTime:'-' }}</span>
        </div>
        <div style="margin-right: 30px; display: inline-block; float: right">
          <span
            style="color: #fff"
          >{{ truckAllPoints && truckAllPoints[truckAllPoints.length - 1]?truckAllPoints[truckAllPoints.length - 1].reportTime:'-' }}</span>
        </div>
      </div>-->
    </div>
    <div class="flex center switch">
      <el-radio-group style="margin:0 10px" v-model="play_state" size="mini">
        <el-radio-button :label="$t('monitor.track.player_box.slow_speed')" />
        <el-radio-button :label="$t('monitor.track.player_box.normal_speed')" />
        <el-radio-button :label="$t('monitor.track.player_box.fast_speed')" />
        <el-radio-button :label="$t('monitor.track.player_box.faster_speed')" />
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { debounce } from "@/utils/debounce";

export default {
  props: {
    distance: {
      type: String,
      default: "-"
    }
  },
  data() {
    return {
      value2: 0,
      play_state: this.$t("monitor.track.player_box.slow_speed"),
      options: {
        runtime: "",
        totalDistance: "",
        totalRuntime: ""
      }
    };
  },
  computed: {
    ...mapGetters(["truckAllPoints", "truckPlayIndex", "truckPlayStatus"])
  },
  watch: {
    play_state: function(val) {
      if (val === this.$t("monitor.track.player_box.slow_speed")) {
        this.$EventBus.$emit("set_truck_player_times", 1000);
      }
      if (val === this.$t("monitor.track.player_box.normal_speed")) {
        this.$EventBus.$emit("set_truck_player_times", 500);
      }
      if (val === this.$t("monitor.track.player_box.fast_speed")) {
        this.$EventBus.$emit("set_truck_player_times", 250);
      }
      if (val === this.$t("monitor.track.player_box.faster_speed")) {
        this.$EventBus.$emit("set_truck_player_times", 100);
      }
    }
  },
  mounted() {
    this.$EventBus.$on("truck_init", () => {
      if (!this.truckAllPoints || this.truckAllPoints.length < 1) {
        this.CHANGE_PLAY_STATUS(0);
        this.CHANGE_PLAY_INDEX(0);
      }
    });
  },
  beforeDestroy() {
    this.$EventBus.$off("truck_init");
  },
  methods: {
    ...mapMutations([
      "CHANGE_PLAY_INDEX",
      "CHANGE_PLAY_STATUS" // 播放状态 0.待开始  1.待暂停或停止
    ]),
    changeStatus() {
      this.CHANGE_PLAY_STATUS(this.truckPlayStatus === 0 ? 1 : 0);
      this.$EventBus.$emit("truck_player_onPlay", this.truckPlayStatus);
    },
    play() {
      if (this.truckAllPoints.length === 0) {
        this.$message({
          message: $t('monitor.track.player_box.noTrack'),
          type: "warning"
        });
        this.$EventBus.$emit("truck_list_filterDisabled", false);
        return false;
      }
      this.changeStatus();
    },
    go(foot) {
      const index = this.truckPlayIndex + foot;
      if (index > this.truckAllPoints.length - 1 || index < 0) {
        this.$message({
          message: $t('monitor.track.player_box.end'),
          type: "warning"
        });
        return false;
      }
      this.$EventBus.$emit("truck_player_onGo", index);
    },
    moveSlider(s) {
      if (s !== this.truckPlayIndex) {
        /* 防抖*/
        debounce(this.CHANGE_PLAY_INDEX(s), 100);
      }
    },
    changeSlider() {
      if (this.truckAllPoints.length === 0) {
        return;
      }
      if (this.truckPlayStatus === 1) {
        this.CHANGE_PLAY_STATUS(0);
        this.$EventBus.$emit("truck_player_onPlay", this.truckPlayStatus);
      }
      this.$EventBus.$emit("truck_player_onGo", this.truckPlayIndex);
    }
  }
};
</script>
<style lang="scss" scoped>
.playAll {
  min-width: 130px;
  height: 59px;
  border-right: 1px transparent solid;
  border-color: #343e61;
  .playLR {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .button {
    width: 30px;
    height: 30px;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;
  }
}

.switch {
  height: 59px;
  border-left: 1px transparent solid;
  border-color: #343e61;
  ::deep .el-radio-button--mini .el-radio-button__inner {
    padding: 7px 7px;
    background-color: rgba(0, 0, 0, 0.6);
    border: 0;
    color: #fff;
  }
  ::deep .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    background-color: #fff;
    color: #000;
    border: 0;
    box-shadow: -1px 0 0 0 #000;
  }
}

.progress {
  // width: 100%;
  min-width: 100px;
  height: 59px;

  .progress-up {
    position: absolute;
    font-size: 10px;
    // width: calc(100% - 130px);
    left: 140px;
    top: 3px;
    height: 10px;
  }
  .progress-middle {
    min-width: 300px;
    // height: 59px;
    // width: 90%;
    padding: 10px 20px;
    ::deep .el-slider__bar {
      background: #21cbfa;
      background: linear-gradient(to right, #21cbfa 0%, #1a56e8 100%);
      height: 5px;
    }
    ::deep .el-slider__runway {
      background: #4b5367;
      height: 5px;
      margin: 10px 0;
    }
    ::deep .el-slider__button-wrapper {
      top: -16px;
    }
  }

  .progress-down {
    position: absolute;
    margin-top: 9px;
    font-size: 10px;
    // width: calc(100% - 320px);
    top: 34px;
    left: 140px;
    right: 180px;
    height: 20px;
  }
}

// position
.flex {
  display: -webkit-flex; /* Safari */
  display: flex;
}

.row {
  flex-direction: row;
}

.column {
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

:root .custom-theme {
  filter: none;
}
</style>
