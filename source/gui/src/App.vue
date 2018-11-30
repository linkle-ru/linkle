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
      <h1 class="blue--text display-2 font-weight-black text-uppercase">
        Linkle.ru
        <span class="red--text font-italic text-lowercase headline font-weight-light">
          beta
        </span>
      </h1>
      <!--<h2 class="font-italic">Сервис укорачивания ссылок</h2>-->
      <v-layout
        v-bind="binding"
        justify-space-around
      >
        <v-flex
          xs12
          sm4
          md6
        >
          <v-text-field
            v-model="href"
            clearable
            autofocus
            prepend-icon="explore"
            :rules="hrefRules"
            messages="Оригинальная ссылка"
            placeholder="https://example.link"
            @keyup.enter="shorten()"
          />
        </v-flex>
        <v-flex
          xs12
          sm4
          md3
        >
          <v-tooltip top>
            <v-text-field
              slot="activator"
              v-model="aliasName"
              prepend-icon="link"
              :placeholder="randomAlias"
              prefix="linkle.ru/"
              messages="Короткая ссылка"
              @keyup.enter="shorten()"
            />
            <span>Латиница, кириллица, 0-9 и _ -</span>
          </v-tooltip>
        </v-flex>
        <v-flex
          xs12
          sm2
          md2
        >
          <div class="text-xs-center">
            <v-btn
              :disabled="progress"
              depressed
              color="primary"
              @click="shorten()"
            >Сократить
            </v-btn>
          </div>
        </v-flex>
      </v-layout>
      <v-dialog
        v-model="progress"
        hide-overlay
        persistent
        width="300"
      >
        <v-card
          color="primary"
          dark
        >
          <v-card-text>
            Запрос обрабатывается
            <v-progress-linear
              indeterminate
              color="white"
              class="mb-0"
            />
          </v-card-text>
        </v-card>
      </v-dialog>
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
    randomAlias: null,
    aliasName: '',
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
  computed: {
    binding () {
      const binding = {}

      if (this.$vuetify.breakpoint.xsOnly) binding.column = true

      return binding
    }
  },
  watch: {
    links() {
      localStorage.linkHistory = JSON.stringify(this.links)
    }
  },
  mounted() {
    setInterval(() => {
      const randomChars = Array(8).fill(0).map(() => Math.random() * (122 - 97) + 97)
      this.randomAlias = String.fromCharCode(...randomChars)
    }, 100)

    addEventListener('online', () => {
      this.isOffline = false
    })

    addEventListener('offline', () => {
      this.isOffline = true
    })
  },
  created() {
    try {
      this.links = JSON.parse(localStorage.linkHistory)

      if (this.links.length) {
        axios
          .get(`${shared.origin}/api/v1/aliases?lang=ru&list=${this.links
            .map(link => link.name)}`)
          .then(response => {
            if (response.data.status === 'ok') {
              for (const link of response.data.payload) {
                for (let i = 0; i < this.links.length; i++) {
                  if (this.links[i].name === link.name) {
                  // todo: скачут визиты при обновлении страницы
                    this.$set(this.links[i], 'analytics', link.analytics)
                    break
                  }
                }
              }
            } else {
              this.displayError(response.data.reason)
            }
          })
      }
    } catch (e) {
      this.links = []
    }
  },
  methods: {
    displayError(message) {
      this.alertMessage = message
      this.showAlert = true
    },
    addLink(link) {
      this.links.unshift(link)

      this.dialog = true
      this.href = ''
      this.dialogMessage = `${shared.origin}/${link.name}`
    },
    shorten() {
      this.progress = true

      const aliasData = {href: this.href}

      if (this.aliasName) {
        aliasData.name = this.aliasName
      }

      axios
        .post('/api/v1/aliases?lang=ru', aliasData)
        .then(response => {
          return Promise.resolve(response.data.payload)
        })
        .then(link => {
          this.addLink(link)
        }, err => {
          try {
            const data = err.response.data
            if (data.code === 'err') {
              err = 'Что-то пошло не так'
            } else {
              err = data.reason
            }
          } catch (e) {
            err = typeof(err) === 'object' ? 'Что-то пошло очень не так' : err
          }

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
