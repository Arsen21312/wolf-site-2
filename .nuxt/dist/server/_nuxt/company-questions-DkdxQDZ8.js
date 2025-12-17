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
const companyCategories = [
  {
    id: "pair",
    label: "На пару",
    description: "Чтобы разогреть разговор вдвоём",
    questions: [
      "Какой момент из детства ты вспоминаешь чаще всего",
      "Что ты хотел бы попробовать, но пока не решаешься",
      "Когда ты в последний раз искренне удивлялся и чему",
      "Что в людях притягивает сильнее всего",
      "Какой запах мгновенно переносит тебя в прошлое",
      "Чему ты научился за последний год",
      "Когда ты в последний раз делал что-то в первый раз",
      "Что ты готов оставить в прошлом навсегда",
      "Какой комплимент тебе запомнился больше всего",
      "Если бы был один выходной без ограничений, как бы ты его прожил"
    ]
  },
  {
    id: "group",
    label: "На компанию",
    description: "Для тёплой беседы в кругу",
    questions: [
      "Какое безумие ты бы сделал, если бы знал, что всё сойдёт с рук",
      "Какой лучший совет ты получал от друзей",
      "Какая мелочь сегодня подняла тебе настроение",
      "Кто из вас чаще всего берёт на себя инициативу и почему",
      "Какое совместное событие хочется повторить",
      "Что в вашей компании самое ценное",
      "Какая привычка у тебя самая странная",
      "Какой фильм или книга изменили твоё отношение к жизни",
      "Если бы вы записали подкаст, о чём был бы первый выпуск",
      "Чего сейчас больше всего не хватает этой встрече"
    ]
  }
];
const _sfc_main = {
  __name: "company-questions",
  __ssrInlineRender: true,
  setup(__props) {
    const categories = companyCategories;
    const gameStarted = ref(false);
    const activeCategory = ref(categories[0].id);
    const currentQuestion = ref("");
    ref({ pair: -1, group: -1 });
    const isAnimating = ref(false);
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
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "tod-page" }, _attrs))} data-v-90dc0705><div class="tod-container" data-v-90dc0705>`);
      if (!gameStarted.value) {
        _push(`<div class="tod-intro" data-v-90dc0705><h1 class="tod-title" data-v-90dc0705>Вопросы для компании</h1><p class="tod-subtitle" data-v-90dc0705>Короткие вопросы, чтобы разогреть разговор: вдвоём или всей стаей.</p><button class="tod-btn tod-btn-primary" data-v-90dc0705>Дать вопрос</button><p class="tod-hint" data-v-90dc0705>Сразу выдадим первый вопрос после старта.</p></div>`);
      } else {
        _push(`<div class="tod-game" data-v-90dc0705><div class="tod-modes" data-v-90dc0705><!--[-->`);
        ssrRenderList(unref(categories), (cat) => {
          _push(`<button class="${ssrRenderClass([{ "tod-chip-active": activeCategory.value === cat.id }, "tod-chip"])}" data-v-90dc0705><span class="tod-chip-label" data-v-90dc0705>${ssrInterpolate(cat.label)}</span><span class="tod-chip-desc" data-v-90dc0705>${ssrInterpolate(cat.description)}</span></button>`);
        });
        _push(`<!--]--></div><div class="tod-card" data-v-90dc0705><div class="tod-label" data-v-90dc0705><span data-v-90dc0705>вопрос</span>, <span data-v-90dc0705>${ssrInterpolate(currentCategoryLabel.value)}</span></div><div class="${ssrRenderClass([{ "tod-question-animate": isAnimating.value }, "tod-question-text"])}" data-v-90dc0705>${ssrInterpolate(currentQuestion.value)}</div></div><div class="tod-actions" data-v-90dc0705><div class="tod-buttons" data-v-90dc0705><button class="tod-btn tod-btn-ghost" data-v-90dc0705>Другое</button><button class="tod-btn tod-btn-primary" data-v-90dc0705>Спросить</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/decisions/company-questions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const companyQuestions = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-90dc0705"]]);
export {
  companyQuestions as default
};
//# sourceMappingURL=company-questions-DkdxQDZ8.js.map
