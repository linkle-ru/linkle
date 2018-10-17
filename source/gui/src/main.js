// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
