<template>
  <section class="tof-shell" :class="{ 'tof-play': selectedCategory }">
    <div class="tof-content" v-if="!selectedCategory">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Правда или ложь</h1>
      <p class="tof-sub">
        Проверь, где правда, а где вымысел. Выбирай тему и отвечай, а Волк сразу покажет результат.
      </p>
      <div class="tof-filters">
        <button
          v-for="c in categories"
          :key="c.id"
          class="tof-chip"
          :class="{ 'tof-chip-active': selectedCategory === c.id }"
          @click="selectCategory(c.id)"
        >
          <span class="tof-chip-icon">{{ c.icon }}</span>
          {{ c.label }}
        </button>
      </div>
      <div class="tof-filters-mobile">
        <button
          v-for="c in previewCategories"
          :key="c.id"
          class="tof-chip"
          type="button"
          @click="handleCategorySelect(c.id)"
        >
          <span v-if="c.icon" class="tof-chip-icon">{{ c.icon }}</span>
          {{ c.label }}
        </button>
      </div>
    </div>

    <div class="tof-content tof-game" v-else>
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <div class="tof-filters">
        <button
          v-for="c in categories"
          :key="c.id"
          class="tof-chip"
          :class="{ 'tof-chip-active': selectedCategory === c.id }"
          @click="selectCategory(c.id)"
        >
          <span class="tof-chip-icon">{{ c.icon }}</span>
          {{ c.label }}
        </button>
      </div>
      <div class="tof-filters-mobile">
        <button class="tof-chip tof-chip-primary" type="button" @click="toggleCategories">
          <span v-if="selectedCategoryIcon" class="tof-chip-icon">{{ selectedCategoryIcon }}</span>
          {{ selectedCategoryLabel }}
        </button>
        <div class="tof-filters-extra" :class="{ open: showCategories }">
          <button
            v-for="c in mobileCategories"
            :key="c.id"
            class="tof-chip"
            type="button"
            @click="handleCategorySelect(c.id)"
          >
            <span class="tof-chip-icon">{{ c.icon }}</span>
            {{ c.label }}
          </button>
        </div>
      </div>

      <div class="tof-card">
        <div class="tof-label">{{ currentLabel }}</div>
        <div class="tof-prompt">{{ currentStatement?.text }}</div>

        <div class="tof-buttons" v-if="!showResult">
          <button class="tof-btn tof-btn-true" @click="answer(true)">Правда</button>
          <button class="tof-btn tof-btn-false" @click="answer(false)">Ложь</button>
        </div>

        <div class="tof-result" v-else>
          <div class="tof-answer">
            Правильный ответ:
            <span :class="currentStatement?.answer ? 'tof-true' : 'tof-false'">
              {{ currentStatement?.answer ? 'Правда' : 'Ложь' }}
            </span>
          </div>
          <p v-if="currentStatement?.explanation" class="tof-expl">{{ currentStatement.explanation }}</p>
        </div>
      </div>

      <div class="tof-actions">
        <button class="tof-next" @click="nextStatement">Дальше</button>
      </div>
    </div>
    <SocialPopup :visible="showPopup" :payload="popupPayload" @close="handlePopupClose" />
  </section>
</template>

<script setup>
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue';
import { computed, ref } from 'vue';
import SocialPopup from '@/components/ui/SocialPopup.vue';

const categories = [
  { id: 'science', label: 'Наука', icon: '🔬' },
  { id: 'history', label: 'История', icon: '🏺' },
  { id: 'geo', label: 'География', icon: '🌍' },
  { id: 'pop', label: 'Поп-культура', icon: '🎬' },
  { id: 'wolf', label: 'Волки', icon: '🐺' }
];

