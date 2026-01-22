<template>
  <main class="decisions-page">
    <div class="ambient">
      <span class="orb orb-one" aria-hidden="true"></span>
      <span class="orb orb-two" aria-hidden="true"></span>
      <span class="orb orb-three" aria-hidden="true"></span>
    </div>

    <section class="hero">
      <Breadcrumbs :items="breadcrumbs" />
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="hero-kicker">Быстрые решения онлайн</p>
          <h1>Решения: выбор, случайности и инструменты для быстрых ответов</h1>
          <TextType
            class="hero-lead"
            :text="[
              'Когда нужен честный выбор без споров: монетка, колесо, рандомайзер и розыгрыши.',
              'Все работает в браузере, без регистрации и лишних шагов.'
            ]"
            :typing-speed="70"
            :pause-duration="1400"
            :show-cursor="true"
            cursor-character="|"
          />
          <div class="hero-actions">
            <NuxtLink class="btn" to="/decisions/coin-flip">Бросить монетку</NuxtLink>
            <NuxtLink class="btn secondary" to="/decisions/wheel-of-fortune">Крутануть колесо</NuxtLink>
          </div>
          <div class="hero-tags">
            <span class="tag">без регистрации</span>
            <span class="tag">честный выбор</span>
            <span class="tag">для команд и игр</span>
          </div>
        </div>

        <div class="hero-panel">
          <div class="panel-card">
            <p class="panel-title">Что внутри прямо сейчас</p>
            <div class="panel-stats">
              <div class="panel-stat">
                <div class="panel-value">{{ totalTools }}</div>
                <div class="panel-label">инструментов</div>
              </div>
              <div class="panel-stat">
                <div class="panel-value">{{ categories.length }}</div>
                <div class="panel-label">категорий</div>
              </div>
              <div class="panel-stat">
                <div class="panel-value">0 ₽</div>
                <div class="panel-label">за доступ</div>
              </div>
            </div>
            <p class="panel-note">
              Добавляем новые решения по запросам. Напиши, если нужен инструмент под твою задачу.
            </p>
          </div>
          <div class="panel-card secondary">
            <p class="panel-title">Сюда приходят за</p>
            <ul class="panel-list">
              <li>быстрым выбором между вариантами</li>
              <li>розыгрышами и распределением людей</li>
              <li>случайными датами и таймерами</li>
              <li>легким фаном и текстовыми утилитами</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-section">
      <div class="section-head">
        <h2 class="section-title">Популярные решения</h2>
        <p class="section-lead">Самые частые сценарии: выбор, розыгрыши и быстрый рандом.</p>
      </div>
      <div class="grid three">
        <NuxtLink
          v-for="tool in featuredTools"
          :key="tool.title"
          class="card decision-card decision-card-link"
          :to="tool.link"
        >
          <div class="tag">{{ tool.tag }}</div>
          <h3>{{ tool.title }}</h3>
          <p>{{ tool.description }}</p>
          <div class="chip-row">
            <div class="chip">{{ tool.mood }}</div>
            <div class="chip">{{ tool.scope }}</div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="category-section">
      <div class="section-head">
        <h2 class="section-title">Категории решений</h2>
        <p class="section-lead">Выбери нужный формат: быстрый выбор, розыгрыши, текст или таймеры.</p>
      </div>
      <div class="category-chips">
        <a v-for="category in categories" :key="category.id" class="category-chip" :href="`#${category.id}`">
          {{ category.label }}
        </a>
      </div>
      <div class="category-grid">
        <section v-for="category in groupedTools" :key="category.id" class="category-block" :id="category.id">
          <div class="category-head">
            <h3>{{ category.label }}</h3>
            <p>{{ category.description }}</p>
          </div>
          <div class="grid two">
            <NuxtLink
              v-for="tool in category.items"
              :key="tool.title"
              class="card decision-card decision-card-link"
              :to="tool.link"
            >
              <div class="tag">{{ tool.tag }}</div>
              <h4>{{ tool.title }}</h4>
              <p>{{ tool.description }}</p>
              <div class="chip-row">
                <div class="chip">{{ tool.mood }}</div>
                <div class="chip">{{ tool.scope }}</div>
              </div>
            </NuxtLink>
          </div>
        </section>
      </div>
    </section>

    <section class="seo-section" aria-label="SEO текст">
      <div class="seo-card">
        <div class="seo-copy">
          <h2>Решения онлайн: быстрый выбор без споров</h2>
          <p>
            Волий собрал инструменты для честного выбора и случайностей: монетка, колесо, рандомайзер, розыгрыши и
            генераторы команд. Все работает в браузере, без регистрации и лишних шагов. Нужно выбрать вариант,
            распределить людей или запустить таймер? Открывай нужный инструмент и получай результат сразу.
          </p>

          <h3>Как выбрать подходящий инструмент</h3>
          <ol>
            <li>Определи задачу: выбор, розыгрыш, дата, фокус или текст.</li>
            <li>Открой категорию или начни с популярных решений сверху.</li>
            <li>Сохрани результат или просто повтори попытку, если нужно.</li>
          </ol>

          <h3>Почему это удобно</h3>
          <ul>
            <li>Быстрый результат без регистрации и подписок.</li>
            <li>Работает на телефоне и на десктопе.</li>
            <li>Можно использовать в команде, с друзьями или для личных задач.</li>
          </ul>
        </div>
        <div class="seo-aside">
          <div class="seo-panel">
            <p class="seo-kicker">Лучше всего подходят для</p>
            <ul>
              <li>командных встреч и брейнштормов</li>
              <li>розыгрышей и распределений</li>
              <li>быстрого выбора между вариантами</li>
              <li>фокусировки и коротких таймеров</li>
            </ul>
          </div>
          <div class="seo-panel accent">
            <p class="seo-kicker">Мини-гид</p>
            <p>
              Нужен выбор? Открой монетку или колесо. Нужно распределить людей - команды или розыгрыш. Для фокуса -
              помодоро. Для легкого фана - калькулятор любви и генератор пива.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="section-head">
        <h2 class="section-title">FAQ про решения Волий</h2>
        <p class="section-lead">Коротко о доступе, честности и сценариях.</p>
      </div>
      <div class="faq-grid">
        <details v-for="item in faqItems" :key="item.q" class="faq-item">
          <summary>{{ item.q }}</summary>
          <p>{{ item.a }}</p>
        </details>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useHead, useRequestURL, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import TextType from '@/components/ui/TextType.vue'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Решения' }
]

