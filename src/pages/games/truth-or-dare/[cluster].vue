<template>
  <main class="cluster-page">
    <section class="hero">
      <div class="hero-card">
        <p class="kicker">{{ pageData.kicker }}</p>
        <h1>{{ pageData.h1 }}</h1>
        <p class="lead">{{ pageData.lead }}</p>
        <div class="hero-actions">
          <NuxtLink class="btn btn-primary" to="/games/truth-or-dare">Играть в основную версию</NuxtLink>
          <NuxtLink class="btn btn-secondary" to="/games">Все игры</NuxtLink>
        </div>
      </div>
    </section>

    <section class="content">
      <article class="card">
        <h2>{{ pageData.sectionTitle }}</h2>
        <p>{{ pageData.sectionText1 }}</p>
        <p>{{ pageData.sectionText2 }}</p>
      </article>

      <article class="card">
        <h2>Примеры формата</h2>
        <ul class="list">
          <li v-for="item in pageData.examples" :key="item">{{ item }}</li>
        </ul>
      </article>

      <article class="card">
        <h2>Связанные страницы</h2>
        <div class="links-grid">
          <NuxtLink class="chip" to="/games/truth-or-dare">Главная страница игры</NuxtLink>
          <NuxtLink
            v-for="link in relatedLinks"
            :key="link.to"
            class="chip"
            :to="link.to"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { createError, useHead, useRoute } from '#imports'

const route = useRoute()
const cluster = computed(() => String(route.params.cluster || ''))

