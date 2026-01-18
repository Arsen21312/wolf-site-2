<template>
  <div class="wolf-test">
    <div class="wolf-bg" aria-hidden="true">
      <div class="wolf-glow glow-one"></div>
      <div class="wolf-glow glow-two"></div>
      <div class="wolf-glow glow-three"></div>
    </div>

    <transition name="screen-fade" mode="out-in">
      <section v-if="screen === 'welcome'" key="welcome" class="screen welcome-screen">
        <div class="welcome-image" aria-hidden="true"></div>
        <div class="welcome-overlay" aria-hidden="true"></div>

        <div class="particles" aria-hidden="true">
          <span
            v-for="particle in welcomeParticles"
            :key="particle.id"
            class="particle"
            :style="particleStyle(particle)"
          ></span>
        </div>

        <div class="screen-content">
          <Breadcrumbs class="center" :items="breadcrumbs" />

          <div class="welcome-icons">
            <span class="icon-pill">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 3c-3.9 0-7 3.1-7 7 0 3.7 2.8 6.7 6.4 7a7.8 7.8 0 0 1-2.2-5.4c0-3.8 2.7-7 6.3-7.5A6.9 6.9 0 0 0 12 3z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span class="icon-pill alt">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M4 12c4-3 8-3 12 0m-9 5c3-2 6-2 9 0M6 7c5-3 10-3 14 0"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <span class="icon-pill emerald">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 3l2.3 5.2L20 9l-4.2 3.6L16.8 18 12 15l-4.8 3 1-5.4L4 9l5.7-.8L12 3z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </div>

          <h1 class="welcome-title">
            КАКОЙ ТЫ
            <span>ВОЛК?</span>
          </h1>
          <p class="welcome-lead">Ты вожак, разведчик, одиночка или тень леса?</p>
          <p class="welcome-sub">Узнай, какой волк живет в тебе</p>

          <div class="welcome-divider"></div>

          <button class="cta-button" type="button" @click="handleStart">
            <span>НАЧАТЬ ПУТЬ</span>
            <span class="cta-arrow">></span>
          </button>

          <p class="welcome-foot">ДРЕВНИЙ ЗОВ | ТВОЙ ИНСТИНКТ | ТВОЯ СТАЯ</p>
        </div>

      </section>
      <section v-else-if="screen === 'question'" key="question" class="screen question-screen">
        <div class="screen-content">
          <Breadcrumbs class="center" :items="breadcrumbs" />

          <div class="progress-bar" aria-hidden="true">
            <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
          </div>

          <div class="question-counter">ВОПРОС {{ currentQuestionIndex + 1 }} ИЗ {{ questions.length }}</div>

          <div class="question-card">
            <h2>{{ currentQuestion.text }}</h2>
          </div>

          <div class="answers-grid">
            <button
              v-for="(answer, index) in currentQuestion.answers"
              :key="answer.text"
              class="answer-card"
              type="button"
              :style="{ animationDelay: `${0.1 * index}s` }"
              @click="handleAnswer(answer.value)"
            >
              <span class="answer-emotion">{{ answer.emotion }}</span>
              <span class="answer-text">{{ answer.text }}</span>
            </button>
          </div>

          <div class="ambient-orb left" aria-hidden="true"></div>
          <div class="ambient-orb right" aria-hidden="true"></div>
        </div>
      </section>
      <section v-else key="result" class="screen result-screen">
        <div class="celebration" aria-hidden="true">
          <span
            v-for="particle in resultParticles"
            :key="particle.id"
            class="celebration-particle"
            :style="resultParticleStyle(particle)"
          ></span>
        </div>

        <div class="screen-content">
          <Breadcrumbs class="center" :items="breadcrumbs" />

          <div class="result-header">
            <div class="sparkle-icon" aria-hidden="true">*</div>
            <p>ТВОЙ АРХЕТИП РАСКРЫТ</p>
          </div>

          <div class="result-card">
            <div class="result-hero">
              <img :src="resultImage" :alt="resultArchetype.title" loading="lazy" />
              <div class="result-hero-overlay"></div>
              <div class="result-title">
                <p>{{ resultArchetype.subtitle }}</p>
                <h1>{{ resultArchetype.title }}</h1>
              </div>
            </div>

            <div class="result-body">
              <p class="result-description">{{ resultArchetype.description }}</p>

              <div class="result-grid">
                <div class="result-block strengths">
                  <div class="block-title">
                    <span class="block-icon">+</span>
                    <h3>Сильные стороны</h3>
                  </div>
                  <ul>
                    <li v-for="item in resultArchetype.strengths" :key="item">{{ item }}</li>
                  </ul>
                </div>

                <div class="result-block shadows">
                  <div class="block-title">
                    <span class="block-icon">!</span>
                    <h3>Тени и риски</h3>
                  </div>
                  <ul>
                    <li v-for="item in resultArchetype.shadows" :key="item">{{ item }}</li>
                  </ul>
                </div>
              </div>

              <div class="result-actions">
                <button class="action primary" type="button" @click="shareResult">{{ shareLabel }}</button>
                <button class="action ghost" type="button" @click="handleRestart">Пройти еще раз</button>
              </div>
              <p v-if="shareNote" class="share-note">{{ shareNote }}</p>
            </div>
          </div>

          <p class="result-footer">ТЫ ПРИНЯТ В СТАЮ | ТВОЙ ПУТЬ НАЧИНАЕТСЯ ЗДЕСЬ</p>
        </div>
      </section>
    </transition>

    <button v-if="screen !== 'welcome'" class="music-toggle" type="button" @click="toggleMusic">
      <span>Музыка</span>
      <span class="music-status">{{ musicEnabled ? 'ON' : 'OFF' }}</span>
    </button>

    <audio ref="audioRef" src="/audio/wolftest-theme.mp3" preload="none" loop></audio>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

