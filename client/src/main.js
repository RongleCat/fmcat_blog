import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import './plugins/axios'
import './plugins/vue-mavon-editor'
import './plugins/highlight'
import './plugins/filter'
// import './plugins/socket'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')