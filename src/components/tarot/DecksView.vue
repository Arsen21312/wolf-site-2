<template>
  <div class="tarot-view">
    <DecksGrid :decks="decks" @select="selectDeck" @open="selectDeck" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DecksGrid from '@/components/tarot/DecksGrid.vue'
import { useTarotData } from '@/composables/useTarotData'
import { useTarotAppState } from '@/composables/useTarotAppState'

const { getDeckList } = useTarotData()
const { selectDeck } = useTarotAppState()

const decks = computed(() => getDeckList())
</script>
