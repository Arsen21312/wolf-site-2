<template>
  <div class="layout-shell">
    <ClientOnly>
      <RippleGrid
        class="ripple-grid-layer"
        :enable-rainbow="false"
        :ripple-intensity="0.01"
        :grid-size="20"
        :grid-thickness="20"
        :mouse-interaction="true"
        :mouse-interaction-radius="1.2"
        :opacity="0.85"
        grid-color="#d6e6ff"
      />
    </ClientOnly>
    <MainHeader />

    <main class="container main-content">
      <RouterView />
    </main>

    <MainFooter />

  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import MainHeader from '../components/navigation/MainHeader.vue';
import MainFooter from '../components/navigation/MainFooter.vue';
import RippleGrid from '../components/ui/RippleGrid.vue';
</script>

<style scoped>
.layout-shell {
  position: relative;
}

.layout-shell > :not(.ripple-grid-layer) {
  position: relative;
  z-index: 2;
}
</style>
