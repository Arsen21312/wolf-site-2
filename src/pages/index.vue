<template>
  <div class="home">
    <HomeHero />
    <FeaturedGrid />
    <WhyBlock />
    <RandomCta />
  </div>
</template>

<script setup>
import HomeHero from '@/components/home/HomeHero.vue'
import FeaturedGrid from '@/components/home/FeaturedGrid.vue'
import WhyBlock from '@/components/home/WhyBlock.vue'
import RandomCta from '@/components/home/RandomCta.vue'

useSeoMeta({
  title: 'Нейронный Волк, игры, генераторы, мемные штуки',
  description: 'Мини-игры и генераторы на русском, чтобы залипнуть и поделиться',
  ogTitle: 'Нейронный Волк, игры, генераторы, мемные штуки',
  ogDescription: 'Мини-игры и генераторы на русском, чтобы залипнуть и поделиться',
  ogImage: '/favicon.png'
})

const url = useRequestURL()
useHead({
  link: [{ rel: 'canonical', href: `${url.origin}/` }]
})
</script>

<style scoped>
.home {
  min-height: 100vh;
}

@media (max-width: 420px) {
  .home {
    overflow-x: hidden;
  }
}
</style>
