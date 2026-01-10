<template>
  <section class="loops-preview">
    <section class="loopy-hero">
      <div class="loopy-hero__inner">
        <div class="hero-block">
          <div class="hero-title wolf-title">
            <span class="wolf-letter">В</span>
            <span class="node-pair">
              <iframe
                class="node-embed"
                src="/loopy/splash-embed/index.html"
                title="Loopy интерактивный логотип"
                loading="lazy"
                allowtransparency="true"
                tabindex="-1"
                aria-hidden="true"
              ></iframe>
            </span>
            <span class="wolf-letter wolf-letter--l">Л</span>
            <span class="wolf-letter">К</span>
          </div>
          <div class="hero-subtitle">создает <span class="hero-em">петли</span> и помогает увидеть</div>
        <div class="hero-actions">
          <NuxtLink class="btn" to="/generators/loopy">Открыть редактор</NuxtLink>
          <NuxtLink class="btn secondary" to="/generators/loopy?help=1">Как пользоваться</NuxtLink>
        </div>
      </div>
    </div>
  </section>

    <section class="loopy-next">
      <div class="container story-inner">
        <div class="story-text">
          <div class="story-title">Переходим от хаоса к понятным связям</div>
          <p>
            В сложных системах всё взаимосвязано. Петли помогают увидеть, как действия усиливают или
            ослабляют друг друга - и где можно разорвать плохой цикл.
          </p>
        </div>
        <div class="ideas-card">
          <div class="ideas-title">Нужны идеи, что смоделировать</div>
          <div class="ideas-tags">
            <span>маркетинг</span>
            <span>привычки</span>
            <span>отношения</span>
            <span>деньги</span>
            <span>комьюнити</span>
            <span>психология</span>
          </div>
          <div class="ideas-note">Нарисуй петлю, покрути ползунок и смотри, куда уходит энергия. Создай гифку или интегрируй на сайт</div>
        </div>
      </div>

      <div class="container article-block">
        <div class="article-title">Как пользоваться</div>
          <div class="article-grid">
            <div class="article-card">
              <div class="article-gif">
                <img src="/loopy/v1.1/pages/gifs/howto-1.gif" alt="Нарисуй узлы и связи" loading="lazy" />
              </div>
              <div class="article-text">
                <div class="article-heading">Нарисуй узлы и связи</div>
                <p>Создай круги, подпиши смысл и протяни стрелки между узлами.</p>
              </div>
            </div>
            <div class="article-card is-reverse">
              <div class="article-gif">
                <img src="/loopy/v1.1/pages/gifs/howto-2.gif" alt="Укажи знак связи" loading="lazy" />
              </div>
              <div class="article-text">
                <div class="article-heading">Укажи знак связи</div>
                <p>Плюс усиливает, минус ослабляет - так ты задаёшь направление влияния.</p>
              </div>
            </div>
            <div class="article-card">
              <div class="article-gif">
                <img src="/loopy/v1.1/pages/gifs/howto-3.gif" alt="Запусти и наблюдай" loading="lazy" />
              </div>
              <div class="article-text">
                <div class="article-heading">Запусти и наблюдай</div>
                <p>Нажми &laquo;Запуск&raquo;, покрути скорость и посмотри, как меняется система.</p>
              </div>
            </div>
        </div>
      </div>

      <div class="container">
        <div ref="examplesRef" class="examples-block">
          <div class="examples-title">Сыграть на примерах</div>
          <div class="examples-circles">
            <button
              v-for="example in examples"
              :key="example.id"
              class="example-circle"
              type="button"
              :style="{ '--accent': example.color }"
              @click="openExample(example.id)"
            >
              <span>{{ example.title }}</span>
            </button>
          </div>
          <div class="examples-action">
            <NuxtLink class="btn secondary" to="/generators/loopy">Создать модель с нуля</NuxtLink>
          </div>
        </div>
      </div>

      <div class="use-band">
        <div class="container">
          <div class="use-title">Где использовать</div>
          <div class="use-grid">
            <div class="use-card">
              <div class="use-illustration">MKT</div>
              <div class="use-caption">Маркетинг</div>
            </div>
            <div class="use-card">
              <div class="use-illustration">GOAL</div>
              <div class="use-caption">Личные цели</div>
            </div>
            <div class="use-card">
              <div class="use-illustration">TEAM</div>
              <div class="use-caption">Команда</div>
            </div>
            <div class="use-card">
              <div class="use-illustration">MIND</div>
              <div class="use-caption">Психология</div>
            </div>
            <div class="use-card">
              <div class="use-illustration">PROD</div>
              <div class="use-caption">Продукты</div>
            </div>
          </div>
          <div class="use-text">
            Как бы ни использовались Петли, они дают визуальный язык для обсуждения сложных систем.
          </div>
          <div class="use-action">
            <NuxtLink class="btn accent" to="/generators/loopy">Попробовать в редакторе</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const examplesRef = ref(null)
