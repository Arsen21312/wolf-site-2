<template>
  <section class="why">
    <div class="container">
      <div class="why__head">
        <p class="eyebrow">Почему это залипает</p>
        <h2 class="title">Здесь мемы с мозгом, а не наоборот</h2>
      </div>
      <div class="why__list">
        <div v-for="item in items" :key="item.title" class="why-card">
          <div class="why-card__icon" aria-hidden="true">{{ item.icon }}</div>
          <h3 class="why-card__title">{{ item.title }}</h3>
          <p class="why-card__text">{{ item.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const items = [
  { title: 'Мемно, но не тупо', text: 'Тут есть кайф и смысл, без пустого шума.', icon: '🐺' },
  { title: 'Работает быстро', text: 'Ничего лишнего, просто жми и получай.', icon: '🚀' },
  { title: 'Можно делиться ссылкой', text: 'Каждую штуку легко отправить в чат.', icon: '🔗' },
  { title: 'Постоянно добавляются новые штуки', text: 'Волк приносит свежачок регулярно.', icon: '✔️' }
]
</script>

<style scoped>
.why {
  padding: 56px 0;
}

.why__head {
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: var(--muted);
}

.title {
  margin: 0;
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: clamp(24px, 3vw, 34px);
}

.why__list {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.why-card {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: rgba(7, 12, 16, 0.75);
  backdrop-filter: blur(12px);
  min-height: 180px;
}

.why-card__icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: rgba(106, 215, 255, 0.15);
  margin-bottom: 12px;
  font-size: 18px;
}

.why-card__title {
  margin: 0 0 6px;
  font-size: 16px;
}

.why-card__text {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
  font-size: 14px;
}

@media (max-width: 900px) {
  .why__list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .why__list {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 10px;
    scroll-snap-type: x mandatory;
  }

  .why-card {
    min-width: 240px;
    scroll-snap-align: start;
  }
}
</style>
