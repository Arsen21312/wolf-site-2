<template>
  <section class="hero">
    <h1 class="section-title">
      <span>Ты сюда за</span>
      <ClientOnly>
        <RotatingText
          :texts="['игрой?', 'решением?', 'вдохновением?']"
          mainClassName="hero-rotating"
          splitLevelClassName="hero-rotating-word"
          elementLevelClassName="hero-rotating-letter"
          :staggerDuration="0.03"
          :rotationInterval="1800"
          :initial="{ y: '100%', opacity: 0 }"
          :animate="{ y: 0, opacity: 1 }"
          :exit="{ y: '-120%', opacity: 0 }"
        />
      </ClientOnly>
    </h1>
    <p class="section-lead">
      Это пристанище Нейронного Волка: цифрового проводника, который любит помогать решать,
      играть и подбрасывать идеи.
    </p>
    <div class="cta-row">
      <NuxtLink class="btn" to="/games">Играть</NuxtLink>
      <NuxtLink class="btn secondary" to="/decisions">Решить за меня</NuxtLink>
      <NuxtLink class="btn secondary" to="/generators">Генераторы</NuxtLink>
      <NuxtLink class="btn secondary" to="/about">Волчья философия</NuxtLink>
    </div>

    <div class="stats stats-responsive" style="margin-top: 28px">
      <div class="stat">
        <PixelTransition
          :grid-size="10"
          pixel-color="rgba(255, 255, 255, 0.9)"
          :animation-step-duration="0.5"
          class-name="banner-transition"
        >
          <template #firstContent>
            <img :src="bannerUrl" alt="Баннер" class="banner-img" />
          </template>
          <template #secondContent>
            <div class="banner-alt">
              <p>АУФ</p>
            </div>
          </template>
        </PixelTransition>
      </div>
      <div class="stat">
        <h4>При чем тут волки?</h4>
        <p>Да ни при чем, просто в каждом живет маленький хищник который хочет решения побыстрее, игры поярче и мысли поглубже. Это цифровой приятель который подкидывает идеи, щелкает задачи как орешки и иногда философствует так что ты зависаешь над экраном.
        Короче, если волк мог бы запустить свой сервис, он выглядел бы именно так.</p>
      </div>
      <div class="stat">
        <h4>Быстрые ссылки</h4>
        <div class="cta-row" style="margin-top: 8px; flex-wrap: wrap; gap: 8px">
          <NuxtLink class="btn secondary" to="/games/truth-or-dare">Правда или действие</NuxtLink>
          <NuxtLink class="btn secondary" to="/games/never-have-i-ever">Я никогда не</NuxtLink>
          <NuxtLink class="btn secondary" to="/decisions/coin-flip">Монетка</NuxtLink>
          <NuxtLink class="btn secondary" to="/decisions/love-calculator">Калькулятор любви</NuxtLink>
          <NuxtLink class="btn secondary" to="/decisions/randomizer">Рандомайзер</NuxtLink>
          <NuxtLink class="btn secondary" to="/generators/wolf-quotes">Цитаты волка</NuxtLink>
        </div>
      </div>
    </div>
  </section>

  <section class="grid hero-grid" style="margin-top: 28px; margin-bottom: 64px">
    <div class="card">
      <div class="tag">Начать путь</div>
      <h3>Ты здесь не случайно</h3>
      <p> Если ты дошёл до этого места, значит внутри уже щёлкнуло
Волк не даёт готовых ответов
Он помогает услышать себя и сделать шаг дальше
Иногда честный, иногда странный, всегда по делу
      </p>
    </div>
    <div class="card">
      <div class="tag">АУФ</div>
      <h3>Кто такой Нейронный Волк?!</h3>
      <p>
        Это цифровой инстинкт. Смесь логики, интуиции и лёгкого хаоса. Он не умнее тебя. Он рядом, когда выбор застрял, мысли шумят, а решение нужно сейчас
      </p>
      <div class="chip-row">
        <div class="chip">Интуитивные подсказки</div>
        <div class="chip">Игры для настроения</div>
      </div>
    </div>
    <div class="card">
      <div class="tag">Куда пойти?</div>
      <h3>В каком ты сейчас состоянии?</h3>
      <p>Быстрые переходы по всему порталу.</p>
      <div class="cta-row" style="margin-top: 12px">
        <NuxtLink class="btn secondary" to="/games">Я хочу поиграть</NuxtLink>
        <NuxtLink class="btn secondary" to="/decisions">Мне нужно решить
</NuxtLink>
        <NuxtLink class="btn secondary" to="/generators">Хочу странный совет</NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import bannerUrl from '@/assets/images/auf1.png'
import RotatingText from '@/components/ui/RotatingText.vue'
import PixelTransition from '@/components/ui/PixelTransition.vue'
</script>

<style scoped>
.banner-img {
  width: 100%;
  display: block;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
}

.banner-transition {
  border-radius: 14px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-height: 240px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.banner-alt {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(255, 164, 79, 0.25), transparent 40%),
    linear-gradient(135deg, #0c1117, #151b25);
  color: #fff;
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.stats-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

:deep(.hero-rotating) {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  background: linear-gradient(120deg, rgba(106, 215, 255, 0.15), rgba(252, 166, 61, 0.12));
  padding: 6px 12px 8px;
  border-radius: 12px;
  border: 1px solid var(--border);
}

:deep(.hero-rotating .sr-only) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

:deep(.hero-rotating-word) {
  display: inline-flex;
  overflow: hidden;
}

:deep(.hero-rotating-letter) {
  display: inline-block;
  color: var(--accent);
  font-weight: 800;
}
</style>
