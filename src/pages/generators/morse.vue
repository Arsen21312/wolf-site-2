
<template>
  <main class="morse-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Генератор Морзе</h1>
      <p class="lead">
        Переводите фразы в азбуку Морзе и обратно, слушайте ритм, копируйте и сохраняйте результат
        одним кликом.
      </p>
    </header>

    <section class="tool-card">
      <div class="mode-tabs">
        <button
          class="tab"
          type="button"
          :class="{ active: mode === 'text-to-morse' }"
          @click="setMode('text-to-morse')"
        >
          Текст → Морзе
        </button>
        <button
          class="tab"
          type="button"
          :class="{ active: mode === 'morse-to-text' }"
          @click="setMode('morse-to-text')"
        >
          Морзе → Текст
        </button>
      </div>

      <div class="panel-grid">
        <div class="panel input-panel">
          <div class="panel-head">
            <div>
              <h2>Ввод</h2>
              <p>{{ mode === 'text-to-morse' ? 'Введите текст на русском или английском.' : 'Введите код Морзе.' }}</p>
            </div>
            <button class="btn ghost" type="button" @click="insertSample">Вставить пример</button>
          </div>
          <textarea
            v-model="inputText"
            class="text-area"
            rows="9"
            :placeholder="
              mode === 'text-to-morse'
                ? 'Привет, волки! Переведите это в Морзе.'
                : '·−· · ·− / ·−−· ·−· ·· ···'
            "
          ></textarea>
          <p v-if="mode === 'morse-to-text'" class="input-hint">
            Можно вставлять · и −, можно . и -, слова разделяй /
          </p>
          <div class="input-meta">
            <span>Символов: {{ inputText.length }}</span>
          </div>
        </div>

        <div class="panel output-panel">
          <div class="panel-head">
            <div>
              <h2>Результат</h2>
              <p>{{ mode === 'text-to-morse' ? 'Нормализованный код Морзе.' : 'Расшифрованный текст.' }}</p>
            </div>
          </div>
          <textarea
            class="text-area result-area"
            rows="9"
            readonly
            :value="resultText"
            :placeholder="mode === 'text-to-morse' ? 'Результат появится тут.' : 'Расшифровка появится тут.'"
          ></textarea>
          <div class="input-meta">
            <span>Символов: {{ resultText.length }}</span>
            <span class="info">{{ infoLine }}</span>
          </div>
        </div>
      </div>

      <div class="action-row">
        <button class="btn primary" type="button" :disabled="!resultText" @click="copyResult">
          {{ copyLabel }}
        </button>
        <button class="btn ghost" type="button" :disabled="!inputText" @click="shareLink">
          {{ shareLabel }}
        </button>
        <button class="btn ghost" type="button" :disabled="!resultText" @click="downloadTxt">
          Скачать .txt
        </button>
        <button class="btn ghost" type="button" :disabled="!resultText" @click="swapTexts">
          Поменять местами
        </button>
        <button class="btn ghost" type="button" :disabled="!inputText" @click="clearAll">
          Очистить
        </button>
      </div>

      <div class="audio-card">
        <div class="audio-head">
          <h3>Озвучка Морзе</h3>
          <div class="audio-controls">
            <button class="btn primary" type="button" :disabled="!playbackReady" @click="handlePlay">
              ▶ {{ isPaused ? 'Продолжить' : 'Играть' }}
            </button>
            <button class="btn ghost" type="button" :disabled="!isPlaying || isPaused" @click="pausePlayback">
              ⏸ Пауза
            </button>
            <button class="btn ghost" type="button" :disabled="!isPlaying" @click="stopPlayback">⏹ Стоп</button>
          </div>
        </div>
        <p v-if="showPlaybackHint" class="audio-warning">Для озвучки нужен код Морзе</p>

        <div class="audio-grid">
          <div class="audio-panel">
            <p class="block-title">Строка для воспроизведения</p>
            <div class="morse-line" aria-live="polite">
              <span
                v-for="(char, idx) in playbackDisplayChars"
                :key="`${char}-${idx}`"
                class="morse-char"
                :class="{ active: idx === highlightIndex }"
              >
                {{ char }}
              </span>
              <span v-if="!playbackDisplayChars.length" class="morse-empty">Нет данных для воспроизведения</span>
            </div>
          </div>

          <div class="audio-settings">
            <div class="preset-row">
              <button class="btn ghost" type="button" @click="applyPreset('quiet')">Тихо</button>
              <button class="btn ghost" type="button" @click="applyPreset('normal')">Норм</button>
              <button class="btn ghost" type="button" @click="applyPreset('fast')">Быстро</button>
            </div>
            <div>
              <label class="setting-label">
                Скорость (WPM)
                <span>{{ speed }}</span>
              </label>
              <input v-model.number="speed" class="range" type="range" min="5" max="30" step="1" />
            </div>
            <div>
              <label class="setting-label">
                Тон
                <span>{{ tone }} Hz</span>
              </label>
              <input v-model.number="tone" class="range" type="range" min="400" max="900" step="10" />
            </div>
            <div>
              <label class="setting-label">
                Громкость
                <span>{{ Math.round(volume * 100) }}%</span>
              </label>
              <input v-model.number="volume" class="range" type="range" min="0.05" max="1" step="0.05" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="seo-section">
      <div class="seo-text">
        <article class="seo-block-card">
          <h2>Азбука Морзе онлайн, как пользоваться переводчиком</h2>
          <p>
            Переводчик понимает русский и английский алфавит, цифры и базовую пунктуацию. Ниже на
            странице есть таблица с кодами — удобно подсмотреть символ или проверить расшифровку.
          </p>
          <div class="seo-steps">
            <p class="seo-kicker">Быстрый старт</p>
            <ol>
              <li>Выберите режим: текст в Морзе или Морзе в текст.</li>
              <li>Введите фразу, слово или код в поле “Ввод”.</li>
              <li>Проверьте результат в правом окне, он уже нормализован.</li>
              <li>Скопируйте, скачайте .txt или поделитесь ссылкой.</li>
              <li>При необходимости включите звук и настройте параметры.</li>
            </ol>
          </div>
          <div class="seo-media">
            <img src="/images/morse/morse-hero.png" alt="Азбука Морзе и волк" loading="lazy" />
          </div>
        </article>

        <article class="seo-block-card">
          <h2>Правила пауз и разделителей</h2>
          <p>
            В азбуке Морзе важно соблюдать ритм. Точка длится 1 единицу, тире — 3. Пауза между точками
            и тире внутри буквы равна 1 единице, между буквами — 3, между словами — 7. В тексте это
            отображается так: между буквами один пробел, между словами символ “/” со пробелами вокруг.
          </p>
          <div class="seo-chip-row">
            <span class="seo-chip">Точка = 1</span>
            <span class="seo-chip">Тире = 3</span>
            <span class="seo-chip">Буквы = 3</span>
            <span class="seo-chip">Слова = 7</span>
          </div>
          <p>
            Такой формат помогает не путать границы букв и слов при расшифровке. Даже если в исходном
            тексте были лишние пробелы или переносы строк, результат будет приведён к единому виду.
          </p>
          <div class="seo-media">
            <img src="/images/morse/morse-rhythm.png" alt="Ритм Морзе на фоне" loading="lazy" />
          </div>
        </article>

        <article class="seo-block-card">
          <h2>Как расшифровать Морзе обратно в текст</h2>
          <p>
            Для обратного перевода вставьте код Морзе и переключитесь на режим “Морзе → Текст”. Слова
            отделяйте “ / ”, а буквы — одиночным пробелом. Если вы используете точки и дефисы вместо
            символов “·” и “−”, это нормально: сервис заменит их автоматически.
          </p>
          <p>
            Если в вводе встречается неизвестная комбинация, в результате появится “?”. Это подсказка,
            что код не соответствует стандартной таблице — проверьте порядок точек и тире или
            разделение между буквами.
          </p>
          <div class="seo-media">
            <img src="/images/morse/morse-decode.png" alt="Расшифровка Морзе" loading="lazy" />
          </div>
        </article>

        <article class="seo-block-card">
          <h2>Озвучка Морзе, как настроить скорость WPM</h2>
          <p>
            WPM (words per minute) — это скорость передачи, измеряемая количеством условных слов в
            минуту. Значение 18 WPM считается комфортным для большинства пользователей: темп уже
            динамичный, но остаётся читаемым на слух.
          </p>
          <p>
            Если вы только начинаете, попробуйте пресеты “Тихо” или “Норм”, а для уверенного
            восприятия переходите на “Быстро”. Скорость и настройки сохраняются на устройстве.
          </p>
          <div class="seo-panel seo-panel--accent">
            <div class="seo-panel-head">
              <h3>Шпаргалка по формату</h3>
              <span class="seo-badge">быстро</span>
            </div>
            <ul class="seo-checklist">
              <li>Буквы: один пробел между кодами.</li>
              <li>Слова: “ / ” со пробелами по краям.</li>
              <li>Точки и дефисы можно вставлять как . и -.</li>
              <li>Двойные пробелы не заменяют разделитель слов.</li>
            </ul>
            <div class="seo-inline-note">
              Пример: <span>··· --- ··· / ·− ·−·</span>
            </div>
          </div>
          <div class="seo-media">
            <img src="/images/morse/morse-audio.png" alt="Озвучка Морзе и наушники" loading="lazy" />
          </div>
        </article>

        <article class="seo-block-card">
          <h2>Частые ошибки при вводе</h2>
          <ul class="seo-list">
            <li>Длинные тире и «красивые» точки из разных источников.</li>
            <li>Лишние пробелы и переносы строк в коде.</li>
            <li>Потерянный слэш “/” между словами.</li>
            <li>Двойные пробелы вместо разделителя слов.</li>
          </ul>
          <p>
            Двойные пробелы не считаются границей слов. Разделяйте слова только “/”, тогда
            расшифровка будет точной и предсказуемой.
          </p>
        </article>
      </div>

      <div class="seo-block-card seo-links">
        <h3>Попробуй ещё</h3>
        <ul class="link-list">
          <li>
            <NuxtLink class="link-card" to="/generators">
              <span>Все генераторы</span>
              <span class="link-tag">Раздел</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink class="link-card" to="/decisions">
              <span>Решатели и утилиты</span>
              <span class="link-tag">Раздел</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink class="link-card" to="/games">
              <span>Игры</span>
              <span class="link-tag">Раздел</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink class="link-card" to="/generators/qr-generator">
              <span>QR-генератор</span>
              <span class="link-tag">Популярное</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink class="link-card" to="/generators/password-generator">
              <span>Генератор паролей</span>
              <span class="link-tag">Популярное</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink class="link-card" to="/decisions/love-calculator">
              <span>Калькулятор любви</span>
              <span class="link-tag">Решения</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink class="link-card" to="/games/wolf-runner">
              <span>Wolf Runner</span>
              <span class="link-tag">Игра</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink class="link-card" to="/games/sudoku">
              <span>Судоку</span>
              <span class="link-tag">Игра</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <section class="table-card">
      <h2>Морзе алфавит (RU, EN, цифры)</h2>
      <div class="table-grid">
        <div class="table-panel">
          <p class="block-title">Русский</p>
          <ul class="table-list">
            <li v-for="row in ruTable" :key="row.char">
              <span>{{ row.char }}</span>
              <span class="code">{{ row.morse }}</span>
            </li>
          </ul>
        </div>
        <div class="table-panel">
          <p class="block-title">English</p>
          <ul class="table-list">
            <li v-for="row in enTable" :key="row.char">
              <span>{{ row.char }}</span>
              <span class="code">{{ row.morse }}</span>
            </li>
          </ul>
        </div>
        <div class="table-panel">
          <p class="block-title">Цифры</p>
          <ul class="table-list">
            <li v-for="row in digitTable" :key="row.char">
              <span>{{ row.char }}</span>
              <span class="code">{{ row.morse }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="punct-card">
      <h2>Подсказки по пунктуации</h2>
      <p>
        Поддерживаются: . , ? ! : ; - ( ) " ' / @ = +. Если символ не распознаётся, он будет пропущен
        при переводе в Морзе.
      </p>
      <div class="punct-grid">
        <div v-for="row in punctuationTable" :key="row.char" class="punct-item">
          <span>{{ row.char }}</span>
          <span class="code">{{ row.morse }}</span>
        </div>
      </div>
    </section>

    <section class="extras">
      <div class="faq-card">
        <h2>FAQ</h2>
        <div class="faq-list">
          <div v-for="(item, idx) in faqItems" :key="item.q" class="faq-item" :class="{ open: openFaq === idx }">
            <button class="faq-toggle" type="button" @click="toggleFaq(idx)">
              <span>{{ item.q }}</span>
              <span class="icon">{{ openFaq === idx ? '-' : '+' }}</span>
            </button>
            <div class="faq-body">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useHead, useRequestURL, useRoute, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

type Mode = 'text-to-morse' | 'morse-to-text'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Генератор Морзе' }
]