type AnswerValue = 'alpha' | 'scout' | 'lone' | 'shadow' | 'guardian' | 'hunter'

interface Question {
  id: number
  text: string
  answers: {
    text: string
    value: AnswerValue
    emotion: string
  }[]
}

interface WolfArchetype {
  id: AnswerValue
  title: string
  subtitle: string
  description: string
  strengths: string[]
  shadows: string[]
}

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Кто ты в стае' }
]

const questions: Question[] = [
  {
    id: 1,
    text: 'Ты видишь опасность впереди. Что делаешь?',
    answers: [
      { text: 'Иду первым, защищая остальных', value: 'alpha', emotion: 'Сила' },
      { text: 'Обхожу стороной, ищу безопасный путь', value: 'scout', emotion: 'Мудрость' },
      { text: 'Принимаю вызов в одиночку', value: 'lone', emotion: 'Храбрость' },
      { text: 'Наблюдаю из тени, выжидаю момент', value: 'shadow', emotion: 'Терпение' }
    ]
  },
  {
    id: 2,
    text: 'Стая спорит о выборе пути. Твои действия?',
    answers: [
      { text: 'Решаю сам и веду за собой', value: 'alpha', emotion: 'Власть' },
      { text: 'Слушаю всех и нахожу компромисс', value: 'guardian', emotion: 'Гармония' },
      { text: 'Ухожу своей дорогой', value: 'lone', emotion: 'Свобода' },
      { text: 'Изучаю местность и предлагаю факты', value: 'scout', emotion: 'Знание' }
    ]
  },
  {
    id: 3,
    text: 'Ты один в тёмном лесу. Что чувствуешь?',
    answers: [
      { text: 'Тревогу - мне нужна стая', value: 'guardian', emotion: 'Связь' },
      { text: 'Азарт - это моя стихия', value: 'hunter', emotion: 'Охота' },
      { text: 'Покой - я сам по себе', value: 'lone', emotion: 'Уверенность' },
      { text: 'Сосредоточенность - я изучаю каждый звук', value: 'shadow', emotion: 'Внимание' }
    ]
  },
  {
    id: 4,
    text: 'Добыча близко. Как ты действуешь?',
    answers: [
      { text: 'Организую стаю для облавы', value: 'alpha', emotion: 'Стратегия' },
      { text: 'Выслеживаю тихо и бью точно', value: 'hunter', emotion: 'Точность' },
      { text: 'Нахожу слабые места добычи', value: 'scout', emotion: 'Анализ' },
      { text: 'Атакую молниеносно из засады', value: 'shadow', emotion: 'Скорость' }
    ]
  },
  {
    id: 5,
    text: 'Молодой волк бросает тебе вызов. Реакция?',
    answers: [
      { text: 'Ставлю на место - я здесь главный', value: 'alpha', emotion: 'Доминирование' },
      { text: 'Принимаю вызов как игру', value: 'hunter', emotion: 'Азарт' },
      { text: 'Ухожу - мне не нужны эти игры', value: 'lone', emotion: 'Спокойствие' },
      { text: 'Учу его уважению к старшим', value: 'guardian', emotion: 'Мудрость' }
    ]
  },
  {
    id: 6,
    text: 'Луна полная. Зов воет внутри. Что делаешь?',
    answers: [
      { text: 'Вою первым, собирая стаю', value: 'alpha', emotion: 'Призыв' },
      { text: 'Вою в одиночестве с луной', value: 'lone', emotion: 'Свобода' },
      { text: 'Слушаю вой других, но молчу', value: 'shadow', emotion: 'Тишина' },
      { text: 'Вою вместе со стаей в унисон', value: 'guardian', emotion: 'Единство' }
    ]
  },
  {
    id: 7,
    text: 'Старая территория или новые земли?',
    answers: [
      { text: 'Охраняю то, что знаю', value: 'guardian', emotion: 'Защита' },
      { text: 'Исследую новые земли без страха', value: 'scout', emotion: 'Отвага' },
      { text: 'Захватываю новые территории', value: 'alpha', emotion: 'Завоевание' },
      { text: 'Брожу где хочу, границ не признаю', value: 'lone', emotion: 'Свобода' }
    ]
  },
  {
    id: 8,
    text: 'Чужак на границе территории. Действия?',
    answers: [
      { text: 'Атакую без предупреждения', value: 'hunter', emotion: 'Агрессия' },
      { text: 'Наблюдаю, оцениваю угрозу', value: 'scout', emotion: 'Осторожность' },
      { text: 'Показываю силу, предупреждаю', value: 'alpha', emotion: 'Сила' },
      { text: 'Остаюсь невидимым, слежу', value: 'shadow', emotion: 'Скрытность' }
    ]
  },
  {
    id: 9,
    text: 'Раненый член стаи замедляет всех. Решение?',
    answers: [
      { text: 'Остаюсь и защищаю его', value: 'guardian', emotion: 'Верность' },
      { text: 'Веду стаю дальше - стая важнее', value: 'alpha', emotion: 'Прагматизм' },
      { text: 'Помогаю, но иду своим путём', value: 'lone', emotion: 'Независимость' },
      { text: 'Нахожу безопасное укрытие для него', value: 'scout', emotion: 'Находчивость' }
    ]
  },
  {
    id: 10,
    text: 'Что движет тобой в жизни?',
    answers: [
      { text: 'Власть и уважение', value: 'alpha', emotion: 'Амбиции' },
      { text: 'Свобода и независимость', value: 'lone', emotion: 'Воля' },
      { text: 'Познание и новые тропы', value: 'scout', emotion: 'Любопытство' },
      { text: 'Защита тех, кто важен', value: 'guardian', emotion: 'Любовь' }
    ]
  }
]
const archetypes: WolfArchetype[] = [
  {
    id: 'alpha',
    title: 'ВОЖАК',
    subtitle: 'Альфа стаи',
    description:
      'Ты рождён вести. В твоих глазах горит огонь лидера, и стая чувствует твою силу. Ты принимаешь решения, когда другие сомневаются. Твой вой собирает всех воедино.',
    strengths: ['Природный лидер', 'Защитник стаи', 'Стратег', 'Харизма', 'Решительность'],
    shadows: ['Давление ответственности', 'Одиночество власти', 'Гордыня', 'Сложно доверять']
  },
  {
    id: 'scout',
    title: 'РАЗВЕДЧИК',
    subtitle: 'Глаза стаи',
    description:
      'Ты видишь то, что скрыто от других. Твой нюх ведёт стаю через опасности. Ты знаешь каждую тропу, каждый запах, каждый знак леса. Без тебя стая слепа.',
    strengths: ['Интуиция', 'Наблюдательность', 'Знание местности', 'Мудрость', 'Предвидение'],
    shadows: ['Тревожность', 'Перегрузка информацией', 'Сложность выбора', 'Недооценённость']
  },
  {
    id: 'lone',
    title: 'ОДИНОЧКА',
    subtitle: 'Свободный волк',
    description:
      'Ты идёшь собственным путём. Стая - не для тебя. Луна - твоя единственная спутница. Ты сильнее, чем кажешься, потому что выживаешь один. Твоя свобода - твоя сила.',
    strengths: ['Абсолютная свобода', 'Самодостаточность', 'Сила духа', 'Независимость', 'Выносливость'],
    shadows: ['Одиночество', 'Отсутствие поддержки', 'Недоверие', 'Упрямство']
  },
  {
    id: 'shadow',
    title: 'ТЕНЬ ЛЕСА',
    subtitle: 'Невидимый охотник',
    description:
      'Ты - тишина перед ударом. Ты движешься беззвучно, видишь всё, но остаёшься невидимым. Стая может не знать о твоём вкладе, но без тебя они бы не выжили.',
    strengths: ['Скрытность', 'Терпение', 'Смертельная точность', 'Стратегическое мышление', 'Хладнокровие'],
    shadows: ['Изоляция', 'Непонимание окружающих', 'Замкнутость', 'Недостаток признания']
  },
  {
    id: 'guardian',
    title: 'ХРАНИТЕЛЬ',
    subtitle: 'Сердце стаи',
    description:
      'Ты - связующее звено стаи. Ты чувствуешь каждого, защищаешь слабых, учишь молодых. Без тебя стая распадётся. Твоя сила - в любви к своим.',
    strengths: ['Эмпатия', 'Защита близких', 'Мудрость', 'Гармония в стае', 'Надёжность'],
    shadows: ['Забота о себе на последнем месте', 'Эмоциональное выгорание', 'Сложность сказать "нет"']
  },
  {
    id: 'hunter',
    title: 'ОХОТНИК',
    subtitle: 'Клыки стаи',
    description:
      'Ты живёшь азартом погони. Кровь добычи, запах страха - это твоя стихия. Ты кормишь стаю. Твои клыки и когти - оружие выживания всех.',
    strengths: ['Скорость и ловкость', 'Инстинкт охотника', 'Физическая сила', 'Решительность', 'Выносливость'],
    shadows: ['Импульсивность', 'Жажда адреналина', 'Агрессивность', 'Сложность расслабиться']
  }
]

