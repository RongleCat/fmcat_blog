import Vue from 'vue'
import SocketIO from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import store from '../store'

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: SocketIO('wss://api.fmcat.top'),
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    }
  })
)