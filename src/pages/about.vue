<template>
  <section class="about-page">
    <Breadcrumbs :items="breadcrumbs" />

    <div class="about-grid">
      <div class="about-main">
        <article class="card about-hero" id="mission">
          <div class="hero-head">
            <h1 class="section-title">О проекте</h1>
            <p class="section-lead">
              Каталог бесплатных инструментов, игр, расчетов и автоматизаций, который собирает
              Нейронный Волк.
            </p>
          </div>

          <div class="stats hero-stats">
            <div class="stat">
              <div class="stat-icon">🧰</div>
              <div>
                <h4>100+ инструментов</h4>
                <p>Игры, генераторы, решения для быстрых вопросов.</p>
              </div>
            </div>
            <div class="stat">
              <div class="stat-icon">🌙</div>
              <div>
                <h4>24/7 работаем</h4>
                <p>Сервис всегда под рукой и без очереди.</p>
              </div>
            </div>
            <div class="stat">
              <div class="stat-icon">🐺</div>
              <div>
                <h4>50k+ пользователей</h4>
                <p>Сообщество, которое любит живые инструменты.</p>
              </div>
            </div>
          </div>
        </article>

        <article class="card section-card">
          <div class="section-header">
            <div class="tag">Зачем мы это делаем</div>
            <h3>Чтобы решать быстро, играть смело и не тонуть в бюрократии</h3>
            <p class="muted">
              Волк собирает место, где всё работает без лишних барьеров: минимум кликов, максимум пользы.
              Здесь живут игровые механики, генераторы и подсказки, которые реально экономят время.
            </p>
          </div>

          <div class="mission-grid">
            <div class="mission-left">
              <ul class="icon-list">
                <li v-for="item in missionPoints" :key="item.title">
                  <span class="icon">{{ item.icon }}</span>
                  <div>
                    <strong>{{ item.title }}</strong>
                    <p class="muted">{{ item.text }}</p>
                  </div>
                </li>
              </ul>
            </div>
            <div class="mission-right">
              <div class="tech-grid">
                <div v-for="tech in techCards" :key="tech.title" class="mini-card">
                  <div class="mini-card__icon">{{ tech.icon }}</div>
                  <div class="mini-card__title">{{ tech.title }}</div>
                  <p class="muted mini-card__text">{{ tech.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </article>

        <article class="card section-card" id="ads">
          <div class="section-header">
            <div class="tag">Реклама и поддержка</div>
            <h3>Помоги волку расти — расскажем о твоём продукте</h3>
            <p class="muted">
              Мы выбираем партнеров, которые резонируют с философией проекта: честно, полезно, без
              навязчивости.
            </p>
          </div>

          <div class="grid three">
            <div v-for="card in supportCards" :key="card.title" class="mini-card">
              <div class="mini-card__icon">{{ card.icon }}</div>
              <div class="mini-card__title">{{ card.title }}</div>
              <p class="muted mini-card__text">{{ card.text }}</p>
              <ul class="bullet-list">
                <li v-for="point in card.points" :key="point">{{ point }}</li>
              </ul>
            </div>
          </div>

          <div class="cta-card">
            <div>
              <h4>Обсудим сотрудничество</h4>
              <p class="muted">Расскажи, что хочешь продвинуть, и мы предложим формат.</p>
            </div>
            <a class="btn" href="https://t.me/neural_wolf" target="_blank" rel="noreferrer">Написать в Telegram</a>
          </div>
        </article>

        <article class="card section-card" id="socials">
          <div class="section-header">
            <div class="tag">Где нас найти</div>
            <h3>Подпишись, чтобы не пропустить новые фишки</h3>
            <p class="muted">Каналы, бот, соцсети и поддержка — Волк на связи в удобном месте.</p>
          </div>

          <div class="grid two socials-grid">
            <a
              v-for="social in socials"
              :key="social.title"
              class="social-card"
              :href="social.href"
              target="_blank"
              rel="noreferrer"
            >
              <div class="social-card__icon">{{ social.icon }}</div>
              <div>
                <div class="social-card__title">{{ social.title }}</div>
                <p class="muted social-card__text">{{ social.text }}</p>
                <span class="status">{{ social.status }}</span>
              </div>
              <span class="social-card__arrow">↗</span>
            </a>
          </div>
        </article>

        <article class="card section-card" id="faq">
          <div class="section-header">
            <div class="tag">FAQ</div>
            <h3>Вопросы, которые задают чаще всего</h3>
          </div>

          <div class="faq-list">
            <div
              v-for="(item, idx) in faqItems"
              :key="item.q"
              class="faq-item"
              :class="{ open: item.open }"
            >
              <button class="faq-trigger" type="button" @click="toggleFaq(idx)">
                <span>{{ item.q }}</span>
                <span class="faq-icon">{{ item.open ? '−' : '+' }}</span>
              </button>
              <p v-if="item.open" class="faq-answer muted">{{ item.a }}</p>
            </div>
          </div>
        </article>
      </div>

      <aside class="toc-card">
        <div class="toc-inner">
          <div class="toc-title">Оглавление</div>
          <nav class="toc-nav">
            <button
              v-for="item in tocItems"
              :key="item.id"
              class="toc-link"
              :class="{ active: activeSection === item.id }"
              type="button"
              @click="scrollToSection(item.id)"
            >
              {{ item.label }}
            </button>
          </nav>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useHead } from '#imports'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'О проекте' }
]


