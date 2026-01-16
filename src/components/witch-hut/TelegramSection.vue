<template>
  <section class="telegram">
    <div class="telegram-head">
      <p class="eyebrow">Финальная карта</p>
      <h2>Хатка ведьмы</h2>
    </div>
    <div class="telegram-card">
      <p class="telegram-text">
        Хочешь узнать что она реально хочет, без гаданий на глаз
      </p>
      <p class="telegram-text">
        Пиши, я дам расклад и разбор ситуации
      </p>
      <p class="telegram-text micro">Оплата у ведьмы, ссылка ниже</p>
      <button class="telegram-cta" type="button" @click="$emit('cta')">
        Перейти в сообщенияо
      </button>
    </div>
  </section>
</template>

<script setup>
defineProps({
  telegramUrl: {
    type: String,
    default: '',
  },
  isReady: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['cta']);
</script>

<style scoped>
.telegram {
  padding: 24px 22px 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.telegram-head h2 {
  margin: 0;
  font-size: 22px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 11px;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  color: rgba(230, 219, 255, 0.6);
}

.telegram-card {
  padding: 18px 16px 20px;
  border-radius: 18px;
  background: rgba(20, 12, 32, 0.75);
  border: 1px solid rgba(170, 130, 255, 0.2);
  display: grid;
  gap: 10px;
}

.telegram-text {
  margin: 0;
  font-size: 14px;
  color: rgba(230, 219, 255, 0.8);
}

.telegram-text.micro {
  font-size: 12px;
  color: rgba(230, 219, 255, 0.6);
}

.telegram-cta {
  margin-top: 8px;
  border: none;
  cursor: pointer;
  border-radius: 16px;
  padding: 12px 18px;
  font-size: 16px;
  font-weight: 600;
  color: #0b0614;
  background: linear-gradient(135deg, #f2c6ff, #8d5bff);
  box-shadow: 0 18px 30px rgba(108, 68, 200, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.telegram-cta:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 12px 20px rgba(108, 68, 200, 0.3);
}
</style>
