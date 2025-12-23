<template>
  <section class="tod-page">
    <div class="tod-container">
      <div v-if="showIntro" class="tod-intro">
        <Breadcrumbs class="center" :items="breadcrumbs" />
        <h1 class="tod-title">Правда или действие</h1>
        <p class="tod-subtitle">
          Классическая игра для вечеринок, свиданий и долгих разговоров. Нейронный Волк задаёт вопросы за вас.
        </p>
        <button class="tod-btn tod-btn-primary" @click="startGame">Играть онлайн</button>
        <p class="tod-hint">Нажмите, чтобы сразу перейти к первому вопросу</p>
      </div>

      <div v-else class="tod-game">
        <Breadcrumbs class="center" :items="breadcrumbs" />
        <div class="tod-modes">
          <button
            v-for="m in modes"
            :key="m.id"
            class="tod-chip"
            :class="{ 'tod-chip-active': mode === m.id }"
            @click="() => { mode = m.id; askRandom(); }"
          >
            {{ m.label }}
          </button>
        </div>
        <div class="tod-modes-mobile">
          <button class="tod-chip tod-chip-primary" type="button" @click="toggleModes">
            {{ selectedModeLabel }}
          </button>
          <div class="tod-modes-extra" :class="{ open: showModes }">
            <button
              v-for="m in mobileModes"
              :key="m.id"
              class="tod-chip"
              type="button"
              :class="{ 'tod-chip-active': mode === m.id }"
              @click="handleModeSelect(m.id)"
            >
              {{ m.label }}
            </button>
          </div>
        </div>

        <div class="tod-card">
          <div class="tod-label">
            <span>{{ currentType === 'truth' ? 'правда' : 'действие' }}</span>,
            <span>{{ currentModeLabel }}</span>
          </div>
          <div class="tod-question-text" :class="{ 'tod-question-animate': isAnimating }">
            {{ currentQuestion }}
          </div>
          <p class="tod-wolf-hint">
            подсказка от волка:
            <span class="tod-wolf-hint-strong">{{ currentHint }}</span>
          </p>
        </div>

        <div class="tod-actions">
          <div class="tod-buttons">
            <button class="tod-btn tod-btn-truth" @click="askTruth">Правда</button>
            <button class="tod-btn tod-btn-ghost" @click="askRandom">Случайно</button>
            <button class="tod-btn tod-btn-dare" @click="askDare">Действие</button>
          </div>
        </div>
      </div>
    </div>
    <SocialPopup :visible="showPopup" :payload="popupPayload" @close="handlePopupClose" />
  </section>
</template>

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue';
import { computed, ref } from 'vue';
import SocialPopup from '@/components/ui/SocialPopup.vue';
import { modes, questions } from './questions';

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Правда или действие' }
];

const showIntro = ref(true);
const mode = ref('random');
const currentType = ref('truth');
const showModes = ref(false);
const randomMode = { id: 'random', label: 'Случайно' };
const mobileModes = computed(() => [randomMode, ...modes].filter((item) => item.id !== mode.value));
const currentQuestion = ref('');
const currentHint = ref('');
const isAnimating = ref(false);
const lastIndex = ref({ truth: -1, dare: -1 });
const questionsSeen = ref(0);
const showPopup = ref(false);
const popupIndex = ref(0);
const currentModeForQuestion = ref(modes[0]?.id || 'classic');

const hints = {
  truth: [
    'Отвечай честно, волк всё равно чувствует ложь.',
    'Не бойся раскрыться — чем искренней, тем интересней.',
    'Каждый честный ответ — новый повод для разговора.'
  ],
  dare: [
    'Действуй смело, но без неприятностей.',
    'Выбирай то, что реально сделать прямо сейчас.',
    'Пусть задание радует всех, а не только волка.'
  ]
};

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

const currentModeLabel = computed(() => {
  const m = modes.find((item) => item.id === currentModeForQuestion.value);
  return m ? m.label : currentModeForQuestion.value;
});

const selectedModeLabel = computed(() => {
  if (mode.value === randomMode.id) return randomMode.label;
  const m = modes.find((item) => item.id === mode.value);
  return m ? m.label : mode.value;
});

function resetAnimation() {
  isAnimating.value = false;
  requestAnimationFrame(() => {
    isAnimating.value = true;
  });
}

