<template>
  <v-stepper-content step="3">
    <v-row>
      <v-col>
        <v-toolbar dense flat class="checkoutbars">
          <v-toolbar-title>Rechnungsadresse</v-toolbar-title>
        </v-toolbar>
        <div class="ma-5" v-if="currentUser">
          <p class="mt-5">
            <strong>{{ personalDetails.company.name1 }}</strong>
            <br> {{ personalDetails.salutation }} {{ personalDetails.firstName }} {{ personalDetails.lastName }}
            <br>
            <br> {{ personalDetails.street }}
            <br> {{ personalDetails.zip }} {{ personalDetails.city }}
            <br>
          </p>
          <p>
            <v-icon class="addressicons">
              phone
            </v-icon>{{ personalDetails.phone }}
            <br>
            <v-icon class="addressicons">
              print
            </v-icon>{{ personalDetails.telefax }}
            <br>
            <br>
            <v-icon class="addressicons">
              mail
            </v-icon>{{ personalDetails.emailAddress }}
            <br>
          </p>
        </div>
      </v-col>
      <v-col>
        <v-toolbar dense flat class="checkoutbars">
          <v-toolbar-title>Lieferadresse</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="backToPersonalDetails">
            <v-icon>edit</v-icon>
          </v-btn>
        </v-toolbar>
        <div v-if="customerdata.likeinvoiceaddress" class="ma-5">
          Wie Rechnungsadresse
        </div>
        <div v-if="customerdata.selectedaddress >= 0 && !customerdata.likeinvoiceaddress" class="ma-5">
          <p>
            <b>{{customerdata.deliverydresses[customerdata.selectedaddress].companyname}}</b>
            <br> {{customerdata.deliverydresses[customerdata.selectedaddress].title}} {{customerdata.deliverydresses[customerdata.selectedaddress].firstname}} {{customerdata.deliverydresses[customerdata.selectedaddress].surname}}
            <br>
          </p>
          {{customerdata.deliverydresses[customerdata.selectedaddress].addinfo}}
          <br>
          <p>
            {{customerdata.deliverydresses[customerdata.selectedaddress].street}} {{customerdata.deliverydresses[customerdata.selectedaddress].houseno}}
            <br> {{customerdata.deliverydresses[customerdata.selectedaddress].zip}} {{customerdata.deliverydresses[customerdata.selectedaddress].city}}
            <br> {{customerdata.deliverydresses[customerdata.selectedaddress].country}}
            <br>
          </p>
          <p>
            <v-icon class="addressicons">phone</v-icon>{{customerdata.deliverydresses[customerdata.selectedaddress].phone}}
            <br>
            <v-icon class="addressicons">print</v-icon>{{customerdata.deliverydresses[customerdata.selectedaddress].fax}}
            <br>
          </p>
        </div>
      </v-col>
      <v-col v-if="productsInCartWithEkdPflicht.length > 0">
        <div>
          <v-toolbar dense flat class="checkoutbars">
            <v-toolbar-title>Endkundenadresse<span>n</span></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="backToPersonalDetails">
              <v-icon>edit</v-icon>
            </v-btn>
          </v-toolbar>
          <div v-if="customerdata.sameendcustomers == 'true'" class="ma-5">
            <b>{{customerdata.endcustomers[0].company}}</b>
            <br>
            <p>
              {{customerdata.endcustomers[0].name}}
              <br> {{customerdata.endcustomers[0].address}}
              <br> {{customerdata.endcustomers[0].zip}} {{customerdata.endcustomers[0].city}}
              <br>
            </p>
            <p>
              <v-icon class="addressicons">phone</v-icon> {{customerdata.endcustomers[0].phone}}
              <br>
              <v-icon class="addressicons">print</v-icon> {{customerdata.endcustomers[0].fax}}
              <br>
              <v-icon class="addressicons">mail</v-icon> {{customerdata.endcustomers[0].mail}}
              <br>
            </p>

          </div>
          <div v-else-if="customerdata.sameendcustomers == 'false'" id="ec">
            <div v-for="(basketitem) in productsInCartWithEkdPflicht" :key="basketitem.server_item_id">
              <div v-if="item.endcustomer==1" class="ma-5">
                <div class="mb-2">
                  <strong>{{ basketitem.manufacturer_name | htmlDecode }} - {{ basketitem.name | htmlDecode }}</strong>
                </div>
                <div v-if="basketitem.endcustomerformvalid">
                  <b> {{ basketitem.endcustomername}}</b>
                  <br> {{ basketitem.endcustomercontact}}
                  <br> {{ basketitem.endcustomeraddress}}, {{ basketitem.endcustomerzip}} {{ basketitem.endcustomercity}}
                  <br>
                  <v-icon class="addressicons">phone</v-icon>{{ basketitem.endcustomerphone}}
                  <br>
                  <v-icon class="addressicons">print</v-icon> {{ basketitem.endcustomerfax}}
                  <br>
                  <v-icon class="addressicons">mail</v-icon>{{ basketitem.endcustomermail}}
                  <br>
                </div>

                <div v-else class="error--text my-3">
                  Endkundendaten unvollständig. Bitte füllen Sie alle Pflichtfelder.
                  <br>
                </div>
                <v-divider></v-divider>
              </div>
            </div>
            <v-btn @click="checkoutprocess = 2" outlined tile color="primary" v-if="!allecarticlesvalid" class="ma-5">Jetzt korrigieren</v-btn>
          </div>
          <div v-else class="pa-5 error--text" id="ec">
            Sie haben endkundenpflichtige Artikel in Ihrem Warenkorb. Bitte geben Sie die vollständigen Daten ein.
            <br>
            <v-btn @click="checkoutprocess = 2" outlined tile color="primary" class="mt-5">Jetzt korrigieren</v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-toolbar dense flat class="checkoutbars">
      <v-toolbar-title>Warenkorb</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="backToCartSummary">
        <v-icon>edit</v-icon>
      </v-btn>
    </v-toolbar>
    <cart-view-only />
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field flat tile dense solo outlined label="Referenz" hint="Dieses Feld können Sie nutzen um Ihre Bestellung nachher besser zuzuordnen. z.B. ihre interne Auftragsnummmmer oder Kunden"></v-text-field>
        <v-textarea dense outlined name="message" label="Nachricht an uns" no-resize rows="2"></v-textarea>
      </v-col>
      <v-col class="d-flex justify-end align-end pb-5">
        <v-checkbox
          v-model="orderReview.terms"
          required
          :rules="[rules.required]"
        >
          <template v-slot:label>
            <div id="acceptTermsCheckbox">
              Ich habe die
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <a target="_blank" href="https://www.adn.de/index.php?id=115" @click.stop v-on="on">
                    AGB
                  </a>
                </template>
                Klick öffnet die AGB in einem neuem Fenster.
              </v-tooltip>
              gelesen und erkläre mich mit ihnen einverstanden.
            </div>
          </template>
        </v-checkbox>
      </v-col>
    </v-row>
    <v-row class="pa-2 ma-1 checkout__nextstep">
      <v-col class="d-flex justify-start align-start">
        <v-btn depressed tile class="inbasket " dark @click="backToPersonalDetails">
          <v-icon>chevron_left</v-icon>
          Zurück
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-end align-start">
        <v-btn depressed tile class="directorder" dark @click="placeOrder">
          Zahlungspflichtig Bestellen
        </v-btn>
      </v-col>
    </v-row>
    <div class="mt-15 d-flex justify-end">
      *Alle Preise zzgl. MwSt. und Transaktionskosten
    </div>
  </v-stepper-content>
