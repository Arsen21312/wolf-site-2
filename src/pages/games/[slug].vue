<template>
  <div class="game-page">
    <section class="game-hero">
      <div class="game-hero-inner">
        <component v-if="ViewComponent" :is="ViewComponent" class="game-host" />
        <div v-else class="card empty-state">
          <div class="tag">/games/{{ slug }}</div>
          <h3>Страница ещё не приручена</h3>
          <p class="muted">
            Мы пока не добавили игру для этого адреса. Вернись в общий список игр и выбери то, что уже готово.
          </p>
          <div class="cta-row" style="margin-top: 10px">
            <NuxtLink class="btn secondary" to="/games">К списку игр</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section v-if="isTruthOrDare" id="seo" class="seo-section">
      <div class="seo-card">
        <div class="seo-content seo-grid">
          <div class="seo-quick">
            <p class="seo-kicker">Правда или действие онлайн</p>
            <h2>Правда или действие онлайн, правила, идеи и режимы</h2>
            <p class="seo-lead">
              Короткий гид, который держит в тонусе: вопросы и задания уже собраны, выбираешь режим и жмёшь «Играть онлайн».
            </p>

            <div class="seo-block">
              <h3>Быстрый старт</h3>
              <ol class="seo-list quick-list">
                <li>Нажми «Играть онлайн».</li>
                <li>Выбери режим.</li>
                <li>Нажми «Правда», «Действие» или «Случайно».</li>
                <li>Держи границы, без унижений.</li>
                <li>Если застопорились, жми «Случайно».</li>
              </ol>
            </div>

            <div class="seo-block">
              <h3>Для кого</h3>
              <div class="seo-chips">
                <span class="seo-chip">Для компании</span>
                <span class="seo-chip">Для пары</span>
                <span class="seo-chip">Для знакомства</span>
              </div>
            </div>

            <div class="seo-block">
              <h3>Идеи режимов</h3>
              <ul class="seo-list mode-list">
                <li>Лайт — мягкие вопросы и задания.</li>
                <li>Дерзко — чуть больше смелости.</li>
                <li>Романтика — тёплые вопросы для двоих.</li>
                <li>Знакомство — чтобы узнать друг друга быстрее.</li>
                <li>Вечеринка — максимум хаоса и смеха.</li>
              </ul>
            </div>

            <div class="seo-media">
              <img
                src="/images/truth-or-dare/tod-wolf-party.png"
                alt="Мемный Волк и вечеринка: правда или действие"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                width="960"
                height="540"
              />
            </div>

            <div class="seo-block">
              <h3>Правила игры “Правда или действие”</h3>
              <p>
                Игроки по очереди выбирают «правду» или «действие». В «правде» отвечают честно, в «действии» выполняют задание.
                Один ход — один ответ или одно задание. Если выбор кажется сложным, включайте кнопку «Случайно».
              </p>
              <p>
                Главное правило — уважение. Игра не про давление, а про разговор и весёлые задания, которые остаются комфортными
                для всех участников.
              </p>
            </div>

            <div class="seo-block">
              <h3>Вопросы для друзей, пары и компании</h3>
              <p>
                Для друзей подходят темы про смешные истории, фобии и «а как бы ты поступил». Для пары — тёплые воспоминания,
                флирт и планы. Для большой компании — лёгкие вопросы, которые не заставляют человека оправдываться.
              </p>
              <p>
                Комбинируйте режимы: так вопросы не приедаются, а игра остаётся динамичной, даже если участвует десять человек.
              </p>
            </div>

            <div class="seo-media seo-media--right">
              <img
                src="/images/truth-or-dare/tod-wolf-campfire.png"
                alt="Волчий разговор у костра: вопросы для правды"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                width="960"
                height="540"
              />
            </div>

            <div class="seo-block">
              <h3>Как сделать игру интереснее, идеи и мини-правила</h3>
              <p>
                Дайте таймер на ответ, меняйте очередность или вводите «бонусный круг» каждые пять вопросов. Так темп не падает,
                а атмосфера остаётся живой.
              </p>
              <p>
                Добавляйте свои мини-правила: например, пропуск стоит смешного штрафа вроде «сказать комплимент слева».
              </p>
            </div>

            <div class="seo-block">
              <h3>Мягкие правила безопасности, чтобы не было кринжа</h3>
              <p>
                Договоритесь о стоп-темах заранее. Никаких унижений, давления, раскрытия чужих секретов или опасных заданий.
                Уважительное «нет» — всегда нормальный ответ.
              </p>
              <p>
                Если кто-то устал, переключайтесь на лёгкий режим или делайте паузы. Игра должна оставлять приятный след, а не
                неловкость.
              </p>
            </div>

            <div class="seo-media seo-media--wide">
              <img
                src="/images/truth-or-dare/tod-wolf-safe.png"
                alt="Мемный Волк про безопасную игру"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                width="960"
                height="540"
              />
            </div>

            <div class="seo-block">
              <h3>Версии игры: правда или напиток, правда или штраф</h3>
              <p>
                В некоторых компаниях играют в мягкие варианты: «правда или напиток» или «правда или штраф». Это не про жёсткие
                наказания, а про дружеские, нейтральные задания — например, спеть строчку или рассказать факт о себе.
              </p>
              <p>
                Лучше всего заранее обсудить формат и держаться в комфортных границах, особенно если играете впервые.
              </p>
            </div>
          </div>

          <div class="seo-details">
            <div class="seo-toggle">
              <button class="seo-btn" type="button" @click="showTodDetails = !showTodDetails">
                {{ showTodDetails ? 'Скрыть дополнительные правила' : 'Дополнительные правила' }}
              </button>

            </div>

            <div class="seo-accordion" v-show="showTodDetails">
              <p>
                Правда или действие онлайн — быстрый способ оживить разговор: вопросы и задания уже готовы, так что можно
                начать на телефоне или ноуте без подготовки. Выбираешь, отвечать честно или выполнять задание, и держишь темп —
                формат подходит и для компании, и для пары.
              </p>
              <p>
                Вопросы и задания балансируют между смехом и честностью, чтобы игра не превращалась в давление. Если чувствуете
                паузу или спор, включайте случайный выбор и переключайте режимы — так атмосфера остаётся лёгкой.
              </p>
              <p>
                Хочется разнообразия? Добавляйте свои правила, комбинируйте «правду» с альтернативными заданиями или играйте в
                версии «правда или напиток». Главное — соблюдать правила игры и помнить, что цель в эмоциях, а не в дискомфорте.
              </p>

              <h3>Правила безопасности</h3>
              <ul class="seo-list safety-list">
                <li>Договоритесь о стоп-темах и уважайте «нет».</li>
                <li>Не задавайте вопросы и задания, которые унижают.</li>
                <li>Сохраняйте темп, но без давления — можно пропустить ход.</li>
                <li>Переключайтесь на лёгкий режим, если компания устала.</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="seo-faq">
          <h3>FAQ по игре «Правда или действие»</h3>
          <div class="seo-faq-list">
            <details v-for="item in truthOrDareFaq" :key="item.question" class="seo-faq-item">
              <summary>{{ item.question }}</summary>
              <p>{{ item.answer }}</p>
            </details>
          </div>
        </div>

        <div class="seo-links">
          <h3>Попробуй ещё</h3>
          <div class="seo-links-grid">
            <NuxtLink class="seo-link-chip" to="/games/truth-or-dare/for-friends">Правда или действие для друзей</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/games/truth-or-dare/for-couple">Правда или действие для пары</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/games/truth-or-dare/for-company">Правда или действие для компании</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/games/truth-or-dare/for-teens">Правда или действие для подростков</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/games/truth-or-dare/18-plus">Правда или действие 18+</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/games">Все игры</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/decisions">Решайки</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/generators">Генераторы</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/games/sudoku">Судоку</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/games/minesweeper">Сапёр</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/games/wolf-clicker">Wolf Clicker</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/decisions/coin-flip">Монетка</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/decisions/wheel-of-fortune">Колесо выбора</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/generators/age-calculator">Калькулятор возраста</NuxtLink>
            <NuxtLink class="seo-link-chip" to="/generators/morse">Азбука Морзе</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section v-if="isNeverHaveIEver" class="seo-section">
      <div class="seo-content">
        <p class="seo-kicker">Я никогда не — онлайн</p>
        <h1>Лёгкая классика, которая всё ещё собирает людей</h1>
        <p>
          Игровой вечер будто не стартовал, если никто не бросил загадочное «Я никогда не…». Эта игра пережила эпохи и всё
          ещё собирает людей в круг, чтобы они случайно выдали то, о чём обычно молчат. Лёгкая, честная, смешная и иногда
          очень откровенная. Поэтому она и остаётся вечной классикой, которая не потеряется среди новых трендов.
        </p>
        <p>
          Хочешь сделать встречу друзей интереснее? Запусти «Я никогда не» и наблюдай, как раскрываются характеры. Тут
          выживают только самые крепкие духом. Остальные сдают пальцы один за другим.
        </p>
        <h3>Играй «Я никогда не» онлайн</h3>
        <p>
          Готовься к волне признаний и странных, смешных, милых историй. Нейронный Волк собрал больше тысячи оригинальных
          утверждений, которые проверят вашу честность и разгонят любую компанию. Вечеринка, свидание, семейный вечер или
          просто скучный час на диване — онлайн-версия игры всегда под рукой.
        </p>
        <p>
          Открывай список утверждений, выбирай категорию и удивляйся, насколько плохо ты знаешь своих друзей. А иногда
          себя. Хочешь зайти прямо сейчас? Игра доступна на сайте и в мобильной версии. Нажал старт — и стая уже в игре.
        </p>
        <h3>Как играть в «Я никогда не»</h3>
        <p>Идеально подходит для компаний любого размера. Никаких карточек, никаких сложных правил.</p>
        <ol class="seo-list">
          <li>1 игрок говорит фразу, которая начинается со слов «Я никогда не…».</li>
          <li>Например: «Я никогда не ел снег ради эксперимента».</li>
          <li>Если кто-то это делал, он признаётся. В питейной версии делает глоток. В версии «на пальцы» — опускает один палец вниз.</li>
          <li>Если никто не признаётся, тот, кто сказал фразу, сам делает действие.</li>
          <li>Игра продолжается, пока все, кроме одного, не сложат пальцы. Последний выживший — чемпион.</li>
        </ol>
        <h3>Правила игры «Я никогда не»</h3>
        <p>Чтобы игра шла гладко и не превращалась в хаос, заранее договоритесь о базовых вещах.</p>
        <p class="seo-subtitle">Подготовка</p>
        <ul class="seo-list">
          <li>Посадите всех в круг или сделайте «виртуальный круг» онлайн.</li>
          <li>Выберите, пьёте вы или играете на пальцы.</li>
          <li>Определите, кто начинает, и в какую сторону движется игра.</li>
        </ul>
        <p class="seo-subtitle">Процесс</p>
        <ul class="seo-list">
          <li>Первый игрок говорит утверждение.</li>
          <li>Те, кто это делал, опускают палец или делают глоток.</li>
          <li>Если не делал никто — действие выполняет тот, кто сказал фразу.</li>
          <li>Если игрок потерял все пальцы или допил напиток, он покидает круг.</li>
          <li>Последний игрок, у которого что-то осталось, — победитель.</li>
        </ul>
        <p class="seo-subtitle">Бонусный хаос</p>
        <p>
          Если хочешь добавить остроты, придумай маленькие задания для тех, кто выбывает. Спеть строчку трека, рассказать
          неловкую историю, станцевать что-то странное. Чем безумнее, тем ярче впечатления.
        </p>
      </div>
    </section>

    <section v-if="isTrueOrFalse" class="seo-section">
      <div class="seo-content">
        <p class="seo-kicker">Правда или ложь онлайн</p>
        <h1>Быстрый тест на интуицию и факты</h1>
        <p>
          Насколько ты чувствуешь правду? Игра «Правда или Ложь» — быстрый тест на интуицию, смекалку и чуть-чуть удачи.
          Тут всё смешано, от безумных научных фактов до мифов из поп-культуры, которые звучат слишком дико, чтобы быть
          выдумкой. Эта игра заставляет сомневаться каждые пять секунд. И это кайф.
        </p>
        <p>
          Хочешь оживить компанию или устроить разогрев перед долгим разговором? «Правда или Ложь» всегда заходит идеально.
          Она цепляет и новичков, и тех, кто любит поспорить. Готов разобрать факты на кусочки? Проверим, сколько правды ты
          выдержишь.
        </p>
        <h3>Играй в «Правду или Ложь» онлайн</h3>
        <p>
          Собираешь друзей? Запускай «Правду или Ложь» онлайн и делай вечер громче. Мы смешали утверждения из разных тем, так
          что никто не расслабится. Наука, животные, мемы, странные рекорды — всё летит в тебя подряд. Игра доступна прямо
          на сайте, без скачиваний. Открыл, выбрал категорию и начал факт-челлендж. Сколько раундов выдержит ваша стая?
        </p>
        <h3>Как играть в «Правду или Ложь»</h3>
        <p>Правда или Ложь простая и честная, но затягивает так, что один раунд превращается в двадцать. Вот как это работает:</p>
        <ol class="seo-list">
          <li>Выбираешь категорию и получаешь утверждение — логичное, смешное или настолько нелепое, что мозг зависает.</li>
          <li>Решаешь, правда это или ложь, жмёшь кнопку — назад пути нет.</li>
          <li>Пример: «У улиток есть четыре носа». Правильно или фейк?</li>
          <li>После выбора открывается правильный ответ. Угадал — балл твой, промахнулся — зато узнал новый факт.</li>
          <li>Играйте столько, сколько хочется, пока не появится мастер факт-чека, который угадывает всё подряд.</li>
        </ol>
        <h3>Правила игры «Правда или Ложь»</h3>
        <p class="seo-subtitle">Добавь хаоса</p>
        <ul class="seo-list">
          <li>Миксуй категории по настроению: сегодня наука, завтра мемы, послезавтра «чего вообще не должно существовать».</li>
          <li>Чередуй лёгкие факты с мозговзрывными, смотри на уверенные неправильные ответы и смешные оправдания.</li>
          <li>Реши атмосферу: ведите таблицу победителя или играйте «по фану», наблюдая за реакциями.</li>
          <li>Добавляй челленджи между раундами: отвечать пафосно, изображать эмоцию ответа, говорить через смех.</li>
          <li>Получай удовольствие от случайных фактов — игра про удивление, споры и неожиданные открытия.</li>
        </ul>
        <p>Формат подходит и для коротких пауз, и для вечернего марафона. Включай игру и решайте, кто в вашей компании мастер фактов.</p>
      </div>
    </section>

    <section v-if="isFiveSeconds" class="seo-section">
      <div class="seo-content">
        <p class="seo-kicker">Ответь за 5 секунд онлайн</p>
        <h1>Реакция хищника против таймера</h1>
        <p>
          Думаешь, у тебя реакция как у хищника и мозг работает быстрее, чем ты моргаешь? Проверим это прямо сейчас. «Ответь за 5 секунд» — игра, которая заставляет выстреливать ответами, пока таймер поджимает пятки. Тут дрожат даже самые спокойные, а компания взрывается смехом.
        </p>
        <p>
          Три, два, один, поехали. Под давлением времени выкручиваются самые странные, смешные и гениальные ответы. Это идеальная игра, чтобы разогреть компанию, снять неловкость и устроить вечер, который легко станет мемом среди друзей. Мы собрали больше тысячи вопросов: абсурдных, смелых, неожиданных. С ними вечер точно не будет тихим.
        </p>
        <h3>Играй в «Ответь за 5 секунд» онлайн</h3>
        <p>
          Сможешь обмануть таймер и выдать три чётких ответа всего за пять секунд? Узнаем. Онлайн-версия игры запускается мгновенно: открываешь сайт и начинаешь дуэль со временем. Играй с друзьями, соревнуйся, кто быстрее генерирует идеи, или просто смейтесь над ответами, которые вылетают в панике. Категорий много, вопросы разные — скучать не придётся. Нажал кнопку — и игра уже несётся вперёд.
        </p>
        <h3>Как играть в «Ответь за 5 секунд»</h3>
        <p>Правила проще некуда. Играют минимум вдвоём, но чем больше народу, тем громче хаос.</p>
        <ol class="seo-list">
          <li>Выбирается первый игрок.</li>
          <li>Ему задаётся вопрос. На ответ — пять секунд.</li>
          <li>Пример: «Назови три вида птиц». Игрок должен выстрелить: «Воробей, орёл, эму».</li>
          <li>Если успел — получает балл. Не успел или запутался — ход переходит дальше.</li>
          <li>Играйте сколько хотите: ставьте лимит раундов или до тех пор, пока компания не устанет смеяться. Побеждает тот, кто набрал больше всех баллов и сумел держать голову холодной.</li>
        </ol>
        <h3>Правила игры «Ответь за 5 секунд»</h3>
        <p class="seo-subtitle">Чтобы атмосфера была живой</p>
        <ul class="seo-list">
          <li>Будьте уважительны: таймер поджимает всех одинаково.</li>
          <li>Без мухлежа: пять секунд — это пять секунд, ответы честные.</li>
          <li>Дайте всем шанс: не перебивайте и не спорьте о каждом слове, пусть игрок закончит мысль.</li>
          <li>Сохраняйте лёгкость: ошибся — рассмеялся и пошёл дальше. Неловкие моменты — лучшая часть процесса.</li>
        </ul>
      </div>
    </section>

    <section class="seo-section">
      <div class="seo-card">
        <RelatedTools />
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { createError, useHead, useRoute } from '#imports'
import TruthOrDareGame from '@/components/games/TruthOrDare/TruthOrDareGame.vue'
import NeverGame from '@/components/games/NeverHaveIEver/NeverHaveIEver.vue'
import FiveSecondsGame from '@/components/games/FiveSeconds/FiveSeconds.vue'
import TrueOrFalseGame from '@/components/games/TrueOrFalse/TrueOrFalse.vue'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const componentsMap = {
  'truth-or-dare': TruthOrDareGame,
  'never-have-i-ever': NeverGame,
  '5-seconds': FiveSecondsGame,
  'true-or-false': TrueOrFalseGame,
  coin: FiveSecondsGame
}

