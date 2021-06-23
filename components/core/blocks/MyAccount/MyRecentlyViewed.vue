<template>
  <div class="contentblock">
    <h2>{{ $t('My Recently viewed products') }}</h2>
    <!--wird ab hier mit List/Grid Ansicht ersetzt  toolbar:false infotext:false filter:false-->
    <div class="products__gridview">
        <product-listing columns="6" :products="items" :description="false" v-if="items && items.length > 0" />
      <v-row class="flex-wrap h4" v-else>
        {{ $t('No products yet') }}
      </v-row>
    </div>
  </div>
</template>

<script>
import RecentlyViewed from '@vue-storefront/core/modules/recently-viewed/components/RecentlyViewed'
import ProductListing from 'theme/components/core/ProductListing.vue'

export default {
  mixins: [RecentlyViewed],
  components: {
    ProductListing
  }
}
</script>
