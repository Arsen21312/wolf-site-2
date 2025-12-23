<template>
  <form class="submit-form" @submit.prevent="handleSubmit">
    <div class="field">
      <label for="text">Текст</label>
      <textarea
        id="text"
        v-model.trim="text"
        placeholder="Например: Потерять нить разговора"
        rows="3"
        required
      />
    </div>

    <div class="field">
      <label for="type">Тип</label>
      <select id="type" v-model="type">
        <option value="word">Слово</option>
        <option value="phrase">Фраза</option>
      </select>
    </div>

    <div class="field checkbox">
      <label>
        <input v-model="isAdult" type="checkbox" />
        18+ содержание
      </label>
    </div>

    <div class="field">
      <label for="createdBy">Автор (необязательно)</label>
      <input id="createdBy" v-model.trim="createdBy" type="text" placeholder="Никнейм или почта" />
    </div>

    <button class="submit-btn" type="submit" :disabled="loading">
      {{ loading ? 'Отправляем...' : 'Отправить в модерацию' }}
    </button>

    <p v-if="message" class="message">{{ message }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const text = ref('')
const type = ref('phrase')
const isAdult = ref(false)
const createdBy = ref('')
const message = ref('')
const loading = ref(false)

const handleSubmit = async () => {
  message.value = ''
  if (!text.value) {
    message.value = 'Введите текст.'
    return
  }

  loading.value = true
  try {
    const response = await $fetch('/api/crocodile/submit', {
      method: 'POST',
      body: {
        text: text.value,
        type: type.value,
        isAdult: isAdult.value,
        createdBy: createdBy.value || null
      }
    })

    if (!response?.ok) {
      message.value = response?.error || 'Не удалось отправить.'
      return
    }

    message.value = 'Спасибо! Отправили в очередь модерации.'
    text.value = ''
    createdBy.value = ''
    isAdult.value = false
    type.value = 'phrase'
  } catch (error) {
    console.error(error)
    message.value = 'Ошибка при отправке.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.submit-form {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 6px;
}

.field label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #7ee7a7;
}

textarea,
select,
input {
  background: rgba(15, 23, 42, 0.6);
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 12px;
  padding: 10px 12px;
}

.checkbox label {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: #cbd5cb;
  text-transform: none;
  letter-spacing: normal;
}

.submit-btn {
  border: none;
  border-radius: 999px;
  padding: 12px 20px;
  background: linear-gradient(120deg, #22c55e, #16a34a);
  color: #05110a;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 14px 30px rgba(34, 197, 94, 0.3);
  transition: transform 0.15s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message {
  margin: 0;
  color: #fbbf24;
}
</style>
