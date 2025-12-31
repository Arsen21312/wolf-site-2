<template>
  <main class="beer-page">
    <header class="hero">
      <Breadcrumbs class="center" :items="breadcrumbs" />
      <h1>Генератор пива</h1>
      <p class="lead">
        Сегодняшний выбор пива без споров: один клик, короткая справка, температура, закуска и волчий вердикт.
      </p>
    </header>

    <section class="generator-card">
      <div class="controls">
        <div class="filters">
          <p class="block-title">Фильтры</p>
          <div class="filter-grid">
            <label v-for="tag in tagOptions" :key="tag.id" class="filter-chip">
              <input
                type="checkbox"
                :value="tag.id"
                :checked="tag.id === 'any' ? anySelected : selectedTags.includes(tag.id)"
                @change="toggleTag(tag.id)"
              />
              <span>{{ tag.label }}</span>
            </label>
          </div>
        </div>

        <div class="mode-card">
          <p class="block-title">Режим вечера</p>
          <div class="mode-toggle">
            <button
              type="button"
              class="mode-btn"
              :class="{ active: mode === 'quiet' }"
              @click="setMode('quiet')"
            >
              Тихий вечер
            </button>
            <button
              type="button"
              class="mode-btn"
              :class="{ active: mode === 'party' }"
              @click="setMode('party')"
            >
              Шумная тусовка
            </button>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn primary" type="button" @click="generateResult">
          {{ result ? 'Ещё раз' : 'Сгенерировать' }}
        </button>
        <button class="btn ghost" type="button" :disabled="!result" @click="copyResult">
          {{ copyLabel }}
        </button>
        <button class="btn ghost" type="button" :disabled="!result" @click="shareResult">
          {{ shareLabel }}
        </button>
        <button class="btn ghost" type="button" :disabled="!result" @click="copyLink">
          {{ linkLabel }}
        </button>
      </div>

      <transition name="fade-slide">
        <div v-if="result" key="result" class="result-card">
          <div class="result-head">
            <h2>{{ result.title }}</h2>
            <span class="seed">seed: {{ seed }}</span>
          </div>
          <p class="result-desc">{{ result.description }}</p>
          <div class="result-grid">
            <div class="result-item">
              <span class="label">Температура</span>
              <span>{{ result.temp }}</span>
            </div>
            <div class="result-item">
              <span class="label">Закуска</span>
              <span>{{ snackLine }}</span>
            </div>
            <div class="result-item">
              <span class="label">Категории</span>
              <span>{{ resultTags }}</span>
            </div>
          </div>
          <div class="wolf-line">🐺 {{ wolfLine }}</div>
        </div>
      </transition>

      <div v-if="!result" class="empty-state">
        <p>Выберите фильтры или оставьте «Любое» и нажмите «Сгенерировать».</p>
      </div>
    </section>

    <section class="about-card">
      <h2>Что это за генератор</h2>
      <p>
        Это мемная волчья рулетка: один стиль пива, одна подсказка, один короткий вердикт. Никаких сложных
        дегустаций, только быстрый выбор и повод открыть бутылку с чувством миссии.
      </p>
    </section>

    <section class="seo-card">
      <h2>Какое пиво выбрать сегодня</h2>
      <p>
        Генератор пива подстраивается под настроение: тихий вечер просит мягких сочетаний, а шумная тусовка —
        более смелых. С фильтрами по стилям вы можете быстро сузить выбор и получить честную подсказку.
      </p>

      <h2>Стили пива, коротко и по делу</h2>
      <p>
        В наборе есть лёгкие лагеры и пшеничные, плотные стауты, хмелевые IPA, фруктовые сауэры и безалкогольные
        варианты. Рандом не даёт зациклиться и напоминает о стилях, которые обычно пропускаются.
      </p>

      <h2>С чем пить пиво, быстрые сочетания</h2>
      <p>
        Светлые стили хорошо идут с нежными закусками, тёмные — с копчёным и карамельным, фруктовые — с сыром и
        ягодами, а горькие любят острые снеки. Режим вечера подскажет, где прибавить уюта или драйва.
      </p>
    </section>

    <section class="faq-card">
      <h2>FAQ</h2>
      <div class="faq-list">
        <div v-for="(item, idx) in faqItems" :key="item.q" class="faq-item" :class="{ open: openFaq === idx }">
          <button class="faq-toggle" type="button" @click="toggleFaq(idx)">
            <span>{{ item.q }}</span>
            <span class="icon">{{ openFaq === idx ? '-' : '+' }}</span>
          </button>
          <div class="faq-body">
            <p>{{ item.a }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useHead, useRequestURL, useRoute, useRouter, useSeoMeta } from '#imports'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'

type Mode = 'quiet' | 'party'
type Tag = 'light' | 'dark' | 'bitter' | 'fruity' | 'na' | 'any'

type BeerItem = {
  id: string
  title: string
  tags: Tag[]
  description: string
  temp: string
  snack: string
  wolfLineQuiet: string
  wolfLineParty: string
}