if (!componentsMap[slug.value]) {
  throw createError({ statusCode: 404, statusMessage: 'Страница не приручена' })
}

const ViewComponent = computed(() => componentsMap[slug.value])
const isTruthOrDare = computed(() => slug.value === 'truth-or-dare')
const isNeverHaveIEver = computed(() => slug.value === 'never-have-i-ever')
const isTrueOrFalse = computed(() => slug.value === 'true-or-false')
const isFiveSeconds = computed(() => slug.value === '5-seconds')
const showTodDetails = ref(false)

const truthOrDareTitle = 'Правда или Действие Онлайн 2026: вопросы для друзей, пары и компании'
const truthOrDareDescription =
  'Играй в Правда или Действие онлайн: вопросы и задания для друзей, пары и компании. Быстрый старт в браузере, режимы по интенту, без регистрации.'
const truthOrDareUrl = 'https://www.neuralwisewolf.com/games/truth-or-dare'
const truthOrDareImage = 'https://www.neuralwisewolf.com/favicon.png'

const truthOrDareFaq = [
  {
    question: 'Как играть в “Правда или действие” онлайн?',
    answer:
      'Нажми «Играть онлайн», выбери режим и жми «Правда», «Действие» или «Случайно». Вопросы и задания появляются сразу.'
  },
  {
    question: 'Можно ли играть вдвоём?',
    answer: 'Да, игра отлично подходит для пары: выбирайте романтичные или лёгкие режимы и чередуйте вопросы.'
  },
  {
    question: 'Какие режимы лучше для компании?',
    answer: 'Для компании обычно заходят «Вечеринка», «Лайт» или «Случайно», чтобы вопросы были разнообразными.'
  },
  {
    question: 'Какие режимы лучше для пары?',
    answer: 'Подойдут «Романтика» и «Лайт» — там больше тёплых вопросов и мягких заданий.'
  },
  {
    question: 'Можно ли пропускать задания?',
    answer: 'Да, если задание не подходит. Введите мягкий штраф или просто пропустите ход.'
  },
  {
    question: 'Как работает “Случайно”?',
    answer: 'Игра сама выбирает между «правдой» и «действием», а также случайный режим с вопросами.'
  },
  {
    question: 'Есть ли 18+ режимы?',
    answer: 'В этой версии мы держим вопросы и задания в нейтральных пределах. 18+ режимов нет.'
  },
  {
    question: 'Что делать, если вопросы повторяются?',
    answer: 'Смените режим или нажмите «Случайно». Вопросы распределяются так, чтобы не повторяться подряд.'
  },
  {
    question: 'Игра работает на телефоне?',
    answer: 'Да, интерфейс адаптирован под мобильные экраны и работает в браузере.'
  },
  {
    question: 'Нужно ли регистрироваться?',
    answer: 'Нет, игра запускается сразу и без регистрации.'
  },
  {
    question: 'Как сделать игру безопасной и без неловкости?',
    answer:
      'Согласуйте стоп-темы и заранее договоритесь, что уважительное «нет» всегда нормально. Не используйте унизительные задания.'
  },
  {
    question: 'Можно ли играть без интернета?',
    answer: 'Нет, для загрузки вопросов нужна связь с сайтом.'
  }
]

