<template>
  <div class="blog-detail">
    <div class="block-content" v-highlight>
      <template v-if="detail">
        <h3 class="title">{{detail.title}}</h3>
        <div class="info">编辑时间：{{detail.update_time|dataFormat}}</div>
        <div v-html="detail.html" class="detail-content"></div>
      </template>

      <div class="float-tools">
        <transition-group name="page">
          <div class="btn-item btn-top" key="1" v-if="topBtnShow" @click="backTop">
            <i class="iconfont icon-back"></i>
          </div>
          <div class="btn-item btn-like actived" key="2">
            <i class="iconfont icon-heart"></i>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import day from "dayjs";
export default {
  data() {
    return {
      detail: null,
      topBtnShow: false
    };
  },
  async created() {
    let { data } = await this.$axios(
      "/home/blogDetail?id=" + this.$route.params.id
    );
    this.detail = data;
  },
  mounted() {
    let that = this;
    document
      .querySelector(".blog-detail")
      .addEventListener("scroll", function(e) {
        if (e.target.scrollTop >= 1000) {
          that.topBtnShow = true;
        } else {
          that.topBtnShow = false;
        }
      });
  },
  methods: {
    backTop() {
      document.querySelector('.blog-detail').scrollTop = 0
      // let Tween = {
      //   Linear: function(t, b, c, d) {
      //     return (c * t) / d + b;
      //   }
      // }
      // let $container = document.querySelector('.blog-detail')
      // Math.tween = Tween;
      // let t = 1;
      // const b = $container.scrollTop;
      // const c = 1;
      // const d = .5;
      // let timer;
      // timer = requestAnimationFrame(function fn() {
      //   if ($container.scrollTop > 0) {
      //     t = t - 100;
      //     const backTop = Tween.Linear(t, b, c, d);
      //     $container.scrollTop = backTop;
      //     timer = requestAnimationFrame(fn);
      //   } else {
      //     cancelAnimationFrame(timer);
      //   }
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
.blog-detail {
  background: rgba(255, 255, 255, 0.7);
  overflow-y: auto;
  padding: 20px 0;
  .block-content {
    position: relative;
    width: 900px;
    margin: 0 auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
    .title {
      font-size: 30px;
      color: #333;
    }
    .info {
      font-size: 12px;
      font-family: "宋体";
      color: #999;
      line-height: 40px;
      border-bottom: 3px solid #f0f0f0;
    }
    .detail-content {
      padding: 10px 0;
    }
  }
}

.float-tools {
  position: fixed;
  bottom: 5em;
  margin-left: 900px;
  .btn-item {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    cursor: pointer;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
    color: #ccc;
    transition: all 0.2s;
    i {
      font-size: 20px;
      color: inherit;
      &.icon-back {
        display: block;
        transform: rotate(90deg);
        padding-right: 2px;
      }
    }
    &.btn-top {
      &:hover,
      &.actived {
        background: #409eff;
        color: #fff;
        box-shadow: 0 2px 12px 0 rgba(#409eff, 0.2);
      }
    }
    &.btn-like {
      &:hover,
      &.actived {
        background: #f2963a;
        color: #fff;
        box-shadow: 0 2px 12px 0 rgba(#f2963a, 0.2);
      }
    }
  }
}
</style>