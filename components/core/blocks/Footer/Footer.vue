<template>
  <footer>
    <v-footer padless class="mt-10">
      <v-card flat tile class="text-center" style=" width: 100%;">
        <newsletter class=" flex brdr-bottom-1 brdr-cl-secondary" v-if="!isCheckoutPage" />
        <div class="footer__overview">
          <v-container>
            <v-card-text class="pt-12">
              <v-img src="https://www.department-q.com/a-rot.svg" max-width="150" contain class="pa-0 ma-0 mt-n5" />
              <v-row>
                <v-col cols="12" sm="3" class="text-left">
                  <h4 class="mb-1">
                    ADN DISTRIBUTION GMBH
                  </h4>
                  <p>
                    Josef-Haumann-Str. 10<br>
                    44866 Bochum
                  </p>
                  <p>
                    Tel.: +49 2327 9912-0<br>
                    Fax: +49 2327 9912-540
                  </p>
                  <p>
                    E-Mail: info@adn.de
                  </p>
                </v-col>
                <template v-for="(item, i) in shopmenu">
                  <v-col cols="12" sm="3" class="text-left">
                    <h4 class="mb-4">
                      {{ item.header.toUpperCase() }}
                    </h4>
                    <template v-for="(itemx, e) in item.menuitems">
                      <a :href="itemx.link" class="footer__overview__link">{{ itemx.title }} </a>
                      <br>
                    </template>
                  </v-col>
                </template>
              </v-row>
              <v-row>
                <v-col cols="12" sm="3" class="text-left">
                  <h3>ADN Websites</h3>
                  <v-list dense two-line class="ml-0">
                    <v-list-item href="www.adn.de" target="_self" v-if="metaactive!='Homepage'" class="ml-0 pl-0">
                      <v-list-item-avatar class="ml-0 pl-0">
                        <v-icon dark class="error">
                          home
                        </v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title class="mainmenu__linkitem">
                          ADN Homepage
                        </v-list-item-title><br>
                        <v-list-item-subtitle class="mainmenu__subheader">
                          Alle Infos über die ADN
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <template v-for="(item, i) in metamenu">
                      <v-list-item :href="item.link" :target="item.target" v-if="item.title!=metaactive" class="ml-0 pl-0">
                        <v-list-item-avatar class="ml-0 pl-0">
                          <v-icon
                            class="error"
                            dark
                          >
                            {{ item.icon }}
                          </v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title class="mainmenu__linkitem">
                            {{ item.title }}
                          </v-list-item-title><br>
                          <v-list-item-subtitle class="mainmenu__subheader">
                            {{ item.info }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list>
                </v-col>
                <v-col cols="12" sm="3" class="text-left">
                  <h4 class="mb-4 pr-5">
                    PARTNER WERDEN
                  </h4>
                  <p>Profitieren Sie als ADN Partner von unseren exklusiven Angeboten, Promotions und Partnerprogrammen</p>
                  <v-btn depressed tile color="primary" class="mt-3">
                    Partner werden
                  </v-btn>
                </v-col>
                <v-col class="justify-end d-flex align-center pa-5">
                  <img src="https://www.adn.de/fileadmin/user_upload/ADN/Awards/footer-focus-kununu.png">
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider />
            <v-card-text>
              <div>
                <v-btn icon>
                  <v-icon>fab fa-facebook</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>fab fa-twitter</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>fab fa-xing</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>fab fa-youtube</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>fab fa-linkedin</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>cloud</v-icon>
                </v-btn>
              </div>
              <v-spacer />
              <div class="my-2">
                ©{{ new Date().getFullYear() }} — <strong>ADN Distribution Gmbh</strong>
              </div>
              <div>
                <a>Datenschutz</a> | <a>AGB</a> | <a>Impressum</a> | <a>Sitemap</a>
              </div>
              <div>
                {{ getVersionInfo }}
              </div>
              <v-spacer />
            </v-card-text>
          </v-container>
        </div>
      </v-card>
    </v-footer>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'
import { currentStoreView, localizedRoute } from '@vue-storefront/core/lib/multistore'
import CurrentPage from 'theme/mixins/currentPage'
import LanguageSwitcher from '../../LanguageSwitcher.vue'
import Newsletter from 'theme/components/core/blocks/Footer/NewsletterTlbs'
import BackToTop from 'theme/components/core/BackToTop'
import { getPathForStaticPage } from 'theme/helpers'
import config from 'config'

export default {
  mixins: [CurrentPage],
  name: 'MainFooter',
  data () {
    return {
      metaactive: 'Reseller Shop',
      metamenu: [
        { title: 'Reseller Shop', link: '', icon: 'storefront', isactive: true, target: 'self', info: 'Hier finden Sie Hard & Software für Ihre Kunden' },
        { title: 'Tech Academy', link: 'https://shop.adn.de/index.php?cl=start&shp=akademie&lang=0', icon: 'school', isactive: false, target: 'self', info: 'Schulungen und Zertifizierunge' },
        { title: 'Cloud Marketplace', link: 'https://marketplace.adncloud.de/', icon: 'cloud_queue', isactive: false, target: '_blank', info: 'Cloud Software und Dienste' }],
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
                  'header': '123',
                  'subitems': [{
                    'title': '3CX',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'A',
                  'subitems': [
                    {
                      'title': 'Acronis',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'ADN Cloud',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'ADN Dienstleistung',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'ascendit',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'AudioCodes',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Awingu',
                      'link': 'linkzurseite.html'
                    }

                  ]
                }
                ,
                {
                  'header': 'B',
                  'subitems': [{
                    'title': 'beroNet',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Bitdefender',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Bitglass',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Bressner',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'C',
                  'subitems': [{
                    'title': 'Citrix',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Citrix Service Provider',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Cloudian',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Cynet',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'D',
                  'subitems': [{
                    'title': 'DataCore',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Dell Cloud Client-Computing Solutions',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Dell EMC IT-Infrastructure Solutions',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'E',
                  'subitems': [{
                    'title': 'Edgecore Networks',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'EPOS',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'ExaGrid',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'G',
                  'subitems': [{
                    'title': 'Gemalto',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'GFI',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Greenbone Networks',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'H',
                  'subitems': [{
                    'title': 'Hornetsecurity',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'I',
                  'subitems': [{
                    'title': 'IGEL',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'K',
                  'subitems': [{
                    'title': 'Kaseya',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'KEMP',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'L',
                  'subitems': [{
                    'title': 'Login VSI',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Mellanox',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'M',
                  'subitems': [{
                    'title': 'Microsoft',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Microsoft ISV',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Microsoft SPLA',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'N',
                  'subitems': [{
                    'title': 'NComputing',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'New Net Technologies',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Nexenta',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Nutanix',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'NVIDIA',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'O',
                  'subitems': [{
                    'title': 'Octopus',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Online USV-Systeme',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'P',
                  'subitems': [{
                    'title': 'Parallels',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Patton',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Prime Computer',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'R',
                  'subitems': [{
                    'title': 'Rackmount.it',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Rubrik',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'S',
                  'subitems': [{
                    'title': 'SafeNet',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Scale Computing',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'SIOS',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'snom',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'SonicWall',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Storage Made Easy',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Stratodesk Software',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Swyx',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'T',
                  'subitems': [{
                    'title': 'ThinPrint',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'U',
                  'subitems': [{
                    'title': 'Unicon',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'V',
                  'subitems': [{
                    'title': 'Vertiv',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'W',
                  'subitems': [{
                    'title': 'WatchGuard',
                    'link': 'linkzurseite.html'
                  }]
                },
                {
                  'header': 'Y',
                  'subitems': [{
                    'title': 'Yealink',
                    'link': 'linkzurseite.html'
                  }]
                }


              ]
            }
          ]
        },
        {
          'header': 'Fokusthemen',
          'subheader': 'Produkte nach Themen Sortiert',
          'menuitems': [
            {
              'title': 'Server & Storage',
              'hasSubs': true,
              'link': '',
              'menuitems': [
                {
                  'header': 'Server',
                  'subitems': [
                    {
                      'title': 'Backup Systeme',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'LCD-Trays',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Racks',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Server Systeme',
                      'link': 'linkzurseite.html'
                    }
                  ]

                },
                {
                  'header': 'Software Definied Data Center',
                  'subitems': [
                    {
                      'title': 'Converged Infrastructure Platform',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Software Defined Storage',
                      'link': 'linkzurseite.html'
                    }
                  ]

                },
                {
                  'header': 'Storage',
                  'subitems': [
                    {
                      'title': 'Storage Systeme',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Object Storage',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Object Storage',
                      'link': 'linkzurseite.html'
                    }
                  ]

                },
                {
                  'header': 'Power',
                  'subitems': [
                    {
                      'title': 'Power Distribution Units',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Power Management',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'USV',
                      'link': 'linkzurseite.html'
                    }
                  ]

                },
                {
                  'header': 'Backup & Recovery',
                  'subitems': [
                  ]

                },
                {
                  'header': 'Management',
                  'subitems': [
                    {
                      'title': 'Asset Management',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Datamanagement',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Remote Access- /Out-of-Band-Management',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'RZ-Management',
                      'link': 'linkzurseite.html'
                    }
                  ]

                }
              ]
            },
            {
              'title': 'Networking & Security',
              'hasSubs': true,
              'link': '',
              'menuitems': [
                {
                  'header': 'Security Software',
                  'subitems': [
                    {
                      'title': 'Anti Virus',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Authentisierung',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Cloud Security',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Email Archivierung',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Email Security Software',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Endpoint Security',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Fileserver Security',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Patch Management',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Verschlüsselung',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Vulnerability Management',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Web Filterung',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Web Security',
                      'link': 'linkzurseite.html'
                    }
                  ]
                },
                {
                  'header': 'Security Hardware',
                  'subitems': [
                    {
                      'title': 'Data Encryption',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Email Security Hardware',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Firewalls',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Hardware Security Module',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Key-Management',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Network Packet Broker',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Remote Access',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'SSL Offloading',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'WAN Optimization',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Wireless Security',
                      'link': 'linkzurseite.html'
                    }
                  ]
                },
                {
                  'header': 'Network',
                  'subitems': [
                    {
                      'title': 'Host Bus Adapter',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'IP Digital Extender',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Loadbalancer',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Matrix-Switches',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Netzwerk Zubehör',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Netzwerk Zubehör',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Switches',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Wireless Access',
                      'link': 'linkzurseite.html'
                    }
                  ]
                }
              ]
            },
            {
              'title': 'Client Computing',
              'hasSubs': true,
              'link': '',
              'menuitems': [
                {
                  'header': 'Workstations',
                  'subitems': [
                    {
                      'title': 'Monitore',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'MiniPC',
                      'link': 'linkzurseite.html'
                    },
                    {
                      'title': 'Thin Client',
                      'link': 'linkzurseite.html'
                    }

                  ]

                },
                {
                  'header': 'Client Zubehör',
                  'subitems': [
                    {
                      'title': 'Client Peripherals',
                      'link': 'linkzurseite.html'
                    }
                  ]

                }


              ]
            },
            {
              'title': 'Cloud',
              'hasSubs': true,
              'link': '',
              'menuitems': [
                {
                  'header': 'Server & Storage ',
                  'subitems': [
                    {
                      'title': 'Asset Management',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Backup & Recovery',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Storage Systeme',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Object Storage',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Storage Zubehör',
                      'link': 'linkzurseite.html'
                    }
                  ]

                },
                {
                  'header': 'Networking Security',
                  'subitems': [
                    {
                      'title': 'Authentisierung',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Loadbalancer',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Email Security Software',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Switches',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'SSL Offloading',
                      'link': 'linkzurseite.html'
                    }
                  ]

                },
                {
                  'header': 'Unified Communications',
                  'subitems': [ {
                    'title': 'Software Solutions',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'IP Telefone',
                    'link': 'linkzurseite.html'
                  }]

                },
                {
                  'header': 'Software',
                  'subitems': [{
                    'title': 'Betriebssystem Server',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Business Intelligence',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Communication & Collaboration',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'CRM Software',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Datenbanken',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Kartensoftware',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Mobile Application Management',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Office Software',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Projektmanagement',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Systemmanagement',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Virtualisierung',
                    'link': 'linkzurseite.html'
                  } ]

                },
                {
                  'header': 'Services',
                  'subitems': [
                    {
                      'title': 'Office 365 Enterprise',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Visio',
                      'link': 'linkzurseite.html'
                    }
                  ]

                },
                {
                  'header': 'Productivity',
                  'subitems': []

                },
                {
                  'header': 'Security & Management',
                  'subitems': [{
                    'title': '365Command',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Azure Active Directory',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Enterprise Mobility Suite',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Cloud App Security',
                    'link': 'linkzurseite.html'
                  }, {
                    'title': 'Intune',
                    'link': 'linkzurseite.html'
                  } ]

                },
                {
                  'header': 'Infrastructure As A Service',
                  'subitems': [ ]

                },
                {
                  'header': 'Old_Backup & Recovery',
                  'subitems': [ {
                    'title': 'Backup',
                    'link': 'linkzurseite.html'
                  }]

                }
              ]
            },
            {
              'title': 'Unified Communictions',
              'hasSubs': true,
              'link': '',
              'menuitems': [
                {
                  'header': 'Software Solutions',
                  'subitems': [ ]

                },
                {
                  'header': 'Telefonie Hardware',
                  'subitems': [
                    {
                      'title': 'DECT',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Handsets',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Headsets',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'IP Telefone',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Konferenztelefone',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Konferenzlösung',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'UC Server',
                      'link': 'linkzurseite.html'
                    }
                  ]

                },
                {
                  'header': 'Gateways',
                  'subitems': [
                    {
                      'title': 'Analog',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Chassis',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'GSM',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'ISDN',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Kombi',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Module',
                      'link': 'linkzurseite.html'
                    }
                  ]

                },
                {
                  'header': 'Zubehör',
                  'subitems': [
                    {
                      'title': 'Adapter',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Addon für Lync',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Kabel',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Netzteil',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'RackMount',
                      'link': 'linkzurseite.html'
                    }
                  ]

                }
              ]
            },
            {
              'title': 'Virtualisierung',
              'hasSubs': true,
              'link': '',
              'menuitems': [
                {
                  'header': 'Networking & Security',
                  'subitems': [
                    {
                      'title': 'Firewalls',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Loadbalancer',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'SSL Offloading',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'WAN Optimization',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Verschlüsselung',
                      'link': 'linkzurseite.html'
                    }
                  ]

                },
                {
                  'header': 'Software',
                  'subitems': [
                    {
                      'title': 'Mobile Application Management',
                      'link': 'linkzurseite.html'
                    }, {
                      'title': 'Virtualisierung',
                      'link': 'linkzurseite.html'
                    }
                  ]

                }
              ]
            },
            {
              'title': 'Software',
              'hasSubs': true,
              'link': ''
            }
          ]
        }
      ]
    }
  },
  methods: {
    goToAccount () {
      this.$bus.$emit('modal-toggle', 'modal-signup')
    },
    getLinkFor (path) {
      return localizedRoute(getPathForStaticPage(path))
    }
  },
  computed: {
    ...mapGetters({
      isLogged: 'user/isLoggedIn'
    }),
    multistoreEnabled () {
      return config.storeViews.multistore
    },
    getVersionInfo () {
      return `v${process.env.__APPVERSION__} ${process.env.__BUILDTIME__}`
    }
  },
  components: {
    Newsletter,
    LanguageSwitcher,
    BackToTop
  }
}
</script>

<style lang="scss" scoped>
@import '~theme/css/variables/colors';
@import '~theme/css/helpers/functions/color';
