<template>
  <div :class="['w-card', { 'w-card--interactive': interactive }]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  interactive: { type: Boolean, default: false }
})
</script>

<style scoped>
.w-card {
  background: linear-gradient(135deg, rgba(106, 215, 255, 0.08), rgba(252, 166, 61, 0.05)),
    var(--panel);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
}

.w-card--interactive {
  transition: transform 0.2s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}

.w-card--interactive:hover {
  transform: translateY(-4px);
  border-color: rgba(106, 215, 255, 0.45);
  box-shadow: 0 24px 50px rgba(106, 215, 255, 0.2);
}

@media (prefers-reduced-motion: reduce) {
  .w-card--interactive {
    transition: none;
  }

  .w-card--interactive:hover {
    transform: none;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  }
}
</style>
