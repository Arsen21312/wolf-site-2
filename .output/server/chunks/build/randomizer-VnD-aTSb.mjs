import { ref, reactive, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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
  __name: "randomizer",
  __ssrInlineRender: true,
  setup(__props) {
    const modes = [
      { id: "number", label: "\u0427\u0438\u0441\u043B\u043E" },
      { id: "list", label: "\u0421\u043F\u0438\u0441\u043E\u043A" },
      { id: "yesno", label: "\u0414\u0430 / \u043D\u0435\u0442" }
    ];
    const mode = ref("number");
    const range = reactive({ min: 1, max: 100 });
    const listInput = ref("");
    const result = ref("");
    computed(
      () => listInput.value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean)
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "rand-page" }, _attrs))} data-v-3c8b4f78><section class="rand-hero" data-v-3c8b4f78><div class="pill" data-v-3c8b4f78><span data-v-3c8b4f78>\u0418\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442</span><strong data-v-3c8b4f78>\u041A\u043E\u043B\u0435\u0441\u043E \u0440\u0435\u0448\u0435\u043D\u0438\u0439</strong></div><h1 data-v-3c8b4f78>\u0420\u0430\u043D\u0434\u043E\u043C\u0430\u0439\u0437\u0435\u0440</h1><p class="lead" data-v-3c8b4f78> \u041A\u043E\u0433\u0434\u0430 \u0438\u0434\u0435\u0439 \u043C\u043D\u043E\u0433\u043E, \u0430 \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0441\u043B\u043E\u0436\u043D\u043E. \u041A\u043E\u043B\u0435\u0441\u043E \u0441\u0434\u0435\u043B\u0430\u0435\u0442 \u044D\u0442\u043E \u0437\u0430 \u0432\u0430\u0441: \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E, \u0441\u043B\u043E\u0432\u043E \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430 \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0442\u043E\u0439 \u043E\u0442\u0432\u0435\u0442 \xAB\u0434\u0430 / \u043D\u0435\u0442\xBB. </p></section><section class="mode-bar" data-v-3c8b4f78><div class="mode-switch" data-v-3c8b4f78><!--[-->`);
      ssrRenderList(modes, (m) => {
        _push(`<button class="${ssrRenderClass([{ active: mode.value === m.id }, "mode-btn"])}" data-v-3c8b4f78>${ssrInterpolate(m.label)}</button>`);
      });
      _push(`<!--]--></div></section><section class="rand-card" data-v-3c8b4f78><div class="mode-body" data-v-3c8b4f78>`);
      if (mode.value === "number") {
        _push(`<!--[--><div class="field-row" data-v-3c8b4f78><label data-v-3c8b4f78> \u041E\u0442 <input${ssrRenderAttr("value", range.min)} type="number" data-v-3c8b4f78></label><label data-v-3c8b4f78> \u0414\u043E <input${ssrRenderAttr("value", range.max)} type="number" data-v-3c8b4f78></label></div><p class="hint" data-v-3c8b4f78>\u0423\u043A\u0430\u0436\u0438 \u0433\u0440\u0430\u043D\u0438\u0446\u044B, \u0438 \u043C\u044B \u0432\u044B\u0431\u0435\u0440\u0435\u043C \u043B\u044E\u0431\u043E\u0435 \u0447\u0438\u0441\u043B\u043E \u0432\u043D\u0443\u0442\u0440\u0438 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u0430.</p><!--]-->`);
      } else if (mode.value === "list") {
        _push(`<label class="full" data-v-3c8b4f78> \u0412\u0441\u0442\u0430\u0432\u044C \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E \u0438\u043B\u0438 \u0441 \u043D\u043E\u0432\u043E\u0439 \u0441\u0442\u0440\u043E\u043A\u0438, \u043C\u044B \u0432\u044B\u0431\u0435\u0440\u0435\u043C \u043E\u0434\u0438\u043D \u0438\u0437 \u043D\u0438\u0445 <textarea rows="4" placeholder="\u043F\u0438\u0446\u0446\u0430
