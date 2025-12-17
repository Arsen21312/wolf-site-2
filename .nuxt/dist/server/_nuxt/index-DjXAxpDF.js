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
    const generators = [
      {
        title: "Цитаты волка",
        tag: "Мотиватор",
        description: "Лаконичные строки про смелость, риск и движение. Без мотивационной воды.",
        mood: "Поднять настрой",
        scope: "для себя",
        link: "/generators/wolf-quotes"
      },
      {
        title: "Волчьи действия",
        tag: "Микро-действие",
        description: "Небольшие шаги, которые можно сделать прямо сейчас: позвонить, переключить внимание, выйти в ночь.",
        mood: "Сдвинуться с места",
        scope: "1-5 минут",
        link: "/decisions/micro-actions"
      },
      {
        title: "Вопросы для компании",
        tag: "Социально",
        description: "Вопросы, которые заводят разговор и помогают узнать друг друга глубже, без скучных формальностей.",
        mood: "Разогреть беседу",
        scope: "для 2-6 людей",
        link: "/decisions/company-questions"
      },
      {
        title: "Никнейм или волчье имя",
        tag: "Самоидентика",
        description: "Подбираем вольче имя или ник для игры. Чуть дерзко, но без кринжа.",
        mood: "Найти образ",
        scope: "игры / соцсети",
        link: "/decisions/nicknames"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ style: { "padding": "60px 0 24px" } }, _attrs))} data-v-c8a50449><div class="pill" data-v-c8a50449><span data-v-c8a50449>Генераторы</span><strong data-v-c8a50449>настроения</strong></div><h1 class="section-title" data-v-c8a50449>Генераторы волка</h1><p class="section-lead" data-v-c8a50449> Короткие подборки для вдохновения: цитаты, действия, вопросы для компании и тотемные никнеймы. Прокачай разговор, смени фокус или найди новое имя. </p><div class="grid two" data-v-c8a50449><!--[-->`);
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
export {
  index as default
};
//# sourceMappingURL=index-DjXAxpDF.js.map
