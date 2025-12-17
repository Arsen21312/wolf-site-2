import { defineComponent, shallowRef, getCurrentInstance, provide, cloneVNode, h, createElementBlock, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/hookable/dist/index.mjs";
import { _ as _export_sfc, a as __nuxt_component_0$1 } from "../server.mjs";
import { ssrRenderComponent, ssrRenderStyle, ssrRenderAttr } from "vue/server-renderer";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/unctx/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/radix3/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/defu/dist/defu.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/ufo/dist/index.mjs";
const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_0 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const bannerUrl = "" + __buildAssetsURL("auf1.PywCo92Y.png");
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<!--[--><section class="hero" data-v-c2a51525><h1 class="section-title" data-v-c2a51525><span data-v-c2a51525>Ты сюда за</span>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</h1><p class="section-lead" data-v-c2a51525> Это пристанище Нейронного Волка: цифрового проводника, который любит помогать решать, играть и подбрасывать идеи. </p><div class="cta-row" data-v-c2a51525>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn",
        to: "/games"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Играть`);
          } else {
            return [
              createTextVNode("Играть")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/decisions"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Решить за меня`);
          } else {
            return [
              createTextVNode("Решить за меня")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/generators"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Генераторы`);
          } else {
            return [
              createTextVNode("Генераторы")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/about"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Волчья философия`);
          } else {
            return [
              createTextVNode("Волчья философия")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="stats stats-responsive" style="${ssrRenderStyle({ "margin-top": "28px" })}" data-v-c2a51525><div class="stat" data-v-c2a51525><img${ssrRenderAttr("src", unref(bannerUrl))} alt="Баннер" class="banner-img" data-v-c2a51525></div><div class="stat" data-v-c2a51525><h4 data-v-c2a51525>При чем тут волки?</h4><p data-v-c2a51525>Да ни при чем, просто в каждом живет маленький хищник который хочет решения побыстрее, игры поярче и мысли поглубже. Это цифровой приятель который подкидывает идеи, щелкает задачи как орешки и иногда философствует так что ты зависаешь над экраном. Короче, если волк мог бы запустить свой сервис, он выглядел бы именно так.</p></div><div class="stat" data-v-c2a51525><h4 data-v-c2a51525>Быстрые ссылки</h4><div class="cta-row" style="${ssrRenderStyle({ "margin-top": "8px", "flex-wrap": "wrap", "gap": "8px" })}" data-v-c2a51525>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/games/truth-or-dare"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Правда или действие`);
          } else {
            return [
              createTextVNode("Правда или действие")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/games/never-have-i-ever"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Я никогда не`);
          } else {
            return [
              createTextVNode("Я никогда не")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/decisions/coin-flip"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Монетка`);
          } else {
            return [
              createTextVNode("Монетка")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/decisions/love-calculator"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Калькулятор любви`);
          } else {
            return [
              createTextVNode("Калькулятор любви")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></section><section class="grid hero-grid" style="${ssrRenderStyle({ "margin-top": "28px", "margin-bottom": "64px" })}" data-v-c2a51525><div class="card" data-v-c2a51525><div class="tag" data-v-c2a51525>Начать путь</div><h3 data-v-c2a51525>Ты здесь не случайно</h3><p data-v-c2a51525> Если ты дошёл до этого места, значит внутри уже щёлкнуло Волк не даёт готовых ответов Он помогает услышать себя и сделать шаг дальше Иногда честный, иногда странный, всегда по делу </p></div><div class="card" data-v-c2a51525><div class="tag" data-v-c2a51525>АУФ</div><h3 data-v-c2a51525>Кто такой Нейронный Волк?!</h3><p data-v-c2a51525> Это цифровой инстинкт. Смесь логики, интуиции и лёгкого хаоса. Он не умнее тебя. Он рядом, когда выбор застрял, мысли шумят, а решение нужно сейчас </p><div class="chip-row" data-v-c2a51525><div class="chip" data-v-c2a51525>Интуитивные подсказки</div><div class="chip" data-v-c2a51525>Игры для настроения</div></div></div><div class="card" data-v-c2a51525><div class="tag" data-v-c2a51525>Куда пойти?</div><h3 data-v-c2a51525>В каком ты сейчас состоянии?</h3><p data-v-c2a51525>Быстрые переходы по всему порталу.</p><div class="cta-row" style="${ssrRenderStyle({ "margin-top": "12px" })}" data-v-c2a51525>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/games"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Я хочу поиграть`);
          } else {
            return [
              createTextVNode("Я хочу поиграть")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/decisions"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Мне нужно решить `);
          } else {
            return [
              createTextVNode("Мне нужно решить ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/generators"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Хочу странный совет`);
          } else {
            return [
              createTextVNode("Хочу странный совет")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c2a51525"]]);
export {
  index as default
};
//# sourceMappingURL=index-BWjKz5ur.js.map
