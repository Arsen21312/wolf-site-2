<template>
  <section class="tod-page">
    <div class="tod-container">
      <div v-if="!started" class="tod-intro">
        <h1 class="tod-title">Никнейм или волчье имя</h1>
        <p class="tod-subtitle">Введи имя или слово — сгенерим несколько вариантов ников без кринжа.</p>
        <div class="tod-form">
          <input v-model="base" type="text" placeholder="Твоё имя или слово" />
          <button class="tod-btn tod-btn-primary" @click="generate">Дать варианты</button>
        </div>
        <p class="tod-hint">Сразу выдадим подборку из пяти вариантов.</p>
      </div>

      <div v-else class="tod-game">
        <div class="tod-card">
          <div class="tod-label">подборка ников</div>
          <ul class="nick-list">
            <li v-for="nick in nicknames" :key="nick">{{ nick }}</li>
          </ul>
        </div>

        <div class="tod-actions">
          <div class="tod-buttons">
            <button class="tod-btn tod-btn-ghost" @click="generate">Ещё варианты</button>
          </div>
          <div class="tod-form-inline">
            <input v-model="base" type="text" placeholder="Сменить базу (имя / слово)" />
            <button class="tod-btn" @click="generate">Обновить</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SEO SECTION -->
  <section class="seo-section" aria-label="SEO текст">
    <div class="seo-container">
      <h2 class="seo-title">Генератор никнеймов онлайн, волчьи имена без кринжа</h2>
      <p class="seo-lead">
        Ник нужен быстро, но так, чтобы звучал как легенда, а не как пароль от вайфая
        Введи имя или любое слово и получи подборку вариантов, для игр, соцсетей, Telegram и где угодно
      </p>

      <div class="seo-grid">
        <article class="seo-card">
          <h3>Как работает генератор</h3>
          <p>
            Ты вводишь основу, имя, прозвище, любимое слово, название города
            Алгоритм собирает ник из волчьих частей и выдаёт пять вариантов, можно жать «Ещё варианты» сколько угодно
          </p>
        </article>

        <article class="seo-card">
          <h3>Кому подходит</h3>
          <p>
            Для геймеров, стримеров, Discord серверов, Instagram, TikTok, Telegram, и даже для рабочей учётки
            Если хочешь ник в стиле стаи, но аккуратно, без токсика и без школьных цифр на хвосте
          </p>
        </article>

        <article class="seo-card">
          <h3>Идеи для базы</h3>
          <ul>
            <li>Твоё имя, фамилия или сокращение</li>
            <li>Хобби, город, любимая еда</li>
            <li>Короткое слово на русском или английском</li>
            <li>Ник из старой игры, чтобы обновить стиль</li>
          </ul>
        </article>
      </div>

      <div class="seo-text">
        <h3>Никнейм или волчье имя, в чём разница</h3>
        <p>
          Никнейм, это твой ярлык в сети, короткий и узнаваемый
          Волчье имя, это ник с характером, будто у него есть история, привычки и свой маршрут по ночному городу
          Тут генератор даёт оба вайба, хочешь строго, хочешь мемно, хочешь почти как кличка в стае
        </p>

        <h3>Ники для игр и социальных сетей</h3>
        <p>
          В играх ник работает как аватар, по нему тебя запоминают ещё до первого фрага
          В соцсетях ник задаёт тон профилю, серьёзный ты или постирония на максималках
          Поэтому лучше один раз собрать хороший вариант и жить красиво, чем менять каждую неделю
        </p>
      </div>

      <div class="seo-faq">
        <h3 class="seo-faq-title">Мини FAQ</h3>

        <details class="seo-faq-item">
          <summary>Можно без слова, просто получить варианты</summary>
          <p>Да, оставь поле пустым и генератор выдаст ники на чистом волчьем характере</p>
        </details>

        <details class="seo-faq-item">
          <summary>Ники повторяются</summary>
          <p>Подряд повторы минимизируем, жми «Ещё варианты» и быстро найдёшь свой стиль</p>
        </details>

        <details class="seo-faq-item">
          <summary>Можно сделать ник короче</summary>
          <p>Да, введи короткую базу, типа 3–5 букв, или используй сокращение имени</p>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { nickParts } from '@/data/nicknames'

