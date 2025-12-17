<template>
  <main class="coin-page">
    <header class="coin-hero">
      <div class="pill">
        <span>Инструмент</span>
        <strong>Монетка</strong>
      </div>
      <h1>Бросок монеты</h1>
      <p class="lead">
        Орёл или решка? Подбрось монету онлайн, чтобы решить спор, выбрать вариант или просто проверить удачу.
      </p>
    </header>

    <section class="coin-card">
      <div class="coin-visual">
        <div class="coin" :class="{ flipping: isFlipping }" :key="flipId">
          <img :src="currentCoinImage" :alt="coinAlt" />
        </div>
        <button
          class="btn primary"
          :disabled="isFlipping"
          :aria-busy="isFlipping"
          :aria-label="isFlipping ? 'Монета в полёте' : 'Подбросить монету онлайн'"
          :title="isFlipping ? 'Монета в полёте' : 'Подбросить монету онлайн'"
          @click="flipCoin"
        >
          {{ isFlipping ? 'Бросаем...' : 'Подбросить' }}
        </button>
      </div>

      <div class="coin-stats">
        <div class="stat">
          <span class="stat-label">Орёл</span>
          <span class="stat-value">{{ counts.heads }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Решка</span>
          <span class="stat-value">{{ counts.tails }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Всего</span>
          <span class="stat-value">{{ counts.total }}</span>
        </div>
      </div>

      <p class="result" v-if="result" role="status" aria-live="polite">
        Выпало: <strong>{{ resultLabel }}</strong>
      </p>
    </section>

    <section class="benefits">
      <h2>Зачем нужна монетка</h2>
      <div class="grid three">
        <article class="card">
          <h3>Честно</h3>
          <p>Крипторандом, никакой подтасовки. Решение принимает монета, а не кто-то из компании.</p>
        </article>
        <article class="card">
          <h3>Быстро</h3>
          <p>Подбор стороны за пару секунд. Полезно, когда спорить уже не хочется.</p>
        </article>
        <article class="card">
          <h3>Бесконечно</h3>
          <p>Бросай монету сколько угодно — счётчики покажут статистику и помогут отследить удачу.</p>
        </article>
      </div>
    </section>

    <section class="faq">
      <div class="faq-text">
        <h2>Как это работает</h2>
        <p>
          Монета выбирает сторону через <code>crypto.getRandomValues</code>, поэтому результат максимально случайный.
          Анимация крутится меньше секунды, потом показывается итог.
        </p>
        <p>
          Используй монетку, чтобы принять решение, выбрать фильм, определить порядок хода или просто проверить удачу.
          Кнопка «Подбросить» доступна бесконечно — можешь бросать до победного.
        </p>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Бросок монеты онлайн без лишнего</h2>
        <p>
          Здесь можно подбросить монету за секунду: орёл или решка выбираются криптографически, так что результат честный,
          а спор решается без эмоций.
        </p>
        <p>
          Инструмент остаётся лёгким: бросок монеты онлайн доступен бесплатно и без ограничений, чтобы быстро принять
          решение или проверить удачу.
        </p>
        <p>
          Монетку удобно держать под рукой, когда нужно подбросить монету для выбора фильма, порядка хода или стартовой
          стороны в игре.
        </p>
      </div>
      <div class="usage">
        <h3>Где пригодится</h3>
        <ul class="usage-list">
          <li>Решить, кто ходит первым</li>
          <li>Выбрать фильм или сериал</li>
          <li>Определить стартовую сторону в игре</li>
          <li>Разделить спор быстро</li>
          <li>Определить, кому ехать за едой</li>
          <li>Запустить челлендж на удачу</li>
          <li>Выбрать тему для обсуждения</li>
        </ul>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRequestURL } from '#app'
import { useHead, useSeoMeta } from '#imports'
import { computed, reactive, ref } from 'vue'

const result = ref(null)
const isFlipping = ref(false)
const counts = reactive({ heads: 0, tails: 0, total: 0 })
const flipId = ref(0)

const coinImages = {
  heads: new URL('@/assets/images/heads.png', import.meta.url).href,
  tails: new URL('@/assets/images/tails.png', import.meta.url).href
}

const resultLabel = computed(() => {
  if (result.value === 'heads') return 'Орёл'
  if (result.value === 'tails') return 'Решка'
  return 'Монета'
})

const coinAlt = computed(() => {
  if (result.value === 'heads') return 'Монета, выпал Орёл'
  if (result.value === 'tails') return 'Монета, выпала Решка'
  return 'Монета для броска орёл или решка'
})

const currentCoinImage = computed(() => coinImages[result.value || 'heads'])

function flipCoin() {
  if (!process.client || isFlipping.value) return
  isFlipping.value = true
  flipId.value += 1

  const buffer = new Uint32Array(1)
  crypto.getRandomValues(buffer)
  const heads = buffer[0] % 2 === 0

  setTimeout(() => {
    result.value = heads ? 'heads' : 'tails'
    counts.total += 1
    heads ? (counts.heads += 1) : (counts.tails += 1)
    isFlipping.value = false
  }, 900)
}

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/coin-flip`)

useSeoMeta(() => ({
  title: 'Бросок монеты онлайн, орёл или решка, Монетка | Нейронный Волк',
  description:
    'Онлайн бросок монеты: орёл или решка за секунду, чтобы решить спор, выбрать вариант или проверить удачу. Подбросить монету бесплатно и без ограничений.',
  ogTitle: 'Бросок монеты онлайн, орёл или решка, Монетка | Нейронный Волк',
  ogDescription:
    'Онлайн бросок монеты: орёл или решка за секунду, чтобы решить спор, выбрать вариант или проверить удачу. Подбросить монету бесплатно и без ограничений.',
  ogType: 'website',
  ogUrl: canonicalUrl.value,
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
}))

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Монетка, бросок монеты',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      url: canonicalUrl.value,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'RUB'
      }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Как работает онлайн монетка?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Монета использует crypto.getRandomValues для случайного выбора орла или решки, анимация длится меньше секунды и сразу показывает результат.'
          }
        },
        {
          '@type': 'Question',
          name: 'Можно ли бросать монету сколько угодно?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Да, кнопка «Подбросить» доступна без ограничений, а счётчики фиксируют статистику орла, решки и общего количества.'
          }
        }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Главная',
          item: `${requestUrl.origin}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Решения',
          item: `${requestUrl.origin}/decisions`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Монетка',
          item: canonicalUrl.value
        }
      ]
    }
  ]
}))

