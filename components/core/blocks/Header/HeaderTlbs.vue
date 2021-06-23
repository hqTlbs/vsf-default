<template>
  <!--- Header Dummy -->
  <div class="header">
    <v-container class="text-left">
      <router-link :to="localizedRoute('/')" :title="$t('Home Page')" class="no-underline inline-flex">
        <v-img src="https://www.department-q.com/a-rot.svg" max-width="120px" max-height="50px" contain
              class="pa-0 mr-auto"
        ></v-img>
      </router-link>
    </v-container>
    <v-app-bar flat color="#2E3640" dark
               class="header"
               :class="{ 'is-visible': navVisible }"
    >
      <v-container class="pa-0 fill-height">
        <hamburger-icon class="p15 icon pointer" />
        <v-spacer></v-spacer>
        <v-text-field append-icon="search" dense solo hide-details single-line light class="ml-3"> </v-text-field>
        <v-spacer></v-spacer>
        <compare-icon class="p15 icon hidden-xs pointer" />
        <wishlist-icon class="p15 icon pointer" />
        <microcart-icon class="p15 icon pointer" />
        <search-icon class="p15 icon pointer" />
      </v-container>
    </v-app-bar>
  </div>
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
      isVisible: false
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';

$color-icon-hover: color(secondary, $colors-background);

header {
  height: 54px;
  top: -55px;
  z-index: 3;
  transition: top 0.2s ease-in-out;

  &.is-visible {
    top: 0;
  }
}

.icon {

  &:hover,
  &:focus {
    background-color: transparent;
    opacity: 1;
  }
}

.right-icons {
  //for edge
  float: right;
}

.header-placeholder {
  height: 54px;
}

.links {
  text-decoration: underline;
}

@media (max-width: 767px) {
  .row.middle-xs {
    margin: 0 -15px;

    &.py5 {
      margin: 0;
    }
  }
  .col-xs-2:first-of-type {
    padding-left: 0;
  }
  .col-xs-2:last-of-type {
    padding-right: 0;
  }
  a,
  span {
    font-size: 12px;
  }
}
</style>
