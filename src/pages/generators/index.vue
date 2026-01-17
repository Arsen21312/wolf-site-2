<template>
  <main class="generators-page">
    <div class="ambient">
      <span class="orb orb-one" aria-hidden="true"></span>
      <span class="orb orb-two" aria-hidden="true"></span>
      <span class="orb orb-three" aria-hidden="true"></span>
    </div>

    <section class="hero">
      <Breadcrumbs :items="breadcrumbs" />
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="hero-kicker">Быстрые онлайн-генераторы</p>
          <h1>Генераторы: тексты, коды, таймеры и идеи</h1>
          <TextType
            class="hero-lead"
            :text="[
              'Все работает в браузере: копируй, генерируй, сохраняй без регистрации.',
              'Собрали в одном месте QR, форматы текста, шифры, таймеры и генераторы идей.'
            ]"
            :typing-speed="60"
            :pause-duration="1400"
            :show-cursor="true"
            cursor-character="|"
          />
          <div class="hero-actions">
            <NuxtLink class="btn" to="/generators/qr-generator">Начать с QR</NuxtLink>
            <NuxtLink class="btn secondary" to="/generators/wolf-quotes">Нужен импульс</NuxtLink>
          </div>
          <div class="hero-tags">
            <span class="tag">без регистрации</span>
            <span class="tag">для работы и вдохновения</span>
            <span class="tag">от стаи</span>
          </div>
        </div>

        <div class="hero-panel">
          <div class="panel-card">
            <p class="panel-title">Что внутри прямо сейчас</p>
            <div class="panel-stats">
              <div class="panel-stat">
                <div class="panel-value">{{ totalGenerators }}</div>
                <div class="panel-label">генераторов</div>
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
              Добавляем инструменты по запросам. Если нужен новый генератор — напиши, стая услышит.
            </p>
          </div>
          <div class="panel-card secondary">
            <p class="panel-title">Сюда приходят за</p>
            <ul class="panel-list">
              <li>быстрой чисткой и форматированием текста</li>
              <li>созданием QR, ссылок и кодировок</li>
              <li>идеями для контента и общения</li>
              <li>таймерами и отсчетами</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-section">
      <div class="section-head">
        <h2 class="section-title">Популярные генераторы</h2>
        <p class="section-lead">С них чаще всего начинают — быстро дают результат и цепляют.</p>
      </div>
      <div class="grid three">
        <NuxtLink
          v-for="generator in featuredGenerators"
          :key="generator.title"
          class="card generator-card generator-card-link"
          :to="generator.link"
        >
          <div class="tag">{{ generator.tag }}</div>
          <h3>{{ generator.title }}</h3>
          <p>{{ generator.description }}</p>
          <div class="chip-row">
            <div class="chip">{{ generator.mood }}</div>
            <div class="chip">{{ generator.scope }}</div>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="category-section">
      <div class="section-head">
        <h2 class="section-title">Категории генераторов</h2>
        <p class="section-lead">Переходи сразу в нужную область — текст, код, вдохновение, таймеры.</p>
      </div>
      <div class="category-chips">
        <a v-for="category in categories" :key="category.id" class="category-chip" :href="`#${category.id}`">
          {{ category.label }}
        </a>
      </div>
      <div class="category-grid">
        <section v-for="category in groupedGenerators" :key="category.id" class="category-block" :id="category.id">
          <div class="category-head">
            <h3>{{ category.label }}</h3>
            <p>{{ category.description }}</p>
          </div>
          <div class="grid two">
            <NuxtLink
              v-for="generator in category.items"
              :key="generator.title"
              class="card generator-card generator-card-link"
              :to="generator.link"
            >
              <div class="tag">{{ generator.tag }}</div>
              <h4>{{ generator.title }}</h4>
              <p>{{ generator.description }}</p>
              <div class="chip-row">
                <div class="chip">{{ generator.mood }}</div>
                <div class="chip">{{ generator.scope }}</div>
              </div>
            </NuxtLink>
          </div>
        </section>
      </div>
    </section>

    <section class="seo-section" aria-label="SEO текст">
      <div class="seo-card">
        <div class="seo-copy">
          <h2>Генераторы онлайн под любые задачи — без регистрации</h2>
          <p>
            Волий собирает компактные и полезные генераторы, которые помогают экономить время и быстро получать результат.
            Здесь есть инструменты для текста, кода, идей, общения и таймеров. Все работает прямо в браузере: никаких
            установок, логинов и лишних экранов. Нужно быстро отформатировать текст, подготовить QR или найти идею?
            Открываешь нужный генератор и делаешь за минуту.
          </p>

          <h3>Как выбрать нужный генератор</h3>
          <ol>
            <li>Определи задачу: текст, код, контент, таймер или развлечение.</li>
            <li>Открой категорию или воспользуйся популярными подборками сверху.</li>
            <li>Скопируй результат или скачай файл (PNG, SVG, TXT) — все доступно сразу.</li>
          </ol>

          <h3>Почему это удобно</h3>
          <ul>
            <li>Работает на телефоне и на десктопе, без регистрации и подписок.</li>
            <li>Есть быстрые сценарии: от QR для Wi-Fi до чистки текста и генерации никнеймов.</li>
            <li>Каждый генератор заточен под конкретную задачу, без лишних кликов.</li>
          </ul>
        </div>
        <div class="seo-aside">
          <div class="seo-panel">
            <p class="seo-kicker">Лучше всего подходят для</p>
            <ul>
              <li>контент-менеджеров и редакторов</li>
              <li>дизайнеров и разработчиков</li>
              <li>создателей сторис и постов</li>
              <li>командных созвонов и игр</li>
            </ul>
          </div>
          <div class="seo-panel accent">
            <p class="seo-kicker">Мини-гид</p>
            <p>
              Нужна скорость? Открой QR, Base64 или Форматер JSON. Для вдохновения — цитаты и никнеймы. Для планов —
              таймеры до лета и Нового года.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="section-head">
        <h2 class="section-title">FAQ про генераторы Волий</h2>
        <p class="section-lead">Коротко о доступе, безопасности и том, как пользоваться инструментами.</p>
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
  { label: 'Генераторы' }
]