const mode = ref<Mode>('text-to-morse')
const inputText = ref('')
const copyLabel = ref('Копировать результат')
const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const shareLabel = ref('Поделиться')
const shareTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const openFaq = ref<number | null>(null)

const speed = ref(18)
const tone = ref(620)
const volume = ref(0.6)

const infoLine = 'точка = ·, тире = −, пауза = пробел, слово = /'

const MORSE_MAP_EN: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..'
}

const MORSE_MAP_RU: Record<string, string> = {
  А: '.-',
  Б: '-...',
  В: '.--',
  Г: '--.',
  Д: '-..',
  Е: '.',
  Ё: '.',
  Ж: '...-',
  З: '--..',
  И: '..',
  Й: '.---',
  К: '-.-',
  Л: '.-..',
  М: '--',
  Н: '-.',
  О: '---',
  П: '.--.',
  Р: '.-.',
  С: '...',
  Т: '-',
  У: '..-',
  Ф: '..-.',
  Х: '....',
  Ц: '-.-.',
  Ч: '---.',
  Ш: '----',
  Щ: '--.-',
  Ъ: '--.--',
  Ы: '-.--',
  Ь: '-..-',
  Э: '..-..',
  Ю: '..--',
  Я: '.-.-'
}

const MORSE_MAP_DIGITS: Record<string, string> = {
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.'
}