useHead({
  title: 'О проекте — Нейронный Волк',
  meta: [{ name: 'description', content: 'О проекте, Нейронный Волк' }]
})

const tocItems = [
  { id: 'mission', label: 'Зачем мы это делаем' },
  { id: 'ads', label: 'Реклама и поддержка' },
  { id: 'socials', label: 'Где нас найти' },
  { id: 'faq', label: 'FAQ' }
]

const missionPoints = [
  {
    icon: '⚡',
    title: 'Минимум кода',
    text: 'Инструменты запускаются мгновенно, без сложной настройки.'
  },
  {
    icon: '🤖',
    title: 'Максимум AI',
    text: 'Волк подтягивает модели, чтобы решения были умнее и живее.'
  },
  {
    icon: '💼',
    title: 'Ноль бюрократии',
    text: 'Без формальностей: открыл и пользуешься.'
  },
   {
    icon: '🐺',
    title: 'Решение важнее формы',
    text: 'Не как правильно, а как сработает именно сейчас.'
  }
]

const techCards = [
  { icon: '✨', title: 'Нейросети', text: 'Подсказывают, генерируют и помогают принять решение.' },
  { icon: '🌐', title: 'Web', text: 'Работает из любого браузера и устройства.' },
  { icon: '☁️', title: 'Cloud', text: 'Надежные сервисы, которые не засыпают.' },
  { icon: '🔗', title: 'API', text: 'Готовность интегрироваться, когда это нужно.' }
]

const supportCards = [
  {
    icon: '📢',
    title: 'Реклама на сайте',
    text: 'Нативные форматы без раздражающего шума.',
    points: ['Карточки в релевантных разделах', 'Тонкая подача, уважение к пользователю', 'Отчетность по показам']
  },
  {
    icon: '📨',
    title: 'Соцсети и рассылки',
    text: 'Расскажем в каналах, которые читает аудитория Волка.',
    points: ['Посты в Telegram (1K+ подписчиков)', 'Stories и посты в Instagram (100к)', 'Упоминания в TikTok и YouTube (10к+)']
  },
  {
    icon: '🤝',
    title: 'Партнерские программы',
    text: 'Соберем win-win: ты даешь ценность, мы трафик.',
    points: ['Спецпроекты под задачу', 'Участие в игровых механиках', 'Промокоды и бонусы']
  }
]

