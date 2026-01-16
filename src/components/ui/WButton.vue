<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="['w-button', variantClass, sizeClass]"
    :target="target"
    :rel="rel"
  >
    <slot />
  </NuxtLink>
  <a
    v-else-if="href"
    :href="href"
    :class="['w-button', variantClass, sizeClass]"
    :target="target"
    :rel="rel"
  >
    <slot />
  </a>
  <button v-else :type="type" :class="['w-button', variantClass, sizeClass]">
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  to: { type: String, default: '' },
  href: { type: String, default: '' },
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' },
  target: { type: String, default: '' },
  rel: { type: String, default: '' }
})

const variantClass = computed(() => `w-button--${props.variant}`)
const sizeClass = computed(() => `w-button--${props.size}`)
</script>

<style scoped>
.w-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.22s ease, border-color 0.22s ease,
    background 0.22s ease, color 0.22s ease;
  text-decoration: none;
}

.w-button--primary {
  background: linear-gradient(120deg, var(--accent-2), var(--accent));
  color: #0b0d14;
  box-shadow: 0 16px 36px rgba(106, 215, 255, 0.25);
}

.w-button--ghost {
  background: var(--panel);
  border-color: var(--border);
  color: var(--text);
  backdrop-filter: blur(12px);
}

.w-button--light {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: var(--text);
}

.w-button--sm {
  padding: 9px 14px;
  font-size: 13px;
}

.w-button--md {
  padding: 12px 18px;
  font-size: 15px;
}

.w-button--lg {
  padding: 14px 22px;
  font-size: 16px;
}

.w-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(55, 245, 138, 0.22);
}

.w-button--ghost:hover,
.w-button--light:hover {
  border-color: rgba(106, 215, 255, 0.55);
  box-shadow: 0 18px 34px rgba(106, 215, 255, 0.18);
}

@media (prefers-reduced-motion: reduce) {
  .w-button {
    transition: none;
  }

  .w-button:hover {
    transform: none;
    box-shadow: none;
  }
}
</style>
