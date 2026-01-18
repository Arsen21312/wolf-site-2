<template>
  <div v-if="open" class="tarot-modal" @click.self="emit('close')">
    <div class="tarot-modal__panel">
      <div v-if="title" class="tarot-title md text-mist-50">{{ title }}</div>
      <div class="tarot-divider" v-if="title"></div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ open: boolean; title?: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()
</script>
