<template>
  <div id="category">
    <breadcrumbs
      class="pb20 hidden-xs"
    />
    <v-container>
      <!-- Series Head-->
      <h1 class="mb-5">
        {{ getCurrentCategory.name }}
      </h1>
      <!-- Series Head Ende-->
      <!-- Productlist Toolbar-->
      <v-toolbar flat dense class="mb-8 pr-0 producttoolbar" v-if="showtoolbar">
        <v-row align="center" class="pa-0">
          <v-col cols="4" xs="3" sm="4" md="2" class="pl-0 pr-5" v-if="showtoolbarfilter">
            <!--Neu showtoolbarfilter-->
            <v-btn block tile dense @click="filterswitch()" elevation="0" class="producttoolbar__filterbutton">
              <v-icon class="mr-2 material-icons-outlined" outlined>
                filter_list
              </v-icon> Filter
              <v-badge inline :content="productvalues.length" class="ml-1" v-if="productvalues.length>0" />
            </v-btn>
          </v-col>
          <v-col class="d-flex pl-0">
            <div class="float-left" v-if="showsearch">
              <v-text-field flat label="Suchen in Ansicht" hide-details solo outlined dense v-model="search" prepend-inner-icon="search" />
            </div>
          </v-col>
          <v-col cols="12" sm="6" md="4" align="right" class="pl-0 pr-0">
            <v-btn-toggle v-model="view" mandatory dense tile outlined class="producttoolbar__viewtoggle float-right">
              <v-btn icon dense tile>
                <v-icon>mdi-grid</v-icon>
              </v-btn>
              <v-btn icon dense tile>
                <v-icon>mdi-format-list-checkbox</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-select v-model="sortBy" flat hide-details solo outlined dense :items="keys" item-text="title" :items-value="keys.value" label="Sortierung" class="producttoolbar__sort float-right" prepend-inner-icon="sort" />
          </v-col>
        </v-row>
      </v-toolbar>
      <v-row>
        <!-- mobile view-->
        <v-col v-if="$vuetify.breakpoint.smAndDown && showfilter" class="filter__mobile">
          <v-overlay light>
            <div class="filter__mobile__background">
              <v-toolbar flat class="filter__mobile__toolbar">
                <v-toolbar-title>Filter</v-toolbar-title>
                <v-spacer />
                <v-btn icon @click="filterswitch()">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-toolbar>
              <div class="filter__mobile__chosen">
                <h4 v-if="productvalues.length>0">
                  Ausgewählte Filter:
                </h4>
                <template v-for="item in productvalues">
                  <v-chip label color="primary" close close-icon="close" @click:close="remove(item)" class="mr-1 mb-1">
                    <span class="ellipsis">{{ item }}</span>
                  </v-chip>
                </template> <a @click="deleteallfilter()" v-if="productvalues.length>0 && showfilter" class="d-block mt-3 ">Alle Filter löschen</a>
              </div>
              <v-list light>
                <!--New Categoryfilter Start-->
                <v-list-group v-if="parentcategories && showcategoryfilter" v-model="categoriesfilter">
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title> Kategorien</v-list-item-title>
                    </v-list-item-content>
                  </template>
                  <v-list-item
                    v-for="(item, i) in parentcategories"
                    :key="i"
                    link
                    no-action
                    :href="item.link"
                    class="mt-1"
                  >
                    <v-list-item-title v-if="item.link">
                      < {{ item.title }}
                    </v-list-item-title>
                    <v-list-item-title class="ml-2" v-else>
                      <strong>{{ item.title }}</strong>
                    </v-list-item-title>
                  </v-list-item>
                </v-list-group>
                <!-- New Categoryfilter Ende -->
                <v-list-group v-for="item in filter" :key="item.title" v-model="item.mobileactive">
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.filtername" />
                    </v-list-item-content>
                  </template>
                  <v-list-item-group v-model="productvalues" active-class="primary--text" multiple>
                    <v-list-item v-for="(itemx, idx) in item.items" :value="itemx.title" :key="idx">
                      <template v-slot:default="{ active }">
                        <v-checkbox :input-value="active" :label="itemx.title" hide-details />
                      </template>
                    </v-list-item>
                  </v-list-item-group>
                </v-list-group>
              </v-list>
              <div style="position:fixed;bottom:0;width:300px;">
                <v-btn tile block flat color="primary" @click="filterswitch()">
                  Produkte anzeigen
                </v-btn>
              </div>
            </div>
          </v-overlay>
        </v-col>
        <!--mobile view end-->
        <!--Desktop view start-->
        <v-col sm="2" class="filter desktop" v-if="$vuetify.breakpoint.mdAndUp && showfilter">
          <h4 v-if="productvalues.length>0">
            Ausgewählte Filter:
          </h4>
          <template v-for="item in productvalues">
            <v-chip label color="primary" close close-icon="close" @click:close="remove(item)" class="mr-1 mb-1">
              <span class="ellipsis">{{ item }}</span>
            </v-chip>
          </template> <a @click="deleteallfilter()" v-if="productvalues.length>0 && showfilter" class="d-block mb-2 mt-2">Alle Filter löschen</a>
          <v-list expand dense>
            <!-- New Categoryfilter -->
            <v-list-group v-if="parentcategories && showcategoryfilter" v-model="categoriesfilter">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title> Kategorien</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item
                v-for="(item, i) in parentcategories"
                :key="i"
                link
                no-action
                :href="item.link"
                class="mt-1"
              >
                <v-list-item-title v-if="item.link">
                  < {{ item.title }}
                </v-list-item-title>
                <v-list-item-title class="ml-2" v-else>
                  <strong>{{ item.title }}</strong>
                </v-list-item-title>
              </v-list-item>
            </v-list-group>
            <!-- New Categoryfilter Ende -->
            <v-list-group v-for="item in filter" :key="item.title" v-model="item.active">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.filtername" />
                </v-list-item-content>
              </template>
              <v-list-item-group v-model="productvalues" active-class="primary--text" multiple>
                <v-list-item v-for="(itemx, idx) in item.items" :value="itemx.title" :key="idx">
                  <template v-slot:default="{ active }">
                    <v-checkbox :input-value="active" :label="itemx.title" hide-details />
                  </template>
                </v-list-item>
              </v-list-item-group>
            </v-list-group>
          </v-list>
        </v-col>
        <!-- Desktop View End-->
        <v-col :cols="productcols" class="flex-grow-1 flex-shrink-0">
          <lazy-hydrate :trigger-hydration="!loading" v-if="isLazyHydrateEnabled">
              <product-listing :view="view" :columns="defaultColumn" :products="getCategoryProducts" />
          </lazy-hydrate>
          <product-listing v-else :columns="defaultColumn" :products="getCategoryProducts" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration'
