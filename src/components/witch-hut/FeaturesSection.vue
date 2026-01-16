<template>
  <section class="features">
    <div class="features-head">
      <p class="eyebrow">Формат</p>
      <h2>Темно, быстро, по фактам</h2>
      <p class="lead">Без сюсю, только ясные сигналы</p>
    </div>
    <div class="feature-grid">
      <div class="feature-card" style="--accent: rgba(166, 120, 255, 0.6)">
        <div class="icon"></div>
        <div class="feature-title">Темно, быстро, по фактам</div>
        <div class="feature-text">Срез по тону, без болтовни</div>
      </div>
      <div class="feature-card" style="--accent: rgba(255, 120, 200, 0.5)">
        <div class="icon"></div>
        <div class="feature-title">Под мужиков, без сюсю</div>
        <div class="feature-text">Прямой язык, короткие ходы</div>
      </div>
      <div class="feature-card" style="--accent: rgba(140, 200, 255, 0.45)">
        <div class="icon"></div>
        <div class="feature-title">Ответ на главный вопрос</div>
        <div class="feature-text">Что ей нужно на самом деле</div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.features {
  padding: 24px 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.features-head h2 {
  margin: 0 0 8px;
  font-size: 22px;
  line-height: 1.25;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 11px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: rgba(230, 219, 255, 0.6);
}

.lead {
  margin: 0;
  font-size: 14px;
  color: rgba(230, 219, 255, 0.7);
}

.feature-grid {
  display: grid;
  gap: 12px;
}

.feature-card {
  padding: 16px;
  border-radius: 16px;
  background: rgba(24, 14, 40, 0.7);
  border: 1px solid rgba(160, 120, 255, 0.2);
  display: grid;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.feature-card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 0%, var(--accent), transparent 60%);
  opacity: 0.35;
  pointer-events: none;
}

.icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(120, 90, 210, 0.5));
  box-shadow: 0 8px 16px rgba(10, 6, 20, 0.5);
  position: relative;
}

.icon::before {
  content: "";
  position: absolute;
  inset: 8px;
  border-radius: 8px;
  background: var(--accent);
  filter: blur(6px);
  opacity: 0.8;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
}

.feature-text {
  font-size: 13px;
  color: rgba(230, 219, 255, 0.7);
}
</style>
