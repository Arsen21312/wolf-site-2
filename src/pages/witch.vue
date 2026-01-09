<template>
  <div class="witch-page">
    <div class="witch-shell">
      <header class="witch-top">
        <div class="witch-brand">
          <span class="witch-sigil">⚚</span>
          <div>
            <div class="witch-title">Волчий тест</div>
            <div class="witch-subtitle">Узнай, что она хочет</div>
          </div>
        </div>
        <button v-if="step > 0" class="ghost-btn" type="button" @click="goBack">
          Назад
        </button>
      </header>

      <main class="witch-card">
        <transition name="fade-slide" mode="out-in">
          <section v-if="step === 0" key="start" class="screen">
            <p class="eyebrow">Мини-тест</p>
            <h1>Ты тратишь деньги, но не понимаешь, чего она хочет</h1>
            <p class="lead">Проверь себя, 3 вопроса, 10 секунд</p>
            <button class="primary-btn" type="button" @click="startTest">
              Начать
            </button>
          </section>

          <section v-else-if="step >= 1 && step <= 3" key="question" class="screen">
            <div class="progress">
              <span>{{ step }} из 3</span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${(step / 3) * 100}%` }"></div>
              </div>
            </div>
            <h2>{{ questions[step - 1].title }}</h2>
            <div class="answers">
              <button
                v-for="(option, index) in questions[step - 1].options"
                :key="option"
                class="answer-btn"
                type="button"
                :class="{ active: answers[step - 1] === index }"
                @click="selectAnswer(index)"
              >
                {{ option }}
              </button>
            </div>
          </section>

          <section v-else key="result" class="screen">
            <p class="eyebrow">Результат</p>
            <h2>Ты не глупый, ты просто не видишь всей картины</h2>
            <p class="lead">
              Женщины говорят намёками, а ты живёшь прямо. Если хочешь ответ, он не
              бесплатный.
            </p>
            <p class="style-line">Твой стиль: {{ stylePreset.label }}</p>
            <a class="primary-btn cta" :href="TG_URL" target="_blank" rel="noopener">
              Перейти к ведьме
            </a>
            <p class="hint">Напиши, что тебя мучает, будь готов к честному ответу</p>
            <button class="ghost-btn reset" type="button" @click="resetTest">
              Сбросить тест
            </button>
          </section>
        </transition>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';

const TG_URL = 'https://www.instagram.com/ne_bois_tarot?igsh=OG05cWNrc3N3NG9u';

const questions = [
  {
    title: 'Когда она молчит, ты думаешь',
    options: ['Она занята', 'Она обиделась', 'Я что-то сделал не так', 'Я вообще ничего не понимаю'],
  },
  {
    title: 'Ты чаще',
    options: ['Плачу, чтобы не было скандала', 'Пишу первым', 'Жду, пока сама объявится', 'Злюсь и ухожу в себя'],
  },
  {
    title: 'Ты хочешь',
    options: ['Понять, чего она хочет', 'Вернуть контроль', 'Услышать правду', 'Просто не быть дураком'],
  },
];

const state = reactive({
  step: 0,
  answers: [],
  pending: false,
});

const step = computed(() => state.step);
const answers = computed(() => state.answers);

const stylePresets = [
  { label: 'Волчий наблюдатель' },
  { label: 'Тихий стратег' },
  { label: 'Серый дипломат' },
  { label: 'Ночной охотник' },
];

const stylePreset = computed(() => {
  const total = state.answers.reduce((sum, value) => sum + (value ?? 0), 0);
  const index = Math.min(stylePresets.length - 1, Math.floor(total / 3));
  return stylePresets[index];
});

const startTest = () => {
  state.answers = [];
  state.step = 1;
};

const selectAnswer = (index) => {
  if (state.pending) return;
  state.answers[state.step - 1] = index;
  state.pending = true;
  setTimeout(() => {
    state.step += 1;
    state.pending = false;
  }, 380);
};

const goBack = () => {
  if (state.pending) return;
  if (state.step > 1) {
    state.step -= 1;
    return;
  }
  if (state.step === 1) {
    state.step = 0;
  } else if (state.step > 3) {
    state.step = 3;
  }
};

const resetTest = () => {
  state.step = 0;
  state.answers = [];
  state.pending = false;
};
</script>

<style scoped>
:global(body) {
  margin: 0;
}

.witch-page {
  min-height: 100vh;
  color: #f1e9f7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px 48px;
  position: relative;
  overflow: hidden;
  font-family: "Cormorant Garamond", "Times New Roman", serif;
}

.witch-shell {
  width: min(520px, 100%);
  position: relative;
  z-index: 1;
}

.witch-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.witch-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.witch-sigil {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(154, 99, 255, 0.95), rgba(94, 52, 166, 0.7));
  display: grid;
  place-items: center;
  font-size: 24px;
  box-shadow: 0 10px 20px rgba(20, 6, 41, 0.6);
}

.witch-title {
  font-weight: 700;
  letter-spacing: 0.4px;
}

.witch-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.witch-card {
  background: rgba(13, 10, 22, 0.78);
  border-radius: 24px;
  padding: 28px;
  border: 1px solid rgba(168, 116, 255, 0.25);
  box-shadow: 0 24px 60px rgba(7, 5, 14, 0.7);
  backdrop-filter: blur(16px);
}

.screen {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}

h1,
h2 {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
}

.lead {
  margin: 0;
  font-size: 18px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.78);
  font-family: "Manrope", "Segoe UI", sans-serif;
}

.progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #b88bff, #7c4dff);
  box-shadow: 0 0 14px rgba(140, 94, 255, 0.8);
}

.answers {
  display: grid;
  gap: 12px;
}

.answer-btn,
.primary-btn,
.ghost-btn {
  border: none;
  cursor: pointer;
  font-family: "Manrope", "Segoe UI", sans-serif;
}

.answer-btn {
  padding: 16px 18px;
  font-size: 18px;
  text-align: left;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  color: #f6edff;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.answer-btn:hover {
  transform: translateY(-1px);
  background: rgba(184, 139, 255, 0.2);
  box-shadow: 0 10px 24px rgba(63, 25, 114, 0.4);
}

.answer-btn.active {
  background: rgba(184, 139, 255, 0.26);
  box-shadow: inset 0 0 0 1px rgba(200, 170, 255, 0.5);
}

.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 22px;
  border-radius: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #0d0715;
  background: linear-gradient(135deg, #d7b2ff, #8a5bff);
  box-shadow: 0 18px 30px rgba(116, 72, 204, 0.4);
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-btn:hover {
  transform: translateY(-1px) scale(1.01);
  box-shadow: 0 24px 40px rgba(116, 72, 204, 0.55);
}

.ghost-btn {
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: border 0.2s ease, color 0.2s ease;
}

.ghost-btn:hover {
  color: #f6edff;
  border-color: rgba(184, 139, 255, 0.6);
}

.cta {
  width: 100%;
}

.hint {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.58);
  font-family: "Manrope", "Segoe UI", sans-serif;
}

.style-line {
  margin: 0;
  font-size: 16px;
  color: rgba(208, 180, 255, 0.95);
  font-family: "Manrope", "Segoe UI", sans-serif;
}

.reset {
  margin-top: 8px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 540px) {
  .witch-card {
    padding: 22px;
  }

  h1,
  h2 {
    font-size: 24px;
  }

  .answer-btn {
    font-size: 16px;
  }
}
</style>
