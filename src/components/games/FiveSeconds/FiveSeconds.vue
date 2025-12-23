<template>
  <section class="fs-shell" :class="{ 'fs-started': gameStarted }">
    <div class="fs-content" v-if="!gameStarted">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Ответь за 5 секунд</h1>
      <p class="fs-sub">3 ответа, 5 секунд, бесконечный хаос</p>
      <button class="fs-cta" @click="startGame">
        <span class="fs-cta-icon">▶</span>
        Начать игру
      </button>
    </div>
    <div class="fs-content fs-game" v-else>
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <div class="fs-filters">
        <button
          v-for="c in categories"
          :key="c.id"
          class="fs-chip"
          :class="{ 'fs-chip-active': activeCategory === c.id }"
          @click="() => setCategory(c.id)"
        >
          <span class="fs-chip-icon">{{ c.icon }}</span>
          {{ c.label }}
        </button>
      </div>
      <div class="fs-filters-mobile">
        <button class="fs-chip fs-chip-primary" type="button" @click="toggleCategories">
          <span v-if="selectedCategoryIcon" class="fs-chip-icon">{{ selectedCategoryIcon }}</span>
          {{ selectedCategoryLabel }}
        </button>
        <div class="fs-filters-extra" :class="{ open: showCategories }">
          <button
            v-for="c in mobileCategories"
            :key="c.id"
            class="fs-chip"
            type="button"
            @click="handleCategorySelect(c.id)"
          >
            <span v-if="c.icon" class="fs-chip-icon">{{ c.icon }}</span>
            {{ c.label }}
          </button>
        </div>
      </div>

      <div class="fs-card">
        <div class="fs-label">{{ currentLabel }}</div>
        <div class="fs-prompt">{{ currentPrompt }}</div>
        <div class="fs-timer">
          <svg viewBox="0 0 120 120" class="fs-ring">
            <circle class="fs-ring-bg" cx="60" cy="60" r="52" />
            <circle
              class="fs-ring-progress"
              cx="60"
              cy="60"
              r="52"
              :style="ringStyle"
            />
            <text x="60" y="66" text-anchor="middle" class="fs-timer-text">{{ displayTime }}</text>
          </svg>
        </div>
        <div class="fs-hint">Назовите три подходящих ответа</div>
      </div>

      <div class="fs-actions">
        <button class="fs-next" @click="nextPrompt">Далее</button>
      </div>
    </div>
  </section>
  <SocialPopup :visible="showPopup" :payload="popupPayload" @close="handlePopupClose" />
</template>

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue';
import { computed, onBeforeUnmount, ref } from 'vue';
import SocialPopup from '@/components/ui/SocialPopup.vue';

const categories = [
  { id: 'popular', label: 'Популярное', icon: '🥤' },
  { id: 'family', label: 'Для пар', icon: '💜' },
  { id: 'extreme', label: 'Экстрим', icon: '🔥' },
  { id: 'nsfw', label: 'Пошлое', icon: '🔞' }
];

