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
  </div>
</template>

<script>
export default {
  data() {
    return {
      classIndex: 0,
      blogClassList: null
    };
  },
  async mounted() {
    let that = this;
    let {
      data: { blogClassList }
    } = await that.$axios.get("/home/blogClass");
    that.blogClassList = blogClassList;
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
  height: 100%;
  padding: 20px;
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
</style>
