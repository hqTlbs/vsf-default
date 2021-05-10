<template>
  <section
    class="py20 new-collection container px15"
    v-if="getCurrentRelatedProducts.length"
  >
    <div>
      <header class="col-md-12">
        <h2 class="align-center cl-accent">
          {{ heading }}
        </h2>
      </header>
    </div>
    <product-listing type="list" columns="6" :products="getCurrentRelatedProducts" />
  </section>
</template>

<script>
import ProductListing from 'theme/components/core/ProductListing'
import { mapGetters } from 'vuex'
import { prepareRelatedQuery } from '@vue-storefront/core/modules/catalog/queries/relatedTlbs'
import i18n from '@vue-storefront/i18n'
import config from 'config'

export default {
  name: 'RelatedTlbs',
  props: {
    type: {
      type: String,
      required: true
    },
    heading: {
      type: String,
      required: false,
      default: i18n.t('Similar products')
    }
  },
  components: {
    ProductListing
  },
  beforeMount () {
    this.$bus.$on('product-after-load', this.refreshList)

    if (config.usePriceTiers) {
      this.$bus.$on('user-after-loggedin', this.refreshList)
      this.$bus.$on('user-after-logout', this.refreshList)
    }

    this.refreshList()
  },
  beforeDestroy () {
    if (config.usePriceTiers) {
      this.$bus.$off('user-after-loggedin', this.refreshList)
      this.$bus.$off('user-after-logout', this.refreshList)
    }
  },
  destroyed () {
    this.$bus.$off('product-after-load', this.refreshList)
  },
  methods: {
    async refreshList () {
      const product = this.getCurrentProduct
      let sku = this.productLinks ? this.productLinks
        .filter(pl => pl.link_type === this.type)
        .map(pl => pl.linked_product_sku) : null

      let key = 'sku'
      if (sku === null || (sku.length === 0)) {
        sku = this.getCurrentProduct.category_ids
        key = 'category_ids'
      }
      let relatedProductsQuery = prepareRelatedQuery(product.series_1_value1, product.series_2_value1, this.type)

      const { items } = await this.$store.dispatch('product/findProducts', {
        query: relatedProductsQuery,
        size: 8,
        options: {
          populateRequestCacheTags: false,
          prefetchGroupProducts: false
        }
      })
      if (items.length) {
        this.$store.dispatch('product/related', {
          key: this.type,
          items: items
        })
        this.$forceUpdate()
      }
    }
  },
  computed: {
    ...mapGetters({
      getProductRelated: 'product/getProductRelated',
      getCurrentProduct: 'product/getCurrentProduct'
    }),
    getCurrentRelatedProducts () {
      return this.getProductRelated[this.type] || []
    },
    productLinks () {
      return this.getCurrentProduct.product_links
    }
  }
}
</script>
