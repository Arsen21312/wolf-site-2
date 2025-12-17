import { _ as _export_sfc, a as __nuxt_component_0 } from "../server.mjs";
import { mergeProps, withCtx, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const games = [
      {
        slug: "truth-or-dare",
        title: "Правда или действие",
        description: "Классика, но с волчьим прикусом: честные вопросы и действия, которые выводят из зоны комфорта.",
        tag: "Правда / Действие",
        mood: "Для смелых разговоров",
        duration: "10-20 минут"
      },
      {
        slug: "never-have-i-ever",
        title: "Я никогда не онлайн",
        description: "Более 1000 оригинальных вопросов, которые проверят честность и раскачают разговор в компании.",
        tag: "Я никогда не...",
        mood: "Для вечеринок",
        duration: "от 5 минут"
      },
      {
        slug: "true-or-false",
        title: "Правда или Ложь",
        description: "Выбирай категорию, получай утверждение и решай правда это или ложь. Никаких таймеров, просто азарт.",
        tag: "Правда / Ложь",
        mood: "Для компании",
        duration: "от 5 минут"
      },
      {
        slug: "coin",
        title: "Ответь за 5 секунд",
        description: "Играйте в классическую игру для вечеринок «Ответь за 5 секунд» онлайн.",
        tag: "5 секунд",
        mood: "Для вечеринок",
        duration: "от 1 минуты",
        to: "/games/5-seconds"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ style: { "padding": "60px 0 24px" } }, _attrs))} data-v-8fc2559e><div class="pill" data-v-8fc2559e><strong data-v-8fc2559e>Игры</strong></div><h1 class="section-title" data-v-8fc2559e>Каталог игр волка</h1><p class="section-lead" data-v-8fc2559e> Быстрые сценарии, чтобы встряхнуть компанию или себя. Каждая карточка ведёт в отдельную игру – правда или действие, 5 секунд, рулетка правды/лжи, «я никогда не». </p><div class="grid two" style="${ssrRenderStyle({ "margin-top": "16px" })}" data-v-8fc2559e><!--[-->`);
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
export {
  index as default
};
//# sourceMappingURL=index-BFnDRFuI.js.map
