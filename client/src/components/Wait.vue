<template>
  <div class="deving-container">
    <img src="@/assets/images/dev.png" alt="">
    <p>正在施工，即将上线</p>
  </div>
</template>

<script>
  export default {

  }

</script>

<style lang="scss">
  .deving-container{
    height: 100%;
    background: rgba(255,255,255,.95);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img{
      width: 500px;
    }
    p{
      font-size: 24px;
      color: #666;
    }
  }
</style>
