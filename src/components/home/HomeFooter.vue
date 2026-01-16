<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div>
        <div class="brand">НЕЙРОННЫЙ ВОЛК</div>
        <p class="tagline">Сделано волчьими лапами и нейросетями.</p>
        <p class="copy">© 2026 NeuralWiseWolf. Все права под луной.</p>
      </div>
      <div>
        <p class="footer__title">Разделы</p>
        <div class="footer__links">
          <NuxtLink to="/games">Игры</NuxtLink>
          <NuxtLink to="/generators">Генераторы</NuxtLink>
          <NuxtLink to="/decisions">Решения</NuxtLink>
          <NuxtLink to="/blog">Блог</NuxtLink>
          <NuxtLink to="/contacts">Контакты</NuxtLink>
        </div>
      </div>
      <div>
        <p class="footer__title">Соцсети</p>
        <div class="footer__links">
          <a href="https://t.me" target="_blank" rel="noreferrer">Telegram</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  padding: 40px 0 50px;
  margin-top: 32px;
  background: rgba(6, 9, 12, 0.8);
}

.footer__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 28px;
}

.brand {
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  letter-spacing: 2px;
  font-size: 16px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.tagline {
  margin: 0 0 10px;
  color: var(--muted);
}

.copy {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.footer__title {
  margin: 0 0 12px;
  font-weight: 600;
}

.footer__links {
  display: grid;
  gap: 8px;
  color: var(--muted);
}

.footer__links a {
  color: inherit;
}

.footer__links a:hover {
  color: var(--text);
}

@media (max-width: 768px) {
  .footer__grid {
    grid-template-columns: 1fr;
  }
}
</style>