const statements = [
  // Наука
  { text: 'День на Венере длится дольше года на Венере.', answer: true, category: 'science', explanation: 'Планета очень медленно вращается вокруг оси.' },
  { text: 'Солнце — это звезда.', answer: true, category: 'science' },
  { text: 'У акул есть кости.', answer: false, category: 'science', explanation: 'Скелет акулы состоит из хрящевой ткани.' },
  { text: 'Вода кипит при 50°C на уровне моря.', answer: false, category: 'science' },
  { text: 'Электрон имеет отрицательный заряд.', answer: true, category: 'science' },
  { text: 'ДНК есть только у животных.', answer: false, category: 'science' },
  { text: 'Свет — это электромагнитная волна.', answer: true, category: 'science' },
  { text: 'Молния бьёт только в высотные здания.', answer: false, category: 'science' },
  { text: 'Самый плотный металл — осмий.', answer: true, category: 'science' },
  { text: 'У Луны нет плотной атмосферы.', answer: true, category: 'science' },
  // Наука
{ text: 'Человек использует меньше 20 процентов мозга', answer: false, category: 'science', explanation: 'Работают почти все зоны мозга, просто не одновременно' },
{ text: 'Звук в вакууме не распространяется', answer: true, category: 'science' },
{ text: 'Человек и банан имеют общий генетический код', answer: true, category: 'science', explanation: 'Речь о схожих базовых биологических механизмах' },
{ text: 'Алмазы могут сгорать', answer: true, category: 'science', explanation: 'Алмаз это форма углерода' },
{ text: 'Антибиотики убивают вирусы', answer: false, category: 'science' },
{ text: 'У осьминогов три сердца', answer: true, category: 'science' },
{ text: 'Люди светятся в темноте', answer: true, category: 'science', explanation: 'Очень слабо, из-за биохимических реакций' },
{ text: 'Температура тела человека всегда 36.6', answer: false, category: 'science' },
{ text: 'Кровь в венах синяя', answer: false, category: 'science' },
{ text: 'Растения тоже дышат кислородом', answer: true, category: 'science' },

  // История
  { text: 'Колумб открыл Америку в 1492 году.', answer: true, category: 'history' },
  { text: 'Пирамиды Египта построили римляне.', answer: false, category: 'history' },
  { text: 'Первым человеком в космосе был Юрий Гагарин.', answer: true, category: 'history' },
  { text: 'Римская империя пала в 476 году.', answer: true, category: 'history' },
  { text: 'Нобелевскую премию учредил Альфред Нобель.', answer: true, category: 'history' },
  { text: 'Отечественная война 1812 года была против Наполеона.', answer: true, category: 'history' },
  { text: 'Средневековые рыцари пользовались смартфонами.', answer: false, category: 'history' },
  { text: 'Картофель в России продвигал Пётр I.', answer: true, category: 'history' },
  { text: 'Великие географические открытия начались в XV веке.', answer: true, category: 'history' },
  { text: 'Вторая мировая закончилась в 1918 году.', answer: false, category: 'history' },
  // История
{ text: 'Юлий Цезарь был императором Рима', answer: false, category: 'history', explanation: 'Он был диктатором, но не императором' },
{ text: 'Берлинская стена пала в 1989 году', answer: true, category: 'history' },
{ text: 'Клеопатра была египтянкой', answer: false, category: 'history', explanation: 'Она происходила из греческой династии' },
{ text: 'Первая Олимпиада прошла в Древней Греции', answer: true, category: 'history' },
{ text: 'Викинги носили рогатые шлемы', answer: false, category: 'history' },
{ text: 'Печатный станок изобрёл Гутенберг', answer: true, category: 'history' },
{ text: 'Троянская война описана в Илиаде', answer: true, category: 'history' },
{ text: 'Чёрная смерть была формой чумы', answer: true, category: 'history' },
{ text: 'Французская революция началась в XIX веке', answer: false, category: 'history' },
{ text: 'Рим был основан в VIII веке до нашей эры', answer: true, category: 'history' },

  // География
  { text: 'Австралия находится в Южном полушарии.', answer: true, category: 'geo' },
  { text: 'Амазонка — самая длинная река мира.', answer: false, category: 'geo', explanation: 'Часто Нил считают самым длинным.' },
  { text: 'Эверест выше 8000 метров.', answer: true, category: 'geo' },
  { text: 'Сахара — это пустыня.', answer: true, category: 'geo' },
  { text: 'Столица Канады — Торонто.', answer: false, category: 'geo', explanation: 'Столица — Оттава.' },
  { text: 'Байкал — самое глубокое озеро в мире.', answer: true, category: 'geo' },
  { text: 'В Антарктиде нет постоянных жителей.', answer: true, category: 'geo' },
  { text: 'В Африке нет вулканов.', answer: false, category: 'geo' },
  { text: 'Париж стоит на реке Сена.', answer: true, category: 'geo' },
  { text: 'Тихий океан - самый большой океан.', answer: true, category: 'geo' },
  // География
{ text: 'Япония состоит более чем из тысячи островов', answer: true, category: 'geo' },
{ text: 'Самая высокая гора Европы это Эльбрус', answer: true, category: 'geo' },
{ text: 'Гренландия является страной', answer: false, category: 'geo' },
{ text: 'В Исландии нет комаров', answer: true, category: 'geo' },
{ text: 'Экватор проходит через Африку', answer: true, category: 'geo' },
{ text: 'Мадагаскар находится рядом с Австралией', answer: false, category: 'geo' },
{ text: 'Москва стоит на реке Москва', answer: true, category: 'geo' },
{ text: 'В Южной Америке больше стран чем в Африке', answer: false, category: 'geo' },
{ text: 'Антарктида официально не принадлежит ни одной стране', answer: true, category: 'geo' },
{ text: 'Самое солёное море это Балтийское', answer: false, category: 'geo' },

  // Поп-культура
  { text: 'The Beatles — группа из Ливерпуля.', answer: true, category: 'pop' },
  { text: 'Гарри Поттер учился в Слизерине.', answer: false, category: 'pop' },
  { text: 'В сериале «Друзья» шесть главных героев.', answer: true, category: 'pop' },
  { text: 'Бэтмен защищает город Готэм.', answer: true, category: 'pop' },
  { text: 'В «Игре престолов» есть дом Старков.', answer: true, category: 'pop' },
  { text: 'Шерлок Холмс жил на Бейкер-стрит.', answer: true, category: 'pop' },
  { text: 'Первый iPhone вышел в 2007 году.', answer: true, category: 'pop' },
  { text: 'В «Властелине колец» есть дракон Смауг.', answer: true, category: 'pop' },
  { text: 'Marvel и DC — одно издательство.', answer: false, category: 'pop' },
  { text: 'Серсея Ланнистер — персонаж «Игры престолов».', answer: true, category: 'pop' },
  { text: 'Джокер — главный враг Супермена.', answer: false, category: 'pop' },
  { text: 'Аниме — это музыкальный жанр.', answer: false, category: 'pop' },
  // Поп-культура
{ text: 'Симпсоны выходят дольше чем существует интернет', answer: true, category: 'pop' },
{ text: 'Железный человек является мутантом', answer: false, category: 'pop' },
{ text: 'Фраза Я твой отец прозвучала в Звёздных войнах', answer: false, category: 'pop', explanation: 'Правильная фраза Нет, я твой отец' },
{ text: 'Пикачу относится к электрическому типу', answer: true, category: 'pop' },
{ text: 'Шрек это мультфильм студии Disney', answer: false, category: 'pop' },
{ text: 'В Minecraft есть дракон', answer: true, category: 'pop' },
{ text: 'Игра GTA V вышла раньше GTA IV', answer: false, category: 'pop' },
{ text: 'Нео главный герой Матрицы', answer: true, category: 'pop' },
{ text: 'TikTok старше YouTube', answer: false, category: 'pop' },
{ text: 'Сериал Во все тяжкие про школьного учителя химии', answer: true, category: 'pop' },

  // Волки
  { text: 'Волки живут стаями.', answer: true, category: 'wolf' },
  { text: 'У волков одинаковые следы с домашними собаками.', answer: false, category: 'wolf' },
  { text: 'Волки воют, чтобы общаться на расстоянии.', answer: true, category: 'wolf' },
  { text: 'Волки питаются исключительно растениями.', answer: false, category: 'wolf' },
  { text: 'Серая волчица может быть лидером стаи.', answer: true, category: 'wolf' },
  // Волки
{ text: 'Волки могут узнавать друг друга по вою', answer: true, category: 'wolf' },
{ text: 'Альфа волк всегда самый сильный в стае', answer: false, category: 'wolf', explanation: 'Часто лидер это родитель, а не боец' },
{ text: 'Волки улыбаются так же как собаки', answer: false, category: 'wolf' },
{ text: 'Волки способны проходить десятки километров за ночь', answer: true, category: 'wolf' },
{ text: 'Волк одиночка это норма для вида', answer: false, category: 'wolf' },

{ text: 'Мемы про волков появились раньше TikTok', answer: true, category: 'wolf' },
{ text: 'Фраза про волка и одиночество стала мемом интернета', answer: true, category: 'wolf' },
{ text: 'Волк в мемах всегда счастлив и успешен', answer: false, category: 'wolf' },
{ text: 'Картинки с волками часто используют для мотивации', answer: true, category: 'wolf' },
{ text: 'Мемный волк обычно символ иронии', answer: true, category: 'wolf' },

{ text: 'Нейронный волк это реальное животное', answer: false, category: 'wolf' },
{ text: 'Нейронный волк может существовать только в цифровом виде', answer: true, category: 'wolf' },
{ text: 'Нейронный волк знает ответы на все вопросы', answer: false, category: 'wolf' },
{ text: 'Нейронный волк это образ, а не персонаж', answer: true, category: 'wolf' },
{ text: 'Нейронный волк может ошибаться', answer: true, category: 'wolf' },

{ text: 'Волк в культуре часто символизирует одиночество', answer: true, category: 'wolf' },
{ text: 'Все волки опасны для человека', answer: false, category: 'wolf' },
{ text: 'Волки избегают людей', answer: true, category: 'wolf' },
{ text: 'Образ волка одинаков во всех культурах', answer: false, category: 'wolf' },
{ text: 'Волк в мемах чаще образ мышления, а не зверь', answer: true, category: 'wolf' },



];

