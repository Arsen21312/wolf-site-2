<template>
  <main class="password-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Генератор паролей онлайн</h1>
      <p class="lead">
        Создавай надежные пароли за секунду. Без регистрации, без сохранения.
      </p>
    </header>

    <section class="results-card" id="result">
      <div class="results-head">
        <div>
          <h2>Результат</h2>
          <p class="results-sub">Локальная генерация. Ничего не отправляется на сервер.</p>
        </div>
        <div class="results-actions">
          <button class="btn primary" type="button" @click="generateAll">
            Сгенерировать
          </button>
          <button
            class="btn ghost"
            type="button"
            :disabled="passwords.length === 0"
            @click="copyAll"
          >
            {{ copyAllLabel }}
          </button>
          <button
            class="btn ghost"
            type="button"
            :disabled="passwords.length === 0"
            @click="downloadTxt"
          >
            Скачать как TXT
          </button>
        </div>
      </div>

      <div v-if="passwords.length" class="password-grid">
        <article v-for="(item, index) in passwords" :key="`${item.password}-${index}`" class="password-card">
          <code class="password-text">{{ item.password }}</code>
          <div class="password-meta">
            <span class="strength-pill" :class="strengthClass(item.strength.label)">
              {{ strengthTitle(item.strength.label) }}
            </span>
            <span class="crack-time">
              Примерное время взлома: {{ item.strength.crackTimeLabel }}
            </span>
          </div>
          <div class="card-actions">
            <button class="btn ghost" type="button" @click="copyPassword(index)">
              {{ copiedIndex === index ? 'Скопировано' : 'Копировать' }}
            </button>
            <button class="btn ghost" type="button" @click="refreshPassword(index)">
              Обновить этот
            </button>
          </div>
        </article>
      </div>
      <p v-else class="empty-state">
        Нажми «Сгенерировать», чтобы получить первую пачку паролей.
      </p>
    </section>

    <section class="config-card">
      <div class="config-grid">
        <div class="panel summary">
          <details class="summary-disclosure">
            <summary>
              <span class="summary-title">Что получится</span>
              <span class="summary-icon" aria-hidden="true">?</span>
            </summary>
            <div class="summary-block">
              <p>
                Выбрано групп: <strong>{{ selectedGroupsCount }}</strong>
              </p>
              <p v-if="poolSize">
                Пул символов: <strong>{{ poolSize }}</strong>
              </p>
              <p v-if="currentStrength">
                Энтропия: ~ <strong>{{ currentStrength.entropy.toFixed(0) }}</strong> бит
              </p>
              <p v-if="currentStrength">
                Сила: <strong>{{ strengthTitle(currentStrength.label) }}</strong>,
                взлом — примерно {{ currentStrength.crackTimeLabel }}.
              </p>
            </div>
          </details>

          <div v-if="warningMessage" class="warning" role="status">
            {{ warningMessage }}
          </div>

          <div v-if="errors.length" class="error" role="alert">
            <p v-for="err in errors" :key="err">{{ err }}</p>
          </div>
        </div>

        <div class="panel settings">
          <div class="panel-head">
            <h2>Настройки</h2>
            <p>Настраивай длину, группы символов и правила генерации.</p>
          </div>

          <div class="control">
            <label for="length-range">Длина пароля</label>
            <div class="range-row">
              <input
                id="length-range"
                v-model.number="length"
                type="range"
                min="6"
                max="64"
                step="1"
              />
              <input
                v-model.number="length"
                type="number"
                min="6"
                max="64"
                step="1"
                @change="normalizeSettings"
              />
            </div>
          </div>
          <details class="settings-disclosure">
            <summary>Дополнительные настройки</summary>
            <div class="settings-body">
                              <div class="control">
                <label for="count-input">Колличество паролей</label>
                <input
                  id="count-input"
                  v-model.number="count"
                  type="number"
                  min="1"
                  max="20"
                  step="1"
                  @change="normalizeSettings"
                />
              </div>

                <div class="toggle-grid">
              <label class="toggle">
                <input v-model="useLowercase" type="checkbox" />
                <span class="toggle-ui" aria-hidden="true"></span>
                <span>Строчные буквы a–z</span>
              </label>
              <label class="toggle">
                <input v-model="useUppercase" type="checkbox" />
                <span class="toggle-ui" aria-hidden="true"></span>
                <span>Заглавные A–Z</span>
              </label>
              <label class="toggle">
                <input v-model="useNumbers" type="checkbox" />
                <span class="toggle-ui" aria-hidden="true"></span>
                <span>Цифры 0–9</span>
              </label>
              <label class="toggle">
                <input v-model="useSymbols" type="checkbox" />
                <span class="toggle-ui" aria-hidden="true"></span>
                <span>Символы !@#$%^&* и т.д.</span>
              </label>
              <label class="toggle">
                <input v-model="excludeSimilar" type="checkbox" />
                <span class="toggle-ui" aria-hidden="true"></span>
                <span>Исключить похожие символы (0 O l 1 I)</span>
              </label>
              <label class="toggle">
                <input v-model="excludeAmbiguous" type="checkbox" />
                <span class="toggle-ui" aria-hidden="true"></span>
                <span>Без неоднозначных символов (кавычки, пробелы)</span>
              </label>
              <label class="toggle">
                <input v-model="requireEachSelected" type="checkbox" />
                <span class="toggle-ui" aria-hidden="true"></span>
                <span>Минимум 1 символ из каждой выбранной группы</span>
              </label>
              <label class="toggle">
                <input v-model="wolfMode" type="checkbox" />
                <span class="toggle-ui" aria-hidden="true"></span>
                <span>Волчий режим: иногда «wolf» или «AUF»</span>
              </label>
                </div>
            </div>
          </details>
        </div>
      </div>
    </section>

    <section class="tips-card">
      <h2>Мини подсказки безопасности</h2>
      <div class="tips-grid">
        <article class="tip">Не повторяй пароли между сервисами.</article>
        <article class="tip">Лучше использовать менеджер паролей.</article>
        <article class="tip">Включай 2FA где это возможно.</article>
      </div>
    </section>

    <section class="seo-card">
      <div class="seo-text">
        <h2>Как сделать надежный пароль</h2>
        <p>
          Хороший пароль — это длина, разнообразие символов и уникальность. Чем длиннее строка и
          чем больше разных групп символов в пуле, тем выше энтропия и сложнее подбор.
        </p>

        <h2>Какая длина пароля нормальная в 2025</h2>
        <p>
          Минимальный разумный уровень — 12–16 символов для бытовых сервисов. Для критичных
          аккаунтов лучше 18–24. Длина — самый надежный и понятный буст безопасности.
        </p>

        <h2>Символы, фразы и менеджеры паролей</h2>
        <p>
          Спецсимволы помогают, но только вместе с длиной. Если сложно запоминать — используй
          менеджер паролей и длинные фразы. Это снижает риск повторов и утечек.
        </p>

        <h2>Почему нельзя использовать один пароль везде</h2>
        <p>
          При утечке одного сервиса автоматически страдают все остальные. Уникальные пароли для
          каждого сайта — простая защита от цепных компромиссов.
        </p>

        <h2>Что дает 2FA</h2>
        <p>
          Двухфакторная аутентификация добавляет второй рубеж — даже при утечке пароля злоумышленник
          не пройдет без дополнительного подтверждения.
        </p>
      </div>
    </section>

    <section class="extras">
      <div class="other-card">
        <h2>Другие генераторы</h2>
        <div class="other-grid">
          <NuxtLink class="other-link" to="/generators/text-case">
            <span class="other-title">Изменение регистра</span>
            <span class="other-desc">CamelCase, snake_case, Title Case и другие режимы.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/remove-spaces">
            <span class="other-title">Удаление лишних пробелов</span>
            <span class="other-desc">Чистка текста от пустых строк и табов.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/wolf-lorem">
            <span class="other-title">Волчий рыбий текст</span>
            <span class="other-desc">Абзацы и предложения про волков.</span>
          </NuxtLink>
          <NuxtLink class="other-link" to="/generators/text-counter">
            <span class="other-title">Счетчик текста</span>
            <span class="other-desc">Символы, слова и строки за секунду.</span>
          </NuxtLink>
        </div>
      </div>

      <div class="faq-card">
        <h2>FAQ</h2>
        <div class="faq-list">
          <div
            v-for="(item, idx) in faqItems"
            :key="item.q"
            class="faq-item"
            :class="{ open: openFaq === idx }"
          >
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import {
  generatePasswordSet,
  type PasswordGenerationResult,
  type PasswordOptions,
  type PasswordStrength,
  type PasswordStrengthLabel
} from '@/utils/security/passwords'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Генератор паролей' }
]

