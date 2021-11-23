<template>
  <div class="footer__newsletter" v-show="!isSubscribed">
    <v-container>
      <v-row>
        <v-col class="d-flex align-center" >
          <h3>ADN Newsletter</h3>
        </v-col>
        <v-col cols="12" sm="6" class="d-flex align-center">

          <v-text-field
            label="Email"
            prepend-inner-icon="mail"
            solo
            flat
            class="float-left mt-7"
          ></v-text-field>
          <v-btn
            depressed
            tile
            class="float-left"
            height="48"
            color="error"
            data-testid="openNewsletterButton"
            @click.native="showNewsletterPopup"
          >
            anmelden
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <newsletter-popup v-if="loadNewsletterPopup" />
  </div>
</template>

<script>
import SubscriptionStatus from '@vue-storefront/core/modules/newsletter/mixins/SubscriptionStatus'
import ButtonOutline from 'theme/components/theme/ButtonOutline'
import { mapState } from 'vuex'
const NewsletterPopup = () => import(/* webpackChunkName: "vsf-newsletter-modal" */ 'theme/components/core/NewsletterPopup.vue')

export default {
  name: 'Newsletter',
  mixins: [SubscriptionStatus],
  data () {
    return {
      loadNewsletterPopup: false
    }
  },
  computed: {
    ...mapState({
      isOpen: state => state.ui.newsletterPopup
    })
  },
  methods: {
    showNewsletterPopup () {
      this.loadNewsletterPopup = true
      this.$bus.$emit('modal-show', 'modal-newsletter')
    }
  },
  components: {
    ButtonOutline,
    NewsletterPopup
  }
}
</script>

<style scoped>
  @media (min-width: 767px) and (max-width: 1200px){
    .button-outline{
      min-width: 100%;
    }
  }
  @media (max-width: 767px) {
    .h3 {
      font-size: 18px;
      text-align: center;
    }
    .newsletter-button {
      padding-top: 25px;
      text-align: center;
    }
  }
</style>
