<template>
  <div class="accordion">
    <div class="section">
      <button class="section-toggle" type="button" @click="toggle('rules')">
        <span>Как играть</span>
        <span>{{ openSection === 'rules' ? '-' : '+' }}</span>
      </button>
      <div v-show="openSection === 'rules'" class="section-body">
        <p>
          "Крокодил" - игра на объяснение слов и фраз без подсказок и жестов. Одна команда вытягивает задание и пытается
          объяснить его словами, а остальные угадывают.
        </p>
        <h3>Быстрый старт</h3>
        <ol>
          <li>Выберите сложность и тип задания.</li>
          <li>Нажмите "Показать" - получите слово или фразу.</li>
          <li>Опишите смысл, не используя корневые слова.</li>
          <li>За правильный ответ команда получает очко.</li>
          <li>Меняйтесь ролями и держите темп.</li>
        </ol>
        <h3>Примеры</h3>
        <ul>
          <li>Слово: "Фонарь". Можно сказать: "Светит в темноте, держат в руке".</li>
          <li>Фраза: "Ловить момент". Можно сказать: "Успеть в нужную секунду".</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <button class="section-toggle" type="button" @click="toggle('submit')">
        <span>Предложить слово или фразу</span>
        <span>{{ openSection === 'submit' ? '-' : '+' }}</span>
      </button>
      <div v-show="openSection === 'submit'" class="section-body">
        <CrocodileSubmitForm />
      </div>
    </div>

    <div class="section">
      <button class="section-toggle" type="button" @click="toggle('stats')">
        <span>Статистика</span>
        <span>{{ openSection === 'stats' ? '-' : '+' }}</span>
      </button>
      <div v-show="openSection === 'stats'" class="section-body">
        <CrocodileStats :active="openSection === 'stats'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CrocodileSubmitForm from '@/components/crocodile/CrocodileSubmitForm.vue'
import CrocodileStats from '@/components/crocodile/CrocodileStats.vue'

const openSection = ref(null)

const toggle = (name) => {
  openSection.value = openSection.value === name ? null : name
}
</script>

<style scoped>
.accordion {
  display: grid;
  gap: 16px;
}

.section {
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(10, 14, 18, 0.75);
  overflow: hidden;
}

.section-toggle {
  width: 100%;
  background: transparent;
  border: none;
  color: #e5e7eb;
  font-weight: 700;
  padding: 16px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
}

.section-body {
  padding: 0 18px 18px;
  color: #cbd5cb;
  line-height: 1.7;
  display: grid;
  gap: 12px;
}

.section-body h3 {
  margin: 0;
  color: #d1fae5;
}

.section-body ol,
.section-body ul {
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 6px;
}
</style>