const archetypeImages: Record<AnswerValue, string> = {
  alpha: '/images/wolftest/alpha.png',
  lone: '/images/wolftest/lone.png',
  shadow: '/images/wolftest/shadow.png',
  guardian: '/images/wolftest/guardian.png',
  scout: '/images/wolftest/scout.png',
  hunter: '/images/wolftest/hunter.png'
}
const screen = ref<'welcome' | 'question' | 'result'>('welcome')
const currentQuestionIndex = ref(0)
const answers = ref<AnswerValue[]>([])
const result = ref<WolfArchetype | null>(null)
const musicEnabled = ref(false)
const audioRef = ref<HTMLAudioElement | null>(null)

const shareLabel = ref('Поделиться результатом')
const shareNote = ref('')
let shareTimer: ReturnType<typeof setTimeout> | null = null

const currentQuestion = computed(() => questions[currentQuestionIndex.value])
const progress = computed(() => ((currentQuestionIndex.value + 1) / questions.length) * 100)

const resultArchetype = computed(() => result.value || archetypes[0])
const resultImage = computed(() => archetypeImages[resultArchetype.value.id])

const handleStart = () => {
  screen.value = 'question'
  currentQuestionIndex.value = 0
  answers.value = []
  result.value = null
  musicEnabled.value = true
  syncAudio()
}

