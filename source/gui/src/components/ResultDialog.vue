<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="isShown"
      width="500"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Ваша сокращенная ссылка
        </v-card-title>
        <v-card-text>
          <p class="title font-weight-light">
            {{ finalLink }}
          </p>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            @click="copyToClipboard(finalLink)"
          >
            скопировать
          </v-btn>
          <v-btn
            color="red darken-1"
            flat
            @click="isShown = false"
          >
            закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
