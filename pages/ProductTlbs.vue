<template>
  <div id="product">
    <section class="">
      <breadcrumbs
        class="pb20 hidden-xs"
      />
      <v-container>
        <!--Product Headbereich-->
        <h1 class="product__title">
          <span class="product__title__manufacturer">
            {{ getCurrentProduct.manufacturer_name }}
          </span>
          {{ getCurrentProduct.name | htmlDecode }}
        </h1>
        <div class="mb-4">
          Hersteller: <a :href="manufacturerllink">{{ manufacturer }}</a>
        </div>
        <!--Product Headbereich Ende-->
        <!-- 3erBlock Start-->
<!--        <v-row>-->
<!--          <product-gallery-->
<!--            :offline="getOfflineImage"-->
<!--            :gallery="getProductGallery"-->
<!--            :configuration="getCurrentProductConfiguration"-->
<!--            :product="getCurrentProduct"-->
<!--          />-->
<!--        </v-row>-->
        <v-row>
          <!-- imagecol-->
          <v-col sm="12" md="4" lg="5" class="imagecol">
            <div class="image imagecol__mainimage">
              <product-gallery
                :offline="getOfflineImage"
                :gallery="getProductGallery"
                :configuration="getCurrentProductConfiguration"
                :product="getCurrentProduct"
              />
            </div>
