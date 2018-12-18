<template>
  <div>
    <p class="subheading font-weight-thin text-xs-center text-uppercase mt-4">
      История
    </p>
    <VLayout
      align-center
      justify-center
      column-
    >
      <VFlex
        v-if="links.length"
        xs12
        lg10
        xl8
      >
        <VCard>
          <VList two-line>
            <template v-for="(link, index) in links">
              <VListTile
                :key="link.name"
                avatar
                @click="followLink(link)"
              >
                <VListTileAvatar>
                  <VLayout
                    align-center
                    justify-center
                    column
                    fill-height
                  >
                    <VTooltip top>
                      <VFlex
                        slot="activator"
                        class="body-2"
                      >
                        {{ link | visitsFormatter }}
                      </VFlex>
                      <span>Переходы по ссылке</span>
                    </VTooltip>
                    <VIcon
                      small
                      color="grey lighten-1"
                    >
                      visibility
                    </VIcon>
                  </VLayout>
                </VListTileAvatar>

                <VListTileContent>
                  <VListTileTitle>{{ $sanitize(link.title || "Без заголовка") }}</VListTileTitle>
                  <VListTileSubTitle>
                    <a
                      class="subheading"
                      onclick="return false"
                      :href="link.name"
                    >
                      {{ link.name }}
                    </a>
                    &mdash;
                    <span class="font-weight-thin">
                      {{ link.href }}
                    </span>
                  </VListTileSubTitle>
                </VListTileContent>
                <VListTileAction>
                  <VBtn
                    icon
                    ripple
                    @click.stop="cbCopy(`${shared.origin}/${link.name}`)"
                  >
                    <VIcon color="blue lighten-2">
                      file_copy
                    </VIcon>
                  </VBtn>
                  <VBtn
                    icon
                    ripple
                    @click.stop="deleteLink(link)"
                  >
                    <VIcon color="red lighten-2">
                      remove_circle
                    </VIcon>
                  </VBtn>
                </VListTileAction>
              </VListTile>
              <VDivider
                v-if="index + 1 < links.length"
                :key="index"
              />
            </template>
          </VList>
        </VCard>
      </VFlex>
      <VFlex
        v-else
        md6
      >
        <VAlert
          :value="true"
          color="info"
          icon="content_cut"
          outline
        >
          У Вас пока нет сокращенных ссылок &#x1F614;
        </VAlert>
      </VFlex>
    </VLayout>
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
    links: [],
    shared
  }),
  created() {
    this.$root.$on('shortened', this.addLink)

    if (!localStorage.getItem('linkHistory')) {
      localStorage.setItem('linkHistory', JSON.stringify(this.links))
    }

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
