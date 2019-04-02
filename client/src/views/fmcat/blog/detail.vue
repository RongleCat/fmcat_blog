<template>
  <div class="fmcat-child-container">
    <div class="top-container">
      <el-button type="primary" icon="el-icon-back" circle @click="$router.go(-1)"></el-button>
    </div>
    <div class="html-container color-block vertical" v-html="html">

    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return {
        html:''
      }
    },
    created(){
      let that = this
      this.$axios('/fmcat/blog/detail?id=' + this.$route.params.id).then(r=>{
        that.html = r.data.editItem.html;
      })
    }
  }

</script>

<style scoped>
.top-container{
  padding-bottom: 20px;
}
</style>
