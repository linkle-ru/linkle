<template>
  <v-app id="app">
    <v-container>
      <v-snackbar
          :timeout="2000"
          :top="true"
          color="error"
          v-model="showAlert">
        {{ alertMessage }}
      </v-snackbar>
      <p class="display-2 font-weight-black text-uppercase">
        URL Shortener
        <span class="font-italic text-lowercase headline font-weight-light">beta</span>
      </p>
      <v-layout row wrap>
        <v-flex xs12 sm8 md7 lg4>
          <v-text-field
              placeholder="https://example.link"
              v-bind:rules="hrefRules"
              v-model="href"
              @keyup.enter="shorten()"
          >
          </v-text-field>
        </v-flex>
        <v-flex>
          <v-btn @click="shorten()" v-bind:disabled="progress" depressed color="primary">Сократить</v-btn>
        </v-flex>
      </v-layout>
      <v-slide-y-transition>
        <v-progress-linear v-show="progress" :indeterminate="true"></v-progress-linear>
      </v-slide-y-transition>
      <p class="subheading font-weight-thin text-xs-center text-uppercase mt-4">История</p>
      <v-layout align-center justify-space-around>
        <v-flex xs12 sm11>
          <v-data-table :headers="headers" :items="links" hide-actions class="elevation-1">
            <template slot="items" slot-scope="props">
              <td class="text-truncate" style="max-width: 300px">
                <a :href="props.item.href" target="_blank">{{ props.item.href }}</a>
              </td>
              <td class="text-xs-right">
                <a :href="`${origin}/api/v1/follow/${props.item.short_url}`"
                   target="_blank">{{ `${origin}/${props.item.short_url}` }}
                </a>
              </td>
              <td class="text-xs-right">
                <!-- todo: реализовать посещения ссылок -->
                {{ props.item.visits || 'N/A' }}
              </td>
              <td class="justify-center layout px-0">
                <v-icon small @click="deleteItem(props.item)">delete</v-icon>
              </td>
            </template>
            <template slot="no-data">
              У вас пока нету сокращенных ссылок
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
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

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
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
          <v-dialog v-model="licenseAgreement" width="600px">
            <v-card>
              <v-card-title>
                <span class="headline">Пользовательское соглашение</span>
              </v-card-title>
              <v-card-text>
                <ol>
                  <li>Пользуясь этим ресурсом, я соглашаюсь с тем, что не буду использовать его для рассылки спама, вредноносного программного обеспечения, распространения и приобретения запрещенных законодательством РФ материалов в любой форме.</li>
                  <li>Автор данного ресурса оставляет за собой право распоряжаться моими сокращенными ссылками (удалять, подменять содержимое, удалять), в случае, если они не удовлетворяют требованиям настоящего пользовательского соглашения.</li>
                  <li>Взаимодействие с данным ресурсом я произвожу на свой страх и риск, автор не несёт никакой ответственности за прямой или косвенный ущерб, причененный путём использованием данного ресурса мной или кем-либо.</li>
                  <li>При обнаружении вредноносной ссылки я обязаюсь сообщить о ней автору ресурса по электронному адресу
                    <a href="mailto:bad-link@taxnuke.ru">
                      bad-link@taxnuke.ru
                    </a>
                  </li>
                </ol>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat="flat" @click="licenseAgreement = false">Закрыть</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </template>
    </v-container>
    <v-footer class="pa-3 body-2">
      <a href="#" @click="licenseAgreement = true">Пользовательское соглашение</a>
      <a class="ml-2"
         href="https://github.com/taxnuke/url-shortener/blob/master/README.md"
         target="_blank">Документация и REST API
      </a>
      <v-spacer></v-spacer>
      <div>&copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'
import copyToClipboard from 'copy-to-clipboard'

export default {
  name: 'App',
  data: () => ({
    origin: window.location.origin,
    progress: false,
    dialog: false,
    dialogMessage: '',
    showAlert: false,
    alertMessage: '',
    href: '',
    licenseAgreement: false,
    hrefRules: [
      v => !(/\s/g.test(v)) || !v || 'Это точно ссылка?'
    ],
    headers: [
      {
        text: 'Оригинальная ссылка',
        align: 'left',
        value: 'href'
      },
      {
        text: 'Короткая ссылка',
        align: 'right',
        value: 'short_url'
      },
      {
        text: 'Посещения',
        align: 'right',
        value: 'visits'
      },
      {
        text: 'Действия',
        value: 'name',
        align: 'center',
        sortable: false
      }
    ].map(header => {
      header.text = header.text.toUpperCase()

      return header
    }),
    links: []
  }),
  watch: {
    links() {
      localStorage.linkHistory = JSON.stringify(this.links)
    }
  },
  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      this.links = localStorage.linkHistory ? JSON.parse(localStorage.linkHistory) : []
    },
    addLink(name, href) {
      this.links.push({
        href,
        short_url: name,
      })

      this.dialog = true
      this.href = ''
      this.dialogMessage = `${origin}/${name}`
    },
    shorten() {
      this.progress = true

      axios
        .post(`${origin}/api/v1/aliases?lang=ru`, { href: this.href })
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
          this.addLink(payload.name, payload.href)
        })
        .catch(err => {
          // todo: если сервер долго не отвечает, показать ошибку
          if (typeof(err) === 'object') {
            err = 'Что-то пошло очень не так'
          }

          this.alertMessage = err
          this.showAlert = true
        })
        .finally(() => {
          this.progress = false
        })
    },
    copyToClipboard,
    deleteItem(item) {
      const index = this.links.indexOf(item)
      // todo: сделать модалкой
      confirm('Вы уверены, что хотите удалить эту ссылку?') && this.links.splice(index, 1)
    }
  }
}
</script>

<style>
  @import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons';
  @import 'vuetify/dist/vuetify.min.css';
</style>
