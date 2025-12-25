import { config as loadEnv } from 'dotenv'
import { resolve } from 'path'

loadEnv({ path: '.env' })
loadEnv({ path: '.env.local', override: true })

const publicDir = resolve(process.cwd(), 'public')

export default defineNuxtConfig({
  srcDir: 'src',
  dir: {
    public: publicDir
  },
  devtools: { enabled: true },
  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
  },
  css: ['~/assets/styles/base.css', '~/assets/styles/tailwind.css'],
  vite: {
    publicDir
  },
  nitro: {
    publicAssets: [{ dir: publicDir, baseURL: '/' }],
    routeRules: {
      '/tools/truth-or-dare-generator.html': {
        redirect: { to: '/games/truth-or-dare', statusCode: 301 }
      },
      '/tools/would-you-rather.html': {
        redirect: { to: '/games', statusCode: 301 }
      },
      '/tools/summa-propisyu.html': {
        redirect: { to: '/decisions/summa-propisyu', statusCode: 301 }
      },
      '/tools/love-calculator.html': {
        redirect: { to: '/decisions/love-calculator', statusCode: 301 }
      },
      '/tools/coin-flip': {
        redirect: { to: '/decisions/coin-flip', statusCode: 301 }
      },
      '/tools/random-word-generator.html': {
        redirect: { to: '/decisions/randomizer', statusCode: 301 }
      },
      '/tools/random-number-generator.html': {
        redirect: { to: '/decisions/randomizer', statusCode: 301 }
      },
      '/about.html': {
        redirect: { to: '/about', statusCode: 301 }
      },
      '/ads.html': {
        redirect: { to: '/ads', statusCode: 301 }
      },
      '/tools/random-quote-generator.html': {
        redirect: { to: '/generators/wolf-quotes', statusCode: 301 }
      },
      '/tools/random-meme-idea.html': {
        redirect: { to: '/generators/wolf-quotes', statusCode: 301 }
      },
      '/tools/jwt-decoder.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/density-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/morse-code-translator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/palindrome-checker.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/maze-generator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/decimal-to-fraction': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/percentage-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/interest-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/matrix-multiplication.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/calorie-calculator.htm': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/gcd-lcm-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/volume-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/temperature-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/energy-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/currency-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/loan-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/regex-tester.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/bmr-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/pivo': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/fraction-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/length-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/password-generator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/sleep-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/power-root-calculator': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/equation-solver.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/coin-collection-tracker.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/speed-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/hash-generator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/url-encoder-decoder.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/hronomer.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/text-counter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/prime-number-checker.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/sudoku-generator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/lorem-ipsum-generator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/pressure-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/json-formatter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/tip-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/weight-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/discount-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/time-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/age-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/bmi-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/text-reverser.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/ascii-art-generator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/random-color-generator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/js-minifier.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/random-date-generator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/mortgage-calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/dice-roller.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/base64-encoder-decoder.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/random-prompt-generator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/slug-generator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/binary-text-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/uuid-generator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/unit-circle-visualizer.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/emoji-remover.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/area-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/vse-horosho.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/base-converter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/xml-formatter.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/roman-numerals-converter': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/case-converter': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/factorial-calculator': {
        redirect: { to: '/', statusCode: 301 }
      }
    },
    prerender: {
      routes: ['/', '/generators/wolf-quotes', '/generators/wolf-quotes/', '/sitemap.xml']
    }
  },
  app: {
    baseURL: '/',
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