useHead(() => {
  if (!isTruthOrDare.value) return {}

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: truthOrDareFaq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: 'https://www.neuralwisewolf.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Игры',
        item: 'https://www.neuralwisewolf.com/games'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Правда или действие',
        item: truthOrDareUrl
      }
    ]
  }

  return {
    title: truthOrDareTitle,
    link: [{ rel: 'canonical', href: truthOrDareUrl }],
    meta: [
      { name: 'description', content: truthOrDareDescription },
      { name: 'robots', content: 'index,follow' },
      { property: 'og:title', content: truthOrDareTitle },
      { property: 'og:description', content: truthOrDareDescription },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: truthOrDareUrl },
      { property: 'og:image', content: truthOrDareImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: truthOrDareTitle },
      { name: 'twitter:description', content: truthOrDareDescription },
      { name: 'twitter:image', content: truthOrDareImage }
    ],
    script: [
      { type: 'application/ld+json', children: JSON.stringify(breadcrumbSchema) },
      { type: 'application/ld+json', children: JSON.stringify(faqSchema) }
    ]
  }
})

</script>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column;
}

@media (max-width: 420px) {
  .game-page {
    overflow-x: hidden;
  }

  .game-hero {
    padding-left: 8px;
    padding-right: 8px;
  }
}

