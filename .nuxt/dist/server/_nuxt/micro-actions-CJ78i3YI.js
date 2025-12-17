import { ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { S as SocialPopup } from "./SocialPopup-C9eZeUoF.js";
import { _ as _export_sfc } from "../server.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/hookable/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/unctx/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/radix3/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/defu/dist/defu.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/ufo/dist/index.mjs";
const microCategories = [
  {
    id: "impulse",
    label: "Импульс",
    icon: "⚡",
    description: "Быстрый толчок, чтобы проснуться",
    actions: [
      "Сделай 15 приседаний без музыки",
      "Напиши другу одну честную фразу и отправь",
      "Умойся холодной водой и сделай глубокий вдох",
      "Открой окно и подыши 60 секунд, глядя вдаль",
      "Сделай 20 отжиманий, если не можешь — столько, сколько выйдет"
    ]
  },
  {
    id: "switch",
    label: "Переключение",
    icon: "🧠",
    description: "Меняем контекст, чтобы мозг ожил",
    actions: [
      "Сменить плейлист: включи жанр, который редко слушаешь",
      "Выйди на улицу и дойди до ближайшего угла, считая шаги",
      "Сделай 3 фото необычных деталей вокруг",
      "Запиши голосом одну идею, что сделать сегодня",
      "Сядь и 2 минуты смотри на потолок, без телефона"
    ]
  },
  {
    id: "wolfstep",
    label: "Волчий шаг",
    icon: "🐺",
    description: "Движение вперед в свой ритм",
    actions: [
      "Набери воду, сделай пару глотков и закрой задачу, что откладывал 5 минут",
      "Убери одну вещь со стола или из комнаты",
      "Сделай план на ближайшие 30 минут из 3 пунктов",
      "Запиши цель на день одним предложением и поставь себе напоминание",
      "Надень обувь и выйди пройтись вокруг дома или подъезда"
    ]
  }
];
const _sfc_main = {
  __name: "micro-actions",
  __ssrInlineRender: true,
  setup(__props) {
    const categories = microCategories;
    const gameStarted = ref(false);
    const activeCategory = ref(categories[0].id);
    const currentAction = ref("");
    ref({ impulse: -1, switch: -1, wolfstep: -1 });
    const isAnimating = ref(false);
    const feedback = ref("");
    ref(0);
    const showPopup = ref(false);
    const popupIndex = ref(0);
    const currentCategoryLabel = computed(() => {
      const item = categories.find((c) => c.id === activeCategory.value);
      return item ? item.label : activeCategory.value;
    });
    const socials = [
      {
        title: "Подпишись на Telegram",
        text: "Куча мемов, всё самое свежее тут",
        cta: "Перейти в логово",
        link: "https://t.me/neural_wise_wolf",
        emoji: "🐺"
      },
      {
        title: "Залетай в Instagram",
        text: "Самое первое и большое сообщество, много мемов с волками",
        cta: "Открыть Instagram",
        link: "https://instagram.com/neural_wise_wolf/",
        emoji: "📸"
      },
      {
        title: "TikTok Волка",
        text: "Мемы, стримы и много волков",
        cta: "Смотреть TikTok",
        link: "https://www.tiktok.com/@neural_wolf",
        emoji: "🎥"
      },
      {
        title: "YouTube канал",
        text: "Шортсы и длинные видосы с волками",
        cta: "Открыть YouTube",
        link: "https://www.youtube.com/@neural_wolf",
        emoji: "▶️"
      }
    ];
    const popupPayload = computed(() => socials[popupIndex.value % socials.length]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "tod-page" }, _attrs))} data-v-5b5bedb6><div class="tod-container" data-v-5b5bedb6>`);
      if (!gameStarted.value) {
        _push(`<div class="tod-intro" data-v-5b5bedb6><h1 class="tod-title" data-v-5b5bedb6>Микро действие</h1><p class="tod-subtitle" data-v-5b5bedb6>1–5 минут, чтобы сдвинуться с места. Жми и действуй прямо сейчас.</p><button class="tod-btn tod-btn-primary" data-v-5b5bedb6>Дать действие</button><p class="tod-hint" data-v-5b5bedb6>Выбираем случайное действие сразу после старта.</p></div>`);
      } else {
        _push(`<div class="tod-game" data-v-5b5bedb6><div class="tod-modes" data-v-5b5bedb6><!--[-->`);
        ssrRenderList(unref(categories), (cat) => {
          _push(`<button class="${ssrRenderClass([{ "tod-chip-active": activeCategory.value === cat.id }, "tod-chip"])}" data-v-5b5bedb6><span class="tod-chip-label" data-v-5b5bedb6><span class="tod-chip-icon" data-v-5b5bedb6>${ssrInterpolate(cat.icon)}</span> ${ssrInterpolate(cat.label)}</span><span class="tod-chip-desc" data-v-5b5bedb6>${ssrInterpolate(cat.description)}</span></button>`);
        });
        _push(`<!--]--></div><div class="tod-card" data-v-5b5bedb6><div class="tod-label" data-v-5b5bedb6><span data-v-5b5bedb6>микро действие</span>, <span data-v-5b5bedb6>${ssrInterpolate(currentCategoryLabel.value)}</span></div><div class="${ssrRenderClass([{ "tod-question-animate": isAnimating.value }, "tod-question-text"])}" data-v-5b5bedb6>${ssrInterpolate(currentAction.value)}</div>`);
        if (feedback.value) {
          _push(`<p class="tod-wolf-hint" data-v-5b5bedb6><span class="tod-wolf-hint-strong" data-v-5b5bedb6>${ssrInterpolate(feedback.value)}</span></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="tod-actions" data-v-5b5bedb6><div class="tod-buttons" data-v-5b5bedb6><button class="tod-btn tod-btn-ghost" data-v-5b5bedb6>Другое</button><button class="tod-btn tod-btn-primary" data-v-5b5bedb6>Сделал</button></div></div></div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(SocialPopup, {
        visible: showPopup.value,
        payload: popupPayload.value,
        onClose: ($event) => showPopup.value = false
      }, null, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/decisions/micro-actions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const microActions = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5b5bedb6"]]);
export {
  microActions as default
};
//# sourceMappingURL=micro-actions-CJ78i3YI.js.map
