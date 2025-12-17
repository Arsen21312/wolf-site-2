import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { ref, reactive, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "coin-flip",
  __ssrInlineRender: true,
  setup(__props) {
    const result = ref(null);
    const isFlipping = ref(false);
    const counts = reactive({ heads: 0, tails: 0, total: 0 });
    ref(0);
    const coinImages = {
      heads: new URL("@/assets/images/heads.png", globalThis._importMeta_.url).href,
      tails: new URL("@/assets/images/tails.png", globalThis._importMeta_.url).href
    };
    const resultLabel = computed(() => {
      if (result.value === "heads") return "\u041E\u0440\u0451\u043B";
      if (result.value === "tails") return "\u0420\u0435\u0448\u043A\u0430";
      return "\u041C\u043E\u043D\u0435\u0442\u0430";
    });
    const currentCoinImage = computed(() => coinImages[result.value || "heads"]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "coin-page" }, _attrs))} data-v-12866328><section class="coin-hero" data-v-12866328><div class="pill" data-v-12866328><span data-v-12866328>\u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442</span><strong data-v-12866328>\u041C\u043E\u043D\u0435\u0442\u043A\u0430</strong></div><h1 data-v-12866328>\u0411\u0440\u043E\u0441\u043E\u043A \u043C\u043E\u043D\u0435\u0442\u044B</h1><p class="lead" data-v-12866328> \u041E\u0440\u0451\u043B \u0438\u043B\u0438 \u0440\u0435\u0448\u043A\u0430? \u041F\u043E\u0434\u0431\u0440\u043E\u0441\u044C \u043C\u043E\u043D\u0435\u0442\u0443 \u043E\u043D\u043B\u0430\u0439\u043D, \u0447\u0442\u043E\u0431\u044B \u0440\u0435\u0448\u0438\u0442\u044C \u0441\u043F\u043E\u0440, \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0432\u0430\u0440\u0438\u0430\u043D\u0442 \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0443\u0434\u0430\u0447\u0443. </p></section><section class="coin-card" data-v-12866328><div class="coin-visual" data-v-12866328><div class="${ssrRenderClass([{ flipping: isFlipping.value }, "coin"])}" data-v-12866328><img${ssrRenderAttr("src", currentCoinImage.value)}${ssrRenderAttr("alt", resultLabel.value)} data-v-12866328></div><button class="btn primary"${ssrIncludeBooleanAttr(isFlipping.value) ? " disabled" : ""} data-v-12866328>${ssrInterpolate(isFlipping.value ? "\u0411\u0440\u043E\u0441\u0430\u0435\u043C..." : "\u041F\u043E\u0434\u0431\u0440\u043E\u0441\u0438\u0442\u044C")}</button></div><div class="coin-stats" data-v-12866328><div class="stat" data-v-12866328><span class="stat-label" data-v-12866328>\u041E\u0440\u0451\u043B</span><span class="stat-value" data-v-12866328>${ssrInterpolate(counts.heads)}</span></div><div class="stat" data-v-12866328><span class="stat-label" data-v-12866328>\u0420\u0435\u0448\u043A\u0430</span><span class="stat-value" data-v-12866328>${ssrInterpolate(counts.tails)}</span></div><div class="stat" data-v-12866328><span class="stat-label" data-v-12866328>\u0412\u0441\u0435\u0433\u043E</span><span class="stat-value" data-v-12866328>${ssrInterpolate(counts.total)}</span></div></div>`);
      if (result.value) {
        _push(`<p class="result" data-v-12866328> \u0412\u044B\u043F\u0430\u043B\u043E: <strong data-v-12866328>${ssrInterpolate(resultLabel.value)}</strong></p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="benefits" data-v-12866328><h2 data-v-12866328>\u0417\u0430\u0447\u0435\u043C \u043D\u0443\u0436\u043D\u0430 \u043C\u043E\u043D\u0435\u0442\u043A\u0430</h2><div class="grid three" data-v-12866328><article class="card" data-v-12866328><h3 data-v-12866328>\u0427\u0435\u0441\u0442\u043D\u043E</h3><p data-v-12866328>\u041A\u0440\u0438\u043F\u0442\u043E\u0440\u0430\u043D\u0434\u043E\u043C, \u043D\u0438\u043A\u0430\u043A\u043E\u0439 \u043F\u043E\u0434\u0442\u0430\u0441\u043E\u0432\u043A\u0438. \u0420\u0435\u0448\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u043D\u0438\u043C\u0430\u0435\u0442 \u043C\u043E\u043D\u0435\u0442\u0430, \u0430 \u043D\u0435 \u043A\u0442\u043E-\u0442\u043E \u0438\u0437 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438.</p></article><article class="card" data-v-12866328><h3 data-v-12866328>\u0411\u044B\u0441\u0442\u0440\u043E</h3><p data-v-12866328>\u041F\u043E\u0434\u0431\u043E\u0440 \u0441\u0442\u043E\u0440\u043E\u043D\u044B \u0437\u0430 \u043F\u0430\u0440\u0443 \u0441\u0435\u043A\u0443\u043D\u0434. \u041F\u043E\u043B\u0435\u0437\u043D\u043E, \u043A\u043E\u0433\u0434\u0430 \u0441\u043F\u043E\u0440\u0438\u0442\u044C \u0443\u0436\u0435 \u043D\u0435 \u0445\u043E\u0447\u0435\u0442\u0441\u044F.</p></article><article class="card" data-v-12866328><h3 data-v-12866328>\u0411\u0435\u0441\u043A\u043E\u043D\u0435\u0447\u043D\u043E</h3><p data-v-12866328>\u0411\u0440\u043E\u0441\u0430\u0439 \u043C\u043E\u043D\u0435\u0442\u0443 \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0443\u0433\u043E\u0434\u043D\u043E \u2014 \u0441\u0447\u0451\u0442\u0447\u0438\u043A\u0438 \u043F\u043E\u043A\u0430\u0436\u0443\u0442 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0443 \u0438 \u043F\u043E\u043C\u043E\u0433\u0443\u0442 \u043E\u0442\u0441\u043B\u0435\u0434\u0438\u0442\u044C \u0443\u0434\u0430\u0447\u0443.</p></article></div></section><section class="faq" data-v-12866328><div class="faq-text" data-v-12866328><h2 data-v-12866328>\u041A\u0430\u043A \u044D\u0442\u043E \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442</h2><p data-v-12866328> \u041C\u043E\u043D\u0435\u0442\u0430 \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u0441\u0442\u043E\u0440\u043E\u043D\u0443 \u0447\u0435\u0440\u0435\u0437 <code data-v-12866328>crypto.getRandomValues</code>, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439. \u0410\u043D\u0438\u043C\u0430\u0446\u0438\u044F \u043A\u0440\u0443\u0442\u0438\u0442\u0441\u044F \u043C\u0435\u043D\u044C\u0448\u0435 \u0441\u0435\u043A\u0443\u043D\u0434\u044B, \u043F\u043E\u0442\u043E\u043C \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0438\u0442\u043E\u0433. </p><p data-v-12866328> \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439 \u043C\u043E\u043D\u0435\u0442\u043A\u0443, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u0438\u043D\u044F\u0442\u044C \u0440\u0435\u0448\u0435\u043D\u0438\u0435, \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0444\u0438\u043B\u044C\u043C, \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u043F\u043E\u0440\u044F\u0434\u043E\u043A \u0445\u043E\u0434\u0430 \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0442\u043E \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0443\u0434\u0430\u0447\u0443. \u041A\u043D\u043E\u043F\u043A\u0430 \xAB\u041F\u043E\u0434\u0431\u0440\u043E\u0441\u0438\u0442\u044C\xBB \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430 \u0431\u0435\u0441\u043A\u043E\u043D\u0435\u0447\u043D\u043E \u2014 \u043C\u043E\u0436\u0435\u0448\u044C \u0431\u0440\u043E\u0441\u0430\u0442\u044C \u0434\u043E \u043F\u043E\u0431\u0435\u0434\u043D\u043E\u0433\u043E. </p></div></section></div>`);
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

export { coinFlip as default };
//# sourceMappingURL=coin-flip-D39-TnWa.mjs.map
