<template>
  <div class="fmcat-child-container">
    <el-row :gutter="20" class="top-line">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="color-block top-block mouse-hover" @click="$router.push('/fmcat/music')">
            <i class="iconfont icon-play"></i>
            已添加 <span class="color-blue">9</span> 首音乐
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <div class="color-block top-block mouse-hover" @click="$router.push('/fmcat/blog')">
            <i class="iconfont icon-read"></i>
            已发布 <span class="color-blue">10</span> 篇博客
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addPopup: false
    }
  }
}
</script>

<style scoped>
</style>