<template>
  <v-app id="app">
    <v-snackbar
      v-model="showAlert"
      :timeout="2000"
      :top="true"
      color="error"
    >
      {{ alertMessage }}
    </v-snackbar>
    <v-container>
      <p class="display-2 font-weight-black text-uppercase">
        URL Shortener
        <span class="font-italic text-capitalize headline font-weight-light">
          developer beta
        </span>
      </p>
      <v-layout
        row
        wrap
      >
        <v-flex
          xs12
          sm8
          md7
          lg4
        >
          <v-text-field
            v-model="href"
            :rules="hrefRules"
            placeholder="https://example.link"
            @keyup.enter="shorten()"
          />
        </v-flex>
        <v-flex>
          <v-btn
            :disabled="progress"
            depressed
            color="primary"
            @click="shorten()"
          >Сократить
          </v-btn>
        </v-flex>
      </v-layout>
      <!--todo: лучше лоадер https://vuetifyjs.com/en/components/dialogs#example-loader-->
      <v-slide-y-transition>
        <v-progress-linear
          v-show="progress"
          :indeterminate="true"
        />
      </v-slide-y-transition>
      <v-slide-y-transition>
        <v-alert
          v-show="isOffline"
          value="true"
          color="warning"
          icon="wifi_off"
        >
          У Вас отвалился Интернет
        </v-alert>
      </v-slide-y-transition>
      <history :source="links" />
      <template>
        <div class="text-xs-center">
          <v-dialog
            v-model="dialog"
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
                  {{ dialogMessage }}
                </p>
              </v-card-text>

              <v-divider />

              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="primary"
                  flat
                  @click="copyToClipboard(dialogMessage)"
                >
                  скопировать
                </v-btn>
                <v-btn
                  color="red darken-1"
                  flat
                  @click="dialog = false"
                >
                  закрыть
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </template>
    </v-container>
    <legal />
  </v-app>
</template>

<script>
import {shared} from './main'
import axios from 'axios'
import copyToClipboard from 'copy-to-clipboard'
import History from './components/History'
import Legal from './components/Legal'

export default {
  components: { Legal, History },
  data: () => ({
    progress: false,
    isOffline: false,
    dialog: false,
    dialogMessage: '',
    showAlert: false,
    alertMessage: '',
    href: '',
    hrefRules: [
      v => !(/\s/g.test(v)) || !v || 'Это точно ссылка?'
    ],
    links: []
  }),
  watch: {
    links() {
      localStorage.linkHistory = JSON.stringify(this.links)
    }
  },
  created() {
    try {
      this.links = JSON.parse(localStorage.linkHistory)
    } catch (e) {
      this.links = []
    }

    addEventListener('online', () => {
      this.isOffline = false
    })

    addEventListener('offline', () => {
      this.isOffline = true
    })
  },
  methods: {
    displayError(message) {
      this.alertMessage = message
      this.showAlert = true
    },
    addLink(name, href, title) {
      this.links.unshift({
        href,
        short_url: name,
        title
      })

      this.dialog = true
      this.href = ''
      this.dialogMessage = `${shared.origin}/${name}`
    },
    shorten() {
      // todo: проверка на существование сайта на стороне клиента
      this.progress = true

      axios
        .post(`${shared.origin}/api/v1/aliases?lang=ru`, { href: this.href })
        .then(response => {
          return new Promise((resolve, reject) => {
            if (response.data.status === 'ok') {
              resolve(response.data.payload)
            } else {
              reject(response.data.reason)
            }
          })
        })
        .then(payload => {
          this.addLink(payload.name, payload.href, payload.title)
        }, err => {
          err = typeof(err) === 'object' ? 'Что-то пошло очень не так' : err

          this.displayError(err)
        })
        .finally(() => {
          this.progress = false
        })
    },
    copyToClipboard
  }
}
</script>

<style>
  @import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons';
  @import 'vuetify/dist/vuetify.min.css';
</style>
