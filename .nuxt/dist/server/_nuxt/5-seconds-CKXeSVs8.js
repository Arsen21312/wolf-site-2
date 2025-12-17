import { _ as _export_sfc, a as __nuxt_component_0 } from "../server.mjs";
import { mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { F as FiveSecondsGame } from "./FiveSeconds-CxXeUALe.js";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/hookable/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/unctx/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/radix3/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/defu/dist/defu.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/ufo/dist/index.mjs";
import "./SocialPopup-C9eZeUoF.js";
const _sfc_main = {
  __name: "5-seconds",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fs-page" }, _attrs))} data-v-d7711925><header class="fs-nav" data-v-d7711925><div class="fs-nav-left" data-v-d7711925><div class="fs-logo" data-v-d7711925>?</div><span class="fs-brand" data-v-d7711925>?????? ?? 5 ??????</span></div><div class="fs-nav-right" data-v-d7711925>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "fs-link",
        to: "/games"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`????`);
          } else {
            return [
              createTextVNode("????")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "fs-link",
        to: "/about"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`? ?????`);
          } else {
            return [
              createTextVNode("? ?????")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header>`);
      _push(ssrRenderComponent(FiveSecondsGame, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/5-seconds.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _5Seconds = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d7711925"]]);
export {
  _5Seconds as default
};
//# sourceMappingURL=5-seconds-CKXeSVs8.js.map
