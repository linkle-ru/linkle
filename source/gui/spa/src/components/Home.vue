<template>
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
        <v-btn @click="shorten()" depressed color="primary">Сократить</v-btn>
      </v-flex>
    </v-layout>
    <v-progress-linear v-if="progress" :indeterminate="true"></v-progress-linear>
    <p class="subheading font-weight-thin text-xs-center text-uppercase mt-4">История</p>
    <v-layout align-center justify-space-around>
      <v-flex xs12 sm9>
        <v-data-table :headers="headers" :items="links" hide-actions class="elevation-1">
          <template slot="items" slot-scope="props">
            <td class="text-truncate"><a :href="props.item.href">{{ props.item.href }}</a></td>
            <td class="text-xs-right"><a :href="props.item.short_url">{{ props.item.short_url }}</a></td>
            <td class="text-xs-right">{{ props.item.visits || 'N/A' }}</td>
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
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    progress: false,
    showAlert: false,
    alertMessage: 'nigger',
    href: '',
    hrefRules: [
      v => /\w+\.\w+\S/.test(v) || !v || 'Это точно ссылка?'
    ],
    headers: [
      {
        text: 'Оригинальная ссылка',
        align: 'left',
        value: 'name'
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
    },
    shorten() {
      this.progress = true

      axios
        .post('https://short.taxnuke.ru/api/v1/aliases?lang=ru', { href: this.href })
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
          this.alertMessage = err
          this.showAlert = true
        })
        .finally(() => {
          this.progress = false
        })
    },
    deleteItem(item) {
      const index = this.links.indexOf(item)
      confirm('Вы уверены, что хотите удалить эту ссылку?') && this.links.splice(index, 1)
    }
  }
}
</script>

<style scoped>
</style>