\u0431\u0443\u0440\u0433\u0435\u0440
\u0440\u043E\u043B\u043B\u044B" data-v-3c8b4f78>${ssrInterpolate(listInput.value)}</textarea></label>`);
      } else {
        _push(`<p class="hint" data-v-3c8b4f78>\u041F\u0440\u043E\u0441\u0442\u043E\u0439 \u0440\u0430\u043D\u0434\u043E\u043C: \xAB\u0434\u0430\xBB \u0438\u043B\u0438 \xAB\u043D\u0435\u0442\xBB \u2014 \u0440\u0435\u0448\u0430\u0435\u0442 \u0437\u0430 \u043F\u0430\u0440\u0443 \u0441\u0435\u043A\u0443\u043D\u0434.</p>`);
      }
      if (result.value) {
        _push(`<div class="result" data-v-3c8b4f78><span class="result-label" data-v-3c8b4f78>\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442:</span><span class="result-value" data-v-3c8b4f78>${ssrInterpolate(result.value)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><div class="action-bar" data-v-3c8b4f78><button class="btn primary" data-v-3c8b4f78>\u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C</button></div><section class="benefits" data-v-3c8b4f78><h2 data-v-3c8b4f78>\u0417\u0430\u0447\u0435\u043C \u044D\u0442\u043E\u0442 \u0440\u0430\u043D\u0434\u043E\u043C\u0430\u0439\u0437\u0435\u0440</h2>\u0412\u044B\u0431\u043E\u0440 \u0431\u0435\u0437 \u0441\u043F\u043E\u0440\u043E\u0432 <div class="grid three" data-v-3c8b4f78><article class="card" data-v-3c8b4f78><h3 data-v-3c8b4f78>\u0423\u043D\u0438\u0432\u0435\u0440\u0441\u0430\u043B\u044C\u043D\u043E</h3><p data-v-3c8b4f78>\u0427\u0438\u0441\u043B\u0430, \u0441\u043F\u0438\u0441\u043E\u043A \u0441\u043B\u043E\u0432 \u0438\u043B\u0438 \u043F\u0440\u043E\u0441\u0442\u043E\u0439 \xAB\u0434\u0430 / \u043D\u0435\u0442\xBB \u2014 \u043F\u043E\u0434 \u043B\u044E\u0431\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443, \u043E\u0442 \u0432\u044B\u0431\u043E\u0440\u0430 \u0444\u0438\u043B\u044C\u043C\u0430 \u0434\u043E \u0436\u0435\u0440\u0435\u0431\u044C\u0451\u0432\u043A\u0438.</p></article><article class="card" data-v-3c8b4f78><h3 data-v-3c8b4f78>\u0427\u0435\u0441\u0442\u043D\u043E</h3><p data-v-3c8b4f78>crypto.getRandomValues \u0432\u043C\u0435\u0441\u0442\u043E \u043F\u043E\u0434\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u043D\u0438\u0439 \u043C\u043E\u043D\u0435\u0442 \u0438 \u0441\u043F\u043E\u0440\u043E\u0432. \u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439.</p></article><article class="card" data-v-3c8b4f78><h3 data-v-3c8b4f78>\u0411\u044B\u0441\u0442\u0440\u043E</h3><p data-v-3c8b4f78>\u041F\u0430\u0440\u0430 \u043A\u043B\u0438\u043A\u043E\u0432 \u2014 \u0438 \u0433\u043E\u0442\u043E\u0432\u043E. \u041C\u043E\u0436\u043D\u043E \u043A\u0440\u0443\u0442\u0438\u0442\u044C \u0431\u0435\u0441\u043A\u043E\u043D\u0435\u0447\u043D\u043E, \u043F\u043E\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0451\u0442\u0435 \u0438\u0434\u0435\u0430\u043B\u044C\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442.</p></article></div></section><section class="faq" data-v-3c8b4f78><div class="faq-text" data-v-3c8b4f78><h2 data-v-3c8b4f78>FAQ</h2><p data-v-3c8b4f78>\u041D\u0443\u0436\u0435\u043D \u0442\u043E\u043B\u044C\u043A\u043E \u0431\u0440\u0430\u0443\u0437\u0435\u0440: \u0432\u0441\u0451 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 \u0441\u0440\u0430\u0437\u0443, \u0431\u0435\u0437 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u0438 \u0441\u0442\u043E\u0440\u043E\u043D\u043D\u0438\u0445 \u0441\u0435\u0440\u0432\u0438\u0441\u043E\u0432.</p><p data-v-3c8b4f78>\u0414\u043B\u044F \u0441\u043F\u0438\u0441\u043A\u043E\u0432 \u043C\u043E\u0436\u043D\u043E \u0432\u0441\u0442\u0430\u0432\u043B\u044F\u0442\u044C \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B \u0432 \u0441\u0442\u043E\u043B\u0431\u0438\u043A \u0438\u043B\u0438 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E \u2014 \u043C\u044B \u043F\u043E\u0447\u0438\u0441\u0442\u0438\u043C \u043B\u0438\u0448\u043D\u0438\u0435 \u043F\u0440\u043E\u0431\u0435\u043B\u044B.</p><p data-v-3c8b4f78>\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043D\u0435 \u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F \u0438 \u043D\u0435 \u043A\u044D\u0448\u0438\u0440\u0443\u0435\u0442\u0441\u044F: \u043A\u0430\u0436\u0434\u044B\u0439 \u043A\u043B\u0438\u043A \u2014 \u043D\u043E\u0432\u044B\u0439 \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439 \u0432\u044B\u0431\u043E\u0440.</p></div></section><section class="cta" data-v-3c8b4f78><div class="cta-box card" data-v-3c8b4f78><div data-v-3c8b4f78><p class="seo-kicker" data-v-3c8b4f78>\u0412\u044B\u0431\u043E\u0440 \u0431\u0435\u0437 \u0441\u043F\u043E\u0440\u043E\u0432</p><h3 data-v-3c8b4f78>\u0417\u0430\u043F\u0443\u0441\u0442\u0438 \u043A\u043E\u043B\u0435\u0441\u043E \u0438 \u0440\u0435\u0448\u0438 \u0437\u0430 5 \u0441\u0435\u043A\u0443\u043D\u0434</h3></div><button class="btn primary" data-v-3c8b4f78>\u0421\u0433\u0435\u043D\u0435\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430</button></div></section></div>`);
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

export { randomizer as default };
//# sourceMappingURL=randomizer-VnD-aTSb.mjs.map
