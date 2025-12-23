<template>
  <div class="fs-page">
    <header class="fs-nav">
      <div class="fs-nav-left">
        <div class="fs-logo">?</div>
        <span class="fs-brand">Отгадай за 5 секунд</span>
      </div>
      <div class="fs-nav-right">
        <NuxtLink class="fs-link" to="/games">Игры</NuxtLink>
        <NuxtLink class="fs-link" to="/about">На главную</NuxtLink>
      </div>
    </header>

    <FiveSeconds />
  </div>
</template>

<script setup>
import FiveSeconds from '@/components/games/FiveSeconds/FiveSeconds.vue';
</script>

<style scoped>
.fs-page {
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05), transparent 30%),
    linear-gradient(180deg, #6a11cb 0%, #4a00e0 45%, #3a0ca3 100%);
  color: #e5e7eb;
}

.fs-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.fs-nav-left {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.fs-logo {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #38bdf8, #a855f7);
  color: #0b1220;
  font-weight: 800;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.fs-brand {
  font-weight: 800;
  font-size: 17px;
  color: #0f172a;
}

.fs-nav-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.fs-link {
  color: #0f172a;
  font-weight: 700;
  text-decoration: none;
  padding: 8px 10px;
  border-radius: 12px;
  transition: background 0.15s ease, transform 0.1s ease;
}

.fs-link:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .fs-nav {
    padding: 10px 14px;
  }

  .fs-brand {
    font-size: 15px;
  }
}
</style>