const categories = [
  {
    id: 'text',
    label: 'Текст и форматирование',
    description: 'Чистка, изменение регистра, заготовки и рыбий текст без лишних шагов.'
  },
  {
    id: 'code',
    label: 'Код и форматы',
    description: 'JSON, Base64, URL и другие штуки, которые нужны разработчикам и редакторам.'
  },
  {
    id: 'ideas',
    label: 'Идеи и вдохновение',
    description: 'Никнеймы, цитаты, вопросы и микро-действия для движения вперед.'
  },
  {
    id: 'timers',
    label: 'Таймеры и даты',
    description: 'Возраст, отсчеты до праздников и сезонные таймеры.'
  },
  {
    id: 'visual',
    label: 'Визуальные',
    description: 'QR-коды и лабиринты, когда важна форма и картинка.'
  },
  {
    id: 'systems',
    label: 'Системы и модели',
    description: 'Интерактивные штуки, чтобы видеть связи и динамику.'
  }
]

const generators = [
  {
    title: 'Генератор QR-кодов',
    tag: 'qr / ссылка',
    description: 'QR для ссылок, Wi-Fi, телефона, текста и мессенджеров. Скачивание PNG и SVG.',
    mood: 'быстро',
    scope: 'онлайн',
    category: 'visual',
    featured: true,
    link: '/generators/qr-generator'
  },
  {
    title: 'Волчий рыбий текст',
    tag: 'текст / макеты',
    description: 'Абзацы, предложения или слова про волков - для лендингов, постов и интерфейсов.',
    mood: 'контент',
    scope: '1 клик',
    category: 'text',
    featured: true,
    link: '/generators/wolf-lorem'
  },
  {
    title: 'Удаление лишних пробелов',
    tag: 'текст / чистка',
    description: 'Чистит текст от лишних пробелов, табов и пустых строк - полезно для копирайта и кода.',
    mood: 'аккуратно',
    scope: '1 клик',
    category: 'text',
    link: '/generators/remove-spaces'
  },
  {
    title: 'Генератор паролей',
    tag: 'безопасность / пароль',
    description: 'Надежные пароли за секунду: длина, символы, оценка силы и копирование.',
    mood: 'надежно',
    scope: '1 клик',
    category: 'code',
    featured: true,
    link: '/generators/password-generator'
  },
  {
    title: 'Петли стаи',
    tag: 'системы / симулятор',
    description: 'Собирай причинно-следственные модели и наблюдай, как ведет себя система.',
    mood: 'глубже',
    scope: 'интерактив',
    category: 'systems',
    link: '/generators/loops'
  },
  {
    title: 'Удаление переносов строк',
    tag: 'текст / чистка',
    description: 'Склеивает строки из PDF и Word, сохраняет абзацы и наводит порядок с переносами.',
    mood: 'чисто',
    scope: '4 режима',
    category: 'text',
    link: '/generators/remove-line-breaks'
  },
  {
    title: 'Изменение регистра',
    tag: 'текст / формат',
    description: 'Меняй регистр, стиль слов и делай camelCase, snake_case или kebab-case за секунду.',
    mood: 'гибко',
    scope: '10 режимов',
    category: 'text',
    link: '/generators/text-case'
  },
  {
    title: 'JSON Formatter',
    tag: 'json / dev',
    description: 'Форматируй, минифицируй и проверяй JSON, смотри дерево и скачивай результат.',
    mood: 'точно',
    scope: 'онлайн',
    category: 'code',
    link: '/generators/json-formatter'
  },
  {
    title: 'Base64',
    tag: 'encode / decode',
    description: 'Кодируй и декодируй Base64 с поддержкой Unicode, URL-safe и скачиванием.',
    mood: 'быстро',
    scope: 'онлайн',
    category: 'code',
    link: '/generators/base64'
  },
  {
    title: 'Генератор Морзе',
    tag: 'morse / сигнал',
    description: 'Переводи текст в Морзе и обратно, слушай ритм, копируй и скачивай результат.',
    mood: 'ритм',
    scope: 'онлайн',
    category: 'code',
    link: '/generators/morse'
  },
  {
    title: 'Калькулятор возраста',
    tag: 'дата / возраст',
    description: 'Возраст в годах, месяцах и днях, сколько прожито, и сколько до следующего ДР.',
    mood: 'точно',
    scope: 'онлайн',
    category: 'timers',
    link: '/generators/age-calculator'
  },
  {
    title: 'URL Encode Decode',
    tag: 'url / encode',
    description: 'Кодируй URL, UTM и query параметры, работай с form urlencoded и сборкой ссылки.',
    mood: 'точно',
    scope: 'онлайн',
    category: 'code',
    link: '/generators/url-encode'
  },
  {
    title: 'Цитаты волка',
    tag: 'цитаты / мотивация',
    description: 'Дерзкие короткие цитаты про смелость и движение для сторис и чатов.',
    mood: 'смелость',
    scope: '10 секунд',
    category: 'ideas',
    featured: true,
    link: '/generators/wolf-quotes'
  },
  {
    title: 'Микро действие',
    tag: 'микро-привычки',
    description: 'Случайные действия на 1-5 минут, чтобы сдвинуться с места и поймать движение.',
    mood: 'движение',
    scope: '1-5 минут',
    category: 'ideas',
    link: '/generators/micro-actions'
  },
  {
    title: 'Вопросы для компании',
    tag: 'разговор / icebreaker',
    description: 'Колода вопросов для круга: без неловких пауз, с теплыми и смешными темами.',
    mood: 'живое общение',
    scope: '2-6 человек',
    category: 'ideas',
    link: '/generators/company-questions'
  },
  {
    title: 'Генератор никнеймов',
    tag: 'ник / интернет',
    description: 'Автоникнеймы для игр, чатов и соцсетей - быстро и без заминок.',
    mood: 'быстро',
    scope: 'любые темы',
    category: 'ideas',
    link: '/generators/nicknames'
  },
  {
    title: 'Генератор лабиринтов',
    tag: 'можно залипнуть',
    description: 'Создавай лабиринты разных размеров и сложности, смотри решение и скачивай PNG.',
    mood: 'визуализация',
    scope: 'мгновенно',
    category: 'visual',
    link: '/generators/maze-generator'
  },
  {
    title: 'Сколько дней до лета',
    tag: 'таймер / сезон',
    description: 'Отсчет до 1 июня по локальному времени, режимы календарного и астрономического лета.',
    mood: 'ожидание',
    scope: 'онлайн',
    category: 'timers',
    link: '/generators/days-to-summer'
  },
  {
    title: 'До Нового года',
    tag: 'таймер / праздник',
    description: 'Счетчик дней, часов, минут и секунд до ближайшего 1 января по локальному времени.',
    mood: 'ожидание',
    scope: 'онлайн',
    category: 'timers',
    link: '/generators/days-until-new-year'
  },
  {
    title: 'Хронометр текста',
    tag: 'таймер / текст',
    description: 'Считай время чтения и набора текста, запускай хронометр и следи за прогрессом.',
    mood: 'фокус',
    scope: 'онлайн',
    category: 'timers',
    link: '/generators/hronometer'
  }
]

