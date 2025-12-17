import { _ as _export_sfc, a as __nuxt_component_0 } from './server.mjs';
import { mergeProps, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
    const generators = [
      {
        title: "\u0426\u0438\u0442\u0430\u0442\u044B \u0432\u043E\u043B\u043A\u0430",
        tag: "\u041C\u043E\u0442\u0438\u0432\u0430\u0442\u043E\u0440",
        description: "\u041B\u0430\u043A\u043E\u043D\u0438\u0447\u043D\u044B\u0435 \u0441\u0442\u0440\u043E\u043A\u0438 \u043F\u0440\u043E \u0441\u043C\u0435\u043B\u043E\u0441\u0442\u044C, \u0440\u0438\u0441\u043A \u0438 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435. \u0411\u0435\u0437 \u043C\u043E\u0442\u0438\u0432\u0430\u0446\u0438\u043E\u043D\u043D\u043E\u0439 \u0432\u043E\u0434\u044B.",
        mood: "\u041F\u043E\u0434\u043D\u044F\u0442\u044C \u043D\u0430\u0441\u0442\u0440\u043E\u0439",
        scope: "\u0434\u043B\u044F \u0441\u0435\u0431\u044F",
        link: "/generators/wolf-quotes"
      },
      {
        title: "\u0412\u043E\u043B\u0447\u044C\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",
        tag: "\u041C\u0438\u043A\u0440\u043E-\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
        description: "\u041D\u0435\u0431\u043E\u043B\u044C\u0448\u0438\u0435 \u0448\u0430\u0433\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043C\u043E\u0436\u043D\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441: \u043F\u043E\u0437\u0432\u043E\u043D\u0438\u0442\u044C, \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0432\u043D\u0438\u043C\u0430\u043D\u0438\u0435, \u0432\u044B\u0439\u0442\u0438 \u0432 \u043D\u043E\u0447\u044C.",
        mood: "\u0421\u0434\u0432\u0438\u043D\u0443\u0442\u044C\u0441\u044F \u0441 \u043C\u0435\u0441\u0442\u0430",
        scope: "1-5 \u043C\u0438\u043D\u0443\u0442",
        link: "/decisions/micro-actions"
      },
      {
        title: "\u0412\u043E\u043F\u0440\u043E\u0441\u044B \u0434\u043B\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438",
        tag: "\u0421\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u043E",
        description: "\u0412\u043E\u043F\u0440\u043E\u0441\u044B, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0437\u0430\u0432\u043E\u0434\u044F\u0442 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440 \u0438 \u043F\u043E\u043C\u043E\u0433\u0430\u044E\u0442 \u0443\u0437\u043D\u0430\u0442\u044C \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0430 \u0433\u043B\u0443\u0431\u0436\u0435, \u0431\u0435\u0437 \u0441\u043A\u0443\u0447\u043D\u044B\u0445 \u0444\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u043E\u0441\u0442\u0435\u0439.",
        mood: "\u0420\u0430\u0437\u043E\u0433\u0440\u0435\u0442\u044C \u0431\u0435\u0441\u0435\u0434\u0443",
        scope: "\u0434\u043B\u044F 2-6 \u043B\u044E\u0434\u0435\u0439",
        link: "/decisions/company-questions"
      },
      {
        title: "\u041D\u0438\u043A\u043D\u0435\u0439\u043C \u0438\u043B\u0438 \u0432\u043E\u043B\u0447\u044C\u0435 \u0438\u043C\u044F",
        tag: "\u0421\u0430\u043C\u043E\u0438\u0434\u0435\u043D\u0442\u0438\u043A\u0430",
        description: "\u041F\u043E\u0434\u0431\u0438\u0440\u0430\u0435\u043C \u0432\u043E\u043B\u044C\u0447\u0435 \u0438\u043C\u044F \u0438\u043B\u0438 \u043D\u0438\u043A \u0434\u043B\u044F \u0438\u0433\u0440\u044B. \u0427\u0443\u0442\u044C \u0434\u0435\u0440\u0437\u043A\u043E, \u043D\u043E \u0431\u0435\u0437 \u043A\u0440\u0438\u043D\u0436\u0430.",
        mood: "\u041D\u0430\u0439\u0442\u0438 \u043E\u0431\u0440\u0430\u0437",
        scope: "\u0438\u0433\u0440\u044B / \u0441\u043E\u0446\u0441\u0435\u0442\u0438",
        link: "/decisions/nicknames"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ style: { "padding": "60px 0 24px" } }, _attrs))} data-v-c8a50449><div class="pill" data-v-c8a50449><span data-v-c8a50449>\u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u044B</span><strong data-v-c8a50449>\u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u044F</strong></div><h1 class="section-title" data-v-c8a50449>\u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u044B \u0432\u043E\u043B\u043A\u0430</h1><p class="section-lead" data-v-c8a50449> \u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0435 \u043F\u043E\u0434\u0431\u043E\u0440\u043A\u0438 \u0434\u043B\u044F \u0432\u0434\u043E\u0445\u043D\u043E\u0432\u0435\u043D\u0438\u044F: \u0446\u0438\u0442\u0430\u0442\u044B, \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F, \u0432\u043E\u043F\u0440\u043E\u0441\u044B \u0434\u043B\u044F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438 \u0438 \u0442\u043E\u0442\u0435\u043C\u043D\u044B\u0435 \u043D\u0438\u043A\u043D\u0435\u0439\u043C\u044B. \u041F\u0440\u043E\u043A\u0430\u0447\u0430\u0439 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440, \u0441\u043C\u0435\u043D\u0438 \u0444\u043E\u043A\u0443\u0441 \u0438\u043B\u0438 \u043D\u0430\u0439\u0434\u0438 \u043D\u043E\u0432\u043E\u0435 \u0438\u043C\u044F. </p><div class="grid two" data-v-c8a50449><!--[-->`);
      ssrRenderList(generators, (generator) => {
        _push(`<!--[-->`);
        if (generator.link) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            class: "card generator-card generator-card-link",
            to: generator.link
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="tag" data-v-c8a50449${_scopeId}>${ssrInterpolate(generator.tag)}</div><h3 data-v-c8a50449${_scopeId}>${ssrInterpolate(generator.title)}</h3><p data-v-c8a50449${_scopeId}>${ssrInterpolate(generator.description)}</p><div class="chip-row" data-v-c8a50449${_scopeId}><div class="chip" data-v-c8a50449${_scopeId}>${ssrInterpolate(generator.mood)}</div><div class="chip" data-v-c8a50449${_scopeId}>${ssrInterpolate(generator.scope)}</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "tag" }, toDisplayString(generator.tag), 1),
                  createVNode("h3", null, toDisplayString(generator.title), 1),
                  createVNode("p", null, toDisplayString(generator.description), 1),
                  createVNode("div", { class: "chip-row" }, [
                    createVNode("div", { class: "chip" }, toDisplayString(generator.mood), 1),
                    createVNode("div", { class: "chip" }, toDisplayString(generator.scope), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<article class="card generator-card" data-v-c8a50449><div class="tag" data-v-c8a50449>${ssrInterpolate(generator.tag)}</div><h3 data-v-c8a50449>${ssrInterpolate(generator.title)}</h3><p data-v-c8a50449>${ssrInterpolate(generator.description)}</p><div class="chip-row" data-v-c8a50449><div class="chip" data-v-c8a50449>${ssrInterpolate(generator.mood)}</div><div class="chip" data-v-c8a50449>${ssrInterpolate(generator.scope)}</div></div></article>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/generators/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c8a50449"]]);

export { index as default };
//# sourceMappingURL=index-DjXAxpDF.mjs.map
