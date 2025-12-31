<template>
  <section style="padding: 60px 0 24px">
    <Breadcrumbs :items="breadcrumbs" />
    <h1 class="section-title">Генераторы под разные задачи</h1>
    <TextType
      class="section-lead"
      :text="[
        'Цитаты волка, никнеймы, микро действия и другие быстрые генераторы под настроение.',
        'Работают в браузере, без регистрации - кинул ссылку и пользуешься.'
      ]"
      :typing-speed="75"
      :pause-duration="1500"
      :show-cursor="true"
      cursor-character="|"
    />

    <div class="grid two" style="margin-top: 16px">
      <template v-for="generator in generators" :key="generator.title">
        <NuxtLink
          v-if="generator.link"
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
        <article v-else class="card generator-card">
          <div class="tag">{{ generator.tag }}</div>
          <h3>{{ generator.title }}</h3>
          <p>{{ generator.description }}</p>
          <div class="chip-row">
            <div class="chip">{{ generator.mood }}</div>
            <div class="chip">{{ generator.scope }}</div>
          </div>
        </article>
      </template>
    </div>
  </section>
</template>

<style scoped>
.generator-card-link {
  display: block;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}
</style>

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import TextType from '@/components/ui/TextType.vue'

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Генераторы' }
]

const generators = [
  {
    title: 'Генератор QR-кодов',
    tag: 'qr / ссылка',
    description: 'QR для ссылок, Wi-Fi, телефона, текста и мессенджеров. Скачивание PNG и SVG.',
    mood: 'быстро',
    scope: 'онлайн',
    link: '/generators/qr-generator'
  },
  {
    title: 'Волчий рыбий текст',
    tag: 'текст / макеты',
    description: 'Абзацы, предложения или слова про волков - для лендингов, постов и интерфейсов.',
    mood: 'контент',
    scope: '1 клик',
    link: '/generators/wolf-lorem'
  },
  {
    title: 'Удаление лишних пробелов',
    tag: 'текст / чистка',
    description: 'Чистит текст от лишних пробелов, табов и пустых строк - полезно для копирайта и кода.',
    mood: 'аккуратно',
    scope: '1 клик',
    link: '/generators/remove-spaces'
  },
  {
    title: 'Генератор паролей',
    tag: 'безопасность / пароль',
    description: 'Надежные пароли за секунду: длина, символы, оценка силы и копирование.',
    mood: 'надежно',
    scope: '1 клик',
    link: '/generators/password-generator'
  },
  {
    title: 'Удаление переносов строк',
    tag: 'текст / чистка',
    description: 'Склеивает строки из PDF и Word, сохраняет абзацы и наводит порядок с переносами.',
    mood: 'чисто',
    scope: '4 режима',
    link: '/generators/remove-line-breaks'
  },
  {
    title: 'Изменение регистра',
    tag: 'текст / формат',
    description: 'Меняй регистр, стиль слов и делай camelCase, snake_case или kebab-case за секунду.',
    mood: 'гибко',
    scope: '10 режимов',
    link: '/generators/text-case'
  },
  {
    title: 'JSON Formatter',
    tag: 'json / dev',
    description: 'Форматируй, минифицируй и проверяй JSON, смотри дерево и скачивай результат.',
    mood: 'точно',
    scope: 'онлайн',
    link: '/generators/json-formatter'
  },
  {
    title: 'Base64',
    tag: 'encode / decode',
    description: 'Кодируй и декодируй Base64 с поддержкой Unicode, URL-safe и скачиванием.',
    mood: 'быстро',
    scope: 'онлайн',
    link: '/generators/base64'
  },
  {
    title: 'Генератор Морзе',
    tag: 'morse / сигнал',
    description: 'Переводи текст в Морзе и обратно, слушай ритм, копируй и скачивай результат.',
    mood: 'ритм',
    scope: 'онлайн',
    link: '/generators/morse'
  },
  {
    title: 'Калькулятор возраста',
    tag: 'дата / возраст',
    description: 'Возраст в годах, месяцах и днях, сколько прожито, и сколько до следующего ДР.',
    mood: 'точно',
    scope: 'онлайн',
    link: '/generators/age-calculator'
  },
  {
    title: 'URL Encode Decode',
    tag: 'url / encode',
    description: 'Кодируй URL, UTM и query параметры, работай с form urlencoded и сборкой ссылки.',
    mood: 'точно',
    scope: 'онлайн',
    link: '/generators/url-encode'
  },
  {
    title: 'Цитаты волка',
    tag: 'цитаты / мотивация',
    description: 'Дерзкие короткие цитаты про смелость и движение для сторис и чатов.',
    mood: 'смелость',
    scope: '10 секунд',
    link: '/generators/wolf-quotes'
  },
  {
    title: 'Микро действие',
    tag: 'микро-привычки',
    description: 'Случайные действия на 1–5 минут, чтобы сдвинуться с места и поймать движение.',
    mood: 'движение',
    scope: '1–5 минут',
    link: '/generators/micro-actions'
  },
  {
    title: 'Вопросы для компании',
    tag: 'разговор / icebreaker',
    description: 'Колода вопросов для круга: без неловких пауз, с теплыми и смешными темами.',
    mood: 'живое общение',
    scope: '2–6 человек',
    link: '/generators/company-questions'
  },
  {
    title: 'Генератор никнеймов',
    tag: 'ник / интернет',
    description: 'Автоникнеймы для игр, чатов и соцсетей - быстро и без заминок.',
    mood: 'быстро',
    scope: 'любые темы',
    link: '/generators/nicknames'
  },
  {
    title: 'Генератор лабиринтов',
    tag: 'можно залипнуть',
    description: 'Создавай лабиринты разных размеров и сложности, смотри решение и скачивай PNG.',
    mood: 'визуализация',
    scope: 'мгновенно',
    link: '/generators/maze-generator'
  },
  {
    title: 'Сколько дней до лета',
    tag: 'таймер / сезон',
    description: 'Отсчет до 1 июня по локальному времени, режимы календарного и астрономического лета.',
    mood: 'ожидание',
    scope: 'онлайн',
    link: '/generators/days-to-summer'
  },
  {
    title: 'До Нового года',
    tag: 'таймер / праздник',
    description: 'Счетчик дней, часов, минут и секунд до ближайшего 1 января по локальному времени.',
    mood: 'ожидание',
    scope: 'онлайн',
    link: '/generators/days-until-new-year'
  }
]
</script>