const examples = [
  { id: 'trust-loop', title: 'Контентная петля', color: '#f5a524' },
  { id: 'stress-sleep', title: 'Тревога и прокрастинация', color: '#8b7bff' },
  { id: 'resource-plan', title: 'Реклама и доверие', color: '#ff6b6b' }
]

const scrollToExamples = () => {
  if (!examplesRef.value) return
  examplesRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const openExample = (id) => {
  navigateTo(`/generators/loopy?example=${id}`)
}
</script>

<style scoped>
.loops-preview {
  padding: 0 0 80px;
}

.hero-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  margin-bottom: 10px;
}

.loopy-hero {
  position: relative;
  background: #ffffff;
  color: #111420;
  padding: clamp(10px, 2vw, 24px) 0 clamp(20px, 3vw, 40px);
  width: 100vw;
  max-width: none;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
  overflow: visible;
}

.loopy-hero__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  position: relative;
  z-index: 1;
}

.loopy-hero::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -28px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 34px solid transparent;
  border-right: 34px solid transparent;
  border-top: 28px solid #ffffff;
  z-index: 2;
}

.loopy-hero::before {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -30px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 36px solid transparent;
  border-right: 36px solid transparent;
  border-top: 30px solid rgba(0, 0, 0, 0.06);
  z-index: 1;
  filter: blur(0.2px);
}