const prompts = [
  // Популярное
  { text: 'Назовите три вида молочных продуктов', category: 'popular' },
  { text: 'Назовите три социальных сети', category: 'popular' },
  { text: 'Назовите три фрукта жёлтого цвета', category: 'popular' },
  { text: 'Назовите три вида спорта с мячом', category: 'popular' },
  { text: 'Назовите три популярных сериала', category: 'popular' },
  { text: 'Назовите три вида кофе', category: 'popular' },
  { text: 'Назовите три музыкальных инструмента', category: 'popular' },
  { text: 'Назовите три кино-жанра', category: 'popular' },
  { text: 'Назовите три вида хлеба', category: 'popular' },
  { text: 'Назовите три овоща', category: 'popular' },

  // Для семейных пар
  { text: 'Назовите три домашних занятия, которые вы любите вместе', category: 'family' },
  { text: 'Назовите три любимых блюда вашей семьи', category: 'family' },
  { text: 'Назовите три семейные традиции', category: 'family' },
  { text: 'Назовите три фильма для семейного просмотра', category: 'family' },
  { text: 'Назовите три способа провести воскресенье', category: 'family' },
  { text: 'Назовите три настольные игры, которые вы играете вместе', category: 'family' },
  { text: 'Назовите три вещи, которые делают дом уютным', category: 'family' },
  { text: 'Назовите три места для семейных прогулок', category: 'family' },
  { text: 'Назовите три десерта, которые всем нравятся', category: 'family' },
  { text: 'Назовите три любимых мультфильма', category: 'family' },

  // Экстрим
  { text: 'Назовите три экстремальных вида спорта', category: 'extreme' },
  { text: 'Назовите три места для прыжков с парашютом', category: 'extreme' },
  { text: 'Назовите три горные вершины, на которые мечтаете подняться', category: 'extreme' },
  { text: 'Назовите три водных экстремальных активности', category: 'extreme' },
  { text: 'Назовите три известных экстремала', category: 'extreme' },
  { text: 'Назовите три вида гонок', category: 'extreme' },
  { text: 'Назовите три способа испытать адреналин', category: 'extreme' },
  { text: 'Назовите три экстрим-фильма', category: 'extreme' },
  { text: 'Назовите три навыка выживания', category: 'extreme' },
  { text: 'Назовите три места для дайвинга', category: 'extreme' },

  // 18+
  { text: 'Назовите три темы, которые не обсуждают на первом свидании', category: 'nsfw' },
  { text: 'Назовите три провокационных вопроса', category: 'nsfw' },
  { text: 'Назовите три фильма 18+', category: 'nsfw' },
  { text: 'Назовите три смелых признания', category: 'nsfw' },
  { text: 'Назовите три запретные темы', category: 'nsfw' },
  { text: 'Назовите три вещи, которые держат в секрете', category: 'nsfw' },
  { text: 'Назовите три вида откровенных разговоров', category: 'nsfw' },
  { text: 'Назовите три рискованных поступка', category: 'nsfw' },
  { text: 'Назовите три забавные неловкие ситуации', category: 'nsfw' },
  { text: 'Назовите три популярные истории скандалов', category: 'nsfw' }
];

const duration = 5;

const gameStarted = ref(false);
const timer = ref(duration);
const activeCategory = ref('popular');
const randomCategory = { id: 'random', label: 'Случайно' };
const currentCategoryForPrompt = ref(activeCategory.value);
const showCategories = ref(false);
const currentPromptIndex = ref(0);
const intervalId = ref(null);
const timeUp = ref(false);
const promptsSeen = ref(0);
const showPopup = ref(false);
const popupIndex = ref(0);

const socials = [
  {
    title: 'Подпишись на Telegram',
    text: 'Куча мемов, всё самое свежее тут',
    cta: 'Перейти в логово',
    link: 'https://t.me/neural_wise_wolf',
    emoji: '✉️'
  },
  {
    title: 'TikTok Волка',
    text: 'Мемы, стримы и много волков',
    cta: 'Смотреть TikTok',
    link: 'https://www.tiktok.com/@neural_wolf',
    emoji: '🎬'
  },
  {
    title: 'YouTube канал',
    text: 'Шортсы и длинные видосы с волками',
    cta: 'Открыть YouTube',
    link: 'https://www.youtube.com/@neural_wolf',
    emoji: '▶️'
  },
  {
    title: 'Залетай в Instagram',
    text: 'Самое первое и большое сообщество, много мемов с волками',
    cta: 'Открыть Instagram',
    link: 'https://instagram.com/neural_wise_wolf/',
    emoji: '📸'
  }
];

const popupPayload = computed(() => socials[popupIndex.value % socials.length]);

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Ответь за 5 секунд' }
];


const filteredPrompts = computed(() =>
  prompts.filter((p) => p.category === currentCategoryForPrompt.value)
);

const currentPrompt = computed(() => {
  if (timeUp.value) return 'Веремя вышло...';
  const list = filteredPrompts.value;
  return list.length ? list[currentPromptIndex.value % list.length].text : 'Время вышло...';
});

const currentLabel = computed(() => {
  const c = categories.find((item) => item.id === currentCategoryForPrompt.value);
  return c ? c.label : '';
});

const mobileCategories = computed(() => {
  const selectedId = activeCategory.value || randomCategory.id;
  return [randomCategory, ...categories].filter((c) => c.id !== selectedId);
});

const selectedCategoryLabel = computed(() => {
  if (activeCategory.value === randomCategory.id) return randomCategory.label;
  const c = categories.find((item) => item.id === activeCategory.value);
  return c ? c.label : '';
});

