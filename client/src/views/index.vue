<template>
  <el-container class="show-container" :style="{backgroundImage:`url('${getMusicBackground}?x-oss-process=image/interlace,1/quality,q_90')`}">
    <link rel="stylesheet" href="https://at.alicdn.com/t/font_1089720_61nu5re0nqu.css">
    <audio preload="load" id="player" hidden autoplay playbackRate="1.5" />
    <el-aside width="240px" class="main-aside" :class="[asideClose?'close':'']">
      <div class="my-info">
        <img src="@/assets/images/head.jpg" alt>
        <p>花喵电台</p>
      </div>
      <nav class="nav-list">
        <router-link class="item" to="/" title="首页" exact>
          <i class="iconfont icon-cd" :class="[playing?'rotate':'']"></i>
          <span>首页</span>
        </router-link>
        <router-link class="item" to="/blog" title="博客">
          <i class="iconfont icon-document"></i>
          <span>博客</span>
        </router-link>
        <!-- <router-link class="item" to="/works" title="前端">
          <i class="iconfont icon-lab"></i>
          <span>前端</span>
        </router-link> -->
        <!-- <router-link class="item" to="/design" title="设计">
          <i class="iconfont icon-sun"></i>
          <span>设计</span>
        </router-link> -->
        <router-link class="item" to="/chat" title="聊天室">
          <i class="iconfont icon-messages"></i>
          <span>聊天室</span>
        </router-link>
      </nav>
      <div class="bottom-info" v-if="!asideClose">
        <div class="runing-time">
          <div class="cat-paw">
            <div class="outer-ring">
              <div class="item-1"></div>
              <div class="item-2"></div>
              <div class="item-3"></div>
              <div class="item-4"></div>
              <div class="item-5"></div>
              <div class="item-6"></div>
              <div class="item-7"></div>
              <div class="item-8"></div>
              <div class="item-9"></div>
              <div class="item-10"></div>
              <div class="item-11"></div>
              <div class="item-12"></div>
            </div>
            <div class="iconfont icon-cat-paw"></div>
          </div>
          <div class="time-text">已运行39天18小时56秒</div>
        </div>
        <a class="github-link" href="https://github.com/RongleCat" target="_blank"
          title="ronglecat的github主页">
          <span class="iconfont icon-git"></span>ronglecat@163.com
        </a>
      </div>
      <transition name="page">
        <div class="ctrl-list" v-if="asideClose && !tooShort">
          <i class="iconfont icon-backward" title="上一曲" @click="lastOne"></i>
          <i class="iconfont icon-pause" title="暂停" v-if="playing" @click="playStateCtrl"></i>
          <i class="iconfont icon-play" title="播放" v-else @click="playStateCtrl"></i>
          <i class="iconfont icon-forward" title="下一曲" @click="nextOne"></i>
          <i class="iconfont icon-volume" title="音量" :class="[muteing?'disabled':'']"
            @click.self="setMuted"></i>
        </div>
      </transition>
    </el-aside>
    <el-main>
      <transition name="page">
        <keep-alive>
          <router-view v-if="$route.meta.cache"></router-view>
        </keep-alive>
      </transition>
      <transition name="page">
        <router-view v-if="!$route.meta.cache"></router-view>
      </transition>
    </el-main>
  </el-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import dayjs from 'dayjs'
