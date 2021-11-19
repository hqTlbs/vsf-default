<template>
  <div id="checkout">
    <div class="container">
      <div class="row">
        <v-container>
          <template>
            <v-stepper flat outlined tile v-model="activeCheckoutStep" non-linear class="checkout__stepper">
              <v-stepper-header flat outlined v-if="activeCheckoutStep!=4">
                <v-stepper-step step="1" editable>
                  {{ $t('Warenkorb') }}
                </v-stepper-step>

                <v-divider />

                <v-stepper-step step="2" editable>
                  {{ $t('Kundendaten') }}
                </v-stepper-step>

                <v-divider />

                <v-stepper-step step="3" :editable="currentUser">
                  {{ $t('Prüfen & Absenden') }}
                </v-stepper-step>
                <v-divider />

                <v-stepper-step step="4">
                  {{ $t('Fertig') }}
                </v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <h2>{{ $t('Warenkorb') }}</h2>
                  <cart-summary />
                </v-stepper-content>
                <personal-details :customerdata="customerdata" :isActive="false" />
                <order-review :is-active="false" :customerdata="customerdata" />
                <thank-you-page v-show="isThankYouPage" />
              </v-stepper-items>
            </v-stepper>
          </template>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import Checkout from '@vue-storefront/core/pages/Checkout'

import PersonalDetails from 'theme/components/core/blocks/Checkout/PersonalDetailsTlbs'
import Shipping from 'theme/components/core/blocks/Checkout/Shipping'
import Payment from 'theme/components/core/blocks/Checkout/Payment'
import OrderReview from 'theme/components/core/blocks/Checkout/OrderReviewTlbs'
import CartSummary from 'theme/components/core/blocks/Checkout/CartSummaryTlbs'
import ThankYouPage from 'theme/components/core/blocks/Checkout/ThankYouPage'
import { registerModule } from '@vue-storefront/core/lib/modules'
import { OrderModule } from '@vue-storefront/core/modules/order'
import { mapState } from 'vuex';
import { isServer } from '@vue-storefront/core/helpers';

export default {
  components: {
    PersonalDetails,
    Shipping,
    Payment,
    OrderReview,
    CartSummary,
    ThankYouPage
  },
  mixins: [Checkout],
  data () {
    return {
      activeCheckoutStep: 1,
      customerdata: {
        likeinvoiceaddress: true,
        sameendcustomers: true,
        selectedaddress: {},
        endcustomers: [{
          formvalid: false,
          company: '',
          name: '',
          address: '',
          zip: '',
          city: '',
          contact: '',
          phone: '',
          fax: '',
          mail: ''
        }],
        deliverydresses: [{
          id: 0,
          addressname: 'Humboldstr.8 - 1234 Diestadt',
          companyname: 'Tritop Informatik GmbH',
          addinfo: '',
          title: 'Herr',
          firstname: 'Max',
          surname: 'Mustermann',
          street: 'Humboldstrasse',
          houseno: '8',
          zip: '123424',
          city: 'diestadt',
          country: 'Deutschland',
          phone: '0355 8789797',
          fax: '0355 7877777',
          mail: 'shoptest_de@adn.de'
        },
        {
          id: 1,
          addressname: 'Filiale Frankfurt',
          companyname: 'Tritop Informatik GmbH',
          addinfo: '',
          title: 'Herr',
          firstname: 'Max',
          surname: 'Mustermann',
          street: 'Hochhausstraße',
          houseno: '110',
          zip: '123424',
          city: 'Frankfurt',
          country: 'Deutschland',
          phone: '0355 8789797',
          fax: '0355 7877777',
          mail: 'shoptest_de@adn.de'
        }]
      }
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => {
        if (state.user.current) {
          return true
        } else {
          return false
        }
      }
    })
  },
  beforeCreate () {
    registerModule(OrderModule)
  },
  mounted () {
    this.$store.commit('ui/setMicrocart', false)
    this.$store.commit('ui/setSidebar', false)
  },
  methods: {
    onAfterPersonalDetails (receivedData, validationResult) {
      this.personalDetails = receivedData
      this.validationResults.personalDetails = validationResult

      this.activateSection('orderReview')

      this.savePersonalDetails()
      this.focusedField = null
    },
    activateSection (sectionToActivate) {
      for (let section in this.activeSection) {
        this.activeSection[section] = false
      }
      this.activeSection[sectionToActivate] = true
      if (!isServer) window.location.href = window.location.origin + window.location.pathname + '#' + sectionToActivate
      switch(sectionToActivate) {
        case 'cartSummary':
          this.activeCheckoutStep = 1
          break;
        case 'personalDetails':
          this.activeCheckoutStep = 2
          break;
        case 'orderReview':
          this.activeCheckoutStep = 3
          break;
      }
    },
    notifyEmptyCart () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('Shopping cart is empty. Please add some products before entering Checkout'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyOutStock (chp) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: chp.name + this.$t(' is out of stock!'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyNotAvailable () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t('Some of the ordered products are not available!'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyStockCheck () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('Stock check in progress, please wait while available stock quantities are checked'),
        action1: { label: this.$t('OK') }
      })
    },
    notifyNoConnection () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t('There is no Internet connection. You can still place your order. We will notify you if any of ordered products is not available because we cannot check it right now.'),
        action1: { label: this.$t('OK') }
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~theme/css/base/text';
  @import '~theme/css/variables/colors';
  @import '~theme/css/helpers/functions/color';
  $bg-secondary: color(secondary, $colors-background);
  $color-tertiary: color(tertiary);
  $color-secondary: color(secondary);
  $color-error: color(error);
  $color-white: color(white);
  $color-black: color(black);

  #checkout {
    .number-circle {
      width: 35px;
      height: 35px;

      @media (max-width: 768px) {
        width: 25px;
        height: 25px;
        line-height: 25px;
      }
    }
    .radioStyled {
      display: block;
      position: relative;
      padding-left: 35px;
      margin-bottom: 12px;
      cursor: pointer;
      font-size: 16px;
      line-height: 30px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;

      input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
      }

      .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        border-radius: 50%;
        border: 1px solid $bg-secondary;

        &:after {
          content: "";
          position: absolute;
          display: none;
          top: 3px;
          left: 3px;
          width: 19px;
          height: 19px;
          border-radius: 50%;
          background: $color-secondary;
        }
      }

      input:checked ~ .checkmark:after {
        display: block;
      }
    }
  }

  .line {
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 37px;
      z-index: -1;
      width: 1px;
      height: 100%;
      background-color: $bg-secondary;

      @media (max-width: 768px) {
        display: none;
      }
    }
  }

  .checkout-title {
    @media (max-width: 767px) {
      background-color: $bg-secondary;
      margin-bottom: 25px;

      h1 {
        font-size: 36px;
      }
    }
  }
</style>
