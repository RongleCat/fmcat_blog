<template>
  <PageError :path="path" :pathText="pathText" :code="code">{{msg}}</PageError>
</template>

<script>
import PageError from '@/components/Error.vue'
let codeList = {
  401: {
    code: 401,
    path: '/',
    pathText: '首页',
    msg: '对不起，没有权限'
  }
}
export default {
  data() {
    return {
      error: null
    }
  },
  components: {
    PageError
  },
  created() {
    Object.assign(this, codeList[this.$route.query.code])
  }
}
</script>

<style lang="scss" scoped>
</style>