<!--            <div class="imagecol__mainimage d-flex align-center justify-center">-->
<!--              <v-img contain :src="getImage" class="productimage" />-->
<!--            </div>-->
            <template v-for="item in variants[chosenvariant].subimages">
              <div class="imagecol__subimage d-flex align-center justify-center">
                <v-img contain :src="variants[chosenvariant].image" class="productimage" />
              </div>
            </template>
          </v-col>
          <!-- overview col-->
          <v-col md="4" class="overviewcol">
            <v-row class="overviewcol__artnr">
              <v-col class="overviewcol__artnr__label">
                Hersteller Artikel Nr.
              </v-col>
              <v-col class="overviewcol__value overviewcol__artnr__value">
                {{ getCurrentProduct.sku }}
              </v-col>
            </v-row>
            <v-row class="overviewcol__adnnr">
              <v-col class="overviewcol__adnnr__label">
                ADN Artikel Nr.
              </v-col>
              <v-col class="overviewcol__value overviewcol__adnnr__value">
                {{ getCurrentProduct.id }}
              </v-col>
            </v-row>
            <v-row class="overviewcol__listprice">
              <v-col class="overviewcol__listprice__label">
                Listpreis:
              </v-col>
              <v-col class="overviewcol__value overviewcol__listprice__value">
                <product-price
                  class="mb40"
                  v-if="getCurrentProduct.type_id !== 'grouped'"
                  :product="getCurrentProduct"
                  :custom-options="getCurrentCustomOptions"
                  :individual="false"
                />
              </v-col>
            </v-row>
            <v-row class="overviewcol__hek">
              <v-col class="overviewcol__label">
                Ihr HEK:
              </v-col>
              <v-col class="overviewcol__value overviewcol__hekprice hek">
                <span v-if="userloggedin==1">
                  <product-price
                    class="mb40"
                    v-if="getCurrentProduct.type_id !== 'grouped'"
                    :product="getCurrentProduct"
                    :custom-options="getCurrentCustomOptions"
                    :individual="true"
                  />
                </span>
                <span v-else class="notloggedin">Bitte loggen Sie sich ein!</span>
              </v-col>
            </v-row>
            <div v-for="item in getCurrentProduct.properties" :key="item.name" class="mt-2">
              <v-icon class="mr-2 material-icons-outlined">
                {{ item.icon }}
              </v-icon>
              <span>
                {{ item.name }}
              </span>
            </div>
            <div v-if="variants[chosenvariant].endcustomer!=0" class="overviewcol__endcustomer error--text mt-2">
              <v-icon class="mr-2 material-icons-outlined" color="error">
                error_outline
              </v-icon>
              <span>Endkundendatenpflichtig </span>
            </div>
            <div class="mt-4">
              <ul v-for="item in getCurrentProduct.keyfacts">
                <li> {{ item }}</li>
              </ul>
            </div>
            <div class="productvariants">
              <div class="productvariants__label mt-8">
                Produktvariante
              </div>
              <v-select :items="variants" flat hide-details solo outlined dense v-model="chosenvariant" item-value="id">
                <template v-slot:selection="{ item, index }">
                  <img :src="item.image" class="selectedimage">{{
                    item.name
                  }}
                </template>
                <template v-slot:item="{ item }">
                  <img :src="item.image" class="selectimage">{{ item.name }}
                </template>
              </v-select>
              <div class="productvariants__label mt-4">
                inkl. Software Lizenzpaket
              </div>
              <v-select flat hide-details solo outlined dense :items="inclsoftware" menu-props="auto"
                        label="Bitte wählen" v-model="chosensoftware"
              >
                <template v-slot:selection="{ item, index }">
                  {{ item.name }}
                </template>
                <template v-slot:item="{ item }">
                  {{ item.name }}
                </template>
              </v-select>
              <div v-if="chosensoftware != 0">
                <div class="productvariants__label mt-4">
                  Laufzeit (in Jahren)
                </div>
                <v-radio-group v-model="chosenlifetime" row>
                  <v-radio v-for="n in chosensoftware.lifetime" :key="n" :label="`${n}`" :value="n"/>
                </v-radio-group>
                <div class="inclsoft__features">
                  {{ chosensoftware.features }}
                </div>
              </div>
            </div>
          </v-col>
          <!-- Pricecard col-->
          <v-col sm="6" md="4" lg="3" class="pricecol">
            <v-card flat class="pricecard" tile>
              <div class="pricecard__header ">
                <div class="pricecard__header__listprice">
                  Listpreis
                </div>
                <div>
                  <product-price
                    class="mb40"
                    v-if="getCurrentProduct.type_id !== 'grouped'"
                    :product="getCurrentProduct"
                    :custom-options="getCurrentCustomOptions"
                    :individual="false"
                  />
                </div>
                <div class="pricecard__header__hekpricelabel">
                  Ihr HEK-Preis
                </div>
                <div class="pricecard__header__hekprice hek">
                  <span v-if="userloggedin==1">
                    <product-price
                      class="mb40"
                      v-if="getCurrentProduct.type_id !== 'grouped'"
                      :product="getCurrentProduct"
                      :custom-options="getCurrentCustomOptions"
                      :individual="true"
                    />
                  </span>
                  <span v-else class="notloggedin">Bitte loggen Sie sich ein!</span>
                </div>
              </div>
              <v-card-text>
                <!--Dummy - Staffelpreise sind zurkünftiges Feature--><strong class="mt-8">Staffelpreise</strong>
                <ul>
                  <li>ab 3 Stk. = 240€ / Stk.</li>
                  <li>ab 5 Stk. = 230€ / Stk.</li>
                  <li>ab 8 Stk. = 220€ / Stk.</li>
                  <li>ab 10 Stk. Projektpreis</li>
                </ul>
                <!--Dummy - Staffelpreise sind zurkünftiges Feature-->
                <v-row dense>
                  <v-col class="d-flex align-end justify-start">
                    <v-text-field flat hide-details solo tile outlined :label="unit"
                                  class="mt-8 pricecard__articleamount" v-model="articleamount" type="number" min="1"
                    />
                  </v-col>
                  <v-col class="d-flex align-end justify-start">
                    {{ unit }}
                  </v-col>
                </v-row>
                <add-to-cart
                  :product="getCurrentProduct"
                  :disabled="isAddToCartDisabled"
                />
                <v-btn depressed block dark tile class="mt-2 directorder">
                  <v-icon left dark>
                    payment
                  </v-icon>
                  Jetzt bestelllen
                </v-btn>
                <div class="pricebox__deliverytime mt-4">
                  <label>Lieferzeit:</label> 3-5 Werktage
                </div>
                <div class="pricebox__stock" v-if="userloggedin==1">
                  <label>Lagermenge:</label> 57 {{ unit }}
                </div>
              </v-card-text>
              <v-card-actions class="pricecard__actions px-8">
                <AddToWishlist :product="getCurrentProduct" :icon="false" />
                <AddToCompare :product="getCurrentProduct" :icon="false" />
                <v-btn>
                  <v-icon title="Diesen Artikel weiterempfehlen" class="outlined">
                    share
                  </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <!--- 3er Block Ende -->
        <!-- weitere Infos Bereich-->
        <v-row class="contentblock">
          <v-col md="9">
            <h2>Produktinformationen</h2>
            <p>
              {{ getCurrentProduct.description }}
            </p>
            <a href="#detailedinfo" class="pt-8">weitere Informationen ></a>
            <!--wird oft zusammen gekauft-->
            <div class="contentblock">
              <h2>Wird oft zusammen gekauft</h2>
              <v-list three-line tile class="addproductslist">
                <v-list-item-group v-model="checkedplus" multiple light>
                  <v-list-item v-for="item in addproducts" :key="item.id">
                    <template v-slot:default="{ active, }">
                      <v-list-item-content>
                        <v-row>
                          <v-col md="1" sm="2">
                            <v-list-item-action>
                              <v-checkbox :input-value="active"></v-checkbox>
                            </v-list-item-action>
                          </v-col>
                          <v-col xs="12" sm="10" md="2" class="addproducts__imagecol">
                            <v-img :src="variants[chosenvariant].image" contain v-if="item.id==0"></v-img>
                            <v-img :src="item.pictureurl" contain v-else></v-img>
                          </v-col>
                          <v-col md="7" sm="9" xs="12">
                            <v-row>
                              <v-col xs="12" class="text-truncate">
                                <v-list-item-title class="addproduct__title d-inline-block text-truncate" v-if="item.id==0">
                                  <span class="addproduct__title__label">Dieser Artikel: <br></span>
                                  {{manufacturer}} - {{variants[chosenvariant].name}}
                                  <span v-if="chosensoftware.id"> - {{chosensoftware.name}}</span>
                                  <span v-if="chosenlifetime"> - {{chosenlifetime}}
                                       <span v-if="chosenlifetime==1">Jahr</span><span v-else>Jahre</span>
                                    </span>
                                </v-list-item-title>
                                <v-list-item-title v-else class="addproduct__title d-inline-block text-truncate">
                                  <a :href="item.detailview">{{manufacturer}} - {{ item.productname }}</a>
                                </v-list-item-title>
                              </v-col>
                            </v-row>
                            <v-row xs="12">
                              <v-col>
                                <v-list-item-subtitle v-if="item.id==0">{{variants[chosenvariant].shorttext}}</v-list-item-subtitle>
                                <v-list-item-subtitle v-else>{{ item.shorttext }}</v-list-item-subtitle>
                              </v-col>
                            </v-row>
                          </v-col>
                          <v-col v-if="userloggedin" class="justify-end text-right" sm="3" xs="12" md="1">
                               <span v-if="item.id==0">
                                 <span class="hek">{{variants[chosenvariant].hek}}{{currency}}</span>
                                </span>
                            <span v-else>
                                 <span class="hek">{{ item.hek }}{{currency}}</span>
                               </span>
                          </v-col>
                        </v-row>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                </v-list-item-group>
                <v-list-item>
                  <v-list-item-content>
                    <v-row class="addproductslist__summary">
                      <v-col> {{checkedplus.length}} Produkte </v-col>
                      <v-col>
                        <div class="mb-4 text-right"> <span class="hek" v-if="userloggedin">Gesamt HEK-Preis: 1700{{currency}}</span></div>
                        <v-btn depressed block dark tile class="inbasket">
                          <v-icon left dark> add_shopping_cart </v-icon> Auswahl in den Warenkorb </v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
            <!-- wird oft zusammen gekauft Ende -->
          </v-col>
          <!--- linke Seite Ende-->

          <!-- Support & small Banner-->
          <v-col md="3" sm="12">
            <v-row>
              <v-col md="12" sm="6" class="mb-8">
                <!-- Support NEU -->
                <v-card
                  flat
                  outlined
                  tile
                  class="mb-0 flex-grow-1 flex-shrink-1 support"
                >
                  <div class="support__imgbackground">
                    <v-img height="165" contain :src="supportteampic"></v-img>
                  </div>
                  <h3 v-if="supportteam" class="support__headline">Wir beraten Sie gerne!</h3>
                  <h3 v-else class="support__headline">Ich berate Sie gerne!</h3>
                  <v-card-text>
                    <h4 v-if="supportteam" class="support__subline">Ihr SonicWall-Team</h4>
                    <h4 v-else class="support__subline">{{ supportperson }}</h4>
                    <br> <span class="support__phone">
                                       <v-icon small>
                                       phone
                                     </v-icon> {{ supportphone }}
                                     </span>
                    <br>
                    <a :href="`mailto:${supportmail}`">
                      <v-icon small> mail</v-icon>
                      {{ supportmail }}</a>
                  </v-card-text>
                </v-card>
                <!-- Support Ende-->
              </v-col>
              <v-col md="12" sm="6">
                <!-- Small Banner NUR DUMMY Wird durch Grafik ersetzt-->
                <!-- CI Banner-->
                <v-card flat outlined tile class="cibanner mb-0 flex-grow-1 flex-shrink-1">
                  <div class="cibanner__head">
                    <v-card-text>
                      <span class="cibanner__preheadline">{{ cibannerpreheadline }}</span>
                      <h2 class="cibanner__headline mt-1">{{ cibannerheadline }}</h2>
                    </v-card-text>
                  </div>
                  <div class="cibanner__subtext">
                    <v-card-text>
                      {{ cibannersubtext }}
                    </v-card-text>
                  </div>
                  <v-card-text v-if="cibannercta">
                    <v-btn depressed dark tile class="mt-2 primary" target="_blank" :href="cibannerctalink">
                      {{ cibannercta }}
                    </v-btn>
                  </v-card-text>
                  <div class="cibanner__footer px-5 pb-2 mt-8" v-if="cibannerfooter">
                    <v-img src="https://www.department-q.com/a-rot.svg" max-width="80px" max-height="50px" contain
                           class="pa-0 mr-auto"
                    ></v-img>
                  </div>
                </v-card>
                <!--CI Banner Ende-->
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Zusätzliche Lizenzen start -->
        <div class="contentblock">
          <h2>Zusätzliche Lizenzen für SonicWall TZ500</h2>
          <v-btn depressed tile @click="allopen" class="mb-2"> alle öffnen </v-btn>
          <v-btn depressed tile @click="allclose" class="mb-2"> alle schließen </v-btn>
          <v-expansion-panels accordion flat multiple tile focusable v-model="panel">
            <v-expansion-panel active-class v-for="(item, idx) in licenses" :key="item.id" class="license__panel">
              <v-expansion-panel-header>
                <h3>{{ item.licensecategory }}</h3>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="pt-5">
                <v-data-iterator :items="item.licensesdetails" item-key="productname" hide-default-footer>
                  <template v-slot:default="props">
                    <v-row v-for="item in props.items" :key="item.productname" class="licenselist__item">
                      <v-col xs="12" sm="6" md="5">
                        <div class="licenselist__item__title">
                          <a href="https://zureinzelseitedesprodukts.de"> <span class="licenselist__item__title__manufacturer">{{ item.manufacturer }} - </span> <span class="licenselist__item__title__productname">{{item.productname}}</span> </a>
                        </div>
                        <div class="licenselist__item__sku float-left"> Art. Nr: {{ item.sku }} - </div>
                        <div class="licenselist__item__adnnr"> ADN Nr: {{ item.adnnr }} </div>
                        <div class="licenselist__item__shorttext"> {{ item.shorttext }} </div>
                      </v-col>
                      <v-col xs="6" sm="6" md="2">
                        <v-select flat hide-details solo outlined dense :items="item.lifetime" label="Laufzeit"> </v-select>
                      </v-col>
                      <v-col xs="6" sm="6" md="2">
                        <div class="licenselist__item__listprice"> Listpreis: {{ item.listprice }} </div>
                        <div class="licenselist__item__hek hek" v-if="userloggedin"> Ihr HEK-Preis: {{item.hek}} </div>
                      </v-col>
                      <v-col xs="6" sm="6" md="3">
                        <v-btn depressed block class="inbasket" dark>
                          <v-icon left dark> add_shopping_cart </v-icon> In den Warenkorb </v-btn>
                      </v-col>
                    </v-row>
                  </template>
                </v-data-iterator>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <!-- Zusätzliche Lizenzen Ende -->

        <!-- Zuletzt angesehen Start-->
        <div class="contentblock">
        <lazy-hydrate when-idle>
          <section class="py20 container px15">
            <my-recently-viewed />
          </section>
        </lazy-hydrate>
        </div>

        <div class="contentblock">
          <h2>Zuletzt angesehen</h2>
          <!--wird ab hier mit List/Grid Ansicht ersetzt  toolbar:false infotext:false filter:false-->
          <v-row class="lastseen flex-wrap">
            <v-col v-for="item in lastseen" :key="item.id" xs="6" md="3" class="d-flex flex-column pr-0 pb-5 flex-grow-1 flex-shrink-0">
              <v-card tile outlined class="mb-1 flex-grow-1 flex-shrink-1">
                <a :href="item.detailurl">
                  <v-img height="100" contain :src='item.pictureurl'> </v-img>
                </a>
                <v-card-text>
                  <a> <span class="lastseen__title">{{ item.productname }}</span> </a>
                  <div class="lastseen__listprice"> <span class="lastseen__listprice__label">Listpreis: </span> {{ item.listprice }}{{currency}} </div>
                  <div class="lastseen__hek hek" v-if="userloggedin"> <span class="lastseen__hek__label">Ihr HEK</span> {{ item.hek }}{{currency}} </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <!-- Zuletzt angesehen Ende-->

        <!-- Contentbereich Dummy-->
        <div class="contentblock" id="detailedinfo">
          <h2>Ausführliche Produktinformationen zu {{ getCurrentProduct.name | htmlDecode }}</h2>
          <div v-if="getCurrentProduct.id == '341212010001'">
            <v-row>
              <v-col sm="6">
                <h3>Dies ist nur Testcontet für TZ 500</h3>
                <p>In einer sich ständig ändernden Sicherheitslandschaft ist es für kleine und mittlere Unternehmen (KMUs) nicht leicht, ihre Netzwerke, Daten und ihre Reputation zu schützen. Mit den technologischen Änderungen Schritt zu halten ist manchmal genauso schwierig, wie mit der wachsenden Anzahl von Bedrohungen.</p>
                <p>Die Firewalls der SonicWall TZ-Serie sind speziell für KMUs und Niederlassungen ausgelegt und bieten Sicherheit der Enterprise-Klasse ohne die damit verbundene Komplexität.</p>
              </v-col>
              <v-col sm="6">
                <v-img src="https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/08/Export_NSM.png"> </v-img>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="6">
                <v-img src="https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/11/TZ_Stack_Front-1050px-1.png"> </v-img>
              </v-col>
              <v-col sm="6">
                <h3>TZ 500 Weiter Beispielsinfos</h3>
                <p>In einer sich ständig ändernden Sicherheitslandschaft ist es für kleine und mittlere Unternehmen (KMUs) nicht leicht, ihre Netzwerke, Daten und ihre Reputation zu schützen. Mit den technologischen Änderungen Schritt zu halten ist manchmal genauso schwierig, wie mit der wachsenden Anzahl von Bedrohungen.</p>
                <p>Die Firewalls der SonicWall TZ-Serie sind speziell für KMUs und Niederlassungen ausgelegt und bieten Sicherheit der Enterprise-Klasse ohne die damit verbundene Komplexität.</p>
                <p>Zero-Touch-Bereitstellung und eine vereinfachte zentrale Verwaltung sorgen für unkomplizierte Installation und Betrieb. Entdecken Sie die neuesten Bedrohungen einschließlich verschlüsselter Angriffe mit erweiterten Networking- und Sicherheitsfunktionen wie dem cloud-basierten Multi-Engine-Sandbox-Service Capture Advanced Threat Protection (ATP) mit zum Patent angemeldeter Real-Time Deep Memory Inspection (RTDMI™)-Technologie. Optionale Funktionen wie PoE/PoE+-Support und 802.11ac Wi-Fi schaffen eine einheitliche Sicherheitslösung für kabelgebundene und drahtlose Netzwerke.</p>
                <p>Einfach einstecken und den erweiterten Schutz der kostengünstigen SonicWall Firewall der TZ-Serie genießen, ohne komplexe Verwaltung oder Angst vor der nächsten Bedrohung. </p>
              </v-col>
            </v-row>
          </div>
          <div v-else>
            {{ getCurrentProduct.long_description }}
          </div>
        </div>
        <!--Contentbereich Dummy Ende-->
        <!-- technische Informationen-->
        <h2>{{ getCurrentProduct.name | htmlDecode }} - Technische Informationen auf einem Blick</h2>
        <div class="contentblock">
          <v-simple-table class="productdetailtable" dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">Eigenschaft</th>
                <th class="text-left">Wert</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>SKU</td>
                <td>{{ getCurrentProduct.sku }}</td>
              </tr>
              <tr>
                <td>ADN-Art. Nr</td>
                <td>{{ getCurrentProduct.id }}</td>
              </tr>
              <tr v-for="item in getCurrentProduct.technicals" :key="item.name">
                <td>{{ item.name }}</td>
                <td>{{ item.value }}</td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
        <!-- technische Informationen Ende -->

      </v-container>
    </section>
    <!--    <lazy-hydrate when-idle>-->
    <!--      <reviews-->
    <!--        :product-name="getCurrentProduct.name"-->
    <!--        :product-id="getCurrentProduct.id"-->
    <!--        v-show="isOnline"-->
    <!--        :product="getCurrentProduct"-->
    <!--      />-->
    <!--    </lazy-hydrate>-->
