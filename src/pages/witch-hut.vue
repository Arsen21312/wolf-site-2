<template>
  <div class="witch-hut">
    <div class="ui-controls">
      <button class="ui-btn" type="button" @click="toggleLang">
        {{ langLabel }}
      </button>
      <button class="ui-btn" type="button" @click="toggleSound">
        {{ soundLabel }}
      </button>
    </div>

    <transition name="screen-fade" mode="out-in">
      <HeroSection
        v-if="stage === 'hero'"
        key="hero"
        :copy="copy.hero"
        :background="assets.hero"
        @start="handleStart"
      />
      <QuizSection
        v-else-if="stage === 'quiz'"
        key="quiz"
        :copy="copy.quiz"
        @answer="handleAnswer"
        @complete="handleQuizComplete"
      />
      <ResultSection
        v-else
        key="result"
        :copy="copy.result"
        :result="resultType"
        :background="assets.result"
        @cta="handleResultCta"
      />
    </transition>

    <audio ref="musicRef" :src="MUSIC_URL" loop />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import HeroSection from '@/components/witch-hut/HeroSection.vue';
import QuizSection from '@/components/witch-hut/QuizSection.vue';
import ResultSection from '@/components/witch-hut/ResultSection.vue';

definePageMeta({ layout: false });

const MUSIC_URL = '/witch-hut/audio/ritual.mp3';
const CLICK_SFX_URL = '/witch-hut/audio/click.mp3';

const assets = {
  hero: 'https://images.unsplash.com/photo-1669669530583-f64e801e94ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZm9yZXN0JTIwbWlzdCUyMG5pZ2h0fGVufDF8fHx8MTc2ODQ5MDAyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  result: 'https://images.unsplash.com/photo-1600748338443-f7ea1054ed6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdXJwbGUlMjBuZW9uJTIwY3liZXIlMjBkYXJrfGVufDF8fHx8MTc2ODQ5MDAyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
};

const stage = ref('hero');
const answers = ref([]);
const lang = ref('ru');
const musicRef = ref(null);
const isMusicOn = ref(true);
const isSfxOn = ref(true);

const copy = computed(() => (lang.value === 'ru' ? RU_COPY : EN_COPY));
const langLabel = computed(() => (lang.value === 'ru' ? 'RU' : 'EN'));
const soundLabel = computed(() =>
  isMusicOn.value || isSfxOn.value
    ? copy.value.controls.soundOn
    : copy.value.controls.soundOff
);

const resultType = computed(() => {
  if (!answers.value.length) return null;
  const total = answers.value.reduce((sum, value) => sum + value, 0);
  const index = Math.min(copy.value.result.types.length - 1, Math.floor(total / 3));
  return copy.value.result.types[index];
});

const handleStart = () => {
  playSfx();
  stage.value = 'quiz';
};

const handleAnswer = () => {
  playSfx();
};

const handleQuizComplete = (payload) => {
  answers.value = payload;
  stage.value = 'result';
};

const handleResultCta = () => {
  playSfx();
  if (typeof window !== 'undefined') {
    window.open('https://ig.me/m/ne_bois_tarot', '_blank', 'noopener');
  }
};

const toggleLang = () => {
  playSfx();
  lang.value = lang.value === 'ru' ? 'en' : 'ru';
};

const toggleSound = async () => {
  const audio = musicRef.value;
  if (!audio) return;
  const next = !(isMusicOn.value || isSfxOn.value);
  isMusicOn.value = next;
  isSfxOn.value = next;

  if (next) {
    audio.volume = 0.5;
    try {
      await audio.play();
    } catch (error) {
      isMusicOn.value = false;
      isSfxOn.value = false;
    }
  } else {
    audio.pause();
  }
};

const playSfx = () => {
  if (!isSfxOn.value || !CLICK_SFX_URL) return;
  const audio = new Audio(CLICK_SFX_URL);
  audio.volume = 0.6;
  audio.play().catch(() => {});
};

const tryStartMusic = async () => {
  const audio = musicRef.value;
  if (!audio || !isMusicOn.value) return;
  audio.volume = 0.5;
  try {
    await audio.play();
  } catch (error) {
    // Autoplay is blocked until user interaction.
  }
};

onMounted(() => {
  if (typeof window === 'undefined') return;
  const handler = () => {
    tryStartMusic();
    window.removeEventListener('pointerdown', handler);
  };
  window.addEventListener('pointerdown', handler, { once: true });
});

