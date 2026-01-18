<template>
  <div class="tarot-page">
    <div class="tarot-app bg-forest-950 text-mist-50">
      <NavigationBar :active-view="activeView" @navigate="go" />
      <ViewShell>
        <Transition name="tarot-fade" mode="out-in">
          <HomeView v-if="activeView === 'home'" key="home" />
          <DecksView v-else-if="activeView === 'decks'" key="decks" />
          <SpreadSelectorView v-else-if="activeView === 'spread'" key="spread" />
          <ReadingTableView v-else-if="activeView === 'reading'" key="reading" />
          <CardDetailsView v-else-if="activeView === 'card'" key="card" />
          <HistoryView v-else-if="activeView === 'history'" key="history" />
          <SettingsView v-else key="settings" />
        </Transition>
      </ViewShell>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from '@/components/tarot/NavigationBar.vue'
import ViewShell from '@/components/tarot/ViewShell.vue'
import HomeView from '@/components/tarot/HomeView.vue'
import DecksView from '@/components/tarot/DecksView.vue'
import SpreadSelectorView from '@/components/tarot/SpreadSelectorView.vue'
import ReadingTableView from '@/components/tarot/ReadingTableView.vue'
import CardDetailsView from '@/components/tarot/CardDetailsView.vue'
import HistoryView from '@/components/tarot/HistoryView.vue'
import SettingsView from '@/components/tarot/SettingsView.vue'
import { useTarotAppState } from '@/composables/useTarotAppState'

const { activeView, go } = useTarotAppState()
</script>
