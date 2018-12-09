<template>
  <VLayout
    v-bind="binding"
    justify-space-around
  >
    <VFlex
      xs12
      sm4
      md6
    >
      <VTextField
        v-model="form.href"
        clearable
        autofocus
        prepend-icon="explore"
        messages="Оригинальная ссылка"
        placeholder="https://example.link"
        @keyup.enter="shorten()"
      />
    </VFlex>
    <VFlex
      xs12
      sm4
      md3
    >
      <VTooltip top>
        <VTextField
          slot="activator"
          v-model="form.alias"
          prepend-icon="link"
          :placeholder="randomAlias"
          prefix="linkle.ru/"
          messages="Псевдоним"
          @keyup.enter="shorten()"
        />
        <span>
          Латиница, кириллица, 0-9 и _ - @ $
        </span>
      </VTooltip>
    </VFlex>
    <VFlex
      xs12
      sm2
      md2
    >
      <div class="text-xs-center">
        <VBtn
          :disabled="progress"
          depressed
          color="primary"
          @click="shorten()"
        >
          Сократить
        </VBtn>
      </div>
    </VFlex>
    <VDialog
      v-model="progress"
      hide-overlay
      persistent
      width="300"
    >
      <VCard
        color="primary"
        dark
      >
        <VCardText>
          Запрос обрабатывается
          <VProgressLinear
            indeterminate
            color="white"
            class="mb-0"
          />
        </VCardText>
      </VCard>
    </VDialog>
    <ResultDialog />
  </VLayout>
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
