<template>
  <section class="screen quiz">
    <div class="quiz-bg"></div>
    <div class="orb orb-left"></div>
    <div class="orb orb-right"></div>

    <div class="progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
      </div>
      <div class="progress-label">{{ currentIndex + 1 }}/{{ total }}</div>
    </div>

    <div class="content">
      <transition name="card-swap" mode="out-in">
        <div :key="question.text" class="card">
          <div class="tag">{{ copy.title }}</div>
          <h2>{{ question.text }}</h2>
        </div>
      </transition>

      <div class="options">
        <button
          v-for="(option, index) in question.options"
          :key="option"
          class="option"
          type="button"
          @click="selectAnswer(index)"
        >
          <span class="dot"></span>
          <span>{{ option }}</span>
        </button>
      </div>
    </div>

    <div class="grain"></div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  copy: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['complete', 'answer']);

const questions = computed(() => props.copy.questions);
const total = computed(() => questions.value.length);
const currentIndex = ref(0);
const answers = ref(Array(total.value).fill(null));
const isTransitioning = ref(false);

const question = computed(() => questions.value[currentIndex.value]);
const progress = computed(() => ((currentIndex.value + 1) / total.value) * 100);

const selectAnswer = (index) => {
  if (isTransitioning.value) return;
  emit('answer');
  answers.value[currentIndex.value] = index;
  isTransitioning.value = true;

  setTimeout(() => {
    if (currentIndex.value < total.value - 1) {
      currentIndex.value += 1;
      isTransitioning.value = false;
      return;
    }
    emit('complete', [...answers.value]);
  }, 520);
};
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

.quiz {
  background: radial-gradient(circle at 10% 0%, rgba(110, 70, 210, 0.25), transparent 45%),
    radial-gradient(circle at 90% 90%, rgba(160, 110, 255, 0.2), transparent 50%),
    #05030a;
}

.quiz-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(7, 4, 14, 0.85), rgba(10, 6, 20, 0.85));
}

.orb {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  filter: blur(110px);
  opacity: 0.4;
  animation: orb 6s ease-in-out infinite;
}

.orb-left {
  top: 10%;
  left: -10%;
  background: rgba(139, 92, 246, 0.6);
}

.orb-right {
  bottom: 5%;
  right: -10%;
  background: rgba(168, 85, 247, 0.5);
  animation-delay: 1s;
}

.progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 18px 18px 0;
  z-index: 2;
}

.progress-bar {
  height: 4px;
  border-radius: 999px;
  background: rgba(80, 60, 120, 0.4);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #caa8ff, #8b5bff);
  box-shadow: 0 0 16px rgba(139, 92, 246, 0.8);
  transition: width 0.4s ease;
}

.progress-label {
  margin-top: 10px;
  text-align: right;
  font-size: 12px;
  color: rgba(215, 200, 255, 0.7);
  letter-spacing: 2px;
}

.content {
  position: relative;
  z-index: 2;
  max-width: 560px;
  width: 100%;
  display: grid;
  gap: 24px;
}

.card {
  padding: 26px 24px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(36, 22, 58, 0.8), rgba(20, 12, 35, 0.85));
  border: 1px solid rgba(155, 120, 255, 0.25);
  box-shadow: 0 20px 40px rgba(10, 6, 20, 0.6);
}

.tag {
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(200, 180, 255, 0.7);
  margin-bottom: 12px;
}

.card h2 {
  margin: 0;
  font-size: 22px;
  line-height: 1.3;
}

.options {
  display: grid;
  gap: 12px;
}

.option {
  border: 1px solid rgba(160, 120, 255, 0.2);
  background: linear-gradient(135deg, rgba(30, 18, 50, 0.7), rgba(14, 8, 25, 0.8));
  color: rgba(244, 236, 255, 0.9);
  padding: 16px 18px;
  border-radius: 16px;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: transform 0.2s ease, border 0.2s ease, box-shadow 0.2s ease;
}

.option:hover {
  transform: translateX(6px);
  border-color: rgba(180, 140, 255, 0.6);
  box-shadow: 0 18px 32px rgba(30, 16, 60, 0.5);
}

.option:active {
  transform: translateX(2px) scale(0.99);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(175, 140, 255, 0.9);
  box-shadow: 0 0 12px rgba(175, 140, 255, 0.6);
}

.grain {
  position: absolute;
  inset: 0;
  opacity: 0.16;
  pointer-events: none;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.card-swap-enter-active,
.card-swap-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.card-swap-enter-from,
.card-swap-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes orb {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}

@media (min-width: 768px) {
  .card h2 {
    font-size: 26px;
  }

  .option {
    font-size: 16px;
    padding: 18px 20px;
  }
}
</style>
