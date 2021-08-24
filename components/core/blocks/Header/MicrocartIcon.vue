<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        @click.stop="openMicrocart"
        class="ma-0"
        v-bind="attrs"
        v-on="on"
        data-testid="openMicrocart"
        :aria-label="$t('Open microcart')"
      >
        <v-badge
          overlap
          clean
          color="error"
          bordered
          :content="totalQuantity"
          :value="totalQuantity"
          data-testid="minicartCount"
        >
          <v-icon>shopping_cart</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <span>Warenkorb</span>
  </v-tooltip>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MicrocartIcon from '@vue-storefront/core/compatibility/components/blocks/Header/MicrocartIcon'
import { syncCartWhenLocalStorageChange } from '@vue-storefront/core/modules/cart/helpers'

export default {
  mounted () {
    syncCartWhenLocalStorageChange.addEventListener()
    this.$once('hook:beforeDestroy', () => {
      syncCartWhenLocalStorageChange.removeEventListener()
    })
  },
  computed: {
    ...mapGetters({
      totalQuantity: 'cart/getItemsTotalQuantity'
    })
  },
  methods: {
    ...mapActions({
      openMicrocart: 'ui/toggleMicrocart'
    })
  }
}
</script>

<style scoped>
.minicart-count {
  top: 7px;
  left: 50%;
  min-width: 16px;
  min-height: 16px;
  border-radius: 10px;
}
</style>
