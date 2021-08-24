<template>
  <v-btn
    depressed
    tile
    @click.stop="openSidebarMenu"
    data-testid="menuButton"
    class="mainmenubtn"
  >
    <v-icon class="material-icons-outlined mainmenubtn__icon">menu</v-icon>
    <span class="d-none d-md-flex">Menu</span>
  </v-btn>
</template>

<script>
import HamburgerIcon from '@vue-storefront/core/compatibility/components/blocks/Header/HamburgerIcon'

export default {
  mixins: [HamburgerIcon]
}
</script>