const breadcrumbs = [
  { label: 'Главная', to: '/' },
  { label: 'Инструменты', to: '/decisions' },
  { label: 'Генератор пива' }
]

const tagOptions: Array<{ id: Tag; label: string }> = [
  { id: 'light', label: 'Лёгкое' },
  { id: 'dark', label: 'Тёмное' },
  { id: 'bitter', label: 'Горькое' },
  { id: 'fruity', label: 'Фруктовое' },
  { id: 'na', label: 'Безалкогольное' },
  { id: 'any', label: 'Любое' }
]

const BEER_STYLES: BeerItem[] = [
  {
    id: 'pilsner',
    title: 'Pilsner',
    tags: ['light', 'any'],
    description: 'Чистый, сухой и бодрый лагер с травянистым хмелем.',
    temp: '4–6 °C',
    snack: 'солёные орешки или мягкий сыр',
    wolfLineQuiet: 'Лёгкий хруст и тишина — идеальная пара.',
    wolfLineParty: 'Хмель бодрит, волк готов к танцам.'
  },
  {
    id: 'lager',
    title: 'Lager',
    tags: ['light', 'any'],
    description: 'Классика на каждый день: ровный вкус без сюрпризов.',
    temp: '4–7 °C',
    snack: 'чипсы или крендельки',
    wolfLineQuiet: 'Спокойный фон для вечера без суеты.',
    wolfLineParty: 'Легко идёт, легко повторяется.'
  },
  {
    id: 'helles',
    title: 'Helles',
    tags: ['light', 'any'],
    description: 'Мягкий мюнхенский лагер с хлебной сладостью.',
    temp: '5–7 °C',
    snack: 'братвурст или копчёный сыр',
    wolfLineQuiet: 'Уютный хлебный тон — волк расслаблен.',
    wolfLineParty: 'Сытно и дружелюбно для большой компании.'
  },
  {
    id: 'kolsch',
    title: 'Kölsch',
    tags: ['light', 'any'],
    description: 'Лёгкий эль с чистым финишем и лёгкой фруктовостью.',
    temp: '6–8 °C',
    snack: 'рыбные снеки или крекеры',
    wolfLineQuiet: 'Тонко и деликатно, без громких нот.',
    wolfLineParty: 'Легкий стиль, чтобы не сбавлять темп.'
  },
  {
    id: 'wheat',
    title: 'Wheat',
    tags: ['light', 'fruity', 'any'],
    description: 'Пшеничное с бананом и гвоздикой, как отпуск в стакане.',
    temp: '6–8 °C',
    snack: 'брецель или белый сыр',
    wolfLineQuiet: 'Пара глотков — и вечер добрее.',
    wolfLineParty: 'Лёгкая фруктовость держит настроение.'
  },
  {
    id: 'ipa',
    title: 'IPA',
    tags: ['bitter', 'any'],
    description: 'Хмелевая классика с яркой горчинкой и цитрусом.',
    temp: '7–10 °C',
    snack: 'острые крылья или чили-орешки',
    wolfLineQuiet: 'Смело, но в меру — волк доволен.',
    wolfLineParty: 'Горечь заряжает, тусовка ревёт.'
  },
  {
    id: 'neipa',
    title: 'NEIPA',
    tags: ['bitter', 'fruity', 'any'],
    description: 'Сочная, мутная, как фруктовый сок с хмелем.',
    temp: '7–9 °C',
    snack: 'тако или лаймовые чипсы',
    wolfLineQuiet: 'Сок и хмель — тихий кайф.',
    wolfLineParty: 'Сочная туча — и настроение вверх.'
  },
  {
    id: 'apa',
    title: 'APA',
    tags: ['bitter', 'any'],
    description: 'Баланс солода и цитрусового хмеля без перегиба.',
    temp: '6–9 °C',
    snack: 'бургер или картофельные дольки',
    wolfLineQuiet: 'Ровная горечь, ровный вечер.',
    wolfLineParty: 'Горечь разгоняет разговоры.'
  },
  {
    id: 'porter',
    title: 'Porter',
    tags: ['dark', 'any'],
    description: 'Шоколад, кофе и мягкая сладость тёмного эля.',
    temp: '10–13 °C',
    snack: 'копчёная колбаса или шоколад',
    wolfLineQuiet: 'Тёмный уют, волк за камерные беседы.',
    wolfLineParty: 'Плотно и громко, как бас.'
  },
  {
    id: 'stout',
    title: 'Stout',
    tags: ['dark', 'any'],
    description: 'Плотное, жжёное, для тех, кто любит характер.',
    temp: '10–12 °C',
    snack: 'устрицы или солёный сыр',
    wolfLineQuiet: 'Чёрный бархат и тишина.',
    wolfLineParty: 'Стаут задаёт серьёзный ритм.'
  },
  {
    id: 'milk-stout',
    title: 'Milk Stout',
    tags: ['dark', 'any'],
    description: 'Сладкий стаут с лактозой и какао.',
    temp: '10–12 °C',
    snack: 'печенье или ванильный десерт',
    wolfLineQuiet: 'Сладко и мягко, как плед.',
    wolfLineParty: 'Десертный вайб для тусовки.'
  },
  {
    id: 'brown-ale',
    title: 'Brown Ale',
    tags: ['dark', 'any'],
    description: 'Ореховый, карамельный, с лёгкой горчинкой.',
    temp: '10–12 °C',
    snack: 'грецкие орехи или сыр гауда',
    wolfLineQuiet: 'Тёплый ореховый вечер.',
    wolfLineParty: 'Карамель держит уют даже на шуме.'
  },
  {
    id: 'amber-ale',
    title: 'Amber Ale',
    tags: ['bitter', 'any'],
    description: 'Солодовая карамель с ровной хмелевой линией.',
    temp: '8–10 °C',
    snack: 'гриль-курица или пряные крекеры',
    wolfLineQuiet: 'Карамель согревает, волк улыбается.',
    wolfLineParty: 'Сбалансировано для больших столов.'
  },
  {
    id: 'sibirskaia-korona',
    title: 'Сибирская Корона',
    tags: ['light', 'any'],
    description: 'Классический лагер с чистым вкусом без лишнего шума.',
    temp: '4–7 °C',
    snack: 'вяленая рыба или сухарики',
    wolfLineQuiet: 'Спокойный лагер для тихого вечера.',
    wolfLineParty: 'Проверенная классика для компании.'
  },
  {
    id: 'belgian-blonde',
    title: 'Belgian Blonde',
    tags: ['light', 'any'],
    description: 'Мягкий бельгийский эль с медовыми нотами.',
    temp: '7–9 °C',
    snack: 'сыр бри или куриные наггетсы',
    wolfLineQuiet: 'Медово и спокойно.',
    wolfLineParty: 'Тёплое золото для друзей.'
  },
  {
    id: 'okhota-krepkoye',
    title: 'Охота Крепкое',
    tags: ['dark', 'bitter', 'any'],
    description: 'Крепкий лагер с насыщенным вкусом.',
    temp: '6–8 °C',
    snack: 'жареное мясо или острые снеки',
    wolfLineQuiet: 'Серьёзный выбор — волк держит паузу.',
    wolfLineParty: 'Громко, плотно, по делу.'
  },
  {
    id: 'ochakovo',
    title: 'Очаково',
    tags: ['light', 'any'],
    description: 'Простой лагер, который легко пить в любой компании.',
    temp: '4–6 °C',
    snack: 'чипсы или солёные орешки',
    wolfLineQuiet: 'Ровный вкус для спокойного вечера.',
    wolfLineParty: 'Надёжно и без лишних споров.'
  },
  {
    id: 'tolstyak',
    title: 'Толстяк',
    tags: ['light', 'any'],
    description: 'Народный лагер без лишней драматургии.',
    temp: '4–6 °C',
    snack: 'сухарики или колбаски',
    wolfLineQuiet: 'Просто и понятно — волк кивает.',
    wolfLineParty: 'Легко заходит в любой компании.'
  },
  {
    id: 'zhatecky-gus',
    title: 'Zatecky Gus',
    tags: ['light', 'any'],
    description: 'Светлый лагер с чешскими мотивами.',
    temp: '4–6 °C',
    snack: 'сырные палочки или крендельки',
    wolfLineQuiet: 'Мягкий вкус для спокойного настроя.',
    wolfLineParty: 'Лёгкая классика для шумных встреч.'
  },
  {
    id: 'staryi-melnik',
    title: 'Старый Мельник',
    tags: ['light', 'any'],
    description: 'Лёгкий лагер с привычным профилем.',
    temp: '4–6 °C',
    snack: 'орешки или снеки',
    wolfLineQuiet: 'Спокойный вариант на вечер.',
    wolfLineParty: 'Проверенная база для тусовки.'
  },
  {
    id: 'arsenalnoe',
    title: 'Арсенальное',
    tags: ['light', 'any'],
    description: 'Классический лагер без лишних украшений.',
    temp: '4–6 °C',
    snack: 'чипсы или гренки',
    wolfLineQuiet: 'Надёжно и без суеты.',
    wolfLineParty: 'Прямой выбор, без философии.'
  },
  {
    id: 'hoegaarden',
    title: 'Hoegaarden',
    tags: ['light', 'fruity', 'any'],
    description: 'Пшеничное с цитрусом и пряностями.',
    temp: '6–8 °C',
    snack: 'сыр или фруктовые снеки',
    wolfLineQuiet: 'Мягко и ароматно — вечер удался.',
    wolfLineParty: 'Лёгкая пряность держит настрой.'
  },
  {
    id: 'kozel',
    title: 'Kozel',
    tags: ['dark', 'any'],
    description: 'Тёмный лагер с мягкой карамелью.',
    temp: '7–9 °C',
    snack: 'копчёный сыр или колбаски',
    wolfLineQuiet: 'Карамельный уют без спешки.',
    wolfLineParty: 'Тёмный стиль для громких историй.'
  },
  {
    id: 'zhatecky-gus-na',
    title: 'Жатецкий Гусь Безалкогольное',
    tags: ['light', 'na', 'any'],
    description: 'Лёгкий безалкогольный лагер с мягким профилем.',
    temp: '4–6 °C',
    snack: 'орешки или крекеры',
    wolfLineQuiet: 'Ноль градусов, максимум спокойствия.',
    wolfLineParty: 'Трезво, но бодро.'
  },
  {
    id: 'efes',
    title: 'Efes',
    tags: ['light', 'any'],
    description: 'Лёгкий лагер с мягкой горчинкой.',
    temp: '4–6 °C',
    snack: 'пицца или крылышки',
    wolfLineQuiet: 'Ровный вариант без сюрпризов.',
    wolfLineParty: 'Понятный выбор для друзей.'
  },
  {
    id: 'amstel',
    title: 'Amstel',
    tags: ['light', 'any'],
    description: 'Классический лагер с чистым вкусом.',
    temp: '4–6 °C',
    snack: 'картофель фри или сырные палочки',
    wolfLineQuiet: 'Спокойно и ровно.',
    wolfLineParty: 'Легко поддерживает атмосферу.'
  },
  {
    id: 'kronenbourg-1664',
    title: 'Kronenbourg 1664',
    tags: ['light', 'any'],
    description: 'Лёгкий лагер с чуть более сухим финишем.',
    temp: '4–6 °C',
    snack: 'сырные шарики или крекеры',
    wolfLineQuiet: 'Лаконично и спокойно.',
    wolfLineParty: 'Чистый вкус для шумной компании.'
  },
  {
    id: 'stella-artois',
    title: 'Stella Artois',
    tags: ['light', 'any'],
    description: 'Классический лагер с мягкой горчинкой.',
    temp: '4–6 °C',
    snack: 'креветки или чипсы',
    wolfLineQuiet: 'Мягко и уверенно.',
    wolfLineParty: 'Чёткий выбор для дружеского стола.'
  },
  {
    id: 'heineken',
    title: 'Heineken',
    tags: ['light', 'any'],
    description: 'Международный лагер с лёгкой травяной горчинкой.',
    temp: '4–6 °C',
    snack: 'начос или бургер',
    wolfLineQuiet: 'Спокойный лагер без сюрпризов.',
    wolfLineParty: 'Проверенная классика для тусовки.'
  },
  {
    id: 'prazdroj',
    title: 'Pilsner Urquell',
    tags: ['light', 'bitter', 'any'],
    description: 'Пилснер с выразительной хмелевой горчинкой.',
    temp: '5–7 °C',
    snack: 'колбаски или солёные крендельки',
    wolfLineQuiet: 'Чёткая горечь, чёткий вечер.',
    wolfLineParty: 'Хмель держит темп.'
  },
  {
    id: 'dubbel',
    title: 'Dubbel',
    tags: ['dark', 'any'],
    description: 'Сухофрукты, карамель и бельгийская дрожжевая магия.',
    temp: '10–12 °C',
    snack: 'тёмный шоколад или сухофрукты',
    wolfLineQuiet: 'Сладкий дымок — волк доволен.',
    wolfLineParty: 'Глубокий вкус для длинных тостов.'
  },
  {
    id: 'tripel',
    title: 'Tripel',
    tags: ['light', 'bitter', 'any'],
    description: 'Крепкий бельгийский эль со специями и сухостью.',
    temp: '9–12 °C',
    snack: 'сыр с плесенью или мидии',
    wolfLineQuiet: 'Крепко, но благородно.',
    wolfLineParty: 'Мощно, чтобы не терять темп.'
  },
  {
    id: 'gose',
    title: 'Gose',
    tags: ['light', 'fruity', 'any'],
    description: 'Солоновато-кислый стиль с кориандром.',
    temp: '6–8 °C',
    snack: 'креветки или солёные крекеры',
    wolfLineQuiet: 'Кислинка бодрит, но не шумит.',
    wolfLineParty: 'Соль и лайм — идеальная движуха.'
  },
  {
    id: 'sour',
    title: 'Sour',
    tags: ['fruity', 'any'],
    description: 'Яркая кислинка и лёгкое тело.',
    temp: '6–8 °C',
    snack: 'ягоды или сливочный сыр',
    wolfLineQuiet: 'Кисло, но по-домашнему.',
    wolfLineParty: 'Кислинка заводит компанию.'
  },
  {
    id: 'fruit-sour',
    title: 'Fruit Sour',
    tags: ['fruity', 'any'],
    description: 'Фруктовый сауэр, как лимонад для взрослых.',
    temp: '5–7 °C',
    snack: 'фруктовая тарелка или чизкейк',
    wolfLineQuiet: 'Лёгкий десертный настрой.',
    wolfLineParty: 'Сочный стиль для быстрых тостов.'
  },
  {
    id: 'hoppy-lager',
    title: 'Hoppy Lager',
    tags: ['light', 'bitter', 'any'],
    description: 'Лагер с акцентом на хмель и свежий аромат.',
    temp: '5–7 °C',
    snack: 'солёные палочки или начос',
    wolfLineQuiet: 'Лагер, но с характером.',
    wolfLineParty: 'Хмель толкает к танцам.'
  },
  {
    id: 'zhigulevskoe',
    title: 'Жигулевское',
    tags: ['light', 'any'],
    description: 'Ностальгический лагер без лишних выкрутасов.',
    temp: '4–7 °C',
    snack: 'гренки или солёные семечки',
    wolfLineQuiet: 'Классика, которая не требует лишних слов.',
    wolfLineParty: 'Просто и по-народному — шуметь можно.'
  },
  {
    id: 'baltika-7',
    title: 'Балтика 7',
    tags: ['light', 'any'],
    description: 'Лёгкий лагер с привычным чистым профилем.',
    temp: '4–6 °C',
    snack: 'чипсы или сыр косичка',
    wolfLineQuiet: 'Лёгко пьётся — тихий режим соблюдён.',
    wolfLineParty: 'Стабильный выбор для компании.'
  },
  {
    id: 'baltika-9',
    title: 'Балтика 9',
    tags: ['dark', 'bitter', 'any'],
    description: 'Крепкий лагер с более плотным вкусом.',
    temp: '6–8 °C',
    snack: 'копчёная колбаса или острые снеки',
    wolfLineQuiet: 'Крепко, но аккуратно — волк следит.',
    wolfLineParty: 'Сильный стиль для громких тостов.'
  },
  {
    id: 'bud',
    title: 'Bud',
    tags: ['light', 'any'],
    description: 'Классический международный лагер без сюрпризов.',
    temp: '4–6 °C',
    snack: 'крылышки или картофель фри',
    wolfLineQuiet: 'Ровный фон для спокойного вечера.',
    wolfLineParty: 'Проверенный выбор на тусовке.'
  },
  {
    id: 'tuborg-green',
    title: 'Tuborg Green',
    tags: ['light', 'any'],
    description: 'Светлый лагер с мягкой горчинкой и свежестью.',
    temp: '4–6 °C',
    snack: 'начос или солёные орешки',
    wolfLineQuiet: 'Свежо и спокойно.',
    wolfLineParty: 'Лёгкий стиль держит темп.'
  },
  {
    id: 'klinskoe',
    title: 'Клинское',
    tags: ['light', 'any'],
    description: 'Простой лагер для тех, кто любит классику.',
    temp: '4–6 °C',
    snack: 'сухарики или солёная рыбка',
    wolfLineQuiet: 'Без выдумок, зато честно.',
    wolfLineParty: 'Классика для большой компании.'
  },
  {
    id: 'dry-stout',
    title: 'Dry Stout',
    tags: ['dark', 'bitter', 'any'],
    description: 'Сухой стаут с кофейной горчинкой.',
    temp: '10–12 °C',
    snack: 'устрицы или говядина',
    wolfLineQuiet: 'Сухо и строго, как волчий взгляд.',
    wolfLineParty: 'Чёткий вкус для громких тостов.'
  },
  {
    id: 'vienna-lager',
    title: 'Vienna Lager',
    tags: ['light', 'any'],
    description: 'Мягкий солодовый лагер с янтарным оттенком.',
    temp: '6–8 °C',
    snack: 'ветчина или мягкий сыр',
    wolfLineQuiet: 'Лёгкий янтарный уют.',
    wolfLineParty: 'Дружелюбный стиль на большой стол.'
  },
  {
    id: 'schwarzbier',
    title: 'Schwarzbier',
    tags: ['dark', 'any'],
    description: 'Тёмный лагер с мягким шоколадным профилем.',
    temp: '7–9 °C',
    snack: 'копчёности или ржаные гренки',
    wolfLineQuiet: 'Тёмно, но мягко.',
    wolfLineParty: 'Чёрный лагер держит строй.'
  },
  {
    id: 'barleywine',
    title: 'Barleywine',
    tags: ['dark', 'bitter', 'any'],
    description: 'Крепкий, густой эль для медленных разговоров.',
    temp: '12–14 °C',
    snack: 'твёрдый сыр или карамель',
    wolfLineQuiet: 'Медленный стиль для долгого вечера.',
    wolfLineParty: 'Сильный характер для сильной компании.'
  },
  {
    id: 'radler',
    title: 'Radler',
    tags: ['light', 'fruity', 'any'],
    description: 'Пивной микс с лимонадом — прохладно и легко.',
    temp: '4–6 °C',
    snack: 'цитрусовые снеки или салат',
    wolfLineQuiet: 'Лёгкий микс для спокойствия.',
    wolfLineParty: 'Лимонный заряд для вечеринки.'
  },
  {
    id: 'na-lager',
    title: 'Non-alcoholic Lager',
    tags: ['light', 'na', 'any'],
    description: 'Безалкогольный лагер с классическим профилем.',
    temp: '4–7 °C',
    snack: 'овощные чипсы или орехи',
    wolfLineQuiet: 'Трезво и уверенно.',
    wolfLineParty: 'Ноль градусов — ноль проблем.'
  },
  {
    id: 'na-ipa',
    title: 'Non-alcoholic IPA',
    tags: ['bitter', 'na', 'any'],
    description: 'Хмель остаётся, градус уходит.',
    temp: '6–8 °C',
    snack: 'чили-орешки или фалафель',
    wolfLineQuiet: 'Хмельный, но спокойный.',
    wolfLineParty: 'Горечь с нулём — тусовка рада.'
  },
  {
    id: 'pale-ale',
    title: 'Pale Ale',
    tags: ['bitter', 'any'],
    description: 'Классический эль с фруктовым хмелем.',
    temp: '7–10 °C',
    snack: 'куриные крылышки или пицца',
    wolfLineQuiet: 'Мягкая горечь для ровного вечера.',
    wolfLineParty: 'Пале эль держит темп разговора.'
  },
  {
    id: 'cream-ale',
    title: 'Cream Ale',
    tags: ['light', 'any'],
    description: 'Лёгкое тело и мягкая сладость, пьётся гладко.',
    temp: '5–7 °C',
    snack: 'печёный картофель или кукурузные чипсы',
    wolfLineQuiet: 'Гладко и нежно, как вечерний ветер.',
    wolfLineParty: 'Легко повторить, пока музыка не стихла.'
  }
]

