<template>
  <div>
    <p class="subheading font-weight-thin text-xs-center text-uppercase mt-4">
      История
    </p>
    <v-layout
      align-center
      justify-center
      column-
    >
      <v-flex
        v-if="links.length"
        xs12
        lg10
        xl8
      >
        <v-card>
          <v-list two-line>
            <template v-for="(link, index) in links">
              <v-list-tile
                :key="link.name"
                avatar
                @click="followLink(link)"
              >
                <v-list-tile-avatar>
                  <v-layout
                    align-center
                    justify-center
                    column
                    fill-height
                  >
                    <v-tooltip top>
                      <v-flex
                        slot="activator"
                        class="body-2"
                      >
                        {{ link | visitsFormatter }}
                      </v-flex>
                      <span>Переходы по ссылке</span>
                    </v-tooltip>
                    <v-icon
                      small
                      color="grey lighten-1"
                    >
                      visibility
                    </v-icon>

                  </v-layout>
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ $sanitize(link.title || "Без заголовка") }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <a
                      class="subheading"
                      onclick="return false"
                      :href="link.name"
                    >{{ link.name }}</a>
                    &mdash;
                    <span class="font-weight-thin">{{ link.href }}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn
                    icon
                    ripple
                    @click.stop="cbCopy(`${shared.origin}/${link.name}`)"
                  >
                    <v-icon
                      color="blue lighten-2"
                    >
                      file_copy
                    </v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    ripple
                    @click.stop="deleteLink(link)"
                  >
                    <v-icon
                      color="red lighten-2"
                    >
                      remove_circle
                    </v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < links.length"
                :key="index"
              />
            </template>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex
        v-else
        md6
      >
        <v-alert
          :value="true"
          color="info"
          icon="content_cut"
          outline
        >
          У Вас пока нет сокращенных ссылок &#x1F614;
        </v-alert>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import {shared} from '../main'
import cbCopy from 'copy-to-clipboard'
import axios from 'axios'

export default {
  filters: {
    visitsFormatter: link => {
      const analytics = link.analytics

      if (typeof analytics === 'undefined') {
        return 'N/A'
      }

      let followed = analytics.followed

      if (followed > 1e3 && followed < 1e6) {
        followed = `${(followed / 1e3).toFixed()} K`
      } else if (followed > 1e6) {
        followed = `${(followed / 1e6).toFixed()} M`
      }

      return followed
    }
  },
  data: () => ({
    links: null,
    shared
  }),
  created() {
    this.$root.$on('shortened', this.addLink)

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
                    // чтобы триггернуть перерисовку таблицы
                    this.$set(this.links[i], 'analytics', link.analytics)
                    break
                  }
                }
              }
            } else {
              this.$root.$emit('alert', response.data.reason)
            }
          })
      }

      localStorage.linkHistory = JSON.stringify(this.links)
    } catch (e) {
      this.$root.$emit('alert', 'err')
    }
  },
  methods: {
    addLink(link) {
      this.links.unshift(link)
      localStorage.linkHistory = JSON.stringify(this.links)
    },
    followLink(link) {
      window.open(link.href, '_blank')
    },
    deleteLink(link) {
      const index = this.links.indexOf(link)
      if (confirm('Вы уверены? Это действие необратимо!')) {
        this.links.splice(index, 1)
      }

      localStorage.linkHistory = JSON.stringify(this.links)
    },
    cbCopy
  }
}
</script>