const length = ref(16)
const count = ref(1)

const useLowercase = ref(true)
const useUppercase = ref(true)
const useNumbers = ref(true)
const useSymbols = ref(true)
const excludeSimilar = ref(false)
const excludeAmbiguous = ref(true)
const requireEachSelected = ref(true)
const wolfMode = ref(false)

const errors = ref<string[]>([])
const passwords = ref<PasswordGenerationResult[]>([])
const poolSize = ref<number | null>(null)
const currentStrength = ref<PasswordStrength | null>(null)
const copiedIndex = ref<number | null>(null)
const copyAllLabel = ref('Скопировать все')
const openFaq = ref<number | null>(null)

const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const copyAllTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const selectedGroupsCount = computed(
  () =>
    Number(useLowercase.value) +
    Number(useUppercase.value) +
    Number(useNumbers.value) +
    Number(useSymbols.value)
)

const warningMessage = computed(() => {
  if (!requireEachSelected.value) return ''
  if (length.value < selectedGroupsCount.value && selectedGroupsCount.value > 0) {
    return 'Длина меньше числа выбранных групп. Увеличь длину или отключи обязательный минимум.'
  }
  return ''
})

const strengthTitles: Record<PasswordStrengthLabel, string> = {
  слабый: 'Слабый',
  норм: 'Норм',
  сильный: 'Сильный',
  зверь: 'Зверь'
}

