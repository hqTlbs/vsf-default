<template>
  <v-row class="lastseen flex-wrap">
    <product-tile v-if="type=='grid'" v-for="product in products" :product="product" :key="product.id" :description="description" :xl="xl" :lg="lg" :md="md" :sm="sm" />
    <product-tile-list v-else :product="product" />
  </v-row>
</template>

<script>
import ProductTile from 'theme/components/core/ProductTileTlbs'
import ProductTileList from 'theme/components/core/ProductTileList'
let lastHero = 0
export default {
  name: 'ProductListing',
  components: {
    ProductTile,
    ProductTileList
  },
  props: {
    products: {
      type: null,
      required: true
    },
    type: {
      type: String,
      default: 'grid'
    },
    columns: {
      type: [Number, String],
      required: true
    },
    xl: {
      type: String,
      default: '4'
    },
    lg: {
      type: String,
      default: '4'
    },
    md: {
      type: String,
      default: '6'
    },
    sm: {
      type: String,
      default: '6'
    },
    description: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    parentStyle () {
      let css
      if (this.type === 'grid') {
        css = 'row'
      }
      return css
    },
    style () {
      let css
      if (this.type === 'grid') {
        css = 'col-sm-6 flex col-md-' + (12 / this.columns) % 10
        // css = css + ' wide(' + this.product.sale + ',' + this.product.new + ',' + this.key + ')'
      } else {
        css = 'row'
      }
      return css
    }
  },
  methods: {
    wide (isOnSale, isNew, index) {
      let deltaCondition = index > 0 && ((index - 1) - lastHero) % 2 === 0
      // last image always shouldn't be big, we also need to count from last promoted to check if it will look ok
      let isHero = ((isOnSale === '1' || isNew === '1') && deltaCondition) || (index === this.products.length - 1 && (index - lastHero) % 2 !== 0)
      if (isHero) {
        lastHero = index
      }
      return isHero ? 'col-xs-12' : 'col-xs-6'
    }
  }
}
</script>
