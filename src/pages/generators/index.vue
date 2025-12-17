<template>
  <section style="padding: 60px 0 24px">
    <div class="pill">
      <span>Генераторы</span>
      <strong>Идеи и тексты</strong>
    </div>
    <h1 class="section-title">Генераторы под разные задачи</h1>
    <TextType
      class="section-lead"
      :text="[
        'Цитаты волка, никнеймы, микро действия и другие быстрые генераторы под настроение.',
        'Работают в браузере, без регистрации — кинул ссылку и пользуешься.'
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
import TextType from '@/components/ui/TextType.vue'

const generators = [
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
    link: '/decisions/micro-actions'
  },
  {
    title: 'Вопросы для компании',
    tag: 'разговор / icebreaker',
    description: 'Колода вопросов для круга: без неловких пауз, с теплыми и смешными темами.',
    mood: 'живое общение',
    scope: '2–6 человек',
    link: '/decisions/company-questions'
  },
  {
    title: 'Генератор никнеймов',
    tag: 'ник / интернет',
    description: 'Автоникнеймы для игр, чатов и соцсетей — быстро и без заминок.',
    mood: 'быстро',
    scope: 'любые темы',
    link: '/decisions/nicknames'
  }
]
</script>
