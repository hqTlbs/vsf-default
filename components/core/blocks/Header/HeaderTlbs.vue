<template>
  <div>
    <!-- Logoreihe -->
    <v-container>
      <v-row class="my-sm-0 my-md-4">
        <v-col cols="3" sm="2" md="2" xl="2" class="text-left pl-1 px-0 py-1 logocol">
          <v-img src="https://www.department-q.com/a-rot.svg" max-height="46px" position="left center" alt="ADN" contain
                 href="https://www.adn.de" class="ml-6 ml-md-0"
          ></v-img>
        </v-col>
        <v-col class="text-left pt-4 d-none d-sm-flex py-0">
          <template v-for="(item,i) in metamenu">
            <span v-if="item.isactive" class="ml-1 mr-5 activemeta" :id="'button'+i">
              <v-icon class="mr-2 activemeta">
                  {{ item.icon }}
              </v-icon>
              {{ item.title }}
            </span>
            <span v-else class="mx-5">
              <a :href="item.link" class="metalink">
                <v-icon class="mr-2">
                    {{ item.icon }}
                </v-icon>
                {{ item.title }}
              </a>
            </span>
          </template>
        </v-col>
      </v-row>
    </v-container>
    <!-- searchrow -->
    <v-app-bar flat dark id="realappbar">
      <v-container class="pa-0 fill-height">
        <hamburger-icon class="p15 icon pointer" />
        <v-text-field append-icon="search" flat tile dense solo outlined hide-details single-line light
                      class="mx-md-8 d-none d-sm-flex mainsearch"
        ></v-text-field>

        <!-- mobile search -->
        <v-spacer class="d-sm-none"></v-spacer>
        <v-btn tile depressed outlined class="d-sm-none mx-1px-2 mobilesearchbtn" light
               @click.stop="mobilesearch = true"
        >
          Suche
          <v-icon right>search</v-icon>
        </v-btn>
        <v-spacer class="d-sm-none"></v-spacer>
        <v-dialog
          transition="dialog-top-transition"
          v-model="mobilesearch"
          class="d-sm-none pa-4"

        >
          <v-card tile class="drawerheader mobilesearchdrawer">
            <v-toolbar dense flat dark>
              <v-toolbar-title>Suche</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon dark @click.stop="mobilesearch = false">close</v-icon>
            </v-toolbar>
            <v-divider class="mt-1 adndrawerheader"></v-divider>
            <v-text-field append-icon="search" flat tile dense solo outlined hide-details single-line light autofocus
                          class="ma-5"
            ></v-text-field>

          </v-card>

        </v-dialog>
        <!-- mobile search -->
        <!-- language -->
        <v-menu offset-y left transition="scroll-y-transition" class="headermenu__tooltip" attach>
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip top :disabled="disableheadertooltips">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  tile
                  text
                  class="ma-0"
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"

                >
                  <v-icon id="langselec">language</v-icon>
                  {{ activelanguage }}
                </v-btn>
              </template>
              <span>Sprachauswahl</span>
            </v-tooltip>
          </template>
          <v-card tile class="languagecard">
            <v-list-item class="drawerheader" dark>
              <v-list-item-content>
                <v-list-item-title>Sprachauswahl</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-1 adndrawerheader"></v-divider>
            <v-list>
              <v-list-item
                v-for="(item, index) in languages"
                :key="index"
                link
                @click="switchlanguage(item.short)"
              >

                <v-list-item-title class="headermenu__limkitem"><img height="15" :src="item.flag"><span class="pa-1"
                >{{ item.name }} - {{ item.short.toUpperCase() }} - {{ item.currency }}</span></v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>


        </v-menu>


        <!-- Language-->
        <!--User-->
        <v-menu offset-y left transition="scroll-y-transition" class="d-none d-sm-flex" :close-on-content-click="false"
                v-model="usermenu" attach
        >
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip top :disabled="disableheadertooltips">
              <template v-slot:activator="{ on: tooltip }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                  class="mx-0 py-0"
                >
                  <v-icon>person</v-icon>
                </v-btn>
              </template>
              <span v-if="userloggedin">Kundenmenu</span>
              <span v-else>Login</span>
            </v-tooltip>
          </template>
          <v-divider class="my-1"></v-divider>
          <v-card tile v-if="userloggedin">
            <v-list-item class="drawerheader" dark>
              <v-list-item-content>
                <v-list-item-title>Kundenmenu</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-1 adndrawerheader"></v-divider>
            <v-list nav>
              <template v-for="(item,i) in customermenu">
                <v-list-item dense :href="item.link">
                  <v-list-item-title class="headermenu__limkitem">{{ item.title }}</v-list-item-title>
                </v-list-item>
              </template>
              <v-divider class="my-2"></v-divider>
              <v-list-item>
                <v-btn color="primary" tile depressed @click="userloggedin = false">
                  <v-icon>
                    logout
                  </v-icon>
                  Abmelden
                </v-btn>
              </v-list-item>
            </v-list>

          </v-card>


          <v-card tile v-else>
            <v-list-item class="drawerheader" dark>
              <v-list-item-content>
                <v-list-item-title>Login</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="mt-1 adndrawerheader"></v-divider>
            <v-card-text>

              <v-row class="my-0">
                <v-col>
                  <v-text-field
                    label="Email"
                    prepend-inner-icon="account_circle"
                    flat tile dense outlined
                  ></v-text-field>
                  <v-text-field
                    label="Passwort"
                    prepend-inner-icon="password"
                    type="password"
                    flat tile dense outlined
                  ></v-text-field>
                  <v-btn color="primary" tile depressed @click="userloggedin = true">
                    <v-icon>
                      login
                    </v-icon>
                    Anmelden
                  </v-btn>
                </v-col>
              </v-row>
              <v-divider class="my-2"></v-divider>
              <p>
                <a>Passwort vergessen?</a>
              </p>

              Sie sind noch kein Partner? <br><a href="partnerregistrierung" title="Partner der ADN werden">Hier können
              Sie sich registrieren. </a>

            </v-card-text>
          </v-card>
        </v-menu>
        <!--User-->
