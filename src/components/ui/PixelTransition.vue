<template>
  <div class="pixel-transition" :class="className" @mouseenter="playIn" @mouseleave="playOut">
    <div class="pixel-transition__content pixel-transition__content--front" ref="frontRef">
      <slot name="firstContent" />
    </div>

    <div class="pixel-transition__content pixel-transition__content--back" ref="backRef">
      <slot name="secondContent" />
    </div>

    <div
      class="pixel-transition__grid"
      :style="{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`
      }"
    >
      <span
        v-for="(_, index) in cells"
        :key="index"
        class="pixel-transition__cell"
        :style="{ backgroundColor: pixelColor }"
        :ref="(el) => setCellRef(el, index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onBeforeUpdate, onMounted, ref, toRefs } from 'vue'
import { gsap } from 'gsap'

const props = withDefaults(
  defineProps<{
    gridSize?: number
    pixelColor?: string
    animationStepDuration?: number
    className?: string
  }>(),
  {
    gridSize: 8,
    pixelColor: '#ffffff',
    animationStepDuration: 0.4,
    className: ''
  }
)

const { gridSize, pixelColor, animationStepDuration, className } = toRefs(props)

const frontRef = ref<HTMLElement | null>(null)
const backRef = ref<HTMLElement | null>(null)
const cellRefs = ref<HTMLElement[]>([])
const timeline = ref<gsap.core.Timeline | null>(null)

const cells = computed(() => gridSize.value * gridSize.value)

const setCellRef = (el: HTMLElement | null, index: number) => {
  if (!el) return
  cellRefs.value[index] = el
}

onBeforeUpdate(() => {
  cellRefs.value = []
})

const buildTimeline = async () => {
  timeline.value?.kill()
  timeline.value = null

  // ensure refs are populated
  await nextTick()
  const front = frontRef.value
  const back = backRef.value
  const cellsEls = cellRefs.value
  if (!front || !back || !cellsEls.length) return

  gsap.set(back, { autoAlpha: 0 })
  gsap.set(cellsEls, { scale: 0, transformOrigin: '50% 50%' })

  const duration = animationStepDuration.value
  const tl = gsap.timeline({ paused: true })

  tl
    .to(
      cellsEls,
      {
        scale: 1,
        duration,
        ease: 'power3.out',
        stagger: { amount: duration, from: 'random' },
        backgroundColor: pixelColor.value,
        overwrite: true
      },
      0
    )
    .to(front, { autoAlpha: 0, duration: duration * 0.95, ease: 'power2.out' }, 0.05)
    .to(back, { autoAlpha: 1, duration: duration * 0.95, ease: 'power2.out' }, 0.05)
    .to(
      cellsEls,
      {
        scale: 0,
        duration: duration * 0.8,
        ease: 'power1.in',
        stagger: { amount: duration * 0.6, from: 'random' }
      },
      duration * 0.7
    )

  timeline.value = tl
}

onMounted(async () => {
  cellRefs.value = []
  await buildTimeline()
})

onBeforeUnmount(() => {
  timeline.value?.kill()
  cellRefs.value = []
})

const playIn = async () => {
  if (!timeline.value) {
    await buildTimeline()
  }
  timeline.value?.play()
}

const playOut = () => {
  timeline.value?.reverse()
}
</script>

<style scoped>
.pixel-transition {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0c1117;
}

.pixel-transition__content {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}

.pixel-transition__content--back {
  opacity: 0;
}

.pixel-transition__grid {
  position: absolute;
  inset: 0;
  display: grid;
  pointer-events: none;
  z-index: 2;
}

.pixel-transition__cell {
  width: 100%;
  height: 100%;
  opacity: 0.95;
  transform: scale(0);
}
</style>
