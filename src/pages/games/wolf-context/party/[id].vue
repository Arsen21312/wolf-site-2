<script setup lang="ts">
const route = useRoute()
const roomId = typeof route.params.id === 'string' ? route.params.id : String(route.params.id ?? '')
navigateTo(`/games/wolf-context/room/${roomId}`)
</script>
