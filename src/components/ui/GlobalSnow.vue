<template>
  <div class="snow-overlay">
    <span v-for="flake in flakes" :key="flake.id" class="snowflake" :style="flake.style">✻</span>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const flakes = ref([]);

onMounted(() => {
  const count = 28;
  const arr = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 8 + 6;
    const duration = Math.random() * 8 + 10;
    const delay = Math.random() * 10;
    arr.push({
      id: i,
      style: `left:${Math.random() * 100}%; width:${size}px; height:${size}px; animation-duration:${duration}s; animation-delay:${delay}s;`
    });
  }
  flakes.value = arr;
});
</script>

<style scoped>
.snow-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.snowflake {
  position: absolute;
  top: -10%;
  color: rgba(255, 255, 255, 0.8);
  animation: snow-fall linear infinite;
}

@keyframes snow-fall {
  from {
    transform: translateY(-10vh) rotate(0deg);
  }
  to {
    transform: translateY(120vh) rotate(180deg);
  }
}
</style>
