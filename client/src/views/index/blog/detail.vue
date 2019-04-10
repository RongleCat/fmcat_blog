<template>
  <div class="blog-detail">
    <div class="block-content" v-highlight>
      <template v-if="detail">
        <h3 class="title">{{detail.title}}</h3>
        <div class="info">编辑时间：{{detail.update_time|dataFormat}}</div>
        <div v-html="detail.html" class="detail-content"></div>
      </template>
    </div>
  </div>
</template>

<script>
import day from "dayjs";
export default {
  data() {
    return {
      detail: null
    };
  },
  async created() {
    let { data } = await this.$axios(
      "/home/blogDetail?id=" + this.$route.params.id
    );
    this.detail = data;
  }
};
</script>

<style lang="scss" scoped>
.blog-detail {
  background: rgba(255, 255, 255, 0.7);
  overflow-y: auto;
  padding: 20px 0;
  .block-content {
    width: 700px;
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
</style>