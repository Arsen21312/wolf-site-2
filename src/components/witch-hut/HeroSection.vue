<template>
  <section class="screen hero" :style="heroStyle">
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>

    <div class="glow-eye left">
      <span></span>
      <span></span>
    </div>
    <div class="glow-eye right">
      <span></span>
      <span></span>
    </div>

    <div class="particles">
      <span
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="particle.style"
      ></span>
    </div>

    <div class="content">
      <div class="badge">{{ copy.badge }}</div>
      <h1 class="title">
        {{ copy.title }}
        <span>{{ copy.accent }}</span>
      </h1>
      <p class="subtitle">{{ copy.subtitle }}</p>
      <button class="cta" type="button" @click="$emit('start')">
        {{ copy.cta }}
      </button>
      <div class="micro">{{ copy.micro }}</div>
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
  background: {
    type: String,
    default: '',
  },
});

defineEmits(['start']);

const heroStyle = computed(() => ({
  '--bg-url': props.background ? `url('${props.background}')` : 'none',
}));

const particles = Array.from({ length: 18 }, (_, index) => {
  const left = `${Math.random() * 100}%`;
  const top = `${Math.random() * 100}%`;
  const delay = `${Math.random() * 3}s`;
  const duration = `${3 + Math.random() * 3}s`;
  const size = `${2 + Math.random() * 3}px`;
  return {
    id: index,
    style: {
      left,
      top,
      width: size,
      height: size,
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
  padding: 48px 20px;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-image: var(--bg-url);
  background-size: cover;
  background-position: center;
  opacity: 0.4;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(7, 4, 14, 0.6) 45%, rgba(0, 0, 0, 0.95) 100%);
}

.glow-eye {
  position: absolute;
  display: flex;
  gap: 8px;
  z-index: 1;
}

.glow-eye span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(175, 140, 255, 0.9);
  box-shadow: 0 0 20px 6px rgba(175, 140, 255, 0.6);
  animation: pulse 3s ease-in-out infinite;
}

.glow-eye.left {
  top: 22%;
  left: 28px;
}

.glow-eye.right {
  top: 28%;
  right: 40px;
}

.glow-eye.right span {
  animation-delay: 0.3s;
  background: rgba(198, 176, 255, 0.9);
}

.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 999px;
  background: rgba(175, 140, 255, 0.45);
  animation: float 4s ease-in-out infinite;
}

.content {
  position: relative;
  z-index: 2;
  max-width: 520px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 18px;
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

.title {
  margin: 0;
  font-size: 30px;
  line-height: 1.2;
  font-weight: 700;
}

.title span {
  display: block;
  margin-top: 10px;
  color: rgba(187, 155, 255, 0.9);
  font-size: 22px;
}

.subtitle {
  margin: 0;
  font-size: 16px;
  color: rgba(226, 212, 255, 0.8);
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

.cta::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%);
  transform: translateX(-120%);
  transition: transform 0.6s ease;
}

.cta:hover::after {
  transform: translateX(120%);
}

.cta:active {
  transform: scale(0.97);
}

.micro {
  font-size: 12px;
  color: rgba(226, 212, 255, 0.6);
}

.grain {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  pointer-events: none;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

@keyframes float {
  0% {
    transform: translateY(0);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-20px);
    opacity: 0.6;
  }
  100% {
    transform: translateY(0);
    opacity: 0.2;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}

@media (min-width: 768px) {
  .title {
    font-size: 40px;
  }

  .title span {
    font-size: 26px;
  }

  .subtitle {
    font-size: 18px;
  }
}
</style>
