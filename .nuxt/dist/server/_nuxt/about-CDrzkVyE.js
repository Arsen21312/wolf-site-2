import { ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import { u as useHead } from "./v3-D81umCog.js";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/hookable/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/unctx/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/radix3/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/defu/dist/defu.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/ufo/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = {
  __name: "about",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({
      title: "О проекте — Нейронный Волк",
      meta: [{ name: "description", content: "О проекте, Нейронный Волк" }]
    });
    const tocItems = [
      { id: "mission", label: "Зачем мы это делаем" },
      { id: "ads", label: "Реклама и поддержка" },
      { id: "socials", label: "Где нас найти" },
      { id: "faq", label: "FAQ" }
    ];
    const missionPoints = [
      {
        icon: "⚡",
        title: "Минимум кода",
        text: "Инструменты запускаются мгновенно, без сложной настройки."
      },
      {
        icon: "🤖",
        title: "Максимум AI",
        text: "Волк подтягивает модели, чтобы решения были умнее и живее."
      },
      {
        icon: "💼",
        title: "Ноль бюрократии",
        text: "Без формальностей: открыл и пользуешься."
      },
      {
        icon: "🐺",
        title: "Решение важнее формы",
        text: "Не как правильно, а как сработает именно сейчас."
      }
    ];
    const techCards = [
      { icon: "✨", title: "Нейросети", text: "Подсказывают, генерируют и помогают принять решение." },
      { icon: "🌐", title: "Web", text: "Работает из любого браузера и устройства." },
      { icon: "☁️", title: "Cloud", text: "Надежные сервисы, которые не засыпают." },
      { icon: "🔗", title: "API", text: "Готовность интегрироваться, когда это нужно." }
    ];
    const supportCards = [
      {
        icon: "📢",
        title: "Реклама на сайте",
        text: "Нативные форматы без раздражающего шума.",
        points: ["Карточки в релевантных разделах", "Тонкая подача, уважение к пользователю", "Отчетность по показам"]
      },
      {
        icon: "📨",
        title: "Соцсети и рассылки",
        text: "Расскажем в каналах, которые читает аудитория Волка.",
        points: ["Посты в Telegram (1K+ подписчиков)", "Stories и посты в Instagram (100к)", "Упоминания в TikTok и YouTube (10к+)"]
      },
      {
        icon: "🤝",
        title: "Партнерские программы",
        text: "Соберем win-win: ты даешь ценность, мы трафик.",
        points: ["Спецпроекты под задачу", "Участие в игровых механиках", "Промокоды и бонусы"]
      }
    ];
    const socials = [
      {
        icon: "📣",
        title: "Telegram канал",
        text: "Главные новости, много мемов и ауфной философии",
        status: "Обновления каждый день",
        href: "https://t.me/neural_wise_wolf"
      },
      {
        icon: "🤖",
        title: "Бот Мудрый Клык",
        text: "Генерирует дегенератские пацанские цитаты с помощью нейросетей GPT-3 и BigGAN",
        status: "Всегда включен",
        href: "https://t.me/neural_wise_wolf_bot"
      },
      {
        icon: "📸",
        title: "Instagram",
        text: "Мемы и не только. Самое большое сообщество",
        status: "Более 90к подписчиков",
        href: "https://instagram.com/neural_wise_wolf"
      },
      {
        icon: "▶️",
        title: "YouTube",
        text: "Разборы инструментов, мемы и много ауфа.",
        status: "Подпишись брат",
        href: "https://youtube.com/@neural_wolf"
      },
      {
        icon: "🎵",
        title: "TikTok",
        text: "Стримы, мемы и много волков",
        status: "Тут волк бывает онлайн",
        href: "https://tiktok.com/@neural_wolf"
      },
      {
        icon: "💬",
        title: "Поддержка",
        text: "Если что-то сломалось или есть идеи.",
        status: "Не стесняйся, пиши",
        href: "https://t.me/neural_wolf"
      }
    ];
    const faqItems = ref([
      {
        q: "Проект бесплатный?",
        a: "Да. Большинство инструментов и игр доступны бесплатно. Если появятся платные штуки будет честное предупреждение.",
        open: true
      },
      {
        q: "Как подкинуть идею для нового сервиса?",
        a: "Пиши в поддержку или в Telegram. Волк любит хорошие идеи и часто добавляет их в бэклог.",
        open: false
      },
      {
        q: "Где исходники?",
        a: "Код собирается из нескольких частей. Открываем то, что можем, и публикуем отдельные модули по мере готовности.",
        open: false
      },
      {
        q: "Как часто обновляется сайт?",
        a: "Новые игры и генераторы прилетают каждую неделю, а улучшения интерфейса по мере обратной связи.",
        open: false
      },
      {
        q: "На каких языках работает Волк?",
        a: "Сейчас основной язык русский, но часть инструментов уже поддерживает английский. Добавляем локали по запросу.",
        open: false
      },
      {
        q: "Как проект монетизируется?",
        a: "Легкая нативная реклама и партнерские интеграции. Никаких агрессивных баннеров и трекинга.",
        open: false
      }
    ]);
    const activeSection = ref(tocItems[0].id);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "about-page" }, _attrs))} data-v-cc5afb5f><div class="pill" data-v-cc5afb5f><span data-v-cc5afb5f>Делается силами одного волка</span><strong data-v-cc5afb5f>О проекте</strong></div><div class="about-grid" data-v-cc5afb5f><div class="about-main" data-v-cc5afb5f><article class="card about-hero" id="mission" data-v-cc5afb5f><div class="hero-head" data-v-cc5afb5f><h1 class="section-title" data-v-cc5afb5f>О проекте</h1><p class="section-lead" data-v-cc5afb5f> Каталог бесплатных инструментов, игр, расчетов и автоматизаций, который собирает Нейронный Волк. </p></div><div class="stats hero-stats" data-v-cc5afb5f><div class="stat" data-v-cc5afb5f><div class="stat-icon" data-v-cc5afb5f>🧰</div><div data-v-cc5afb5f><h4 data-v-cc5afb5f>100+ инструментов</h4><p data-v-cc5afb5f>Игры, генераторы, решения для быстрых вопросов.</p></div></div><div class="stat" data-v-cc5afb5f><div class="stat-icon" data-v-cc5afb5f>🌙</div><div data-v-cc5afb5f><h4 data-v-cc5afb5f>24/7 работаем</h4><p data-v-cc5afb5f>Сервис всегда под рукой и без очереди.</p></div></div><div class="stat" data-v-cc5afb5f><div class="stat-icon" data-v-cc5afb5f>🐺</div><div data-v-cc5afb5f><h4 data-v-cc5afb5f>50k+ пользователей</h4><p data-v-cc5afb5f>Сообщество, которое любит живые инструменты.</p></div></div></div></article><article class="card section-card" data-v-cc5afb5f><div class="section-header" data-v-cc5afb5f><div class="tag" data-v-cc5afb5f>Зачем мы это делаем</div><h3 data-v-cc5afb5f>Чтобы решать быстро, играть смело и не тонуть в бюрократии</h3><p class="muted" data-v-cc5afb5f> Волк собирает место, где всё работает без лишних барьеров: минимум кликов, максимум пользы. Здесь живут игровые механики, генераторы и подсказки, которые реально экономят время. </p></div><div class="mission-grid" data-v-cc5afb5f><div class="mission-left" data-v-cc5afb5f><ul class="icon-list" data-v-cc5afb5f><!--[-->`);
      ssrRenderList(missionPoints, (item) => {
        _push(`<li data-v-cc5afb5f><span class="icon" data-v-cc5afb5f>${ssrInterpolate(item.icon)}</span><div data-v-cc5afb5f><strong data-v-cc5afb5f>${ssrInterpolate(item.title)}</strong><p class="muted" data-v-cc5afb5f>${ssrInterpolate(item.text)}</p></div></li>`);
      });
      _push(`<!--]--></ul></div><div class="mission-right" data-v-cc5afb5f><div class="tech-grid" data-v-cc5afb5f><!--[-->`);
      ssrRenderList(techCards, (tech) => {
        _push(`<div class="mini-card" data-v-cc5afb5f><div class="mini-card__icon" data-v-cc5afb5f>${ssrInterpolate(tech.icon)}</div><div class="mini-card__title" data-v-cc5afb5f>${ssrInterpolate(tech.title)}</div><p class="muted mini-card__text" data-v-cc5afb5f>${ssrInterpolate(tech.text)}</p></div>`);
      });
      _push(`<!--]--></div></div></div></article><article class="card section-card" id="ads" data-v-cc5afb5f><div class="section-header" data-v-cc5afb5f><div class="tag" data-v-cc5afb5f>Реклама и поддержка</div><h3 data-v-cc5afb5f>Помоги волку расти — расскажем о твоём продукте</h3><p class="muted" data-v-cc5afb5f> Мы выбираем партнеров, которые резонируют с философией проекта: честно, полезно, без навязчивости. </p></div><div class="grid three" data-v-cc5afb5f><!--[-->`);
      ssrRenderList(supportCards, (card) => {
        _push(`<div class="mini-card" data-v-cc5afb5f><div class="mini-card__icon" data-v-cc5afb5f>${ssrInterpolate(card.icon)}</div><div class="mini-card__title" data-v-cc5afb5f>${ssrInterpolate(card.title)}</div><p class="muted mini-card__text" data-v-cc5afb5f>${ssrInterpolate(card.text)}</p><ul class="bullet-list" data-v-cc5afb5f><!--[-->`);
        ssrRenderList(card.points, (point) => {
          _push(`<li data-v-cc5afb5f>${ssrInterpolate(point)}</li>`);
        });
        _push(`<!--]--></ul></div>`);
      });
      _push(`<!--]--></div><div class="cta-card" data-v-cc5afb5f><div data-v-cc5afb5f><h4 data-v-cc5afb5f>Обсудим сотрудничество</h4><p class="muted" data-v-cc5afb5f>Расскажи, что хочешь продвинуть, и мы предложим формат.</p></div><a class="btn" href="https://t.me/neural_wolf" target="_blank" rel="noreferrer" data-v-cc5afb5f>Написать в Telegram</a></div></article><article class="card section-card" id="socials" data-v-cc5afb5f><div class="section-header" data-v-cc5afb5f><div class="tag" data-v-cc5afb5f>Где нас найти</div><h3 data-v-cc5afb5f>Подпишись, чтобы не пропустить новые фишки</h3><p class="muted" data-v-cc5afb5f>Каналы, бот, соцсети и поддержка — Волк на связи в удобном месте.</p></div><div class="grid two socials-grid" data-v-cc5afb5f><!--[-->`);
      ssrRenderList(socials, (social) => {
        _push(`<a class="social-card"${ssrRenderAttr("href", social.href)} target="_blank" rel="noreferrer" data-v-cc5afb5f><div class="social-card__icon" data-v-cc5afb5f>${ssrInterpolate(social.icon)}</div><div data-v-cc5afb5f><div class="social-card__title" data-v-cc5afb5f>${ssrInterpolate(social.title)}</div><p class="muted social-card__text" data-v-cc5afb5f>${ssrInterpolate(social.text)}</p><span class="status" data-v-cc5afb5f>${ssrInterpolate(social.status)}</span></div><span class="social-card__arrow" data-v-cc5afb5f>↗</span></a>`);
      });
      _push(`<!--]--></div></article><article class="card section-card" id="faq" data-v-cc5afb5f><div class="section-header" data-v-cc5afb5f><div class="tag" data-v-cc5afb5f>FAQ</div><h3 data-v-cc5afb5f>Вопросы, которые задают чаще всего</h3></div><div class="faq-list" data-v-cc5afb5f><!--[-->`);
      ssrRenderList(faqItems.value, (item, idx) => {
        _push(`<div class="${ssrRenderClass([{ open: item.open }, "faq-item"])}" data-v-cc5afb5f><button class="faq-trigger" type="button" data-v-cc5afb5f><span data-v-cc5afb5f>${ssrInterpolate(item.q)}</span><span class="faq-icon" data-v-cc5afb5f>${ssrInterpolate(item.open ? "−" : "+")}</span></button>`);
        if (item.open) {
          _push(`<p class="faq-answer muted" data-v-cc5afb5f>${ssrInterpolate(item.a)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></article></div><aside class="toc-card" data-v-cc5afb5f><div class="toc-inner" data-v-cc5afb5f><div class="toc-title" data-v-cc5afb5f>Оглавление</div><nav class="toc-nav" data-v-cc5afb5f><!--[-->`);
      ssrRenderList(tocItems, (item) => {
        _push(`<button class="${ssrRenderClass([{ active: activeSection.value === item.id }, "toc-link"])}" type="button" data-v-cc5afb5f>${ssrInterpolate(item.label)}</button>`);
      });
      _push(`<!--]--></nav></div></aside></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const about = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cc5afb5f"]]);
export {
  about as default
};
//# sourceMappingURL=about-CDrzkVyE.js.map