const gameStarted = ref(false);
const selectedCategory = ref(null);
const currentStatement = ref(null);
const userAnswer = ref(null);
const showResult = ref(false);
const usedIndices = ref({});
const randomCategory = { id: 'random', label: 'Случайно' };
const promptsSeen = ref(0);
const showPopup = ref(false);
const popupIndex = ref(0);
const currentCategoryForStatement = ref(categories[0]?.id || '');

const socials = [
  {
    title: 'Подпишись на Telegram',
    text: 'Куча мемов, всё самое свежее тут',
    cta: 'Перейти в логово',
    link: 'https://t.me/neural_wise_wolf',
    emoji: '✉️'
  },
  {
    title: 'TikTok Волка',
    text: 'Мемы, стримы и много волков',
    cta: 'Смотреть TikTok',
    link: 'https://www.tiktok.com/@neural_wolf',
    emoji: '🎬'
  },
  {
    title: 'YouTube канал',
    text: 'Шортсы и длинные видосы с волками',
    cta: 'Открыть YouTube',
    link: 'https://www.youtube.com/@neural_wolf',
    emoji: '▶️'
  },
  {
    title: 'Залетай в Instagram',
    text: 'Самое первое и большое сообщество, много мемов с волками',
    cta: 'Открыть Instagram',
    link: 'https://instagram.com/neural_wise_wolf/',
    emoji: '📸'
  }
];

