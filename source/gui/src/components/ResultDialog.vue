<template>
  <div class="text-xs-center">
    <VDialog
      v-model="isShown"
      width="500"
    >
      <VCard>
        <VCardTitle
          class="headline grey lighten-2"
          primary-title
        >
          Ваша сокращенная ссылка
        </VCardTitle>
        <VCardText>
          <p class="title font-weight-light">
            {{ finalLink }}
          </p>
        </VCardText>
        <VDivider />
        <VCardActions>
          <VSpacer />
          <VBtn
            color="primary"
            flat
            @click="copyToClipboard(finalLink)"
          >
            скопировать
          </VBtn>
          <VBtn
            color="red darken-1"
            flat
            @click="isShown = false"
          >
            закрыть
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import copyToClipboard from 'copy-to-clipboard'
import {shared} from '../main'

export default {
  data: () => ({
    shared,
    isShown: false,
    finalLink: ''
  }),
  created() {
    this.$root.$on('shortened', link => {
      this.isShown = true
      this.finalLink = `${shared.origin}/${link.name}`
    })
  },
  methods: {
    copyToClipboard
  }
}
</script>