function getRandomItem(list, typeKey) {
  if (!list.length) return '';
  const currentLast = lastIndex.value[typeKey];
  let idx = Math.floor(Math.random() * list.length);
  if (list.length > 1 && idx === currentLast) {
    idx = (idx + 1) % list.length;
  }
  lastIndex.value[typeKey] = idx;
  return list[idx];
}

function pickHint() {
  const pool = hints[currentType.value];
  currentHint.value = getRandomItem(pool, currentType.value);
}

function pickModeForQuestion() {
  if (mode.value !== randomMode.id) return mode.value;
  const idx = Math.floor(Math.random() * modes.length);
  return modes[idx]?.id || modes[0]?.id || 'classic';
}

function ask(type) {
  currentType.value = type;
  const effectiveMode = pickModeForQuestion();
  currentModeForQuestion.value = effectiveMode;
  const pool = questions[effectiveMode]?.[type] || [];
  currentQuestion.value = getRandomItem(pool, type);
  pickHint();
  resetAnimation();
  triggerPopup();
}

function askTruth() {
  ask('truth');
}

function askDare() {
  ask('dare');
}

function askRandom() {
  const type = Math.random() < 0.5 ? 'truth' : 'dare';
  ask(type);
}

function handleModeSelect(nextMode) {
  mode.value = nextMode;
  showModes.value = false;
  askRandom();
}

function toggleModes() {
  showModes.value = !showModes.value;
}

function startGame() {
  showIntro.value = false;
  askRandom();
}
function triggerPopup() {
  questionsSeen.value += 1;
  if (questionsSeen.value % 5 === 0) {
    showPopup.value = true;
  }
}

function handlePopupClose() {
  showPopup.value = false;
  popupIndex.value = (popupIndex.value + 1) % socials.length;
}
</script>

<style scoped>
.tod-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: clamp(8px, 2.2vw, 18px);
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
  padding: clamp(16px, 3vw, 28px) clamp(12px, 3vw, 24px) clamp(14px, 3vw, 26px);
  box-shadow: none;
  display: grid;
  justify-items: center;
  gap: clamp(12px, 3vw, 22px);
  margin: 0 auto;
  box-sizing: border-box;
}

.tod-intro {
  text-align: center;
  display: grid;
  gap: clamp(16px, 4vw, 26px);
  justify-items: center;
  align-items: center;
  align-content: center;
  padding: clamp(2px, 1.4vw, 10px) 0 clamp(8px, 2.2vw, 16px);
  max-width: 900px;
  margin: 0 auto;
  min-height: clamp(62vh, 82vw, 74vh);
}

