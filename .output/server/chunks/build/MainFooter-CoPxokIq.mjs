import { _ as _export_sfc, a as __nuxt_component_0 } from './server.mjs';
import { mergeProps, withCtx, createVNode, createTextVNode, unref, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<header${ssrRenderAttrs(mergeProps({ class: "nav-shell" }, _attrs))} data-v-a77c1ba2><div class="container nav-bar" data-v-a77c1ba2>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "brand"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<span class="brand-icon" role="img" aria-label="\u041D\u0435\u0439\u0440\u043E\u043D\u043D\u044B\u0439 \u0412\u043E\u043B\u043A" data-v-a77c1ba2${_scopeId}>\u{1F43A}</span><strong class="brand-title" data-v-a77c1ba2${_scopeId}>\u0421\u0430\u0439\u0442 \u043D\u0435\u0439\u0440\u043E\u043D\u043D\u043E\u0433\u043E \u0432\u043E\u043B\u043A\u0430</strong>`);
      } else {
        return [
          createVNode("span", {
            class: "brand-icon",
            role: "img",
            "aria-label": "\u041D\u0435\u0439\u0440\u043E\u043D\u043D\u044B\u0439 \u0412\u043E\u043B\u043A"
          }, "\u{1F43A}"),
          createVNode("strong", { class: "brand-title" }, "\u0421\u0430\u0439\u0442 \u043D\u0435\u0439\u0440\u043E\u043D\u043D\u043E\u0433\u043E \u0432\u043E\u043B\u043A\u0430")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<nav class="nav-links" data-v-a77c1ba2>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "nav-link",
    to: "/about"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`\u041E \u0432\u043E\u043B\u043A\u0435`);
      } else {
        return [
          createTextVNode("\u041E \u0432\u043E\u043B\u043A\u0435")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</nav></div></header>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/MainHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const MainHeader = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-a77c1ba2"]]);
const _sfc_main = {
  __name: "MainFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "nw-footer" }, _attrs))} data-v-ac0798a0><div class="nw-footer-inner" data-v-ac0798a0>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "nw-brand"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="nw-title" data-v-ac0798a0${_scopeId}>\u041D\u0435\u0439\u0440\u043E\u043D\u043D\u044B\u0439 \u0432\u043E\u043B\u043A</span><span class="nw-dot" data-v-ac0798a0${_scopeId}>\u{1F43A}</span><span class="nw-year" data-v-ac0798a0${_scopeId}>${ssrInterpolate(unref(year))}</span>`);
          } else {
            return [
              createVNode("span", { class: "nw-title" }, "\u041D\u0435\u0439\u0440\u043E\u043D\u043D\u044B\u0439 \u0432\u043E\u043B\u043A"),
              createVNode("span", { class: "nw-dot" }, "\u{1F43A}"),
              createVNode("span", { class: "nw-year" }, toDisplayString(unref(year)), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="https://t.me/neural_wise_wolf" target="_blank" rel="noopener" class="nw-tg-btn" data-v-ac0798a0><span class="nw-tg-icon" aria-hidden="true" data-v-ac0798a0></span><span data-v-ac0798a0>Telegram</span></a></div></footer>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/MainFooter.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MainFooter = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ac0798a0"]]);

export { MainHeader as M, MainFooter as a };
//# sourceMappingURL=MainFooter-CoPxokIq.mjs.map