const socials = [
  {
    icon: '📣',
    title: 'Telegram канал',
    text: 'Главные новости, много мемов и ауфной философии',
    status: 'Обновления каждый день',
    href: 'https://t.me/neural_wise_wolf'
  },
  {
    icon: '🤖',
    title: 'Бот Мудрый Клык',
    text: 'Генерирует дегенератские пацанские цитаты с помощью нейросетей GPT-3 и BigGAN',
    status: 'Всегда включен',
    href: 'https://t.me/neural_wise_wolf_bot'
  },
  {
    icon: '📸',
    title: 'Instagram',
    text: 'Мемы и не только. Самое большое сообщество',
    status: 'Более 90к подписчиков',
    href: 'https://instagram.com/neural_wise_wolf'
  },
  {
    icon: '▶️',
    title: 'YouTube',
    text: 'Разборы инструментов, мемы и много ауфа.',
    status: 'Подпишись брат',
    href: 'https://youtube.com/@neural_wolf'
  },
  {
    icon: '🎵',
    title: 'TikTok',
    text: 'Стримы, мемы и много волков',
    status: 'Тут волк бывает онлайн',
    href: 'https://tiktok.com/@neural_wolf'
  },
  {
    icon: '💬',
    title: 'Поддержка',
    text: 'Если что-то сломалось или есть идеи.',
    status: 'Не стесняйся, пиши',
    href: 'https://t.me/neural_wolf'
  }
]

const faqItems = ref([
  {
    q: 'Проект бесплатный?',
    a: 'Да. Большинство инструментов и игр доступны бесплатно. Если появятся платные штуки будет честное предупреждение.',
    open: true
  },
  {
    q: 'Как подкинуть идею для нового сервиса?',
    a: 'Пиши в поддержку или в Telegram. Волк любит хорошие идеи и часто добавляет их в бэклог.',
    open: false
  },
  {
    q: 'Где исходники?',
    a: 'Код собирается из нескольких частей. Открываем то, что можем, и публикуем отдельные модули по мере готовности.',
    open: false
  },
  {
    q: 'Как часто обновляется сайт?',
    a: 'Новые игры и генераторы прилетают каждую неделю, а улучшения интерфейса по мере обратной связи.',
    open: false
  },
  {
    q: 'На каких языках работает Волк?',
    a: 'Сейчас основной язык русский, но часть инструментов уже поддерживает английский. Добавляем локали по запросу.',
    open: false
  },
  {
    q: 'Как проект монетизируется?',
    a: 'Легкая нативная реклама и партнерские интеграции. Никаких агрессивных баннеров и трекинга.',
    open: false
  }
])

const activeSection = ref(tocItems[0].id)
let observer

const toggleFaq = (index) => {
  faqItems.value = faqItems.value.map((item, idx) =>
    idx === index ? { ...item, open: !item.open } : item
  )
}

const scrollToSection = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  const offset = 80
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

const handleIntersect = (entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
  if (visible.length) {
    activeSection.value = visible[0].target.id
  }
}

onMounted(() => {
  observer = new IntersectionObserver(handleIntersect, {
    rootMargin: '-20% 0px -50% 0px',
    threshold: [0, 0.2, 0.4, 0.6]
  })

  tocItems.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  })
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.about-page {
  padding: 32px 0 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-page > .pill {
  align-self: flex-start;
  width: fit-content;
}

.about-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 24px;
  align-items: start;
}

.about-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.about-hero {
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
  overflow: hidden;
}

.hero-head h1 {
  margin: 0;
}

.hero-stats {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.stat {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 10px;
  position: relative;
  padding-right: 52px;
}

.stat h4 {
  margin: 0;
}

.stat-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: var(--panel-2);
  border: 1px solid var(--border);
  font-size: 18px;
  position: absolute;
  top: 10px;
  right: 10px;
  animation: floatIcon 4s ease-in-out infinite alternate;
}

.section-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
  overflow: hidden;
  padding: 18px;
}

.section-header h3 {
  margin: 6px 0;
}

.mission-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.icon-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.icon-list li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--panel-2);
}

.icon-list .icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(106, 215, 255, 0.12);
  border: 1px solid rgba(106, 215, 255, 0.35);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 14px;
}

.mini-card {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px;
  background: var(--panel-2);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.28s ease, background 0.2s ease;
  position: relative;
  padding-right: 52px;
}

.mini-card:hover {
  transform: translateY(-2px);
  border-color: rgba(106, 215, 255, 0.35);
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35);
  background: linear-gradient(140deg, rgba(106, 215, 255, 0.08), rgba(252, 166, 61, 0.07));
}

