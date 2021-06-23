<template>
  <v-container>
    <v-breadcrumbs :items="paths" divider=">" class="pl-0 mt-0 pt-1">
      <template v-slot:item="{ item }">
        <span v-if="item.name">
          <v-breadcrumbs-item
            v-if="item.route_link"
            :href="item.route_link"
          >
            {{ item.name.toUpperCase() | htmlDecode }}
          </v-breadcrumbs-item>
          <v-breadcrumbs-item
            v-else
          >
            {{ item.name.toUpperCase() | htmlDecode }}
          </v-breadcrumbs-item>
        </span>
      </template>
    </v-breadcrumbs>
  </v-container>
</template>

<script>
import { Breadcrumbs } from '@vue-storefront/core/modules/breadcrumbs/components/Breadcrumbs.ts'

export default {
  mixins: [Breadcrumbs]
}
</script>
