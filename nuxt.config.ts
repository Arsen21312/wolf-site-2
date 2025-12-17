export default defineNuxtConfig({
  srcDir: 'src',
  devtools: { enabled: true },
  css: ['~/assets/styles/base.css', '~/assets/styles/tailwind.css'],
  nitro: {
    prerender: {
      routes: ['/generators/wolf-quotes', '/generators/wolf-quotes/']
    }
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        }
      ]
    }
  }
});
