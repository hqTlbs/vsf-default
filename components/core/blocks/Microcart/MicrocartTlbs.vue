<template>
  <v-navigation-drawer
    permanent
    width="100%"
  >
    <template v-slot:prepend>
      <v-list-item class="drawerheader drawerbasketheader" dark>
        <v-list-item-avatar>
          <v-icon left dark>shopping_cart </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ $t('Shopping cart') }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon>
            <v-icon
              @click.stop="closeMicrocartExtend"
              data-testid="closeMicrocart"
            >
              close
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider class="mt-1 adndrawerheader"></v-divider>
    </template>
    <v-divider />
    <transition name="fade">
      <div v-if="isEditMode" class="overlay" @click="closeEditMode" />
    </transition>
    <span v-if="!productsInCart.length" class="ma-5">{{ $t('Ihr Warenkorb ist noch leer.') }}</span>
    <product v-for="product in productsInCart" :key="product.server_item_id || product.id" :product="product" v-if="productsInCart.length" />
    <div v-if="productsInCart.length">
      <v-row class="pa-3 tempbasket__subtotal" v-for="(segment, index) in totals" :key="index" v-if="segment.code !== 'grand_total'">
        <v-col>
          <div>{{ segment.title }}</div>
        </v-col>
        <v-col class="text-right">
          <div>{{ segment.value | price(storeView) }}</div>
        </v-col>
      </v-row>
    </div>
    <template v-slot:append v-if="productsInCart.length > 0">
      <v-divider></v-divider>
      <v-row class="pa-3" v-for="(segment, index) in totals" :key="index" v-if="segment.code === 'grand_total'">
        <v-col>
          <div>
            <h3>Gesamtsumme</h3>
          </div>
        </v-col>
        <v-col class="text-right">
          <div>
            <strong>{{ segment.value | price(storeView) }}</strong>
            <br>
            <span class="small">(inkl.MWst.)</span>
          </div>
        </v-col>
      </v-row>
      <div class="pa-2">
        <button-full
          :link="{ name: 'checkout' }"
          @click.native="closeMicrocartExtend"
        >
          <v-btn
            depressed
            block
            tile
            class="inbasket"
            dark
          >
            <v-icon left dark>local_atm</v-icon>{{ $t('Go to checkout') }}
          </v-btn>
        </button-full>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import i18n from '@vue-storefront/i18n'
import { isModuleRegistered } from '@vue-storefront/core/lib/modules'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'

import VueOfflineMixin from 'vue-offline/mixin'
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress'
import InstantCheckout from 'src/modules/instant-checkout/components/InstantCheckout.vue'
import { registerModule } from '@vue-storefront/core/lib/modules'

import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ClearCartButton from 'theme/components/core/blocks/Microcart/ClearCartButton'
import ButtonFull from 'theme/components/theme/ButtonFull'
import ButtonOutline from 'theme/components/theme/ButtonOutline'
// import Product from 'theme/components/core/blocks/Microcart/Product'
import Product from 'theme/components/core/blocks/Microcart/ProductTlbs'
import EditMode from './EditMode'
import { InstantCheckoutModule } from 'src/modules/instant-checkout'

export default {
  components: {
    Product,
    ClearCartButton,
    ButtonFull,
    ButtonOutline,
    BaseInput,
    InstantCheckout
  },
  mixins: [
    VueOfflineMixin,
    EditMode,
    onEscapePress
  ],
  data () {
    return {
      addCouponPressed: false,
      couponCode: '',
      componentLoaded: false,
      isInstantCheckoutRegistered: isModuleRegistered('InstantCheckoutModule')
    }
  },
  props: {
    isCheckoutMode: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  beforeCreate () {
    registerModule(InstantCheckoutModule)
  },
  mounted () {
    this.$nextTick(() => {
      this.componentLoaded = true
    })
  },
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      appliedCoupon: 'cart/getCoupon',
      totals: 'cart/getTotals',
      isOpen: 'cart/getIsMicroCartOpen'
    }),
    storeView () {
      return currentStoreView()
    }
  },
  methods: {
    ...mapActions({
      applyCoupon: 'cart/applyCoupon'
    }),
    addDiscountCoupon () {
      this.addCouponPressed = true
    },
    clearCoupon () {
      this.$store.dispatch('cart/removeCoupon')
      this.addCouponPressed = false
    },
    toggleMicrocart () {
      this.$store.dispatch('ui/toggleMicrocart')
    },
    async setCoupon () {
      const couponApplied = await this.applyCoupon(this.couponCode)
      this.addCouponPressed = false
      this.couponCode = ''
      if (!couponApplied) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'warning',
          message: i18n.t('You\'ve entered an incorrect coupon code. Please try again.'),
          action1: { label: i18n.t('OK') }
        })
      }
    },
    closeMicrocartExtend () {
      this.toggleMicrocart()
      this.$store.commit('ui/setSidebar', false)
      this.addCouponPressed = false
    },
    onEscapePress () {
      this.$store.dispatch('ui/closeMicrocart')
    },
    clearCart () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: i18n.t('Are you sure you would like to remove all the items from the shopping cart?'),
        action1: { label: i18n.t('Cancel'), action: 'close' },
        action2: {
          label: i18n.t('OK'),
          action: async () => {
            // We just need to clear cart on frontend and backend.
            // but cart token can be reused
            await this.$store.dispatch('cart/clear', { disconnect: false })
          }
        },
        hasNoTimeout: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~theme/css/animations/transitions";

.mycontent {
  border: 10px solid red;
}
.close {
  i {
    opacity: 0.6;
  }

  &:hover,
  &:focus {
    i {
      opacity: 1;
    }
  }
}

.mt0 {
  @media (max-width: 767px) {
    margin-top: 0;
  }
}

.clearcart {
  &-col {
    display: flex;
    align-self: center;
  }
}

.products {
  @media (max-width: 767px) {
    padding: 30px 15px;
  }
}

.actions {
  @media (max-width: 767px) {
    padding: 0 15px;
  }

  .link {
    @media (max-width: 767px) {
      display: flex;
      justify-content: center;
      padding: 20px 70px;
      &.checkout {
        margin-top: 55px;
        padding: 0;
      }
    }
  }
}

.summary {
  @media (max-width: 767px) {
    padding: 0 15px;
    font-size: 12px;
  }
}

.summary-heading {
  @media (max-width: 767px) {
    font-size: 18px;
  }
}

.total-price-label {
  @media (max-width: 767px) {
    font-size: 18px;
  }
}

.total-price-value {
  @media (max-width: 767px) {
    font-size: 24px;
  }
}

.delete-button {
  vertical-align: middle;
}

.coupon-wrapper {
  display: flex;

  .button-outline {
    text-transform: inherit;
    width: 50%;
  }

  .coupon-input {
    margin-right: 20px;
    width: 100%;
  }
}

.overlay {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  z-index: 0;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .4s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