export default {
  data() {
    return {
      sideOpen: true,
      tooShort: false
    }
  },
  created() {
    let that = this
    document.title = '花喵电台'
    window.addEventListener(
      'resize',
      function(e) {
        if (e.target.innerHeight <= 650) {
          that.tooShort = true
        } else {
          if (that.tooShort) {
            that.tooShort = false
          }
        }
      },
      false
    )
  },
  computed: {
    ...mapGetters({
      getMusicBackground: 'getMusicBackground'
    }),
    ...mapState(['musicList', 'playIndex', 'playing', 'asideClose', 'muteing'])
  },
  watch: {
    playIndex(nv) {
      window.musicPlayer.currentTime = 0
      window.musicPlayer.src = this.musicList[nv].music_url
      window.musicPlayer.load()
    },
    playing(nv) {
      if (!nv) {
        window.musicPlayer.pause()
      } else {
        window.musicPlayer.play()
      }
    },
    muteing(nv) {
      window.musicPlayer.muted = nv
    }
  },
  async mounted() {
    let that = this
    let {
      data: { musicList }
    } = await that.$axios.get('/home/music')
    this.$store.commit('setMusicList', musicList)
    let player = (window.musicPlayer = document.querySelector('#player'))
    player.currentTime = 0
    player.volume = 0.5
    player.src = musicList[this.playIndex].music_url
    player.load()
    player.onended = function(e) {
      let listLenght = musicList.length
      if (that.playIndex === listLenght - 1) {
        that.$store.commit('setPlayIndex', 0)
      } else {
        that.$store.commit('setPlayIndex', that.playIndex + 1)
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
    }
  }
}
</script>

<style lang="scss">
.show-container {
  height: 100vh;
  background-size: cover !important;
  background-position: center !important;
  min-width: 1200px;

  .el-main {
    height: 100%;
    overflow-y: auto;
    padding: 0;
  }

  .main-aside {
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    padding-top: 100px;
    transition: all 0.2s;
    position: relative;

    &.close {
      width: 60px !important;
      padding-top: 20px;

      .my-info {
        padding: 0 10px;

        p {
          display: none;
          // opacity: 0;
        }
      }

      .nav-list {
        .nuxt-link-active {
          background: rgba(0, 0, 0, 0.4);
        }
        a {
          padding-left: 0;
          justify-content: center;
          span {
            // opacity: 0;
            display: none;
          }

          .iconfont {
            margin-right: 0;
          }
        }
      }
    }
  }
}

.my-info {
  padding: 0 50px;
  text-align: center;
  transition: all 0.2s;

  img {
    max-width: 100%;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: all 0.2s;
  }

  p {
    padding-top: 10px;
    font-size: 24px;
    line-height: 1.5;
    font-weight: 400;
  }
}

.nav-list {
  padding-top: 20px;

  .item {
    height: 60px;
    padding: 10px 0;
    display: flex;
    align-items: center;
    padding-left: 70px;
    cursor: pointer;
    transition: all 0.2s;
    color: #fff;
    text-decoration: none;

    .iconfont {
      font-size: 24px;
      margin-right: 10px;
      display: inline-block;
      &.rotate {
        animation: rotate 3s linear infinite;
      }
    }

    span {
      transition: opacity 0.2s;
    }

    &:hover,
    &.nuxt-link-active {
      background: rgba(0, 0, 0, 0.2);
    }
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

.ctrl-list {
  position: absolute;
  bottom: 0;
  i {
    display: block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    font-size: 28px;
    opacity: 0.7;
    transition: background, opacity 0.2s;
    &:hover {
      background: rgba(0, 0, 0, 0.2);
      opacity: 1;
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

    &.icon-backward {
      transform: rotate(90deg);
    }
    &.icon-forward {
      transform: rotate(90deg);
    }
  }
}

.bottom-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  .github-link {
    text-align: center;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(#fff, 0.7);
    transition: color 0.2s;
    text-decoration: none;
    padding-bottom: 40px;
    span.iconfont {
      padding-right: 5px;
    }
    &:hover {
      color: #fff;
    }
  }
  .runing-time {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding-bottom: 20px;
    .cat-paw {
      width: 60px;
      height: 60px;
      margin-bottom: 20px;
      position: relative;
      .iconfont {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .outer-ring {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        animation: rotate 10s infinite linear;
        [class^='item'] {
          width: 100%;
          height: 4px;
          position: absolute;
          top: 28px;
          left: 0;
          &:after {
            content: '';
            width: 4px;
            height: 4px;
            background: #fff;
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            border-radius: 50%;
            // animation: rotate .1s infinite linear;
          }
        }
        @for $i from 0 through 11 {
          .item-#{$i + 1} {
            transform: rotate(30deg * $i);
          }
        }
      }
    }
  }
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360);
  }
}
</style>
