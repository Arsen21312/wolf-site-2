export default defineNuxtConfig({
  srcDir: 'src',
  devtools: { enabled: true },
  css: ['~/assets/styles/base.css', '~/assets/styles/tailwind.css'],
  nitro: {
    prerender: {
      routes: ['/', '/generators/wolf-quotes', '/generators/wolf-quotes/', '/sitemap.xml']
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