<!--    <lazy-hydrate when-idle>-->
<!--      <related-tlbs-products type="Upgrade" heading="Upgrades"/>-->
<!--    </lazy-hydrate>-->
<!--    <lazy-hydrate when-idle>-->
<!--      <related-tlbs-products type="Zusatzprodukte" heading="Zusatzprodukte"/>-->
<!--    </lazy-hydrate>-->
<!--    <lazy-hydrate when-idle>-->
<!--      <related-tlbs-products type="Support" heading="Support"/>-->
<!--    </lazy-hydrate>-->
<!--    <lazy-hydrate when-idle>-->
<!--      <related-tlbs-products type="Zubehör" heading="Zubehör"/>-->
<!--    </lazy-hydrate>-->
<!--    <lazy-hydrate when-idle>-->
<!--      <related-products type="upsell" :heading="$t('We found other products you might like')"/>-->
<!--    </lazy-hydrate>-->
<!--    <lazy-hydrate when-idle>-->
<!--      <related-products type="related"/>-->
<!--    </lazy-hydrate>-->
<!--    <SizeGuide/>-->
    <script v-html="getJsonLd" type="application/ld+json"/>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n'
import VueOfflineMixin from 'vue-offline/mixin'
import config from 'config'
import RelatedProducts from 'theme/components/core/blocks/Product/Related.vue'
import RelatedTlbsProducts from 'theme/components/core/blocks/Product/RelatedTlbs.vue'
import Reviews from 'theme/components/core/blocks/Reviews/Reviews.vue'
import AddToCart from 'theme/components/core/AddToCart.vue'
import GenericSelector from 'theme/components/core/GenericSelector'
import ColorSelector from 'theme/components/core/ColorSelector.vue'
import SizeSelector from 'theme/components/core/SizeSelector.vue'
import Breadcrumbs from 'theme/components/core/Breadcrumbs.vue'
import ProductAttribute from 'theme/components/core/ProductAttribute.vue'
import ProductQuantity from 'theme/components/core/ProductQuantity.vue'
import ProductLinks from 'theme/components/core/ProductLinks.vue'
import ProductCustomOptions from 'theme/components/core/ProductCustomOptions.vue'
import ProductBundleOptions from 'theme/components/core/ProductBundleOptions.vue'
import ProductGallery from 'theme/components/core/ProductGallery'
import Spinner from 'theme/components/core/Spinner'
import PromotedOffers from 'theme/components/theme/blocks/PromotedOffers/PromotedOffers'
import focusClean from 'theme/components/theme/directives/focusClean'
import WebShare from 'theme/components/theme/WebShare'
import BaseInputNumber from 'theme/components/core/blocks/Form/BaseInputNumber'
import SizeGuide from 'theme/components/core/blocks/Product/SizeGuide'
import AddToWishlist from 'theme/components/core/blocks/Wishlist/AddToWishlist'
import AddToCompare from 'theme/components/core/blocks/Compare/AddToCompare'
import { mapGetters } from 'vuex'
import LazyHydrate from 'vue-lazy-hydration'
import { ProductOption } from '@vue-storefront/core/modules/catalog/components/ProductOption.ts'
import {
  getAvailableFiltersByProduct,
  getSelectedFiltersByProduct
} from '@vue-storefront/core/modules/catalog/helpers/filters'
import { isOptionAvailableAsync } from '@vue-storefront/core/modules/catalog/helpers/index'
import { localizedRoute, currentStoreView } from '@vue-storefront/core/lib/multistore'
import { htmlDecode } from '@vue-storefront/core/filters'
import { ReviewModule } from '@vue-storefront/core/modules/review'
import { RecentlyViewedModule } from '@vue-storefront/core/modules/recently-viewed'
import { registerModule, isModuleRegistered } from '@vue-storefront/core/lib/modules'
import { onlineHelper, isServer, productJsonLd } from '@vue-storefront/core/helpers'
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks'
import ProductPrice from 'theme/components/core/ProductPrice.vue'
import { doPlatformPricesSync } from '@vue-storefront/core/modules/catalog/helpers'
import { filterChangedProduct } from '@vue-storefront/core/modules/catalog/events'
import MyRecentlyViewed from '../components/core/blocks/MyAccount/MyRecentlyViewed'
import RenderVueFromString from 'theme/components/core/RenderVueFromString.vue'

