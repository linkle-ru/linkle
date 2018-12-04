<template>
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
        v-model="form.href"
        clearable
        autofocus
        prepend-icon="explore"
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
          v-model="form.alias"
          prepend-icon="link"
          :placeholder="randomAlias"
          prefix="linkle.ru/"
          messages="Короткая ссылка"
          @keyup.enter="shorten()"
        />
        <span>
          Латиница, кириллица, 0-9 и _ - @ $
        </span>
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
    <result-dialog />
  </v-layout>
</template>

<script>
import axios from 'axios'
import ResultDialog from './ResultDialog'

export default {
  components: { ResultDialog },
  data () {
    return {
      form: {
        href: '',
        alias: ''
      },
      randomAlias: null,
      progress: null
    }
  },
  computed: {
    binding () {
      const binding = {}

      if (this.$vuetify.breakpoint.xsOnly) binding.column = true

      return binding
    }
  },
  mounted() {
    setInterval(() => {
      this.randomAlias = Array(6)
        .fill()
        .map(() =>
          '0123456789abcdefghijklmnopqrstuvwxyz@бвгд$ёжзийклмнптфхцчшщэюя-_'[
            Math.random() * 64 >> 0
          ])
        .join('')
    }, 300)
  },
  methods: {
    addLink(link) {
      this.$root.$emit('shortened', link)

      this.form.href = ''
      this.form.alias = ''
    },
    shorten() {
      this.progress = true
      const aliasData = {href: this.form.href}

      if (this.form.alias) {
        aliasData.name = this.form.alias
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
            err = data.code === 'err' ? 'Ошибка сервера' : data.reason
          } catch (e) {
            err = typeof(err) === 'object' ? 'Что-то пошло очень не так' : err
          }

          this.$root.$emit('alert', err)
        })
        .finally(() => {
          this.progress = false
        })
    }
  }
}
</script>