.mini-card__icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(252, 166, 61, 0.12);
  border: 1px solid rgba(252, 166, 61, 0.35);
  position: absolute;
  top: 10px;
  right: 10px;
  animation: floatIcon 3.6s ease-in-out infinite alternate;
}

.mini-card__title {
  font-weight: 700;
}

.mini-card__text {
  margin: 0;
}

.bullet-list {
  margin: 6px 0 0;
  padding-left: 18px;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cta-card {
  margin-top: 8px;
  border-radius: 16px;
  padding: 16px;
  background: linear-gradient(120deg, rgba(106, 215, 255, 0.14), rgba(252, 166, 61, 0.14));
  border: 1px solid rgba(106, 215, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.socials-grid {
  margin-top: 8px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.social-card {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, box-shadow 0.24s ease;
  position: relative;
  padding-right: 64px;
}

.social-card:hover {
  transform: translateY(-3px);
  border-color: rgba(106, 215, 255, 0.35);
  background: linear-gradient(150deg, rgba(106, 215, 255, 0.09), rgba(252, 166, 61, 0.07));
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.35);
}

.social-card__icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(160deg, rgba(106, 215, 255, 0.2), rgba(252, 166, 61, 0.18));
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 18px;
  position: absolute;
  top: 12px;
  right: 12px;
  animation: floatIcon 4.2s ease-in-out infinite alternate;
}

.social-card__title {
  font-weight: 700;
}

.social-card__text {
  margin: 4px 0 6px;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted);
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--panel);
}

.social-card__arrow {
  color: var(--accent-2);
  font-weight: 700;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-item {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--panel-2);
  padding: 12px;
  transition: border-color 0.16s ease, background 0.16s ease, box-shadow 0.2s ease;
  animation: fadeUp 0.6s ease both;
}

.faq-item.open {
  border-color: rgba(106, 215, 255, 0.35);
  background: linear-gradient(150deg, rgba(106, 215, 255, 0.08), rgba(255, 255, 255, 0.02));
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.28);
}

.faq-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: none;
  border: none;
  color: inherit;
  font-size: 15px;
  font-weight: 700;
  padding: 0;
  cursor: pointer;
}

.faq-trigger span:first-child {
  flex: 1 1 auto;
  text-align: left;
}

.faq-icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: var(--panel);
  border: 1px solid var(--border);
}

.faq-answer {
  margin: 10px 0 0;
  line-height: 1.6;
}

.toc-card {
  position: sticky;
  top: 96px;
}

.toc-inner {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.06));
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.32);
}

.toc-title {
  font-weight: 700;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toc-link {
  text-align: left;
  border: 1px solid transparent;
  border-radius: 10px;
  padding: 10px 12px;
  background: var(--panel-2);
  color: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.12s ease, color 0.15s ease;
}

.toc-link:hover {
  transform: translateX(2px);
}

.toc-link.active {
  border-color: rgba(106, 215, 255, 0.35);
  background: rgba(106, 215, 255, 0.1);
  color: var(--text);
}

@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
  }

  .toc-card {
    position: static;
  }

  .hero-stats {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .about-page {
    padding-top: 8px;
  }

  .mission-grid {
    grid-template-columns: 1fr;
  }
}

/* Animations and glow */
.about-main > * {
  animation: fadeUp 0.7s ease both;
}

.about-main > *:nth-child(2) {
  animation-delay: 0.06s;
}

.about-main > *:nth-child(3) {
  animation-delay: 0.12s;
}

.about-main > *:nth-child(4) {
  animation-delay: 0.18s;
}

.about-main > *:nth-child(5) {
  animation-delay: 0.24s;
}

.about-hero::before,
.section-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 18px;
  background: radial-gradient(circle at 20% 20%, rgba(106, 215, 255, 0.14), transparent 36%),
    radial-gradient(circle at 80% 0%, rgba(252, 166, 61, 0.14), transparent 32%);
  opacity: 0.6;
  pointer-events: none;
}

.about-hero::after,
.section-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.1));
  pointer-events: none;
}

.card {
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.38);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floatIcon {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-4px);
  }
}
</style>
