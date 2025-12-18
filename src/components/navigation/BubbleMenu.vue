<template>
  <div class="bubble-menu" :class="{ 'bubble-menu--open': isOpen, 'bubble-menu--fixed': useFixedPosition }">
    <button
      class="bubble-menu__toggle"
      :aria-label="menuAriaLabel"
      :aria-expanded="isOpen"
      type="button"
      @click="toggleMenu"
    >
      <span class="hamburger" :class="{ 'is-open': isOpen }">
        <span />
        <span />
        <span />
      </span>
    </button>

    <div class="bubble-menu__list" ref="listRef" :style="{ background: menuSurface }">
      <component
        v-for="(item, index) in items"
        :is="linkTag(item.href)"
        :key="item.label"
        :to="isInternal(item.href) ? item.href : undefined"
        :href="!isInternal(item.href) ? item.href : undefined"
        class="bubble-menu__item"
        :aria-label="item.ariaLabel || item.label"
        :style="itemStyle(item)"
        :ref="(el) => setItemRef(el, index)"
        @mouseenter="() => applyHover(item, index, true)"
        @mouseleave="() => applyHover(item, index, false)"
        @click="(e) => handleItemClick(item, e)"
      >
        {{ item.label }}
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onBeforeUpdate, onMounted, ref, toRefs, watch } from 'vue'
import { gsap } from 'gsap'
import { useRouter } from '#app'

type MenuItem = {
  label: string
  href: string
  ariaLabel?: string
  rotation?: number
  hoverStyles?: { bgColor?: string; textColor?: string }
}

const props = withDefaults(
  defineProps<{
    items: MenuItem[]
    menuAriaLabel?: string
    menuBg?: string
    menuContentColor?: string
    useFixedPosition?: boolean
    animationEase?: string
    animationDuration?: number
    staggerDelay?: number
  }>(),
  {
    menuAriaLabel: 'Toggle navigation',
    menuBg: '#0f172a',
    menuContentColor: '#ffffff',
    useFixedPosition: false,
    animationEase: 'back.out(1.3)',
    animationDuration: 0.35,
    staggerDelay: 0.06
  }
)

const { items, menuAriaLabel, menuBg, menuContentColor, useFixedPosition, animationEase, animationDuration, staggerDelay } =
  toRefs(props)

const menuSurface = computed(
  () => 'linear-gradient(165deg, rgba(15, 23, 42, 0.94), rgba(4, 7, 16, 0.92))'
)

const isOpen = ref(false)
const listRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLElement[]>([])

const router = useRouter()

const linkTag = (href: string) => (isInternal(href) ? 'NuxtLink' : 'a')
const isInternal = (href: string) => href.startsWith('/')

const setItemRef = (el: HTMLElement | null, index: number) => {
  if (!el) return
  itemRefs.value[index] = el
}

onBeforeUpdate(() => {
  itemRefs.value = []
})

const openMenu = () => {
  const list = listRef.value
  if (!list) return
  isOpen.value = true
  gsap.set(list, { pointerEvents: 'auto', transformOrigin: 'top right' })
  gsap.fromTo(
    list,
    { autoAlpha: 0, y: -8, scale: 0.92 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out' }
  )
  gsap.fromTo(
    itemRefs.value,
    { y: -10, opacity: 0, rotation: 0, pointerEvents: 'none' },
    {
      y: 0,
      opacity: 1,
      rotation: (i: number) => items.value[i]?.rotation || 0,
      pointerEvents: 'auto',
      stagger: staggerDelay.value,
      duration: animationDuration.value,
      ease: animationEase.value
    }
  )
}

const closeMenu = () => {
  const list = listRef.value
  if (!list) {
    isOpen.value = false
    return
  }
  gsap.to(itemRefs.value, {
    y: -6,
    opacity: 0,
    stagger: -staggerDelay.value,
    duration: Math.max(0.12, animationDuration.value * 0.6),
    ease: 'power1.in'
  })
  gsap.to(list, {
    autoAlpha: 0,
    y: -6,
    scale: 0.94,
    duration: 0.18,
    ease: 'power2.in',
    onComplete: () => {
      isOpen.value = false
      gsap.set(list, { pointerEvents: 'none' })
    }
  })
}

onMounted(() => {
  const list = listRef.value
  if (list) {
    gsap.set(list, { autoAlpha: 0, pointerEvents: 'none', y: -8, scale: 0.92 })
  }
})

onBeforeUnmount(() => {
  gsap.killTweensOf(itemRefs.value)
  if (listRef.value) gsap.killTweensOf(listRef.value)
  itemRefs.value = []
})

watch(
  () => items.value,
  () => {
    itemRefs.value = []
    if (isOpen.value) {
      closeMenu()
    }
  }
)

const toggleMenu = () => {
  if (isOpen.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

const itemStyle = (item: MenuItem) => ({
  '--bubble-bg': menuBg.value,
  '--bubble-color': menuContentColor.value,
  '--bubble-hover-bg': item.hoverStyles?.bgColor || menuContentColor.value,
  '--bubble-hover-color': item.hoverStyles?.textColor || menuBg.value,
  transform: `rotate(${item.rotation || 0}deg)`
})

const applyHover = (item: MenuItem, index: number, isHover: boolean) => {
  const el = itemRefs.value[index]
  if (!el) return
  gsap.to(el, {
    backgroundColor: isHover ? item.hoverStyles?.bgColor || menuContentColor.value : menuBg.value,
    color: isHover ? item.hoverStyles?.textColor || menuBg.value : menuContentColor.value,
    duration: 0.2,
    ease: 'power1.out'
  })
}

// Close menu on route change
router.afterEach(() => {
  if (isOpen.value) {
    closeMenu()
  }
})

const handleItemClick = async (item: MenuItem, event: Event) => {
  if (!isInternal(item.href)) {
    closeMenu()
    window.location.href = item.href
    return
  }
  event.preventDefault()
  closeMenu()
  await router.push(item.href)
}
</script>

<style scoped>
.bubble-menu {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.bubble-menu--fixed {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 20;
}

.bubble-menu__toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid var(--border, rgba(255, 255, 255, 0.16));
  background: rgba(255, 255, 255, 0.08);
  color: var(--text, #fff);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.bubble-menu__toggle:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: translateY(-1px);
}

.hamburger {
  position: relative;
  width: 22px;
  height: 16px;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  display: block;
  height: 2px;
  width: 100%;
  background: currentColor;
  border-radius: 999px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.hamburger.is-open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.hamburger.is-open span:nth-child(2) {
  opacity: 0;
}

.hamburger.is-open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.bubble-menu__list {
  position: absolute;
  top: 110%;
  right: 0;
  display: grid;
  grid-auto-flow: row;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: linear-gradient(165deg, rgba(15, 23, 42, 0.94), rgba(4, 7, 16, 0.92));
  color: #fff;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  min-width: 180px;
  max-width: min(320px, calc(100vw - 24px));
  width: max-content;
  pointer-events: none;
  opacity: 0;
  transform: translateY(-8px);
}

.bubble-menu--open .bubble-menu__list {
  pointer-events: auto;
  opacity: 1;
  transform: translateY(0);
}

.bubble-menu__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: v-bind(menuBg);
  color: v-bind(menuContentColor);
  font-weight: 700;
  letter-spacing: 0.2px;
  text-decoration: none;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.bubble-menu__item:hover {
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .bubble-menu__list {
    right: 0;
    left: auto;
    max-width: calc(100vw - 24px);
    transform-origin: top right;
  }
}
</style>