const categories = [
  {
    id: 'choice',
    label: 'Быстрый выбор',
    description: 'Когда нужно решить между вариантами за секунды.'
  },
  {
    id: 'teams',
    label: 'Команды и розыгрыши',
    description: 'Честное распределение людей и выбор победителей.'
  },
  {
    id: 'dates',
    label: 'Даты и фокус',
    description: 'Случайные даты, таймеры и фокус на задаче.'
  },
  {
    id: 'text',
    label: 'Текст и документы',
    description: 'Утилиты для текста и оформления документов.'
  },
  {
    id: 'fun',
    label: 'Фан и легкие решения',
    description: 'Легкие сценарии, чтобы добавить немного веселья.'
  }
]

const tools = [
  {
    title: 'Монетка',
    tag: 'шанс 50/50',
    description: 'Оставь выбор на удачу: орел или решка. Быстро, честно и без аргументов.',
    mood: 'нейтральный выбор',
    scope: '10 секунд',
    category: 'choice',
    featured: true,
    link: '/decisions/coin-flip'
  },
  {
    title: 'Колесо фортуны',
    tag: 'колесо выбора',
    description: 'Крути колесо, чтобы выбрать еду, решение или победителя без споров.',
    mood: 'азартно',
    scope: '5 секунд',
    category: 'choice',
    featured: true,
    link: '/decisions/wheel-of-fortune'
  },
  {
    title: 'Генератор победителя',
    tag: 'розыгрыш',
    description: 'Выбери одного или нескольких победителей, настрой фильтры и скачай протокол розыгрыша.',
    mood: 'прозрачно',
    scope: '1 минута',
    category: 'teams',
    featured: true,
    link: '/decisions/giveaway-winner'
  },
  {
    title: 'Разделить на команды',
    tag: 'командный баланс',
    description: 'Разбей список людей на команды случайно или с учетом силы участников.',
    mood: 'честно',
    scope: '30 секунд',
    category: 'teams',
    link: '/decisions/team-generator'
  },
  {
    title: 'Конвертер чисел',
    tag: 'сумма прописью',
    description:
      'Конвертер чисел в сумму прописью для документов. Поддержка НДС 12% и 20%, правильные склонения.',
    mood: 'для документов',
    scope: '15 секунд',
    category: 'text',
    link: '/decisions/summa-propisyu'
  },
  {
    title: 'Рандом решает за тебя',
    tag: 'рандомайзер',
    description: 'Случайные числа, выбор между да и нет, список вариантов в одном инструменте.',
    mood: 'весело и быстро',
    scope: '1 клик',
    category: 'choice',
    featured: true,
    link: '/decisions/randomizer'
  },
  {
    title: 'Случайная дата',
    tag: 'диапазон дат',
    description: 'Выбери диапазон и получи случайную дату: будни, выходные, исключения и время.',
    mood: 'планы и челленджи',
    scope: '5 секунд',
    category: 'dates',
    link: '/decisions/random-date'
  },
  {
    title: 'Таймер Помодоро',
    tag: 'фокус и отдых',
    description: 'Помодоро таймер с настройками, звуком, уведомлениями и сохранением прогресса.',
    mood: 'продуктивность',
    scope: 'запуск за секунду',
    category: 'dates',
    link: '/decisions/pomodoro'
  },
  {
    title: 'Калькулятор любви',
    tag: 'проверь совместимость',
    description: 'Узнайте, насколько вы подходите друг другу. Просто введите два имени и нажмите кнопку.',
    mood: 'любовь',
    scope: '30 секунд',
    category: 'fun',
    link: '/decisions/love-calculator'
  },
  {
    title: 'Реверс текста',
    tag: 'текст',
    description: 'Переверни текст полностью, по словам или по строкам. Бесплатно и без регистрации.',
    mood: 'работает в браузере',
    scope: '1 клик',
    category: 'text',
    link: '/decisions/text-reverser'
  },
  {
    title: 'Счетчик текста',
    tag: 'статистика',
    description: 'Символы, слова, строки, абзацы, предложения и время чтения в одном окне.',
    mood: 'SEO магнит',
    scope: 'мгновенно',
    category: 'text',
    link: '/decisions/text-counter'
  },
  {
    title: 'Генератор пива',
    tag: 'мемный выбор',
    description: 'Случайный стиль пива, температура подачи, закуска и волчий вердикт на вечер.',
    mood: 'легкий вайб',
    scope: '1 клик',
    category: 'fun',
    link: '/decisions/beer'
  }
]

