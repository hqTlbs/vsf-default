<template>
  <v-col :xl="xl" :lg="lg" :md="md" :sm="sm"
         class="d-flex flex-column pr-0 pb-5 flex-grow-1 flex-shrink-0 justify-center products__gridview__item"
  >
    <v-card tile elevation="0" outlined class="mb-1 flex-grow-1 flex-shrink-1">
      <router-link
        class="block no-underline product-link"
        :to="productLink"
        data-testid="productLink"
      >
        <product-image
          class="product-cover__thumb"
          :image="thumbnailObj"
          :alt="product.name | htmlDecode"
          :calc-ratio="false"
          data-testid="productImage"
        />
      </router-link>
      <div class="new" v-if="product.new==1">Neu</div>
      <div class="sale" v-if="product.sale==1">%</div>
      <div class="manufacturer"> {{ product.manufacturer_name | htmlDecode }}</div>
      <v-card-title class="productname">
        <router-link
          class="block no-underline product-link"
          :to="productLink"
          data-testid="productLink"
        >
          {{ product.name | htmlDecode }}
        </router-link>
      </v-card-title>
      <v-divider class="mx-4"></v-divider>
      <v-card-text>
        <h4>Listpreis: {{ product.price_incl_tax | price(storeView) }}</h4>
        <span class="heklabel">Ihr HEK:</span>
        <span class="price hek">
            {{ product.original_price_incl_tax | price(storeView) }}
        </span>
        <div class="sku mt-2">Art. Nr: {{ product.sku }}</div>
        <div class="adnnr">ADN. Nr: {{ product.id }}</div>
      </v-card-text>
      <v-card-text class="shorttext fill-height" v-if="description">{{ product.description }}</v-card-text>
      <v-card-text>
        <v-btn depressed block tile class="inbasket" dark v-if="product.configarticle==0">
          <v-icon left dark tile>shopping_cart</v-icon>
          <span>In den Warenkorb</span></v-btn>
        <v-btn depressed block tile class="inbasket" :href="product.detailurl" dark v-if="product.configarticle==1">
          <v-icon left dark>settings</v-icon>
          <span>Details</span></v-btn>
      </v-card-text>
      <v-divider class="mx-4"></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon title="Auf die Favoritenliste">mdi-heart-outline</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon title="Auf die Vergleichsliste">mdi-compare</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon title="Diesen Artikel weiterempfehlen">mdi-share</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
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
    description: {
      type: Boolean,
      default: true
    },
    onlyImage: {
      type: Boolean,
      default: false
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
          const cachedproduct = rootStore.state.stock.cache[confChild.id]
          if (typeof cachedproduct === 'undefined' || cachedproduct === null) {
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
  align-products: center;
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
