<template>
  <header class="nav-shell">
    <div class="container nav-bar">
      <NuxtLink to="/" class="brand">
        <span class="brand-icon" role="img" aria-label="Нейронный Волк">🐺</span>
        <strong class="brand-title">Сайт нейронного волка</strong>
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

<script setup>
import BubbleMenu from './BubbleMenu.vue'

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
  gap: 14px;
  color: var(--text);
  text-decoration: none;
  min-width: 0;
  flex: 1 1 auto;
}

.brand-icon {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, #6ad7ff, #fca63d);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
  font-size: 34px;
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
  .brand-icon {
    width: 56px;
    height: 56px;
    font-size: 30px;
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