const handleAnswer = (value: AnswerValue) => {
  const newAnswers = [...answers.value, value]
  answers.value = newAnswers

  if (currentQuestionIndex.value < questions.length - 1) {
    currentQuestionIndex.value += 1
    return
  }

  const counts: Record<AnswerValue, number> = {
    alpha: 0,
    scout: 0,
    lone: 0,
    shadow: 0,
    guardian: 0,
    hunter: 0
  }

  newAnswers.forEach((answer) => {
    counts[answer] += 1
  })

  const order: AnswerValue[] = ['alpha', 'scout', 'guardian', 'hunter', 'lone', 'shadow']
  const top = order
    .map((key) => ({ key, score: counts[key] }))
    .sort((a, b) => b.score - a.score || order.indexOf(a.key) - order.indexOf(b.key))[0].key

  result.value = archetypes.find((item) => item.id === top) || archetypes[0]
  screen.value = 'result'
}

const handleRestart = () => {
  screen.value = 'welcome'
  currentQuestionIndex.value = 0
  answers.value = []
  result.value = null
  shareLabel.value = 'Поделиться результатом'
  shareNote.value = ''
  if (shareTimer) {
    clearTimeout(shareTimer)
    shareTimer = null
  }
}

const toggleMusic = () => {
  musicEnabled.value = !musicEnabled.value
  syncAudio()
}

