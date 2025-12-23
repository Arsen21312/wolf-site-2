<template>
  <div class="crocodile-page">
    <section class="crocodile-intro">
      <div class="crocodile-intro-inner">
        <div class="crocodile-breadcrumbs">
          <NuxtLink to="/">Главная</NuxtLink>
          <span>/</span>
          <NuxtLink to="/games">Игры</NuxtLink>
          <span>/</span>
          <span>Крокодил</span>
        </div>
        <h1>Крокодил</h1>
        <h2>Генератор слов и фраз.</h2>
      </div>
    </section>

    <section class="crocodile-controls">
      <div class="crocodile-controls-inner">
        <CrocodileControls
          :difficulty="difficulty"
          :type="type"
          :adult-allowed="adultAllowed"
          @update:difficulty="difficulty = $event"
          @update:type="type = $event"
          @update:adult-allowed="adultAllowed = $event"
        />
      </div>
    </section>

    <section class="crocodile-hero">
      <div class="crocodile-hero-inner">
        <CrocodilePlay :difficulty="difficulty" :type="type" :adult-allowed="adultAllowed" />
      </div>
    </section>

    <section class="crocodile-seo">
      <div class="crocodile-seo-inner">
        <CrocodileAccordion />
      </div>
    </section>
  </div>
</template>

<script setup>
import { useHead } from '#imports'
import { onMounted, ref, watch } from 'vue'
import CrocodilePlay from '@/components/crocodile/CrocodilePlay.vue'
import CrocodileAccordion from '@/components/crocodile/CrocodileAccordion.vue'
import CrocodileControls from '@/components/crocodile/CrocodileControls.vue'

const STORAGE_FILTERS_KEY = 'crocodile_filters'

const difficulty = ref(2)
const type = ref('all')
const adultAllowed = ref(false)

const loadFilters = () => {
  if (!process.client) return
  const raw = localStorage.getItem(STORAGE_FILTERS_KEY)
  if (!raw) return
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.difficulty) difficulty.value = Number(parsed.difficulty)
    if (parsed?.type) type.value = parsed.type
    if (typeof parsed?.adultAllowed === 'boolean') adultAllowed.value = parsed.adultAllowed
  } catch (error) {
    console.warn('[crocodile] failed to parse filters', error)
  }
}

const persistFilters = () => {
  if (!process.client) return
  localStorage.setItem(
    STORAGE_FILTERS_KEY,
    JSON.stringify({
      difficulty: difficulty.value,
      type: type.value,
      adultAllowed: adultAllowed.value
    })
  )
}

useHead({
  title: 'Крокодил онлайн - генератор слов и фраз',
  meta: [
    {
      name: 'description',
      content:
        'Крокодил онлайн: генератор слов и фраз с уровнями сложности, 18+ фильтром и живой статистикой.'
    }
  ]
})

watch([difficulty, type, adultAllowed], persistFilters)

onMounted(() => {
  loadFilters()
})
</script>

<style scoped>
.crocodile-page {
  min-height: 100vh;
  background: transparent;
  color: #e5e7eb;
  font-family: inherit;
}

.crocodile-intro {
  padding: clamp(24px, 4vw, 48px) clamp(16px, 4vw, 48px) 0;
}

.crocodile-intro-inner {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  gap: 10px;
  text-align: center;
  justify-items: center;
}

.crocodile-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #94a3b8;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(10, 14, 18, 0.7);
}

.crocodile-breadcrumbs a {
  color: inherit;
  text-decoration: none;
}

.crocodile-intro h1 {
  margin: 0;
  font-size: clamp(52px, 8vw, 72px);
}

.crocodile-intro h2 {
  margin: 0;
  font-size: clamp(16px, 2.4vw, 20px);
  font-weight: 500;
  color: #cbd5cb;
}

.crocodile-controls {
  padding: 8px clamp(16px, 4vw, 48px) 0;
}

.crocodile-controls-inner {
  max-width: 1080px;
  margin: 0 auto;
  display: grid;
  justify-items: center;
}

.crocodile-hero {
  padding: clamp(10px, 2vw, 24px) clamp(16px, 4vw, 48px) clamp(20px, 4vw, 48px);
}

.crocodile-hero-inner {
  max-width: 1080px;
  margin: 0 auto;
}

.crocodile-seo {
  padding: 0 clamp(16px, 4vw, 48px) clamp(36px, 6vw, 72px);
}

.crocodile-seo-inner {
  max-width: 1080px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .crocodile-hero {
    padding-top: 16px;
  }
}
</style>
