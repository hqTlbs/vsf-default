<template>
  <div width="100%" class="mainmenu">
    <v-list-item class="drawerheader drawermenuheader" dark>
      <v-list-item-avatar>
        <v-icon left dark large>
          account_circle
        </v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>Hallo Max Mustermann!</v-list-item-title>
      </v-list-item-content>
      <v-list-item-action>
        <v-btn icon>
          <v-icon dark @click="closeMenu">
            close
          </v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
    <v-divider class="mt-1 adndrawerheader" />
    <div class="mainmenu__container">
      <div class="position-relative">
        <v-window v-model="step" class="pa-5 mainmenu__firstlevel">
          <v-window-item :value="1">
            <template v-for="(item, i) in shopmenu">
              <h3 class="mainmenu__header">
                {{ item.header }}
              </h3>
              <div class="mainmenu__subheader">
                <i>{{ item.subheader }}</i>
              </div>
              <v-list nav dense>
                <template v-for="(itemx,e) in item.menuitems">
                  <v-list-item dense :href="itemx.link" v-if="!itemx.hasSubs">
                    <v-list-item-title class="mainmenu__linkitem">
                      {{ itemx.title }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item dense v-if="itemx.hasSubs" @click="changelevel(2,i,e)">
                    <v-list-item-title class="mainmenu__linkitem">
                      {{ itemx.title }}
                    </v-list-item-title>
                    <v-list-item-icon>
                      <v-icon>chevron_right</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </template>
              </v-list>
              <v-divider class="mb-5" />
            </template>
            <h3 class="mainmenu__header">
              Fokusthemen
            </h3>
            <div class="mainmenu__subheader">
              <i>Produkte nach Themen Sortiert</i>
            </div>
            <v-list nav dense>
              <v-list-item
                dense
                @click.stop="selectCategory(category.id)"
                :aria-label="$t('Show subcategories')"
                data-testid="categoryButton"
                :key="category.slug"
                v-for="category in visibleCategories"
              >
                <v-list-item-title class="mainmenu__linkitem">
                  {{ category.name }}
                </v-list-item-title>
                <v-list-item-icon>
                  <v-icon>chevron_right</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-window-item>
          <v-window-item :value="2">
            <v-list nav dense class="pa-0 ma-0">
              <v-list-item class="pa-0 ma-0" @click="step--">
                <v-list-item-icon>
                  <v-icon class="mainmenu__linkitem mr-0 pr-0">chevron_left</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="mainmenu__header ml-n5">Hauptmenue</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-divider class="mb-5"></v-divider>
            <template v-for="subCategory in getSubCategories()">
              <h3 :key="subCategory.slug" class="mainmenu__header">
                {{ subCategory.name }}
              </h3>
              <v-list nav dense>
                <v-list-item
                  dense
                  @click.stop="showProductsInCategory(subSubCategory)"
                  :aria-label="$t('View all')"
                  data-testid="categoryButton"
                  :key="subSubCategory.slug"
                  v-for="subSubCategory in getSubSubCategories(subCategory.id)"
                >
                  <v-list-item-title class="mainmenu__linkitem">
                    {{ subSubCategory.name }}
                  </v-list-item-title>
                  <v-list-item-icon>
                    <v-icon>chevron_right</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list>
              <v-divider class="mb-5"></v-divider>
            </template>
          </v-window-item>
          <v-window-item :value="3">
            <v-list nav dense class="pa-0 ma-0">
              <v-list-item class="pa-0 ma-0" @click="step--;step--">
                <v-list-item-icon>
                  <v-icon class="mainmenu__linkitem mr-0 pr-0">chevron_left</v-icon>
                </v-list-item-icon>
                <v-list-item-title class="mainmenu__header ml-n5">Hauptmenue</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-divider class="mb-5"></v-divider>
            <template v-for="(item, i) in shopmenu[activefirststage].menuitems[activesecondstage].menuitems">
              <h3 class="mainmenu__header">{{ item.header }}</h3>
              <v-list nav dense>
                <template v-for="(itemx,e) in item.subitems">
                  <v-list-item dense :href="itemx.link" class="mainmenu__linkitem" v-if="!itemx.hasSubs">
                    <v-list-item-title class="mainmenu__linkitem">{{itemx.title}} </v-list-item-title>
                  </v-list-item>
                  <v-list-item dense class="mainmenu__linkitem" v-if="itemx.hasSubs">
                    {{itemx.title}} >
                  </v-list-item>
                </template>
              </v-list>
              <v-divider class="mb-5"></v-divider>
            </template>
          </v-window-item>
        </v-window>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import i18n from '@vue-storefront/i18n'
import SidebarMenu from '@vue-storefront/core/compatibility/components/blocks/SidebarMenu/SidebarMenu'
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

export default {
  components: {
  },
  mixins: [SidebarMenu],
  data () {
    return {
      showMainMenu: true,
      step: 1,
      myAccountLinks: [
        {
          id: 1,
          name: i18n.t('My profile'),
          url: '/my-account'
        },
        {
          id: 2,
          name: i18n.t('My shipping details'),
          url: '/my-account/shipping-details'
        },
        {
          id: 3,
          name: i18n.t('My newsletter'),
          url: '/my-account/newsletter'
        },
        {
          id: 4,
          name: i18n.t('My orders'),
          url: '/my-account/orders'
        },
        {
          id: 5,
          name: i18n.t('My loyalty card'),
          url: '#'
        },
        {
          id: 6,
          name: i18n.t('My product reviews'),
          url: '#'
        }
      ],
      componentLoaded: false,
      activefirststage: 0,
      activesecondstage: 0,
      activelevel: 1,
      metaactive: 'Reseller Shop',
      shopmenu: [
        {
          'header': 'Aktuelles',
          'subheader': 'Neuigkeiten und Aktionen aus dem Shop',
          'menuitems': [
            {
              'title': 'Top Seller',
              'hasSubs': false,
              'link': 'topseller.html'
            },
            {
              'title': 'Promotions',
              'hasSubs': false,
              'link': 'topseller.html'
            },
            {
              'title': 'Neuheiten',
              'hasSubs': false,
              'link': 'topseller.html'
            }
          ]
        },
        {
          'header': 'Hersteller',
          'subheader': 'Produkt und Leistung nach Hersteller sortiert',
          'menuitems': [
            {
              'title': 'Herstellerüberischt',
              'hasSubs': false,
              'link': 'topseller.html'
            },
            {
              'title': 'Alle Herstellern alphabetisch',
              'hasSubs': true,
              'menuitems': [
                {
                  'header': 'E',
                  'subitems': [{
                    'title': 'EPOS',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'S',
                  'subitems': [{
                    'title': 'SonicWall',
                    'link': 'linkzurseite.html'
                  }]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapState({
      submenu: state => state.ui.submenu,
      currentUser: state => state.user.current
    }),
    getSubmenu () {
      return this.submenu
    },
    visibleCategories () {
      console.log('visibleCategories')
      console.log(this.categories.filter(category => {
        return category.product_count > 0 || category.children_count > 0
      }))
      return this.categories.filter(category => {
        return category.product_count > 0 || category.children_count > 0
      })
    },
    isCurrentMenuShowed () {
      return !this.getSubmenu || !this.getSubmenu.depth
    },
    ...mapGetters('category-next', ['getMenuCategories']),
    getCategories () {
      console.log('getCategories - gefilterte Kategorien')
      console.log(this.getMenuCategories)
      return this.getMenuCategories
    },
    mainCategories () {
      console.log('mainCategories - ALLE Kategorien')
      console.log(this.getCategories)
      return this.getCategories.filter((op) => {
        return op.level === 2
      })
    },
    subCategories (parentId) {
      console.log('subCategories')
      console.log(parentId)
      return this.getCategories.filter((op) => {
        return op.level === 3 && op.parent_id === parentId
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.componentLoaded = true;
      // disableBodyScroll(this.$refs.container)
    })
    console.log(this.categories)
    console.log(this.visibleCategories)
    console.log(this.getMenuCategories)
  },
  destroyed () {
    clearAllBodyScrollLocks()
  },
  methods: {
    login () {
      if (!this.currentUser && this.isCurrentMenuShowed) {
        this.$nextTick(() => {
          this.$store.commit('ui/setAuthElem', 'login')
          this.$bus.$emit('modal-show', 'modal-signup')
          this.$router.push({ name: 'my-account' })
        })
      }
    },
    categoryLink (category) {
      return formatCategoryLink(category)
    },
    selectCategory (catId) {
      this.selectedCatId = catId
      this.step++
    },
    showProductsInCategory (catId) {
      this.closeMenu()
      this.$router.push(this.categoryLink({ url_path: catId.url_path, slug: catId.slug }))
    },
    getSubCategories () {
      console.log('selectedCatId=' + this.selectedCatId)
      console.log(this.getMenuCategories.filter(c => { return c.parent_id === this.selectedCatId }))
      return this.getMenuCategories.filter(c => { return c.parent_id === this.selectedCatId })
    },
    getSubSubCategories (parentId) {
      console.log('selectedCatId=' + this.selectedCatId)
      console.log(this.getMenuCategories.filter(c => { return c.parent_id === parentId }))
      return this.getMenuCategories.filter(c => { return c.parent_id === parentId })
    },
    changelevel (stage, firstindex, secondindex) {
      console.log(this.activelevel)
      console.log(stage)
      this.activelevel = stage;
      this.step = 3;
      if (stage === 2) {
        this.activefirststage = firstindex;
        this.activesecondstage = secondindex;
      }
    }
  }
}
</script>
