<template>
  <div class="music-container">
    <div class="play-info">
      <div class="music-info">{{musicName}}</div>
      <div class="bg-info">图片来源：{{bgSourceL}}</div>
    </div>
    <div class="ctrl-tools">
      <i class="iconfont icon-backward" title="上一曲" @click="lastOne"></i>
      <i class="iconfont icon-pause" title="暂停" v-if="playing" @click="playStateCtrl"></i>
      <i class="iconfont icon-play" title="播放" v-else @click="playStateCtrl"></i>
      <i class="iconfont icon-forward" title="下一曲" @click="nextOne"></i>
      <i class="iconfont icon-volume" title="音量" :class="[muteing?'disabled':'']"
        @click.self="setMuted"></i>

      <div class="volume-container">
        <el-slider v-model="volumeCtrl" class="volume-bar" :show-tooltip="false"
          vertical height="100px"></el-slider>
        <span>{{volumeCtrl}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      volumeCtrl: 50
    }
  },
  computed: {
    ...mapGetters({
      musicName: 'getMusicName',
      bgSourceL: 'getBackgroundSource'
    }),
    ...mapState(['musicList', 'playIndex', 'playing', 'muteing'])
  },
  sockets: {
    connect() {
      console.log('%c您已进入花喵歌舞厅', 'color:#fff;background:green;padding:4px 8px;border-radius: 4px;')
    }
  },
  watch: {
    volumeCtrl(newValue) {
      window.musicPlayer.volume = newValue / 100
      if (newValue === 0) {
        this.$store.commit('setMutedState', true)
      } else {
        if (this.muteing) {
          this.$store.commit('setMutedState', false)
        }
      }
    }
  },
  methods: {
    setMuted() {
      this.$store.commit('setMutedState', !this.muteing)
    },
    playStateCtrl() {
      this.$store.commit('setPlayState', !this.playing)
    },
    lastOne() {
      let index = 0
      if (this.playIndex === 0) {
        index = this.musicList.length - 1
      } else {
        index = this.playIndex - 1
      }
      this.$store.commit('setPlayIndex', index)
    },
    nextOne() {
      let index = 0
      if (this.playIndex === this.musicList.length - 1) {
        index = 0
      } else {
        index = this.playIndex + 1
      }
      this.$store.commit('setPlayIndex', index)
    },
    getCurrentIndex() {
      return this.$store.state.music.playIndex
    }
  }
}
</script>

<style lang="scss" scoped>
.music-container {
  height: 100%;
  position: relative;
}

.ctrl-tools {
  position: absolute;
  bottom: 0;
  right: 0;
  color: #fff;
  padding: 20px;
  padding-left: 0;
  display: flex;

  .iconfont {
    position: relative;
    display: block;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 28px;
    margin-left: 5px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0.7;
    transition: opacity 0.2s;
    cursor: pointer;

    &:hover {
      opacity: 1;
      .volume-container {
        opacity: 1;
      }
    }
    &.icon-volume {
      position: relative;

      &:after {
        content: '';
        position: absolute;
        width: 35px;
        height: 3px;
        background: #fff;
        top: 50%;
        left: 50%;
        border-radius: 10;
        transform: translate(-50%, -50%) rotate(-30deg);
        opacity: 0;
      }

      &.disabled:after {
        opacity: 1;
      }
    }
  }
  .volume-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 60px;
    position: absolute;
    bottom: 85px;
    right: 20px;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.3);
    opacity: 0.7;
    transition: all 0.2s;
    span {
      font-size: 12px;
      line-height: 30px;
    }
    .volume-bar {
      margin-top: 15px;
      display: none;
    }
    &:hover {
      opacity: 1;
      .volume-bar {
        display: block;
      }
    }
  }
}

.play-info {
  color: #fff;
  font-size: 12px;
  font-family: '宋体';
  position: absolute;
  bottom: 20px;
  line-height: 60px;
  right: 280px;
  display: flex;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  padding: 0 20px;
  opacity: 0.7;
  transition: all 0.2s;
  .music-info {
    padding-right: 20px;
  }
  &:hover {
    opacity: 1;
  }
}
</style>
