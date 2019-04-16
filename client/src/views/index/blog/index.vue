<template>
  <div class="bloglist-container">
    <div class="class-container">
      <div
        class="item"
        :class="[classIndex===index?'actived':'','item-'+(index+1)]"
        @click="classSelect(index)"
        v-for="(item,index) in classList"
        :key="index"
      >
        <label>{{item.class_name}}</label>
        <span>{{item.count}}</span>
      </div>
    </div>
    <div class="blog-body">
      <div class="blog-list">
        <div class="item" v-for="(item,index) in blogList" :key="index">
          <router-link :to="'/blog/'+item.id">
            <img :src="item.cover" alt="" v-if="item.cover">
            <div class="item-info">
              {{item.title}}
            </div>
          </router-link>
        </div>
      </div>
      <div class="right-side">1</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classIndex: 0,
      blogClassList: null,
      blogList: [],
      currentPage: 1
    };
  },
  async created() {
    let that = this;
    let {
      data: { blogClassList }
    } = await that.$axios.get("/home/blogClass");
    that.blogClassList = blogClassList;
    that.getTableList(that.currentPage);
  },
  computed: {
    classList() {
      let allCount = 0;
      if (this.blogClassList) {
        this.blogClassList.forEach(item => {
          allCount += item.count;
        });
        return [
          { class_name: "全部", count: allCount, id: null },
          ...this.blogClassList
        ];
      }
    }
  },
  methods: {
    classSelect(index) {
      this.classIndex = index;
    },
    getTableList(page) {
      let that = this;
      this.currentPage = page;
      let get_loading = that.$loading({
        target: ".bloglist-container"
      });
      that
        .$axios({
          url: `/home/blogList?page=${page}&pagesize=10`
        })
        .then(r => {
          let { data } = r;
          that.blogCount = data.blogCount;
          that.blogList = data.blogList;
          get_loading.close();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
$colors: (
    color: #409eff
  ),
  (
    color: #f56c6c
  ),
  (
    color: #e6a23c
  ),
  (
    color: #909399
  ),
  (
    color: #67c23a
  ),
  (
    color: #ff8c00
  );
.bloglist-container {
  background: #fff;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .class-container {
    width: 100%;
    display: flex;
    padding-bottom: 20px;
    user-select: none;
    .item {
      flex: 1;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      margin-left: 20px;
      padding: 15px;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
      span {
        position: absolute;
        font-size: 48px;
        color: #f0f0f0;
        font-style: italic;
        top: 50%;
        right: 30px;
        transform: translateY(-50%);
        transition: all 0.2s;
      }
      label {
        font-size: 18px;
        display: inline-block;
        width: 18px;
        line-height: 1.2;
      }
      &:first-child {
        margin-left: 0;
      }

      @for $i from 1 through length($colors) {
        $item: nth($colors, $i);
        &.item-#{$i} {
          &.actived {
            background: map-get($item, color);
            color: #fff;
            box-shadow: 0
              0
              10px
              rgba($color: map-get($item, color), $alpha: 0.1);
            span {
              color: rgba($color: #fff, $alpha: 0.2);
            }
          }
          &:not(.actived):hover {
            background: rgba($color: map-get($item, color), $alpha: 0.5);
            color: rgba($color: #fff, $alpha: 1);
            box-shadow: 0
              0
              10px
              rgba($color: map-get($item, color), $alpha: 0.1);
            span {
              color: rgba($color: #fff, $alpha: 0.2);
            }
          }
        }
      }
    }
  }
}
.blog-body {
  flex: 1;
  display: flex;
  .blog-list {
    flex: 5;
    width: 100%;
    display: flex;
    flex-wrap:wrap;
    flex-shrink:0;
    .item {
      break-inside: avoid;
      background: #fff;
      margin-bottom: 20px;
      min-height: 150px;
      padding-right: 20px;
      a {
        display: block;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        img{
          width: 100%;
          display: block;
          height: 200px;
          object-fit: cover;
        }
      }
    }
    
    @media screen and (min-width: 2001px) and (max-width: 3000px) {
      .item{
        width: 25%;
        &:nth-child(4n){
          padding-right: 0;
        }
      }
    }

    @media screen and (min-width: 1201px) and (max-width: 2000px) {
      .item{
        width: 33%;
        &:nth-child(3n){
          padding-right: 0;
        }
      }
    }

    @media screen and (min-width: 0px) and (max-width: 1200px) {
      .item{
        width: 50%;
        &:nth-child(2n){
          padding-right: 0;
        }
      }
    }
  }
  .right-side {
    flex: 1;
  }
}
</style>
