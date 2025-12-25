<template>
  <div class="crocodile-play">
    <div class="session-meta">
      <span>Показы: {{ showCount }}</span>
      <span>Среднее время: {{ avgSecondsLabel }}</span>
    </div>

    <div class="play-card-area">
      <CrocodileCard :item="currentItem" />

      <div class="timer-row">
        <span class="timer-label">Таймер</span>
        <span class="timer-value">{{ roundSecondsLabel }}</span>
      </div>

      <button class="show-btn" type="button" :disabled="loading" @click="handleShowButton">
        {{ loading ? 'Ищем...' : roundActive ? 'Показал' : 'Показать' }}
      </button>

      <div class="vote-row compact">
        <button
          class="vote-btn"
          type="button"
          :disabled="!currentItem || isVoted('like') || loading"
          @click="sendVote('like')"
        >
          👍
        </button>
        <button
          class="vote-btn"
          type="button"
          :disabled="!currentItem || isVoted('dislike') || loading"
          @click="sendVote('dislike')"
        >
          👎
        </button>
        <span class="vote-divider">|</span>
        <button
          class="vote-btn"
          type="button"
          :disabled="!currentItem || isVoted('diff_down') || loading"
          @click="sendVote('diff_down')"
        >
          Легко
        </button>
        <button
          class="vote-btn"
          type="button"
          :disabled="!currentItem || isVoted('diff_up') || loading"
          @click="sendVote('diff_up')"
        >
          Сложно
        </button>
      </div>

      <p v-if="feedback" class="feedback">{{ feedback }}</p>
    </div>
  </div>
  <SocialPopup :visible="showPopup" :payload="popupPayload" @close="handlePopupClose" />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import CrocodileCard from '@/components/crocodile/CrocodileCard.vue'
import SocialPopup from '@/components/ui/SocialPopup.vue'

const STORAGE_SESSION_KEY = 'crocodile_session_id'

const props = defineProps({
  difficulty: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  adultAllowed: {
    type: Boolean,
    required: true
  }
})

const loading = ref(false)
const currentItem = ref(null)
const feedback = ref('')

const sessionId = ref('')
const showCount = ref(0)
const roundCount = ref(0)
const avgSeconds = ref(0)
const roundStartAt = ref(null)
const roundSeconds = ref(0)
const roundActive = ref(false)

const voted = ref({})
let presenceTimer = null
let roundTimer = null
const showPopup = ref(false)
const popupIndex = ref(0)

const avgSecondsLabel = computed(() => {
  if (!roundCount.value) return '--'
  return `${avgSeconds.value.toFixed(1)} сек`
})

const roundSecondsLabel = computed(() => {
  if (!roundActive.value && !roundSeconds.value) return '--'
  return `${roundSeconds.value.toFixed(1)} сек`
})

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
]

const popupPayload = computed(() => socials[popupIndex.value % socials.length])

const initSession = () => {
  if (!process.client) return
  let stored = localStorage.getItem(STORAGE_SESSION_KEY)
  if (!stored) {
    const fallback = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    stored = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : fallback
    localStorage.setItem(STORAGE_SESSION_KEY, stored)
  }
  sessionId.value = stored
}

const markVoted = (voteType) => {
  if (!currentItem.value?.id) return
  if (!voted.value[currentItem.value.id]) voted.value[currentItem.value.id] = {}
  voted.value[currentItem.value.id][voteType] = true
}

const isVoted = (voteType) => {
  if (!currentItem.value?.id) return false
  return Boolean(voted.value[currentItem.value.id]?.[voteType])
}

const startRoundTimer = () => {
  roundActive.value = true
  roundStartAt.value = Date.now()
  roundSeconds.value = 0
  if (roundTimer) window.clearInterval(roundTimer)
  if (process.client) {
    roundTimer = window.setInterval(() => {
      if (!roundStartAt.value) return
      roundSeconds.value = (Date.now() - roundStartAt.value) / 1000
    }, 200)
  }
}

const finishRound = () => {
  if (!roundActive.value || !roundStartAt.value) return
  const duration = (Date.now() - roundStartAt.value) / 1000
  roundCount.value += 1
  avgSeconds.value = (avgSeconds.value * (roundCount.value - 1) + duration) / roundCount.value
  roundActive.value = false
  roundSeconds.value = duration
  roundStartAt.value = null
  if (roundTimer) window.clearInterval(roundTimer)
}

