<template>
  <Wait />
</template>

<script>
import Wait from '../../components/Wait'
export default {
  components: {
    Wait
  },
  sockets: {
    connect() {
      this.id = this.$socket.id
    }
  }
}
</script>

<style scoped>
</style>