import Sidebar from '../components/core/blocks/Category/Sidebar.vue'
import ProductListing from '../components/core/ProductListing.vue'
import Breadcrumbs from '../components/core/Breadcrumbs.vue'
import SortBy from '../components/core/SortBy.vue'
import { isServer } from '@vue-storefront/core/helpers'
import { Logger } from '@vue-storefront/core/lib/logger'
import { getSearchOptionsFromRouteParams } from '@vue-storefront/core/modules/catalog-next/helpers/categoryHelpers'
import config from 'config'
import Columns from '../components/core/Columns.vue'
import ButtonFull from 'theme/components/theme/ButtonFull.vue'
import { mapGetters } from 'vuex'
import onBottomScroll from '@vue-storefront/core/mixins/onBottomScroll'
import rootStore from '@vue-storefront/core/store';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks'
import { localizedRoute, currentStoreView } from '@vue-storefront/core/lib/multistore'
import { htmlDecode } from '@vue-storefront/core/filters'

const THEME_PAGE_SIZE = 50

const composeInitialPageState = async (store, route, forceLoad = false) => {
  try {
    const filters = getSearchOptionsFromRouteParams(route.params)
    const cachedCategory = store.getters['category-next/getCategoryFrom'](route.path)
    const currentCategory = cachedCategory && !forceLoad ? cachedCategory : await store.dispatch('category-next/loadCategory', { filters })
    const pageSize = store.getters['url/isBackRoute'] ? store.getters['url/getCurrentRoute'].categoryPageSize : THEME_PAGE_SIZE
    await store.dispatch('category-next/loadCategoryProducts', { route, category: currentCategory, pageSize })
    const breadCrumbsLoader = store.dispatch('category-next/loadCategoryBreadcrumbs', { category: currentCategory, currentRouteName: currentCategory.name, omitCurrent: true })

    if (isServer) await breadCrumbsLoader
    catalogHooksExecutors.categoryPageVisited(currentCategory)
  } catch (e) {
    Logger.error('Problem with setting Category initial data!', 'category', e)()
  }
}