const pageMap = {
  'for-friends': {
    kicker: 'Правда или действие для друзей',
    h1: 'Правда или действие: вопросы и задания для друзей',
    lead:
      'Подборка для дружеской компании: больше юмора, меньше неловкости. Формат подходит для вечеринок и посиделок дома.',
    title:
      'Правда или действие для друзей: вопросы и задания онлайн | Neural Wise Wolf',
    description:
      'Игра «Правда или действие» для друзей: смешные вопросы, легкие задания и формат без кринжа. Играй онлайн бесплатно.',
    sectionTitle: 'Как играть с друзьями',
    sectionText1:
      'Для дружеского круга лучше работают быстрые и легкие раунды. Ставьте таймер на 20-30 секунд и не спорьте о формулировках.',
    sectionText2:
      'Фокус на смех и динамику: если вопрос не зашел, сразу пропуск и следующий ход. Темп важнее идеального ответа.',
    examples: [
      'Назови самый странный момент из школы.',
      'Покажи смешной танец на 10 секунд.',
      'Расскажи, какой мем описывает тебя сегодня.',
      'Сделай комплимент игроку слева.',
      'Придумай название вашей стаи в одном слове.'
    ]
  },
  'for-couple': {
    kicker: 'Правда или действие для пары',
    h1: 'Правда или действие для пары: вопросы и задания для двоих',
    lead:
      'Теплый формат для свидания и вечера дома: мягкие вопросы, флирт и безопасные задания для двоих.',
    title:
      'Правда или действие для пары: вопросы для двоих онлайн | Neural Wise Wolf',
    description:
      'Правда или действие для пары: романтичные вопросы и задания для двоих. Играй онлайн без регистрации.',
    sectionTitle: 'Как играть вдвоем',
    sectionText1:
      'Для пары лучше выбирать спокойный темп и честные вопросы без давления. Договоритесь заранее, какие темы не обсуждаете.',
    sectionText2:
      'Добавьте мини-ритуал: после каждого раунда короткий фидбек, что понравилось. Это делает игру ближе к разговору, а не к испытанию.',
    examples: [
      'Назови момент, когда ты особенно гордился(ась) нами.',
      'Скажи три вещи, которые в партнере тебя радуют.',
      'Сделай маленький сюрприз за 30 секунд.',
      'Вспомни наше самое смешное свидание.',
      'Придумай идеальный вечер на ближайшие выходные.'
    ]
  },
  'for-company': {
    kicker: 'Правда или действие для компании',
    h1: 'Правда или действие для компании: сценарий для вечеринки',
    lead:
      'Формат для 4-12 человек: быстрые раунды, смешные задания и понятные правила, чтобы никто не выпадал из игры.',
    title:
      'Правда или действие для компании: вопросы и задания онлайн | Neural Wise Wolf',
    description:
      'Правда или действие для компании: веселые вопросы, задания и правила для вечера с друзьями. Запускай онлайн.',
    sectionTitle: 'Как вести игру в большой группе',
    sectionText1:
      'Для компании работает круговой порядок и лимит времени на ответ. Если человек долго думает, ход переходит дальше.',
    sectionText2:
      'Смешивайте типы раундов: личный вопрос, командное действие, случайный выбор. Так удерживается внимание всех участников.',
    examples: [
      'Кто в этой комнате лучший стратег и почему?',
      'Сделай пародию на известного персонажа.',
      'Придумай командный девиз за 15 секунд.',
      'Расскажи самую неловкую, но смешную историю.',
      'Назови человека, который спас бы вас в зомби-апокалипсисе.'
    ]
  },
  'for-teens': {
    kicker: 'Правда или действие для подростков',
    h1: 'Правда или действие для подростков: безопасные идеи',
    lead:
      'Подборка без токсичных тем: больше юмора, творчества и несложных заданий, которые подходят для школьной компании.',
    title:
      'Правда или действие для подростков: безопасные вопросы онлайн | Neural Wise Wolf',
    description:
      'Правда или действие для подростков: безопасные вопросы и задания для компании друзей. Играй онлайн бесплатно.',
    sectionTitle: 'Правила безопасной игры',
    sectionText1:
      'Сразу зафиксируйте стоп-темы и право на пропуск. Игра должна быть веселой, а не стрессовой.',
    sectionText2:
      'Лучше выбирать задания на креатив и движение: мини-импровизация, смешной рассказ, небольшие челленджи без риска.',
    examples: [
      'Покажи эмоцию дня без слов.',
      'Назови песню, которая у тебя на повторе.',
      'Придумай суперсилу для игрока справа.',
      'Скажи, что бы ты изменил(а) в школьном расписании.',
      'Сделай фото-позу на 5 секунд.'
    ]
  },
  '18-plus': {
    kicker: 'Правда или действие 18+',
    h1: 'Правда или действие 18+: как играть без перегибов',
    lead:
      'Версия для взрослых участников: смелые темы, но с четкими границами, добровольностью и уважением к отказу.',
    title:
      'Правда или действие 18+: вопросы для взрослых онлайн | Neural Wise Wolf',
    description:
      'Правда или действие 18+ для взрослых: идеи раундов, правила согласия и формат без давления. Играй онлайн.',
    sectionTitle: 'Границы и согласие',
    sectionText1:
      'Перед стартом проговорите рамки: что допустимо, что нет, как выглядит безопасный стоп-сигнал для любого игрока.',
    sectionText2:
      'Смысл взрослой версии не в шоке, а в честности и доверии. Любое задание должно быть добровольным, без давления и осуждения.',
    examples: [
      'Назови тему, о которой тебе интересно поговорить глубже.',
      'Расскажи о навыке, который хочешь прокачать в отношениях.',
      'Сделай честный, но уважительный комплимент игроку напротив.',
      'Поделись личной целью на ближайший месяц.',
      'Назови правило, которое делает вечеринку комфортной.'
    ]
  }
}

if (!pageMap[cluster.value]) {
  throw createError({ statusCode: 404, statusMessage: 'Кластер не найден' })
}

