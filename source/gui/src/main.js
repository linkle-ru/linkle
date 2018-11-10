import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import VueYandexMetrika from 'vue-yandex-metrika'

Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueYandexMetrika, {
  id: 46361133,
  env: process.env.NODE_ENV
})

export const shared = new Vue({
  data: {
    origin: window.location.origin
  }
})

new Vue({
  el: '#app',
  render: h => h(App)
})
