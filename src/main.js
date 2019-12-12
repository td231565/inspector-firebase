import Vue from 'vue'
import App from './App.vue'
// import router from './router'
import store from './store'
import './config/db'
import VueMeta from 'vue-meta'
import { firestorePlugin } from 'vuefire'

Vue.config.productionTip = false

Vue.use(firestorePlugin)
Vue.use(VueMeta)

new Vue({
  // router,
  store,
  render: h => h(App)
}).$mount('#app')
