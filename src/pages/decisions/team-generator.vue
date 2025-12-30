<template>
  <main class="team-page">
    <section class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Разделить на команды онлайн</h1>
      <p class="lead">Быстро раскидай людей по командам, честно и без споров</p>
    </section>

    <section class="layout">
      <article class="card input-card">
        <div class="card-head">
          <div>
            <h2>Ввод участников</h2>
            <p>По одному имени на строку. Можно указать вес через дефис.</p>
          </div>
          <div class="card-actions">
            <button class="btn ghost" type="button" @click="insertSample">Вставить пример</button>
            <button class="btn ghost" type="button" @click="clearParticipants">Очистить</button>
          </div>
        </div>
        <textarea
          v-model="participantsInput"
          rows="10"
          placeholder="Алексей&#10;Марина&#10;Ник - 5&#10;Ирина - 2"
        ></textarea>
        <div class="meta-row">
          <span>Строк всего: {{ totalLines }}</span>
          <span>Уникальных участников: {{ uniqueCount }}</span>
        </div>
      </article>

      <article class="card settings-card">
        <h2>Настройки распределения</h2>
        <div class="mode-toggle">
          <button class="mode-btn" :class="{ active: mode === 'count' }" type="button" @click="mode = 'count'">
            По количеству команд
          </button>
          <button class="mode-btn" :class="{ active: mode === 'size' }" type="button" @click="mode = 'size'">
            По размеру команды
          </button>
        </div>
        <div class="field-row">
          <label v-if="mode === 'count'" class="field">
            Количество команд
            <input v-model.number="teamsCount" type="number" min="2" max="20" />
          </label>
          <label v-else class="field">
            Размер команды
            <input v-model.number="teamSize" type="number" min="2" max="50" />
          </label>
        </div>
        <div class="toggle-grid">
          <label class="toggle">
            <input v-model="removeDuplicates" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Удалять дубли</span>
          </label>
          <label class="toggle">
            <input v-model="ignoreEmpty" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Игнорировать пустые строки</span>
          </label>
          <label class="toggle">
            <input v-model="trimEdges" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Обрезать пробелы</span>
          </label>
          <label class="toggle">
            <input v-model="shuffleEnabled" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Перемешать участников</span>
          </label>
        </div>
        <div class="balance-block">
          <label class="toggle balance-toggle">
            <input v-model="balanceEnabled" type="checkbox" />
            <span class="toggle-ui" aria-hidden="true"></span>
            <span>Балансировать команды</span>
          </label>
          <div class="balance-hint">
            <p>Формат веса: <strong>Ник - 5</strong> или <strong>Имя - 2</strong>. Без веса считается 1.</p>
            <p>При балансе суммарная сила команд будет максимально ровной.</p>
          </div>
        </div>
      </article>

      <article class="card action-card">
        <div class="action-row">
          <button class="btn primary" type="button" :disabled="!participantsInput.trim()" @click="generateTeams">
            Сгенерировать команды
          </button>
          <button class="btn ghost" type="button" :disabled="!resultText" @click="copyResult">
            {{ copyLabel }}
          </button>
          <button class="btn ghost" type="button" :disabled="!resultText" @click="downloadResult">
            Скачать TXT
          </button>
          <button class="btn ghost" type="button" :disabled="!resultText" @click="reshuffleTeams">
            Перемешать заново
          </button>
        </div>
        <p v-if="error" class="alert">{{ error }}</p>
      </article>

      <article class="card result-card">
        <div class="result-head">
          <h2>Результат</h2>
          <span v-if="resultTeamsCount">Команд: {{ resultTeamsCount }}</span>
        </div>
        <div v-if="teams.length" class="teams-grid">
          <article v-for="(team, index) in teams" :key="`team-${index}`" class="team-card">
            <div class="team-head">
              <h3>Команда {{ index + 1 }}</h3>
              <span v-if="resultBalanceEnabled" class="team-weight">Сила: {{ team.totalWeight }}</span>
            </div>
            <ol v-if="team.members.length">
              <li v-for="(member, idx) in team.members" :key="`${member.name}-${idx}`">
                <span>{{ member.name }}</span>
                <span v-if="resultBalanceEnabled" class="member-weight">{{ member.weight }}</span>
              </li>
            </ol>
            <p v-else class="empty-team">Нет участников</p>
          </article>
        </div>
        <p v-else class="empty-state">Пока нет результатов. Нажми "Сгенерировать команды".</p>
      </article>
    </section>

    <section class="seo-article">
      <h2>Как честно разделить людей на команды</h2>
      <p>
        Честное деление начинается с прозрачных правил. Собери список участников, включи удаление дублей и используй
        криптографическое перемешивание, чтобы исключить человеческий фактор.
      </p>

      <h2>Команды по количеству или по размеру</h2>
      <p>
        Выбирай режим под задачу: фиксируй число команд для турнира или укажи размер команды, когда важна равномерная плотность.
      </p>

      <h2>Баланс по силе, что это и зачем</h2>
      <p>
        Если у игроков разный уровень, добавь веса. Алгоритм распределит участников так, чтобы суммы сил команд были максимально
        ровными.
      </p>

      <h2>Жеребьёвка для игр, спорта и офиса</h2>
      <p>
        Инструмент подходит для квестов, футбольных матчей, рабочих сессий и тимбилдингов, когда важно быстро разделить людей.
      </p>

      <h2>Частые ошибки при ручном делении</h2>
      <p>
        Самые частые ошибки — забытые участники, дубли и непроверенный баланс. Онлайн-генератор решает эти проблемы за секунды.
      </p>
    </section>

    <section class="faq-block">
      <div class="faq-card">
        <p class="seo-kicker">FAQ</p>
        <h2>Частые вопросы</h2>
        <div class="faq-list">
          <div
            v-for="(item, idx) in faqItems"
            :key="item.q"
            class="faq-item"
            :class="{ open: openFaq === idx }"
          >
            <button class="faq-toggle" type="button" @click="toggleFaq(idx)">
              <span>{{ item.q }}</span>
              <span class="faq-icon" aria-hidden="true">{{ openFaq === idx ? '-' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>{{ item.a }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="other-decisions">
      <h2>Другие решения</h2>
      <div class="other-grid">
        <NuxtLink class="other-link" to="/decisions/wheel-of-fortune">
          <span class="other-title">Колесо фортуны</span>
          <span class="other-desc">Крути колесо, чтобы выбрать решение или победителя.</span>
        </NuxtLink>
        <NuxtLink class="other-link" to="/decisions/random-choice">
          <span class="other-title">Случайный выбор</span>
          <span class="other-desc">Быстрый выбор между вариантами и списками.</span>
        </NuxtLink>
        <NuxtLink class="other-link" to="/decisions/giveaway-winner">
          <span class="other-title">Победитель розыгрыша</span>
          <span class="other-desc">Честный выбор победителей с протоколом.</span>
        </NuxtLink>
        <NuxtLink class="other-link" to="/decisions/coin-flip">
          <span class="other-title">Монетка</span>
          <span class="other-desc">Выбор 50/50 за один клик.</span>
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { parseParticipants } from '@/utils/decisions/teams/parseParticipants'
import { shuffleParticipants } from '@/utils/decisions/teams/shuffle'
import { splitTeams, type Team } from '@/utils/decisions/teams/splitTeams'
import { balanceTeams } from '@/utils/decisions/teams/balanceTeams'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Решения', to: '/decisions' },
  { label: 'Разделить на команды' }
]

const participantsInput = ref('')
const mode = ref<'count' | 'size'>('count')
const teamsCount = ref(2)
const teamSize = ref(4)

const removeDuplicates = ref(true)
const ignoreEmpty = ref(true)
const trimEdges = ref(true)
const shuffleEnabled = ref(true)
const balanceEnabled = ref(false)

const teams = ref<Team[]>([])
const error = ref('')
const resultBalanceEnabled = ref(false)
const resultTeamsCount = ref(0)

const copyLabel = ref('Копировать результат')
const copyTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const parseOptions = computed(() => ({
  trimEdges: trimEdges.value,
  ignoreEmpty: ignoreEmpty.value
}))

const preview = computed(() => parseParticipants(participantsInput.value, parseOptions.value))
const totalLines = computed(() => preview.value.totalLines)
const uniqueCount = computed(() => preview.value.uniqueParticipants.length)

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const buildResultText = (list: Team[]) => {
  if (!list.length) return ''
  const lines: string[] = []
  list.forEach((team, index) => {
    const header = resultBalanceEnabled.value
      ? `Команда ${index + 1} (сила: ${team.totalWeight})`
      : `Команда ${index + 1}`
    lines.push(header)
    if (!team.members.length) {
      lines.push('-')
    } else {
      team.members.forEach((member, idx) => {
        if (resultBalanceEnabled.value) {
          lines.push(`${idx + 1}. ${member.name} (${member.weight})`)
        } else {
          lines.push(`${idx + 1}. ${member.name}`)
        }
      })
    }
    lines.push('')
  })
  return lines.join('\n').trim()
}

const resultText = computed(() => buildResultText(teams.value))

const generateTeams = () => {
  error.value = ''
  const parsed = parseParticipants(participantsInput.value, parseOptions.value)
  const pool = removeDuplicates.value ? parsed.uniqueParticipants : parsed.participants

  if (pool.length < 2) {
    teams.value = []
    resultTeamsCount.value = 0
    error.value = 'Нужно минимум 2 участника.'
    return
  }

  let count = 0
  if (mode.value === 'count') {
    count = clamp(Number.isFinite(teamsCount.value) ? teamsCount.value : 2, 2, 20)
    if (pool.length < count) {
      teams.value = []
      resultTeamsCount.value = 0
      error.value = 'Участников меньше, чем выбранное количество команд.'
      return
    }
  } else {
    const size = clamp(Number.isFinite(teamSize.value) ? teamSize.value : 2, 2, 50)
    count = Math.max(1, Math.ceil(pool.length / size))
  }

  const nextTeams = balanceEnabled.value
    ? balanceTeams(pool, count, { shuffleBeforeSort: shuffleEnabled.value })
    : splitTeams(shuffleEnabled.value ? shuffleParticipants(pool) : pool.slice(), count)

  teams.value = nextTeams
  resultBalanceEnabled.value = balanceEnabled.value
  resultTeamsCount.value = count
}

const copyResult = async () => {
  if (!resultText.value) return
  if (typeof navigator === 'undefined' || !navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(resultText.value)
    copyLabel.value = 'Скопировано'
  } catch (copyError) {
    copyLabel.value = 'Не удалось скопировать'
  }
  if (copyTimer.value) clearTimeout(copyTimer.value)
  copyTimer.value = setTimeout(() => {
    copyLabel.value = 'Копировать результат'
  }, 2000)
}

const downloadResult = () => {
  if (!resultText.value) return
  if (typeof document === 'undefined') return
  const blob = new Blob([resultText.value], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'teams.txt'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const reshuffleTeams = () => {
  if (!participantsInput.value.trim()) return
  generateTeams()
}

const insertSample = () => {
  participantsInput.value = [
    'Алина',
    'Максим - 3',
    'Олег - 5',
    'Катя',
    'Саша - 2',
    'Юля',
    'Илья - 4',
    'Марина',
    'Алина'
  ].join('\n')
}

const clearParticipants = () => {
  participantsInput.value = ''
}

onBeforeUnmount(() => {
  if (copyTimer.value) clearTimeout(copyTimer.value)
})

const openFaq = ref<number | null>(null)
const faqItems = [
  {
    q: 'Можно ли сделать команды ровными?',
    a: 'Да. Инструмент раздает участников по кругу и балансирует размеры команд.'
  },
  {
    q: 'Что делать если людей не делится?',
    a: 'Команды будут максимально равными по размеру, разница обычно 1 человек.'
  },
  {
    q: 'Можно ли учитывать силу игроков?',
    a: 'Да, включи баланс и укажи вес: "Ник - 5". Без веса считается 1.'
  },
  {
    q: 'Это случайно или честно?',
    a: 'Перемешивание использует криптографический источник случайности на клиенте.'
  },
  {
    q: 'Сохраняются ли данные?',
    a: 'Нет. Всё работает в браузере, список никуда не отправляется.'
  },
  {
    q: 'Работает ли на телефоне?',
    a: 'Да, страница адаптивна и удобна на мобильных устройствах.'
  }
]

const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx
}

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/team-generator`)
const metaDescription =
  'Раздели людей на команды случайно или с балансом. Удаление дублей, равные команды, копирование и скачивание.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'Разделить на команды онлайн',
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
        { '@type': 'ListItem', position: 2, name: 'Решения', item: `${requestUrl.origin}/decisions` },
        { '@type': 'ListItem', position: 3, name: 'Разделить на команды', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Разделить на команды онлайн | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Разделить на команды онлайн | Neural Wise Wolf',
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
.team-page {
  --panel: rgba(9, 20, 35, 0.86);
  --panel-border: rgba(148, 163, 184, 0.18);
  --accent: #f97316;
  --accent-soft: rgba(249, 115, 22, 0.2);
  display: grid;
  gap: clamp(24px, 3vw, 40px);
  width: min(980px, 100% - clamp(24px, 6vw, 68px));
  margin: 0 auto;
  padding: clamp(22px, 3vw, 34px) 0 clamp(40px, 4vw, 64px);
  position: relative;
}

.team-page::before,
.team-page::after {
  content: '';
  position: absolute;
  inset: auto;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  filter: blur(0);
  opacity: 0.25;
  pointer-events: none;
}

.team-page::before {
  top: -80px;
  right: -140px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.45), transparent 65%);
}

.team-page::after {
  bottom: 120px;
  left: -160px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.35), transparent 65%);
}

.hero {
  text-align: center;
  display: grid;
  gap: 10px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-size: clamp(32px, 5.4vw, 48px);
  font-family: 'Unbounded', 'Manrope', sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.hero .lead {
  margin: 0;
  color: #cbd5f5;
  max-width: 680px;
}

.layout {
  display: grid;
  gap: 16px;
}

.card {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 20px;
  padding: clamp(16px, 2.3vw, 22px);
  display: grid;
  gap: 14px;
  position: relative;
  z-index: 1;
  box-shadow: 0 16px 30px rgba(2, 6, 23, 0.25);
}

.card-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

textarea,
input {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: rgba(2, 6, 23, 0.85);
  color: #e2e8f0;
  padding: 10px 12px;
  font-size: 14px;
  outline: none;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

textarea {
  resize: vertical;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #94a3b8;
  font-size: 13px;
}

.mode-toggle {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.mode-btn {
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(2, 6, 23, 0.7);
  color: #e2e8f0;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.mode-btn.active {
  background: linear-gradient(130deg, rgba(249, 115, 22, 0.9), rgba(251, 191, 36, 0.9));
  color: #0f172a;
  border-color: transparent;
}

.mode-btn:hover {
  transform: translateY(-1px);
}

.field {
  display: grid;
  gap: 8px;
  color: #cbd5e1;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field-row {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.toggle-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.toggle {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  align-items: center;
  color: #e2e8f0;
  cursor: pointer;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 12px;
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
  background: rgba(34, 197, 94, 0.8);
}

.toggle input:checked + .toggle-ui::after {
  transform: translateX(18px);
}

.balance-block {
  display: grid;
  gap: 10px;
  background: rgba(249, 115, 22, 0.08);
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 16px;
  padding: 12px;
}

.balance-toggle {
  background: transparent;
  border: none;
  padding: 0;
}

.balance-hint {
  color: #cbd5e1;
  font-size: 13px;
  display: grid;
  gap: 6px;
}

.balance-hint p {
  margin: 0;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(148, 163, 184, 0.1);
  color: #e2e8f0;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(249, 115, 22, 0.6);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.btn.primary {
  background: linear-gradient(130deg, rgba(249, 115, 22, 0.9), rgba(251, 191, 36, 0.9));
  border: none;
  color: #1f2937;
}

.alert {
  margin: 0;
  background: rgba(248, 113, 113, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.4);
  color: #fecaca;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 14px;
}

.result-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  color: #cbd5e1;
  font-size: 13px;
}

.teams-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.team-card {
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.5);
  padding: 12px;
  display: grid;
  gap: 10px;
}

.team-head {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  align-items: baseline;
}

.team-head h3 {
  margin: 0;
}

.team-weight {
  font-size: 12px;
  color: #fbbf24;
  font-weight: 700;
}

.team-card ol {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 6px;
  color: #e2e8f0;
}

.team-card li {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
}

.member-weight {
  font-size: 12px;
  color: #fbbf24;
}

.empty-team,
.empty-state {
  margin: 0;
  color: #94a3b8;
}

.seo-article {
  display: grid;
  gap: 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 20px;
  padding: clamp(16px, 2.5vw, 22px);
}

.seo-article h2 {
  margin: 0;
}

.seo-article p {
  margin: 0;
  color: #cbd5e1;
}

.faq-block {
  display: grid;
  justify-items: center;
}

.faq-card {
  width: 100%;
  background: rgba(2, 6, 23, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 20px;
  padding: clamp(16px, 2.5vw, 22px);
  display: grid;
  gap: 12px;
}

.faq-list {
  display: grid;
  gap: 10px;
}

.faq-item {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.6);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.faq-item.open {
  border-color: rgba(249, 115, 22, 0.6);
  background: rgba(249, 115, 22, 0.12);
}

.faq-toggle {
  width: 100%;
  border: none;
  background: transparent;
  color: #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  cursor: pointer;
  font-weight: 700;
  text-align: left;
}

.faq-answer {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease;
  padding: 0 14px;
}

.faq-item.open .faq-answer {
  max-height: 180px;
  opacity: 1;
  padding-bottom: 12px;
}

.faq-answer p {
  margin: 0;
  color: #cbd5e1;
}

.other-decisions {
  display: grid;
  gap: 12px;
}

.other-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.other-link {
  text-decoration: none;
  color: inherit;
  border-radius: 16px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(15, 23, 42, 0.5);
  padding: 14px;
  display: grid;
  gap: 6px;
  transition: transform 0.12s ease, border-color 0.2s ease;
}

.other-link:hover {
  transform: translateY(-2px);
  border-color: rgba(249, 115, 22, 0.6);
}

.other-title {
  font-weight: 800;
}

.other-desc {
  color: #94a3b8;
  font-size: 13px;
}

@media (max-width: 720px) {
  .card-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-row {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
