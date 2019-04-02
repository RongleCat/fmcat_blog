<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  watch: {
    $route(to, form) {
      if (to.fullPath !== "/") {
        this.$store.commit("setAsideClose", true);
      } else {
        this.$store.commit("setAsideClose", false);
      }
    }
  }
};
</script>

<style lang="scss">
@import './assets/scss/common.scss';
#app {
  width: 100%;
  height: 100%;
}
html {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

body {
  min-width: 1200px;
}
.el-header {
  position: relative;
  z-index: 60;
  border-bottom: 0;
}
.el-aside {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.color-block {
  display: flex;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
  border: 1px solid #d7dfe3;
  padding: 20px;
  min-height: 100%;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  &.mouse-hover {
    cursor: pointer;
    &:hover {
      background: #f8f8f8;
      box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.1);
      color: #333;
    }
  }
  &.vertical {
    flex-direction: column;
  }
}

.color-blue {
  color: #409eff;
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background: #fff;
}

.page-enter-active {
  transition: all .2s ease-out;
}
.page-leave-active {
  transition: all .2s ease-in;
}
.page-enter,
.page-leave-active {
  opacity: 0;
}
.el-main{
  position: relative;
  >*{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

</style>