const selectedCategoryIcon = computed(() => {
  if (activeCategory.value === randomCategory.id) return '';
  const c = categories.find((item) => item.id === activeCategory.value);
  return c?.icon || '';
});

function pickCategoryForPrompt() {
  if (activeCategory.value !== randomCategory.id) return activeCategory.value;
  const idx = Math.floor(Math.random() * categories.length);
  return categories[idx]?.id || categories[0]?.id || 'popular';
}

const displayTime = computed(() => Math.max(0, Math.ceil(timer.value)));
const ringStyle = computed(() => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, timer.value) / duration;
  return {
    strokeDasharray: `${circumference}px`,
    strokeDashoffset: `${circumference * (1 - progress)}px`
  };
});

function startTimer() {
  timeUp.value = false;
  timer.value = duration;
  clearInterval(intervalId.value);
  intervalId.value = setInterval(() => {
    timer.value -= 0.1;
    if (timer.value <= 0) {
      timer.value = 0;
      clearInterval(intervalId.value);
      timeUp.value = true;
    }
  }, 100);
}

function pickPrompt() {
  const categoryForPrompt = pickCategoryForPrompt();
  currentCategoryForPrompt.value = categoryForPrompt;
  const list = prompts.filter((p) => p.category === categoryForPrompt);
  if (!list.length) return;
  currentPromptIndex.value = Math.floor(Math.random() * list.length);
}

function startGame() {
  gameStarted.value = true;
  pickPrompt();
  startTimer();
}

function nextPrompt() {
  pickPrompt();
  startTimer();
  promptsSeen.value += 1;
  if (promptsSeen.value % 5 === 0) {
    showPopup.value = true;
  }
}

function setCategory(cat) {
  activeCategory.value = cat;
  pickPrompt();
  startTimer();
}

function handleCategorySelect(cat) {
  setCategory(cat);
  showCategories.value = false;
}

function toggleCategories() {
  showCategories.value = !showCategories.value;
}

onBeforeUnmount(() => clearInterval(intervalId.value));
function handlePopupClose() {
  showPopup.value = false;
  popupIndex.value = (popupIndex.value + 1) % socials.length;
}
</script>

<style scoped>
.fs-shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(8px, 2.2vw, 18px);
  color: #e5e7eb;
  text-align: center;
  box-sizing: border-box;
}

.fs-content {
  position: relative;
  z-index: 1;
  width: min(1100px, 100%);
  display: grid;
  gap: clamp(16px, 3vw, 24px);
  justify-items: center;
  padding: clamp(16px, 3vw, 28px) clamp(12px, 3vw, 24px) clamp(14px, 3vw, 26px);
  margin: 0 auto;
  align-content: center;
}

.fs-content:not(.fs-game) {
  max-width: 900px;
  margin: 0 auto;
  min-height: clamp(70vh, 90vw, 80vh);
  align-content: center;
}

.fs-content.fs-game {
  gap: clamp(14px, 2.6vw, 24px);
  justify-items: center;
  align-items: center;
  min-height: 70vh;
  padding: clamp(8px, 1.6vw, 16px) 0 clamp(12px, 2.4vw, 20px);
  margin-top: 0;
  width: 100%;
}

.fs-shell h1 {
  margin: 0 0 6px;
  font-size: clamp(34px, 7vw, 64px);
  letter-spacing: 0;
  color: #e5e7eb;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
  line-height: 1.05;
}

