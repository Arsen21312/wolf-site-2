<template>
  <section class="related-tools" aria-label="Похожие инструменты и игры">
    <div class="head">
      <h2>Похожие инструменты и страницы</h2>
      <p>Подобрали ссылки из той же категории, популярные страницы и URL для дополнительного усиления.</p>
    </div>

    <div class="chips">
      <NuxtLink v-for="item in relatedLinks" :key="item.to" class="chip" :to="item.to">
        {{ item.label }}
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const currentPath = computed(() => route.path.replace(/\/$/, '') || '/')

const linkCatalog = [
  { to: '/games/truth-or-dare', label: 'Правда или Действие', category: 'party' },
  { to: '/games/never-have-i-ever', label: 'Я никогда не', category: 'party' },
  { to: '/games/crocodile', label: 'Крокодил', category: 'party' },
  { to: '/games/5-seconds', label: 'Ответь за 5 секунд', category: 'party' },
  { to: '/games/wolf-context', label: 'Волчий Контекст', category: 'quiz' },
  { to: '/games/true-or-false', label: 'Правда или ложь', category: 'quiz' },
  { to: '/games/wolf-runner', label: 'Волчий раннер', category: 'arcade' },
  { to: '/games/wolf-clicker', label: 'Волчий кликер', category: 'arcade' },
  { to: '/games/wolf-jump', label: 'Wolf Jump', category: 'arcade' },
  { to: '/games/sudoku', label: 'Судоку', category: 'logic' },
  { to: '/games/minesweeper', label: 'Сапер', category: 'logic' },
  { to: '/generators/morse', label: 'Азбука Морзе', category: 'utility' },
  { to: '/decisions/love-calculator', label: 'Калькулятор любви', category: 'utility' },
  { to: '/decisions/text-reverser', label: 'Реверс текста', category: 'low' },
  { to: '/decisions/summa-propisyu', label: 'Сумма прописью', category: 'low' },
  { to: '/generators/remove-line-breaks', label: 'Удалить переносы строк', category: 'low' },
  { to: '/generators/text-case', label: 'Регистр текста', category: 'low' }
]

const popularPool = ['/games/truth-or-dare', '/generators/morse', '/decisions/love-calculator']
const lowTrafficPool = ['/decisions/text-reverser', '/decisions/summa-propisyu', '/generators/remove-line-breaks']

const detectCategory = (path) => {
  if (path.startsWith('/games/truth-or-dare') || path.includes('/never-have-i-ever') || path.includes('/crocodile')) {
    return 'party'
  }

  if (path.includes('/true-or-false') || path.includes('/wolf-context')) {
    return 'quiz'
  }

  if (path.includes('/wolf-runner') || path.includes('/wolf-clicker') || path.includes('/wolf-jump')) {
    return 'arcade'
  }

  if (path.includes('/sudoku') || path.includes('/minesweeper')) {
    return 'logic'
  }

  if (path.startsWith('/games')) {
    return 'party'
  }

  if (path.startsWith('/generators') || path.startsWith('/decisions')) {
    return 'utility'
  }

  return 'party'
}

const pickLinks = (paths, count, excludeSet) =>
  paths
    .filter((to) => !excludeSet.has(to))
    .slice(0, count)
    .map((to) => linkCatalog.find((item) => item.to === to))
    .filter(Boolean)

const relatedLinks = computed(() => {
  const exclude = new Set([currentPath.value])
  const category = detectCategory(currentPath.value)

  const sameCategory = linkCatalog
    .filter((item) => item.category === category && !exclude.has(item.to))
    .slice(0, 3)

  sameCategory.forEach((item) => exclude.add(item.to))

  const popular = pickLinks(popularPool, 2, exclude)
  popular.forEach((item) => exclude.add(item.to))

  const lowTraffic = pickLinks(lowTrafficPool, 3, exclude)
  lowTraffic.forEach((item) => exclude.add(item.to))

  const merged = [...sameCategory, ...popular, ...lowTraffic]

  if (merged.length < 6) {
    const fallback = linkCatalog.filter((item) => !exclude.has(item.to)).slice(0, 6 - merged.length)
    return [...merged, ...fallback]
  }

  return merged.slice(0, 8)
})
</script>

<style scoped>
.related-tools {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  padding: 20px;
  display: grid;
  gap: 14px;
}

.head {
  display: grid;
  gap: 6px;
}

.head h2 {
  margin: 0;
  font-size: 22px;
}

.head p {
  margin: 0;
  color: #cbd5f5;
  line-height: 1.6;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  text-decoration: none;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #dbe4f8;
  padding: 9px 13px;
  font-weight: 700;
}

.chip:hover {
  border-color: rgba(147, 197, 253, 0.65);
  color: #93c5fd;
}

@media (max-width: 768px) {
  .related-tools {
    padding: 16px;
  }
}
</style>
