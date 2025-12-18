<template>
<section class="wc-landing">
  <div class="wc-hero">
    <div class="wc-hero-content">
      <p class="wc-pill">Новая игра</p>
      <h1 class="section-title wc-title">Волчий Контекст</h1>
      <p class="wc-subtitle section-lead">Угадай секретное слово по смысловой близости. Жми, чтобы начать случайную охоту.</p>
      <NuxtLink class="btn" to="/games/wolf-context/random">Случайное задание</NuxtLink>
    </div>
  </div>
</section>
</template>

<script setup lang="ts">
useHead({
  title: 'Волчий Контекст, угадай слово по смыслу',
  meta: [
    {
      name: 'description',
      content:
        'Игра где угадываешь секретное слово по смысловой близости, вводишь слова и смотришь ранг, чем ближе к 1, тем горячее след'
    },
    { property: 'og:title', content: 'Волчий Контекст, угадай слово по смыслу' },
    {
      property: 'og:description',
      content:
        'Угадай секретное слово по смыслу, без аккаунтов и комнат. Режимы: случайная охота, слово дня и свои загадки.'
    }
  ]
})
</script>

<style scoped>
.wc-landing {
  padding: 48px 18px 64px;
  color: #e5e7eb;
  display: flex;
  min-height: 80vh;
  align-items: center;
  justify-content: center;
}

.wc-hero {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.wc-hero-content {
  display: grid;
  gap: 10px;
  max-width: 760px;
}

.wc-title {
  font-size: clamp(52px, 10vw, 80px);
  font-weight: 900;
  letter-spacing: -0.02em;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  margin: 10px 0 6px;
}

.wc-pill {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  margin: 0 auto;
}

.wc-subtitle {
  margin: 0 0 12px;
  color: #cbd5e1;
  line-height: 1.6;
  max-width: 640px;
  font-size: clamp(18px, 2vw, 22px);
  font-weight: 600;
}

.btn {
  margin: 0 auto;
}
</style>
