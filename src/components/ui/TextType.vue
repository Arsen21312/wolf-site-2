<template>
  <p class="typed-line">
    <span>{{ displayText }}</span>
    <span v-if="showCursor" class="cursor">{{ cursorCharacter }}</span>
  </p>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  text: string[]
  typingSpeed?: number
  pauseDuration?: number
  showCursor?: boolean
  cursorCharacter?: string
}

const props = withDefaults(defineProps<Props>(), {
  typingSpeed: 75,
  pauseDuration: 1500,
  showCursor: true,
  cursorCharacter: '|'
})

const displayText = ref('')
const currentIndex = ref(0)
let timer: number | undefined

const phrases = computed(() => props.text || [])

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = undefined
  }
}

const runTyping = () => {
  clearTimer()
  const list = phrases.value
  if (!list.length) {
    displayText.value = ''
    return
  }

  const phrase = list[currentIndex.value % list.length]
  let i = 0

  const typeNext = () => {
    displayText.value = phrase.slice(0, i)
    if (i < phrase.length) {
      i += 1
      timer = window.setTimeout(typeNext, props.typingSpeed)
    } else {
      timer = window.setTimeout(() => {
        currentIndex.value = (currentIndex.value + 1) % list.length
        runTyping()
      }, props.pauseDuration)
    }
  }

  typeNext()
}

onMounted(runTyping)

onBeforeUnmount(() => {
  clearTimer()
})

watch(
  () => props.text,
  () => {
    currentIndex.value = 0
    runTyping()
  }
)
</script>

<style scoped>
.typed-line {
  margin: 0;
  font-size: 18px;
  line-height: 1.5;
  color: inherit;
}

.cursor {
  display: inline-block;
  width: 0.6ch;
  animation: blink 1s steps(2, start) infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .typed-line {
    min-height: calc(1.5em * 3);
  }
}
</style>
