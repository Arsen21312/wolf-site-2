import { ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
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
  __name: "nicknames",
  __ssrInlineRender: true,
  setup(__props) {
    const started = ref(false);
    const base = ref("");
    const nicknames2 = ref([]);
    ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "tod-page" }, _attrs))} data-v-c8fb54bc><div class="tod-container" data-v-c8fb54bc>`);
      if (!started.value) {
        _push(`<div class="tod-intro" data-v-c8fb54bc><h1 class="tod-title" data-v-c8fb54bc>Никнейм или волчье имя</h1><p class="tod-subtitle" data-v-c8fb54bc>Введи имя или слово — сгенерим несколько вариантов ников без кринжа.</p><div class="tod-form" data-v-c8fb54bc><input${ssrRenderAttr("value", base.value)} type="text" placeholder="Твоё имя или слово" data-v-c8fb54bc><button class="tod-btn tod-btn-primary" data-v-c8fb54bc>Дать варианты</button></div><p class="tod-hint" data-v-c8fb54bc>Сразу выдадим подборку из пяти вариантов.</p></div>`);
      } else {
        _push(`<div class="tod-game" data-v-c8fb54bc><div class="tod-card" data-v-c8fb54bc><div class="tod-label" data-v-c8fb54bc>подборка ников</div><ul class="nick-list" data-v-c8fb54bc><!--[-->`);
        ssrRenderList(nicknames2.value, (nick) => {
          _push(`<li data-v-c8fb54bc>${ssrInterpolate(nick)}</li>`);
        });
        _push(`<!--]--></ul></div><div class="tod-actions" data-v-c8fb54bc><div class="tod-buttons" data-v-c8fb54bc><button class="tod-btn tod-btn-ghost" data-v-c8fb54bc>Ещё варианты</button></div><div class="tod-form-inline" data-v-c8fb54bc><input${ssrRenderAttr("value", base.value)} type="text" placeholder="Сменить базу (имя / слово)" data-v-c8fb54bc><button class="tod-btn" data-v-c8fb54bc>Обновить</button></div></div></div>`);
      }
      _push(`</div></section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/decisions/nicknames.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const nicknames = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c8fb54bc"]]);
export {
  nicknames as default
};
//# sourceMappingURL=nicknames-Bs3JNt3p.js.map
