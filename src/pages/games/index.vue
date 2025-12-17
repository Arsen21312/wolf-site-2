<template>
  <section style="padding: 60px 0 24px">
    <div class="pill">
      <strong>Игры</strong>
    </div>
    <h1 class="section-title">Выбирай игру</h1>
    <TextType
      class="section-lead"
      :text="[
        'Быстрые сценарии, чтобы встряхнуть компанию или себя.',
        'Каждая карточка ведёт в отдельную игру — правда или действие, 5 секунд, рулетка правды/лжи, «я никогда не».'
      ]"
      :typing-speed="75"
      :pause-duration="1500"
      :show-cursor="true"
      cursor-character="|"
    />

    <div class="grid two" style="margin-top: 16px">
      <NuxtLink
        v-for="game in games"
        :key="game.slug"
        class="card game-card"
        :to="game.to || `/games/${game.slug}`"
      >
        <div class="tag">{{ game.tag }}</div>
        <h3>{{ game.title }}</h3>
        <p>{{ game.description }}</p>
        <div class="chip-row">
          <div class="chip">{{ game.mood }}</div>
          <div class="chip">{{ game.duration }}</div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.game-card {
  display: block;
  transition: transform 0.16s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.game-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 0.18);
}

.game-card:active {
  transform: translateY(-1px) scale(0.99);
}
</style>

<script setup>
import TextType from '@/components/ui/TextType.vue'

const games = [
  {
    slug: 'truth-or-dare',
    title: 'Правда или действие',
    description: 'Вопросы и задания без подготовки: выбирай режим, нажимай и играй онлайн.',
    tag: 'классика / вечеринка',
    mood: 'честно и весело',
    duration: '10-20 минут'
  },
  {
    slug: 'never-have-i-ever',
    title: 'Я никогда не',
    description: 'Сотни утверждений для признаний и смеха. Подходит для компании и пары.',
    tag: 'вечеринка / знакомства',
    mood: 'откровенно',
    duration: '5-15 минут'
  },
  {
    slug: 'true-or-false',
    title: 'Правда или ложь',
    description: 'Факты и мифы в одном потоке: угадай что правда, а что нет.',
    tag: 'квиз / факты',
    mood: 'интрига',
    duration: '5-15 минут'
  },
  {
    slug: 'coin',
    title: 'Ответь за 5 секунд',
    description: 'Дай три ответа за 5 секунд — таймер поджимает, смех гарантирован.',
    tag: 'таймер / хаос',
    mood: 'динамично',
    duration: '1-5 минут',
    to: '/games/5-seconds'
  }
]
</script>
