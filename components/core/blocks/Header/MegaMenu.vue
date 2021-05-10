<template>
  <div
    class="relative"
    @mouseover="showMenu"
    @mouseleave="hideMenu"
  >
    <a
      href="/#features"
      class="text-copy-primary hover:text-gray-600"
      @focus="showMenu"
      @keydown.shift.tab="hideMenu"
      @keydown.esc.exact="hideMenu"
      @keydown.up.exact.prevent="startArrowKeys"
      @keydown.down.exact.prevent="startArrowKeys"
    >
      {{ category.name }}
    </a>

    <div class="absolute w-full">&nbsp;</div>
    <transition name="mega-menu-fade">
      <div v-show="isVisible"
           class="mega-menu brdr-1 bg-cl-primary brdr-cl-secondary absolute normal-case font-normal bg-white shadow rounded-lg overflow-hidden border mt-4 w-full lg:w-160 z-30 lg:z-10 left-0 lg:-left-16"
           style="min-width: 900px; margin-top: 10px;"
      >
        <div class="flex flex-col w-100 lg:flex-row px15 py10 border-b -mx-4">
          <div class="row w-100 " style="min-height: 300px;">
            <div class="col-xs-12 col-sm-4 ">
              <ul class="attributes w-full lg:w-1/2 px-4 w-100 dropdown">
                <li class="mb-8 px10 py10"
                    :key="subCategory.slug"
                    v-for="subCategory in subCategories"
                >
                  <router-link
                    class="no-underline col-xs"
                    style="white-space: nowrap; font-weight: 700; font-size: 14px; color: #555;"
                    :to="categoryLink(subCategory)"
                  >
                    {{ subCategory.name }}
                  </router-link>
                  <ul class="attributes w-full lg:w-1/2 px-4 w-100 dropdown">
                    <li class="mb-8"
                        :key="subSubCategory.slug"
                        v-for="subSubCategory in subSubCategories(subCategory.id)"
                    >
                      <router-link
                        class="no-underline col-xs"
                        style="white-space: nowrap; font-weight: 400; font-size: 12px; color: #777;"
                        :to="categoryLink(subSubCategory)"
                      >
                        {{ subSubCategory.name }}
                      </router-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div class="col-xs-12 col-sm-8">
              <div class="px10 py10">
                <img :src="category.image" style="width: 80%;" />
                <p style="max-width: 80%; font-weight: 400; font-size: 12px; color: #777; text-transform: none;">
                  Die Cloud-basierte WatchGuard Panda AD360 Sicherheits-Suite kombiniert - im Gegensatz zu anderen Lösungen - eine breite Palette bewährter, hocheffektiver Endpoint-Schutztechnologien (EPP) mit intelligenten Next Gen Endpoint Detection and Response (EDR)-Funktionen in einer Lösung. Die dadurch einzigartige Plattform automatisiert die Vorbeugung, Erkennung und Abwehr auch fortschrittlichster Bedrohungen für die Endgeräte Ihrer Kunden. Steigen Sie jetzt mit ADN in Ihr neues erfolgreiches Business ein und revolutionieren Sie den Markt!
                </p>
                <ul class="introList">
                  <li><strong>Der einzigartige AD360 Zero Trust-Ansatz:</strong> Alle Prozesse auf Endgeräten werden durch den kompakten AD360-Agenten kontinuierlich überwacht, nur vertrauenswürdige, sichere Prozesse werden ausgeführt.
                  </li>
                  <li><strong>Managed Security Service:</strong> Ihre Kunden verfügen über begrenzte IT-Ressourcen. Bieten Sie AD360 als mandantenfähigen Managed Cyber Protection Service an!
                  </li>
                  <li><strong>Erschließen Sie neue Security-Welten:</strong> Zusammen mit ADN ein kleiner Schritt für Sie, ein großer Schritt für die präventive Endpoint Sicherheit Ihrer Kunden!
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { formatCategoryLink } from '@vue-storefront/core/modules/url/helpers'

export default {
  mounted () {
    this.menuItems = document.querySelectorAll('.mega-menu a')
  },
  props: {
    category: {
      type: Object
    },
    categories: {
      type: Array
    },
    subCategories: {
      type: Array
    }
  },
  data () {
    return {
      banner1: '/assets/banner1.png',
      banner2: '/assets/banner2.png',
      isVisible: false,
      menuItems: null,
      focusedIndex: 0
    }
  },
  methods: {
    subSubCategories (parentId) {
      // console.log('subSubCategories')
      // console.log(parentId)
      return this.categories.filter((op) => {
        return op.level === 4 && op.parent_id === parentId
      })
    },
    showMenu () {
      this.isVisible = true
    },
    hideMenu () {
      this.isVisible = false
      this.focusedIndex = 0
    },
    startArrowKeys () {
      this.menuItems[0].focus()
    },
    focusPrevious (isArrowKey) {
      this.focusedIndex = this.focusedIndex - 1

      if (isArrowKey) {
        this.focusItem()
      }
    },
    focusNext (isArrowKey) {
      this.focusedIndex = this.focusedIndex + 1

      if (isArrowKey) {
        this.focusItem()
      }
    },
    focusItem () {
      this.menuItems[this.focusedIndex].focus()
    },
    categoryLink (category) {
      return formatCategoryLink(category)
    }
  }
}
</script>

<style lang="scss" scoped>
.mega-menu-fade-enter-active, .mega-menu-fade-leave-active {
  transition: all .1s ease-in-out;
}

.mega-menu-fade-enter, .mega-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.shadow {
  -webkit-box-shadow: 0 12px 14px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06);
  box-shadow: 0 12px 14px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06);
}

.dropdown:before {
  position: absolute;
  top: -7px;
  left: 9px;
  display: inline-block;
  border-right: 7px solid transparent;
  border-bottom: 7px solid #ccc;
  border-left: 7px solid transparent;
  border-bottom-color: rgba(0, 0, 0, 0.2);
  content: '';
}

.dropdown:after {
  position: absolute;
  top: -6px;
  left: 10px;
  display: inline-block;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #fff;
  border-left: 6px solid transparent;
  content: '';
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
  margin-left: -1em;

  li {
    display: block;
    margin-left: 1em;

    a {
      font-size: 0.9em;
    }

  }
}

ul.introList {
  margin-top: 10px;
  margin-bottom: 20px;
  list-style: none;
  padding: 0;
}

ul.introList li {
  background: url('https://adn.de/fileadmin/microsites/watchguard-panda/img/icon-stern.png') no-repeat top left;
  padding-left: 40px;
  margin-bottom: 15px;
  font-size: 12px;
  font-weight: 400;
  color: #777;
  background-size: 30px;
  text-transform: none;
}

</style>
