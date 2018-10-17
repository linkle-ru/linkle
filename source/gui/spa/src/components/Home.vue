<template>
  <v-container>
    <p class="display-2 font-weight-black text-uppercase">
      URL Shortener
      <span class="font-italic text-lowercase headline font-weight-light">beta</span>
    </p>
    <v-layout row wrap>
      <v-flex xs12 sm8 md7 lg4>
        <v-text-field placeholder="https://example.link"></v-text-field>
      </v-flex>
      <v-flex>
        <v-btn depressed color="primary">Shorten</v-btn>
      </v-flex>
    </v-layout>
    <p class="subheading font-weight-thin text-xs-center text-uppercase mt-4">History</p>
    <v-layout align-center justify-space-around>
      <v-flex xs12 sm9>
        <v-data-table :headers="headers" :items="links" hide-actions class="elevation-1">
          <template slot="items" slot-scope="props">
            <td class="text-truncate">{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.short_url }}</td>
            <td class="text-xs-right">{{ props.item.visits }}</td>
            <td class="justify-center layout px-0">
              <v-icon small @click="deleteItem(props.item)">delete</v-icon>
            </td>
          </template>
          <template slot="no-data">
            <v-btn color="primary" @click="initialize">Reset</v-btn>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    headers: [
      {
        text: 'Original URL',
        align: 'left',
        value: 'name'
      },
      {
        text: 'Short Url',
        align: 'center',
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
    ].map((header) => {
      header.text = header.text.toUpperCase()

      return header
    }),
    links: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      short_url: 0,
      visits: 0
    },
    defaultItem: {
      name: '',
      short_url: 0,
      visits: 0
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    }
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.links = [
        {
          name: 'https://news.yandex.ru/story/',
          short_url: 'https://paslakjsdf',
          visits: 6
        },
        {
          name: 'http://udemy.com/usability-testing',
          short_url: 'https://qwlefqwe',
          visits: 9
        },
        {
          name: 'yandex.ru',
          short_url: 'https://qwehergwegwre',
          visits: 16
        },
        {
          name: 'google.com',
          short_url: 'https://gqergwerwrg',
          visits: 3
        }
      ]
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