const pageData = computed(() => pageMap[cluster.value])
const seoMetaByCluster = {
  'for-friends': {
    title: 'Правда или действие для друзей: вопросы и задания онлайн (2026)',
    description:
      'Подборка «Правда или действие» для друзей: смешные вопросы и легкие задания для компании. Играй онлайн без регистрации.'
  },
  'for-couple': {
    title: 'Правда или действие для пары: вопросы и задания для двоих',
    description:
      'Страница для пары: романтичные вопросы и безопасные задания для двоих. Игра «Правда или действие» онлайн.'
  },
  'for-company': {
    title: 'Правда или действие для компании: вопросы и задания на вечеринку',
    description:
      'Формат для компании 4-12 человек: динамичные раунды, вопросы и задания для вечеринки. Запускай онлайн.'
  },
  'for-teens': {
    title: 'Правда или действие для подростков: безопасные вопросы и задания',
    description:
      'Безопасная версия «Правда или действие» для подростков: без токсичных тем, с юмором и креативом.'
  },
  '18-plus': {
    title: 'Правда или действие 18+: вопросы и задания для взрослых',
    description:
      'Версия 18+ для взрослых: смелые темы, правила согласия и уважительные границы. Играй в браузере.'
  }
}
const seoMeta = computed(() => seoMetaByCluster[cluster.value] || pageData.value)

const allLinks = [
  { to: '/games/truth-or-dare/for-friends', label: 'Для друзей' },
  { to: '/games/truth-or-dare/for-couple', label: 'Для пары' },
  { to: '/games/truth-or-dare/for-company', label: 'Для компании' },
  { to: '/games/truth-or-dare/for-teens', label: 'Для подростков' },
  { to: '/games/truth-or-dare/18-plus', label: '18+' }
]

const relatedLinks = computed(() => allLinks.filter((item) => item.to !== route.path))

useHead(() => {
  const canonical = `https://www.neuralwisewolf.com${route.path}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: 'https://www.neuralwisewolf.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Игры',
        item: 'https://www.neuralwisewolf.com/games'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Правда или действие',
        item: 'https://www.neuralwisewolf.com/games/truth-or-dare'
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: pageData.value.h1,
        item: canonical
      }
    ]
  }

  return {
    title: seoMeta.value.title,
    link: [{ rel: 'canonical', href: canonical }],
    meta: [
      { name: 'description', content: seoMeta.value.description },
      { name: 'robots', content: 'index,follow' },
      { property: 'og:title', content: seoMeta.value.title },
      { property: 'og:description', content: seoMeta.value.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: 'https://www.neuralwisewolf.com/favicon.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: seoMeta.value.title },
      { name: 'twitter:description', content: seoMeta.value.description },
      { name: 'twitter:image', content: 'https://www.neuralwisewolf.com/favicon.png' }
    ],
    script: [{ type: 'application/ld+json', children: JSON.stringify(breadcrumbSchema) }]
  }
})
</script>

<style scoped>
.cluster-page {
  max-width: 980px;
  margin: 0 auto;
  padding: 24px 16px 64px;
  display: grid;
  gap: 20px;
}

.hero-card,
.card {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  padding: 20px;
}

.kicker {
  margin: 0 0 6px;
  font-weight: 700;
  color: #93c5fd;
}

h1 {
  margin: 0 0 10px;
  font-size: clamp(28px, 4vw, 38px);
  line-height: 1.15;
}

h2 {
  margin: 0 0 10px;
  font-size: 24px;
}

.lead,
p {
  margin: 0;
  color: #dbe4f8;
}

.content {
  display: grid;
  gap: 14px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.btn {
  text-decoration: none;
  border-radius: 999px;
  padding: 10px 14px;
  font-weight: 700;
}

.btn-primary {
  background: linear-gradient(120deg, #38bdf8, #60a5fa);
  color: #081022;
}

.btn-secondary {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e5e7eb;
}

.list {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 8px;
  color: #dbe4f8;
}

.links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  text-decoration: none;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #dbe4f8;
  padding: 9px 13px;
}

.chip:hover {
  border-color: rgba(147, 197, 253, 0.65);
  color: #93c5fd;
}

@media (max-width: 768px) {
  .cluster-page {
    padding: 14px 10px 52px;
  }

  .hero-card,
  .card {
    padding: 16px;
  }
}
</style>
