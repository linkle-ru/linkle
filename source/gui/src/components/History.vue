<template>
  <div>
    <p class="subheading font-weight-thin text-xs-center text-uppercase mt-4">
      История
    </p>
    <v-layout justify-center>
      <v-flex xs12 sm10 md6>
        <v-data-table
            :items="source"
            class="elevation-1"
            hide-headers
        >
          <template slot="items" slot-scope="props">
            <td class="py-3">
              <span class="remove-link-button">
              </span>
              <v-layout>
                <v-flex>
                  <span class="subheading">
                    {{ props.item.title || 'Без названия' }}
                  </span>
                </v-flex>
              </v-layout>
              <v-layout>
                <v-flex>
                  <a :href="`${shared.origin}/api/v1/follow/${props.item.short_url}`">
                    {{props.item.short_url}}
                  </a>
                  &mdash;
                  <span>
                    {{props.item.href}}
                  </span>
                </v-flex>
              </v-layout>
            </td>
            <!--<td v-if="$vuetify.breakpoint.mdAndUp">-->
            <!--Lorem ipsum dolor sit amet.-->
            <!--</td>-->
            <td>
              <v-icon
                  color="red lighten-2"
                  @click="deleteItem(props.item)"
              >
                delete
              </v-icon>
            </td>
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
