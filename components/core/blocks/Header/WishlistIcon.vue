<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        @click.stop="toggleWishlistPanel"
        class="ma-0"
        v-bind="attrs"
        v-on="on"
        data-testid="wishlist-icon"
        :aria-label="$t('Open wishlist')"
      >
        <v-badge
          overlap
          clean
          color="error"
          bordered
          :content="getWishlistItemsCount"
          :value="getWishlistItemsCount"
        >
          <v-icon>star</v-icon>
        </v-badge>
      </v-btn>

    </template>
    <span>Merkliste</span>
  </v-tooltip>
</template>

<script>
import WishlistIcon from '@vue-storefront/core/compatibility/components/blocks/Header/WishlistIcon'

export default {
  mixins: [WishlistIcon]
}
</script>

<style scoped>
.whishlist-count {
  top: 7px;
  left: 50%;
  min-width: 16px;
  min-height: 16px;
  border-radius: 10px;
}
</style>
