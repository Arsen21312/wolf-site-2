<template>
  <div class="layout-shell">
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
</script>