const popupPayload = computed(() => socials[popupIndex.value % socials.length]);

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Игры', to: '/games' },
  { label: 'Правда или ложь' }
];

const mobileCategories = computed(() => {
  if (!selectedCategory.value) return [randomCategory, ...categories];
  return [randomCategory, ...categories].filter((c) => c.id !== selectedCategory.value);
});
const showCategories = ref(false);
const previewCategories = computed(() => [randomCategory, ...categories]);

const selectedCategoryLabel = computed(() => {
  if (!selectedCategory.value || selectedCategory.value === randomCategory.id) return randomCategory.label;
  const c = categories.find((item) => item.id === selectedCategory.value);
  return c ? c.label : '';
});

const selectedCategoryIcon = computed(() => {
  if (!selectedCategory.value || selectedCategory.value === randomCategory.id) return '';
  const c = categories.find((item) => item.id === selectedCategory.value);
  return c?.icon || '';
});

const currentLabel = computed(() => {
  const c = categories.find((item) => item.id === currentCategoryForStatement.value);
  return c ? c.label : '';
});

function pickCategoryForStatement() {
  if (selectedCategory.value && selectedCategory.value !== randomCategory.id) return selectedCategory.value;
  const idx = Math.floor(Math.random() * categories.length);
  return categories[idx]?.id || categories[0]?.id || '';
}

