<template>
  <footer class="nw-footer">
    <div class="nw-footer-inner">
      <NuxtLink to="/" class="nw-brand">
        <span class="nw-title">Нейронный волк</span>
        <span class="nw-dot">🐺</span>
        <span class="nw-year">{{ year }}</span>
      </NuxtLink>

      <NuxtLink to="/ads" class="nw-tg-btn">
        <span class="nw-tg-icon" aria-hidden="true" />
        <span>Реклама</span>
      </NuxtLink>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.nw-footer {
  border-top: 1px solid rgba(148, 163, 184, 0.16);
  background: #020617;
  padding: 16px;
  color: #e5e7eb;
}

.nw-footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

@media (max-width: 640px) {
  .nw-footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}

.nw-brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  font-weight: 600;
}

.nw-brand:hover {
  color: #a5b4fc;
}

.nw-title {
  font-size: 15px;
}

.nw-dot {
  color: #64748b;
  font-size: 15px;
}

.nw-year {
  font-size: 13px;
  color: #94a3b8;
}

.nw-tg-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #0ea5e9;
  color: #e0f2fe;
  background: rgba(14, 165, 233, 0.12);
  padding: 8px 12px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  transition: background 0.12s ease, transform 0.08s ease, box-shadow 0.12s ease;
}

.nw-tg-btn:hover {
  background: rgba(14, 165, 233, 0.2);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.55);
  transform: translateY(-1px);
}

.nw-tg-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.5);
}

.nw-tg-icon {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 30% 20%, #e0f2fe, #0ea5e9),
    #0ea5e9;
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.6);
}
</style>
