<template>
  <v-btn :icon="icon" @click="isOnWishlist ? removeProductFromWhishList(product) : addProductToWhishlist(product)"
         data-testid="addToWishlist"
  >
    <span v-if="!isOnWishlist">
      <v-icon
        :title="$t('Add to favorite')"
      >
        favorite_border
      </v-icon>
    </span>
    <span v-else>
      <v-icon
        :title="$t('Remove')"
      >
        favorite_border
      </v-icon>
    </span>
  </v-btn>
</template>

<script>
import { IsOnWishlist } from '@vue-storefront/core/modules/wishlist/components/IsOnWishlist'
import { AddToWishlist } from '@vue-storefront/core/modules/wishlist/components/AddToWishlist'
import { RemoveFromWishlist } from '@vue-storefront/core/modules/wishlist/components/RemoveFromWishlist'
import i18n from '@vue-storefront/i18n'
import { htmlDecode } from '@vue-storefront/core/lib/store/filters'

export default {
  mixins: [IsOnWishlist, AddToWishlist, RemoveFromWishlist],
  props: {
    icon: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    favoriteIcon () {
      return this.isOnWishlist ? 'favorite' : 'favorite_border'
    }
  },
  methods: {
    addProductToWhishlist (product) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: i18n.t('Product {productName} has been added to wishlist!', { productName: htmlDecode(product.name) }),
        action1: { label: i18n.t('OK') }
      }, { root: true })
      this.addToWishlist(product)
    },
    removeProductFromWhishList (product) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: i18n.t('Product {productName} has been removed from wishlist!', { productName: htmlDecode(product.name) }),
        action1: { label: i18n.t('OK') }
      }, { root: true })
      this.removeFromWishlist(product)
    }
  }
}
</script>
