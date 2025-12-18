<template>
  <section class="wc-shell">
    <div class="wc-container">
      <div class="wc-head">
        <p class="wc-pill">Демо-версия</p>
        <h1 class="section-title wc-title">Волчий Контекст</h1>
        <p class="wc-status-line">Попыток: {{ attempts.length }} · Подсказок: {{ hintsUsed }}</p>
      </div>

      <div class="wc-form">
        <label class="wc-label" for="guess-input">введи слово</label>
        <div class="wc-input-row">
          <input
            id="guess-input"
            v-model="guessInput"
            class="wc-input"
            type="text"
            placeholder="ассоциация или догадка"
            @keyup.enter="submitGuess"
          />
          <button class="wc-send" type="button" @click="submitGuess" aria-label="Проверить">
            <span class="wc-arrow">➜</span>
          </button>
          <button class="wc-btn ghost" type="button" @click="giveHint" :disabled="!canGiveHint">Подсказка</button>
        </div>
        <p class="wc-reaction">{{ reactionMessage }}</p>
        <p v-if="statusMessage && statusMessage !== reactionMessage" class="wc-status">{{ statusMessage }}</p>
      </div>

      <div class="wc-history">
        <div v-if="attemptsSorted.length" class="wc-history-list">
          <div
            v-for="item in attemptsSorted"
            :key="item.word"
            :class="['wc-row', 'wc-bar', getBarClass(item.rankValue, item.maxRank)]"
            :style="{ width: item.width }"
          >
            <span class="wc-word">{{ item.word }}</span>
            <span class="wc-rank">{{ item.rankLabel }}</span>
          </div>
        </div>
        <p v-else class="wc-muted">История пока пуста</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { officialSecrets } from '@/data/wolf-context/officialSecrets'
import { neighbors } from '@/data/wolf-context/neighbors'
import { wolfDictionary } from '@/data/wolf-context/dictionary'

type Attempt = {
  word: string
  rank: number | null
  createdAt: number
  status: 'hit' | 'missed' | 'unknown' | 'hint'
  reaction: string
}

useHead({
  title: 'Волчий Контекст, угадай слово по смыслу',
  meta: [
    {
      name: 'description',
      content:
        'Игра где угадываешь секретное слово по смысловой близости, вводишь слова и смотришь ранг, чем ближе к 1, тем горячее след'
    },
    { property: 'og:title', content: 'Волчий Контекст, угадай слово по смыслу' },
    {
      property: 'og:description',
      content:
        'Угадай секретное слово по смыслу, без аккаунтов и комнат. Режимы: случайная охота, слово дня и свои загадки.'
    }
  ]
})

const guessInput = ref('')
const secret = ref<string | null>(null)
const secretNeighbors = ref<string[]>([])
const rankMap = ref<Map<string, number> | null>(null)
const attempts = ref<Attempt[]>([])
const reactionMessage = ref('Готов к охоте')
const statusMessage = ref('')
const hintsUsed = ref(0)

const normalizedNeighbors: Record<string, string[]> = Object.entries(neighbors).reduce((acc, [key, value]) => {
  acc[normalizeWord(key)] = value
  return acc
}, {} as Record<string, string[]>)

const dictionary = new Set(wolfDictionary.map((w) => normalizeWord(w)))
const dictionaryKeys = new Set(Object.keys(normalizedNeighbors))
const availableOfficial = officialSecrets.filter((item) => dictionaryKeys.has(normalizeWord(item)))

const bestIndex = computed(() => {
  const ranks = attempts.value.map((a) => a.rank).filter((n): n is number => n !== null)
  if (!ranks.length) return Number.POSITIVE_INFINITY
  return Math.min(...ranks)
})