const showNext = async () => {
  feedback.value = ''
  loading.value = true
  try {
    const response = await $fetch('/api/crocodile/next', {
      method: 'POST',
      body: {
        difficulty: props.difficulty,
        type: props.type,
        adultAllowed: props.adultAllowed
      }
    })

    if (!response?.ok || !response?.item) {
      feedback.value = response?.error || 'Не удалось подобрать задание.'
      return
    }

    currentItem.value = response.item
    showCount.value += 1
    startRoundTimer()
    triggerPopup()
  } catch (error) {
    console.error(error)
    const message = error?.data?.error || error?.message || 'Ошибка при получении задания.'
    feedback.value = message
  } finally {
    loading.value = false
  }
}

const triggerPopup = () => {
  if (showCount.value % 5 === 0) {
    showPopup.value = true
  }
}

const handlePopupClose = () => {
  showPopup.value = false
  popupIndex.value = (popupIndex.value + 1) % socials.length
}

const handleShowButton = async () => {
  if (roundActive.value) {
    finishRound()
    return
  }
  await showNext()
}

const sendVote = async (voteType) => {
  if (!currentItem.value?.id || !sessionId.value) return
  feedback.value = ''
  try {
    const response = await $fetch('/api/crocodile/vote', {
      method: 'POST',
      body: {
        itemId: currentItem.value.id,
        sessionId: sessionId.value,
        voteType
      }
    })

    if (!response?.ok) {
      feedback.value = response?.error || 'Этот голос уже учтён.'
      markVoted(voteType)
      return
    }

    if (voteType === 'like') currentItem.value.likes += 1
    if (voteType === 'dislike') currentItem.value.dislikes += 1
    markVoted(voteType)
  } catch (error) {
    console.error(error)
    feedback.value = 'Не удалось отправить голос.'
  }
}

const sendPresence = async () => {
  if (!sessionId.value) return
  try {
    await $fetch('/api/crocodile/presence', {
      method: 'POST',
      body: { sessionId: sessionId.value }
    })
  } catch (error) {
    console.warn('[crocodile] presence failed', error)
  }
}

onMounted(() => {
  initSession()
  sendPresence()
  if (process.client) {
    presenceTimer = window.setInterval(sendPresence, 30000)
  }
})

onBeforeUnmount(() => {
  if (presenceTimer) window.clearInterval(presenceTimer)
  if (roundTimer) window.clearInterval(roundTimer)
})
</script>

<style scoped>
.crocodile-play {
  display: grid;
  gap: 18px;
  padding: clamp(16px, 4vw, 28px);
  background: rgba(10, 12, 16, 0.8);
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}

.session-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #94a3b8;
  justify-content: center;
  text-align: center;
}

.play-card-area {
  display: grid;
  gap: 16px;
}

.timer-row {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: #94a3b8;
  justify-content: center;
}

.timer-label {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 11px;
}

.show-btn {
  border: none;
  border-radius: 999px;
  padding: 14px 24px;
  background: linear-gradient(120deg, #22c55e, #16a34a);
  color: #05110a;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 14px 30px rgba(34, 197, 94, 0.3);
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  font-size: 16px;
  width: min(520px, 100%);
  justify-self: center;
  animation: wiggle 8s ease-in-out infinite;
}

.show-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 36px rgba(34, 197, 94, 0.4);
}

.show-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.vote-row.compact {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #cbd5cb;
}

.vote-btn {
  border-radius: 999px;
  padding: 6px 12px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.4);
  color: #e2e8f0;
  cursor: pointer;
  font-weight: 700;
}

.vote-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vote-divider {
  opacity: 0.5;
}

.feedback {
  margin: 0;
  font-size: 13px;
  color: #fbbf24;
  text-align: center;
}

@keyframes wiggle {
  0%,
  92%,
  100% {
    transform: translateX(0);
  }
  93% {
    transform: translateX(-2px);
  }
  94% {
    transform: translateX(2px);
  }
  95% {
    transform: translateX(-1px);
  }
  96% {
    transform: translateX(1px);
  }
}
</style>
