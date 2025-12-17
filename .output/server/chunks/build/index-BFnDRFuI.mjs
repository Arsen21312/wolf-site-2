import { _ as _export_sfc, a as __nuxt_component_0 } from './server.mjs';
import { mergeProps, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const games = [
      {
        slug: "truth-or-dare",
        title: "\u041F\u0440\u0430\u0432\u0434\u0430 \u0438\u043B\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
        description: "\u041A\u043B\u0430\u0441\u0441\u0438\u043A\u0430, \u043D\u043E \u0441 \u0432\u043E\u043B\u0447\u044C\u0438\u043C \u043F\u0440\u0438\u043A\u0443\u0441\u043E\u043C: \u0447\u0435\u0441\u0442\u043D\u044B\u0435 \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0432\u044B\u0432\u043E\u0434\u044F\u0442 \u0438\u0437 \u0437\u043E\u043D\u044B \u043A\u043E\u043C\u0444\u043E\u0440\u0442\u0430.",
        tag: "\u041F\u0440\u0430\u0432\u0434\u0430 / \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
        mood: "\u0414\u043B\u044F \u0441\u043C\u0435\u043B\u044B\u0445 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u043E\u0432",
        duration: "10-20 \u043C\u0438\u043D\u0443\u0442"
      },
      {
        slug: "never-have-i-ever",
        title: "\u042F \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435 \u043E\u043D\u043B\u0430\u0439\u043D",
        description: "\u0411\u043E\u043B\u0435\u0435 1000 \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B\u044C\u043D\u044B\u0445 \u0432\u043E\u043F\u0440\u043E\u0441\u043E\u0432, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0442 \u0447\u0435\u0441\u0442\u043D\u043E\u0441\u0442\u044C \u0438 \u0440\u0430\u0441\u043A\u0430\u0447\u0430\u044E\u0442 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440 \u0432 \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438.",
        tag: "\u042F \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435...",
        mood: "\u0414\u043B\u044F \u0432\u0435\u0447\u0435\u0440\u0438\u043D\u043E\u043A",
        duration: "\u043E\u0442 5 \u043C\u0438\u043D\u0443\u0442"
      },
      {
        slug: "true-or-false",
        title: "\u041F\u0440\u0430\u0432\u0434\u0430 \u0438\u043B\u0438 \u041B\u043E\u0436\u044C",
        description: "\u0412\u044B\u0431\u0438\u0440\u0430\u0439 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u044E, \u043F\u043E\u043B\u0443\u0447\u0430\u0439 \u0443\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u0438 \u0440\u0435\u0448\u0430\u0439 \u043F\u0440\u0430\u0432\u0434\u0430 \u044D\u0442\u043E \u0438\u043B\u0438 \u043B\u043E\u0436\u044C. \u041D\u0438\u043A\u0430\u043A\u0438\u0445 \u0442\u0430\u0439\u043C\u0435\u0440\u043E\u0432, \u043F\u0440\u043E\u0441\u0442\u043E \u0430\u0437\u0430\u0440\u0442.",
        tag: "\u041F\u0440\u0430\u0432\u0434\u0430 / \u041B\u043E\u0436\u044C",
        mood: "\u0414\u043B\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
        duration: "\u043E\u0442 5 \u043C\u0438\u043D\u0443\u0442"
      },
      {
        slug: "coin",
        title: "\u041E\u0442\u0432\u0435\u0442\u044C \u0437\u0430 5 \u0441\u0435\u043A\u0443\u043D\u0434",
        description: "\u0418\u0433\u0440\u0430\u0439\u0442\u0435 \u0432 \u043A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0443\u044E \u0438\u0433\u0440\u0443 \u0434\u043B\u044F \u0432\u0435\u0447\u0435\u0440\u0438\u043D\u043E\u043A \xAB\u041E\u0442\u0432\u0435\u0442\u044C \u0437\u0430 5 \u0441\u0435\u043A\u0443\u043D\u0434\xBB \u043E\u043D\u043B\u0430\u0439\u043D.",
        tag: "5 \u0441\u0435\u043A\u0443\u043D\u0434",
        mood: "\u0414\u043B\u044F \u0432\u0435\u0447\u0435\u0440\u0438\u043D\u043E\u043A",
        duration: "\u043E\u0442 1 \u043C\u0438\u043D\u0443\u0442\u044B",
        to: "/games/5-seconds"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ style: { "padding": "60px 0 24px" } }, _attrs))} data-v-8fc2559e><div class="pill" data-v-8fc2559e><strong data-v-8fc2559e>\u0418\u0433\u0440\u044B</strong></div><h1 class="section-title" data-v-8fc2559e>\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0438\u0433\u0440 \u0432\u043E\u043B\u043A\u0430</h1><p class="section-lead" data-v-8fc2559e> \u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0441\u0446\u0435\u043D\u0430\u0440\u0438\u0438, \u0447\u0442\u043E\u0431\u044B \u0432\u0441\u0442\u0440\u044F\u0445\u043D\u0443\u0442\u044C \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u044E \u0438\u043B\u0438 \u0441\u0435\u0431\u044F. \u041A\u0430\u0436\u0434\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0432\u0435\u0434\u0451\u0442 \u0432 \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u0443\u044E \u0438\u0433\u0440\u0443 \u2013 \u043F\u0440\u0430\u0432\u0434\u0430 \u0438\u043B\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435, 5 \u0441\u0435\u043A\u0443\u043D\u0434, \u0440\u0443\u043B\u0435\u0442\u043A\u0430 \u043F\u0440\u0430\u0432\u0434\u044B/\u043B\u0436\u0438, \xAB\u044F \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435\xBB. </p><div class="grid two" style="${ssrRenderStyle({ "margin-top": "16px" })}" data-v-8fc2559e><!--[-->`);
      ssrRenderList(games, (game) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: game.slug,
          class: "card game-card",
          to: game.to || `/games/${game.slug}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="tag" data-v-8fc2559e${_scopeId}>${ssrInterpolate(game.tag)}</div><h3 data-v-8fc2559e${_scopeId}>${ssrInterpolate(game.title)}</h3><p data-v-8fc2559e${_scopeId}>${ssrInterpolate(game.description)}</p><div class="chip-row" data-v-8fc2559e${_scopeId}><div class="chip" data-v-8fc2559e${_scopeId}>${ssrInterpolate(game.mood)}</div><div class="chip" data-v-8fc2559e${_scopeId}>${ssrInterpolate(game.duration)}</div></div>`);
            } else {
              return [
                createVNode("div", { class: "tag" }, toDisplayString(game.tag), 1),
                createVNode("h3", null, toDisplayString(game.title), 1),
                createVNode("p", null, toDisplayString(game.description), 1),
                createVNode("div", { class: "chip-row" }, [
                  createVNode("div", { class: "chip" }, toDisplayString(game.mood), 1),
                  createVNode("div", { class: "chip" }, toDisplayString(game.duration), 1)
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/games/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8fc2559e"]]);

export { index as default };
//# sourceMappingURL=index-BFnDRFuI.mjs.map
