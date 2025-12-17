<template>
  <figure class="wolf-avatar" :data-mood="resolvedMood">
    <img :src="imageSrc" :alt="altText" loading="lazy" />
    <figcaption class="wolf-avatar__caption">{{ label }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import wise from '@/assets/images/wolf-avatar-wise.svg';
import crazy from '@/assets/images/wolf-avatar-crazy.svg';
import sad from '@/assets/images/wolf-avatar-sad.svg';

type Mood = 'wise' | 'crazy' | 'sad' | 'default';

const props = defineProps<{
  mood?: Mood;
  label?: string;
}>();

const moodMap: Record<Mood, { src: string; label: string }> = {
  wise: { src: wise, label: 'Мудрый волк' },
  crazy: { src: crazy, label: 'Дикий волк' },
  sad: { src: sad, label: 'Задумчивый волк' },
  default: { src: wise, label: 'Нейронный волк' }
};

const resolvedMood = computed<Mood>(() => props.mood ?? 'default');
const variant = computed(() => moodMap[resolvedMood.value] ?? moodMap.default);

const imageSrc = computed(() => variant.value.src);
const label = computed(() => props.label ?? variant.value.label);
const altText = computed(() => `Волк — ${label.value.toLowerCase()}`);
</script>

<style scoped>
.wolf-avatar {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 16px;
  border: 1px solid var(--border);
  background: var(--panel-2);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.35);
  width: 160px;
}

.wolf-avatar img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 12px;
}

.wolf-avatar__caption {
  margin: 0;
  font-size: 14px;
  color: var(--muted);
  text-align: center;
}
</style>