const started = ref(false)
const base = ref('')
const nicknames = ref([])
const lastSeed = ref('')

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function buildNick(raw) {
  const adj = randomItem(nickParts.adjectives)
  const animal = randomItem(nickParts.animals)
  const suffix = randomItem(nickParts.suffixes)
  const trimmedBase = raw.trim()
  const core = trimmedBase ? `${adj} ${animal} ${trimmedBase}` : `${adj} ${animal}`
  return suffix ? `${core} ${suffix}` : core
}

function generate() {
  started.value = true
  const seed = base.value || ''
  const set = new Set()
  let attempts = 0
  while (set.size < 5 && attempts < 40) {
    set.add(buildNick(seed))
    attempts += 1
  }
  nicknames.value = Array.from(set).slice(0, 5)
  lastSeed.value = seed
}
</script>

<style scoped>
.tod-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: clamp(14px, 3vw, 28px);
  background: transparent;
  color: #e5e7eb;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.tod-container {
  width: min(1100px, 100%);
  background: transparent;
  border: none;
  border-radius: 0;
  padding: clamp(16px, 3vw, 32px) clamp(12px, 3vw, 26px);
  box-shadow: none;
  display: grid;
  justify-items: center;
  gap: clamp(16px, 3vw, 28px);
  margin: 0 auto;
}

.tod-intro {
  text-align: center;
  display: grid;
  gap: clamp(16px, 4vw, 26px);
  justify-items: center;
  align-items: center;
  padding: clamp(20px, 5vw, 48px) 0 clamp(12px, 3vw, 28px);
  max-width: 900px;
  margin: 0 auto;
}

.tod-title {
  margin: 0 0 6px;
  font-size: clamp(32px, 7vw, 60px);
  letter-spacing: 0;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
  line-height: 1.05;
}

.tod-subtitle {
  margin: 0 0 12px;
  color: #cbd5e1;
  max-width: min(680px, 100%);
  line-height: 1.6;
  font-size: clamp(15px, 2vw, 18px);
  text-align: center;
}

.tod-hint {
  margin: 4px 0 0;
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
}

.tod-form {
  display: grid;
  gap: 10px;
  width: min(480px, 100%);
}

.tod-form-inline {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  width: min(600px, 100%);
}

input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  padding: 12px 14px;
  color: #e5e7eb;
  font-size: 16px;
  outline: none;
}

.tod-btn {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: #e5e7eb;
  border-radius: 999px;
  padding: clamp(12px, 2vw, 16px) clamp(18px, 3vw, 24px);
  font-weight: 800;
  font-size: clamp(15px, 2vw, 17px);
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.2s ease, background 0.2s ease, border 0.2s ease;
}

.tod-btn:hover {
  transform: translateY(-1px);
}

.tod-btn:active {
  transform: translateY(0);
}

.tod-btn-primary {
  background: linear-gradient(120deg, #38bdf8, #a855f7);
  border: none;
  color: #0b1220;
  box-shadow: 0 15px 30px rgba(56, 189, 248, 0.25);
  padding: clamp(14px, 2.6vw, 18px) clamp(22px, 3vw, 28px);
  font-size: clamp(16px, 2vw, 18px);
  position: relative;
  overflow: hidden;
  isolation: isolate;
  margin: 8px auto 6px;
  display: inline-flex;
  justify-content: center;
}

.tod-game {
  display: grid;
  gap: clamp(18px, 3vw, 30px);
  justify-items: center;
  align-items: center;
  min-height: 70vh;
  padding: clamp(12px, 2vw, 24px) 0 clamp(18px, 3vw, 32px);
  margin-top: 0;
  width: 100%;
}

.tod-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: clamp(20px, 3vw, 32px);
  display: grid;
  gap: clamp(12px, 2vw, 20px);
  position: relative;
  overflow: hidden;
  max-width: min(900px, 100%);
  margin: 0 auto 0;
}

