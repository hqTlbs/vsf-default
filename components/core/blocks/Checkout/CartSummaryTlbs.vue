<template>
  <div>
    <product v-for="product in productsInCart" :key="product.server_item_id || product.id" :product="product" />
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
      <v-row class="mb-0">
        <v-col class="mb-0 ml-md-2">
          <v-text-field label="Gutscheincode" dense outlined class="float-left basket__coupon" ></v-text-field>
          <v-btn depressed tile class="inbasket" height="40px" dark @click="checkcoupon(couponcodecheck)">
            Gutschein einlösen
          </v-btn>
          <br>
        </v-col>
      </v-row>
      <v-row class="pa-2 my-1 ma-sm-1 checkout__nextstep">
        <v-col class="d-flex justify-start align-start">
          <!--- Warenkorb wird an den Vertrieb geschickt -->
          <v-btn depressed tile outlined color="primary" class="mb-1" @click="offer()">
            Angebot anfordern
          </v-btn>
        </v-col>
        <v-col class="d-flex justify-end align-start">
          <v-btn depressed tile class="inbasket " dark @click="sendDataToCheckout">
            Weiter <v-icon>chevron_right</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <div class="mt-15 d-flex justify-end">
        *Alle Preise zzgl. MwSt. und Transaktionskosten
      </div>
    </div>
  </div>
</template>

<script>
import { CartSummary } from '@vue-storefront/core/modules/checkout/components/CartSummary'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import Product from './ProductTlbs'

export default {
  mixins: [CartSummary],
  components: {
    Product
  },
  computed: {
    storeView () {
      return currentStoreView()
    }
  },
  methods: {
    sendDataToCheckout () {
      this.$bus.$emit('checkout-before-edit', 'personalDetails')
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
