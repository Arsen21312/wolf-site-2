<template>
  <section class="promo-page">
    <div class="container">
      <div class="promo-hero">
        <div class="promo-hero__text">
          <Breadcrumbs :items="breadcrumbs" />
          <h1 class="section-title">Реклама и сотрудничество</h1>
          <p class="section-lead">
            Размещайте рекламу на нашем сайте и в соцсетях. Заказывайте кастомные видео с волками для вашего проекта.
          </p>
          <div class="promo-hero__cta">
            <a class="btn" :href="ctaLink.href" target="_blank" rel="noreferrer">
              Написать в Telegram
            </a>
          </div>
        </div>
        <div class="promo-hero__stats">
          <div v-for="stat in heroStats" :key="stat.label" class="promo-stat card">
            <div class="promo-stat__value">{{ stat.value }}</div>
            <div class="promo-stat__label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <section class="promo-section">
        <header class="promo-section__header">
          <p class="tag">Выберите формат</p>
          <h2>Рекламные предложения</h2>
          <p class="muted">Выберите подходящий вариант рекламы или сотрудничества</p>
        </header>
        <div class="promo-grid three">
          <article v-for="offer in offers" :key="offer.id" class="promo-card promo-card--offer">
            <div class="promo-card__head">
              <span class="promo-card__icon">{{ offer.icon }}</span>
              <div class="promo-card__titles">
                <h3>{{ offer.title }}</h3>
                <p class="muted">{{ offer.description }}</p>
              </div>
              <span v-if="offer.badge" class="promo-badge" :class="`tone-${offer.badgeTone || 'blue'}`">
                {{ offer.badge }}
              </span>
            </div>
            <ul class="promo-list">
              <li v-for="feature in offer.features" :key="feature">
                <span>•</span>
                <span>{{ feature }}</span>
              </li>
            </ul>
            <div class="promo-card__footer">
              <div>
                <div class="promo-price">{{ offer.price }}</div>
                <p class="muted small">{{ offer.note }}</p>
              </div>
              <a class="promo-link" :href="ctaLink.href" target="_blank" rel="noreferrer">
                Обсудить
              </a>
            </div>
          </article>
        </div>
      </section>

      <section class="promo-section">
        <header class="promo-section__header">
          <p class="tag">Процесс</p>
          <h2>Как мы работаем</h2>
          <p class="muted">Простой и прозрачный процесс сотрудничества</p>
        </header>
        <div class="promo-grid four">
          <article v-for="step in processSteps" :key="step.id" class="promo-step">
            <div class="promo-step__index">{{ step.id }}</div>
            <div class="promo-step__icon">{{ step.icon }}</div>
            <h3>{{ step.title }}</h3>
            <p class="muted">{{ step.text }}</p>
          </article>
        </div>
      </section>

      <section class="promo-section">
        <header class="promo-section__header">
          <p class="tag">Оплата</p>
          <h2>Способы оплаты</h2>
          <p class="muted">Оплачивайте удобным для вас способом</p>
        </header>
        <div class="promo-grid three">
          <article v-for="method in paymentMethods" :key="method.title" class="promo-card promo-card--pay">
            <div class="promo-card__head">
              <span class="promo-card__icon">{{ method.icon }}</span>
              <div>
                <h3>{{ method.title }}</h3>
                <p class="muted">Доступные способы</p>
              </div>
            </div>
            <ul class="promo-list">
              <li v-for="detail in method.details" :key="detail">
                <span>•</span>
                <span>{{ detail }}</span>
              </li>
            </ul>
          </article>
        </div>
        <div class="promo-note">
          <div class="promo-note__title">Важно</div>
          <p>
            Реквизиты предоставляем после обсуждения задачи. Возможна оплата по счету с НДС.
          </p>
        </div>
      </section>

      <section class="promo-cta">
        <div class="promo-cta__content">
          <div>
            <p class="tag">Связаться</p>
            <h2>Готовы к сотрудничеству?</h2>
            <p class="muted">
              Свяжитесь со мной, чтобы обсудить детали и получить индивидуальное предложение
            </p>
          </div>
          <a class="btn" :href="ctaLink.href" target="_blank" rel="noreferrer">
            Написать в Telegram
          </a>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { ctaLink, heroStats, offers, paymentMethods, processSteps } from '@/data/ads'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Реклама' }
]

const pageTitle = 'Реклама и сотрудничество — Нейронный Волк'
const pageDescription =
  'Реклама на сайте, в соцсетях и кастомные видео с волками. Подберём формат, запустим быстро и покажем статистику.'
