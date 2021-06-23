<template>
  <v-btn
    icon
    data-testid="compare-list-icon"
    :aria-label="$t('Open Comparelist')"
    :to="localizedRoute('/compare')"
  >
    <v-icon>compare</v-icon>
    <span
      class="compare-count absolute flex center-xs middle-xs border-box py0 px2 h6 lh16 weight-700 cl-white bg-cl-silver"
      v-cloak
      v-show="getCompareProductsCount"
    >
      {{ getCompareProductsCount }}
    </span>
  </v-btn>
</template>

<script>
import CompareIcon from '@vue-storefront/core/compatibility/components/blocks/Header/CompareIcon'
import { mapGetters } from 'vuex'

export default {
  mixins: [CompareIcon],
  computed: {
    ...mapGetters('compare', ['getCompareProductsCount'])
  }
}
</script>

<style scoped>
  .compare-count {
    top: 7px;
    left: 50%;
    min-width: 16px;
    min-height: 16px;
    border-radius: 10px;
  }
</style>