function selectCategory(cat) {
  selectedCategory.value = cat;
  gameStarted.value = true;
  if (cat && cat !== randomCategory.id) {
    usedIndices.value[cat] = new Set();
  }
  nextStatement();
}

function handleCategorySelect(cat) {
  selectCategory(cat);
  showCategories.value = false;
}

function toggleCategories() {
  showCategories.value = !showCategories.value;
}

function pickRandomIndex(list, key) {
  if (!list.length) return -1;
  if (!usedIndices.value[key]) usedIndices.value[key] = new Set();
  const used = usedIndices.value[key];
  if (used.size >= list.length) used.clear();
  let idx = Math.floor(Math.random() * list.length);
  if (list.length > 1 && used.has(idx)) idx = (idx + 1) % list.length;
  used.add(idx);
  return idx;
}

function nextStatement() {
  const categoryForStatement = pickCategoryForStatement();
  currentCategoryForStatement.value = categoryForStatement;
  const pool = statements.filter((s) => s.category === categoryForStatement);
  const idx = pickRandomIndex(pool, categoryForStatement || 'default');
  currentStatement.value = idx >= 0 ? pool[idx] : null;
  userAnswer.value = null;
  showResult.value = false;

  promptsSeen.value += 1;
  if (promptsSeen.value % 5 === 0) {
    showPopup.value = true;
  }
}

function answer(value) {
  userAnswer.value = value;
  showResult.value = true;
}
function handlePopupClose() {
  showPopup.value = false;
  popupIndex.value = (popupIndex.value + 1) % socials.length;
}
</script>

<style scoped>
.tof-shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(14px, 3vw, 28px);
  background: transparent;
  color: #e5e7eb;
  text-align: center;
  box-sizing: border-box;
}

.tof-content {
  position: relative;
  z-index: 1;
  width: min(1100px, 100%);
  display: grid;
  gap: clamp(16px, 3vw, 24px);
  justify-items: center;
  padding: clamp(16px, 3vw, 28px) clamp(12px, 3vw, 24px) clamp(14px, 3vw, 26px);
  margin: 0 auto;
}

.tof-content:not(.tof-game) {
  max-width: 900px;
  margin: 0 auto;
  padding-top: clamp(80px, 4vw, 120px);

@media (max-width: 640px) {
  padding-top: clamp(8px, 2vw, 16px);
}
}

.tof-content.tof-game {
  gap: clamp(14px, 2.6vw, 24px);
  justify-items: center;
  align-items: center;
  min-height: 70vh;
  padding: clamp(8px, 1.6vw, 16px) 0 clamp(12px, 2.4vw, 20px);
  margin-top: 0;
  width: 100%;
}

.tof-shell h1 {
  margin: 0 0 6px;
  font-size: clamp(34px, 7vw, 64px);
  letter-spacing: 0;
  color: #e5e7eb;
  font-family: 'Space Grotesk', 'Montserrat', 'Manrope', sans-serif;
  font-weight: 800;
  line-height: 1.05;
}

.tof-sub {
  margin: 6px 0 14px;
  color: #cbd5e1;
  line-height: 1.55;
  max-width: 760px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  font-size: clamp(15px, 2vw, 18px);
}

.tof-filters {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(8px, 2vw, 14px);
  justify-content: center;
  margin-bottom: 8px;
  width: 100%;
}

.tof-chip {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
  color: #cbd5e1;
  border-radius: 999px;
  padding: clamp(10px, 2vw, 14px) clamp(14px, 3vw, 18px);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  font-size: clamp(14px, 1.8vw, 16px);
  font-weight: 800;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex: 0 1 auto;
  min-width: 160px;
  max-width: 240px;
}

.tof-filters-mobile {
  display: none;
  width: min(520px, 100%);
  margin: 0 auto;
  gap: 10px;
  justify-items: center;
}

.tof-chip-primary {
  animation: random-pulse 5s ease-in-out infinite;
}

.tof-filters-extra {
  display: grid;
  gap: 10px;
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease;
  justify-items: center;
}

.tof-filters-extra.open {
  max-height: 420px;
  opacity: 1;
}