</template>

<script>
import { sameAs } from 'vuelidate/lib/validators'
import Composite from '@vue-storefront/core/mixins/composite'

import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import ButtonFull from 'theme/components/theme/ButtonFull'
import CartViewOnly from 'theme/components/core/blocks/Checkout/CartViewOnlyTlbs'
import { PersonalDetails } from '@vue-storefront/core/modules/checkout/components/PersonalDetails'
import Modal from 'theme/components/core/Modal'
import { OrderReview } from '@vue-storefront/core/modules/checkout/components/OrderReview'
import { OrderModule } from '@vue-storefront/core/modules/order'
import { registerModule } from '@vue-storefront/core/lib/modules'

export default {
  components: {
    BaseCheckbox,
    ButtonFull,
    CartViewOnly,
    Modal
  },
  mixins: [OrderReview, PersonalDetails, Composite],
  validations: {
    orderReview: {
      terms: {
        sameAs: sameAs(() => true)
      }
    }
  },
  props: {
    customerdata: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      rules: {
        required: value => !!value || 'Dieses Feld muß ausgefüllt werden.'
      }
    }
  },
  computed: {
    productsInCartWithEkdPflicht () {
      return this.$store.state.cart.cartItems.filter(p => p.attr_ekd_pflicht > 1)
    }
  },
  beforeCreate () {
    registerModule(OrderModule)
  },
  methods: {
    onSuccess () {
    },
    onFailure (result) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(result.result),
        action1: { label: this.$t('OK') }
      })
    },
    backToPersonalDetails () {
      this.$bus.$emit('checkout-before-edit', 'personalDetails')
    },
    backToCartSummary () {
      this.$bus.$emit('checkout-before-edit', 'cartSummary')
    }
  }
}
</script>

<style lang="scss" scoped>
  .link {
    text-decoration: underline;
  }

  .cartsummary-wrapper {
    @media (min-width: 767px) {
      display: none;
    }
  }
</style>
