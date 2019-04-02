<template>
  <el-container>
    <link rel="stylesheet" href="https://at.alicdn.com/t/font_1090066_x953u8u0kzr.css">
    <el-header>
      <div class="top-bar">
        <div class="admin-logo">花喵电台后台管理</div>
        <div class="admin-info">
          <img src="@/assets/images/head.jpg" alt="ronglecat">
          <span>ronglecat</span>
          <el-dropdown @command="handleCommand">
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="view">查看</el-dropdown-item>
              <el-dropdown-item>新增</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          :router="true"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/fmcat">
            <i class="el-icon-menu"></i>
            <span slot="title">概览</span>
          </el-menu-item>
          <el-menu-item index="/fmcat/music">
            <i class="el-icon-star-on"></i>
            <span slot="title">音乐推荐管理</span>
          </el-menu-item>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>博客管理</span>
            </template>
            <el-menu-item index="/fmcat/blog">博客列表</el-menu-item>
            <el-menu-item index="/fmcat/blog/add">添加博客</el-menu-item>
            <el-menu-item index="/fmcat/blog/tag">标签管理</el-menu-item>
            <el-menu-item index="/fmcat/blog/class">分类管理</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <transition name="page">
          <router-view></router-view>
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true
    };
  },
  created(){
    document.title='花喵电台后台管理'
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleCommand(command) {
      this.$message("click on item " + command);
      console.log(command);
    }
  }
};
</script>

<style lang="scss">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  // min-height: 400px;
  height: 100%;
}

html,
body,
#__nuxt,
#__layout {
  height: 100%;
}

.top-bar {
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);

  .admin-logo {
    font-size: 24px;
    line-height: 60px;
    padding-left: 20px;
    color: #909399;
  }

  .admin-info {
    height: 60px;
    display: flex;
    padding-right: 20px;
    padding-top: 10px;
    line-height: 40px;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    span {
      padding-right: 15px;
    }
  }
}

.el-container {
  border-top: 0 !important;
  height: 100%;
  background: #eef5f9;
}

.el-header {
  padding: 0;
}

.el-dropdown {
  i[class^="el-icon"] {
    font-size: 20px;
    vertical-align: -2px;
  }
}

.top-block {
  line-height: 40px;
  align-items: center;
  color: #666;

  .iconfont {
    font-size: 28px;
    padding-right: 15px;
    color: inherit;
    opacity: 0.8;
  }

  span {
    padding: 0 5px;
  }
}

.el-main {
  height: 100%;
}

.el-tag--mini {
  margin-left: 4px;
  cursor: pointer;

  &:first-child {
    margin-left: 0;
  }
}
</style>
