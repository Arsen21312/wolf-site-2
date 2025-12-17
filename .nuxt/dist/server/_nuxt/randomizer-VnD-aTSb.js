import { ref, reactive, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
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
const _sfc_main = {
  __name: "randomizer",
  __ssrInlineRender: true,
  setup(__props) {
    const modes = [
      { id: "number", label: "Число" },
      { id: "list", label: "Список" },
      { id: "yesno", label: "Да / нет" }
    ];
    const mode = ref("number");
    const range = reactive({ min: 1, max: 100 });
    const listInput = ref("");
    const result = ref("");
    computed(
      () => listInput.value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rand-page" }, _attrs))} data-v-3c8b4f78><section class="rand-hero" data-v-3c8b4f78><div class="pill" data-v-3c8b4f78><span data-v-3c8b4f78>Инструмент</span><strong data-v-3c8b4f78>Колесо решений</strong></div><h1 data-v-3c8b4f78>Рандомайзер</h1><p class="lead" data-v-3c8b4f78> Когда идей много, а выбрать сложно. Колесо сделает это за вас: случайное число, слово из списка или простой ответ «да / нет». </p></section><section class="mode-bar" data-v-3c8b4f78><div class="mode-switch" data-v-3c8b4f78><!--[-->`);
      ssrRenderList(modes, (m) => {
        _push(`<button class="${ssrRenderClass([{ active: mode.value === m.id }, "mode-btn"])}" data-v-3c8b4f78>${ssrInterpolate(m.label)}</button>`);
      });
      _push(`<!--]--></div></section><section class="rand-card" data-v-3c8b4f78><div class="mode-body" data-v-3c8b4f78>`);
      if (mode.value === "number") {
        _push(`<!--[--><div class="field-row" data-v-3c8b4f78><label data-v-3c8b4f78> От <input${ssrRenderAttr("value", range.min)} type="number" data-v-3c8b4f78></label><label data-v-3c8b4f78> До <input${ssrRenderAttr("value", range.max)} type="number" data-v-3c8b4f78></label></div><p class="hint" data-v-3c8b4f78>Укажи границы, и мы выберем любое число внутри диапазона.</p><!--]-->`);
      } else if (mode.value === "list") {
        _push(`<label class="full" data-v-3c8b4f78> Вставь варианты через запятую или с новой строки, мы выберем один из них <textarea rows="4" placeholder="пицца
бургер
роллы" data-v-3c8b4f78>${ssrInterpolate(listInput.value)}</textarea></label>`);
      } else {
        _push(`<p class="hint" data-v-3c8b4f78>Простой рандом: «да» или «нет» — решает за пару секунд.</p>`);
      }
      if (result.value) {
        _push(`<div class="result" data-v-3c8b4f78><span class="result-label" data-v-3c8b4f78>Результат:</span><span class="result-value" data-v-3c8b4f78>${ssrInterpolate(result.value)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><div class="action-bar" data-v-3c8b4f78><button class="btn primary" data-v-3c8b4f78>Сгенерировать</button></div><section class="benefits" data-v-3c8b4f78><h2 data-v-3c8b4f78>Зачем этот рандомайзер</h2>Выбор без споров <div class="grid three" data-v-3c8b4f78><article class="card" data-v-3c8b4f78><h3 data-v-3c8b4f78>Универсально</h3><p data-v-3c8b4f78>Числа, список слов или простой «да / нет» — под любую задачу, от выбора фильма до жеребьёвки.</p></article><article class="card" data-v-3c8b4f78><h3 data-v-3c8b4f78>Честно</h3><p data-v-3c8b4f78>crypto.getRandomValues вместо подбрасываний монет и споров. Результат максимально случайный.</p></article><article class="card" data-v-3c8b4f78><h3 data-v-3c8b4f78>Быстро</h3><p data-v-3c8b4f78>Пара кликов — и готово. Можно крутить бесконечно, пока не найдёте идеальный вариант.</p></article></div></section><section class="faq" data-v-3c8b4f78><div class="faq-text" data-v-3c8b4f78><h2 data-v-3c8b4f78>FAQ</h2><p data-v-3c8b4f78>Нужен только браузер: всё работает сразу, без регистрации и сторонних сервисов.</p><p data-v-3c8b4f78>Для списков можно вставлять варианты в столбик или через запятую — мы почистим лишние пробелы.</p><p data-v-3c8b4f78>Результат не хранится и не кэшируется: каждый клик — новый случайный выбор.</p></div></section><section class="cta" data-v-3c8b4f78><div class="cta-box card" data-v-3c8b4f78><div data-v-3c8b4f78><p class="seo-kicker" data-v-3c8b4f78>Выбор без споров</p><h3 data-v-3c8b4f78>Запусти колесо и реши за 5 секунд</h3></div><button class="btn primary" data-v-3c8b4f78>Сгенерировать снова</button></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/decisions/randomizer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const randomizer = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3c8b4f78"]]);
export {
  randomizer as default
};
//# sourceMappingURL=randomizer-VnD-aTSb.js.map