function strengthTitle(label: PasswordStrengthLabel): string {
  return strengthTitles[label] ?? label
}

function strengthClass(label: PasswordStrengthLabel): string {
  switch (label) {
    case 'слабый':
      return 'weak'
    case 'норм':
      return 'okay'
    case 'сильный':
      return 'strong'
    default:
      return 'beast'
  }
}

function normalizeSettings() {
  length.value = Math.min(64, Math.max(6, Math.round(length.value)))
  count.value = Math.min(20, Math.max(1, Math.round(count.value)))
}

function buildOptions(): PasswordOptions {
  return {
    length: length.value,
    useLowercase: useLowercase.value,
    useUppercase: useUppercase.value,
    useNumbers: useNumbers.value,
    useSymbols: useSymbols.value,
    excludeSimilar: excludeSimilar.value,
    excludeAmbiguous: excludeAmbiguous.value,
    requireEachSelected: requireEachSelected.value,
    wolfMode: wolfMode.value
  }
}

function setError(code: string) {
  if (code === 'NO_GROUPS') {
    errors.value = ['Выключены все группы символов. Выбери хотя бы одну.']
  } else if (code === 'LENGTH_TOO_SHORT') {
    errors.value = [
      'Длина меньше количества выбранных групп. Увеличь длину или выключи обязательный минимум.'
    ]
  } else if (code === 'EMPTY_POOL') {
    errors.value = ['Пул символов пуст. Ослабь фильтры и попробуй снова.']
  } else if (code === 'CRYPTO_UNAVAILABLE') {
    errors.value = ['Crypto API недоступен. Попробуй другой браузер.']
  } else {
    errors.value = ['Не удалось сгенерировать пароль.']
  }
}

function updateStrengthFromResults(results: PasswordGenerationResult[]) {
  if (results.length > 0) {
    currentStrength.value = results[0].strength
  }
}

function generateAll() {
  normalizeSettings()
  errors.value = []
  const options = buildOptions()
  const { results, error, poolSize: pool } = generatePasswordSet(options, count.value)
  if (error) {
    setError(error.code)
    passwords.value = []
    poolSize.value = null
    currentStrength.value = null
    return
  }
  passwords.value = results ?? []
  poolSize.value = pool ?? null
  updateStrengthFromResults(results ?? [])
}

async function copyPassword(index: number) {
  const item = passwords.value[index]
  if (!item) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return

  try {
    await navigator.clipboard.writeText(item.password)
    copiedIndex.value = index
    if (copyTimer.value) clearTimeout(copyTimer.value)
    copyTimer.value = setTimeout(() => {
      copiedIndex.value = null
    }, 2000)
  } catch (err) {
    copiedIndex.value = null
  }
}

