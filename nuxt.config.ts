import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

export default defineNuxtConfig({
  srcDir: 'src',
  devtools: { enabled: true },
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY
  },
  css: ['~/assets/styles/base.css', '~/assets/styles/tailwind.css'],
  nitro: {
    routeRules: {
      '/tools/truth-or-dare-generator.html': {
        redirect: { to: '/games/truth-or-dare', statusCode: 301 }
      },
      '/tools/summa-propisyu.html': {
        redirect: { to: '/generators/summa-propisyu', statusCode: 301 }
      },
      '/tools/love-calculator.html': {
        redirect: { to: '/decisions/love-calculator', statusCode: 301 }
      },
      '/about.html': {
        redirect: { to: '/about', statusCode: 301 }
      },
      '/tools/random-quote-generator.html': {
        redirect: { to: '/generators/wolf-quotes', statusCode: 301 }
      },
      '/tools/random-meme-idea.html': {
        redirect: { to: '/generators/wolf-quotes', statusCode: 301 }
      }
    },
    prerender: {
      routes: ['/', '/generators/wolf-quotes', '/generators/wolf-quotes/', '/sitemap.xml']
    }
  },
  app: {
    head: {
      link: [],
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        }
      ],
      script: [
        {
          hid: 'adsense',
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1011761534614555',
          async: true,
          crossorigin: 'anonymous'
        },
        {
          hid: 'ya-metrica',
          innerHTML: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a)})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');ym(103991776, 'init', { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });`
        }
      ]
    }
  }
});
