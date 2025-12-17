<template>
  <section class="tod-page">
    <div class="tod-container">
      <div v-if="showIntro" class="tod-intro">
        <h1 class="tod-title">Правда или действие</h1>
        <p class="tod-subtitle">
          Классическая игра для вечеринок, свиданий и долгих разговоров. Нейронный Волк задаёт вопросы за вас.
        </p>
        <button class="tod-btn tod-btn-primary" @click="startGame">Играть онлайн</button>
        <p class="tod-hint">Нажмите, чтобы сразу перейти к первому вопросу</p>
      </div>

      <div v-else class="tod-game">
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
    <SocialPopup :visible="showPopup" :payload="popupPayload" @close="showPopup = false" />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import SocialPopup from '@/components/ui/SocialPopup.vue';
import { modes, questions } from './questions';

const showIntro = ref(true);
const mode = ref('classic');
const currentType = ref('truth');
const currentQuestion = ref('');
const currentHint = ref('');
const isAnimating = ref(false);
const lastIndex = ref({ truth: -1, dare: -1 });
const questionsSeen = ref(0);
const showPopup = ref(false);
const popupIndex = ref(0);

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
    emoji: '📬'
  },
  {
    title: 'Залетай в Instagram',
    text: 'Самое первое и большое сообщество, много мемов с волками',
    cta: 'Открыть Instagram',
    link: 'https://instagram.com/neural_wise_wolf/',
    emoji: '📸'
  },
  {
    title: 'TikTok Волка',
    text: 'Мемы, стримы и много волков',
    cta: 'Смотреть TikTok',
    link: 'https://www.tiktok.com/@neural_wolf',
    emoji: '🎵'
  },
  {
    title: 'YouTube канал',
    text: 'Шортсы и длинные видосы с волками',
    cta: 'Открыть YouTube',
    link: 'https://www.youtube.com/@neural_wolf',
    emoji: '▶️'
  }
];

const popupPayload = computed(() => socials[popupIndex.value % socials.length]);

const currentModeLabel = computed(() => {
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

function ask(type) {
  currentType.value = type;
  const pool = questions[mode.value][type] || [];
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

function startGame() {
  showIntro.value = false;
  askRandom();
}
function triggerPopup() {
  questionsSeen.value += 1;
  if (questionsSeen.value % 5 === 0) {
    popupIndex.value += 1;
    showPopup.value = true;
  }
}
</script>

<style scoped>
.tod-page {
  
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 24px 28px;
  background: transparent;
  color: #e5e7eb;
  text-align: center;
}

.tod-container {
  width: 100%;
  max-width: 1080px;
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 24px 16px 20px;
  box-shadow: none;
  display: grid;
  justify-items: center;
}

.tod-intro {
  text-align: center;
  display: grid;
  gap: 20px;
  justify-items: center;
  align-items: center;
  padding: 20px 0 20px;
  max-width: 900px;
  margin: -240px auto 0;
}

.tod-title {
  margin: 0 0 6px;
  font-size: 70px;
  letter-spacing: 0;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
}

.tod-subtitle {
  margin: 0 0 12px;
  color: #cbd5e1;
  max-width: 620px;
  line-height: 1.6;
  font-size: 18px;
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
  padding: 16px 26px;
  font-weight: 800;
  font-size: 17px;
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
  padding: 16px 30px;
  font-size: 18px;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  margin: 8px auto 10px;
  display: inline-flex;
}

.tod-game {
  display: grid;
  gap: 28px;
  justify-items: center;
  align-items: center;
  min-height: 80vh;
  padding: 16px 0 24px;
  margin-top: -200px;
  width: 100%;
}

.tod-modes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 8px;
}

.tod-chip {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;
  border-radius: 999px;
  padding: 12px 18px;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  font-size: 16px;
  font-weight: 800;
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
  padding: 28px;
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
  max-width: 900px;
  margin: -40px auto 0;
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
  font-size: 34px;
  font-weight: 700;
  line-height: 1.4;
  transition: opacity 0.18s ease, transform 0.18s ease;
  opacity: 0.3;
  transform: translateY(4px);
  text-align: center;
  margin: 6px 0 4px;
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
  gap: 12px;
  justify-items: center;
  margin-top: 8px;
}

.tod-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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
    padding: 4px 16px 12px;
  }

  .tod-container {
    padding: 4px 12px 10px;
  }

  .tod-intro {
    gap: 16px;
    padding: 4px 0 8px;
    min-height: 70vh;
    margin-top: -20px;
  }

  .tod-title {
    font-size: 52px;
    line-height: 1.05;
  }

  .tod-subtitle {
    max-width: 90%;
    font-size: 16px;
  }

  .tod-btn-primary {
    padding: 14px 24px;
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
    margin-top: -10px;
  }

  .tod-card {
    margin-top: -20px;
  }
}
</style>