async function copyAll() {
  if (passwords.value.length === 0) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  const payload = passwords.value.map((item) => item.password).join('\n')

  try {
    await navigator.clipboard.writeText(payload)
    copyAllLabel.value = 'Скопировано'
    if (copyAllTimer.value) clearTimeout(copyAllTimer.value)
    copyAllTimer.value = setTimeout(() => {
      copyAllLabel.value = 'Скопировать все'
    }, 2000)
  } catch (err) {
    copyAllLabel.value = 'Не удалось'
    if (copyAllTimer.value) clearTimeout(copyAllTimer.value)
    copyAllTimer.value = setTimeout(() => {
      copyAllLabel.value = 'Скопировать все'
    }, 2000)
  }
}

function downloadTxt() {
  if (passwords.value.length === 0) return
  if (typeof document === 'undefined') return
  const payload = passwords.value.map((item) => item.password).join('\n')
  const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'passwords.txt'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function refreshPassword(index: number) {
  normalizeSettings()
  const options = buildOptions()
  const { results, error, poolSize: pool } = generatePasswordSet(options, 1)
  if (error || !results || results.length === 0) {
    setError(error?.code ?? 'UNKNOWN')
    return
  }
  passwords.value.splice(index, 1, results[0])
  updateStrengthFromResults(results)
  poolSize.value = pool ?? poolSize.value
}

const faqItems = [
  {
    q: 'Сколько символов нужно для надежного пароля?',
    a: 'Для большинства сервисов хватит 12–16 символов. Для важных аккаунтов лучше 18+.'
  },
  {
    q: 'Нужны ли спецсимволы?',
    a: 'Да, но они полезны только вместе с длиной. 16 символов с цифрами и буквами уже хорошо.'
  },
  {
    q: 'Опасно ли генерить пароль онлайн?',
    a: 'Этот генератор работает локально в браузере. Пароли не отправляются на сервер.'
  },
  {
    q: 'Почему Math.random хуже?',
    a: 'Math.random предсказуем и не предназначен для безопасности. crypto.getRandomValues лучше.'
  },
  {
    q: 'Можно ли хранить пароли в браузере?',
    a: 'Лучше использовать менеджер паролей с шифрованием и синхронизацией.'
  },
  {
    q: 'Что делать если пароль утек?',
    a: 'Сразу меняй пароль, отключай активные сессии и включай 2FA.'
  }
]

function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? null : idx
}

onMounted(() => {
  generateAll()
})

