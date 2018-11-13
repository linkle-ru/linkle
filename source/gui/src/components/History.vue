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
              <v-list-tile
                :key="link.short_url"
                avatar
                @click="()=>{}"
              >
                <!--<v-list-tile-avatar>-->
                <!--<v-layout align-center justify-center column fill-height>-->
                <!--<v-flex>-->
                <!--{{ link.visits || 'N/A' }}-->
                <!--</v-flex>-->
                <!--<v-icon-->
                <!--small-->
                <!--color="grey lighten-1"-->
                <!--&gt;-->
                <!--visibility-->
                <!--</v-icon>-->

                <!--</v-layout>-->
                <!--</v-list-tile-avatar>-->

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ $sanitize(link.title || "Без заголовка") }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <a :href="link.short_url">{{ link.short_url }}</a>
                    &mdash;
                    <span>{{ link.href }}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-hover>
                    <v-btn
                      slot-scope="{ hover }"
                      icon
                      ripple
                      @click="deleteLink(link)"
                    >
                      <v-icon
                        :color="`red lighten-${hover ? 1 : 3}`"
                      >
                        remove_circle
                      </v-icon>
                    </v-btn>
                  </v-hover>
                </v-list-tile-action>
              </v-list-tile>
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
export default {
  props: {
    source: {
      type: Array,
      required: true
    }
  },
  methods: {
    deleteLink(link) {
      const index = this.source.indexOf(link)
      // todo: сделать модалкой?
      confirm('Вы уверены?') && this.source.splice(index, 1)
    }
  }
}
</script>
