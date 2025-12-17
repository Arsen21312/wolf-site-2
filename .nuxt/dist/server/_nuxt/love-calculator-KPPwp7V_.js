import { ref, resolveComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from "vue/server-renderer";
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
  __name: "love-calculator",
  __ssrInlineRender: true,
  setup(__props) {
    const name1 = ref("");
    const name2 = ref("");
    const score = ref(null);
    const message = ref("");
    const hasResult = ref(false);
    useHead({
      title: "Калькулятор любви | Neural Wise Wolf",
      meta: [
        {
          name: "description",
          content: "Забавный онлайн калькулятор любви. Введите два имени и узнайте процент совместимости."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NavBar = resolveComponent("NavBar");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "decisions-page flex flex-col gap-10 pb-16" }, _attrs))} data-v-1052f9d9>`);
      _push(ssrRenderComponent(_component_NavBar, null, null, _parent));
      _push(`<section class="page-center gap-4" data-v-1052f9d9><div class="pill-hero" data-v-1052f9d9>Инструмент · Развлечения</div><h1 class="hero-title" data-v-1052f9d9>Калькулятор любви</h1><p class="hero-sub" data-v-1052f9d9> Узнайте, насколько вы подходите друг другу. Введите два имени и получите волчий вердикт в процентах. </p></section><section class="page-center" data-v-1052f9d9><div class="calc-card" data-v-1052f9d9><div class="inputs" data-v-1052f9d9><div class="field" data-v-1052f9d9><label data-v-1052f9d9>Имя 1</label><input${ssrRenderAttr("value", name1.value)} type="text" placeholder="Введите имя" data-v-1052f9d9></div><div class="field" data-v-1052f9d9><label data-v-1052f9d9>Имя 2</label><input${ssrRenderAttr("value", name2.value)} type="text" placeholder="Введите имя" data-v-1052f9d9></div></div><div class="cta-center" data-v-1052f9d9><button class="btn primary calc-btn" data-v-1052f9d9>❤️ Рассчитать</button></div>`);
      if (hasResult.value) {
        _push(`<div class="result-box" data-v-1052f9d9><p class="result-title" data-v-1052f9d9>Ваш процент совместимости</p><div class="result-score" data-v-1052f9d9>${ssrInterpolate(score.value)}%</div><p class="result-message" data-v-1052f9d9>${ssrInterpolate(message.value)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><section class="max-w-6xl mx-auto w-full flex flex-col gap-4" data-v-1052f9d9><h2 class="text-2xl font-bold text-white text-center" data-v-1052f9d9>Почему это удобно</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-v-1052f9d9><article class="feature-card" data-v-1052f9d9><h3 data-v-1052f9d9>Быстрый результат</h3><p data-v-1052f9d9>Пара кликов и вы уже видите процент совместимости.</p></article><article class="feature-card" data-v-1052f9d9><h3 data-v-1052f9d9>Просто и весело</h3><p data-v-1052f9d9>Подходит для мемов, вечеринок и лёгких шуток с друзьями.</p></article><article class="feature-card" data-v-1052f9d9><h3 data-v-1052f9d9>Неожиданные комбинации</h3><p data-v-1052f9d9>Детерминированный расчёт даёт одинаковый результат для одинаковых имён.</p></article><article class="feature-card" data-v-1052f9d9><h3 data-v-1052f9d9>Всегда под рукой</h3><p data-v-1052f9d9>Работает в браузере, без регистрации и лишних действий.</p></article></div></section><section class="max-w-6xl mx-auto w-full" data-v-1052f9d9><div class="prose prose-invert prose-headings:text-white prose-p:text-slate-200 prose-li:text-slate-200 max-w-none" data-v-1052f9d9><h2 data-v-1052f9d9>Что такое калькулятор любви</h2><p data-v-1052f9d9>Это маленький онлайн-инструмент для развлечения: введите два имени и получите процент совместимости.</p><p data-v-1052f9d9>Он не претендует на серьёзную психологию и создан для лёгких моментов — мемы, тосты, вечеринки, чат с друзьями.</p><h3 data-v-1052f9d9>Как работает</h3><p data-v-1052f9d9>Мы соединяем два имени, считаем сумму кодов символов и преобразуем её в процент от 1 до 100. Одинаковые имена всегда дают одинаковый результат.</p><h3 data-v-1052f9d9>Можно ли верить результату</h3><p data-v-1052f9d9>Относитесь как к весёлому гаджету. Решения в жизни принимайте сердцем и головой, а калькулятор оставьте для шуток.</p><h3 data-v-1052f9d9>FAQ</h3><ul data-v-1052f9d9><li data-v-1052f9d9><strong data-v-1052f9d9>Нужно ли вводить фамилию?</strong> Нет, достаточно имён.</li><li data-v-1052f9d9><strong data-v-1052f9d9>Храните ли вы данные?</strong> Нет, расчёт происходит на клиенте, ничего не сохраняется.</li><li data-v-1052f9d9><strong data-v-1052f9d9>Работает ли офлайн?</strong> После загрузки страницы — да, логика полностью на фронтенде.</li></ul></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/decisions/love-calculator.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const loveCalculator = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1052f9d9"]]);
export {
  loveCalculator as default
};
//# sourceMappingURL=love-calculator-KPPwp7V_.js.map
