const {GOOGLE_API_KEY} = process.env
export default {
  head: {
    title: 'nuxt-template',
    htmlAttrs: {
      lang: 'ko'
    },
    meta: [
      //<meta http-equiv="X-UA-Compatible" content="IE=edge">
      {'http-equiv': 'X-UA-Compatible', content : 'IE=edge'},
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid : 'og:type', property: 'og:site_name', content : 'website'},
      { hid : 'og:site_name', property: 'og:site_name', content : 'Nuxt Movie App'},
      { hid : 'og:title', property: 'og:title', content : 'Nuxt Movie App / Search'},
      { hid : 'og:description', property: 'og:description', content : 'The OMDb API is a RESTful web service to obtain movie information, all content and images on the site are contributed and maintained by our users.'},
      { hid : 'og:image', property: 'og:image', content : 'https://heropy.blog/css/images/logo.png'},
      { hid : 'og:url', property: 'og:url', content : process.env.CLIENT_URL}
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel:'stylesheet', href: 'https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css'},
      { rel:'preconnect', href: 'https://fonts.gstatic.com'},
      { rel:'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@500&family=Roboto:wght@400;700&display=swap'}
    ],
    script:[
      { hid: 'gmap', src: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&region=KR`, defer: true }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '~/assets/css/main.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/bootstrap.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/dotenv',
  ],
  styleResources: {
    scss : [
      '~/scss/main.scss'
    ]
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    babel: {
      presets: ['@babel/preset-env'],
      plugins: [
        ['@babel/plugin-transform-runtime']
      ]
    },
    postcss: {
      plugins: [
        require('autoprefixer')
      ]
    },
  },
  serverMiddleware: [
    {path:'/api/test', handler: '~/server-middleware/test.js'}
  ]
}
