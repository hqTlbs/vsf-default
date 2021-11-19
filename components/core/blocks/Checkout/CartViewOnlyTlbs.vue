<template>
  <div>
    <v-data-table :headers="headers" :items="productsInCart" hide-default-footer>
      <template #item.fullproduct="{ item }">
        <strong>
          <router-link
            class="sans-serif h4 name"
            :to="productLink(item)"
            data-testid="productLink"
          >
            {{ item.manufacturer_name | htmlDecode }} - {{ item.name | htmlDecode }}
          </router-link>
        </strong>
        <div class="basket__sku">
          Herst.-Art-Nr.:{{ item.sku }} - ADN-Art.-Nr.{{ item.id }}
        </div>
        <div>
          <span class="success--text">Lieferbar. Lieferzeit: 3-5 Werktage</span>
        </div>
      </template>
      <template #item.hek="{ item }">
        <span v-if="isOnline && item.totals">
          <strong>
            {{ item.special_price | price(storeView) }}
          </strong>
        </span>
        <span v-else>
          <strong>
            {{ item.special_price | price(storeView) }}
          </strong>
        </span>
      </template>
      <template #item.fullprice="{ item }">
        <span v-if="isOnline && item.totals">
          <strong>
            {{ item.totals.row_total_incl_tax | price(storeView) }}
          </strong>
        </span>
        <span v-else>
          <strong>
            {{ item.price_incl_tax * item.qty | price(storeView) }}
          </strong>
        </span>
      </template>
    </v-data-table>
    <v-divider />
    <div v-if="productsInCart && productsInCart.length">
      <v-row v-for="(segment, index) in totals" :key="index" v-if="segment.code !== 'grand_total'" class="pa-3">
        <v-col>
          <div class="text-right">
            {{ segment.title }}
          </div>
        </v-col>
        <v-col cols="3" class="text-right" v-if="segment.value != null">
          {{ segment.value | price(storeView) }}
        </v-col>
      </v-row>
      <v-divider />
      <v-row class="pa-3" v-for="(segment, index) in totals" :key="index" v-if="segment.code === 'grand_total'">
        <v-col class="text-right">
          <div>
            <h3>{{ segment.title }}</h3>
          </div>
        </v-col>
        <v-col cols="3" class="text-right">
          <strong>{{ segment.value | price(storeView) }}</strong>
          <br>
          <span class="small">(inkl.MWst.)</span>
        </v-col>
      </v-row>
     </div>
  </div>
</template>

<script>
import { CartSummary } from '@vue-storefront/core/modules/checkout/components/CartSummary'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';
import { onlineHelper } from '@vue-storefront/core/helpers'

export default {
  components: {
  },
  data () {
    return {
      headers: [{
        text: 'Anzahl',
        sortable: false,
        value: 'qty'
      },
      {
        text: 'Produkt',
        value: 'fullproduct',
        sortable: false
      },
      {
        text: 'Einzelpreis',
        value: 'hek',
        sortable: false
      },
      {
        text: 'Gesamtpreis',
        value: 'fullprice',
        align: 'end',
        sortable: false
      }
      ]
    }
  },
  computed: {
    storeView () {
      return currentStoreView()
    },
    isOnline () {
      return onlineHelper.isOnline
    }
  },
  mixins: [CartSummary],
  methods: {
    productLink (product) {
      return formatProductLink(product, currentStoreView().storeCode)
    }
  }
}
</script>

<style lang="scss" scoped>
.summary-title {
  @media (max-width: 767px) {
    margin-left: 0;
  }
}
</style>