const attemptsSorted = computed(() => {
  const maxRank = Math.max(...attempts.value.map((a) => (a.rank ?? 0)), secretNeighbors.value.length || 1)
  const sorted = [...attempts.value].sort((a, b) => {
    const rankA = a.rank ?? Number.POSITIVE_INFINITY
    const rankB = b.rank ?? Number.POSITIVE_INFINITY
    if (rankA === rankB) return a.createdAt - b.createdAt
    return rankA - rankB
  })
  return sorted.map((item) => {
    const rank = item.rank ?? maxRank
    const progress = 1 - (rank - 1) / Math.max(maxRank, 1)
    const width = `${Math.max(30, Math.min(100, Math.round(progress * 100)))}%`
    return {
      word: item.word,
      rankLabel: item.rank !== null ? item.rank : '-',
      width,
      rankValue: rank,
      maxRank
    }
  })
})

function getBarClass(index: number, maxRank: number) {
  if (index === 1) return 'wc-bar-best'
  const ratio = index / maxRank
  if (ratio <= 0.2) return 'wc-bar-hot'
  if (ratio <= 0.5) return 'wc-bar-warm'
  return 'wc-bar-cold'
}

const canGiveHint = computed(() => {
  if (!secret.value || !secretNeighbors.value.length) return false
  if (bestIndex.value <= 1) return false
  const hintRank = bestIndex.value === Number.POSITIVE_INFINITY ? secretNeighbors.value.length : bestIndex.value - 1
  const hintWord = secretNeighbors.value[hintRank - 1]
  if (!hintWord) return false
  const normalizedHint = normalizeWord(hintWord)
  return !attempts.value.some((a) => a.word === normalizedHint)
})

function normalizeWord(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim()
}

function reactionForRank(rank: number | null): string {
  if (rank === 1) return 'АУФ, в точку'
  if (rank !== null && rank <= 10) return 'горячо, рядом'
  if (rank !== null && rank <= 50) return 'пахнет лесом'
  if (rank !== null && rank <= 200) return 'след есть, но далеко'
  if (rank !== null) return 'ты пока в степи'
  return 'след не найден'
}

function startRandomHunt() {
  try {
    const nextSecret = pickRandomSecret()
    const data = normalizedNeighbors[nextSecret]
    secret.value = nextSecret
    secretNeighbors.value = data || []
    rankMap.value = data ? buildRankMap(data) : null
    attempts.value = []
    reactionMessage.value = 'Готов к охоте'
    statusMessage.value = ''
    hintsUsed.value = 0
    guessInput.value = ''
  } catch (e) {
    console.error('Не удалось запустить игру Волчий Контекст', e)
  }
}

function pickRandomSecret(): string {
  if (availableOfficial.length) {
    const idx = Math.floor(Math.random() * availableOfficial.length)
    return normalizeWord(availableOfficial[idx])
  }
  const keys = Object.keys(normalizedNeighbors)
  return normalizeWord(keys[Math.floor(Math.random() * keys.length)])
}

function buildRankMap(list: string[]): Map<string, number> {
  const map = new Map<string, number>()
  list.forEach((word, idx) => {
    map.set(normalizeWord(word), idx + 1)
  })
  return map
}

function submitGuess() {
  if (!rankMap.value) return
  const guess = normalizeWord(guessInput.value)
  if (!guess) return

  guessInput.value = ''
  statusMessage.value = ''

  if (attempts.value.some((item) => item.word === guess)) return

  if (!dictionary.has(guess)) {
    addAttempt({ word: guess, rank: null, status: 'unknown', reaction: reactionForRank(null) })
    statusMessage.value = 'Слова нет в словаре'
    return
  }

  if (!rankMap.value.has(guess)) {
    addAttempt({ word: guess, rank: null, status: 'missed', reaction: reactionForRank(null) })
    statusMessage.value = 'След не найден'
    return
  }

  const rank = rankMap.value.get(guess) ?? null
  const reaction = reactionForRank(rank)
  addAttempt({ word: guess, rank, status: 'hit', reaction })
  statusMessage.value = reaction
}

