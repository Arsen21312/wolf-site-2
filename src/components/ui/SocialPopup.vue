<template>
  <transition name="fade">
    <div v-if="visible" class="sp-overlay" @click.self="$emit('close')">
      <div class="sp-card">
        <button class="sp-close" @click="$emit('close')">×</button>
        <div class="sp-badge">{{ payload.emoji }}</div>
        <h3>{{ payload.title }}</h3>
        <p>{{ payload.text }}</p>
        <div class="sp-actions">
          <a :href="payload.link" target="_blank" rel="noopener" class="sp-btn">{{ payload.cta }}</a>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  payload: {
    type: Object,
    default: () => ({
      title: '',
      text: '',
      cta: '',
      link: '',
      emoji: ''
    })
  }
});
</script>

<style scoped>
.sp-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  z-index: 30;
  padding: 16px;
}

.sp-card {
  position: relative;
  width: min(360px, 100%);
  background: #0b1020;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  padding: 22px 20px 20px;
  text-align: center;
  color: #e5e7eb;
}

.sp-close {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
}

.sp-badge {
  width: 62px;
  height: 62px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #38bdf8, #a855f7);
  color: #0b1220;
  font-size: 28px;
  font-weight: 800;
  margin: 0 auto 14px;
  box-shadow: 0 16px 36px rgba(56, 189, 248, 0.35);
}

h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
}

p {
  margin: 0 0 14px;
  color: #cbd5e1;
  line-height: 1.5;
  font-size: 15px;
}

.sp-actions {
  display: grid;
  gap: 10px;
}

.sp-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 12px 16px;
  border-radius: 999px;
  background: #fff;
  color: #0f172a;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 14px 32px rgba(255, 255, 255, 0.18);
  transition: transform 0.12s ease, box-shadow 0.2s ease;
}

.sp-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(255, 255, 255, 0.24);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