@media (max-width: 640px) {
  .tof-chip {
    min-width: 0;
    width: 100%;
  }

  .tof-filters {
    display: none;
  }

  .tof-filters-mobile {
    display: grid;
  }
}

@keyframes random-pulse {
  0%,
  88%,
  100% {
    transform: translateY(0);
  }
  92% {
    transform: translateY(-2px);
  }
  96% {
    transform: translateY(1px);
  }
}

.tof-chip-active {
  background: linear-gradient(120deg, rgba(56, 189, 248, 0.25), rgba(168, 85, 247, 0.25));
  border-color: rgba(168, 85, 247, 0.5);
  color: #e5e7eb;
}

.tof-chip-icon {
  font-size: 16px;
}

.tof-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: clamp(20px, 3vw, 32px);
  display: grid;
  gap: clamp(12px, 2vw, 20px);
  position: relative;
  overflow: hidden;
  max-width: min(900px, 100%);
  width: 100%;
  min-height: clamp(240px, 42vh, 360px);
  margin: 0 auto;
  box-shadow: none;
}

.tof-card::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.12), transparent 60%);
  right: -60px;
  bottom: -80px;
  pointer-events: none;
}

.tof-label {
  font-size: 15px;
  color: #94a3b8;
  letter-spacing: 0.08em;
  text-transform: lowercase;
  display: flex;
  gap: 6px;
  justify-content: center;
}

.tof-prompt {
  font-size: clamp(24px, 5vw, 34px);
  font-weight: 700;
  line-height: 1.4;
  color: #e5e7eb;
  margin: 0;
  text-align: center;
  min-height: clamp(140px, 30vh, 200px);
  display: grid;
  place-items: center;
}

.tof-buttons {
  display: flex;
  gap: clamp(8px, 1.6vw, 14px);
  flex-wrap: wrap;
  justify-content: center;
}

.tof-btn {
  padding: clamp(12px, 2vw, 16px) clamp(18px, 3vw, 26px);
  border-radius: 999px;
  border: none;
  font-weight: 800;
  font-size: clamp(15px, 2vw, 17px);
  cursor: pointer;
  min-width: 150px;
  color: #0f172a;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2);
  transition: transform 0.12s ease, box-shadow 0.2s ease;
}

.tof-btn:hover {
  transform: translateY(-1px);
}

.tof-btn:active {
  transform: translateY(0);
}

.tof-btn-true {
  background: linear-gradient(120deg, #22c55e, #16a34a);
}

.tof-btn-false {
  background: linear-gradient(120deg, #fb7185, #ec4899);
}

.tof-result {
  display: grid;
  gap: 10px;
  justify-items: center;
}

.tof-answer {
  font-weight: 700;
  color: #cbd5e1;
  text-align: center;
}

.tof-true {
  color: #22c55e;
  margin-left: 6px;
}

.tof-false {
  color: #fb7185;
  margin-left: 6px;
}

.tof-expl {
  margin: 0;
  color: #94a3b8;
  max-width: 760px;
  text-align: center;
}

.tof-actions {
  display: grid;
  gap: 10px;
  justify-items: center;
}

.tof-next {
  padding: 14px 28px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(120deg, #38bdf8, #a855f7);
  color: #0b1220;
  font-weight: 800;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 14px 28px rgba(56, 189, 248, 0.25);
  transition: transform 0.12s ease, box-shadow 0.2s ease;
}

.tof-next:hover {
  transform: translateY(-2px);
}

.tof-next:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .tof-shell {
    align-items: flex-start;
    padding: 8px 14px 14px;
  }

  .tof-content {
    padding: 8px 12px 12px;
  }

  .tof-content:not(.tof-game) {
    margin-top: 0;
  }

  .tof-filters {
    justify-content: center;
  }

  .tof-shell h1 {
    font-size: clamp(30px, 9vw, 46px);
    line-height: 1.08;
  }

  .tof-sub {
    max-width: 90%;
    font-size: 15px;
  }

  .tof-card {
    margin-top: 0;
    min-height: 240px;
    padding: 18px 14px;
  }

  .tof-prompt {
    font-size: clamp(20px, 6vw, 26px);
    min-height: 120px;
  }

  .tof-btn {
    width: 100%;
  }
}
</style>