.tod-card::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 60%);
  right: -60px;
  bottom: -80px;
  pointer-events: none;
}

.tod-label {
  font-size: 15px;
  text-transform: lowercase;
  color: #94a3b8;
  letter-spacing: 0.08em;
  display: flex;
  gap: 6px;
  justify-content: center;
}

.nick-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.nick-list li {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 800;
  font-size: 18px;
  color: #e5e7eb;
}

.tod-actions {
  display: grid;
  gap: clamp(10px, 2vw, 16px);
  justify-items: center;
  width: 100%;
}

.tod-buttons {
  display: flex;
  gap: clamp(8px, 1.6vw, 14px);
  flex-wrap: wrap;
  justify-content: center;
}

.tod-btn-ghost {
  background: rgba(255, 255, 255, 0.04);
}

@media (max-width: 768px) {
  .tod-page {
    align-items: flex-start;
    min-height: 100vh;
    padding: 10px 14px 18px;
  }

  .tod-container {
    padding: 6px 12px 12px;
  }

  .tod-intro {
    gap: 14px;
    padding: 10px 0 14px;
    margin-top: 0;
  }
  .tod-game {
    margin-top: 0;
  }

  .tod-title {
    font-size: clamp(32px, 9vw, 44px);
    line-height: 1.08;
  }

  .tod-subtitle {
    max-width: 92%;
    font-size: 15px;
  }

  .tod-form-inline {
    grid-template-columns: 1fr;
  }

  .tod-btn-primary {
    padding: 12px 22px;
  }

  .tod-buttons {
    display: grid;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    justify-items: center;
    gap: 10px;
  }
}

.seo-section {
  width: 100%;
  margin-top: 28px;
  padding: clamp(54px, 6vw, 90px) clamp(16px, 4vw, 28px) clamp(70px, 7vw, 110px);
  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.seo-container {
  max-width: 1100px;
  margin: 0 auto;
  text-align: left;
  color: #cbd5e1;
  width: 100%;
  box-sizing: border-box;
}

.seo-title {
  margin: 0 0 12px;
  font-size: clamp(26px, 4vw, 34px);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #e5e7eb;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
}

.seo-lead {
  margin: 0 0 26px;
  max-width: min(880px, 100%);
  line-height: 1.75;
  color: #94a3b8;
  font-size: clamp(15px, 2vw, 16px);
}

.seo-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.seo-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 18px;
  padding: 16px 16px 14px;
}

.seo-card h3 {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 900;
  color: #e5e7eb;
}

.seo-card p {
  margin: 0;
  color: #94a3b8;
  line-height: 1.7;
  font-size: 14px;
}

.seo-card ul {
  margin: 0;
  padding-left: 18px;
  color: #94a3b8;
  line-height: 1.7;
  font-size: 14px;
}

.seo-text {
  margin-top: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 18px;
  padding: 16px;
}

.seo-text h3 {
  margin: 0 0 10px;
  font-size: 16px;
  font-weight: 900;
  color: #e5e7eb;
}

.seo-text p {
  margin: 0 0 14px;
  color: #94a3b8;
  line-height: 1.75;
  font-size: 14px;
}

.seo-text p:last-child {
  margin-bottom: 0;
}

.seo-faq {
  margin-top: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 18px;
  padding: 14px;
}

.seo-faq-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 900;
  color: #e5e7eb;
}

.seo-faq-item {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 4px;
}

.seo-faq-item:first-of-type {
  border-top: none;
}

.seo-faq-item summary {
  cursor: pointer;
  color: #e5e7eb;
  font-weight: 800;
  font-size: 14px;
}

.seo-faq-item p {
  margin: 10px 0 0;
  color: #94a3b8;
  line-height: 1.7;
  font-size: 14px;
}

@media (max-width: 900px) {
  .seo-grid {
    grid-template-columns: 1fr;
  }

  .seo-section {
    padding: clamp(48px, 6vw, 70px) clamp(14px, 4vw, 22px) clamp(60px, 7vw, 90px);
  }

  .seo-title {
    font-size: clamp(24px, 6vw, 28px);
  }
}
</style>