const syncAudio = () => {
  const audio = audioRef.value
  if (!audio) return
  if (!musicEnabled.value) {
    audio.pause()
    audio.currentTime = 0
    return
  }
  audio.play().catch(() => {
    musicEnabled.value = false
  })
}

const shareResult = async () => {
  if (typeof window === 'undefined') return
  const text = `Я прошел тест "Кто ты в стае" и мой результат: ${resultArchetype.value.title} - ${resultArchetype.value.subtitle}!`
  const url = window.location.href

  try {
    if (navigator.share) {
      await navigator.share({ title: 'Кто ты в стае', text, url })
      shareNote.value = 'Ссылка отправлена.'
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${text} ${url}`)
      shareLabel.value = 'Скопировано'
      shareNote.value = 'Результат скопирован в буфер.'
    } else {
      shareNote.value = `Скопируй ссылку вручную: ${url}`
    }
  } catch (error) {
    shareNote.value = 'Не удалось поделиться. Попробуй еще раз.'
  }

  if (shareTimer) clearTimeout(shareTimer)
  shareTimer = setTimeout(() => {
    shareLabel.value = 'Поделиться результатом'
    shareNote.value = ''
  }, 2400)
}

onBeforeUnmount(() => {
  if (shareTimer) clearTimeout(shareTimer)
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.currentTime = 0
  }
})

const seededRandom = (() => {
  let seed = 4271
  return () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
})()

const welcomeParticles = Array.from({ length: 20 }).map((_, idx) => {
  const size = 4 + Math.round(seededRandom() * 4)
  return {
    id: `w-${idx}`,
    top: `${Math.round(seededRandom() * 90)}%`,
    left: `${Math.round(seededRandom() * 90)}%`,
    size: `${size}px`,
    duration: `${10 + Math.round(seededRandom() * 10)}s`,
    delay: `${Math.round(seededRandom() * 8)}s`
  }
})

const resultParticles = Array.from({ length: 24 }).map((_, idx) => {
  return {
    id: `r-${idx}`,
    dx: `${Math.round((seededRandom() * 2 - 1) * 40)}vw`,
    dy: `${Math.round((seededRandom() * 2 - 1) * 30)}vh`,
    delay: `${(idx * 0.05).toFixed(2)}s`
  }
})

const particleStyle = (particle: (typeof welcomeParticles)[number]) => ({
  top: particle.top,
  left: particle.left,
  width: particle.size,
  height: particle.size,
  animationDuration: particle.duration,
  animationDelay: particle.delay
})

const resultParticleStyle = (particle: (typeof resultParticles)[number]) => ({
  '--dx': particle.dx,
  '--dy': particle.dy,
  animationDelay: particle.delay
})

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/games/wolftest`)
const metaDescription =
  'Полноценный тест «Кто ты в стае?» на 10 вопросов: неоновый лес, архетип волка и трофей для скрина.'

useSeoMeta(() => ({
  title: 'Кто ты в стае? | Волчий тест',
  description: metaDescription,
  ogTitle: 'Кто ты в стае? | Волчий тест',
  ogDescription: metaDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
}))

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }]
}))
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;800&family=Manrope:wght@400;600&display=swap');

.wolf-test {
  position: relative;
  min-height: 100vh;
  color: #f8fafc;
  font-family: 'Manrope', 'Segoe UI', sans-serif;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  padding-bottom: 48px;
}

.wolf-bg {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(8, 15, 30, 0.8), transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.15), transparent 45%),
    radial-gradient(circle at 50% 80%, rgba(168, 85, 247, 0.12), transparent 45%),
    #030308;
  z-index: 0;
  pointer-events: none;
}

.wolf-glow {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.35;
  animation: glowPulse 7s ease-in-out infinite;
}

.glow-one {
  top: 10%;
  left: 10%;
  background: rgba(6, 182, 212, 0.5);
}

.glow-two {
  bottom: 10%;
  right: 15%;
  background: rgba(16, 185, 129, 0.4);
  animation-delay: -3s;
}