export default {
  components: {
    AddToCart,
    AddToCompare,
    AddToWishlist,
    Breadcrumbs,
    ColorSelector,
    GenericSelector,
    ProductAttribute,
    ProductBundleOptions,
    ProductCustomOptions,
    ProductGallery,
    ProductLinks,
    PromotedOffers,
    RelatedProducts,
    Reviews,
    SizeSelector,
    WebShare,
    SizeGuide,
    LazyHydrate,
    ProductQuantity,
    ProductPrice,
    MyRecentlyViewed,
    RelatedTlbsProducts,
    RenderVueFromString
  },
  mixins: [ProductOption],
  directives: { focusClean },
  beforeCreate () {
    registerModule(ReviewModule)
    registerModule(RecentlyViewedModule)
  },
  data () {
    return {
      detailsOpen: false,
      maxQuantity: 0,
      quantityError: false,
      isStockInfoLoading: false,
      hasAttributesLoaded: false,
      manageQuantity: true,

      userloggedin: true,
      chosensoftware: [],
      chosenlifetime: '',
      chosenvariant: 0,
      checkedplus: [0, 1, 2, 3, 4],
      mainproductchecked: true,
      panel: [],
      articleamount: 1,
      comparelistsnackbar: false,
      comparelisttext: 'Der Artikel wurde ihrer Vergleichsliste hinzugefügt',
      favoritelistsnackbar: false,
      favoritelisttext: 'Der Artikel wurde ihrer Facoritenliste hinzugefügt',
      timeout: 2000,
      currency: '€',
      manufacturer: 'SonicWall',
      manufacturerllink: 'sonicwall.html',
      productname: 'TZ 500',
      supportteampic: 'https://shop.adn.de/out/pictures/generated/manufacturer/icon/245_245_75/acronis_team.jpg',
      supportteam: true,
      supportphone: '+49 2327 9912-117',
      supportmail: 'sonicwall@adn.de',
      supportperson: 'Max Mustermann',
      cibannerpreheadline: 'Wussten Sie schon?',
      cibannerheadline: 'SonicWall Rabatt ab 6800€ Warenwert',
      cibannersubtext: 'Sie bestellen, wir kümmern uns um den Rabatt.',
      cibannercta: '',
      cibannerfooter: true,
      properties: [{ name: 'Zubuchoptionen verügbar', icon: 'add_task' }, {
        name: 'On Premise Artikel',
        icon: 'fit_screen'
      }, { name: '2 Jahre Garantie - Garantieverlängerung möglich', icon: 'verified' }],
      unit: 'Stück',
      variants: [
        {
          id: 0,
          name: 'TZ 500',
          image: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/08/TZ570_Front-1080px-4.png',
          subimages: ['https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/08/TZ570_Front-1080px-4.png', 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/08/TZ570_Front-1080px-4.png', 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/08/TZ570_Front-1080px-4.png'],
          artnr: '13675676',
          adnnr: '98137871',
          listprice: '500,00',
          hek: '200,00',
          keyfacts: ['Firewall Inspection Throughput: 1.4 Gbps', 'Application Inspection Throughput: 1.3 Gbps', 'IPS Throughput: 1.0 Gbps', 'Threat Prevention Throughput: 700 Mbps', 'VPN Throughput: 1.0 Gbps'],
          endcustomer: 0
        },
        {
          id: 1,
          name: 'TZ 500 Wireless',
          image: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/10/TZ_Priority_TZ370W_Front.png',
          subimages: ['https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/10/TZ_Priority_TZ370W_Front.png', 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/10/TZ_Priority_TZ370W_Front.png', 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/10/TZ_Priority_TZ370W_Front.png'],
          artnr: '13776288',
          adnnr: '73133678',
          listprice: '750,00',
          hek: '350,00',
          keyfacts: ['Firewall Inspection Throughput: 1.4 Gbps', 'Application Inspection Throughput: 1.3 Gbps', 'IPS Throughput: 1.0 Gbps', 'Threat Prevention Throughput: 700 Mbps', 'Wireless'],
          endcustomer: 1
        }
      ],
      preselected: { variants_id: 1 },
      inclsoftware: [
        { id: 0, name: 'Kein', features: '', lifetime: [] },
        {
          id: 1,
          name: 'Total Secure Advanced Edition',
          features: 'Capture| Anti Malware | Gateway Anti Virus | Intrusion Prevention | Application Control | Content Filtering | Firmware Updates | NBD Replacement Warranty',
          lifetime: [1, 3, 5]
        },
        {
          id: 2,
          name: 'Advanced Gateway Security Suite',
          features: 'Capture| Anti Malware | Gateway Anti Virus | Intrusion Prevention | Application Control | Content Filtering | Firmware Updates | NBD Replacement Warranty',
          lifetime: [1, 2, 3]
        },
        {
          id: 3,
          name: 'Secure Upgrade Advanced',
          features: 'Capture| Anti Malware | Gateway Anti Virus | Intrusion Prevention | Application Control | Content Filtering | Firmware Updates | NBD Replacement Warranty',
          lifetime: [1, 2, 3, 4, 5, 6]
        }
      ],
      addproducts: [
        { id: 0, productname: '' },
        {
          id: 1,
          productname: 'Cloud Management',
          manufacturer: 'SonicWall',
          sku: '3125456',
          adnnr: '672367867',
          listprice: '500,00',
          hek: '220,99',
          shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte',
          pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2018/07/SoftwareBox-SecurityServices-KJ-MKTG2711-1.png',
          detailview: 'https://zureinzelseitedesprodukts.de',
          new: 0,
          sale: 0,
          configarticle: 0,
          show: false
        },
        {
          id: 2,
          productname: 'High Available Unit TZ 500',
          manufacturer: 'SonicWall',
          sku: '3125456',
          adnnr: '672367867',
          listprice: '500,00',
          hek: '200,00',
          shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte 5x 1-GbE-RJ45 600 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-Durchsatz Integrierter IEEE 802.11n Access-Point',
          pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2018/07/SoftwareBox-SecurityServices-KJ-MKTG2711-1.png',
          detailview: 'https://zureinzelseitedesprodukts.de',
          new: 0,
          sale: 0,
          configarticle: 0,
          show: false
        },
        {
          id: 3,
          productname: 'TZ500 - Hochverfügbarkeitslizenz Beispiel',
          manufacturer: 'SonicWall',
          sku: '3125456',
          adnnr: '672367867',
          listprice: '500,00',
          hek: '200,00',
          shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte 5x 1-GbE-RJ45 600 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-Durchsatz Integrierter IEEE 802.11n Access-Point',
          pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2018/07/SoftwareBox-SecurityServices-KJ-MKTG2711-1.png',
          detailview: 'https://zureinzelseitedesprodukts.de',
          new: 1,
          sale: 0,
          configarticle: 1,
          show: false
        },
        {
          id: 4,
          productname: 'IT Rack Mount Kit für Sonicwall',
          manufacturer: 'Rackmount.IT',
          sku: '3125456',
          adnnr: '672367867',
          listprice: '500,00',
          hek: '200,00',
          shorttext: '5x 1-GbE-RJ45 -00 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-DurchsatzIntegrierter IEEE 802.11n Access-Point',
          pictureurl: 'https://cdn.rackmount.it/images/product-images/rm-sw-t4-df-web.jpg',
          detailview: 'https://zureinzelseitedesprodukts.de',
          new: 0,
          sale: 0,
          configarticle: 0,
          show: false
        }
      ],
      lastseen: [
        {
          productname: 'SOHO 250',
          manufacturer: 'SonicWall',
          sku: '3125456',
          adnnr: '672367867',
          listprice: '500,00',
          hek: '220,99',
          shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte',
          pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/06/SOHO_250_Front-1.png',
          new: 0,
          sale: 0,
          configarticle: 0,
          show: false
        },
        {
          productname: 'SOHO 250 Wireless',
          manufacturer: 'SonicWall',
          sku: '3125456',
          adnnr: '672367867',
          listprice: '500,00',
          hek: '200,00',
          shorttext: '5x 1-GbE-RJ45 -00 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-DurchsatzIntegrierter IEEE 802.11n Access-Point',
          pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/10/TZ_Priority_TZ270W_Front.png',
          new: 0,
          sale: 0,
          configarticle: 0,
          show: false
        },
        {
          productname: 'TZ 350',
          manufacturer: 'SonicWall',
          sku: '3125456',
          adnnr: '672367867',
          listprice: '500,00',
          hek: '200,00',
          shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte 5x 1-GbE-RJ45 600 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-Durchsatz Integrierter IEEE 802.11n Access-Point',
          pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/06/TZ350_Front-1.jpg',
          new: 0,
          sale: 0,
          configarticle: 0,
          show: false
        },
        {
          productname: 'TZ 350 Wireless',
          manufacturer: 'SonicWall',
          sku: '3125456',
          adnnr: '672367867',
          listprice: '500,00',
          hek: '200,00',
          shorttext: 'Für Netzwerke im Bereich 1-10 User/Geräte 5x 1-GbE-RJ45 600 Mbps Firewall-Durchsatz 200 Mbps Threat-Protection-Durchsatz Integrierter IEEE 802.11n Access-Point',
          pictureurl: 'https://d3ik27cqx8s5ub.cloudfront.net/media/uploads/2020/10/TZ_Priority_TZ370W_Front.png',
          new: 1,
          sale: 0,
          configarticle: 1,
          show: false
        }
      ],
      licenses: [
        {
          licensecategory: 'Hochverfügbarkeits Lizenzen TZ 500',
          licensesdetails: [
            {
              productname: 'TZ-500 Hochverfügbarkeits Beispiel Lizenz',
              manufacturer: 'SonicWall',
              sku: '3125456',
              adnnr: '672367867',
              listprice: '500,00 EUR',
              hek: '220,99',
              lifetime: ['1 Jahr', '3 Jahre', '5 Jahre'],
              shorttext: 'Capture ATP, Threat Prevention und 24/7-Support'
            },
            {
              productname: 'TZ-500 Hochverfügbarkeits Beispiel Lizenz 2',
              manufacturer: 'SonicWall',
              sku: '3125456',
              adnnr: '672367867',
              listprice: '500,00 EUR',
              hek: '220,99',
              lifetime: ['1 Jahr', '2 Jahre', '3 Jahre', '4 Jahre', '5 Jahre', '6 Jahre'],
              shorttext: 'Capture ATP, Threat Prevention und 24/7-Support'
            }
          ]
        },
        {
          licensecategory: 'Security Lizenzen TZ 500',
          licensesdetails: [
            {
              productname: 'TZ-500 Security Beispiel Lizenz',
              manufacturer: 'SonicWall',
              sku: '3125456',
              adnnr: '672367867',
              listprice: '500,00 EUR',
              hek: '220,99',
              lifetime: ['1 Jahr', '3 Jahre', '5 Jahre'],
              shorttext: 'Capture ATP, Threat Prevention und 24/7-Support'
            },
            {
              productname: 'TZ-500 Security Beispiel Lizenz 2',
              manufacturer: 'SonicWall',
              sku: '3125456',
              adnnr: '672367867',
              listprice: '500,00 EUR',
              hek: '220,99',
              lifetime: ['1 Jahr', '2 Jahre', '3 Jahre', '4 Jahre', '5 Jahre', '6 Jahre'],
              shorttext: 'Capture ATP, Threat Prevention und 24/7-Support'
            }
          ]
        },
        {
          licensecategory: 'Support Lizenzen TZ 500',
          licensesdetails: [
            {
              productname: 'TZ-500 Support Beispiel Lizenz',
              manufacturer: 'SonicWall',
              sku: '3125456',
              adnnr: '672367867',
              listprice: '500,00 EUR',
              hek: '220,99',
              lifetime: ['1 Jahr', '3 Jahre', '5 Jahre'],
              shorttext: 'Capture ATP, Threat Prevention und 24/7-Support'
            },
            {
              productname: 'TZ-500 Support Beispiel Lizenz 2',
              manufacturer: 'SonicWall',
              sku: '3125456',
              adnnr: '672367867',
              listprice: '500,00 EUR',
              hek: '220,99',
              lifetime: ['1 Jahr', '2 Jahre', '3 Jahre', '4 Jahre', '5 Jahre', '6 Jahre'],
              shorttext: 'Capture ATP, Threat Prevention und 24/7-Support'
            }
          ]
        }
      ],
      technicaltable: [
        { name: 'SKU', value: '02-SSC-0938' }, {
          name: 'ADN-Art. Nr.',
          value: '02-SSC-0938'
        }, { name: 'Firewall Inspection Throughput', value: '1.4 Gbps' }, {
          name: 'Application Inspection Throughput',
          value: '1.3 Gbps'
        }, { name: 'IPS Throughput:', value: '1.0 Gbps' }, {
          name: 'Threat Prevention Throughput',
          value: '700 Mbps'
        }, { name: 'VPN Throughput', value: '1.0 Gbps' }
      ],
      drawer: false,
      parentcategories: [{ title: 'SonicWall', link: 'Sonicwall.html' }, {
        title: 'Firewalls',
        link: 'Firewalls.html'
      }, { title: 'SOHO - TZ Series', link: 'Soho-TZ.html' }, { title: 'SonicWall TZ-500', link: '' }]
    }
  },
  computed: {
    ...mapGetters({
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCurrentProduct: 'product/getCurrentProduct',
      getProductGallery: 'product/getProductGallery',
      getCurrentProductConfiguration: 'product/getCurrentProductConfiguration',
      attributesByCode: 'attribute/attributeListByCode',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions'
    }),
    getImage () {
      console.log('https://shop.adn.de/out/' + this.getCurrentProduct.image)
      return 'https://shop.adn.de/out/' + this.getCurrentProduct.image
    },
    getLongDescription () {
      return '<div>Neu</div>'
    },
    getOptionLabel () {
      return (option) => {
        const configName = option.attribute_code ? option.attribute_code : option.label.toLowerCase()
        return this.getCurrentProductConfiguration[configName] ? this.getCurrentProductConfiguration[configName].label : configName
      }
    },
    isOnline (value) {
      return onlineHelper.isOnline
    },
    getProductOptions () {
      console.log(this.getCurrentProduct)
      console.log(this.getCurrentProduct.configurable_options)
      if (
        this.getCurrentProduct.errors &&
        Object.keys(this.getCurrentProduct.errors).length &&
        Object.keys(this.getCurrentProductConfiguration).length
      ) {
        return []
      }
      return this.getCurrentProduct.configurable_options
    },
    getOfflineImage () {
      return {
        src: this.getThumbnail(this.getCurrentProduct.image, config.products.thumbnails.width, config.products.thumbnails.height),
        error: this.getThumbnail(this.getCurrentProduct.image, config.products.thumbnails.width, config.products.thumbnails.height),
        loading: this.getThumbnail(this.getCurrentProduct.image, config.products.thumbnails.width, config.products.thumbnails.height)
      }
    },
    getCustomAttributes () {
      return Object.values(this.attributesByCode || [])
        .filter(
          a => a.is_visible && a.is_user_defined && (parseInt(a.is_visible_on_front) || a.is_visible_on_front === true) && this.getCurrentProduct[a.attribute_code]
        )
        .sort((a, b) => {
          return a.attribute_id > b.attribute_id
        })
    },
    getAvailableFilters () {
      console.log(getAvailableFiltersByProduct(this.getCurrentProduct))
      return getAvailableFiltersByProduct(this.getCurrentProduct)
    },
    getSelectedFilters () {
      return getSelectedFiltersByProduct(this.getCurrentProduct, this.getCurrentProductConfiguration)
    },
    isSimpleOrConfigurable () {
      return ['simple', 'configurable'].includes(this.getCurrentProduct.type_id)
    },
    isAddToCartDisabled () {
      if (this.quantityError || this.isStockInfoLoading) {
        return false
      }

      return this.isOnline && !this.maxQuantity && this.manageQuantity && this.isSimpleOrConfigurable
    },
    storeView () {
      return currentStoreView()
    },
    getJsonLd () {
      return productJsonLd(this.getCurrentProduct, this.getCurrentProductConfiguration.color && this.getCurrentProductConfiguration.color.label, this.$store.state.storeView.i18n.currencyCode, this.getCustomAttributes)
    }
  },
  async mounted () {
    await this.$store.dispatch('recently-viewed/addItem', this.getCurrentProduct)
  },
  async asyncData ({ store, route, context }) {
    if (context) context.output.cacheTags.add('product')
    const product = await store.dispatch('product/loadProduct', {
      parentSku: route.params.parentSku,
      childSku: route && route.params && route.params.childSku ? route.params.childSku : null
    })
    const loadBreadcrumbsPromise = store.dispatch('product/loadProductBreadcrumbs', { product })
    if (isServer) await loadBreadcrumbsPromise
    catalogHooksExecutors.productPageVisited(product)
  },
  beforeRouteEnter (to, from, next) {
    if (isServer) {
      next()
    } else {
      next((vm) => {
        vm.getQuantity()
      })
    }
  },
  watch: {
    isOnline: {
      handler (isOnline) {
        if (isOnline) {
          this.getQuantity()
        }
      }
    }
  },
  methods: {
    showDetails (event) {
      this.detailsOpen = true
      event.target.classList.add('hidden')
    },
    notifyOutStock () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(
          'The product is out of stock and cannot be added to the cart!'
        ),
        action1: { label: this.$t('OK') }
      })
    },
    notifyWrongAttributes () {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'warning',
        message: this.$t(
          'No such configuration for the product. Please do choose another combination of attributes.'
        ),
        action1: { label: this.$t('OK') }
      })
    },
    async changeFilter (variant) {
      const selectedConfiguration = Object.assign({ attribute_code: variant.type }, variant)
      await filterChangedProduct(selectedConfiguration, this.$store, this.$router)
      this.getQuantity()
    },
    openSizeGuide () {
      this.$bus.$emit('modal-show', 'modal-sizeguide')
    },
    isOptionAvailable (option) { // check if the option is available
      const currentConfig = Object.assign({}, this.getCurrentProductConfiguration)
      currentConfig[option.type] = option
      return isOptionAvailableAsync(this.$store, { product: this.getCurrentProduct, configuration: currentConfig })
    },
    async getQuantity () {
      if (this.isStockInfoLoading) return // stock info is already loading
      this.isStockInfoLoading = true
      try {
        if (config.products.alwaysSyncPricesClientSide) {
          doPlatformPricesSync([this.getCurrentProduct]);
        }
        const res = await this.$store.dispatch('stock/check', {
          product: this.getCurrentProduct,
          qty: this.getCurrentProduct.qty
        })

        this.manageQuantity = res.isManageStock
        this.maxQuantity = res.isManageStock ? res.qty : null
      } finally {
        this.isStockInfoLoading = false
      }
    },
    handleQuantityError (error) {
      this.quantityError = error
    },
    allopen () {
      this.panel = [...Array(this.licenses.length).keys()].map((k, i) => i)
    },
    allclose () {
      this.panel = []
    }
  },
  metaInfo () {
    const storeView = currentStoreView()
    return {
      /* link: [
        { rel: 'amphtml',
          href: this.$router.resolve(localizedRoute({
            name: this.getCurrentProduct.type_id + '-product-amp',
            params: {
              parentSku: this.getCurrentProduct.parentSku ? this.getCurrentProduct.parentSku : this.getCurrentProduct.sku,
              slug: this.getCurrentProduct.slug,
              childSku: this.getCurrentProduct.sku
            }
          }, storeView.storeCode)).href
        }
      ], */
      title: htmlDecode(this.getCurrentProduct.meta_title || this.getCurrentProduct.name),
      meta: this.getCurrentProduct.meta_description ? [{
        vmid: 'description',
        name: 'description',
        content: htmlDecode(this.getCurrentProduct.meta_description)
      }] : []
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';

$color-primary: color(primary);
$color-tertiary: color(tertiary);
$color-secondary: color(secondary);
$color-white: color(white);
$bg-secondary: color(secondary, $colors-background);

// TLBS START

/*
Farben
$cired: #EA152A;
$darkblue: #00125A;
$highlightblue1: #0F129D;
$highlightblue2: #0A57E3;
$lightblue: #00A5DF;
$darkgrey: #2E3640;
$grey: #ABAFB3;
$lightgrey: #EAEBEC;
*/

/*Allgemein*/
.contentblock {
  margin-top: 3em;
}

h2 {
  margin-bottom: 0.5em;
}

.notloggedin {
  font-size: 12px;
}

/* Product Headbereich */
.product__title {
  font-size: 24px;
  font-weight: 700;
}

/* 3er Block */
/*3er Block Imagecol*/
.imagecol {
  padding-bottom: 5em;
}

.imagecol__mainimage {
  border: 1px solid #EAEBEC;
  width: 100%;
  height: 100%;
  max-height: 500px;
}

.imagecol__subimage {
  border: 1px solid #EAEBEC;
  max-width: 80px;
  height: 60px;
  max-height: 60px;
  margin-top: 0.5em;
  float: left;
  margin-right: 5px;
}

/*3er Block overviecol*/
.overviewcol {
  padding: 30px;
}

.overviewcol, .overviewcol .v-input {
  font-size: 14px;
}

.row.overviewcol__adnnr {
  margin-top: -12px;
}

.row.overviewcol__hek {
  margin-top: -25px;
}

.overviewcol__artnr .col, .overviewcol__artnr .col {
  padding-bottom: 0;
  margin-bottom: 0;
}

.overviewcol__hekprice {
  font-size: 18px;
}

.overviewcol__value {
  text-align: right;
}

.overviewcol__label {
  text-align: left;
}

.selectimage {
  width: 100px;
  height: auto;
  max-width: 100px;
  max-height: 50px;
  background: #fff;
  margin-right: 10px;
}

.selectedimage {
  max-height: 50px;
  max-width: 100px;
}

.productvariants__label {
  text-transform: uppercase;
  font-weight: 700;
  margin-top: 10px;
}

.inclsoft__features {
  font-size: 12px;
}

/*3er Block pricecard*/

.v-card.pricecard {
  background: #EAEBEC;
}

.v-card.pricecard .v-application ul {
  margin-left: 2px;
}

.pricecard ul li {
  list-style: none;
}

.pricecard__header__hekpricelabel {
  font-size: 14px;
}

.pricecard__header__listprice {
  font-size: 14px;
  text-transform: uppercase;
}

.pricecard__header__hekprice, .pricecard__header__hekpricelabel {
  text-align: right;
  font-size: 22px;
}

.pricecard__header__hekpricelabel {
  font-weight: 300;
}

.pricecard__header__hekprice.hek {
  color: #fff;
}

.pricecard__articleamount {
  width: 100px;
  font-size: 18px;
  font-weight: 700;
}

.pricecard label {
  font-weight: 700;
}

.pricecard__actions.v-card__actions > .v-btn.v-btn {
  background: #fff;
}

.pricecard__actions .v-btn > .v-btn__content .v-icon {
  color: #0F129D;
}

.pricecard__header {
  padding: 10px;
  background: #EA152A;
  color: #fff;
}

/*license Panels*/
/*
 */
.licenselist__item {
  border-bottom: 1px solid #EAEBEC;
}

.licenselist__item:last-child {
  border-bottom: 0px;
}

.licenselist__item:hover {
  background: #EAEBEC;
}

.licenselist__item__title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 0px;
}

.licenselist__item__sku, .licenselist__item__adnnr {
  font-size: 12px;
  font-weight: 700;
}

.licenselist__item__shorttext, .licenselist__item__listprice {
  font-size: 12px;
}

.licenselist__item__hek {
  font-size: 14px;
}

/* wird oft zusammen gekauft */
.addproduct__checkbox {
  margin-top: -5px;
}

.addproduct__title {
  font-weight: 700;
  text-overflow: ellipsis;
}

.addproduct__title__label {
  font-weight: 300;
}

.addproductslist .v-list-item-group .v-list-item--active {
  background: #ffffff;
}

.addproductslist .v-list-item-group .v-list-item--active:hover {
  background: #EAEBEC;
}

.addproductslist__summary {
  border-top: 2px solid #0A57E3;
}

.addproducts__imagecol .v-image {
  max-width: 130px;
  max-height: 100px;
}

.theme--light.v-list-item--active:before, .theme--light.v-list-item--active:hover:before, .theme--light.v-list-item:focus:before {
  opacity: 0;
}

@media only screen and (max-width: 500px) {
  .v-list-item__title {
    max-width: 300px
  }
}

/*technische Informationen*/

.theme--light.v-data-table.productdetailtable tbody tr:nth-of-type(odd) {
  background-color: #EAEBEC;
}

.productdetailtable tbody tr:hover {
  background: #0A57E3 !important;
  color: #fff;
}

/* Last Seen Start ----  nicht benötigt da durch Komponente List/Grid ersetzt wird */
.lastseen__title {
  font-size: 18px;
  font-weight: 700;
}

.lastseen__hek {
  font-size: 18px;
}

.lastseen__hek__label {
  font-weight: 300;
  font-size: 15px;
  display: block;
  color: #2E3640;
  margin-top: 1em;
}

.lastseen__listprice {
  font-size: 14px;
  margin-top: 1em;
}

/*last seen Ende*/

</style>
// TLBS END

.product {
&__add-to-compare {
display: none;
@media (min-width: 767px) {
display: block;
}
}
}

.breadcrumbs {
@media (max-width: 767px) {
margin: 15px 0;
padding: 15px 0 0 15px;
}
}

.error {
color: red;
font-weight: bold;
padding-bottom: 15px;
}
.data {
@media (max-width: 767px) {
border-bottom: 1px solid $bg-secondary;
}
}

.image {
@media (max-width: 1023px) {
margin-bottom: 20px;
}
}

.product-name {
@media (max-width: 767px) {
font-size: 36px;
}
}

.variants-label {
@media (max-width: 767px) {
font-size: 14px;
}
}

.variants-wrapper {
@media (max-width: 767px) {
padding-bottom: 30px;
}

.sizes {
@media (max-width: 767px) {
width: 100%;
}
}

.size-guide {
height: 40px;
@media (max-width: 767px) {
width: 100%;
margin-left: 0;
}
}
}

.product-top-section {
@media (max-width: 767px) {
padding: 0;
background-color: $color-white;
}
}

.add-to-buttons {
@media (max-width: 767px) {
padding-top: 30px;
margin-bottom: 40px;
}
}

.details {
@media (max-width: 767px) {
padding: 50px 15px 15px;
}
}

.details-title {
padding: 0 8px;

@media (max-width: 767px) {
font-size: 18px;
margin: 0;
}
}

.details-wrapper {
@media (max-width: 767px) {
position: relative;
max-height: 140px;
overflow: hidden;
transition: all 0.3s ease;
font-size: 14px;
}

&--open {
max-height: none;
}
}

.details-overlay {
@media (max-width: 767px) {
position: absolute;
height: 75%;
bottom: 0;
left: 0;
width: 100%;
margin: 0;
cursor: pointer;
background: linear-gradient(rgba($color-white, 0), rgba($color-white, 1));
&.hidden {
display: none;
}
}
}

.action {
&:hover {
color: $color-tertiary;
}
}

.attributes {
list-style-type: none;
}

.fade-enter-active,
.fade-leave-active {
transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
opacity: 0;
}

.product-image {
mix-blend-mode: multiply;
width: 460px;
}

.web-share {
float: right;
}
</style>
