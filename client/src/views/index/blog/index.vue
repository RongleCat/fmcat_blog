<template>
  <div class="bloglist-container" ref="page">
    <div class="class-container">
      <div class="item"
        :class="[classIndex===index?'actived':'','item-'+(index+1)]"
        @click="classSelect(item,index)" v-for="(item,index) in classList"
        :key="index">
        <label>{{item.class_name}}</label>
        <span>{{item.count}}</span>
      </div>
    </div>
    <div class="blog-body">
      <div class="list-container">
        <!-- <transition-group name="slide" tag="div" class="blog-list" mode="out-in"> -->
        <div class="blog-list">
          <div class="item" v-for="item in blogList" :key="item.id" :class="[keepalive?'':'animation']">
            <span class="is-top" title="这篇博客已被置顶" v-if="item.is_top"></span>
            <router-link :to="'/blog/'+item.id">
              <img
                :src="item.cover+'?x-oss-process=image/auto-orient,1/interlace,1/resize,m_fill,w_600,h_400/quality,q_90'"
                alt v-if="item.cover">
              <div class="item-info">
                <h4>{{item.title}}</h4>
                <div class="value-line">
                  <span>
                    {{item.like}}
                    <span>赞</span>
                    {{item.hits}}
                    <span>阅读</span>
                  </span>
                  <span>{{item.update_time|dataFormat('YYYY-MM-DD HH:mm')}}</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <!-- </transition-group> -->
        <div class="loading-bar">
          <template v-if="listEmpty">暂无博客，@花喵发一篇</template>
          <template v-else-if="is_end">End.</template>
          <template v-else>
            <i class="el-icon-loading"></i>
            loading next page
          </template>
        </div>
      </div>
      <div class="right-side">
        <div class="query-rules">
          <el-tag closable v-if="queryClass.length" @close="queryClassRemove">
            {{queryClass[0].class_name}}</el-tag>
          <el-tag closable v-if="queryTag.length" @close="queryTagRemove"
            type="success">{{queryTag[0].tag_name}}</el-tag>
        </div>
        <div class="tag-query" v-if="blogTagList">
          <el-tag v-for="(item,index) in blogTagList" :key="index" size="small"
            type="success" @click="tagSelect(item)">{{item.tag_name}}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classIndex: 0,
      blogClassList: null,
      blogTagList: null,
      blogList: [],
      currentPage: 0,
      is_end: false,
      blogCount: 0,
      queryLock: false,
      queryClass: [],
      queryTag: [],
      listEmpty: false,
      keepalive:false
    }
  },
  async created() {
    let that = this
    // console.log(that.$route);
    let {
      data: { blogClassList }
    } = await that.$axios.get('/home/blogClass')
    let {
      data: { blogTagList }
    } = await that.$axios.get('/home/blogTag')
    that.blogClassList = blogClassList
    that.blogTagList = blogTagList

    let { type } = that.$route.query
    if (type) {
      that.classSelect(that.classList[type], parseInt(type))
    } else {
      that.currentPage = 1
    }
  },
  computed: {
    classList() {
      let allCount = 0
      if (this.blogClassList) {
        this.blogClassList.forEach(item => {
          allCount += item.count
        })
        return [{ class_name: '全部', count: allCount, id: null }, ...this.blogClassList]
      }
    }
  },
  mounted() {
    let that = this
    let $box = that.$refs.page
    $box.addEventListener('scroll', function(e) {
      let { scrollTop, clientHeight, scrollHeight } = e.target
      if (scrollTop + clientHeight >= scrollHeight - 100 && !that.is_end && !that.queryLock) {
        that.currentPage += 1
      }
    })
  },
  activated() {
    if (window.sessionStorage.getItem('scrollTop')) {
      this.$refs.page.scrollTop = parseInt(window.sessionStorage.getItem('scrollTop'))
    }
  },
  watch: {
    currentPage(nv, ov) {
      let that = this
      if (nv === -1) {
        that.getTableList(1, true)
      } else if (nv === 0) {
        return false
      } else {
        this.getTableList(nv)
      }
    }
  },
  methods: {
    classSelect(item, index) {
      this.classIndex = index
      if (index) {
        this.queryClass = [item]
      } else {
        this.queryClass = []
      }
      this.currentPage = -1
    },
    getTableList(page, remove) {
      let that = this
      let get_loading = null
      this.currentPage = page
      that.is_end = false
      that.listEmpty = false
      if (that.queryLock) {
        console.log('请求繁忙')
        return false
      }
      that.queryLock = true

      let class_id = that.queryClass.length ? that.queryClass[0].id : null
      let tag_id = that.queryTag.length ? that.queryTag[0].id : null

      that
        .$axios({
          url: `/home/blogList`,
          params: {
            page,
            pagesize: 12,
            class_id,
            tag_id
          }
        })
        .then(r => {
          let { data } = r
          that.blogCount = data.blogCount
          let sleep = 0
          if (remove) {
            that.blogList = []
            get_loading = that.$loading({
              target: '.bloglist-container'
            })
            sleep = 500
          }
          setTimeout(() => {
            that.blogList = [...that.blogList, ...data.blogList]
            that.queryLock = false
            get_loading && get_loading.close()
            if (that.blogList.length === that.blogCount) {
              that.is_end = true
            }
            // console.log(that.blogCount)
            if (data.blogCount == 0 && page === 1) {
              that.listEmpty = true
            }
            let box = this.$refs.page
            that.$nextTick(() => {
              if (box.scrollHeight - 200 <= box.clientHeight && that.blogCount > 12) {
                that.currentPage += 1
              }
            })
          }, sleep)
        })
    },
    queryClassRemove() {
      console.log('分类筛选关闭')
      this.queryClass = []
      this.classIndex = 0
      this.currentPage = -1
    },
    queryTagRemove() {
      console.log('标签筛选关闭')
      this.queryTag = []
      this.currentPage = -1
    },
    tagSelect(item) {
      this.queryTag = [item]
      this.currentPage = -1
    },
    addItem() {
      let arr = this.blogList.slice(0, 12)
      this.blogList = [...this.blogList, ...arr]
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'index-blog-detail') {
      this.$route.meta.cache = true
      window.sessionStorage.setItem('scrollTop', this.$refs.page.scrollTop)
    } else {
      this.$route.meta.cache = false
    }
    next()
  },
  deactivated() {
    this.keepalive = true
    window.sessionStorage.setItem('scrollTop', this.$refs.page.scrollTop)
  }
}
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
  min-height: 100%;
  overflow-y: auto;
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
            box-shadow: 0 0 10px rgba($color: map-get($item, color), $alpha: 0.1);
            span {
              color: rgba($color: #fff, $alpha: 0.2);
            }
          }
          &:not(.actived):hover {
            background: rgba($color: map-get($item, color), $alpha: 0.5);
            color: rgba($color: #fff, $alpha: 1);
            box-shadow: 0 0 10px rgba($color: map-get($item, color), $alpha: 0.1);
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
  display: flex;
  background: #fff;
  .list-container {
    width: 83.34%;
    .loading-bar {
      width: 100%;
      height: 200px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ccc;
      flex-direction: column;
      .el-icon-loading {
        font-size: 36px;
        color: #409eff;
        margin-bottom: 10px;
      }
    }
  }
  .blog-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .item {
      break-inside: avoid;
      background: #fff;
      margin-bottom: 20px;
      min-height: 150px;
      padding-right: 20px;
      flex-grow: 0;
      position: relative;
      &.animation {
        transform: translateY(50px);
        opacity: 0;
        animation: slide-in 0.2s forwards;
      }
      .is-top {
        display: block;
        position: absolute;
        width: 12px;
        height: 12px;
        top: 10px;
        left: 10px;
        border-radius: 50%;
        background: #409eff;
        box-shadow: 0 0 5px rgba(#000, 0.2) inset, 0 0 10px rgba(#fff, 0.3);
      }
      a {
        display: block;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        width: 100%;
        color: #333;
        text-decoration: none;
        img {
          width: 100%;
          display: block;
          height: 200px;
          object-fit: cover;
        }
        .item-info {
          padding: 10px;
          h4 {
            font-weight: normal;
            font-size: 16px;
            line-height: 1.2;
          }
          .value-line {
            font-size: 12px;
            font-family: '宋体';
            color: #ccc;
            display: flex;
            justify-content: space-between;
            padding-top: 10px;
          }
        }
      }
      @for $i from 1 through 12 {
        &:nth-child(#{$i}n) {
          animation-delay: $i * 0.02s;
        }
      }
    }

    @media screen and (min-width: 2001px) and (max-width: 3000px) {
      .item {
        width: 25%;
        a {
          img {
            height: 250px;
          }
        }
        &:nth-child(4n) {
          padding-right: 0;
        }
      }
    }

    @media screen and (min-width: 1201px) and (max-width: 2000px) {
      .item {
        width: 33.33%;
        &:nth-child(3n) {
          padding-right: 0;
        }
      }
    }

    @media screen and (min-width: 0px) and (max-width: 1200px) {
      .item {
        width: 50%;
        a {
          img {
            height: 250px;
          }
        }
        &:nth-child(2n) {
          padding-right: 0;
        }
      }
    }
  }
  .right-side {
    width: 16.66%;
    padding-left: 20px;
    user-select: none;
    .query-rules {
      .el-tag {
        margin-right: 5px;
        margin-bottom: 10px;
      }
    }
    .tag-query {
      .el-tag {
        margin: 0 5px 5px 0;
        cursor: pointer;
        filter: saturate(0%);
        transition: all 0.1s;
        &:hover {
          filter: saturate(100%);
        }
        &:active {
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
