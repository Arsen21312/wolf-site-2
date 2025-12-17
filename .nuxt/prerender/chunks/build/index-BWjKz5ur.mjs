import { a as buildAssetsURL } from '../_/renderer.mjs';
import { defineComponent, withCtx, createTextVNode, unref, shallowRef, getCurrentInstance, provide, cloneVNode, h, createElementBlock, useSSRContext } from 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/vue/index.mjs';
import { _ as _export_sfc, a as __nuxt_component_0$1 } from './server.mjs';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderAttr } from 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/vue/server-renderer/index.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/h3/dist/index.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/ufo/dist/index.mjs';
import '../_/nitro.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/destr/dist/index.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/hookable/dist/index.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/ofetch/dist/node.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/node-mock-http/dist/index.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/unstorage/dist/index.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/unstorage/drivers/fs.mjs';
import 'file:///C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.js';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/ohash/dist/index.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/klona/dist/index.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/defu/dist/defu.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/scule/dist/index.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/pathe/dist/index.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/unhead/dist/server.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/devalue/index.js';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/unhead/dist/utils.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/unhead/dist/plugins.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/unctx/dist/index.mjs';
import 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/vue-router/vue-router.node.mjs';

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
      var _a;
      if (mounted.value) {
        const vnodes = (_a = slots.default) == null ? void 0 : _a.call(slots);
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
const bannerUrl = "" + buildAssetsURL("auf1.PywCo92Y.png");
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<!--[--><section class="hero" data-v-c2a51525><h1 class="section-title" data-v-c2a51525><span data-v-c2a51525>\u0422\u044B \u0441\u044E\u0434\u0430 \u0437\u0430</span>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</h1><p class="section-lead" data-v-c2a51525> \u042D\u0442\u043E \u043F\u0440\u0438\u0441\u0442\u0430\u043D\u0438\u0449\u0435 \u041D\u0435\u0439\u0440\u043E\u043D\u043D\u043E\u0433\u043E \u0412\u043E\u043B\u043A\u0430: \u0446\u0438\u0444\u0440\u043E\u0432\u043E\u0433\u043E \u043F\u0440\u043E\u0432\u043E\u0434\u043D\u0438\u043A\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043B\u044E\u0431\u0438\u0442 \u043F\u043E\u043C\u043E\u0433\u0430\u0442\u044C \u0440\u0435\u0448\u0430\u0442\u044C, \u0438\u0433\u0440\u0430\u0442\u044C \u0438 \u043F\u043E\u0434\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u0442\u044C \u0438\u0434\u0435\u0438. </p><div class="cta-row" data-v-c2a51525>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn",
        to: "/games"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u0418\u0433\u0440\u0430\u0442\u044C`);
          } else {
            return [
              createTextVNode("\u0418\u0433\u0440\u0430\u0442\u044C")
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
            _push2(`\u0420\u0435\u0448\u0438\u0442\u044C \u0437\u0430 \u043C\u0435\u043D\u044F`);
          } else {
            return [
              createTextVNode("\u0420\u0435\u0448\u0438\u0442\u044C \u0437\u0430 \u043C\u0435\u043D\u044F")
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
            _push2(`\u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u044B`);
          } else {
            return [
              createTextVNode("\u0413\u0435\u043D\u0435\u0440\u0430\u0442\u043E\u0440\u044B")
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
            _push2(`\u0412\u043E\u043B\u0447\u044C\u044F \u0444\u0438\u043B\u043E\u0441\u043E\u0444\u0438\u044F`);
          } else {
            return [
              createTextVNode("\u0412\u043E\u043B\u0447\u044C\u044F \u0444\u0438\u043B\u043E\u0441\u043E\u0444\u0438\u044F")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="stats stats-responsive" style="${ssrRenderStyle({ "margin-top": "28px" })}" data-v-c2a51525><div class="stat" data-v-c2a51525><img${ssrRenderAttr("src", unref(bannerUrl))} alt="\u0411\u0430\u043D\u043D\u0435\u0440" class="banner-img" data-v-c2a51525></div><div class="stat" data-v-c2a51525><h4 data-v-c2a51525>\u041F\u0440\u0438 \u0447\u0435\u043C \u0442\u0443\u0442 \u0432\u043E\u043B\u043A\u0438?</h4><p data-v-c2a51525>\u0414\u0430 \u043D\u0438 \u043F\u0440\u0438 \u0447\u0435\u043C, \u043F\u0440\u043E\u0441\u0442\u043E \u0432 \u043A\u0430\u0436\u0434\u043E\u043C \u0436\u0438\u0432\u0435\u0442 \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u0438\u0439 \u0445\u0438\u0449\u043D\u0438\u043A \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0445\u043E\u0447\u0435\u0442 \u0440\u0435\u0448\u0435\u043D\u0438\u044F \u043F\u043E\u0431\u044B\u0441\u0442\u0440\u0435\u0435, \u0438\u0433\u0440\u044B \u043F\u043E\u044F\u0440\u0447\u0435 \u0438 \u043C\u044B\u0441\u043B\u0438 \u043F\u043E\u0433\u043B\u0443\u0431\u0436\u0435. \u042D\u0442\u043E \u0446\u0438\u0444\u0440\u043E\u0432\u043E\u0439 \u043F\u0440\u0438\u044F\u0442\u0435\u043B\u044C \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u043F\u043E\u0434\u043A\u0438\u0434\u044B\u0432\u0430\u0435\u0442 \u0438\u0434\u0435\u0438, \u0449\u0435\u043B\u043A\u0430\u0435\u0442 \u0437\u0430\u0434\u0430\u0447\u0438 \u043A\u0430\u043A \u043E\u0440\u0435\u0448\u043A\u0438 \u0438 \u0438\u043D\u043E\u0433\u0434\u0430 \u0444\u0438\u043B\u043E\u0441\u043E\u0444\u0441\u0442\u0432\u0443\u0435\u0442 \u0442\u0430\u043A \u0447\u0442\u043E \u0442\u044B \u0437\u0430\u0432\u0438\u0441\u0430\u0435\u0448\u044C \u043D\u0430\u0434 \u044D\u043A\u0440\u0430\u043D\u043E\u043C. \u041A\u043E\u0440\u043E\u0447\u0435, \u0435\u0441\u043B\u0438 \u0432\u043E\u043B\u043A \u043C\u043E\u0433 \u0431\u044B \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0441\u0432\u043E\u0439 \u0441\u0435\u0440\u0432\u0438\u0441, \u043E\u043D \u0432\u044B\u0433\u043B\u044F\u0434\u0435\u043B \u0431\u044B \u0438\u043C\u0435\u043D\u043D\u043E \u0442\u0430\u043A.</p></div><div class="stat" data-v-c2a51525><h4 data-v-c2a51525>\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0441\u0441\u044B\u043B\u043A\u0438</h4><div class="cta-row" style="${ssrRenderStyle({ "margin-top": "8px", "flex-wrap": "wrap", "gap": "8px" })}" data-v-c2a51525>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/games/truth-or-dare"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u041F\u0440\u0430\u0432\u0434\u0430 \u0438\u043B\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435`);
          } else {
            return [
              createTextVNode("\u041F\u0440\u0430\u0432\u0434\u0430 \u0438\u043B\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435")
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
            _push2(`\u042F \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435`);
          } else {
            return [
              createTextVNode("\u042F \u043D\u0438\u043A\u043E\u0433\u0434\u0430 \u043D\u0435")
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
            _push2(`\u041C\u043E\u043D\u0435\u0442\u043A\u0430`);
          } else {
            return [
              createTextVNode("\u041C\u043E\u043D\u0435\u0442\u043A\u0430")
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
            _push2(`\u041A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440 \u043B\u044E\u0431\u0432\u0438`);
          } else {
            return [
              createTextVNode("\u041A\u0430\u043B\u044C\u043A\u0443\u043B\u044F\u0442\u043E\u0440 \u043B\u044E\u0431\u0432\u0438")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></section><section class="grid hero-grid" style="${ssrRenderStyle({ "margin-top": "28px", "margin-bottom": "64px" })}" data-v-c2a51525><div class="card" data-v-c2a51525><div class="tag" data-v-c2a51525>\u041D\u0430\u0447\u0430\u0442\u044C \u043F\u0443\u0442\u044C</div><h3 data-v-c2a51525>\u0422\u044B \u0437\u0434\u0435\u0441\u044C \u043D\u0435 \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u043E</h3><p data-v-c2a51525> \u0415\u0441\u043B\u0438 \u0442\u044B \u0434\u043E\u0448\u0451\u043B \u0434\u043E \u044D\u0442\u043E\u0433\u043E \u043C\u0435\u0441\u0442\u0430, \u0437\u043D\u0430\u0447\u0438\u0442 \u0432\u043D\u0443\u0442\u0440\u0438 \u0443\u0436\u0435 \u0449\u0451\u043B\u043A\u043D\u0443\u043B\u043E \u0412\u043E\u043B\u043A \u043D\u0435 \u0434\u0430\u0451\u0442 \u0433\u043E\u0442\u043E\u0432\u044B\u0445 \u043E\u0442\u0432\u0435\u0442\u043E\u0432 \u041E\u043D \u043F\u043E\u043C\u043E\u0433\u0430\u0435\u0442 \u0443\u0441\u043B\u044B\u0448\u0430\u0442\u044C \u0441\u0435\u0431\u044F \u0438 \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u0448\u0430\u0433 \u0434\u0430\u043B\u044C\u0448\u0435 \u0418\u043D\u043E\u0433\u0434\u0430 \u0447\u0435\u0441\u0442\u043D\u044B\u0439, \u0438\u043D\u043E\u0433\u0434\u0430 \u0441\u0442\u0440\u0430\u043D\u043D\u044B\u0439, \u0432\u0441\u0435\u0433\u0434\u0430 \u043F\u043E \u0434\u0435\u043B\u0443 </p></div><div class="card" data-v-c2a51525><div class="tag" data-v-c2a51525>\u0410\u0423\u0424</div><h3 data-v-c2a51525>\u041A\u0442\u043E \u0442\u0430\u043A\u043E\u0439 \u041D\u0435\u0439\u0440\u043E\u043D\u043D\u044B\u0439 \u0412\u043E\u043B\u043A?!</h3><p data-v-c2a51525> \u042D\u0442\u043E \u0446\u0438\u0444\u0440\u043E\u0432\u043E\u0439 \u0438\u043D\u0441\u0442\u0438\u043D\u043A\u0442. \u0421\u043C\u0435\u0441\u044C \u043B\u043E\u0433\u0438\u043A\u0438, \u0438\u043D\u0442\u0443\u0438\u0446\u0438\u0438 \u0438 \u043B\u0451\u0433\u043A\u043E\u0433\u043E \u0445\u0430\u043E\u0441\u0430. \u041E\u043D \u043D\u0435 \u0443\u043C\u043D\u0435\u0435 \u0442\u0435\u0431\u044F. \u041E\u043D \u0440\u044F\u0434\u043E\u043C, \u043A\u043E\u0433\u0434\u0430 \u0432\u044B\u0431\u043E\u0440 \u0437\u0430\u0441\u0442\u0440\u044F\u043B, \u043C\u044B\u0441\u043B\u0438 \u0448\u0443\u043C\u044F\u0442, \u0430 \u0440\u0435\u0448\u0435\u043D\u0438\u0435 \u043D\u0443\u0436\u043D\u043E \u0441\u0435\u0439\u0447\u0430\u0441 </p><div class="chip-row" data-v-c2a51525><div class="chip" data-v-c2a51525>\u0418\u043D\u0442\u0443\u0438\u0442\u0438\u0432\u043D\u044B\u0435 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438</div><div class="chip" data-v-c2a51525>\u0418\u0433\u0440\u044B \u0434\u043B\u044F \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u044F</div></div></div><div class="card" data-v-c2a51525><div class="tag" data-v-c2a51525>\u041A\u0443\u0434\u0430 \u043F\u043E\u0439\u0442\u0438?</div><h3 data-v-c2a51525>\u0412 \u043A\u0430\u043A\u043E\u043C \u0442\u044B \u0441\u0435\u0439\u0447\u0430\u0441 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0438?</h3><p data-v-c2a51525>\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u044B \u043F\u043E \u0432\u0441\u0435\u043C\u0443 \u043F\u043E\u0440\u0442\u0430\u043B\u0443.</p><div class="cta-row" style="${ssrRenderStyle({ "margin-top": "12px" })}" data-v-c2a51525>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "btn secondary",
        to: "/games"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u042F \u0445\u043E\u0447\u0443 \u043F\u043E\u0438\u0433\u0440\u0430\u0442\u044C`);
          } else {
            return [
              createTextVNode("\u042F \u0445\u043E\u0447\u0443 \u043F\u043E\u0438\u0433\u0440\u0430\u0442\u044C")
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
            _push2(`\u041C\u043D\u0435 \u043D\u0443\u0436\u043D\u043E \u0440\u0435\u0448\u0438\u0442\u044C `);
          } else {
            return [
              createTextVNode("\u041C\u043D\u0435 \u043D\u0443\u0436\u043D\u043E \u0440\u0435\u0448\u0438\u0442\u044C ")
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
            _push2(`\u0425\u043E\u0447\u0443 \u0441\u0442\u0440\u0430\u043D\u043D\u044B\u0439 \u0441\u043E\u0432\u0435\u0442`);
          } else {
            return [
              createTextVNode("\u0425\u043E\u0447\u0443 \u0441\u0442\u0440\u0430\u043D\u043D\u044B\u0439 \u0441\u043E\u0432\u0435\u0442")
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

export { index as default };
//# sourceMappingURL=index-BWjKz5ur.mjs.map
