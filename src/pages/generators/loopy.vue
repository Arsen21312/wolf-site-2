<template>
  <div class="loopy-shell">
    <iframe
      class="loopy-frame"
      src="/loopy/"
      title="Loopy"
      loading="lazy"
    ></iframe>
  </div>
</template>

<style scoped>
.loopy-shell {
  width: 100%;
  height: 100vh;
  margin: 0;
}

.loopy-frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
