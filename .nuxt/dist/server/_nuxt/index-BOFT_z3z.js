import { _ as _export_sfc, a as __nuxt_component_0 } from "../server.mjs";
import { mergeProps, withCtx, createVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
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
    const tools = [
      {
        title: "Монетка",
        tag: "Шанс 50/50",
        description: "Оставь выбор на удачу: орёл или решка. Быстро, честно и без аргументов.",
        mood: "Нейтральный выбор",
        speed: "10 секунд",
        slug: "/decisions/coin-flip"
      },
      {
        title: "Конвертер чисел",
        tag: "Сумма прописью",
        description: "Бесплатный конвертер чисел в сумму прописью для документов. Поддержка НДС 12% и 20%, правильные склонения.",
        mood: "Работает в браузере",
        speed: "15 секунд",
        slug: "/decisions/summa-propisyu"
      },
      {
        title: "Рандом решает за тебя",
        tag: "Рандомайзер",
        description: "Бесплатный генератор случайных чисел, слов из списка, а также выбор между да и нет в одном инструменте",
        mood: "Весело и быстро",
        speed: "1 клик",
        slug: "/decisions/randomizer"
      },
      {
        title: "Калькулятор любви",
        tag: "Проверь свою подружку",
        description: "Узнайте, насколько вы подходите друг другу! Просто введите два имени и нажмите кнопку.",
        mood: "Любовь",
        speed: "30 секунд",
        slug: "/decisions/love-calculator"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "decisions-page" }, _attrs))} data-v-6f779025><div class="pill" data-v-6f779025><span data-v-6f779025>Инструменты</span><strong data-v-6f779025>Выбор без споров</strong></div><h1 class="section-title" data-v-6f779025>Быстрые решения, когда нужен нейтральный выбор</h1><p class="section-lead" data-v-6f779025> Монетка, колесо выбора, правда или действие и другие штуки, которые помогают решить за секунды. Без споров, обид и лишних разговоров. </p><div class="grid two" data-v-6f779025><!--[-->`);
      ssrRenderList(tools, (tool) => {
        _push(`<!--[-->`);
        if (tool.slug) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: tool.slug,
            class: "card decision-card link-card"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="tag" data-v-6f779025${_scopeId}>${ssrInterpolate(tool.tag)}</div><h3 data-v-6f779025${_scopeId}>${ssrInterpolate(tool.title)}</h3><p data-v-6f779025${_scopeId}>${ssrInterpolate(tool.description)}</p><div class="chip-row" data-v-6f779025${_scopeId}><div class="chip" data-v-6f779025${_scopeId}>${ssrInterpolate(tool.mood)}</div><div class="chip" data-v-6f779025${_scopeId}>${ssrInterpolate(tool.speed)}</div></div>`);
              } else {
                return [
                  createVNode("div", { class: "tag" }, toDisplayString(tool.tag), 1),
                  createVNode("h3", null, toDisplayString(tool.title), 1),
                  createVNode("p", null, toDisplayString(tool.description), 1),
                  createVNode("div", { class: "chip-row" }, [
                    createVNode("div", { class: "chip" }, toDisplayString(tool.mood), 1),
                    createVNode("div", { class: "chip" }, toDisplayString(tool.speed), 1)
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<article class="card decision-card" data-v-6f779025><div class="tag" data-v-6f779025>${ssrInterpolate(tool.tag)}</div><h3 data-v-6f779025>${ssrInterpolate(tool.title)}</h3><p data-v-6f779025>${ssrInterpolate(tool.description)}</p><div class="chip-row" data-v-6f779025><div class="chip" data-v-6f779025>${ssrInterpolate(tool.mood)}</div><div class="chip" data-v-6f779025>${ssrInterpolate(tool.speed)}</div></div></article>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/decisions/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6f779025"]]);
export {
  index as default
};
//# sourceMappingURL=index-BOFT_z3z.js.map