.fs-sub {
  margin: 6px 0 14px;
  color: #cbd5e1;
  font-size: clamp(15px, 2vw, 18px);
  line-height: 1.55;
  max-width: 760px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.fs-cta {
  margin: 8px auto 10px;
  padding: clamp(14px, 2.4vw, 18px) clamp(20px, 3vw, 28px);
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: clamp(15px, 2vw, 18px);
  background: linear-gradient(120deg, #38bdf8, #a855f7);
  color: #0b1220;
  box-shadow: 0 15px 30px rgba(56, 189, 248, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.fs-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 44px rgba(56, 189, 248, 0.35);
}

.fs-cta:active {
  transform: translateY(0);
}

.fs-cta-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: #38bdf8;
  font-size: 14px;
}

.fs-filters {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(8px, 2vw, 14px);
  justify-content: center;
  margin-bottom: 8px;
  width: 100%;
}

.fs-filters-mobile {
  display: none;
  width: 100%;
  margin: 0 auto;
  gap: 10px;
  justify-items: center;
}

.fs-chip {
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: clamp(10px, 2vw, 14px) clamp(14px, 3vw, 18px);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;
  font-weight: 800;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex: 1 1 clamp(140px, 28%, 220px);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  font-size: clamp(14px, 1.8vw, 16px);
}

.fs-chip-primary {
  animation: fs-pulse 5s ease-in-out infinite;
  width: 100%;
  max-width: 200px;
  flex: 0 0 auto;
  align-self: center;
  box-sizing: border-box;
}

.fs-filters-extra {
  display: grid;
  gap: 10px;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease;
  justify-items: center;
}

.fs-filters-extra.open {
  max-height: 420px;
  opacity: 1;
}

.fs-chip-active {
  background: linear-gradient(120deg, rgba(56, 189, 248, 0.25), rgba(168, 85, 247, 0.25));
  border-color: rgba(168, 85, 247, 0.5);
  color: #e5e7eb;
}

.fs-chip-icon {
  font-size: 16px;
}

.fs-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: clamp(20px, 3vw, 30px);
  display: grid;
  gap: clamp(12px, 2vw, 20px);
  position: relative;
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  min-height: clamp(280px, 46vh, 380px);
  margin: 0 auto;
  box-shadow: none;
}

.fs-card::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 60%);
  right: -60px;
  bottom: -80px;
  pointer-events: none;
}

.fs-label {
  font-size: 15px;
  color: #94a3b8;
  letter-spacing: 0.08em;
  text-transform: lowercase;
  display: flex;
  gap: 6px;
  justify-content: center;
}

.fs-prompt {
  font-size: clamp(24px, 5vw, 34px);
  font-weight: 700;
  line-height: 1.4;
  color: #e5e7eb;
  margin: 0;
  text-align: center;
  min-height: clamp(130px, 30vh, 200px);
  display: grid;
  place-items: center;
}

.fs-timer {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.fs-ring {
  width: 120px;
  height: 120px;
}

.fs-ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.15);
  stroke-width: 8;
}

.fs-ring-progress {
  fill: none;
  stroke: #38bdf8;
  stroke-width: 8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
}

.fs-timer-text {
  fill: #e5e7eb;
  font-size: 28px;
  font-weight: 800;
}

.fs-hint {
  color: #cbd5e1;
  font-size: 14px;
  margin-top: 6px;
  text-align: center;
  opacity: 0.9;
}

.fs-actions {
  display: grid;
  gap: 10px;
  justify-items: center;
  margin-top: 8px;
}

.fs-next {
  padding: clamp(12px, 2vw, 16px) clamp(18px, 3vw, 28px);
  border-radius: 999px;
  border: none;
  background: linear-gradient(120deg, #38bdf8, #a855f7);
  color: #0b1220;
  font-weight: 800;
  font-size: clamp(16px, 2vw, 18px);
  cursor: pointer;
  box-shadow: 0 14px 28px rgba(56, 189, 248, 0.25);
  transition: transform 0.12s ease, box-shadow 0.2s ease;
}

.fs-next:hover {
  transform: translateY(-2px);
}

.fs-next:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .fs-shell {
    align-items: flex-start;
    padding: 8px 14px 14px;
  }

  .fs-content {
    padding: 8px 12px 12px;
  }

  .fs-content:not(.fs-game) {
    margin-top: 0;
  }

  .fs-chip {
    width: 100%;
    justify-content: center;
  }

  .fs-filters {
    display: none;
  }

  .fs-filters-mobile {
    display: grid;
  }

  .fs-shell h1 {
    font-size: clamp(30px, 9vw, 46px);
    line-height: 1.08;
  }

  .fs-sub {
    max-width: 92%;
    font-size: 15px;
  }

  .fs-card {
    margin-top: 0;
    min-height: 260px;
    padding: 18px 14px;
  }

  .fs-prompt {
    font-size: clamp(20px, 6vw, 26px);
    min-height: 120px;
  }

  .fs-btn {
    width: 100%;
  }
}

@keyframes fs-pulse {
  0%,
  88%,
  100% {
    transform: translateY(0);
  }
  92% {
    transform: translateY(-2px);
  }
  96% {
    transform: translateY(1px);
  }
}
</style>
