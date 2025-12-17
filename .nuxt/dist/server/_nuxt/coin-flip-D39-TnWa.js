import { ref, reactive, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
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
  __name: "coin-flip",
  __ssrInlineRender: true,
  setup(__props) {
    const result = ref(null);
    const isFlipping = ref(false);
    const counts = reactive({ heads: 0, tails: 0, total: 0 });
    ref(0);
    const coinImages = {
      heads: new URL("@/assets/images/heads.png", import.meta.url).href,
      tails: new URL("@/assets/images/tails.png", import.meta.url).href
    };
    const resultLabel = computed(() => {
      if (result.value === "heads") return "Орёл";
      if (result.value === "tails") return "Решка";
      return "Монета";
    });
    const currentCoinImage = computed(() => coinImages[result.value || "heads"]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "coin-page" }, _attrs))} data-v-12866328><section class="coin-hero" data-v-12866328><div class="pill" data-v-12866328><span data-v-12866328>Инструмент</span><strong data-v-12866328>Монетка</strong></div><h1 data-v-12866328>Бросок монеты</h1><p class="lead" data-v-12866328> Орёл или решка? Подбрось монету онлайн, чтобы решить спор, выбрать вариант или просто проверить удачу. </p></section><section class="coin-card" data-v-12866328><div class="coin-visual" data-v-12866328><div class="${ssrRenderClass([{ flipping: isFlipping.value }, "coin"])}" data-v-12866328><img${ssrRenderAttr("src", currentCoinImage.value)}${ssrRenderAttr("alt", resultLabel.value)} data-v-12866328></div><button class="btn primary"${ssrIncludeBooleanAttr(isFlipping.value) ? " disabled" : ""} data-v-12866328>${ssrInterpolate(isFlipping.value ? "Бросаем..." : "Подбросить")}</button></div><div class="coin-stats" data-v-12866328><div class="stat" data-v-12866328><span class="stat-label" data-v-12866328>Орёл</span><span class="stat-value" data-v-12866328>${ssrInterpolate(counts.heads)}</span></div><div class="stat" data-v-12866328><span class="stat-label" data-v-12866328>Решка</span><span class="stat-value" data-v-12866328>${ssrInterpolate(counts.tails)}</span></div><div class="stat" data-v-12866328><span class="stat-label" data-v-12866328>Всего</span><span class="stat-value" data-v-12866328>${ssrInterpolate(counts.total)}</span></div></div>`);
      if (result.value) {
        _push(`<p class="result" data-v-12866328> Выпало: <strong data-v-12866328>${ssrInterpolate(resultLabel.value)}</strong></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="benefits" data-v-12866328><h2 data-v-12866328>Зачем нужна монетка</h2><div class="grid three" data-v-12866328><article class="card" data-v-12866328><h3 data-v-12866328>Честно</h3><p data-v-12866328>Крипторандом, никакой подтасовки. Решение принимает монета, а не кто-то из компании.</p></article><article class="card" data-v-12866328><h3 data-v-12866328>Быстро</h3><p data-v-12866328>Подбор стороны за пару секунд. Полезно, когда спорить уже не хочется.</p></article><article class="card" data-v-12866328><h3 data-v-12866328>Бесконечно</h3><p data-v-12866328>Бросай монету сколько угодно — счётчики покажут статистику и помогут отследить удачу.</p></article></div></section><section class="faq" data-v-12866328><div class="faq-text" data-v-12866328><h2 data-v-12866328>Как это работает</h2><p data-v-12866328> Монета выбирает сторону через <code data-v-12866328>crypto.getRandomValues</code>, поэтому результат максимально случайный. Анимация крутится меньше секунды, потом показывается итог. </p><p data-v-12866328> Используй монетку, чтобы принять решение, выбрать фильм, определить порядок хода или просто проверить удачу. Кнопка «Подбросить» доступна бесконечно — можешь бросать до победного. </p></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/decisions/coin-flip.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const coinFlip = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-12866328"]]);
export {
  coinFlip as default
};
//# sourceMappingURL=coin-flip-D39-TnWa.js.map
