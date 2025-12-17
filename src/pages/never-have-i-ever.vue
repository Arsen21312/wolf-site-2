<template>
  <div class="nhi-page">
    <NeverHaveIEver />

    <div class="seo-actions">
      <button class="seo-reveal-btn" type="button" @click="revealSeo">Показать описание</button>
    </div>
    <div ref="seoTrigger" class="seo-trigger" aria-hidden="true"></div>

    <div class="seo-lazy" :class="{ 'seo-visible': seoVisible }">
      <section id="seo" class="seo-section">
      <div class="seo-card">
        <div class="seo-content seo-grid">
          <div class="seo-quick">
            <p class="seo-kicker">Я никогда не — онлайн</p>
            <h2>Я никогда не — онлайн, правила и идеи</h2>
            <p class="seo-lead">
              Быстрый гид по игре: готовые фразы, лёгкий запуск и темы, которые раскрывают компанию за пару минут.
            </p>

            <div class="seo-block">
              <h3>Быстрый старт</h3>
              <ol class="seo-list quick-list">
                <li>Нажми «Играть онлайн».</li>
                <li>Выбери категорию или оставь случайный выбор.</li>
                <li>Читай утверждение, говори «делал/не делал».</li>
                <li>Если играете на пальцы — опускайте палец при совпадении.</li>
                <li>Можно добавить глоток напитка для честных признаний.</li>
              </ol>
            </div>

            <div class="seo-block">
              <h3>Для кого</h3>
              <div class="seo-chips">
                <span class="seo-chip">Для компании</span>
                <span class="seo-chip">Для пары</span>
                <span class="seo-chip">Для знакомства</span>
              </div>
            </div>

            <div class="seo-block">
              <h3>Темы и режимы</h3>
              <ul class="seo-list mode-list">
                <li>Лайт — мягкие и забавные признания.</li>
                <li>Семейное — вопросы про близких и традиции.</li>
                <li>Экстрим — истории на смелость.</li>
                <li>Отношения — для пары и свиданий.</li>
                <li>Вечеринка — случайные категории для хаоса.</li>
              </ul>
            </div>
          </div>

          <div class="seo-details">
            <div class="seo-toggle">
              <button class="seo-btn" type="button" @click="showSeoDetails = !showSeoDetails">
                {{ showSeoDetails ? 'Скрыть подробности' : 'Показать подробнее' }}
              </button>
              <a class="seo-link" href="#seo" @click.prevent="showSeoDetails = true">Почитать правила</a>
            </div>

            <div class="seo-accordion" v-show="showSeoDetails">
              <p>
                «Я никогда не» онлайн — быстрый ледокол. Утверждение читает один игрок, остальные признаются, делали ли это.
                Без карточек и подготовки: выбираешь тему, жмёшь старт и сразу слышишь истории. Формат подходит и для шумной
                компании, и для пары.
              </p>
              <p>
                Честность важна, но комфорт важнее: убирайте темы, которые не заходят, и переключайте категории, если хочется
                сменить тон. Можно играть «на пальцы», на очки или на глоток — правила гибкие.
              </p>
              <p>
                Чтобы не застревать, оставьте кнопку «случайно» под рукой. Она подкинет новое утверждение и освежит разговор.
                Игра держит баланс между юмором и откровенностью, поэтому хорошо заходит и на вечеринке, и на свидании.
              </p>

              <h3>Правила безопасности</h3>
              <ul class="seo-list safety-list">
                <li>Сразу обсудите стоп-темы, уважайте «нет».</li>
                <li>Не шеймьте ответы — цель в доверии и смехе.</li>
                <li>Давайте право пропускать ход без объяснений.</li>
                <li>Меняйте тему или темп, если кто-то устал.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import NeverHaveIEver from '@/components/games/NeverHaveIEver/NeverHaveIEver.vue'

const showSeoDetails = ref(false)
const seoVisible = ref(false)
const seoTrigger = ref(null)
let seoObserver = null

const revealSeo = () => {
  if (seoVisible.value) return
  seoVisible.value = true
  if (seoObserver) {
    seoObserver.disconnect()
    seoObserver = null
  }
  window.removeEventListener('scroll', handleScroll)
}

const handleScroll = () => {
  if (window.scrollY > 20) {
    revealSeo()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  if (seoTrigger.value && 'IntersectionObserver' in window) {
    seoObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          revealSeo()
        }
      },
      { rootMargin: '0px 0px -40% 0px' }
    )
    seoObserver.observe(seoTrigger.value)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  if (seoObserver) {
    seoObserver.disconnect()
  }
})
</script>

<style scoped>
.nhi-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.seo-section {
  padding: 48px 0 64px;
}

.seo-card {
  max-width: 1080px;
  margin: 0 auto;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.25);
}

.seo-content {
  color: #e5e7eb;
  line-height: 1.7;
  display: grid;
  gap: 18px;
}

.seo-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 22px;
}

.seo-quick,
.seo-details {
  display: grid;
  gap: 18px;
}

.seo-block {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 14px 16px;
  display: grid;
  gap: 10px;
}

.seo-kicker {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
  color: #93c5fd;
  font-weight: 700;
  margin: 0;
}

.seo-lead {
  margin: 0;
  color: #cbd5f5;
}

.seo-content h2 {
  margin: 0;
  font-size: 26px;
  line-height: 1.3;
}

.seo-content h3 {
  margin: 0;
  font-size: 18px;
  line-height: 1.35;
  color: #e0e7ff;
}

.seo-content p {
  margin: 0;
  color: #cbd5f5;
}

.seo-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.seo-chip {
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  color: #e5e7eb;
}

.seo-list {
  margin: 0;
  padding-left: 18px;
  color: #cbd5f5;
  display: grid;
  gap: 6px;
}

.quick-list {
  padding-left: 20px;
}

.mode-list {
  padding-left: 18px;
}

.safety-list {
  padding-left: 18px;
}

.seo-details {
  align-content: start;
}

.seo-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.seo-btn {
  border: none;
  border-radius: 999px;
  background: linear-gradient(120deg, #38bdf8, #a855f7);
  color: #0b1220;
  font-weight: 800;
  padding: 12px 18px;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(168, 85, 247, 0.25);
  transition: transform 0.12s ease, box-shadow 0.2s ease;
}

.seo-btn:hover {
  transform: translateY(-1px);
}

.seo-btn:active {
  transform: translateY(0);
}

.seo-link {
  color: #93c5fd;
  font-weight: 700;
  text-decoration: none;
}

.seo-link:hover {
  text-decoration: underline;
}

.seo-accordion {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px 18px;
  display: grid;
  gap: 12px;
}

.seo-actions {
  display: flex;
  justify-content: center;
}

.seo-reveal-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e5e7eb;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.seo-reveal-btn:hover {
  border-color: rgba(255, 255, 255, 0.35);
  color: #fff;
}

.seo-trigger {
  width: 100%;
  height: 1px;
}

.seo-lazy {
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  pointer-events: none;
  transition: opacity 0.25s ease, max-height 0.25s ease;
}

.seo-visible {
  opacity: 1;
  max-height: 9999px;
  pointer-events: auto;
}

@media (max-width: 768px) {
  .seo-section {
    padding: 32px 0 48px;
  }

  .seo-card {
    padding: 22px 16px;
  }

  .seo-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .seo-content h2 {
    font-size: 22px;
  }
}
</style>
