<template>
  <v-slide-y-transition>
    <v-alert
      v-show="isOffline"
      value="true"
      color="warning"
      icon="wifi_off"
    >
      Соединение с Интернетом потеряно
    </v-alert>
  </v-slide-y-transition>
</template>

<script>
export default {
  data () {
    return {
      isOffline: null
    }
  },
  mounted() {
    addEventListener('online', () => {
      this.isOffline = false
    })

    addEventListener('offline', () => {
      this.isOffline = true
    })
  }
}
</script>
