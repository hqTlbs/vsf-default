<template>
  <v-app-bar-nav-icon
    @click="openSidebarMenu"
    data-testid="menuButton"
    :aria-label="$t('Open menu')"
  ></v-app-bar-nav-icon>
</template>

<script>
import HamburgerIcon from '@vue-storefront/core/compatibility/components/blocks/Header/HamburgerIcon'

export default {
  mixins: [HamburgerIcon]
}
</script>
