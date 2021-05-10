<template>
  <div class="row top-xs w-100 brdr-1 brdr-cl-primary p15 mb15">
    <div class="col-sm-2 col-md-2">
      {{ product.id }}
    </div>
    <div class="col-sm-2 col-md-2">
      {{ product.sku | htmlDecode }}
    </div>
    <div class="col-sm-6 col-md-6">
      <p class="mb0 cl-accent mt0" style="font-size: 15px;" v-if="!onlyImage">
        <router-link
          class="block no-underline product-link"
          :to="productLink"
          data-testid="productLink"
        >
        {{ product.manufacturer_name | htmlDecode }} {{ product.name | htmlDecode }}
      </router-link>
      </p>
      <p class="mb0 cl-secondary mt0" style="font-size: 13px;" v-if="!onlyImage">
        {{ product.series_1_value1 | htmlDecode }} # {{ product.series_2_value1 | htmlDecode }}<br>{{ product.series_3_value1 | htmlDecode }} [{{ product.series_3_value2 | htmlDecode }}]
      </p>
    </div>
    <div class="col-sm-2 col-md-2">
      <span
        class="price-original mr5 lh30 cl-secondary"
        style="font-size: 15px;"
        v-if="product.special_price && parseFloat(product.original_price_incl_tax) > 0 && !onlyImage"
      >{{ product.original_price_incl_tax | price(storeView) }}</span>
      <span
        class="price-special lh30 cl-accent weight-700"
        style="font-size: 15px;"
        v-if="product.special_price && parseFloat(product.special_price) > 0 && !onlyImage"
      >{{ product.price_incl_tax | price(storeView) }}</span>

      <span
        class="lh30 cl-secondary"
        style="font-size: 15px;"
        v-if="!product.special_price && parseFloat(product.price_incl_tax) > 0 && !onlyImage"
      >{{ product.price_incl_tax | price(storeView) }}</span>
    </div>
  </div>
</template>

<script>
import rootStore from '@vue-storefront/core/store'
import { ProductTile } from '@vue-storefront/core/modules/catalog/components/ProductTile.ts'
import config from 'config'
import ProductImage from './ProductImage'
import AddToWishlist from 'theme/components/core/blocks/Wishlist/AddToWishlist'
import AddToCompare from 'theme/components/core/blocks/Compare/AddToCompare'
import { IsOnWishlist } from '@vue-storefront/core/modules/wishlist/components/IsOnWishlist'
import { IsOnCompare } from '@vue-storefront/core/modules/compare/components/IsOnCompare'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

export default {
  mixins: [ProductTile, IsOnWishlist, IsOnCompare],
  components: {
    ProductImage,
    AddToWishlist,
    AddToCompare
  },
  props: {
    labelsActive: {
      type: Boolean,
      default: true
    },
    onlyImage: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    thumbnailObj () {
      return {
        src: this.thumbnail,
        loading: this.thumbnail
      }
    },
    favoriteIcon () {
      return this.isOnWishlist ? 'favorite' : 'favorite_border'
    },
    storeView () {
      return currentStoreView()
    }
  },
  methods: {
    onProductPriceUpdate (product) {
      if (product.sku === this.product.sku) {
        Object.assign(this.product, product)
      }
    },
    visibilityChanged (isVisible, entry) {
      if (
        isVisible &&
        config.products.configurableChildrenStockPrefetchDynamic &&
        config.products.filterUnavailableVariants &&
        this.product.type_id === 'configurable' &&
        this.product.configurable_children &&
        this.product.configurable_children.length > 0
      ) {
        const skus = [this.product.sku]
        for (const confChild of this.product.configurable_children) {
          const cachedItem = rootStore.state.stock.cache[confChild.id]
          if (typeof cachedItem === 'undefined' || cachedItem === null) {
            skus.push(confChild.sku)
          }
        }
        if (skus.length > 0) {
          rootStore.dispatch('stock/list', { skus: skus }) // store it in the cache
        }
      }
    }
  },
  beforeMount () {
    this.$bus.$on('product-after-priceupdate', this.onProductPriceUpdate)
  },
  beforeDestroy () {
    this.$bus.$off('product-after-priceupdate', this.onProductPriceUpdate)
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/animations/transitions';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';

$bg-secondary: color(secondary, $colors-background);
$border-secondary: color(secondary, $colors-border);
$color-white: color(white);

.product {
  position: relative;
  padding-bottom: 20px;
  @media (max-width: 767px) {
    padding-bottom: 10px;
  }
  &__icons {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    padding-right: 20px;
    padding-top: 10px;
  }
  &__icon {
    padding-top: 10px;
    opacity: 0;
    z-index: 2;
    transition: 0.3s opacity $motion-main;
    @media (max-width: 767px) {
      opacity: 1;
    }
    &--active {
      opacity: 1;
    }
  }
  &:hover {
    .product__icon {
      opacity: 1;
    }
  }
}

.price-original {
  text-decoration: line-through;
}

%label {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: $border-secondary;
  text-transform: uppercase;
  color: $color-white;
  font-size: 12px;
}

.product-cover {
  overflow: hidden;

  &__thumb {
    padding-bottom: calc(143.88% / (164.5 / 100));
    @media screen and (min-width: 768px) {
      padding-bottom: calc(300% / (276.5 / 70));
    }
    opacity: 0.8;
    will-change: opacity, transform;
    transition: 0.3s opacity $motion-main, 0.3s transform $motion-main;
  }

  @media screen and (min-width: 768px) {
    &:hover {
      .product-cover__thumb {
        opacity: 1;
        transform: scale(1.1);
      }
      &.sale::after,
      &.new::after {
        opacity: 0.8;
      }
    }
  }

  &.sale {
    &::after {
      @extend %label;
      content: 'Sale';
    }
  }
  &.new {
    &::after {
      @extend %label;
      content: 'New';
    }
  }
}
</style>
