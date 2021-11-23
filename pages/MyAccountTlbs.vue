<template>
  <div id="my_account1">
    <breadcrumbs
      :with-homepage="true"
      :routes="[]"
      active-route="My Account"
    />
    <v-container>
      <h1 class="mb-2">Bestellungen</h1>
      <v-data-table :headers="headers" :items="orders" item-key="orderno" :search="ordersearch" no-data-text="Sie haben bisher noch keine Bestellung getätigt" no-results-text="Keine Bestellung mit Ihren Kriterien vorhanden" show-expand :expanded.sync="expanded" locale="de-DE" class="ordertable mt-n3">
        <template v-slot:top>
          <v-row class="ma-0 pa-0 mb-n5">
            <v-col cols="6" sm="4" class="ma-0 pl-0">
              <v-text-field v-model="ordersearch" label="Suche" dense outlined class="pb-0"></v-text-field>
            </v-col>
            <v-col cols=6 sm=3>
              <v-select :items="states" label="Status" outlined dense v-model="ordersearch" clearable item-value="title" item-text="title" class="pb-0">
                <template slot="item" slot-scope="data">
                  <v-icon small :color="data.item.color" class="mr-2">{{data.item.icon}}</v-icon> {{data.item.title}} </template>
              </v-select>
            </v-col>
            <v-col cols="12" sm="5" class="mt-n8 mb-3 mb-sm- mt-sm-0 ">
              <v-checkbox label="Nur meine Bestellungen" color="primary" dense hide-details></v-checkbox>
            </v-col>
          </v-row>
        </template>
        <template v-slot:item.orderno="{ item }">
          <v-chip outlined>
            <v-icon class="mr-2" small v-if="item.orderkind=='Direkt-Bestellung'" title="Direkt-Bestellung" color="#00A5DF"> question_answer </v-icon>
            <v-icon class="mr-2" small v-if="item.orderkind=='Online-Bestellung'" title="Online-Bestellung" color="#00A5DF"> shopping_cart </v-icon> {{item.orderno}}
          </v-chip>
        </template>
        <template v-slot:item.endprice="{ item }"> {{ item.endprice }} {{ currency }} </template>
        <template v-slot:item.state="{ item }">
          <span>
            <v-icon :color="states[item.state].color" class="material-icons-outlined" :title="states[item.state].title">
                {{states[item.state].icon}}
            </v-icon>
          </span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="open(item)" color="primary"> search </v-icon>
        </template>
        <!-- Ausklapppositionen-->
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pa-0">
            <v-card tile class="positionscard">
              <h3 class="pa-5">Positionen</h3>
              <v-data-table :items="item.oredereditems" :headers="ordereditemsheaders" hide-default-footer light show-select item-key="productname" checkbox-color="primary" disable-sort class="positionstable">
                <template v-slot:item.productname="{ item }"> <a :href="item.producturl">{{ item.manufacturer }} - {{ item.productname }}</a>
                  <br> <span class="small">Herst.-Art.Nr.:{{ item.sku }} - ADN-Art.Nr.{{ item.adnnr }}</span>
                  <div v-if="item.endcustomer=='1'" class="mt-1"> <b>Endkunde:</b> {{item.endcustomername}} </div>
                </template>
                <template v-slot:item.hek="{ item }"> {{ item.hek }} {{ currency }} </template>
                <template v-slot:item.rma="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="primary" icon depressed v-bind="attrs" v-on="on" small @click="startrma(item)">
                        <v-icon> assignment_return </v-icon>
                      </v-btn>
                    </template> <span>{{helptextrma}}</span> </v-tooltip>
                </template>
              </v-data-table>
              <v-divider></v-divider>
              <v-card-actions>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" tile depressed v-bind="attrs" v-on="on" class="ma-3"> Nachbestellen </v-btn>
                  </template> <span>{{helptextreorder}}</span> </v-tooltip>
              </v-card-actions>
            </v-card>
          </td>
        </template>
        <!-- Ausklappitem Ende-->
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import MyAccount from '@vue-storefront/core/pages/MyAccount'
import Breadcrumbs from '../components/core/Breadcrumbs'
import MyProfile from '../components/core/blocks/MyAccount/MyProfile'
import MyShippingDetails from '../components/core/blocks/MyAccount/MyShippingDetails'
import MyNewsletter from '../components/core/blocks/MyAccount/MyNewsletter'
import MyOrders from '../components/core/blocks/MyAccount/MyOrders'
import MyOrder from '../components/core/blocks/MyAccount/MyOrder'
import MyRecentlyViewed from '../components/core/blocks/MyAccount/MyRecentlyViewed'
import NoSSR from 'vue-no-ssr'
import { RecentlyViewedModule } from '@vue-storefront/core/modules/recently-viewed'
import { registerModule } from '@vue-storefront/core/lib/modules'

export default {
  data () {
    return {
      orders: [],
      navigation: [
        { title: this.$t('My profile'), link: '/my-account' },
        { title: this.$t('My shipping details'), link: '/my-account/shipping-details' },
        { title: this.$t('My newsletter'), link: '/my-account/newsletter' },
        { title: this.$t('My orders'), link: '/my-account/orders' },
        { title: this.$t('My Recently viewed products'), link: '/my-account/recently-viewed' }
      ]
    }
  },
  components: {
    Breadcrumbs,
    MyProfile,
    MyShippingDetails,
    MyNewsletter,
    MyOrders,
    MyOrder,
    MyRecentlyViewed,
    'no-ssr': NoSSR
  },
  computed: {
    headers () {
      return [{
        text: 'Bestellnummer',
        align: 'start',
        sortable: true,
        value: 'orderno',
        class: 'white--text ordertable__title'
      }, {
        text: 'Bestelldatum',
        value: 'orderdate',
        sortable: true,
        class: 'white--text ordertable__title'
      }, {
        text: 'Status',
        value: 'state',
        class: 'white--text ordertable__title'
      }, {
        text: 'Bestellt durch',
        value: 'orderedby',
        class: 'white--text ordertable__title'
      },{
        text: 'Referenz',
        value: 'reference',
        class: 'white--text ordertable__title'
      }, {
        text: 'Betrag',
        value: 'endprice',
        class: 'white--text ordertable__title'
      }, {
        text: 'Details',
        value: 'actions',
        sortable: false,
        align: 'end',
        class: 'white--text ordertable__title'
      }, {
        text: 'Positionen',
        value: 'data-table-expand',
        align: 'end',
        class: 'white--text ordertable__title'
      }]
    }
  },
  beforeCreate () {
    registerModule(RecentlyViewedModule)
  },
  mixins: [MyAccount],
  methods: {
    notify (title) {
      if (title === 'My loyalty card' || title === 'My product reviews') {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'warning',
          message: this.$t('This feature is not implemented yet! Please take a look at https://github.com/DivanteLtd/vue-storefront/issues for our Roadmap!'),
          action1: { label: this.$t('OK') }
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '~theme/css/base/text';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-tertiary: color(tertiary);

.static-menu {
  ul {
    list-style: none;
  }

  a {
    &:after {
      content: "";
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: $color-tertiary;
    }

    &:hover,
    &.router-link-exact-active {
      &:after {
        opacity: 0;
      }
    }
  }
}
</style>