const MORSE_MAP_PUNCT: Record<string, string> = {
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  '!': '-.-.--',
  ':': '---...',
  ';': '-.-.-.',
  '-': '-....-',
  '(': '-.--.',
  ')': '-.--.-',
  '"': '.-..-.',
  "'": '.----.',
  '/': '-..-.',
  '@': '.--.-.',
  '=': '-...-',
  '+': '.-.-.'
}

const FULL_MORSE_MAP: Record<string, string> = {
  ...MORSE_MAP_EN,
  ...MORSE_MAP_RU,
  ...MORSE_MAP_DIGITS,
  ...MORSE_MAP_PUNCT
}

function invertMap(map: Record<string, string>) {
  return Object.fromEntries(Object.entries(map).map(([key, value]) => [value, key]))
}

const MORSE_REVERSE_EN = invertMap(MORSE_MAP_EN)
const MORSE_REVERSE_RU = invertMap(MORSE_MAP_RU)
const MORSE_REVERSE_DIGITS = invertMap(MORSE_MAP_DIGITS)
const MORSE_REVERSE_PUNCT = invertMap(MORSE_MAP_PUNCT)
const RU_ONLY_CODES = new Set(
  Object.values(MORSE_MAP_RU).filter((code) => !Object.prototype.hasOwnProperty.call(MORSE_REVERSE_EN, code))
)

