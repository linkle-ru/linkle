<template>
  <VSlideYTransition>
    <VAlert
      v-show="isOffline"
      value="true"
      color="warning"
      icon="wifi_off"
    >
      Соединение с Интернетом потеряно
    </VAlert>
  </VSlideYTransition>
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
