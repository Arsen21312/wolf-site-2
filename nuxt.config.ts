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
        redirect: { to: '/generators/morse', statusCode: 301 }
      },
      '/tools/calculator.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/palindrome-checker.html': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/maze-generator.html': {
        redirect: { to: '/tools/maze-generator', statusCode: 301 }
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
        redirect: { to: '/decisions/beer', statusCode: 301 }
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
        redirect: { to: '/games/sudoku', statusCode: 301 }
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
        redirect: { to: '/decisions/text-reverser', statusCode: 301 }
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
      },
      '/index': {
        redirect: { to: '/', statusCode: 301 }
      },
      '/tools/coin-flipper.html': {
        redirect: { to: '/decisions/coin-flip', statusCode: 301 }
      },
      '/tools/yes-or-no-wheel.html': {
        redirect: { to: '/decisions/wheel-of-fortune', statusCode: 301 }
      },
      '/tools/random-picker-wheel.html': {
        redirect: { to: '/decisions/wheel-of-fortune', statusCode: 301 }
      },
      '/tools/random-item-picker.html': {
        redirect: { to: '/decisions/randomizer', statusCode: 301 }
      },
      '/tools/random-team-generator.html': {
        redirect: { to: '/decisions/team-generator', statusCode: 301 }
      },
      '/tools/calorie-calculator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/calorie-counter.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/inflation-calculator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/horonomer.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/mac-address-lookup.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/ip-location-finder.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/zodiac-sign-finder.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/text-case-converter.html': {
        redirect: { to: '/generators/text-case', statusCode: 301 }
      },
      '/tools/user-agent-parser.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/whois-lookup.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/fuel-consumption-converter.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/matrix-calculator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/css-formatter.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/line-remover.html': {
        redirect: { to: '/generators/remove-line-breaks', statusCode: 301 }
      },
      '/tools/binary-to-text.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/text-to-binary.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/text-repeater.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/roman-numerals.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/qr-code-generator.html': {
        redirect: { to: '/generators/qr-generator', statusCode: 301 }
      },
      '/tools/character-counter.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/word-counter.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/vat-calculator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/logarithm-calculator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/dns-lookup.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/gcd-lcm.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/random-password-generator.html': {
        redirect: { to: '/generators/password-generator', statusCode: 301 }
      },
      '/tools/number-base-converter.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/algebra-calculator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/color-converter.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/sitemap-generator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/investment-calculator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/md5-generator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/favicon-generator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/quadratic-equation-solver.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/gpa-calculator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/car-loan-calculator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/tax-calculator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/data-converter.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/html-encoder-decoder.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/robots-txt-generator.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/domain-age-checker.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/proxy-checker.html': {
        redirect: { to: '/generators', statusCode: 301 }
      },
      '/tools/pregnancy-due-date.html': {
        redirect: { to: '/generators', statusCode: 301 }
      }
    },
    prerender: {
      routes: ['/', '/generators/wolf-quotes', '/generators/wolf-quotes/', '/sitemap.xml']
    }
  },
  app: {
    baseURL: '/',
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
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
          hid: 'yandex-rtb-init',
          innerHTML: 'window.yaContextCb=window.yaContextCb||[]'
        },
        {
          hid: 'yandex-rtb',
          src: 'https://yandex.ru/ads/system/context.js',
          async: true
        }
      ]
    }
  }
});