onBeforeUnmount(() => {
  if (copyTimer.value) clearTimeout(copyTimer.value)
  if (copyAllTimer.value) clearTimeout(copyAllTimer.value)
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators/password-generator`)
const metaDescription =
  'Сгенерируй надежные пароли с буквами, цифрами и символами. Оценка силы, копирование и скачивание TXT.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Генератор паролей онлайн',
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
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Генераторы',
          item: `${requestUrl.origin}/generators`
        },
        { '@type': 'ListItem', position: 3, name: 'Генератор паролей', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Генератор паролей онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Генератор паролей онлайн | Neural Wise Wolf',
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
.password-page {
  display: grid;
  gap: clamp(24px, 3vw, 40px);
  width: min(1180px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(20px, 3vw, 32px) 0 clamp(32px, 4vw, 64px);
  position: relative;
}

.hero {
  text-align: center;
  display: grid;
  gap: 12px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 52px);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 800;
}

.hero .lead {
  margin: 0;
  color: #cbd5e1;
  max-width: 720px;
}

.config-card,
.results-card,
.tips-card,
.seo-card,
.other-card,
.faq-card {
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.4));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(18px, 2.6vw, 28px);
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
}

.config-card::after {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.18), transparent 60%);
  right: -80px;
  bottom: -90px;
  pointer-events: none;
}

.config-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(16px, 2vw, 24px);
}

.panel {
  display: grid;
  gap: 16px;
}

.panel-head h2 {
  margin: 0 0 6px;
}

.panel-head p {
  margin: 0;
  color: #94a3b8;
}

.control {
  display: grid;
  gap: 8px;
}

.control label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #cbd5e1;
}

.range-row {
  display: grid;
  grid-template-columns: 1fr 80px;
  gap: 12px;
  align-items: center;
}

input[type='range'] {
  width: 100%;
}

input[type='number'] {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(15, 23, 42, 0.6);
  color: #fff;
  padding: 10px 12px;
  outline: none;
  font-weight: 600;
}

.toggle-grid {
  display: grid;
  gap: 10px;
}


.settings-disclosure {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.5);
  padding: 12px 14px;
}

.settings-disclosure summary {
  cursor: pointer;
  font-weight: 700;
  color: #e2e8f0;
  list-style: none;
}

.settings-disclosure summary::-webkit-details-marker {
  display: none;
}

.settings-disclosure summary::after {
  content: '+';
  float: right;
  font-size: 18px;
  line-height: 1;
}

.settings-disclosure[open] summary::after {
  content: '-';
}

.settings-body {
  display: grid;
  gap: 16px;
  margin-top: 12px;
}

.toggle {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  align-items: center;
  color: #e2e8f0;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 10px 12px;
}

.toggle input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.toggle-ui {
  width: 44px;
  height: 24px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.35);
  position: relative;
  transition: background 0.2s ease;
}

.toggle-ui::after {
  content: '';
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 3px;
  left: 4px;
  transition: transform 0.2s ease;
}

.toggle input:checked + .toggle-ui {
  background: rgba(34, 197, 94, 0.7);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(18px);
}

.summary-disclosure {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.45);
  padding: 10px 14px;
}

.summary-disclosure summary {
  cursor: pointer;
  font-weight: 700;
  color: #e2e8f0;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.summary-disclosure summary::-webkit-details-marker {
  display: none;
}

.summary-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.summary-icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #cbd5e1;
  background: rgba(15, 23, 42, 0.7);
}

.summary-block {
  display: grid;
  gap: 6px;
  margin-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 12px;
}

.summary-block p {
  margin: 0;
  color: #cbd5e1;
}

.warning {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(251, 146, 60, 0.15);
  border: 1px solid rgba(251, 146, 60, 0.35);
  color: #fde68a;
}

.error {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(248, 113, 113, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.35);
  color: #fecaca;
}

.error p {
  margin: 0;
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
  background: linear-gradient(130deg, rgba(56, 189, 248, 0.8), rgba(34, 197, 94, 0.75));
  border: none;
  color: #0f172a;
}

.btn.ghost {
  background: rgba(15, 23, 42, 0.55);
}

.results-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.results-head h2 {
  margin: 0 0 6px;
}

.results-sub {
  margin: 0;
  color: #94a3b8;
}

.results-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.password-grid {
  display: grid;
  gap: 12px;
}

.password-card {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.55);
  padding: 14px 16px;
  display: grid;
  gap: 10px;
}

.password-row {
  display: grid;
  gap: 12px;
}

.password-text {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 18px;
  display: block;
  padding: 10px 12px;
  background: rgba(2, 6, 23, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  word-break: break-all;
}

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.password-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  color: #cbd5e1;
}

.strength-pill {
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.04em;
}

.strength-pill.weak {
  background: rgba(248, 113, 113, 0.2);
  color: #fecaca;
  border: 1px solid rgba(248, 113, 113, 0.4);
}

.strength-pill.okay {
  background: rgba(251, 191, 36, 0.2);
  color: #fde68a;
  border: 1px solid rgba(251, 191, 36, 0.4);
}

.strength-pill.strong {
  background: rgba(34, 197, 94, 0.2);
  color: #bbf7d0;
  border: 1px solid rgba(34, 197, 94, 0.4);
}

.strength-pill.beast {
  background: rgba(56, 189, 248, 0.2);
  color: #bae6fd;
  border: 1px solid rgba(56, 189, 248, 0.4);
}

.crack-time {
  color: #94a3b8;
}

.empty-state {
  margin: 0;
  color: #94a3b8;
}

.tips-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.tip {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.45);
  padding: 12px 14px;
  color: #e2e8f0;
}

.seo-text h2 {
  margin: 0 0 8px;
}

.seo-text p {
  margin: 0 0 14px;
  color: #cbd5e1;
}

.extras {
  display: grid;
  gap: clamp(16px, 3vw, 24px);
}

.other-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.other-link {
  text-decoration: none;
  color: inherit;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.04);
  padding: 14px;
  display: grid;
  gap: 6px;
  transition: transform 0.12s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.other-link:hover {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.5);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.4);
}

.other-title {
  font-weight: 800;
}

.other-desc {
  color: #94a3b8;
  font-size: 13px;
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
  border-color: rgba(56, 189, 248, 0.45);
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

@media (max-width: 720px) {
  .password-row {
    gap: 8px;
  }

  .results-head {
    align-items: flex-start;
  }
}
</style>