const mode = ref<Mode>('quiet')
const selectedTags = ref<Tag[]>([])
const result = ref<BeerItem | null>(null)
const seed = ref('')
const copyLabel = ref('Скопировать')
const shareLabel = ref('Поделиться ссылкой')
const linkLabel = ref('Копировать ссылку')
const openFaq = ref<number | null>(null)

const route = useRoute()
const router = useRouter()

const activeTags = computed<Tag[]>(() => {
  if (!selectedTags.value.length) return ['any']
  return selectedTags.value
})

const anySelected = computed(() => !selectedTags.value.length || selectedTags.value.includes('any'))

const filteredStyles = computed(() => {
  if (activeTags.value.includes('any')) return BEER_STYLES
  return BEER_STYLES.filter((item) => item.tags.some((tag) => activeTags.value.includes(tag)))
})

const wolfLine = computed(() => {
  if (!result.value) return ''
  return mode.value === 'quiet' ? result.value.wolfLineQuiet : result.value.wolfLineParty
})

const snackLine = computed(() => {
  if (!result.value) return ''
  return mode.value === 'quiet'
    ? `${result.value.snack} — без спешки.`
    : `${result.value.snack} — погромче и поострее.`
})

const resultTags = computed(() => {
  if (!result.value) return ''
  const labels = tagOptions
    .filter((tag) => result.value?.tags.includes(tag.id) && tag.id !== 'any')
    .map((tag) => tag.label)
  return labels.join(', ')
})

