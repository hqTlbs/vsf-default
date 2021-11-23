<template>
  <div>
    <v-row class="pa-3">
      <v-col cols="2" sm="2" order="1">
        <product-image :image="image" />
      </v-col>
      <v-col cols="8" sm="5" order="2">
        <strong>
          <router-link
            class="sans-serif h4 name"
            :to="productLink"
            data-testid="productLink"
          >
            {{ product.manufacturer_name | htmlDecode }} - {{ product.name | htmlDecode }}
          </router-link>
        </strong>
        <div class="basket__sku">Herst.-Art-Nr.:{{ product.sku }} - ADN-Art.-Nr.{{ product.id }}</div>
        <div>
          <span v-if="product.qty < 999" class="success--text basket__addinfo"><v-icon small color="success">local_shipping</v-icon> Lieferbar. Lieferzeit: 3-5 Werktage</span>
          <span v-else class="error--text basket__addinfo"><v-icon small color="error">local_shipping</v-icon> ACHTUNG! Derzeit nur 1 Stück verfügbar</span>
        </div>
        <div v-if="product.attr_ekd_pflicht > 1" class="error--text basket__addinfo">
          <v-icon small color="error" class="pb-1">error_outline</v-icon> ENDKUNDENPFLICHTIG!
          <br> Bitte geben Sie im nächsten Schritt die Endkundendaten an.
        </div>
      </v-col>
      <v-col cols="4" sm="2" class="pa-3" order="4" order-sm="3" offset="2" offset-sm="0">
        <v-text-field flat tile dense outlined label="Stück" class="mb-1" v-model="product.qty" type="number" min="1" />
      </v-col>
      <v-col class="text-right" order="5" order-sm="4">
        <span v-if="isOnline && product.totals">
          <strong>
            {{ product.totals.row_total_incl_tax | price(storeView) }}
          </strong>
        </span>
        <span v-else>
          <strong>
            {{ product.price_incl_tax * product.qty | price(storeView) }}
          </strong>
        </span>
      </v-col>
      <v-col cols="2" sm="1" class="pt-1" order="3" order-sm="5">
        <v-btn dense icon depressed @click.stop="deleteArticle(i,basket)">
          <v-icon color="error">
            cancel
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </div>
</template>

<script>
import { Product } from '@vue-storefront/core/modules/checkout/components/Product'
import { onlineHelper } from '@vue-storefront/core/helpers'
import ProductImage from 'theme/components/core/ProductImage'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';

export default {
  computed: {
    storeView () {
      return currentStoreView()
    },
    isOnline () {
      return onlineHelper.isOnline
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      }
    },
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    }
  },
  mixins: [Product],
  components: {
    ProductImage
  }
}
</script>

<style scoped>
.price-original {
  text-decoration: line-through;
}
.blend {
  flex: 0 0 121px;
}
</style>
