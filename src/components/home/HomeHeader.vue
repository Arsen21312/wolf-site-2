<template>
  <header class="header">
    <div class="container header__inner">
      <NuxtLink class="brand" to="/">
        <span class="brand__dot" aria-hidden="true"></span>
        <span class="brand__text">НЕЙРОННЫЙ ВОЛК</span>
      </NuxtLink>

      <nav class="nav" :class="{ 'nav--open': isOpen }">
        <NuxtLink
          v-for="link in menuLinks"
          :key="link.to"
          class="nav__link"
          :to="link.to"
          @click="closeMenu"
        >
          {{ link.label }}
        </NuxtLink>
        <WButton class="nav__cta" to="/games" size="sm">Открыть игры</WButton>
      </nav>

      <button class="burger" type="button" :aria-expanded="isOpen" @click="toggleMenu">
        <span class="sr-only">Открыть меню</span>
        <span class="burger__line"></span>
        <span class="burger__line"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import WButton from '@/components/ui/WButton.vue'

const menuLinks = [
  { label: 'Игры', to: '/games' },
  { label: 'Генераторы', to: '/generators' },
  { label: 'Решения', to: '/decisions' },
  { label: 'Блог', to: '/blog' },
  { label: 'Контакты', to: '/contacts' }
]

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(7, 10, 15, 0.78);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 0;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: 15px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.brand__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--accent-2), transparent 60%);
  box-shadow: 0 0 12px rgba(106, 215, 255, 0.9);
}

.nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav__link {
  font-size: 14px;
  color: var(--muted);
  transition: color 0.2s ease;
}

.nav__link:hover {
  color: var(--text);
}

.nav__cta {
  margin-left: 6px;
}

.burger {
  display: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--panel);
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
}

.burger__line {
  width: 18px;
  height: 2px;
  background: var(--text);
  display: block;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 960px) {
  .nav {
    position: absolute;
    top: 100%;
    right: 24px;
    left: 24px;
    padding: 18px;
    border-radius: 16px;
    border: 1px solid var(--border);
    background: rgba(8, 12, 18, 0.95);
    backdrop-filter: blur(14px);
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    transform: translateY(-10px);
    opacity: 0;
    pointer-events: none;
    transition: 0.2s ease;
  }

  .nav--open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav__cta {
    width: 100%;
    justify-content: center;
  }

  .burger {
    display: inline-flex;
  }
}
</style>
