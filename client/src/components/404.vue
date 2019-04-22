<template>
  <div class="error-view">
    <div class="fore">
      <span :style="{color:getRandomColor()}">4</span>
      <span :style="{color:getRandomColor()}">0</span>
      <span :style="{color:getRandomColor()}">4</span>
    </div>
    <p>{{msg}}</p>
    <p>
      返回
      <router-link :to="path" replace>{{pathText}}</router-link>
    </p>
  </div>
</template>

<script>
export default {
  props: ['msg', 'path', 'pathText'],
  methods: {
    getRandomColor() {
      return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
    }
  }
}
</script>

<style lang="scss" scoped>
.error-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px);
  color: #2c3e50;
  font-size: 18px;
  line-height: 2;
  .fore {
    font-size: 188px;
    opacity: 0.2;
    line-height: 1.2;
  }
  a{
    color: #409EFF;
    text-decoration: none;
    transition: color .2s;
    &:hover{
      opacity: .8;
    }
  }
}
</style>