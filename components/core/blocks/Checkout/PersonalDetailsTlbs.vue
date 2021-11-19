<template>
  <v-stepper-content step="2">
    <h2>{{ $t('Kundendaten') }}</h2>
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
        <div v-else class="error--text ma-5">
          Bitte loggen Sie sich ein.
        </div>
      </v-col>
      <v-col>
        <v-toolbar dense flat class="checkoutbars">
          <v-toolbar-title>Lieferadresse</v-toolbar-title>
        </v-toolbar>
        <div class="ma-5">
          <v-checkbox v-model="customerdata.likeinvoiceaddress" label="wie Rechnungsadresse" />
        </div>
        <div v-if="!customerdata.likeinvoiceaddress" class="ma-5">
          <v-select :items="customerdata.deliverydresses" item-text="addressname" item-value="id" v-model="customerdata.selectedaddress" outlined dense label="gespeicherte Lieferadressen" v-if="!editdeliveryaddress && customerdata.deliverydresses.length > 0" />
          <div v-if="customerdata.selectedaddress >= 0 && !editdeliveryaddress">
            <strong>Ausgewählte Lieferadresse:</strong>
            <br>

            <p>
              {{ customerdata.deliverydresses[customerdata.selectedaddress].companyname }}
              <br> {{ customerdata.deliverydresses[customerdata.selectedaddress].title }} {{ customerdata.deliverydresses[customerdata.selectedaddress].firstname }} {{ customerdata.deliverydresses[customerdata.selectedaddress].surname }}
              <br>
            </p>
            {{ customerdata.deliverydresses[customerdata.selectedaddress].addinfo }}
            <br>
            <p>
              {{ customerdata.deliverydresses[customerdata.selectedaddress].street }} {{ customerdata.deliverydresses[customerdata.selectedaddress].houseno }}
              <br> {{ customerdata.deliverydresses[customerdata.selectedaddress].zip }} {{ customerdata.deliverydresses[customerdata.selectedaddress].city }}
              <br> {{ customerdata.deliverydresses[customerdata.selectedaddress].country }}
              <br>
            </p>
            <p>
              <v-icon class="addressicons">
                phone
              </v-icon>{{ customerdata.deliverydresses[customerdata.selectedaddress].phone }}
              <br>
              <v-icon class="addressicons">
                print
              </v-icon>{{ customerdata.deliverydresses[customerdata.selectedaddress].fax }}
              <br>
            </p>
          </div>
          <div class="mt-5">
            <v-btn text outlined tile color="primary" @click="editdeliveryaddress = !editdeliveryaddress" v-if="customerdata.selectedaddress >= 0 && !editdeliveryaddress">
              Adresse bearbeiten
            </v-btn>
            <v-btn text outlined tile color="primary" @click="newdeliveryadress()">
              Neue Adresse anlegen
            </v-btn>
          </div>

          <div v-if="editdeliveryaddress">
            <v-text-field v-model="customerdata.deliverydresses[customerdata.selectedaddress].addressname" label="Adressname (nur für Ihre eigene Wiedererkennung)" hint="Vergeben Sie hier einen Namen um die Adresse unter diesem zu speichern z.B. Filiale West" outlined dense class="mt-5" />

            <v-text-field v-model="customerdata.deliverydresses[customerdata.selectedaddress].companyname" label="Firmenname*" :rules="[rules.required, rules.counter]" outlined dense />
            <v-text-field v-model="customerdata.deliverydresses[customerdata.selectedaddress].addinfo" label="Zusätliche Informationen" outlined dense />
            <v-row class="mt-n2 pa-0 mb-0">
              <v-col class="pt-0 mt-0">
                <v-select :items="title" label="Anrede" outlined dense v-model="customerdata.deliverydresses[customerdata.selectedaddress].title" />
              </v-col>
              <v-col class="pt-0 mt-0">
                <v-text-field v-model="customerdata.deliverydresses[customerdata.selectedaddress].firstname" label="Vorname*" :rules="[rules.required, rules.counter]" outlined dense />
              </v-col>
              <v-col class="pt-0 mt-0">
                <v-text-field v-model="customerdata.deliverydresses[customerdata.selectedaddress].surname" label="Nachname*" :rules="[rules.required, rules.counter]" outlined dense />
              </v-col>
            </v-row>
            <v-row class="mt-n5 pa-0 mb-0">
              <v-col class="pt-0 mt-0">
                <v-text-field v-model="customerdata.deliverydresses[customerdata.selectedaddress].street" label="Strasse*" :rules="[rules.required, rules.counter]" outlined dense />
              </v-col>
              <v-col cols="3" class=" pt-0 mt-0">
                <v-text-field v-model="customerdata.deliverydresses[customerdata.selectedaddress].houseno" label="Hausnummer*" :rules="[rules.required, rules.counter]" outlined dense />
              </v-col>
            </v-row>
            <v-row class="mt-n5 pa-0 mb-0">
              <v-col class="pt-0 mt-0">
                <v-text-field v-model="customerdata.deliverydresses[customerdata.selectedaddress].zip" label="PLZ" outlined dense />
              </v-col>
              <v-col class="pt-0 mt-0">
                <v-text-field v-model="customerdata.deliverydresses[customerdata.selectedaddress].city" label="Stadt" outlined dense />
              </v-col>
            </v-row>
            <v-select :items="delivercountries" label="Land" outlined dense v-model="customerdata.deliverydresses[customerdata.selectedaddress].country" class="mt-n5" />

            <v-row class="mt-n1 pa-0 mb-0">
              <v-col class="pt-0 mt-0">
                <v-text-field v-model="customerdata.deliverydresses[customerdata.selectedaddress].phone" label="Telefon" outlined dense />
              </v-col>
              <v-col class="pt-0 mt-0">
                <v-text-field v-model="customerdata.deliverydresses[customerdata.selectedaddress].fax" label="Fax" outlined dense />
              </v-col>
            </v-row>

            <v-btn text outlined tile color="primary" @click="editdeliveryaddress = !editdeliveryaddress">
              Speichern
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
    <div v-if="productsInCartWithEkdPflicht.length > 0">
      <v-toolbar dense flat class="checkoutbars">
        <v-toolbar-title>Endkundendaten</v-toolbar-title>
      </v-toolbar>
      <div class="error--text font-weight-bold ma-4 mb-0">
        Sie haben Endkundepflichtige Artikel in Ihrem Warenkorb. Dazu müssen Sie dem Produkt zugeordnete Endkundendaten eingeben.
      </div>
      <div class="mx-4 mt-0 mb-5">
        Bei Rückfragen rufen Sie uns gerne an unter +49 2327 9912-0 oder nutzen Sie unseren Chat.
      </div>
      <div v-if="customerdata.sameendcustomers">
        <b class="mx-4">Endkundendaten für folgende Artikel:</b>
        <div v-for="product in productsInCartWithEkdPflicht" :key="product.server_item_id || product.id" class="mx-4">
          <ul>
            <li><strong><a :href="productLink(product)">{{ product.manufacturer_name | htmlDecode }} - {{ product.name | htmlDecode }}</a></strong></li>
          </ul>
        </div>
      </div>
      <div v-if="productsInCartWithEkdPflicht.length >= 2" class="mt-5">
        <span class="ma-4">Bitte auswählen:</span>
        <v-radio-group v-model="customerdata.sameendcustomers" mandatory class="px-4">
          <v-radio label="Alle Produkte im Warenkorb mit Endkundenpflicht haben den gleichen Endkunden" value="true" />
          <v-radio label="Die Produkte im Warenkorb mit Endkundenpflicht haben unterschiedliche Endkunden" value="false" />
        </v-radio-group>
      </div>
      <div class="ma-4" v-if="customerdata.sameendcustomers == 'true'">
        <v-form ref="endcustomerform" v-model="customerdata.endcustomerformvalid" lazy-validation>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field label="Endkunde Firmenname*" dense outlined class="mt-1 mb-0" :rules="[rules.required, rules.counter]" v-model="customerdata.endcustomers[0].name" required />
              <v-text-field label="Strasse/Hausnummer*" dense outlined class="mt-n2 mb-0" v-model="customerdata.endcustomers[0].address" :rules="[rules.required, rules.counter]" required />
              <v-row class="mt-n2 mb-0">
                <v-col class="pt-0 mt-0">
                  <v-text-field label="PLZ*" dense outlined v-model="customerdata.endcustomers[0].zip" :rules="[rules.required, rules.counter]" required />
                </v-col>
                <v-col class="pt-0 mt-0">
                  <v-text-field label="Stadt*" dense outlined v-model="customerdata.endcustomers[0].city" :rules="[rules.required, rules.counter]" required />
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-text-field label="Ansprechpartner*" dense outlined class="mt-1 mb-0" v-model="customerdata.endcustomers[0].contact" :rules="[rules.required, rules.counter]" />
              <v-row class="mt-n3 mb-0">
                <v-col class="pt-0 mt-0">
                  <v-text-field label="Telefon*" dense outlined class="mt-1 mb-0" v-model="customerdata.endcustomers[0].phone" :rules="[rules.required, rules.counter]" />
                </v-col>
                <v-col class="pt-0 mt-0">
                  <v-text-field label="Fax" dense outlined class="mt-1 mb-0" v-model="customerdata.endcustomers[0].fax" />
                </v-col>
              </v-row>
              <v-text-field label="Email*" dense outlined v-model="customerdata.endcustomers[0].mail" :rules="[rules.required, rules.email]" required class="mt-n5 mb-0" />
            </v-col>
          </v-row>
        </v-form>
      </div>
      <div v-else v-for="(basketitem, i) in productsInCartWithEkdPflicht" :key="basketitem.server_item_id">
        <div class="pa-3 mb-1">
          <v-row>
            <v-col>
              <strong>Endkundendaten für: <a :href="productLink(basketitem)">{{ basketitem.manufacturer_name | htmlDecode }} - {{ basketitem.name | htmlDecode }}</a></strong>
            </v-col>
          </v-row>
          <v-form :ref="i" :v-model="basketitem.endcustomerformvalid" lazy-validation>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field label="Endkunde Firmenname*" dense outlined class="mt-1 mb-0" :rules="[rules.required, rules.counter]" v-model="basketitem.endcustomername" required />
                <v-text-field label="Strasse/Hausnummer*" dense outlined class="mt-n2 mb-0" v-model="basketitem.endcustomeraddress" :rules="[rules.required, rules.counter]" required />
                <v-row class="mt-n2 mb-0">
                  <v-col class="pt-0 mt-0">
                    <v-text-field label="PLZ*" dense outlined v-model="basketitem.endcustomerzip" :rules="[rules.required, rules.counter]" required />
                  </v-col>
                  <v-col class="pt-0 mt-0">
                    <v-text-field label="Stadt*" dense outlined v-model="basketitem.endcustomercity" :rules="[rules.required, rules.counter]" required />
                  </v-col>
                </v-row>
              </v-col>
              <v-col>
                <v-text-field label="Ansprechpartner*" dense outlined class="mt-1 mb-0" v-model="basketitem.endcustomercontact" :rules="[rules.required, rules.counter]" />
                <v-row class="mt-n3 mb-0">
                  <v-col class="pt-0 mt-0">
                    <v-text-field label="Telefon*" dense outlined class="mt-1 mb-0" v-model="basketitem.endcustomerphone" :rules="[rules.required, rules.counter]" />
                  </v-col>
                  <v-col class="pt-0 mt-0">
                    <v-text-field label="Fax" dense outlined class="mt-1 mb-0" v-model="basketitem.endcustomerfax" />
                  </v-col>
                </v-row>
                <v-text-field label="Email*" dense outlined v-model="basketitem.endcustomermail" :rules="[rules.required, rules.email]" required class="mt-n5 mb-0" />
              </v-col>
            </v-row>
          </v-form>
        </div>
      </div>
    </div>
    </div>
    <v-row class="pa-2 ma-1 checkout__nextstep">
      <v-col class="d-flex justify-start align-start">
        <v-btn depressed tile class="inbasket1" dark @click="backStep">
          <v-icon>chevron_left</v-icon> Zurück
        </v-btn>
      </v-col>
      <v-col class="d-flex justify-end align-start">
        <v-btn
          depressed
          tile
          class="inbasket"
          dark
          :disabled="!currentUser"
          @click="sendPersonalDataToCheckout"
        >
          Weiter <v-icon>chevron_right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-stepper-content>
