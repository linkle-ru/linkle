import Vue from 'vue'
import App from './App'
import Vuetify from 'vuetify'
import VueYandexMetrika from 'vue-yandex-metrika'
import sanitizeHTML from 'sanitize-html'

Vue.prototype.$sanitize = sanitizeHTML
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

Sentry.init({
  dsn: 'https://66edcc5a04734a39a23978595e18f3f7@sentry.io/1408791'
})

new Vue({
  el: '#app',
  render: h => h(App)
})
