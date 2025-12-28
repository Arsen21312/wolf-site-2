<template>
  <main class="lorem-page">
    <section class="lorem-hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Волчий текст онлайн</h1>
      <p class="hero-subtitle">
        Генерируй абзацы и предложения про волков для макетов, постов и заглушек
      </p>
    </section>

    <section class="lorem-app">
      <div class="settings-card">
        <div class="settings-head">
          <div>
            <h2>Настройки генерации</h2>
            <p>Выбери формат, стиль и тон — генерация по кнопке.</p>
          </div>
          <button class="ghost-btn outline" type="button" @click="scrollToSeo">Это что?</button>
        </div>

        <div class="settings-grid">
          <div class="field">
            <p class="field-title">Количество</p>
            <div class="pill-row">
              <label
                v-for="option in modeOptions"
                :key="option.value"
                class="pill"
                :class="{ active: mode === option.value }"
              >
                <input v-model="mode" type="radio" name="mode" :value="option.value" />
                <span class="pill-title">{{ option.title }}</span>
                <span class="pill-desc">{{ option.description }}</span>
              </label>
            </div>
          </div>

          <div class="field inline">
            <label class="field-title" for="count-input">Число (1–50)</label>
            <input
              id="count-input"
              v-model.number="count"
              type="number"
              min="1"
              max="50"
              class="number-input"
            />
          </div>

          <div class="field">
            <p class="field-title">Длина абзаца</p>
            <div class="chip-row">
              <label
                v-for="option in paragraphOptions"
                :key="option.value"
                class="chip"
                :class="{ active: paragraphLength === option.value, disabled: mode !== 'paragraphs' }"
              >
                <input
                  v-model="paragraphLength"
                  type="radio"
                  name="paragraph-length"
                  :value="option.value"
                  :disabled="mode !== 'paragraphs'"
                />
                <span>{{ option.title }}</span>
              </label>
            </div>
          </div>

          <div class="field">
            <p class="field-title">Стиль</p>
            <div class="chip-row">
              <label
                v-for="option in styleOptions"
                :key="option.value"
                class="chip"
                :class="{ active: style === option.value }"
              >
                <input v-model="style" type="radio" name="style" :value="option.value" />
                <span>{{ option.title }}</span>
              </label>
            </div>
          </div>

          <div class="field">
            <p class="field-title">Тон</p>
            <div class="chip-row">
              <label
                v-for="option in toneOptions"
                :key="option.value"
                class="chip"
                :class="{ active: tone === option.value }"
              >
                <input v-model="tone" type="radio" name="tone" :value="option.value" />
                <span>{{ option.title }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="toggle-grid">
          <label class="toggle">
            <input v-model="ensureWolf" type="checkbox" />
            <span class="toggle-ui" />
            <span class="toggle-text">Всегда вставлять слово “волк” минимум 1 раз в абзац</span>
          </label>
          <label class="toggle">
            <input v-model="addEmoji" type="checkbox" />
            <span class="toggle-ui" />
            <span class="toggle-text">Добавлять эмодзи</span>
          </label>
          <label class="toggle">
            <input v-model="addAuf" type="checkbox" />
            <span class="toggle-ui" />
            <span class="toggle-text">Добавлять “ауф” иногда</span>
          </label>
          <label class="toggle">
            <input v-model="repeatable" type="checkbox" />
            <span class="toggle-ui" />
            <span class="toggle-text">Повторяемость (детерминированный сид)</span>
          </label>
          <label class="toggle danger">
            <input v-model="allow18Plus" type="checkbox" />
            <span class="toggle-ui" />
            <span class="toggle-text">18+ (мягко острее, без жести)</span>
          </label>
        </div>

        <div class="action-row">
          <button class="primary-btn" type="button" @click="generateText">Сгенерировать</button>
          <button class="ghost-btn" type="button" :disabled="!resultText" @click="copyResult">
            {{ copyLabel }}
          </button>
          <button class="ghost-btn" type="button" :disabled="!resultText" @click="clearAll">
            Очистить
          </button>
          <button
            class="ghost-btn"
            type="button"
            :disabled="!canRefreshParagraph"
            @click="refreshParagraph"
          >
            Обновить только один абзац
          </button>
        </div>
      </div>

      <div class="result-card">
        <div class="result-head">
          <h2>Результат</h2>
          <span class="result-meta">{{ resultMeta }}</span>
        </div>
        <div class="result-output" role="status" aria-live="polite">
          {{ resultText || 'Нажми “Сгенерировать”, чтобы получить волчий текст.' }}
        </div>
      </div>
    </section>

    <section class="preset-card">
      <div>
        <h2>Примеры</h2>
        <p>Быстрые пресеты — один клик, и текст готов.</p>
      </div>
      <div class="preset-grid">
        <button
          v-for="preset in presets"
          :key="preset.label"
          class="preset-btn"
          type="button"
          @click="applyPreset(preset)"
        >
          <span class="preset-title">{{ preset.label }}</span>
          <span class="preset-desc">{{ preset.description }}</span>
        </button>
      </div>
    </section>

    <section id="seo" class="seo-card">
      <article class="seo-article">
        <h2>Волчий текст без стыда и кринжа</h2>
        <p>
          Этот генератор помогает быстро заполнить макеты, презентации и лендинги живым
          текстом про волков. Никаких внешних API — всё локально, всё работает в браузере.
          Нужны абзацы для лэндинга, короткие предложения для поста или набор слов для
          интерфейса — выбирай режим и получай текст сразу.
        </p>
        <p>
          Мы собрали фразы-начала, глаголы, прилагательные и связки, чтобы каждый абзац
          звучал по-волчьи, но без жесткого трэша и мата по умолчанию. Есть стиль
          «мемный», «мотивационный» или «темный юмор» — последний без жести, только с
          легкой иронией.
        </p>
        <p>
          Переключай тон: дружелюбный, дерзкий или спокойный. Добавляй эмодзи или «ауф»
          для настроения, включай 18+ для чуть более резких шуток — но без жесткой
          порнухи и призывов к насилию. Всё продумано так, чтобы текст оставался
          универсальным и пригодным для публичных макетов.
        </p>
      </article>

      <div class="seo-grid">
        <div class="seo-block">
          <h3>Когда пригодится</h3>
          <ul>
            <li>Лендинги, где нужен текст-заглушка</li>
            <li>Посты и сторис с волчьим вайбом</li>
            <li>Интерфейсные заглушки и мокапы</li>
            <li>Описание товара с характером</li>
          </ul>
        </div>
        <div class="seo-block">
          <h3>Что внутри генерации</h3>
          <ul>
            <li>Шаблоны для сборки предложений</li>
            <li>Наборы глаголов и прилагательных</li>
            <li>Стилевые вставки и мемные фразы</li>
            <li>Контроль длины абзаца</li>
          </ul>
        </div>
      </div>

      <div class="faq">
        <h3>FAQ</h3>
        <div class="faq-list">
          <div
            v-for="(item, idx) in faqItems"
            :key="item.q"
            class="faq-item"
            :class="{ open: openFaq === idx }"
          >
            <button class="faq-toggle" type="button" @click="toggleFaq(idx)">
              <span>{{ item.q }}</span>
              <span class="icon">{{ openFaq === idx ? '−' : '+' }}</span>
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

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { computed, onBeforeUnmount, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import { buildWolfParagraph, generateWolfLorem } from '@/utils/text/wolfLorem'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Волчий рыбий текст' }
]

definePageMeta({
  alias: ['/generators/wolf-lorem', '/generators/wolf-lorem/']
})

const modeOptions = [
  { value: 'paragraphs', title: 'Абзацы', description: 'Полные блоки текста' },
  { value: 'sentences', title: 'Предложения', description: 'Короткие фразы' },
  { value: 'words', title: 'Слова', description: 'Набор для интерфейсов' }
]

const paragraphOptions = [
  { value: 'short', title: 'Короткий' },
  { value: 'medium', title: 'Средний' },
  { value: 'long', title: 'Длинный' }
]

const styleOptions = [
  { value: 'neutral', title: 'Нейтральный' },
  { value: 'meme', title: 'Мемный' },
  { value: 'motivation', title: 'Мотивационный' },
  { value: 'dark', title: 'Темный юмор' }
]

const toneOptions = [
  { value: 'friendly', title: 'Дружелюбный' },
  { value: 'bold', title: 'Дерзкий' },
  { value: 'calm', title: 'Спокойный' }
]

const presets = [
  {
    label: 'Для лендинга',
    description: '3 абзаца, нейтральный, спокойный',
    settings: {
      mode: 'paragraphs',
      count: 3,
      paragraphLength: 'medium',
      style: 'neutral',
      tone: 'calm',
      ensureWolf: true,
      addEmoji: false,
      addAuf: false,
      allow18Plus: false,
      repeatable: false
    }
  },
  {
    label: 'Для поста',
    description: '4 предложения, мотивация и дерзость',
    settings: {
      mode: 'sentences',
      count: 4,
      paragraphLength: 'short',
      style: 'motivation',
      tone: 'bold',
      ensureWolf: true,
      addEmoji: true,
      addAuf: true,
      allow18Plus: false,
      repeatable: false
    }
  },
  {
    label: 'Для интерфейса',
    description: '24 слова, нейтрально и спокойно',
    settings: {
      mode: 'words',
      count: 24,
      paragraphLength: 'short',
      style: 'neutral',
      tone: 'calm',
      ensureWolf: true,
      addEmoji: false,
      addAuf: false,
      allow18Plus: false,
      repeatable: false
    }
  },
  {
    label: 'Для описания товара',
    description: '2 абзаца, дружелюбно, без мема',
    settings: {
      mode: 'paragraphs',
      count: 2,
      paragraphLength: 'short',
      style: 'neutral',
      tone: 'friendly',
      ensureWolf: true,
      addEmoji: false,
      addAuf: false,
      allow18Plus: false,
      repeatable: false
    }
  }
]

const mode = ref('paragraphs')
const count = ref(3)
const paragraphLength = ref('medium')
const style = ref('neutral')
const tone = ref('friendly')
const ensureWolf = ref(true)
const addEmoji = ref(false)
const addAuf = ref(false)
const allow18Plus = ref(false)
const repeatable = ref(false)

const resultText = ref('')
const paragraphs = ref([])
const copyLabel = ref('Скопировать')
const copyTimer = ref(null)
const openFaq = ref(null)
const refreshCount = ref(0)

const resultMeta = computed(() => {
  if (!resultText.value) return 'Готов к генерации'
  if (mode.value === 'words') return `${count.value} слов`
  if (mode.value === 'sentences') return `${count.value} предложений`
  return `${paragraphs.value.length || count.value} абзаца`
})

const canRefreshParagraph = computed(
  () => mode.value === 'paragraphs' && paragraphs.value.length > 0
)

const faqItems = [
  {
    q: 'Можно использовать текст в коммерческих макетах?',
    a: 'Да, это обычный локальный генератор без ограничений. Используйте в презентациях, лендингах и UI.'
  },
  {
    q: 'Есть ли мат и жесткий контент?',
    a: 'По умолчанию нет. Тумблер 18+ добавляет чуть более резкие шутки, но без порнухи и насилия.'
  },
  {
    q: 'Чем отличаются стили?',
    a: 'Нейтральный — базовый, мемный — с легкими вставками, мотивационный — про движение, темный — с иронией.'
  },
  {
    q: 'Почему абзацы разной длины?',
    a: 'Длина рандомится внутри выбранного диапазона, чтобы текст выглядел естественно.'
  },
  {
    q: 'Можно ли получить одинаковый результат?',
    a: 'Да, включи “Повторяемость”, и генерация будет детерминированной для текущих настроек.'
  }
]

const normalizeCount = (value) => Math.max(1, Math.min(50, Math.round(value || 1)))

const buildOptions = (extra = {}) => ({
  mode: mode.value,
  count: normalizeCount(count.value),
  paragraphLength: paragraphLength.value,
  style: style.value,
  tone: tone.value,
  ensureWolf: ensureWolf.value,
  addEmoji: addEmoji.value,
  addAuf: addAuf.value,
  allow18Plus: allow18Plus.value,
  repeatable: repeatable.value,
  ...extra
})

function randomIndex(max) {
  if (max <= 0) return 0
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) return Math.floor(Math.random() * max)
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
}