<!--        <compare-icon class="p15 icon hidden-xs pointer" />-->
        <!-- FavoritenlisteButton -->
        <wishlist-icon class="p15 icon pointer" />
        <!-- WarenkorbButton -->
        <microcart-icon class="p15 icon pointer" />
      </v-container>
    </v-app-bar>
    <!--mobile search-->
  </div>

  <!--Logo Row Ende-->
  <!--- Header Dummy -->
  <!--  <div class="header">-->
  <!--    <v-container class="text-left">-->
  <!--      <router-link :to="localizedRoute('/')" :title="$t('Home Page')" class="no-underline inline-flex">-->
  <!--        <v-img src="https://www.department-q.com/a-rot.svg" max-width="120px" max-height="50px" contain-->
  <!--              class="pa-0 mr-auto"-->
  <!--        ></v-img>-->
  <!--      </router-link>-->
  <!--    </v-container>-->
  <!--    <v-app-bar flat color="#2E3640" dark-->
  <!--               class="header"-->
  <!--               :class="{ 'is-visible': navVisible }"-->
  <!--    >-->
  <!--      <v-container class="pa-0 fill-height">-->
  <!--        <hamburger-icon class="p15 icon pointer" />-->
  <!--        <v-spacer></v-spacer>-->
  <!--        <v-text-field append-icon="search" dense solo hide-details single-line light class="ml-3"> </v-text-field>-->
  <!--        <v-spacer></v-spacer>-->
  <!--        <compare-icon class="p15 icon hidden-xs pointer" />-->
  <!--        <wishlist-icon class="p15 icon pointer" />-->
  <!--        <microcart-icon class="p15 icon pointer" />-->
  <!--        <search-icon class="p15 icon pointer" />-->
  <!--      </v-container>-->
  <!--    </v-app-bar>-->
  <!--  </div>-->
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import CurrentPage from 'theme/mixins/currentPage'
import AccountIcon from 'theme/components/core/blocks/Header/AccountIcon'
import CompareIcon from 'theme/components/core/blocks/Header/CompareIcon'
import HamburgerIcon from 'theme/components/core/blocks/Header/HamburgerIcon'
import Logo from 'theme/components/core/Logo'
import MicrocartIcon from 'theme/components/core/blocks/Header/MicrocartIcon'
import SearchIcon from 'theme/components/core/blocks/Header/SearchIcon'
import WishlistIcon from 'theme/components/core/blocks/Header/WishlistIcon'
import MegaMenu from 'theme/components/core/blocks/Header/MegaMenu'
import config from 'config';