function setMode(nextMode: Mode) {
  mode.value = nextMode
  if (result.value) updateQuery()
}

function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? null : idx
}

function toggleTag(tag: Tag) {
  if (tag === 'any') {
    selectedTags.value = ['any']
    return
  }
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((item) => item !== tag)
  } else {
    selectedTags.value = selectedTags.value.filter((item) => item !== 'any')
    selectedTags.value = [...selectedTags.value, tag]
  }
  if (result.value) updateQuery()
}

function generateSeed() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const length = 6
  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const values = new Uint32Array(length)
    crypto.getRandomValues(values)
    return Array.from(values)
      .map((value) => chars[value % chars.length])
      .join('')
  }
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function hashSeed(value: string) {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seedValue: number) {
  let seedNum = seedValue
  return () => {
    seedNum += 0x6d2b79f5
    let t = seedNum
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickFromSeed(seedValue: string, list: BeerItem[]) {
  if (!list.length) return null
  const rand = mulberry32(hashSeed(seedValue))
  const index = Math.floor(rand() * list.length)
  return list[index] ?? null
}

function buildQuery(nextSeed: string) {
  const tags = activeTags.value.includes('any')
    ? undefined
    : activeTags.value.filter((tag) => tag !== 'any').join(',')
  const query: Record<string, string> = {
    seed: nextSeed,
    mode: mode.value
  }
  if (tags) query.tags = tags
  return query
}

function updateQuery() {
  if (!seed.value) return
  router.replace({ query: buildQuery(seed.value) }).catch(() => {})
}

function generateResult() {
  const nextSeed = generateSeed()
  seed.value = nextSeed
  const choice = pickFromSeed(nextSeed, filteredStyles.value)
  result.value = choice
  updateQuery()
}

function restoreResultFromSeed(seedValue: string) {
  if (!seedValue) return
  seed.value = seedValue
  const choice = pickFromSeed(seedValue, filteredStyles.value)
  result.value = choice
  updateQuery()
}

async function copyText(value: string, labelRef: typeof copyLabel, fallback: string) {
  if (!value || typeof navigator === 'undefined' || !navigator.clipboard) return
  try {
    await navigator.clipboard.writeText(value)
    labelRef.value = 'Скопировано'
  } catch (error) {
    labelRef.value = fallback
  }
  setTimeout(() => {
    labelRef.value = fallback
  }, 2000)
}

function buildResultText() {
  if (!result.value) return ''
  return [
    `Сегодня: ${result.value.title}`,
    result.value.description,
    `Температура: ${result.value.temp}`,
    `Закуска: ${snackLine.value}`,
    `Волчий вердикт: ${wolfLine.value}`
  ].join('\n')
}

const requestUrl = useRequestURL()
const canonicalUrl = computed(() => `${requestUrl.origin}/decisions/beer`)
const metaDescription =
  'Генератор пива, подскажет какое пиво сегодня выбрать. Фильтры по стилю, закуска, температура, волчий вердикт. Можно поделиться ссылкой'

const faqItems = [
  {
    q: 'Как работает генератор?',
    a: 'Вы выбираете фильтры и режим вечера, генератор случайно подбирает стиль и даёт короткую рекомендацию.'
  },
  {
    q: 'Можно ли выбрать безалкогольное?',
    a: 'Да, включите фильтр «Безалкогольное» — выбор будет только из 0.0% вариантов.'
  },
  {
    q: 'Почему выпадает одно и то же?',
    a: 'Результат привязан к seed. При одинаковых параметрах выдача будет одинаковой.'
  },
  {
    q: 'Как поделиться результатом?',
    a: 'Нажмите «Поделиться ссылкой» или «Копировать ссылку». В URL сохранится seed и режим.'
  },
  {
    q: 'Какие стили тут есть?',
    a: 'От пилснера до барливайна: лагеры, эли, IPA, стауты, кислые и безалкогольные.'
  },
  {
    q: 'Что выбрать новичку?',
    a: 'Попробуйте фильтр «Лёгкое» или «Любое», чтобы начать с мягких стилей.'
  },
  {
    q: 'Как выбрать закуску?',
    a: 'Рекомендация в карточке учитывает режим вечера: спокойный или шумный.'
  }
]

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a
        }
      }))
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: `${requestUrl.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Инструменты', item: `${requestUrl.origin}/decisions` },
        { '@type': 'ListItem', position: 3, name: 'Генератор пива', item: canonicalUrl.value }
      ]
    }
  ]
}))

useSeoMeta(() => ({
  title: 'Генератор пива | Neural Wise Wolf',
  description: metaDescription,
  ogTitle: 'Генератор пива | Neural Wise Wolf',
  ogDescription: metaDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
}))

useHead(() => ({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(structuredData.value)
    }
  ]
}))

const STORAGE_KEYS = {
  tags: 'beer:tags',
  mode: 'beer:mode',
  seed: 'beer:seed',
  result: 'beer:result'
}

const storageReady = ref(false)

const VALID_TAGS = new Set<Tag>(['light', 'dark', 'bitter', 'fruity', 'na', 'any'])

function parseTagQuery(value: string | string[] | undefined) {
  if (!value) return []
  const raw = Array.isArray(value) ? value.join(',') : value
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => VALID_TAGS.has(tag as Tag)) as Tag[]
}

function normalizeTags(tags: Tag[]) {
  const unique = Array.from(new Set(tags))
  if (unique.includes('any')) return ['any']
  return unique
}

function applyQuery() {
  const seedParam = typeof route.query.seed === 'string' ? route.query.seed : ''
  const modeParam = route.query.mode === 'party' ? 'party' : route.query.mode === 'quiet' ? 'quiet' : null
  const tagsParam = parseTagQuery(route.query.tags)

  if (modeParam) mode.value = modeParam
  if (tagsParam.length) {
    selectedTags.value = normalizeTags(tagsParam)
  } else if (seedParam && typeof route.query.tags === 'undefined') {
    selectedTags.value = []
  }

  if (seedParam) {
    restoreResultFromSeed(seedParam)
  }
}

function applyStorage() {
  if (typeof localStorage === 'undefined') return
  const storedTags = localStorage.getItem(STORAGE_KEYS.tags)
  const storedMode = localStorage.getItem(STORAGE_KEYS.mode)
  const storedSeed = localStorage.getItem(STORAGE_KEYS.seed)
  const storedResult = localStorage.getItem(STORAGE_KEYS.result)

  if (storedTags) {
    try {
      const parsed = JSON.parse(storedTags) as Tag[]
      selectedTags.value = normalizeTags(parsed)
    } catch (error) {
      // ignore invalid storage
    }
  }
  if (storedMode === 'quiet' || storedMode === 'party') {
    mode.value = storedMode
  }
  if (storedSeed) seed.value = storedSeed

  if (storedResult) {
    try {
      const parsed = JSON.parse(storedResult) as { id?: string }
      const found = BEER_STYLES.find((item) => item.id === parsed.id)
      if (found) {
        result.value = found
      }
    } catch (error) {
      // ignore invalid storage
    }
  }

  if (!result.value && seed.value) {
    restoreResultFromSeed(seed.value)
  }
}

async function copyResult() {
  await copyText(buildResultText(), copyLabel, 'Скопировать')
}

async function copyLink() {
  const url = shareUrl.value
  await copyText(url, linkLabel, 'Копировать ссылку')
}

async function shareResult() {
  if (!result.value) {
    generateResult()
  }
  const url = shareUrl.value
  if (typeof navigator === 'undefined') return
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Генератор пива',
        text: buildResultText(),
        url
      })
      shareLabel.value = 'Ссылка отправлена'
      setTimeout(() => {
        shareLabel.value = 'Поделиться ссылкой'
      }, 2000)
      return
    } catch (error) {
      // fallback to copy
    }
  }
  await copyText(url, shareLabel, 'Поделиться ссылкой')
}

const shareUrl = computed(() => {
  if (!seed.value) return canonicalUrl.value
  const query = buildQuery(seed.value)
  const params = new URLSearchParams(query)
  return `${canonicalUrl.value}?${params.toString()}`
})

onMounted(() => {
  storageReady.value = true
  applyStorage()
  applyQuery()
})

watch([selectedTags, mode, seed, result], () => {
  if (!storageReady.value || typeof localStorage === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.tags, JSON.stringify(selectedTags.value))
  localStorage.setItem(STORAGE_KEYS.mode, mode.value)
  localStorage.setItem(STORAGE_KEYS.seed, seed.value)
  localStorage.setItem(STORAGE_KEYS.result, JSON.stringify({ id: result.value?.id }))
})
</script>

<style scoped>
.beer-page {
  display: grid;
  gap: clamp(22px, 3vw, 38px);
  width: min(1180px, 100% - clamp(24px, 6vw, 64px));
  margin: 0 auto;
  padding: clamp(18px, 3vw, 30px) 0 clamp(36px, 4vw, 64px);
  color: #e2e8f0;
}

.hero {
  text-align: center;
  display: grid;
  gap: 10px;
  justify-items: center;
}

.hero h1 {
  margin: 0;
  font-size: clamp(34px, 6vw, 52px);
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-weight: 800;
}

.hero .lead {
  margin: 0;
  max-width: 760px;
  color: #cbd5e1;
  font-size: 16px;
}

.generator-card,
.about-card,
.seo-card,
.faq-card {
  background: linear-gradient(150deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.5));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  padding: clamp(18px, 2.6vw, 28px);
  display: grid;
  gap: 18px;
  position: relative;
  overflow: hidden;
}

.generator-card::after {
  content: '';
  position: absolute;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.18), transparent 60%);
  right: -90px;
  top: -90px;
  pointer-events: none;
}

.controls {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.block-title {
  margin: 0 0 10px;
  color: #cbd5e1;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.filters,
.mode-card {
  background: rgba(15, 23, 42, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  padding: 16px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(2, 6, 23, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #e2e8f0;
}

.filter-chip input {
  accent-color: #fbbf24;
}

.mode-toggle {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mode-btn {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #e2e8f0;
  padding: 10px 14px;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.mode-btn.active {
  background: linear-gradient(130deg, rgba(251, 191, 36, 0.9), rgba(251, 146, 60, 0.85));
  color: #0f172a;
  border: none;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #e2e8f0;
  padding: 12px 16px;
  cursor: pointer;
  font-weight: 700;
  transition: transform 0.12s ease, border-color 0.2s ease, background 0.2s ease;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: rgba(148, 163, 184, 0.6);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.btn.primary {
  background: linear-gradient(130deg, rgba(251, 191, 36, 0.9), rgba(251, 146, 60, 0.85));
  border: none;
  color: #0f172a;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.04);
}

.result-card {
  background: rgba(2, 6, 23, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 18px;
  display: grid;
  gap: 12px;
}

.result-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.result-head h2 {
  margin: 0;
  font-size: 26px;
}

.seed {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(251, 191, 36, 0.9);
}

.result-desc {
  margin: 0;
  color: #cbd5e1;
}

.result-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.result-item {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px;
  display: grid;
  gap: 4px;
  font-size: 14px;
}

.result-item .label {
  color: #94a3b8;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.wolf-line {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(251, 191, 36, 0.12);
  border: 1px solid rgba(251, 191, 36, 0.25);
  font-weight: 700;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
}

.about-card h2,
.seo-card h2,
.faq-card h2 {
  margin: 0 0 10px;
}

.about-card p,
.seo-card p,
.faq-card p {
  margin: 0 0 12px;
  color: #cbd5e1;
}

.faq-list {
  display: grid;
  gap: 14px;
}

.faq-item {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.faq-item.open {
  border-color: rgba(251, 191, 36, 0.35);
  background: rgba(255, 255, 255, 0.04);
}

.faq-toggle {
  width: 100%;
  border: none;
  background: transparent;
  color: #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  cursor: pointer;
  font-weight: 700;
  text-align: left;
}

.faq-toggle .icon {
  font-size: 18px;
}

.faq-body {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition: max-height 0.25s ease, opacity 0.25s ease;
  padding: 0 14px;
}

.faq-item.open .faq-body {
  max-height: 220px;
  opacity: 1;
  padding-bottom: 12px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (max-width: 720px) {
  .result-head h2 {
    font-size: 22px;
  }
}
</style>
