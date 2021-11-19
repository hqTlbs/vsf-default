<template>
  <v-menu offset-y left transition="scroll-y-transition" class="d-none d-sm-flex" :close-on-content-click="false"
          attach
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
        <span v-if="currentUser">Kundenmenu</span>
        <span v-else>Login</span>
      </v-tooltip>
    </template>
    <v-divider class="my-1" />
    <no-ssr>
      <v-card tile v-if="currentUser">
        <v-list-item class="drawerheader" dark>
          <v-list-item-content>
            <v-list-item-title>Kundenmenu</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-1 adndrawerheader" />
        <v-list nav>
          <v-list-item dense v-for="(page, index) in navigation" :key="index" @click="notify(page.title)" :href="localizedRoute(page.link)">
            <v-list-item-title class="headermenu__limkitem">
              {{ page.title }}
            </v-list-item-title>
          </v-list-item>
          <v-divider class="my-2" />
          <v-list-item>
            <v-btn color="primary" tile depressed @click="logout">
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
        <v-divider class="mt-1 adndrawerheader" />
        <v-card-text>
          <form @submit.prevent="login" novalidate>
            <v-row class="my-0">
              <v-col>
                <v-text-field
                  label="Email"
                  prepend-inner-icon="account_circle"
                  flat tile dense outlined
                  name="email"
                  focus
                  v-model="email"
                />
                <v-text-field
                  label="Passwort"
                  prepend-inner-icon="password"
                  type="password"
                  flat tile dense outlined
                  name="password"
                  v-model="password"
                />
                <v-btn color="primary" type="submit" tile depressed>
                  <v-icon>
                    login
                  </v-icon>
                  Anmelden
                </v-btn>
              </v-col>
            </v-row>
            <v-divider class="my-2" />
            <p>
              <a>Passwort vergessen?</a>
            </p>
            Sie sind noch kein Partner? <br><a href="partnerregistrierung" title="Partner der ADN werden">Hier können
              Sie sich registrieren. </a>
          </form>
        </v-card-text>
      </v-card>
    </no-ssr>
  </v-menu>
</template>

<script>
import NoSSR from 'vue-no-ssr'
import AccountIcon from '@vue-storefront/core/compatibility/components/blocks/Header/AccountIcon'
import Login from '@vue-storefront/core/compatibility/components/blocks/Auth/Login'

export default {
  mixins: [
    AccountIcon,
    Login
  ],
  components: {
    'no-ssr': NoSSR
  },
  data () {
    return {
      showMenu: false,
      disableheadertooltips: true,
      navigation: [
        { title: this.$t('My profile'), link: '/my-account' },
        { title: this.$t('My shipping details'), link: '/my-account/shipping-details' },
        { title: this.$t('My newsletter'), link: '/my-account/newsletter' },
        { title: this.$t('My orders'), link: '/my-account/orders' },
        { title: this.$t('My Recently viewed products'), link: '/my-account/recently-viewed' }
      ]
    }
  },
  methods: {
    notify (title) {
      if (title === 'My loyalty card' || title === 'My product reviews') {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'warning',
          message: this.$t('This feature is not implemented yet! Please take a look at https://github.com/DivanteLtd/vue-storefront/issues for our Roadmap!'),
          action1: { label: this.$t('OK') }
        })
      }
    },
    login () {
      this.callLogin()
    },
    close (e) {
      if (e) localStorage.removeItem('redirect')
    },
    onSuccess () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: this.$t('You are logged in!'),
        action1: { label: this.$t('OK') }
      })
    },
    onFailure (result) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(result.result),
        action1: { label: this.$t('OK') }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/base/global_vars';
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
$color-icon-hover: color(secondary, $colors-background);

.dropdown {

  button {
    pointer-events: none;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    top: 100%;
    width: 160px;
    z-index: 1;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
  }

  a {
    opacity: .6;

    &:hover,
    &:focus {
      background-color: $color-icon-hover;
      opacity: 1;
    }

  }

  @media (min-width: 768px) {
    &:hover .dropdown-content:not(.dropdown-content__hidden),
    &:focus .dropdown-content:not(.dropdown-content__hidden) {
      display: block;
    }

    &:focus-within {
      background-color: $color-icon-hover;
      opacity: 1;
      .dropdown-content:not(.dropdown-content__hidden) {
        display: block;
      }
    }
  }

}
</style>
