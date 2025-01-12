<template>
  <div class="pa-0 ma-0">
      <v-row class="pa-3">
      <v-col cols="2">
        <product-image :image="image" />
      </v-col>
      <v-col cols="8">
        <strong>
          <router-link
            class="sans-serif h4 name"
            :to="productLink"
            data-testid="productLink"
            @click.native="$store.commit('ui/setMicrocart', false)"
          >
              {{ product.manufacturer_name | htmlDecode }} - {{ product.name | htmlDecode }}
          </router-link>
        </strong>
        <div class="basket__sku">Herst.-Art-Nr.:{{ product.sku }} - ADN-Art.-Nr.{{ product.id }} </div>
        <div v-if="product.attr_ekd_pflicht > 1" class="basket__addinfo error--text">
          <v-icon small color="error" class="pb-1">error_outline</v-icon> ENDKUNDENPFLICHTIG!</div>
        <div v-if="userloggedin">
          <span class="success--text basket__addinfo"><v-icon small color="success">local_shipping</v-icon> Lieferbar. Lieferzeit: {{deliverytime}}</span>
        </div>
      </v-col>
      <v-col col="1" class="text-right">
        <remove-button class="mx5" @click="removeItem" />
      </v-col>
      <v-col cols="2" offset="2" class="pa-3 pt-5">
        {{ $t('Menge:') }}
      </v-col>
      <v-col cols="4" class="pa-3">
        <product-quantity
          class="h5 cl-accent lh25 qty"
          :value="productQty"
          :max-quantity="maxQuantity"
          :loading="isStockInfoLoading"
          :is-simple-or-configurable="isSimpleOrConfigurable"
          @input="updateProductQty"
          @error="handleQuantityError"
        />
      </v-col>
      <v-col class="text-right">
        <span v-if="userloggedin==1">
          <strong>
            {{ (product.regular_price || product.price_incl_tax) * product.qty | price(storeView) }}
          </strong>
        </span>
      </v-col>
    </v-row>
    <v-divider></v-divider>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import config from 'config'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import Product from '@vue-storefront/core/compatibility/components/blocks/Microcart/Product'

import ProductQuantity from 'theme/components/core/ProductQuantity.vue'
import ProductImage from 'theme/components/core/ProductImage'
import ColorSelector from 'theme/components/core/ColorSelector.vue'
import SizeSelector from 'theme/components/core/SizeSelector.vue'
import RemoveButton from './RemoveButton'
import EditButton from './EditButton'
import { onlineHelper } from '@vue-storefront/core/helpers'
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption'
import { getThumbnailForProduct, getProductConfiguration } from '@vue-storefront/core/modules/cart/helpers'
import ButtonFull from 'theme/components/theme/ButtonFull'
import EditMode from './EditMode'

export default {
  data () {
    return {
      maxQuantity: 0,
      quantityError: false,
      isStockInfoLoading: false,
      endcustomer: true,
      userloggedin: true,
      deliverytime: '3-5 Werktage',
      unit: 'Stück'
    }
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  components: {
    RemoveButton,
    ProductImage,
    ColorSelector,
    SizeSelector,
    EditButton,
    ButtonFull,
    ProductQuantity
  },
  mixins: [Product, ProductOption, EditMode],
  computed: {
    ...mapState({
      isMicrocartOpen: state => state.ui.microcart
    }),
    hasProductInfo () {
      return this.product.info && Object.keys(this.product.info).length > 0
    },
    hasProductErrors () {
      const errors = this.product.errors || {}
      const errorsValuesExists = Object.keys(errors).filter(errorKey => errors[errorKey]).length > 0
      return errorsValuesExists
    },
    isTotalsActive () {
      return this.isOnline && !this.editMode && this.product.totals && this.product.totals.options
    },
    isOnline () {
      return onlineHelper.isOnline
    },
    productsAreReconfigurable () {
      return config.cart.productsAreReconfigurable && this.product.type_id === 'configurable' && this.isOnline
    },
    displayItemDiscounts () {
      return config.cart.displayItemDiscounts
    },
    image () {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      }
    },
    thumbnail () {
      return getThumbnailForProduct(this.product)
    },
    configuration () {
      return getProductConfiguration(this.product)
    },
    productLink () {
      return formatProductLink(this.product, currentStoreView().storeCode)
    },
    editMode () {
      return this.getEditingProductId === this.product.id
    },
    productQty () {
      return this.editMode ? this.getEditingQty : this.product.qty
    },
    isSimpleOrConfigurable () {
      return ['simple', 'configurable'].includes(this.product.type_id)
    },
    isUpdateCartDisabled () {
      return this.quantityError ||
        this.isStockInfoLoading ||
        (this.isOnline && !this.maxQuantity && this.isSimpleOrConfigurable)
    },
    storeView () {
      return currentStoreView()
    }
  },
  methods: {
    updateProductVariant () {
      this.updateVariant()
      this.closeEditMode()
    },
    updateProductQty (qty) {
      if (this.editMode) {
        this.editModeSetQty(qty)
        return
      }

      this.updateQuantity(qty)
    },
    removeFromCart () {
      this.$store.dispatch('cart/removeItem', { product: this.product })
    },
    updateQuantity (quantity) {
      this.$store.dispatch('cart/updateQuantity', { product: this.product, qty: quantity })
    },
    async getQuantity (product) {
      if (this.isStockInfoLoading) return // stock info is already loading
      this.isStockInfoLoading = true
      try {
        const validProduct = product || this.product
        const res = await this.$store.dispatch('stock/check', {
          product: validProduct,
          qty: this.productQty
        })
        return res.qty
      } finally {
        this.isStockInfoLoading = false
      }
    },
    handleQuantityError (error) {
      this.quantityError = error
    },
    async changeEditModeFilter (filter) {
      const editedProduct = this.getEditedProduct(filter)
      const maxQuantity = await this.getQuantity(editedProduct)
      if (!maxQuantity) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t(
            'The product is out of stock and cannot be added to the cart!'
          ),
          action1: { label: this.$t('OK') }
        })
      } else if (maxQuantity < this.productQty) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t('Only {maxQuantity} products of this type are available!', { maxQuantity }),
          action1: { label: this.$t('OK') }
        })
      } else {
        this.maxQuantity = maxQuantity
        this.editModeSetFilters(filter)
      }
    }
  },
  watch: {
    isOnline: {
      async handler (isOnline) {
        if (isOnline) {
          const maxQuantity = await this.getQuantity()
          this.maxQuantity = maxQuantity
        }
      }
    },
    isMicrocartOpen: {
      async handler (isOpen) {
        if (isOpen) {
          const maxQuantity = await this.getQuantity()
          this.maxQuantity = maxQuantity
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
</style>