.game-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(18px, 4vw, 36px) clamp(12px, 4vw, 24px) clamp(28px, 4vw, 44px);
}

.game-hero-inner {
  width: min(1100px, 100%);
  display: grid;
  gap: 14px;
  justify-items: center;
}

.game-host {
  width: 100%;
  margin: 0;
}

.seo-anchor {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 800;
  color: #93c5fd;
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid rgba(147, 197, 253, 0.35);
  background: rgba(15, 23, 42, 0.6);
  transition: transform 0.12s ease, border-color 0.2s ease;
}

.seo-anchor:hover {
  transform: translateY(-1px);
  border-color: rgba(147, 197, 253, 0.7);
}

.seo-section {
  padding: 56px 0 72px;
  content-visibility: auto;
  contain-intrinsic-size: 1px 3200px;
}

.seo-card {
  max-width: 1080px;
  margin: 0 auto;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.25);
}

.seo-content {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: #e5e7eb;
  line-height: 1.7;
}

.seo-grid {
  max-width: 100%;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 22px;
}

.seo-quick,
.seo-details {
  display: grid;
  gap: 18px;
}

.seo-block {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 14px 16px;
  display: grid;
  gap: 10px;
}

.seo-block p {
  margin: 0;
  color: #cbd5f5;
}

.seo-kicker {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
  color: #93c5fd;
  font-weight: 700;
}