useSeoMeta({
  title: 'Ведьма и волк, мини тест',
  description: 'Темный интерактивный лендинг. Три вопроса, десять секунд, честный вывод.',
  ogTitle: 'Ведьма и волк, мини тест',
  ogDescription: 'Темный интерактивный лендинг. Три вопроса, десять секунд, честный вывод.',
});

const url = useRequestURL();
useHead({
  link: [{ rel: 'canonical', href: `${url.origin}/witch-hut` }],
});

const RU_COPY = {
  hero: {
    badge: 'Мини тест',
    title: 'Ты тратишь на цветы, такси, подарки',
    accent: 'А что у нее в голове, не знаешь',
    subtitle: 'Три вопроса, десять секунд, один честный вывод',
    cta: 'Начать ритуал',
    micro: 'Без регистрации, просто жми',
  },
  controls: {
    soundOn: 'Звук on',
    soundOff: 'Звук off',
  },
  quiz: {
    title: 'Ритуал',
    questions: [
      {
        text: 'Она чаще всего обижается когда',
        options: ['Я пропадаю', 'Я не угадываю', 'Я общаюсь сухо', 'Я много контролю'],
      },
      {
        text: 'Что ты обычно делаешь когда она недовольна',
        options: ['Покупаю что то', 'Пишу простыню', 'Делаю вид что норм', 'Давлю шуткой'],
      },
      {
        text: 'Самая частая фраза от нее',
        options: ['Мне все равно', 'Ничего не надо', 'Ты не понимаешь', 'Делай как хочешь'],
      },
    ],
  },
  result: {
    title: 'Результат',
    lead: 'Ты не тупой',
    sublead: 'Ты просто играешь в темноте без карты',
    cta: 'Зайти в хатку ведьмы',
    hint: 'Там скажут прямо, что делать дальше',
    types: [
      { title: 'Тишина в голове', detail: 'Ей нужна забота и внимание словами' },
      { title: 'Командир', detail: 'Ей нужна ясность и действие' },
      { title: 'Кошка в тумане', detail: 'Ей нужна интрига и эмоция' },
      { title: 'Снежная королева', detail: 'Ей нужны границы и уважение' },
    ],
  },
};

const EN_COPY = {
  hero: {
    badge: 'Mini test',
    title: 'You spend on flowers, rides, gifts',
    accent: 'But you still do not know what is in her head',
    subtitle: 'Three questions, ten seconds, one honest result',
    cta: 'Start the ritual',
    micro: 'No signup, just tap',
  },
  controls: {
    soundOn: 'Sound on',
    soundOff: 'Sound off',
  },
  quiz: {
    title: 'Ritual',
    questions: [
      {
        text: 'She gets offended most often when',
        options: ['I disappear', 'I do not guess', 'I talk too dry', 'I control too much'],
      },
      {
        text: 'What do you usually do when she is unhappy',
        options: ['I buy something', 'I write a long text', 'I act like it is fine', 'I push a joke'],
      },
      {
        text: 'Her most common phrase',
        options: ['I do not care', 'I want nothing', 'You do not get it', 'Do what you want'],
      },
    ],
  },
  result: {
    title: 'Result',
    lead: 'You are not stupid',
    sublead: 'You just play in the dark without a map',
    cta: 'Enter the witch hut',
    hint: 'There they will say what to do next',
    types: [
      { title: 'Silence in her head', detail: 'She needs care and words' },
      { title: 'Commander', detail: 'She needs clarity and action' },
      { title: 'Cat in the fog', detail: 'She needs intrigue and emotion' },
      { title: 'Ice queen', detail: 'She needs boundaries and respect' },
    ],
  },
};
</script>

<style scoped>
:global(body) {
  margin: 0;
  background: #05030a;
}

.witch-hut {
  min-height: 100vh;
  color: #f6f1ff;
  background: #05030a;
  position: relative;
  overflow: hidden;
  font-family: "Segoe UI", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
}

.ui-controls {
  position: fixed;
  bottom: 16px;
  left: 16px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.ui-btn {
  border: 1px solid rgba(179, 137, 255, 0.35);
  background: rgba(12, 8, 20, 0.7);
  color: rgba(246, 241, 255, 0.8);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, border 0.2s ease;
}

.ui-btn:active {
  transform: scale(0.96);
  border-color: rgba(210, 175, 255, 0.7);
}

.screen-fade-enter-active,
.screen-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.screen-fade-enter-from,
.screen-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (prefers-reduced-motion: reduce) {
  .screen-fade-enter-active,
  .screen-fade-leave-active {
    transition: opacity 0.1s ease;
  }
}
</style>
