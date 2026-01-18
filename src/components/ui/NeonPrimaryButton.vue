<template>
  <button
    v-bind="attrs"
    :type="type"
    :class="['tarot-neon-button', attrs.class]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{ type?: 'button' | 'submit' | 'reset' }>(),
  { type: 'button' }
)

const attrs = useAttrs()
const type = props.type
</script>