.tod-title {
  margin: 0 0 6px;
  font-size: clamp(34px, 7vw, 64px);
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

.tod-btn {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: #e5e7eb;
  border-radius: 999px;
  padding: clamp(12px, 2vw, 16px) clamp(18px, 3vw, 28px);
  font-weight: 800;
  font-size: clamp(15px, 2vw, 18px);
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.tod-btn:hover {
  transform: translateY(-1px);
}

.tod-btn:active {
  transform: translateY(0);
}

.tod-btn-primary {
  background: linear-gradient(120deg, #38bdf8, #a855f7);
  color: #0b1220;
  border: none;
  box-shadow: 0 15px 30px rgba(56, 189, 248, 0.25);
  padding: clamp(14px, 2.6vw, 18px) clamp(22px, 3vw, 30px);
  font-size: clamp(16px, 2vw, 18px);
  position: relative;
  overflow: hidden;
  isolation: isolate;
  margin: 8px auto 10px;
  display: inline-flex;
}

.tod-game {
  display: grid;
  gap: clamp(14px, 2.6vw, 26px);
  justify-items: center;
  align-items: center;
  min-height: 70vh;
  padding: clamp(6px, 1.6vw, 14px) 0 clamp(10px, 2.4vw, 20px);
  margin-top: 0;
  width: 100%;
}

.tod-modes {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(8px, 2vw, 14px);
  justify-content: center;
  margin-bottom: 8px;
  width: 100%;
  max-width: 900px;
}

.tod-chip {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;
  border-radius: 999px;
  padding: clamp(10px, 2vw, 14px) clamp(14px, 3vw, 18px);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  font-size: clamp(14px, 1.8vw, 16px);
  font-weight: 800;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex: 0 1 auto;
  min-width: 160px;
  max-width: 220px;
}

.tod-modes-mobile {
  display: none;
  width: min(520px, 100%);
  margin: 0 auto;
  gap: 10px;
  justify-items: center;
}

.tod-chip-primary {
  animation: tod-pulse 5s ease-in-out infinite;
}

.tod-modes-extra {
  display: grid;
  gap: 10px;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease;
  justify-items: center;
}

.tod-modes-extra.open {
  max-height: 420px;
  opacity: 1;
}

@media (max-width: 980px) {
  .tod-chip {
    flex: 0 1 200px;
  }
}


.tod-chip-active {
  background: linear-gradient(120deg, rgba(56, 189, 248, 0.25), rgba(168, 85, 247, 0.25));
  border-color: rgba(168, 85, 247, 0.5);
  color: #e5e7eb;
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
  margin: 0 auto;
  min-height: clamp(240px, 42vh, 360px);
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

.tod-question-text {
  font-size: clamp(24px, 5vw, 34px);
  font-weight: 700;
  line-height: 1.4;
  transition: opacity 0.18s ease, transform 0.18s ease;
  opacity: 0.3;
  transform: translateY(4px);
  text-align: center;
  margin: 6px 0 4px;
  min-height: clamp(180px, 32vh, 240px);
  display: grid;
  align-items: center;
}

.tod-question-animate {
  opacity: 1;
  transform: translateY(0);
}

.tod-wolf-hint {
  margin: 0;
  color: #9ca3af;
  font-size: 15px;
  text-align: center;
}

.tod-wolf-hint-strong {
  color: #e5e7eb;
  margin-left: 4px;
}

.tod-actions {
  display: grid;
  gap: clamp(10px, 2vw, 14px);
  justify-items: center;
  margin-top: 8px;
}

.tod-buttons {
  display: flex;
  gap: clamp(8px, 1.6vw, 14px);
  flex-wrap: wrap;
  justify-content: center;
}

.tod-btn-truth {
  background: linear-gradient(120deg, #22c55e, #16a34a);
  border: none;
  color: #0a0f18;
  box-shadow: 0 14px 28px rgba(34, 197, 94, 0.25);
}

.tod-btn-dare {
  background: linear-gradient(120deg, #fb7185, #ec4899);
  border: none;
  color: #0a0f18;
  box-shadow: 0 14px 28px rgba(251, 113, 133, 0.25);
}

.tod-btn-ghost {
  background: rgba(255, 255, 255, 0.04);
}

@media (max-width: 768px) {
  .tod-page {
    align-items: flex-start;
    padding: 10px 14px 18px;
  }

  .tod-container {
    padding: 6px 12px 12px;
  }

  .tod-intro {
    gap: 14px;
    padding: 10px 0 14px;
    min-height: 68vh;
    margin-top: 0;
  }

  .tod-title {
    font-size: clamp(32px, 9vw, 46px);
    line-height: 1.08;
  }

  .tod-subtitle {
    max-width: 90%;
    font-size: 15px;
  }

  .tod-btn-primary {
    padding: 12px 22px;
  }

  .tod-hint {
    font-size: 12px;
  }

  .tod-buttons {
    display: grid;
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    justify-items: center;
    gap: 10px;
  }

  .tod-btn-ghost {
    order: 3;
    grid-column: 1 / -1;
    justify-self: center;
    padding-left: 18px;
    padding-right: 18px;
  }

  .tod-btn-truth {
    order: 1;
  }

  .tod-btn-dare {
    order: 2;
  }

  .tod-game {
    margin-top: 0;
  }

  .tod-card {
    margin-top: 0;
  }

  .tod-modes {
    display: none;
  }

  .tod-modes-mobile {
    display: grid;
  }
}

@media (max-width: 420px) {
  .tod-page {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    overflow-x: clip;
    padding-left: 0;
    padding-right: 0;
  }

  .tod-container {
    padding-left: 12px;
    padding-right: 12px;
  }

  .tod-chip {
    width: 100%;
    min-width: 0;
  }

  .tod-page,
  .tod-container,
  .tod-modes,
  .tod-card {
    max-width: 100%;
  }

  .tod-card {
    margin-left: 0;
    margin-right: 0;
  }
}

@keyframes tod-pulse {
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
