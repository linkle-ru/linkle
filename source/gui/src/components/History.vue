<template>
  <div>
    <p class="subheading font-weight-thin text-xs-center text-uppercase mt-4">
      История
    </p>
    <v-layout align-center justify-space-around>
      <v-flex xs12 sm11>
        <v-data-table
            :headers="headers"
            :items="source"
            hide-actions
            class="elevation-1"
        >
          <template
              slot="items"
              slot-scope="props"

          >
            <!-- todo: отрефакторить -->
            <td class="text-truncate" style="max-width: 300px">
              <a target="_blank"
                 :href="props.item.href">
                {{ props.item.href }}
              </a>
            </td>
            <td class="text-xs-right">
              <a target="_blank"
                 :href="`${shared.origin}/api/v1/follow/${props.item.short_url}`">
                {{ `${shared.origin}/${props.item.short_url}` }}
              </a>
            </td>
            <td class="text-xs-right">
              <!-- todo: реализовать посещения ссылок -->
              {{ props.item.visits || 'N/A' }}
            </td>
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
  </div>
</template>

<script>
import {shared} from '../main'

export default {
  data: () => ({
    shared,
    headers: [
      {
        text: 'Оригинальная ссылка',
        align: 'left',
        value: 'href'
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
    })
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
