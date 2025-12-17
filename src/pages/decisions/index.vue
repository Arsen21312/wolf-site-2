<template>
  <section class="decisions-page">
    <div class="pill">
      <span>Инструменты</span>
      <strong>Выбор без споров</strong>
    </div>
    <h1 class="section-title">Быстрые решения, когда нужен нейтральный выбор</h1>
    <TextType
      class="section-lead"
      :text="[
        'Монетка, колесо выбора, правда или действие и другие штуки, которые помогают решить за секунды.',
        'Без споров, обид и лишних разговоров.'
      ]"
      :typing-speed="75"
      :pause-duration="1500"
      :show-cursor="true"
      cursor-character="|"
    />

    <div class="grid two">
      <template v-for="tool in tools" :key="tool.title">
        <NuxtLink v-if="tool.slug" :to="tool.slug" class="card decision-card link-card">
          <div class="tag">{{ tool.tag }}</div>
          <h3>{{ tool.title }}</h3>
          <p>{{ tool.description }}</p>
          <div class="chip-row">
            <div class="chip">{{ tool.mood }}</div>
            <div class="chip">{{ tool.speed }}</div>
          </div>
        </NuxtLink>

        <article v-else class="card decision-card">
          <div class="tag">{{ tool.tag }}</div>
          <h3>{{ tool.title }}</h3>
          <p>{{ tool.description }}</p>
          <div class="chip-row">
            <div class="chip">{{ tool.mood }}</div>
            <div class="chip">{{ tool.speed }}</div>
          </div>
        </article>
      </template>
    </div>
  </section>
</template>

<script setup>
import TextType from '@/components/ui/TextType.vue'

const tools = [
  {
    title: 'Монетка',
    tag: 'Шанс 50/50',
    description: 'Оставь выбор на удачу: орёл или решка. Быстро, честно и без аргументов.',
    mood: 'Нейтральный выбор',
    speed: '10 секунд',
    slug: '/decisions/coin-flip'
  },
  {
    title: 'Конвертер чисел',
    tag: 'Сумма прописью',
    description:
      'Бесплатный конвертер чисел в сумму прописью для документов. Поддержка НДС 12% и 20%, правильные склонения.',
    mood: 'Работает в браузере',
    speed: '15 секунд',
    slug: '/decisions/summa-propisyu'
  },
  {
    title: 'Рандом решает за тебя',
    tag: 'Рандомайзер',
    description: 'Бесплатный генератор случайных чисел, слов из списка, а также выбор между да и нет в одном инструменте',
    mood: 'Весело и быстро',
    speed: '1 клик',
    slug: '/decisions/randomizer'
  },
  {
    title: 'Калькулятор любви',
    tag: 'Проверь свою подружку',
    description: 'Узнайте, насколько вы подходите друг другу! Просто введите два имени и нажмите кнопку.',
    mood: 'Любовь',
    speed: '30 секунд',
    slug: '/decisions/love-calculator'
  }
]
</script>

<style scoped>
.decisions-page {
  padding: 60px 0 24px;
}

.section-lead {
  margin: 12px 0 18px;
}

.grid.two {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.decision-card {
  text-decoration: none;
  color: inherit;
  transition: transform 0.12s ease, box-shadow 0.2s ease;
  display: block;
}

.decision-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 36px rgba(0, 0, 0, 0.25);
}

.link-card {
  cursor: pointer;
}
</style>