.glow-three {
  bottom: 25%;
  left: 30%;
  background: rgba(168, 85, 247, 0.4);
  animation-delay: -5s;
}

.screen {
  position: relative;
  min-height: 90vh;
  padding: clamp(24px, 4vw, 48px) 0 clamp(40px, 6vw, 72px);
  z-index: 1;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  flex: 1 0 auto;
}

.screen-content {
  width: min(1100px, 100% - 24px);
  margin: 0 auto;
  position: relative;
  display: grid;
  gap: 24px;
  justify-items: center;
  text-align: center;
  z-index: 3;
  overflow: visible;
}

.welcome-screen {
  display: grid;
  place-items: center;
  overflow: visible;
}

.welcome-image {
  position: fixed;
  inset: 0;
  background: url('/images/wolftest/hero.png') center/cover no-repeat;
  opacity: 0.35;
  z-index: 0;
}

.welcome-overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.75), rgba(2, 6, 23, 0.92));
  z-index: 1;
}

.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.particle {
  position: absolute;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.35);
  animation: particleFloat 12s linear infinite;
}

.welcome-icons {
  display: flex;
  gap: 18px;
  justify-content: center;
}

.icon-pill {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  border: 1px solid rgba(6, 182, 212, 0.45);
  background: rgba(6, 182, 212, 0.12);
  display: grid;
  place-items: center;
  color: #22d3ee;
  animation: pulseSoft 4s ease-in-out infinite;
}

.icon-pill svg {
  width: 20px;
  height: 20px;
}

.icon-pill.alt {
  color: #a855f7;
  border-color: rgba(168, 85, 247, 0.5);
  background: rgba(168, 85, 247, 0.12);
  animation-delay: -1s;
}

.icon-pill.emerald {
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(16, 185, 129, 0.12);
  animation-delay: -2s;
}

.welcome-title {
  margin: 0;
  font-family: 'Unbounded', sans-serif;
  font-size: clamp(36px, 6vw, 72px);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-shadow: 0 0 40px rgba(6, 182, 212, 0.45);
}

.welcome-title span {
  display: block;
  background: linear-gradient(90deg, #22d3ee, #a855f7, #10b981);
  -webkit-background-clip: text;
  color: transparent;
}

.welcome-lead {
  margin: 0;
  font-size: clamp(18px, 2vw, 24px);
  color: #e2e8f0;
}

.welcome-sub {
  margin: 0;
  font-size: clamp(16px, 1.8vw, 20px);
  color: #94a3b8;
}

.welcome-divider {
  width: 220px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #22d3ee, transparent);
}

.cta-button {
  position: relative;
  padding: 18px 36px;
  border-radius: 16px;
  border: 1px solid rgba(34, 211, 238, 0.6);
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.8), rgba(168, 85, 247, 0.8), rgba(16, 185, 129, 0.8));
  color: #031025;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 20px 40px rgba(6, 182, 212, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 48px rgba(6, 182, 212, 0.4);
}

.cta-arrow {
  display: inline-block;
  animation: arrowMove 1.6s ease-in-out infinite;
}

.welcome-foot {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: #64748b;
}

.question-screen {
  display: grid;
  place-items: center;
}

.progress-bar {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.6);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #a855f7, #10b981);
  transition: width 0.4s ease;
}

.question-counter {
  font-size: 12px;
  letter-spacing: 0.18em;
  color: #94a3b8;
}