.seo-content h1 {
  font-size: 28px;
  line-height: 1.3;
  margin: 0;
}

.seo-content h2,
.seo-content h3 {
  margin: 0;
  line-height: 1.3;
}

.seo-lead {
  margin: 0;
  color: #cbd5f5;
}

.seo-content h2 {
  font-size: 28px;
}

.seo-content h3 {
  font-size: 20px;
  color: #e0e7ff;
}

.seo-subtitle {
  margin: 0;
  font-weight: 700;
  color: #cbd5f5;
}

.seo-content p {
  margin: 0;
  color: #cbd5f5;
}

.seo-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.seo-chip {
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  color: #e5e7eb;
}

.seo-list {
  margin: 0;
  padding-left: 18px;
  color: #cbd5f5;
  display: grid;
  gap: 6px;
}

.quick-list {
  padding-left: 20px;
}

.mode-list {
  padding-left: 18px;
}

.safety-list {
  padding-left: 18px;
}

.seo-details {
  align-content: start;
}

.seo-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.seo-btn {
  border: none;
  border-radius: 999px;
  background: linear-gradient(120deg, #38bdf8, #a855f7);
  color: #0b1220;
  font-weight: 800;
  padding: 12px 18px;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(168, 85, 247, 0.25);
  transition: transform 0.12s ease, box-shadow 0.2s ease;
}

.seo-btn:hover {
  transform: translateY(-1px);
}

.seo-btn:active {
  transform: translateY(0);
}

.seo-link {
  color: #93c5fd;
  font-weight: 700;
  text-decoration: none;
}

.seo-link:hover {
  text-decoration: underline;
}

.seo-accordion {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px 18px;
  display: grid;
  gap: 12px;
}

.seo-media {
  width: 100%;
  margin: 4px 0;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.45);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}