function resetCopyLabel() {
  copyLabel.value = 'Скопировать'
}

function generateText() {
  count.value = normalizeCount(count.value)
  const result = generateWolfLorem(buildOptions())
  resultText.value = result.text
  paragraphs.value = result.paragraphs
  resetCopyLabel()
}

function refreshParagraph() {
  if (!canRefreshParagraph.value) return
  refreshCount.value += 1
  const index = randomIndex(paragraphs.value.length)
  const paragraph = buildWolfParagraph(
    buildOptions({ count: 1, seedSalt: refreshCount.value + index })
  )
  const next = [...paragraphs.value]
  next[index] = paragraph
  paragraphs.value = next
  resultText.value = next.join('\n\n')
  resetCopyLabel()
}

function clearAll() {
  resultText.value = ''
  paragraphs.value = []
  resetCopyLabel()
}

async function copyResult() {
  if (!resultText.value) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(resultText.value)
    copyLabel.value = '✅ Скопировано'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Скопировать'
    }, 2000)
  } catch (err) {
    copyLabel.value = 'Не удалось'
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copyLabel.value = 'Скопировать'
    }, 2000)
  }
}

function applyPreset(preset) {
  mode.value = preset.settings.mode
  count.value = preset.settings.count
  paragraphLength.value = preset.settings.paragraphLength
  style.value = preset.settings.style
  tone.value = preset.settings.tone
  ensureWolf.value = preset.settings.ensureWolf
  addEmoji.value = preset.settings.addEmoji
  addAuf.value = preset.settings.addAuf
  allow18Plus.value = preset.settings.allow18Plus
  repeatable.value = preset.settings.repeatable
  generateText()
}

