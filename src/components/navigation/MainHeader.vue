<template>
  <header class="nav-shell">
    <div class="container nav-bar">
      <NuxtLink to="/" class="brand logo-wrap">
        <img :src="logoSrc" alt="Логотип Нейронного Волка" class="logo-icon" />
        <span class="brand-title logo-text">Сайт нейронного волка</span>
      </NuxtLink>
      <nav class="nav-links">
        <BubbleMenu
          :items="menuItems"
          menu-aria-label="Открыть меню"
          menu-bg="#0f172a"
          menu-content-color="#ffffff"
          :use-fixed-position="false"
          animation-ease="back.out(1.4)"
          :animation-duration="0.35"
          :stagger-delay="0.06"
        />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import BubbleMenu from './BubbleMenu.vue'

import logoSrc from '~/assets/images/wolf-favicon.png'

const menuItems = [
  { label: 'Игры', href: '/games', ariaLabel: 'Игры', rotation: -2, hoverStyles: { bgColor: '#fca63d', textColor: '#0c1117' } },
  {
    label: 'Реши за меня',
    href: '/decisions',
    ariaLabel: 'Реши за меня',
    rotation: 2,
    hoverStyles: { bgColor: '#6ad7ff', textColor: '#0c1117' }
  },
  {
    label: 'Генераторы',
    href: '/generators',
    ariaLabel: 'Генераторы',
    rotation: -1,
    hoverStyles: { bgColor: '#8c7bff', textColor: '#ffffff' }
  },
  {
    label: 'О волке',
    href: '/about',
    ariaLabel: 'О волке',
    rotation: 1,
    hoverStyles: { bgColor: '#f25f5c', textColor: '#ffffff' }
  }
]
</script>

<style scoped>
.nav-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 18px 0;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--text);
  text-decoration: none;
  min-width: 0;
  flex: 1 1 auto;
}

.logo-wrap {
  gap: 8px;
}

.logo-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  flex-shrink: 0;
}

.brand-title {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.3px;
  white-space: nowrap;
}

.nav-links {
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 18px;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .logo-icon {
    width: 28px;
    height: 28px;
  }

  .brand-title {
    font-size: 20px;
  }

  .nav-links {
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .nav-bar {
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }

  .brand-title {
    font-size: 18px;
    line-height: 1.1;
    white-space: normal;
  }

  .nav-links {
    gap: 12px;
  }
}
</style>
