<template>
  <section class="featured">
    <div class="container">
      <div class="featured__head">
        <p class="eyebrow">Популярное</p>
        <h2 class="title">Топовые штуки, которые залипают</h2>
        <p class="subtitle">
          Собрал самое волчье, чтобы не искать по норам. Все ссылки легко правятся в одном массиве.
        </p>
      </div>

      <div class="featured__grid">
        <WCard v-for="item in homeFeaturedItems" :key="item.href" interactive>
          <div class="card-icon" aria-hidden="true">
            <svg v-if="item.icon === 'claw'" viewBox="0 0 48 48">
              <path
                d="M10 32c10-1 12-14 14-20 2 6 4 19 14 20-6 3-10 6-14 6s-8-3-14-6Z"
                fill="currentColor"
              />
            </svg>
            <svg v-else-if="item.icon === 'spark'" viewBox="0 0 48 48">
              <path
                d="M24 4l4 12 12 4-12 4-4 12-4-12-12-4 12-4 4-12Z"
                fill="currentColor"
              />
            </svg>
            <svg v-else-if="item.icon === 'loop'" viewBox="0 0 48 48">
              <path
                d="M14 18c0-5 4-9 9-9s9 4 9 9-4 9-9 9"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
              />
              <path
                d="M34 30c0 5-4 9-9 9s-9-4-9-9 4-9 9-9"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
              />
            </svg>
            <svg v-else-if="item.icon === 'context'" viewBox="0 0 48 48">
              <path
                d="M10 12h28v18H20l-10 6V12Z"
                fill="none"
                stroke="currentColor"
                stroke-width="3.5"
                stroke-linejoin="round"
              />
            </svg>
            <svg v-else-if="item.icon === 'quote'" viewBox="0 0 48 48">
              <path
                d="M12 30c0-8 4-14 10-16v8c-4 1-6 4-6 8h6v8h-10v-8Zm16 0c0-8 4-14 10-16v8c-4 1-6 4-6 8h6v8h-10v-8Z"
                fill="currentColor"
              />
            </svg>
            <svg v-else viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" stroke-width="3.5" />
              <path d="M24 10v12l8 6" fill="none" stroke="currentColor" stroke-width="3.5" />
            </svg>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-text">{{ item.description }}</p>
          <WButton class="card-button" variant="ghost" :to="item.href" size="sm">Открыть</WButton>
        </WCard>
      </div>
    </div>
  </section>
</template>

<script setup>
import { homeFeaturedItems } from '@/content/home/featured'
import WButton from '@/components/ui/WButton.vue'
import WCard from '@/components/ui/WCard.vue'
</script>

<style scoped>
.featured {
  padding: 56px 0;
}

.featured__head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 12px;
  color: var(--muted);
}

.title {
  margin: 0;
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: clamp(26px, 3vw, 36px);
  max-width: 900px;
  text-wrap: balance;
}

.subtitle {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
  max-width: 900px;
}

.featured__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: rgba(106, 215, 255, 0.12);
  color: var(--accent-2);
}

.card-icon svg {
  width: 28px;
  height: 28px;
}

.card-title {
  margin: 16px 0 6px;
  font-size: 18px;
  font-weight: 600;
}

.card-text {
  margin: 0 0 14px;
  color: var(--muted);
  line-height: 1.6;
  min-height: 48px;
}

.card-button {
  width: 100%;
}

@media (max-width: 900px) {
  .featured__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .featured__grid {
    grid-template-columns: 1fr;
  }
}
</style>