function getReverseMap(preferRu: boolean) {
  const base = preferRu ? MORSE_REVERSE_RU : MORSE_REVERSE_EN
  return {
    ...base,
    ...MORSE_REVERSE_DIGITS,
    ...MORSE_REVERSE_PUNCT,
    ...(preferRu ? MORSE_REVERSE_EN : MORSE_REVERSE_RU)
  }
}

function normalizeTextInput(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function encodeToMorseWords(value: string) {
  if (!value.trim()) return []
  const normalized = normalizeTextInput(value)
  const upper = normalized.toLocaleUpperCase('ru-RU')
  const words = upper.split(' ').filter(Boolean)
  return words
    .map((word) =>
      Array.from(word)
        .map((char) => FULL_MORSE_MAP[char])
        .filter(Boolean)
    )
    .filter((letters) => letters.length > 0)
}

function normalizeMorseInput(value: string) {
  if (!value.trim()) return ''
  return value
    .replace(/[·•∙]/g, '.')
    .replace(/[−–—]/g, '-')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseMorseWords(value: string) {
  const normalized = normalizeMorseInput(value)
  if (!normalized) return []
  return normalized.split(' / ').map((word) => word.split(' ').filter(Boolean))
}

function displayMorse(code: string) {
  return code.replace(/\./g, '·').replace(/-/g, '−')
}

function buildDisplayAndPlan(words: string[][]) {
  let display = ''
  const steps: Array<{ type: 'tone' | 'gap'; units: number; index?: number }> = []

  words.forEach((letters, wordIndex) => {
    letters.forEach((letter, letterIndex) => {
      Array.from(letter).forEach((symbol, symbolIndex) => {
        const displaySymbol = symbol === '.' ? '·' : '−'
        const symbolPos = display.length
        display += displaySymbol
        steps.push({ type: 'tone', units: symbol === '.' ? 1 : 3, index: symbolPos })
        if (symbolIndex < letter.length - 1) {
          steps.push({ type: 'gap', units: 1 })
        }
      })
      if (letterIndex < letters.length - 1) {
        display += ' '
        steps.push({ type: 'gap', units: 3 })
      }
    })
    if (wordIndex < words.length - 1) {
      display += ' / '
      steps.push({ type: 'gap', units: 7 })
    }
  })

  return { display, steps }
}

const encodedWords = computed(() => encodeToMorseWords(inputText.value))
const parsedWords = computed(() => parseMorseWords(inputText.value))

const normalizedMorseDisplay = computed(() => buildDisplayAndPlan(parsedWords.value).display)
const morseDisplayFromText = computed(() => buildDisplayAndPlan(encodedWords.value).display)

const resultText = computed(() => {
  if (mode.value === 'text-to-morse') {
    return morseDisplayFromText.value
  }

  const words = parsedWords.value
  if (!words.length) return ''
  const preferRu = words.some((letters) => letters.some((letter) => RU_ONLY_CODES.has(letter)))
  const reverseMap = getReverseMap(preferRu)

  return words
    .map((letters) =>
      letters
        .map((code) => reverseMap[code] || '?')
        .join('')
        .trim()
    )
    .join(' ')
    .trim()
})

const playbackWords = computed(() => (mode.value === 'text-to-morse' ? encodedWords.value : parsedWords.value))
const isValidMorseInput = computed(() => {
  const normalized = normalizeMorseInput(inputText.value)
  if (!normalized) return false
  if (!/[.-]/.test(normalized)) return false
  return /^[.\- /]+$/.test(normalized)
})
const playbackDisplay = computed(() => {
  if (mode.value === 'text-to-morse') return morseDisplayFromText.value
  if (!isValidMorseInput.value) return ''
  return normalizedMorseDisplay.value
})
const playbackDisplayChars = computed(() => Array.from(playbackDisplay.value || ''))

const isPlaying = ref(false)
const isPaused = ref(false)
const highlightIndex = ref<number | null>(null)
const playbackToken = ref(0)
const pauseResolver = ref<(() => void) | null>(null)
const audioContext = ref<AudioContext | null>(null)
const activeOscillator = ref<OscillatorNode | null>(null)

const playbackReady = computed(() => {
  if (mode.value === 'text-to-morse') return encodedWords.value.length > 0
  return isValidMorseInput.value
})
const showPlaybackHint = computed(
  () => mode.value === 'morse-to-text' && inputText.value.trim().length > 0 && !isValidMorseInput.value
)

function setMode(nextMode: Mode) {
  mode.value = nextMode
  stopPlayback()
}

function insertSample() {
  inputText.value =
    mode.value === 'text-to-morse'
      ? 'Привет, волки! Morse 123.'
      : '·−· · ·− / ·−−· ·−· ·· ···'
}

function clearAll() {
  inputText.value = ''
  copyLabel.value = 'Копировать результат'
  stopPlayback()
}

function swapTexts() {
  if (!resultText.value) return
  inputText.value = resultText.value
  const nextMode = mode.value === 'text-to-morse' ? 'morse-to-text' : 'text-to-morse'
  mode.value = nextMode
  inputText.value =
    nextMode === 'morse-to-text' ? normalizeMorseInput(inputText.value) : normalizeTextInput(inputText.value)
  stopPlayback()
}

async function copyResult() {
  if (!resultText.value) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return

  try {
    await navigator.clipboard.writeText(resultText.value)
    copyLabel.value = 'Скопировано'
  } catch (error) {
    copyLabel.value = 'Не удалось скопировать'
  }

  if (copyTimer.value) clearTimeout(copyTimer.value)
  copyTimer.value = setTimeout(() => {
    copyLabel.value = 'Копировать результат'
  }, 2000)
}

async function shareLink() {
  if (!inputText.value) return
  if (inputText.value.length > 5000) {
    shareLabel.value = 'Слишком длинно для ссылки, используй .txt'
    if (shareTimer.value) clearTimeout(shareTimer.value)
    shareTimer.value = setTimeout(() => {
      shareLabel.value = 'Поделиться'
    }, 2000)
    return
  }
  if (typeof navigator === 'undefined' || !navigator.clipboard) return

  const link = `${canonicalUrl.value}?mode=${mode.value}&text=${encodeURIComponent(inputText.value)}`
  try {
    await navigator.clipboard.writeText(link)
    shareLabel.value = 'Ссылка скопирована'
  } catch (error) {
    shareLabel.value = 'Не удалось скопировать'
  }

  if (shareTimer.value) clearTimeout(shareTimer.value)
  shareTimer.value = setTimeout(() => {
    shareLabel.value = 'Поделиться'
  }, 2000)
}

function downloadTxt() {
  if (!resultText.value || typeof document === 'undefined') return
  const blob = new Blob([resultText.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'morse.txt'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? null : idx
}

function ensureAudioContext() {
  if (audioContext.value || typeof window === 'undefined') return audioContext.value
  const Context =
    window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Context) return null
  audioContext.value = new Context()
  return audioContext.value
}

function stopActiveOscillator() {
  if (activeOscillator.value) {
    try {
      activeOscillator.value.stop()
    } catch (error) {
      // oscillator may already be stopped
    }
    activeOscillator.value.disconnect()
    activeOscillator.value = null
  }
}

function stopPlayback() {
  playbackToken.value += 1
  isPlaying.value = false
  isPaused.value = false
  highlightIndex.value = null
  stopActiveOscillator()
  if (pauseResolver.value) {
    pauseResolver.value()
    pauseResolver.value = null
  }
}

function pausePlayback() {
  if (!isPlaying.value || isPaused.value) return
  isPaused.value = true
  stopActiveOscillator()
}

function resumePlayback() {
  if (!isPlaying.value || !isPaused.value) return
  isPaused.value = false
  if (pauseResolver.value) {
    pauseResolver.value()
    pauseResolver.value = null
  }
}

async function waitForResume(token: number) {
  if (!isPaused.value) return
  await new Promise<void>((resolve) => {
    if (token !== playbackToken.value) {
      resolve()
      return
    }
    pauseResolver.value = resolve
  })
}

async function sleepWithPause(duration: number, token: number) {
  const end = performance.now() + duration * 1000
  while (performance.now() < end) {
    if (token !== playbackToken.value) return
    if (isPaused.value) {
      await waitForResume(token)
    }
    const remaining = end - performance.now()
    await new Promise((resolve) => setTimeout(resolve, Math.min(60, remaining)))
  }
}

function playTone(duration: number, token: number) {
  return new Promise<void>((resolve) => {
    const context = ensureAudioContext()
    if (!context || token !== playbackToken.value) {
      resolve()
      return
    }
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = tone.value
    gain.gain.value = 0
    oscillator.connect(gain)
    gain.connect(context.destination)

    const now = context.currentTime
    const stopAt = now + duration
    const ramp = Math.min(0.01, duration / 3)
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(volume.value, now + ramp)
    gain.gain.linearRampToValueAtTime(0, stopAt)

    oscillator.start(now)
    oscillator.stop(stopAt)
    activeOscillator.value = oscillator

    oscillator.onended = () => {
      if (activeOscillator.value === oscillator) {
        activeOscillator.value = null
      }
      resolve()
    }
  })
}

async function startPlayback() {
  if (isPlaying.value) return
  const words = playbackWords.value
  if (!words.length) return

  const { steps } = buildDisplayAndPlan(words)
  if (!steps.length) return

  isPlaying.value = true
  isPaused.value = false
  highlightIndex.value = null
  playbackToken.value += 1
  const token = playbackToken.value
  const unit = 1.2 / speed.value
  const context = ensureAudioContext()
  if (context?.state === 'suspended') {
    await context.resume()
  }

  for (const step of steps) {
    if (token !== playbackToken.value) return
    if (isPaused.value) await waitForResume(token)
    if (step.type === 'tone') {
      highlightIndex.value = step.index ?? null
      await playTone(step.units * unit, token)
    } else {
      highlightIndex.value = null
      await sleepWithPause(step.units * unit, token)
    }
  }

  stopPlayback()
}

function handlePlay() {
  if (isPaused.value) {
    resumePlayback()
    return
  }
  startPlayback()
}

function applyPreset(preset: 'quiet' | 'normal' | 'fast') {
  if (preset === 'quiet') {
    volume.value = 0.35
    tone.value = 520
    speed.value = 16
  } else if (preset === 'fast') {
    volume.value = 0.6
    tone.value = 700
    speed.value = 26
  } else {
    volume.value = 0.6
    tone.value = 620
    speed.value = 18
  }
}

const ruTable = Object.entries(MORSE_MAP_RU).map(([char, code]) => ({
  char,
  morse: displayMorse(code)
}))
const enTable = Object.entries(MORSE_MAP_EN).map(([char, code]) => ({
  char,
  morse: displayMorse(code)
}))
const digitTable = Object.entries(MORSE_MAP_DIGITS).map(([char, code]) => ({
  char,
  morse: displayMorse(code)
}))
const punctuationTable = Object.entries(MORSE_MAP_PUNCT).map(([char, code]) => ({
  char,
  morse: displayMorse(code)
}))

const faqItems = [
  {
    q: 'Как поставить паузу между словами?',
    a: 'Используйте разделитель “ / ” (слэш с пробелами). Генератор сам нормализует пробелы.'
  },
  {
    q: 'Чем отличаются точка и тире по времени?',
    a: 'Точка длится 1 единицу, тире — 3. Между элементами пауза 1, между буквами 3, между словами 7.'
  },
  {
    q: 'Что значит WPM в Морзе?',
    a: 'WPM — это words per minute, скорость передачи. Чем выше WPM, тем короче интервалы и быстрее ритм.'
  },
  {
    q: 'Как разделять буквы и слова?',
    a: 'Буквы разделяются одиночным пробелом, слова — символом “ / ” с пробелами.'
  },
  {
    q: 'Можно ли вставлять точки и дефисы вместо · и −?',
    a: 'Да. Сервис сам заменяет варианты точек и тире на стандартные символы.'
  },
  {
    q: 'Почему в расшифровке появляются “?”',
    a: 'Знак вопроса означает неизвестный код. Проверьте пробелы, слэш и правильность комбинаций.'
  },
  {
    q: 'Поддерживаются ли знаки препинания?',
    a: 'Да, поддерживаются базовые знаки препинания и служебные символы из таблицы на странице.'
  },
  {
    q: 'Можно ли перевести русский текст?',
    a: 'Да. Поддерживается полный русский алфавит, включая Ё, а также английский и цифры.'
  },
  {
    q: 'Как скачать результат?',
    a: 'Нажмите “Скачать .txt”, файл сохранится на устройство.'
  },
  {
    q: 'Как озвучить Морзе?',
    a: 'Нажмите “Играть” и настройте скорость, тон и громкость. Пауза и стоп доступны рядом.'
  },
  {
    q: 'Какой стандарт пауз?',
    a: 'Точка 1, тире 3, пауза между элементами 1, между буквами 3, между словами 7.'
  },
  {
    q: 'Работает ли генератор на телефоне?',
    a: 'Да, интерфейс адаптивный и озвучка доступна в мобильных браузерах.'
  },
  {
    q: 'Сохраняется ли текст?',
    a: 'Да, данные сохраняются в localStorage этого устройства и не отправляются на сервер.'
  }
]

const requestUrl = useRequestURL()
const route = useRoute()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/morse`)
const ogImageUrl = computed(() => `${requestUrl.origin}/favicon.png`)
const metaDescription =
  'Азбука Морзе онлайн: перевод текста в точку-тире и обратно, озвучка с настройкой скорости, таблица символов RU/EN и цифры. Работает в браузере без регистрации.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Генератор Морзе онлайн',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Web',
      url: canonicalUrl.value,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'RUB' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a }
      }))
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${requestUrl.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Генераторы', item: `${requestUrl.origin}/generators` },
        { '@type': 'ListItem', position: 3, name: 'Генератор Морзе', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta({
  title: 'Азбука Морзе онлайн 2026: переводчик текста, звук и расшифровка',
  description: metaDescription,
  ogTitle: 'Азбука Морзе онлайн 2026: переводчик текста, звук и расшифровка',
  ogDescription: metaDescription,
  ogUrl: canonicalUrl,
  ogImage: ogImageUrl,
  ogType: 'website',
  twitterTitle: 'Азбука Морзе онлайн 2026: переводчик текста, звук и расшифровка',
  twitterDescription: metaDescription,
  twitterImage: ogImageUrl,
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
})

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ]
}))

const storageReady = ref(false)
const STORAGE_KEYS = {
  mode: 'morse:lastMode',
  input: 'morse:inputText',
  speed: 'morse:speed',
  tone: 'morse:tone',
  volume: 'morse:volume'
}

onMounted(() => {
  storageReady.value = true
  if (typeof localStorage !== 'undefined') {
    const savedMode = localStorage.getItem(STORAGE_KEYS.mode) as Mode | null
    if (savedMode === 'text-to-morse' || savedMode === 'morse-to-text') {
      mode.value = savedMode
    }
    const savedInput = localStorage.getItem(STORAGE_KEYS.input)
    if (savedInput !== null) {
      inputText.value = savedInput
    }
    const savedSpeed = localStorage.getItem(STORAGE_KEYS.speed)
    const savedTone = localStorage.getItem(STORAGE_KEYS.tone)
    const savedVolume = localStorage.getItem(STORAGE_KEYS.volume)
    if (savedSpeed) speed.value = Number(savedSpeed) || speed.value
    if (savedTone) tone.value = Number(savedTone) || tone.value
    if (savedVolume) volume.value = Number(savedVolume) || volume.value
  }

  const queryMode = route.query.mode
  const queryText = route.query.text
  if (queryMode === 'text-to-morse' || queryMode === 'morse-to-text') {
    mode.value = queryMode
  }
  const rawText = Array.isArray(queryText) ? queryText[0] : queryText
  if (typeof rawText === 'string' && rawText.length > 0) {
    let decoded = rawText
    try {
      decoded = decodeURIComponent(rawText)
    } catch (error) {
      // keep raw if decode fails
    }
    inputText.value = decoded
  }
})

watch([mode, inputText, speed, tone, volume], () => {
  if (!storageReady.value || typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.mode, mode.value)
  localStorage.setItem(STORAGE_KEYS.input, inputText.value)
  localStorage.setItem(STORAGE_KEYS.speed, String(speed.value))
  localStorage.setItem(STORAGE_KEYS.tone, String(tone.value))
  localStorage.setItem(STORAGE_KEYS.volume, String(volume.value))
})

watch(
  () => [mode.value, inputText.value],
  () => {
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyLabel.value = 'Копировать результат'
    if (shareTimer.value) clearTimeout(shareTimer.value)
    shareLabel.value = 'Поделиться'
  }
)

onBeforeUnmount(() => {
  if (copyTimer.value) clearTimeout(copyTimer.value)
  if (shareTimer.value) clearTimeout(shareTimer.value)
  stopPlayback()
})
</script>

<style scoped>
.morse-page {
  display: grid;
  gap: clamp(22px, 3vw, 38px);
  width: min(1180px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(18px, 3vw, 30px) 0 clamp(36px, 4vw, 64px);
  color: #e2e8f0;
}

.hero {
  text-align: center;
  display: grid;
  gap: 10px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 52px);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 800;
}

.eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 11px;
  color: rgba(110, 231, 183, 0.8);
}

.hero .lead {
  margin: 0;
  max-width: 760px;
  color: #cbd5e1;
  font-size: 16px;
}

.tool-card,
.table-card,
.faq-card,
.punct-card,
.seo-block-card {
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.5));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(18px, 2.6vw, 28px);
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
}

.tool-card::after {
  content: '';
  position: absolute;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.18), transparent 60%);
  right: -90px;
  top: -90px;
  pointer-events: none;
}

.seo-section {
  display: grid;
  gap: clamp(26px, 4vw, 40px);
}

.seo-section > .seo-block-card {
  box-shadow: 0 18px 32px rgba(2, 6, 23, 0.45);
  background-clip: padding-box;
}

.seo-text {
  display: grid;
  gap: clamp(22px, 4vw, 34px);
}

.mode-tabs {
  display: inline-flex;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  padding: 4px;
  gap: 6px;
  width: fit-content;
}

.tab {
  border: none;
  background: transparent;
  color: #cbd5e1;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, transform 0.12s ease;
}

.tab.active {
  background: linear-gradient(130deg, rgba(52, 211, 153, 0.9), rgba(56, 189, 248, 0.8));
  color: #0f172a;
}

.panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.panel {
  display: grid;
  gap: 12px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.panel-head h2 {
  margin: 0 0 4px;
}

.panel-head p {
  margin: 0;
  color: #94a3b8;
  max-width: 360px;
}

.text-area {
  width: 100%;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.7);
  color: #e2e8f0;
  padding: 12px 14px;
  resize: vertical;
  min-height: 220px;
  font-size: 15px;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.text-area::placeholder {
  color: #64748b;
}

.input-hint {
  margin: -4px 0 0;
  color: #94a3b8;
  font-size: 13px;
}

.result-area {
  white-space: pre-wrap;
}

.input-meta {
  display: flex;
  gap: 16px;
  color: #94a3b8;
  font-size: 13px;
  flex-wrap: wrap;
}

.input-meta .info {
  color: rgba(110, 231, 183, 0.9);
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  padding: 10px 14px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.6);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn.primary {
  background: linear-gradient(130deg, rgba(52, 211, 153, 0.8), rgba(56, 189, 248, 0.75));
  border: none;
  color: #0f172a;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.04);
}

.audio-card {
  display: grid;
  gap: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
}

.audio-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.audio-head h3 {
  margin: 0;
}

.audio-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.audio-warning {
  margin: -6px 0 0;
  color: #fca5a5;
  font-size: 13px;
}

.audio-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.audio-panel {
  background: rgba(2, 6, 23, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px;
  display: grid;
  gap: 10px;
}

.block-title {
  margin: 0;
  color: #cbd5e1;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.morse-line {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.8);
  padding: 10px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: #e2e8f0;
  min-height: 52px;
}

.morse-char {
  padding: 1px 4px;
  border-radius: 4px;
}

.morse-char.active {
  background: rgba(52, 211, 153, 0.25);
  color: #d1fae5;
}

.morse-empty {
  color: #64748b;
  font-size: 13px;
}

.audio-settings {
  display: grid;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.45);
}

.preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.setting-label {
  display: flex;
  justify-content: space-between;
  color: #cbd5e1;
  font-size: 13px;
  margin-bottom: 6px;
}

.setting-label span {
  color: rgba(110, 231, 183, 0.9);
  font-weight: 700;
}

.range {
  width: 100%;
  accent-color: #34d399;
}

.seo-text h2,
.table-card h2,
.faq-card h2,
.punct-card h2 {
  margin: 0 0 8px;
}

.seo-text p,
.punct-card p {
  margin: 0 0 14px;
  color: #cbd5e1;
}

.seo-steps {
  background: rgba(2, 6, 23, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px 14px;
}

.seo-media {
  margin: 12px 0 20px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(2, 6, 23, 0.8);
  box-shadow: 0 18px 32px rgba(15, 23, 42, 0.35);
}

.seo-media img {
  width: 100%;
  height: auto;
  display: block;
}

.seo-kicker {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 11px;
  color: rgba(110, 231, 183, 0.8);
  font-weight: 700;
}

.seo-steps ol {
  margin: 0;
  padding-left: 0;
  color: #e2e8f0;
  display: grid;
  gap: 6px;
  font-size: 14px;
  list-style-position: inside;
}

.seo-panel {
  border-radius: 16px;
  padding: 14px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  gap: 10px;
}

.seo-panel h3 {
  margin: 0;
  font-size: 16px;
}

.seo-panel--accent {
  background: radial-gradient(circle at top right, rgba(52, 211, 153, 0.14), transparent 60%),
    rgba(15, 23, 42, 0.6);
  border-color: rgba(52, 211, 153, 0.25);
}

.seo-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.seo-badge {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.18);
  color: rgba(110, 231, 183, 0.95);
  border: 1px solid rgba(52, 211, 153, 0.35);
  font-weight: 700;
}

.seo-checklist {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  color: #cbd5e1;
  font-size: 14px;
}

.seo-inline-note {
  border-radius: 12px;
  padding: 10px 12px;
  background: rgba(2, 6, 23, 0.7);
  border: 1px dashed rgba(148, 163, 184, 0.4);
  color: #e2e8f0;
  font-size: 14px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.seo-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.seo-chip {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.15);
  border: 1px solid rgba(52, 211, 153, 0.35);
  color: #d1fae5;
  font-weight: 600;
}

.seo-list {
  margin: 0;
  padding-left: 18px;
  color: #cbd5e1;
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.seo-links {
  display: grid;
  gap: 10px;
}

.seo-links h3 {
  margin: 0;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: stretch;
}

.link-card {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.15s ease, border-color 0.2s ease, background 0.2s ease;
}

.link-card span:first-child {
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.2;
}

.link-card:hover {
  transform: translateY(-2px);
  border-color: rgba(110, 231, 183, 0.5);
  background: rgba(15, 23, 42, 0.7);
}

.link-tag {
  flex-shrink: 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.15);
  color: rgba(186, 230, 253, 0.95);
  border: 1px solid rgba(56, 189, 248, 0.35);
  white-space: nowrap;
}

.table-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.table-panel {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px;
  background: rgba(15, 23, 42, 0.5);
}

.table-list {
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.table-list li {
  display: flex;
  justify-content: space-between;
}

.code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: rgba(110, 231, 183, 0.9);
}

.extras {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.faq-list {
  display: grid;
  gap: 10px;
}

.faq-item {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.faq-item.open {
  border-color: rgba(52, 211, 153, 0.45);
  background: rgba(255, 255, 255, 0.04);
}

.faq-toggle {
  width: 100%;
  border: none;
  background: transparent;
  color: #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  cursor: pointer;
  font-weight: 700;
  text-align: left;
}

.faq-toggle .icon {
  font-size: 18px;
}

.faq-body {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease;
  padding: 0 14px;
}

.faq-item.open .faq-body {
  max-height: 220px;
  opacity: 1;
  padding-bottom: 12px;
}

.faq-body p {
  margin: 0;
  color: #cbd5e1;
}

.punct-card {
  display: grid;
  gap: 12px;
}

.punct-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 8px;
}

.punct-item {
  display: flex;
  justify-content: space-between;
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 14px;
}

@media (max-width: 720px) {
  .panel-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .mode-tabs {
    width: 100%;
    justify-content: center;
  }

  .audio-head {
    align-items: flex-start;
  }
}
</style>