.question-card {
  position: relative;
  padding: clamp(24px, 4vw, 40px);
  border-radius: 24px;
  background: linear-gradient(140deg, rgba(15, 23, 42, 0.95), rgba(10, 14, 26, 0.95));
  border: 1px solid rgba(34, 211, 238, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  width: 100%;
  max-width: 980px;
}

.question-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.question-card h2 {
  position: relative;
  margin: 0;
  font-size: clamp(22px, 3vw, 32px);
  font-family: 'Unbounded', sans-serif;
}

.answers-grid {
  display: grid;
  gap: 16px;
  width: 100%;
  max-width: 980px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.answer-card {
  text-align: left;
  padding: 18px 20px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: linear-gradient(140deg, rgba(9, 12, 24, 0.9), rgba(15, 23, 42, 0.9));
  color: #e2e8f0;
  display: grid;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  animation: answerFade 0.5s ease forwards;
  opacity: 0;
}

.answer-card:hover {
  transform: translateY(-3px);
  border-color: rgba(34, 211, 238, 0.6);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.4);
}

.answer-emotion {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #22d3ee;
  border: 1px solid rgba(34, 211, 238, 0.4);
  padding: 4px 10px;
  border-radius: 999px;
  width: fit-content;
}

.answer-text {
  font-size: 17px;
  color: #e2e8f0;
}

.ambient-orb {
  position: fixed;
  top: 55%;
  width: 160px;
  height: 160px;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.5;
  animation: pulseSoft 4s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

.ambient-orb.left {
  left: -40px;
  background: rgba(168, 85, 247, 0.4);
}

.ambient-orb.right {
  right: -40px;
  background: rgba(16, 185, 129, 0.4);
  animation-delay: -2s;
}
.result-screen {
  display: grid;
  place-items: center;
}

.result-header {
  display: grid;
  gap: 10px;
  justify-items: center;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: #94a3b8;
}

.sparkle-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
  font-size: 24px;
}

.result-card {
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid rgba(34, 211, 238, 0.3);
  background: linear-gradient(140deg, rgba(15, 23, 42, 0.95), rgba(9, 12, 24, 0.95));
  box-shadow: 0 26px 60px rgba(0, 0, 0, 0.5);
}

.result-hero {
  position: relative;
  height: 360px;
  overflow: hidden;
}

.result-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(2, 6, 23, 0.3), rgba(2, 6, 23, 0.9));
}

.result-title {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 28px;
  text-align: left;
}

.result-title p {
  margin: 0 0 8px;
  color: #22d3ee;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 12px;
}

.result-title h1 {
  margin: 0;
  font-size: clamp(36px, 5vw, 60px);
  font-family: 'Unbounded', sans-serif;
  text-shadow: 0 0 40px rgba(6, 182, 212, 0.4);
}

.result-body {
  padding: clamp(24px, 4vw, 40px);
  display: grid;
  gap: 24px;
  text-align: left;
}

.result-description {
  margin: 0;
  color: #d1d5db;
  font-size: 18px;
  line-height: 1.7;
}

.result-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.result-block {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(2, 6, 23, 0.6);
}

.result-block.strengths {
  border-color: rgba(16, 185, 129, 0.4);
}

.result-block.shadows {
  border-color: rgba(168, 85, 247, 0.4);
}

.block-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.block-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 16px;
}

.result-block.strengths .block-icon {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.result-block.shadows .block-icon {
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
}

.block-title h3 {
  margin: 0;
  font-size: 18px;
}

.result-block ul {
  margin: 0;
  padding: 0 0 0 18px;
  color: #cbd5f5;
  display: grid;
  gap: 8px;
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.action {
  padding: 14px 24px;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.action.primary {
  background: linear-gradient(90deg, rgba(6, 182, 212, 0.9), rgba(168, 85, 247, 0.9));
  border: none;
  color: #020617;
}

.action:hover {
  transform: translateY(-2px);
  border-color: rgba(34, 211, 238, 0.6);
}

.share-note {
  margin: 0;
  font-size: 13px;
  color: #94a3b8;
}

.result-footer {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.2em;
  color: #64748b;
}

.music-toggle {
  position: fixed;
  right: 18px;
  bottom: 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 999px;
  border: 1px solid rgba(34, 211, 238, 0.4);
  background: rgba(3, 7, 18, 0.8);
  color: #e2e8f0;
  font-weight: 700;
  z-index: 20;
  cursor: pointer;
}

.music-status {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: #22d3ee;
}

.celebration {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.celebration-particle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(34, 211, 238, 0.7);
  animation: burst 2s ease-out forwards;
}

.screen-fade-enter-active,
.screen-fade-leave-active {
  transition: opacity 0.4s ease;
}

.screen-fade-enter-from,
.screen-fade-leave-to {
  opacity: 0;
}

@keyframes particleFloat {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-20px);
    opacity: 1;
  }
}

@keyframes pulseSoft {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes arrowMove {
  0%,
  100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(6px);
  }
}

@keyframes glowPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

@keyframes answerFade {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes burst {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.2);
    opacity: 0;
  }
}

@media (max-width: 720px) {
  .answers-grid {
    grid-template-columns: 1fr;
  }

  .screen-content {
    text-align: center;
  }

  .answer-card {
    text-align: left;
  }

  .result-body {
    text-align: left;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}


</style>