export default {
  name: 'Header',
  components: {
    AccountIcon,
    CompareIcon,
    HamburgerIcon,
    Logo,
    MicrocartIcon,
    SearchIcon,
    WishlistIcon,
    MegaMenu
  },
  mixins: [CurrentPage],
  data () {
    return {
      navVisible: true,
      isScrolling: false,
      scrollTop: 0,
      lastScrollTop: 0,
      navbarHeight: 54,
      isVisible: false,
      userloggedin: true,
      disableheadertooltips: false,
      wishlist: [],
      basket: [],
      languages: [
        {
          name: 'Deutschland',
          short: 'de',
          flag: 'https://lipis.github.io/flag-icon-css/flags/4x3/de.svg',
          currency: 'EUR'
        }, {
          name: 'Schweiz',
          short: 'ch',
          flag: 'https://lipis.github.io/flag-icon-css/flags/4x3/ch.svg',
          currency: 'CHF'
        }, {
          name: 'Österreich',
          short: 'at',
          flag: 'https://lipis.github.io/flag-icon-css/flags/4x3/at.svg',
          currency: 'EUR'
        },

      ],
      customermenu: [{ title: 'Reporting', link: 'reporting.html' }, {
        title: 'Passwort ändern',
        link: 'changepassword.html'
      }, { title: 'Rechnungs- und Liefereinstellungen', link: 'deliverypreferences.html' }
      ],
      activelanguage: 'de',
      metaactive: 'Reseller Shop',
      mobilesearch: false,
      usermenu: false,
      metamenu: [{
        title: 'Reseller Shop',
        link: '',
        icon: 'storefront',
        isactive: true,
        target: 'self',
        info: 'Hier finden Sie Hard & Software für Ihre Kunden'
      }, {
        title: 'Tech Academy',
        link: 'https://shop.adn.de/index.php?cl=start&shp=akademie&lang=0',
        icon: 'school',
        isactive: false,
        target: 'self',
        info: 'Schulungen und Zertifizierunge'
      }, {
        title: 'Cloud Marketplace',
        link: 'https://marketplace.adncloud.de/',
        icon: 'cloud_queue',
        isactive: false,
        target: '_blank',
        info: 'Cloud Software und Dienste'
      }],
    }
  },
  computed: {
    ...mapState({
      isOpenLogin: state => state.ui.signUp,
      currentUser: state => state.user.current
    }),
    isThankYouPage () {
      return this.$store.state.checkout.isThankYouPage
        ? this.$store.state.checkout.isThankYouPage
        : false
    },
    ...mapGetters('category-next', ['getMenuCategories']),
    getCategories () {
      // console.log('getCategories')
      // console.log(this.getMenuCategories)
      return this.getMenuCategories
    }
  },
  beforeMount () {
    window.addEventListener(
      'scroll',
      () => {
        this.isScrolling = true
      },
      { passive: true }
    )

    setInterval(() => {
      if (this.isScrolling) {
        this.hasScrolled()
        this.isScrolling = false
      }
    }, 250)
  },
  mounted () {
    window.addEventListener('scroll', this.updateScroll);
  },
  methods: {
    mainCategories () {
      // console.log('mainCategories')
      return this.getCategories.filter((op) => {
        return op.level === 2
      })
    },
    subCategories (parentId) {
      // console.log('subCategories')
      // console.log(parentId)
      return this.getCategories.filter((op) => {
        return op.level === 3 && op.parent_id === parentId
      })
    },
    gotoAccount () {
      this.$bus.$emit('modal-toggle', 'modal-signup')
    },
    hasScrolled () {
      this.scrollTop = window.scrollY
      if (
        this.scrollTop > this.lastScrollTop &&
        this.scrollTop > this.navbarHeight
      ) {
        this.navVisible = false
      } else {
        this.navVisible = true
      }
      this.lastScrollTop = this.scrollTop
    },
    showMenu () {
      this.isVisible = true
    },
    hideMenu () {
      this.isVisible = false
      this.focusedIndex = 0
    },
    updateScroll () {
      this.scrollPosition = window.scrollY
      let element = document.getElementById('realappbar')
      if (this.scrollPosition >= 165) {
        element.classList.add('fixed')
        element.classList.remove('v-toolbar--flat')
        this.disableheadertooltips = true
        this.scrolltotop = true
      } else {
        element.classList.remove('fixed')
        this.disableheadertooltips = false
        element.classList.add('v-toolbar--flat')
        this.scrolltotop = false
      }
    }
  }
}
</script>