.seo-media img {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 16 / 9;
}

.seo-media--right {
  justify-self: stretch;
  width: 100%;
}

.seo-media--wide {
  width: 100%;
}

.seo-faq {
  margin-top: 28px;
  display: grid;
  gap: 14px;
  color: #e5e7eb;
}

.seo-faq h3 {
  margin: 0;
  font-size: 22px;
}

.seo-faq-list {
  display: grid;
  gap: 12px;
}

.seo-faq-item {
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  gap: 8px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.seo-faq-item summary {
  list-style: none;
  cursor: pointer;
  font-weight: 700;
  color: #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
}

.seo-faq-item summary::-webkit-details-marker {
  display: none;
}

.seo-faq-item summary::after {
  content: '';
  margin-left: auto;
  width: 8px;
  height: 8px;
  border-right: 2px solid rgba(147, 197, 253, 0.9);
  border-bottom: 2px solid rgba(147, 197, 253, 0.9);
  transform: rotate(-45deg);
  transition: transform 0.2s ease;
}

.seo-faq-item[open] summary::after {
  transform: rotate(45deg);
}

.seo-faq-item p {
  margin: 0;
  color: #cbd5f5;
}

.seo-faq-item[open] {
  border-color: rgba(147, 197, 253, 0.35);
  background: rgba(147, 197, 253, 0.06);
}

.seo-links {
  margin-top: 24px;
  display: grid;
  gap: 12px;
  color: #e5e7eb;
}

.seo-links h3 {
  margin: 0;
  font-size: 22px;
}

.seo-links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.seo-link-chip {
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: #e5e7eb;
  text-decoration: none;
  font-weight: 700;
}

.seo-link-chip:hover {
  border-color: rgba(147, 197, 253, 0.6);
  color: #93c5fd;
}

@media (max-width: 768px) {
  .game-hero {
    min-height: 90vh;
    padding: 24px 0 16px;
  }

  .seo-section {
    padding: 40px 0 52px;
  }

  .seo-card {
    padding: 22px 16px;
  }

  .seo-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .seo-content h1,
  .seo-content h2 {
    font-size: 22px;
  }

  .seo-anchor {
    width: 100%;
  }
}
</style>