function addAttempt(payload: { word: string; rank: number | null; status: Attempt['status']; reaction: string }) {
  attempts.value.push({
    word: payload.word,
    rank: payload.rank,
    status: payload.status,
    reaction: payload.reaction,
    createdAt: Date.now()
  })
  reactionMessage.value = payload.reaction
}

function giveHint() {
  if (!rankMap.value || !secret.value || !secretNeighbors.value.length) return
  if (bestIndex.value <= 1) return

  const hintRank = bestIndex.value === Number.POSITIVE_INFINITY ? secretNeighbors.value.length : bestIndex.value - 1
  const hintWord = secretNeighbors.value[hintRank - 1]
  if (!hintWord) return

  const normalizedHint = normalizeWord(hintWord)
  if (attempts.value.some((item) => item.word === normalizedHint)) return

  addAttempt({ word: normalizedHint, rank: hintRank, status: 'hint', reaction: 'подсказка' })
  hintsUsed.value += 1
}

onMounted(() => {
  startRandomHunt()
})
</script>

<style scoped>
.wc-shell {
  padding: 32px 18px 64px;
  color: #e5e7eb;
}

.wc-container {
  max-width: 880px;
  margin: 0 auto;
  display: grid;
  gap: 14px;
}

.wc-head {
  display: grid;
  gap: 6px;
  text-align: center;
}

.wc-title {
  font-size: clamp(52px, 10vw, 80px);
  font-weight: 900;
  letter-spacing: -0.02em;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
}

.wc-status-line {
  margin: 0;
  color: #cbd5e1;
}

.wc-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  margin: 0 auto;
}

.wc-title {
  margin: 4px 0;
}

.wc-form {
  display: grid;
  gap: 8px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.wc-label {
  font-weight: 800;
  color: #cbd5e1;
  text-transform: lowercase;
}

.wc-input-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 8px;
  align-items: center;
}

.wc-input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.8);
  color: #e5e7eb;
  font-size: 14px;
}

.wc-send {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  font-weight: 900;
  cursor: pointer;
}

.wc-arrow {
  display: block;
  font-size: 16px;
}

.wc-reaction {
  margin: 0;
  font-weight: 800;
  color: #e0e7ff;
  text-align: center;
}

.wc-status {
  margin: 0;
  color: #cbd5e1;
  text-align: center;
}

.wc-history {
  display: grid;
  gap: 10px;
}

.wc-history-list {
  display: grid;
  gap: 8px;
}

.wc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 12px;
  color: #e5e7eb;
  transition: width 0.2s ease;
}

.wc-word {
  font-weight: 800;
}

.wc-rank {
  font-weight: 800;
  color: #e5e7eb;
}

.wc-bar {
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(90deg, rgba(74, 222, 128, 0.18), rgba(52, 211, 153, 0.28));
}

.wc-bar-cold {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.18));
}

.wc-bar-warm {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.28), rgba(249, 115, 22, 0.26));
}

.wc-bar-hot {
  background: linear-gradient(90deg, rgba(74, 222, 128, 0.32), rgba(52, 211, 153, 0.36));
}

.wc-bar-best {
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.45), rgba(16, 185, 129, 0.48));
  box-shadow: 0 0 12px rgba(74, 222, 128, 0.35);
}

.wc-btn {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.12s ease;
  font-size: 14px;
}

.wc-btn.primary {
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  color: #0b1220;
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.35);
}

.wc-btn.ghost {
  background: rgba(255, 255, 255, 0.06);
  color: #e5e7eb;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.wc-btn:disabled,
.wc-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.wc-btn:not(:disabled):hover,
.wc-send:not(:disabled):hover {
  transform: translateY(-1px);
}

.wc-muted {
  margin: 0;
  color: #94a3b8;
  text-align: center;
}

@media (max-width: 640px) {
  .wc-input-row {
    grid-template-columns: 1fr auto;
  }

  .wc-btn.ghost {
    grid-column: span 2;
    width: 100%;
  }
}
</style>
