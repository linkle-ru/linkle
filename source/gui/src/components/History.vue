<template>
  <div>
    <p class="subheading font-weight-thin text-xs-center text-uppercase mt-4">
      История
    </p>
    <v-layout align-center justify-center column->
      <v-flex xs12 lg10 xl8 v-if="source.length">
        <v-card>
          <v-list two-line>
            <template v-for="(link, index) in source">
              <v-list-tile
                  :key="link.title"
                  avatar
                  @click="()=>{}"
              >
                <v-list-tile-avatar>
                  {{link.visits || NaN}}
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{link.title || 'Без заголовка'}}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    <a :href="link.short_url">{{link.short_url}}</a>
                    &mdash;
                    <span>{{link.href}}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon
                        color="red lighten-2"
                        @click="deleteItem(source.item)"
                    >
                      delete
                    </v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider v-if="index + 1 < source.length" :key="index"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-flex>
      <v-flex md6 v-else>
        <v-alert
            :value="true"
            color="blue"
            icon="info"
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

export default {
  data: () => ({
    shared
  }),
  props: ['source'],
  methods: {
    deleteItem(item) {
      const index = this.source.indexOf(item)
      // todo: сделать модалкой
      confirm('Вы уверены, что хотите удалить эту ссылку?') && this.source.splice(index, 1)
    }
  }
}
</script>