</template>

<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { PersonalDetails } from '@vue-storefront/core/modules/checkout/components/PersonalDetails'

import BaseCheckbox from 'theme/components/core/blocks/Form/BaseCheckbox'
import BaseInput from 'theme/components/core/blocks/Form/BaseInput'
import ButtonFull from 'theme/components/theme/ButtonFull'
import Tooltip from 'theme/components/core/Tooltip'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';

export default {
  components: {
    ButtonFull,
    Tooltip,
    BaseCheckbox,
    BaseInput
  },
  mixins: [PersonalDetails],
  props: {
    customerdata: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      title: ['Herr', 'Frau'],
      editdeliveryaddress: false,
      delivercountries: ['Deutschland', 'Österreich', 'Schweiz', 'Liechtenstein', 'Luxemburg'],
      rules: {
        required: value => !!value || 'Dieses Feld muß ausgefüllt werden.',
        counter: (value) => {
          if (!value || value.length <= 3) {
            return 'Mindestlänge 3 Buchstaben'
          } else {
            return true
          }
        },
        email: value => /.+@.+\..+/.test(value) || 'Bitte geben Sie eine korrekte Email ein'
      }
    }
  },
  computed: {
    productsInCartWithEkdPflicht () {
      return this.$store.state.cart.cartItems.filter(p => p.attr_ekd_pflicht > 1)
    }
  },
  validations: {
    personalDetails: {
      firstName: {
        required,
        minLength: minLength(2)
      },
      lastName: {
        required
      },
      emailAddress: {
        required,
        email
      }
    },
    password: {
      required
    },
    rPassword: {
      required,
      sameAsPassword: sameAs('password')
    },
    acceptConditions: {
      sameAs: sameAs(() => true)
    }
  },
  methods: {
    backStep () {
      this.$bus.$emit('checkout-before-edit', 'cartSummary')
    },
    onLoggedIn (receivedData) {
      this.personalDetails = {
        firstName: receivedData.firstname,
        lastName: receivedData.lastname,
        emailAddress: receivedData.email,
        salutation: receivedData.salutation,
        street: receivedData.street,
        zip: receivedData.zip,
        city: receivedData.city,
        phone: receivedData.phone,
        telefax: receivedData.telefax,
        company: receivedData.company
      }
    },
    sendPersonalDataToCheckout () {
      if (this.createAccount) {
        this.personalDetails.password = this.password
        this.personalDetails.createAccount = true
      } else {
        this.personalDetails.createAccount = false
      }
      this.$bus.$emit('checkout-after-personalDetails', this.personalDetails, this.$v)
      this.isFilled = true
      this.isValidationError = false
    },
    productLink (product) {
      return formatProductLink(product, currentStoreView().storeCode)
    },
    newdeliveryadress () {
      this.customerdata.selectedaddress = this.customerdata.deliverydresses.length;
      this.customerdata.deliverydresses.push({
        id: this.customerdata.deliverydresses.length,
        companyname: '',
        addinfo: '',
        title: '',
        firstname: '',
        surname: '',
        street: '',
        houseno: '',
        zip: '',
        city: '',
        country: '',
        phone: '',
        fax: ''
      })

      this.editdeliveryaddress = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.link {
  text-decoration: underline;
}

.login-prompt {
  @media (min-width: 1200px) {
    margin-top: 30px;
  }
}

.theme--dark.v-btn.v-btn--disabled.v-btn--has-bg.inbasket {
  background-color: hsla(0,0%,100%,.62)!important;
  color: hsla(0,0%,80%,.62)!important;
  .v-icon {
    color: hsla(0,0%,80%,.62)!important;
  }
}
</style>