function toggleFaq(idx) {
  openFaq.value = openFaq.value === idx ? null : idx
}

function scrollToSeo() {
  if (typeof document === 'undefined') return
  const el = document.getElementById('seo')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onBeforeUnmount(() => {
  if (copyTimer.value) clearTimeout(copyTimer.value)
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/tools/wolf-lorem`)
const metaDescription =
  'Сгенерируй рыбий текст про волков. Абзацы, предложения, слова. Мемный или нейтральный стиль, копирование в один клик'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Волчий рыбий текст',
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
        { '@type': 'ListItem', position: 3, name: 'Волчий рыбий текст', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Волчий рыбий текст | Генератор текста про волков',
  description: metaDescription,
  ogTitle: 'Волчий рыбий текст | Генератор текста про волков',
  ogDescription: metaDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
}))

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ]
}))
</script>

<style scoped>
.lorem-page {
  display: grid;
  gap: clamp(20px, 3vw, 40px);
  width: min(1160px, 100% - clamp(24px, 6vw, 80px));
  margin: 0 auto;
  padding: clamp(20px, 3vw, 36px) 0 clamp(40px, 5vw, 68px);
  color: #e5e7eb;
}

.lorem-hero {
  text-align: center;
  display: grid;
  gap: 12px;
  justify-items: center;
  position: relative;
}

.lorem-hero::before {
  content: '';
  position: absolute;
  inset: -40px 10% auto;
  height: 220px;
  background: radial-gradient(circle at top, rgba(34, 197, 94, 0.2), transparent 60%);
  z-index: -1;
}

.hero-kicker {
  margin: 0;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.lorem-hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 56px);
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
  line-height: 1.05;
}

.hero-subtitle {
  margin: 0;
  max-width: 720px;
  color: #cbd5e1;
  font-size: clamp(15px, 2vw, 18px);
}

.lorem-app {
  display: grid;
  gap: clamp(16px, 3vw, 28px);
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: start;
}

.settings-card,
.result-card,
.preset-card,
.seo-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(18px, 3vw, 28px);
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
}

.settings-card::after {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 60%);
  right: -80px;
  bottom: -90px;
  pointer-events: none;
}

.settings-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.settings-head h2 {
  margin: 0 0 6px;
}

.settings-head p {
  margin: 0;
  color: #94a3b8;
}

.outline {
  border: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
}

.settings-grid {
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 10px;
}

.field.inline {
  align-items: start;
}

.field-title {
  margin: 0;
  color: #cbd5e1;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.pill-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.pill {
  position: relative;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  display: grid;
  gap: 4px;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.12s ease;
}

.pill input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.pill-title {
  font-weight: 700;
}

.pill-desc {
  color: #94a3b8;
  font-size: 12px;
}

.pill.active {
  border-color: rgba(34, 197, 94, 0.6);
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.18), rgba(56, 189, 248, 0.12));
  transform: translateY(-1px);
}

.number-input {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.05);
  padding: 10px 12px;
  color: #fff;
  font-size: 16px;
  width: 140px;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  position: relative;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.chip input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.chip.active {
  border-color: rgba(56, 189, 248, 0.6);
  background: rgba(56, 189, 248, 0.18);
}

.chip.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-grid {
  display: grid;
  gap: 10px;
}

.toggle {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
}

.toggle input {
  position: absolute;
  opacity: 0;
}

.toggle-ui {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  transition: background 0.2s ease;
}

.toggle-ui::after {
  content: '';
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease;
}

.toggle input:checked + .toggle-ui {
  background: rgba(34, 197, 94, 0.6);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(16px);
}

.toggle-text {
  color: #e2e8f0;
  font-size: 14px;
}

.toggle.danger input:checked + .toggle-ui {
  background: rgba(239, 68, 68, 0.6);
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary-btn,
.ghost-btn {
  border-radius: 999px;
  padding: 12px 18px;
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.12s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.primary-btn {
  background: linear-gradient(120deg, #22c55e, #16a34a);
  color: #0b1220;
  box-shadow: 0 14px 28px rgba(34, 197, 94, 0.2);
}

.ghost-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e5e7eb;
}

.ghost-btn:disabled,
.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.result-card {
  min-height: 380px;
}

.result-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.result-head h2 {
  margin: 0;
}

.result-meta {
  color: #94a3b8;
  font-size: 13px;
}

.result-output {
  white-space: pre-wrap;
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px 16px;
  line-height: 1.6;
  min-height: 280px;
}

.preset-card {
  display: grid;
  gap: 16px;
}

.preset-card h2 {
  margin: 0 0 6px;
}

.preset-card p {
  margin: 0;
  color: #94a3b8;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.preset-btn {
  text-align: left;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  padding: 14px;
  color: inherit;
  cursor: pointer;
  display: grid;
  gap: 6px;
  transition: transform 0.12s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.preset-btn:hover {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.6);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.4);
}

.preset-title {
  font-weight: 800;
}

.preset-desc {
  color: #94a3b8;
  font-size: 13px;
}

.seo-card {
  gap: 20px;
}

.seo-article h2 {
  margin: 0 0 10px;
}

.seo-article p {
  margin: 0 0 12px;
  color: #cbd5e1;
}

.seo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.seo-block {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px;
}

.seo-block h3 {
  margin: 0 0 10px;
}

.seo-block ul {
  margin: 0;
  padding-left: 18px;
  color: #cbd5e1;
  display: grid;
  gap: 6px;
}

.faq h3 {
  margin: 0 0 12px;
}

.faq-list {
  display: grid;
  gap: 10px;
}

.faq-item {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.faq-item.open {
  border-color: rgba(34, 197, 94, 0.5);
  background: rgba(34, 197, 94, 0.08);
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

@media (max-width: 900px) {
  .settings-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .result-head {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 720px) {
  .lorem-page {
    width: min(100%, 100% - 24px);
  }

  .number-input {
    width: 100%;
  }

  .action-row {
    flex-direction: column;
  }

  .result-output {
    min-height: 220px;
  }
}
</style>
