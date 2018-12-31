<template>
  <VApp id="app">
    <VSnackbar
      v-model="alert.show"
      :timeout="2000"
      :top="true"
      color="error"
    >
      {{ alert.message }}
    </VSnackbar>
    <VContainer>
      <h1 class="blue--text display-2 font-weight-black text-uppercase">
        Linkle.ru
        <span class="font-italic text-lowercase headline font-weight-light">
          v{{ packageJson.version }}
        </span>
      </h1>
      <h2 class="font-weight-thin blue--text display-1">
        Сервис укорачивания ссылок
      </h2>
      <h3 class="headline font-weight-thin green--text">
        С Новым Годом!🎄
      </h3>
      <Connection />
      <LinkForm />
      <History />
    </VContainer>
    <Legal />
  </VApp>
</template>

<script>
import packageJson from '../../../package.json'
import History from './components/History'
import Connection from './components/Connection'
import Legal from './components/Legal'
import LinkForm from './components/LinkForm'

export default {
  components: { Legal, History, Connection, LinkForm },
  data: () => ({
    packageJson,
    alert: {
      show: false,
      message: null
    }
  }),
  created() {
    this.$root.$on('alert', this.showAlert)
  },
  methods: {
    showAlert(message) {
      this.alert.show = true
      this.alert.message = message
    }
  }
}
</script>

<style>
  @import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons';
  @import 'vuetify/dist/vuetify.min.css';
</style>