const totalGenerators = generators.length
const featuredGenerators = generators.filter((generator) => generator.featured)

const groupedGenerators = computed(() =>
  categories
    .map((category) => ({
      ...category,
      items: generators.filter((generator) => generator.category === category.id)
    }))
    .filter((category) => category.items.length > 0)
)

const faqItems = [
  {
    q: 'Нужна ли регистрация для генераторов?',
    a: 'Нет. Все инструменты работают сразу в браузере и доступны бесплатно.'
  },
  {
    q: 'Можно ли пользоваться генераторами с телефона?',
    a: 'Да, интерфейсы адаптированы под мобильные устройства.'
  },
  {
    q: 'Сохраняются ли мои данные?',
    a: 'Нет, данные не требуют логина и не сохраняются в профиле.'
  },
  {
    q: 'Как предложить новый генератор?',
    a: 'Напиши в команду Волий через контактную форму или соцсети — идеи быстро попадают в бэклог.'
  }
]

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/generators`)
const metaDescription =
  'Генераторы Волий: QR-коды, тексты, форматирование, кодировки, никнеймы, идеи и таймеры. Все работает в браузере, бесплатно и без регистрации.'

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: 'Генераторы Волий',
      description: metaDescription,
      url: canonicalUrl.value
    },
    {
      '@type': 'ItemList',
      itemListElement: generators.map((generator, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: generator.title,
        url: `${requestUrl.origin}${generator.link}`
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
        { '@type': 'ListItem', position: 2, name: 'Генераторы', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Генераторы онлайн: тексты, коды, таймеры и идеи | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Генераторы онлайн: тексты, коды, таймеры и идеи | Neural Wise Wolf',
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
.generators-page {
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
  background: radial-gradient(circle, rgba(106, 215, 255, 0.35), rgba(106, 215, 255, 0.05));
}

.orb-two {
  right: 24px;
  top: 200px;
  background: radial-gradient(circle, rgba(252, 166, 61, 0.3), rgba(252, 166, 61, 0.04));
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
  background: linear-gradient(160deg, rgba(106, 215, 255, 0.08), rgba(252, 166, 61, 0.06)),
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

.generator-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.generator-card-link:hover {
  transform: translateY(-4px);
  border-color: rgba(106, 215, 255, 0.35);
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
  border-color: rgba(252, 166, 61, 0.5);
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
  background: linear-gradient(150deg, rgba(106, 215, 255, 0.1), rgba(15, 23, 42, 0.6));
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
  background: linear-gradient(130deg, rgba(252, 166, 61, 0.14), rgba(15, 23, 42, 0.5));
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
  border-color: rgba(106, 215, 255, 0.35);
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
  .generators-page {
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
