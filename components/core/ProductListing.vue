<template>
  <div
    class="product-listing m0 center-xs start-md"
    :class="parentStyle"
  >
    <div
      v-for="(product) in products"
      :key="product.id"
      :class="style"
    >
      <product-tile v-if="type=='grid'" :product="product" />
      <product-tile-list v-else :product="product" />
    </div>
  </div>
</template>

<script>
import ProductTile from 'theme/components/core/ProductTile'
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