export default {
  components: {
    LazyHydrate,
    ButtonFull,
    ProductListing,
    Breadcrumbs,
    Sidebar,
    SortBy,
    Columns
  },
  mixins: [onBottomScroll],
  data () {
    return {
      mobileFilters: false,
      defaultColumn: 3,
      loadingProducts: false,
      loading: true,

      userloggedin: true,
      showinfotext: true,
      currency: '€',
      view: 0,
      search: '',
      showfilter: false,
      showtoolbar: true,
      showtoolbarfilter: true,
      showsearch: true,
      showcategoryfilter: true,
      productcols: 12,
      sortBy: 'productname',
      keys: [
        { title: 'Name', value: 'productname', sortDesc: false },
        { title: 'Preis', value: 'hek', sortDesc: false },
        { title: 'Erscheinungsdatum', value: 'date' }
      ],
      sortDesc: false,
      filterpanel: [0, 1, 2],
      categoriesfilter: [0],
      productvalues: [],
      possiblefilter: ['manufacturer', 'productseries', 'productrange'],
      products: [
        { productname: 'SOHO 250', manufacturer: 'SonicWall', sku: '3125456', adnnr: '672367867', listprice: '500,00 ', hek: '220,99', shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte 5x 1-GbE-RJ45 600 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-Durchsatz Integrierter IEEE 802.11n Access-Point', pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/06/SOHO_250_Front-1.png', new: 0, sale: 0, configarticle: 0, detailurl: 'ADN-Produktansicht.html' },
        { productname: 'SOHO 250 Wireless', manufacturer: 'SonicWall', sku: '3125456', adnnr: '672367867', listprice: '500,00 ', hek: '200,00 ', shorttext: 'ür Netzwerke im Bereich 1-10 User/Geräte - 5x 1-GbE-RJ45 -00 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-DurchsatzIntegrierter IEEE 802.11n Access-Point', pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/10/TZ_Priority_TZ270W_Front.png', new: 0, sale: 0, configarticle: 0, detailurl: 'ADN-Produktansicht.html' },
        { productname: 'TZ 350', manufacturer: 'SonicWall', sku: '3125456', adnnr: '672367867', listprice: '500,00 ', hek: '200,00 ', shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte 5x 1-GbE-RJ45 600 Mbps Firewall', pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/06/TZ350_Front-1.jpg', new: 0, sale: 0, configarticle: 0, detailurl: 'ADN-Produktansicht.html' },
        { productname: 'TZ 350 Wireless', manufacturer: 'SonicWall', sku: '3125456', adnnr: '672367867', listprice: '500,00 ', hek: '200,00 ', shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte 5x 1-GbE-RJ45 600 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-Durchsatz Integrierter IEEE 802.11n Access-Point', pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/10/TZ_Priority_TZ370W_Front.png', new: 1, sale: 0, configarticle: 1, detailurl: 'ADN-Produktansicht.html' },
        { productname: 'TZ 400', manufacturer: 'SonicWall', sku: '3125456', adnnr: '672367867', listprice: '500,00 ', hek: '220,99', shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte 5x 1-GbE-RJ45 600 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-Durchsatz Integrierter IEEE 802.11n Access-Point', pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/06/TZ400_Front-1.png', new: 0, sale: 0, configarticle: 0, detailurl: 'ADN-Produktansicht.html' },
        { productname: 'TZ 400 Wireless', manufacturer: 'SonicWall', sku: '3125456', adnnr: '672367867', listprice: '500,00 ', hek: '200,00 ', shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte 5x 1-GbE-RJ45 600 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-Durchsatz Integrierter IEEE 802.11n Access-Point', pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/10/TZ_Priority_TZ370W_Front.png', new: 0, sale: 1, configarticle: 0, detailurl: 'ADN-Produktansicht.html' },
        { productname: 'TZ 500', manufacturer: 'SonicWall', sku: '3125456', adnnr: '672367867', listprice: '500,00 ', hek: '200,00 ', shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte 5x 1-GbE-RJ45 600 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-Durchsatz Integrierter IEEE 802.11n Access-Point', pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/08/TZ570_Front-1080px-4.png', configarticle: 0, detailurl: 'ADN-Produktansicht.html' },
        { productname: 'TZ 500 Wireless', manufacturer: 'SonicWall', sku: '3125456', adnnr: '672367867', listprice: '500,00 ', hek: '200,00 ', shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte 5x 1-GbE-RJ45 600 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-Durchsatz Integrierter IEEE 802.11n Access-Point', pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/10/TZ_Priority_TZ370W_Front.png', new: 0, sale: 1, configarticle: 1, detailurl: 'ADN-Produktansicht.html' }
      ],
      parentcategories: [{ title: 'SonicWall', link: 'Sonicwall.html' }, { title: 'Firewalls', link: 'Firewalls.html' }, { title: 'SOHO - TZ Series', link: '' }],
      filter: [
        { filtername: 'Hersteller', active: true, mobileactive: false, id: '1', filtergroup: 'manufacturer', items: [{ id: '1', title: 'GFI' }, { id: '2', title: 'rackmount.it' }, { id: '3', title: 'SonicWall' }] },
        { filtername: 'Produktserie', active: true, mobileactive: false, id: '2', filtergroup: 'productseries', items: [{ id: '21', title: 'Access Point (76)' }, { id: '22', title: 'AP-Serie (15)' }, { id: '23', title: 'Autodoc (10)' }, { id: '24', title: 'Capture Security Appliance (16)' }, { id: '24', title: 'Content Filter Client (2)' }, { id: '25', title: 'CSC / Remote Management (15)' }, { id: '25', title: 'Data Retention (54)' }, { id: '26', title: 'Dimension (4)' }, { id: '27', title: 'E-Class NSA Serie (5)' }, { id: '28', title: 'Firebox (321)' }, { id: '29', title: 'GFI Unlimited Hardware (30)' }, { id: '210', title: 'GMS / Remote Management (46)' }, { id: '211', title: 'Host Sensor (12)' }, { id: '212', title: 'M200 (2)' }, { id: '213', title: 'M270 (1)' }, { id: '214', title: 'M300 (2)' }, { id: '215', title: 'M370 (36)' }, { id: '216', title: 'M400 (2)' }, { id: '217', title: 'M440 (2)' }, { id: '218', title: 'M4600 (7)' }, { id: '219', title: 'M470 (36)' }, { id: '220', title: 'M500 (2)' }] },
        { filtername: 'Produktreihe', active: true, mobileactive: false, id: '3', filtergroup: 'productrange', items: [{ id: '31', title: 'AP120 (1)' }, { id: '32', title: 'AP125 (18)' }, { id: '33', title: 'AP225 (15)' }, { id: '34', title: 'AP320 (1)' }, { id: '35', title: 'AP325 (16)' }, { id: '36', title: 'AP327x (15)' }, { id: '37', title: 'AP420 (25)' }, { id: '38', title: 'CSa 1000 (16)' }, { id: '39', title: 'Datacenter (18)' }] }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getCurrentSearchQuery: 'category-next/getCurrentSearchQuery',
      getCategoryProducts: 'category-next/getCategoryProducts',
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCategoryProductsTotal: 'category-next/getCategoryProductsTotal',
      getAvailableFilters: 'category-next/getAvailableFilters'
    }),
    isLazyHydrateEnabled () {
      return config.ssr.lazyHydrateFor.includes('category-next.products')
    },
    isCategoryEmpty () {
      return this.getCategoryProductsTotal === 0
    }
  },
  async asyncData ({ store, route, context }) { // this is for SSR purposes to prefetch data - and it's always executed before parent component methods
    if (context) context.output.cacheTags.add('category')
    await composeInitialPageState(store, route)
  },
  async beforeRouteEnter (to, from, next) {
    if (isServer) next() // SSR no need to invoke SW caching here
    else if (!from.name) { // SSR but client side invocation, we need to cache products and invoke requests from asyncData for offline support
      next(async vm => {
        vm.loading = true
        await composeInitialPageState(vm.$store, to, true)
        await vm.$store.dispatch('category-next/cacheProducts', { route: to }) // await here is because we must wait for the hydration
        vm.loading = false
      })
    } else { // Pure CSR, with no initial category state
      next(async vm => {
        vm.loading = true
        vm.$store.dispatch('category-next/cacheProducts', { route: to })
        vm.loading = false
      })
    }
  },
  methods: {
    openFilters () {
      this.mobileFilters = true
    },
    closeFilters () {
      this.mobileFilters = false
    },
    async changeFilter (filterVariant) {
      this.$store.dispatch('category-next/switchSearchFilters', [filterVariant])
    },
    columnChange (column) {
      this.defaultColumn = column
    },
    async onBottomScroll () {
      if (this.loadingProducts) return
      this.loadingProducts = true
      try {
        await this.$store.dispatch('category-next/loadMoreCategoryProducts')
      } catch (e) {
        Logger.error('Problem with fetching more products', 'category', e)()
      } finally {
        this.loadingProducts = false
      }
    },
    filterswitch () {
      this.showfilter = !this.showfilter;
      if (this.showfilter == true) {
        this.productcols = 10
      } else {
        this.productcols = 12
      }
    },
    remove (id) {
      let idx = this.productvalues.indexOf(id)
      this.productvalues.splice(idx, 1)
      this.productvalues = [...this.productvalues]
    },
    allopen () {
      this.filterpanel = [...Array(this.filter.length).keys()].map((k, i) => i)
    },
    allclose () {
      this.filterpanel = []
    },
    deleteallfilter () {
      this.productvalues = []
    }
  },
  metaInfo () {
    const storeView = currentStoreView()
    const { meta_title, meta_description, name, slug } = this.getCurrentCategory
    const meta = meta_description ? [
      { vmid: 'description', name: 'description', content: htmlDecode(meta_description) }
    ] : []
    /* const categoryLocaliedLink = localizedRoute({
      name: 'category-amp',
      params: { slug }
    }, storeView.storeCode)
    const ampCategoryLink = this.$router.resolve(categoryLocaliedLink).href */

    return {
      // link: [ { rel: 'amphtml', href: ampCategoryLink } ],
      title: htmlDecode(meta_title || name),
      meta
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn {
    &__filter {
      min-width: 100px;
    }
  }
  .divider {
    width: calc(100vw - 8px);
    bottom: 20px;
    left: -36px;
  }
  .category-filters {
    width: 242px;
  }

  .mobile-filters {
    display: none;
    overflow: auto;
  }

  .mobile-filters-button {
    display: none;
  }

  .mobile-sorting {
    display: none;
  }

  .category-title {
    line-height: 65px;
  }

  .sorting {
    label {
      margin-right: 10px;
    }
  }

  @media (max-width: 64em) {
    .products-list {
      max-width: 530px;
    }
  }

  @media (max-width: 770px) {
    .category-title {
      margin: 0;
      font-size: 36px;
      line-height: 40px;
    }

    .products-list {
      width: 100%;
      max-width: none;
    }

    .mobile-filters {
      display: block;
    }

    .mobile-filters-button {
      display: block;
      height: 45px;
    }

    .sorting {
      display: none;
    }

    .mobile-sorting {
      display: block;
    }

    .category-filters {
      display: none;
    }

    .product-listing {
      justify-content: center;;
    }

    .mobile-filters {
      position: fixed;
      background-color: #F2F2F2;
      z-index: 5;
      padding: 0 40px;
      left: 0;
      width: 100vw;
      height: 100vh;
      top: 0;
      box-sizing: border-box;
    }

    .mobile-filters-body {
      padding-top: 50px;
    }
  }

  .close-container {
    left: 0;
  }

  .close {
    margin-left: auto;
  }
</style>
<style lang="scss">
.product-image {
  max-height: unset !important;
}
</style>
