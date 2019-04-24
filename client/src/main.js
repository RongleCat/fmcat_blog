import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import './plugins/axios'
import './plugins/vue-mavon-editor'
import './plugins/highlight'
import './plugins/filter'
import './plugins/socket'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  // sockets: {
  //   connect: function() {
  //     console.log('%c已连接到花喵星球', 'color:#fff;background:green;padding:4px 8px;border-radius: 4px;')
  //   }
  // },
  render: h => h(App)
}).$mount('#app')