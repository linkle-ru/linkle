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
        v-if="source.length"
        xs12
        lg10
        xl8
      >
        <v-card>
          <v-list two-line>
            <template v-for="(link, index) in source">
              <v-hover
                :key="link.name"
              >
                <v-list-tile
                  slot-scope="{ hover }"
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
                      <v-tooltip bottom>
                        <v-flex
                          slot="activator"
                          class="body-2"
                        >
                          {{ link | visitsFormatter }}
                        </v-flex>
                        <span>бета</span>
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
                  <v-list-tile-action v-show="hover">
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
                  </v-list-tile-action>
                  <v-list-tile-action v-show="hover">
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
              </v-hover>
              <v-divider
                v-if="index + 1 < source.length"
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
          У Вас пока нет сокращенных ссылок
        </v-alert>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import {shared} from '../main'
import cbCopy from 'copy-to-clipboard'

export default {
  filters: {
    visitsFormatter: link => {
      const analytics = link.analytics

      if (typeof analytics === 'undefined') {
        return 'N/A'
      }

      let followed = analytics.followed

      if (followed > 1000 && followed < 1000000) {
        followed = `${(followed / 1000).toFixed()} K`
      } else if (followed > 1000000) {
        followed = `${(followed / 1000000).toFixed()} M`
      }

      return followed
    }
  },
  props: {
    source: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    // todo: рефакторинг
    shared
  }),
  methods: {
    followLink(link) {
      window.open(link.href, '_blank')
    },
    deleteLink(link) {
      const index = this.source.indexOf(link)
      confirm('Вы уверены?') && this.source.splice(index, 1)
    },
    cbCopy
  }
}
</script>
