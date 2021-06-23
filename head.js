export default {
  title: 'Default Theme',
  titleTemplate: '%s - ADN Distribution GmbH',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: 'utf-8' },
    { vmid: 'description', name: 'description', content: 'ADN Distribution GmbH' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1, minimal-ui' },
    { name: 'robots', content: 'index, follow' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'theme-color', content: '#ffffff' },
    { name: 'apple-mobile-web-app-status-bar-style', content: '#ffffff' }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/assets/favicon-32x32.png?v=2', sizes: '32x32' },
    { rel: 'icon', type: 'image/png', href: '/assets/favicon-16x16.png?v=2', sizes: '16x16' },
    { rel: 'manifest', href: '/assets/manifest.json' },
    { rel: 'stylesheet', as: 'style', href: 'https://fonts.googleapis.com/css?family=Playfair+Display:400,700|Roboto:400,700|Material+Icons|Material+Icons+Outlined&display=swap' },
    { rel: 'stylesheet', as: 'style', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css' },
    { rel: 'stylesheet', as: 'style', href: '/assets/MyFontsWebfontsKit.css' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com/', crossorigin: 'anonymous' }
  ],
  script: [
    {
      src: 'https://cdn.jsdelivr.net/npm/pwacompat@2.0.6/pwacompat.min.js',
      async: true,
      integrity: 'sha384-GOaSLecPIMCJksN83HLuYf9FToOiQ2Df0+0ntv7ey8zjUHESXhthwvq9hXAZTifA',
      crossorigin: 'anonymous'
    }
  ],
  noscript: [
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Playfair+Display:400,700|Roboto:400,700|Material+Icons|Material+Icons+Outlined&display=swap' }
  ]
}