.loopy-next {
  background: transparent;
  padding: 32px 0 80px;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.loopy-next .container {
  width: min(600px, 100% - 48px);
}

:global(.layout-shell),
:global(main.container.main-content),
:global(.layout-shell > main.container.main-content) {
  overflow-x: visible !important;
  overflow: visible !important;
}

:global(main.container.main-content) {
  padding-top: 0 !important;
}

:global(.layout-shell),
:global(main.container.main-content),
:global(#__nuxt) {
  transform: none !important;
}

.hero-title {
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: clamp(56px, 14vw, 180px);
  font-weight: 700;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 0;
  line-height: 0.95;
  color: #0d0f14;
}

.wolf-title span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.wolf-letter--l {
  margin-left: 0.16em;
}

.node-pair {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.02em;
  padding: 0;
  font-size: 1em;
  width: 2.7em;
  height: 1.85em;
  top: 0;
  overflow: hidden;
  border-radius: 12px;
  margin: 0 -0.18em;
  vertical-align: middle;
}

.node-embed {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 720px;
  height: 480px;
  border: none;
  outline: none;
  box-shadow: none;
  pointer-events: none;
  background: transparent;
  transform: translate(calc(-50% + 300px), calc(-50% + 175px)) scale(1.4);
  transform-origin: center;
  clip-path: inset(8px);
}

.hero-subtitle {
  margin-top: 2px;
  font-size: 36px;
  color: #2b2f3a;
}

.hero-em {
  font-weight: 700;
  color: #0d0f14;
}

.hero-actions {
  margin-top: 6px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.loopy-hero .btn.secondary {
  background: #ffffff;
  color: #111420;
  border-color: rgba(17, 20, 32, 0.2);
  box-shadow: 0 6px 16px rgba(17, 20, 32, 0.08);
}

.loopy-hero .btn.secondary:hover {
  border-color: rgba(17, 20, 32, 0.35);
  box-shadow: 0 10px 20px rgba(17, 20, 32, 0.12);
}


.hero-link {
  background: none;
  border: none;
  color: #9fb2d8;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

.hero-link:hover {
  color: #ffffff;
}

.story-inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: start;
  margin-bottom: 28px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.story-title {
  font-weight: 700;
  font-size: 28px;
  margin-bottom: 10px;
}

.story-text p {
  margin: 0;
  color: #c5d0ea;
  font-size: 18px;
  line-height: 1.5;
}

.ideas-card {
  padding: 20px 20px 18px;
  border-radius: 18px;
  background: rgba(14, 20, 38, 0.9);
  border: 1px solid var(--border);
  width: calc(100% + 40px);
  margin-left: -20px;
  margin-right: -20px;
}

.ideas-title {
  font-weight: 700;
  margin-bottom: 14px;
  font-size: 20px;
}

.ideas-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.ideas-tags span {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #d8e1f7;
  font-size: 15px;
}

.ideas-note {
  font-size: 17px;
  color: #c0cbe6;
}

.article-block {
  margin-top: 8px;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.article-title {
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
}

.article-grid {
  display: grid;
  gap: 18px;
}

.article-card {
  display: grid;
  grid-template-columns: minmax(200px, 320px) 1fr;
  gap: 20px;
  padding: 14px 18px;
  border-radius: 16px;
  background: rgba(14, 20, 38, 0.9);
  border: 1px solid var(--border);
  align-items: center;
}

.article-card.is-reverse {
  grid-template-columns: 1fr minmax(200px, 320px);
}

.article-card.is-reverse .article-gif {
  order: 2;
}

.article-card.is-reverse .article-text {
  order: 1;
}

.article-gif {
  border-radius: 12px;
  background: #0b1021;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #9fb2d8;
  min-height: 140px;
  overflow: hidden;
}

.article-gif img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.article-heading {
  font-weight: 700;
  margin-bottom: 6px;
}

.article-text p {
  margin: 0;
  color: #c5d0ea;
}

.examples-block {
  margin-top: 48px;
  text-align: center;
  max-width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.examples-title {
  font-family: 'Space Grotesk', 'Manrope', sans-serif;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}

.examples-circles {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  justify-content: center;
  margin-bottom: 18px;
}

.example-circle {
  width: 170px;
  height: 170px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: radial-gradient(circle at top, rgba(255,255,255,0.3), rgba(0,0,0,0.05)), var(--accent);
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  padding: 16px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.example-circle:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 18px 36px rgba(0,0,0,0.3);
}

.examples-action {
  display: flex;
  justify-content: center;
}

.examples-action .btn {
  width: 540px;
  max-width: 100%;
  justify-content: center;
}

.why-block {
  margin-top: 40px;
  padding: 20px;
  border-radius: 16px;
  background: var(--panel);
  border: 1px solid var(--border);
}

.why-title {
  font-weight: 700;
  margin-bottom: 8px;
}

.why-text {
  color: var(--muted);
}

.use-band {
  margin-top: 48px;
  padding: 36px 0 48px;
  background: transparent;
  color: #e7ecf7;
  border-top: none;
  border-bottom: none;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
}

.use-title {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
}

.use-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}

.use-card {
  background: rgba(14, 20, 38, 0.9);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 14px;
  text-align: center;
  min-height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.use-illustration {
  font-size: 26px;
}

.use-caption {
  font-weight: 600;
  font-size: 14px;
}

.use-text {
  text-align: center;
  color: #c5d0ea;
  margin-bottom: 18px;
}

.use-action {
  display: flex;
  justify-content: center;
}

.btn.accent {
  background: #e24a3b;
  color: #ffffff;
  border: none;
  padding: 12px 28px;
  border-radius: 999px;
  font-weight: 700;
}

.btn.accent:hover {
  background: #f05a4b;
}

@media (max-width: 900px) {
  .story-inner {
    grid-template-columns: 1fr;
    max-width: 100%;
  }
  .ideas-card {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
  .article-card {
    grid-template-columns: 1fr;
  }
  .article-card.is-reverse {
    grid-template-columns: 1fr;
  }
  .article-card.is-reverse .article-gif,
  .article-card.is-reverse .article-text {
    order: initial;
  }
  .article-block,
  .examples-block {
    max-width: 100%;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: clamp(42px, 18vw, 120px);
    letter-spacing: 1px;
    gap: 0;
  }
  .hero-subtitle {
    font-size: 22px;
  }
  .node-pair {
    width: 2.4em;
    height: 1.6em;
    margin: 0 -0.12em;
  }
}

:global(html),
:global(body) {
  height: auto;
  overflow: auto !important;
}

:global(#__nuxt) {
  min-height: 100%;
}

</style>