const pageUrl = 'https://neuralwolf.ru/ads'
const pageImage = '/favicon.svg'

useHead({
  title: pageTitle,
  meta: [
    { name: 'description', content: pageDescription },
    { property: 'og:title', content: pageTitle },
    { property: 'og:description', content: pageDescription },
    { property: 'og:image', content: pageImage },
    { property: 'og:url', content: pageUrl },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: pageTitle },
    { name: 'twitter:description', content: pageDescription },
    { name: 'twitter:image', content: pageImage }
  ]
})
</script>

<style scoped>
.promo-page {
  padding: 24px 0 48px;
  color: #e5e7eb;
}

.promo-hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 28px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(106, 215, 255, 0.08), rgba(252, 166, 61, 0.07)),
    rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
}

.promo-hero__text {
  display: grid;
  gap: 14px;
}

.promo-hero__cta {
  margin-top: 6px;
}

.promo-hero__stats {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.promo-stat {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  transition: transform 0.15s ease, border-color 0.2s ease;
}

.promo-stat:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.2);
}

.promo-stat__value {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.promo-stat__label {
  margin-top: 6px;
  color: #cbd5e1;
}

.promo-section {
  margin-top: 34px;
}

.promo-section__header {
  display: grid;
  gap: 6px;
  margin-bottom: 14px;
}

.promo-section__header h2 {
  margin: 0;
  font-size: 28px;
  letter-spacing: -0.4px;
}

.promo-hero .pill,
.promo-section__header .tag {
  width: fit-content;
  align-self: start;
  justify-self: start;
}

.promo-grid {
  display: grid;
  gap: 14px;
  align-items: stretch;
}

.promo-grid.three {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.promo-grid.four {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.promo-card {
  border-radius: 18px;
  padding: 18px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.16s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  height: 100%;
}

.promo-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}

.promo-card__head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding-right: 64px;
  position: relative;
  flex-direction: column;
}

.promo-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, rgba(106, 215, 255, 0.14), rgba(252, 166, 61, 0.12));
  font-size: 22px;
}

.promo-card--pay .promo-card__head {
  padding-top: 4px;
  padding-right: 12px;
  gap: 6px;
}

.promo-card--pay .promo-card__icon {
  position: absolute;
  top: 8px;
  right: 10px;
}

.promo-card--pay {
  padding: 16px;
}

.promo-card--pay h3 {
  margin: 0 0 6px;
}

.promo-card--pay .muted {
  margin: 0 0 8px;
}

.promo-card__titles h3 {
  margin: 0 0 4px;
}

.promo-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
  flex: 1;
}

.promo-list li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: baseline;
  color: #cbd5e1;
}

.promo-card__footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-top: auto;
}

.promo-price {
  font-size: 20px;
  font-weight: 800;
}

.promo-link {
  color: #6ad7ff;
  font-weight: 700;
}

.promo-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.16);
  position: absolute;
  top: 14px;
  right: 14px;
}

.tone-blue {
  background: rgba(106, 215, 255, 0.14);
  color: #d9f3ff;
}

.tone-purple {
  background: rgba(168, 85, 247, 0.14);
  color: #ede9fe;
}

.tone-orange {
  background: rgba(252, 166, 61, 0.18);
  color: #fff2e0;
}

.promo-step {
  border-radius: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
  display: grid;
  
  transition: transform 0.14s ease, border-color 0.2s ease;
  position: relative;
}

.promo-step:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.18);
}

.promo-step__index {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(106, 215, 255, 0.14);
  font-weight: 800;
}

.promo-step__icon {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 20px;
}

.promo-note {
  margin-top: 20px;
  padding: 16px;
  border-radius: 14px;
  border: 1px dashed rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;
  display: grid;
  gap: 6px;
}

.promo-note__title {
  font-weight: 700;
  color: #e5e7eb;
}

.promo-cta {
  margin-top: 32px;
}

.promo-cta__content {
  border-radius: 20px;
  padding: 22px;
  background: linear-gradient(135deg, rgba(106, 215, 255, 0.12), rgba(252, 166, 61, 0.1));
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.small {
  font-size: 13px;
}

@media (max-width: 720px) {
  .promo-hero {
    padding: 22px;
  }

  .promo-card__head {
    flex-direction: column;
  }
}

@media (max-width: 540px) {
  .promo-hero {
    grid-template-columns: 1fr;
  }

  .promo-hero__stats {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .promo-card__footer {
    align-items: flex-start;
  }
}
</style>