useHead(() => ({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ]
}))
</script>

<style scoped>
.coin-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px 0 48px;
}

.coin-hero {
  text-align: center;
  display: grid;
  gap: 12px;
  justify-items: center;
}

.coin-hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 48px);
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
}

.coin-hero .lead {
  max-width: 720px;
  margin: 0;
  color: #cbd5e1;
}

.coin-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  display: grid;
  gap: 18px;
  justify-items: center;
  position: relative;
  overflow: hidden;
}

.coin-card::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 60%);
  right: -60px;
  bottom: -80px;
  pointer-events: none;
}

.coin-visual {
  display: grid;
  gap: 14px;
  justify-items: center;
}

.coin {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.coin img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.coin.flipping {
  animation: spin 0.9s ease-in-out;
}

.coin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
  width: 100%;
}

.stat {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}

.stat-label {
  display: block;
  color: #94a3b8;
  font-size: 13px;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #e5e7eb;
}

.result {
  margin: 0;
  color: #e5e7eb;
  font-weight: 700;
}

.benefits {
  display: grid;
  gap: 16px;
}

.benefits h2 {
  margin: 0;
  text-align: center;
}

.grid.three {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.faq {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 20px;
}

.faq-text h2 {
  margin-top: 0;
}

.faq-text p {
  margin: 0 0 12px;
  color: #cbd5e1;
}

.seo-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 22px;
  display: grid;
  gap: 16px;
}

.seo-text h2 {
  margin: 0 0 6px;
}

.seo-text p {
  margin: 0 0 10px;
  color: #cbd5e1;
}

.usage h3 {
  margin: 0 0 8px;
}

.usage-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.usage-list li {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 10px 12px;
}

.cta {
  display: grid;
}

.cta-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
}

.cta-box h3 {
  margin: 4px 0 0;
}

@keyframes spin {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(720deg);
  }
}

@media (max-width: 768px) {
  .coin-card {
    padding: 22px;
  }

  .coin {
    width: 140px;
    height: 140px;
  }

  .cta-box {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
