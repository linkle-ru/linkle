<template>
  <v-container>
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
        <v-btn @click="shorten()" depressed color="primary">Shorten</v-btn>
      </v-flex>
    </v-layout>
    <v-progress-linear v-if="progress" :indeterminate="true"></v-progress-linear>
    <p class="subheading font-weight-thin text-xs-center text-uppercase mt-4">History</p>
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
            You haven't shortened any links yet
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
    href: '',
    hrefRules: [
      v => /\w+\.\w+\S/.test(v) || !v || 'Are you sure that is a link?'
    ],
    headers: [
      {
        text: 'Original URL',
        align: 'left',
        value: 'name'
      },
      {
        text: 'Short Url',
        align: 'right',
        value: 'short_url'
      },
      {
        text: 'Visits',
        align: 'right',
        value: 'visits'
      },
      {
        text: 'Actions',
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
        .post('https://short.taxnuke.ru/api/v1/aliases', { href: this.href })
        .then(response => {
          const payload = response.data.payload
          this.addLink(payload.name, payload.href)
        })
        .finally(() => {
          this.progress = false
        })
    },
    deleteItem(item) {
      const index = this.links.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.links.splice(index, 1)
    }
  }
}
</script>

<style scoped>
</style>