const totalTools = tools.length
const featuredTools = tools.filter((tool) => tool.featured)

const groupedTools = computed(() =>
  categories
    .map((category) => ({
      ...category,
      items: tools.filter((tool) => tool.category === category.id)
    }))
    .filter((category) => category.items.length > 0)
)

const faqItems = [
  {
    q: 'Нужна ли регистрация для решений?',
    a: 'Нет. Все инструменты работают сразу в браузере и доступны бесплатно.'
  },
  {
    q: 'Насколько честен рандом?',
    a: 'Используется стандартный генератор случайных чисел браузера, результат независим от пользователя.'
  },
  {
    q: 'Можно ли использовать решения на телефоне?',
    a: 'Да, интерфейсы адаптированы под мобильные устройства.'
  },
  {
    q: 'Как предложить новый инструмент?',
    a: 'Напиши в команду Волий через контактную форму или соцсети - идеи быстро попадают в бэклог.'
  }
]

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions`)
const metaDescription =
  'Решения Волий: монетка, колесо выбора, рандомайзер, розыгрыши, команды, таймеры и текстовые утилиты. Все работает в браузере, бесплатно и без регистрации.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: 'Решения Волий',
      description: metaDescription,
      url: canonicalUrl.value
    },
    {
      '@type': 'ItemList',
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        url: `${requestUrl.origin}${tool.link}`
      }))
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a
        }
      }))
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${requestUrl.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Решения', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Решения онлайн: выбор, розыгрыши и инструменты | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Решения онлайн: выбор, розыгрыши и инструменты | Neural Wise Wolf',
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
.decisions-page {
  position: relative;
  overflow: hidden;
  display: grid;
  gap: clamp(32px, 4vw, 56px);
  padding-bottom: clamp(32px, 5vw, 72px);
}

.ambient {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.orb {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 999px;
  filter: blur(0px);
  opacity: 0.55;
  animation: float 10s ease-in-out infinite;
}

.orb-one {
  top: 24px;
  left: 24px;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.35), rgba(96, 165, 250, 0.05));
}

.orb-two {
  right: 24px;
  top: 200px;
  background: radial-gradient(circle, rgba(248, 113, 113, 0.3), rgba(248, 113, 113, 0.04));
  animation-delay: 1.2s;
}

.orb-three {
  left: 15%;
  bottom: 24px;
  background: radial-gradient(circle, rgba(129, 140, 248, 0.25), rgba(129, 140, 248, 0.04));
  animation-delay: 2.4s;
}

.hero,
.featured-section,
.category-section,
.seo-section,
.faq-section {
  position: relative;
  z-index: 1;
  width: min(1200px, 100% - 48px);
  margin: 0 auto;
}

.hero {
  padding-top: clamp(32px, 5vw, 64px);
}

.hero-grid {
  display: grid;
  gap: 28px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  align-items: start;
}

.hero-copy h1 {
  margin: 0 0 12px;
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: clamp(34px, 4.2vw, 52px);
  letter-spacing: -0.6px;
}

.hero-kicker {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: var(--muted);
}

.hero-lead {
  margin: 0 0 18px;
  color: var(--muted);
  line-height: 1.6;
  min-height: calc(1.6em * 3);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hero-panel {
  display: grid;
  gap: 16px;
}

.panel-card {
  border-radius: 20px;
  border: 1px solid var(--border);
  background: linear-gradient(160deg, rgba(96, 165, 250, 0.08), rgba(248, 113, 113, 0.06)),
    rgba(15, 23, 42, 0.75);
  padding: 20px;
  display: grid;
  gap: 14px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35);
}

.panel-card.secondary {
  background: rgba(15, 23, 42, 0.55);
}

.panel-title {
  margin: 0;
  font-weight: 700;
}

.panel-stats {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.panel-stat {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  text-align: center;
}

.panel-value {
  font-size: 28px;
  font-weight: 700;
}

.panel-label {
  font-size: 12px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.panel-note {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.panel-list {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  display: grid;
  gap: 8px;
}

.section-head {
  display: grid;
  gap: 8px;
  margin-bottom: 18px;
}

.featured-section .section-title,
.category-section .section-title,
.faq-section .section-title {
  margin: 0;
}

.decision-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.decision-card-link:hover {
  transform: translateY(-4px);
  border-color: rgba(96, 165, 250, 0.35);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35);
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.category-chip {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  font-weight: 600;
  transition: transform 0.15s ease, border-color 0.2s ease;
}

.category-chip:hover {
  transform: translateY(-2px);
  border-color: rgba(248, 113, 113, 0.5);
}

.category-grid {
  display: grid;
  gap: 28px;
}

.category-block {
  display: grid;
  gap: 16px;
}

.category-head h3 {
  margin: 0 0 6px;
  font-size: 22px;
}

.category-head p {
  margin: 0;
  color: var(--muted);
}

.seo-section {
  padding-top: 8px;
}

.seo-card {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  border-radius: 22px;
  border: 1px solid var(--border);
  background: linear-gradient(150deg, rgba(96, 165, 250, 0.1), rgba(15, 23, 42, 0.6));
  padding: clamp(18px, 3vw, 28px);
}

.seo-copy h2,
.seo-copy h3 {
  margin: 0 0 10px;
}

.seo-copy p {
  margin: 0 0 16px;
  color: var(--muted);
  line-height: 1.7;
}

.seo-copy ul,
.seo-copy ol {
  margin: 0 0 16px;
  padding-left: 20px;
  color: var(--muted);
  display: grid;
  gap: 8px;
}

.seo-aside {
  display: grid;
  gap: 16px;
}

.seo-panel {
  border-radius: 16px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
  color: var(--muted);
  line-height: 1.6;
}

.seo-panel.accent {
  background: linear-gradient(130deg, rgba(248, 113, 113, 0.14), rgba(15, 23, 42, 0.5));
  color: var(--text);
}

.seo-kicker {
  margin: 0 0 10px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--muted);
}

.seo-panel ul {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
}

.faq-section {
  display: grid;
  gap: 18px;
}

.faq-grid {
  display: grid;
  gap: 12px;
}

.faq-item {
  border-radius: 14px;
  border: 1px solid var(--border);
  background: rgba(15, 23, 42, 0.55);
  padding: 12px 16px;
  transition: border-color 0.2s ease;
}

.faq-item[open] {
  border-color: rgba(96, 165, 250, 0.35);
}

.faq-item summary {
  cursor: pointer;
  font-weight: 700;
}

.faq-item p {
  margin: 10px 0 0;
  color: var(--muted);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-16px);
  }
}

@media (max-width: 820px) {
  .hero {
    padding-top: 28px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-actions .btn,
  .hero-actions .btn.secondary {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 620px) {
  .decisions-page {
    gap: 28px;
  }

  .hero,
  .featured-section,
  .category-section,
  .seo-section,
  .faq-section {
    width: min(1200px, 100% - 32px);
  }
}
</style>
