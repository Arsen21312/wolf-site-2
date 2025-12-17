<template>
  <main class="not-found">
    <p class="kicker">Ошибка</p>
    <h1 class="title">Ты куда забрел, путник?</h1>
    <FuzzyText
      class="fuzzy"
      :text="String(statusCode)"
      :font-size="140"
      font-weight="900"
      color="#fff"
      :enable-hover="true"
      :base-intensity="0.18"
      :hover-intensity="0.5"
    />
    <p class="lead">Этой тропы ещё нет. Вернись на главную или выбери другое направление.</p>
    <div class="cta-row">
      <NuxtLink class="btn primary" to="/">На главную</NuxtLink>
      <NuxtLink class="btn ghost" to="/games">Игры и решения</NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FuzzyText from './FuzzyText.vue'

const props = defineProps<{
  error?: { statusCode?: number }
}>()

const statusCode = computed(() => props.error?.statusCode || 404)
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: grid;
  gap: 16px;
  align-content: center;
  justify-items: center;
  text-align: center;
  padding: 40px 16px 80px;
  color: #e5e7eb;
}

.kicker {
  margin: 0;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #e2e8f0;
}

.title {
  margin: 0;
  font-size: clamp(32px, 6vw, 48px);
  font-weight: 800;
}

.fuzzy {
  margin: 6px 0;
}

.lead {
  margin: 0;
  max-width: 600px;
  color: #cbd5e1;
  line-height: 1.5;
}

.cta-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 6px;
}

.btn {
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 800;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e5e7eb;
  transition: 0.2s ease;
}

.btn.primary {
  background: linear-gradient(135deg, #38bdf8, #8b5cf6);
  color: #0b1220;
  border: none;
  box-shadow: 0 12px 30px rgba(56, 189, 248, 0.28);
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.05);
}

.btn:hover {
  transform: translateY(-1px);
}
</style>
