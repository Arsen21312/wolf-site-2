<template>
  <section class="screen result" :style="resultStyle">
    <div class="result-bg"></div>
    <div class="halo"></div>

    <div class="symbols">
      <span v-for="symbol in symbols" :key="symbol.id" :style="symbol.style">✦</span>
    </div>

    <div class="content">
      <div class="badge">{{ copy.title }}</div>

      <div class="type">
        <div class="type-title">{{ result?.title }}</div>
        <div class="type-text">{{ result?.detail }}</div>
      </div>

      <h1>
        {{ copy.lead }}
        <span>{{ copy.sublead }}</span>
      </h1>

      <button class="cta" type="button" @click="$emit('cta')">
        {{ copy.cta }}
      </button>
      <div class="hint">{{ copy.hint }}</div>
    </div>

    <div class="grain"></div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  copy: {
    type: Object,
    required: true,
  },
  result: {
    type: Object,
    default: null,
  },
  background: {
    type: String,
    default: '',
  },
});

defineEmits(['cta']);

const resultStyle = computed(() => ({
  '--bg-url': props.background ? `url('${props.background}')` : 'none',
}));

const symbols = Array.from({ length: 10 }, (_, index) => {
  const left = `${Math.random() * 100}%`;
  const top = `${Math.random() * 100}%`;
  const delay = `${Math.random() * 3}s`;
  const duration = `${5 + Math.random() * 4}s`;
  return {
    id: index,
    style: {
      left,
      top,
      animationDelay: delay,
      animationDuration: duration,
    },
  };
});
</script>

<style scoped>
.screen {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px 48px;
}

.result {
  background: #05030a;
}

.result-bg {
  position: absolute;
  inset: 0;
  background-image: var(--bg-url);
  background-size: cover;
  background-position: center;
  opacity: 0.2;
}

.halo {
  position: absolute;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.35);
  filter: blur(120px);
  animation: halo 4s ease-in-out infinite;
}

.symbols {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.symbols span {
  position: absolute;
  font-size: 28px;
  color: rgba(175, 140, 255, 0.2);
  animation: drift 6s ease-in-out infinite;
}

.content {
  position: relative;
  z-index: 2;
  max-width: 520px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.badge {
  align-self: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: rgba(236, 223, 255, 0.8);
  border: 1px solid rgba(175, 140, 255, 0.4);
  background: rgba(21, 12, 36, 0.6);
}

.type {
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(20, 12, 32, 0.7);
  border: 1px solid rgba(160, 120, 255, 0.25);
  box-shadow: 0 16px 30px rgba(10, 6, 20, 0.5);
}

.type-title {
  font-size: 18px;
  font-weight: 600;
}

.type-text {
  font-size: 13px;
  color: rgba(226, 212, 255, 0.75);
  margin-top: 6px;
}

h1 {
  margin: 0;
  font-size: 30px;
  line-height: 1.2;
}

h1 span {
  display: block;
  margin-top: 10px;
  color: rgba(187, 155, 255, 0.9);
  font-size: 20px;
}

.cta {
  border: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  color: #05030a;
  background: linear-gradient(90deg, #e5c9ff, #8b5bff);
  box-shadow: 0 16px 40px rgba(121, 74, 208, 0.5);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.cta:active {
  transform: scale(0.97);
}

.hint {
  font-size: 12px;
  color: rgba(226, 212, 255, 0.6);
}

.grain {
  position: absolute;
  inset: 0;
  opacity: 0.16;
  pointer-events: none;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

@keyframes halo {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}

@keyframes drift {
  0% {
    transform: translateY(0);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-30px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    opacity: 0.2;
  }
}

@media (min-width: 768px) {
  h1 {
    font-size: 36px;
  }

  h1 span {
    font-size: 22px;
  }
}
</style>
