import { ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
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
        _push(`<div class="tod-intro" data-v-c8fb54bc><h1 class="tod-title" data-v-c8fb54bc>\u041D\u0438\u043A\u043D\u0435\u0439\u043C \u0438\u043B\u0438 \u0432\u043E\u043B\u0447\u044C\u0435 \u0438\u043C\u044F</h1><p class="tod-subtitle" data-v-c8fb54bc>\u0412\u0432\u0435\u0434\u0438 \u0438\u043C\u044F \u0438\u043B\u0438 \u0441\u043B\u043E\u0432\u043E \u2014 \u0441\u0433\u0435\u043D\u0435\u0440\u0438\u043C \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u043E\u0432 \u043D\u0438\u043A\u043E\u0432 \u0431\u0435\u0437 \u043A\u0440\u0438\u043D\u0436\u0430.</p><div class="tod-form" data-v-c8fb54bc><input${ssrRenderAttr("value", base.value)} type="text" placeholder="\u0422\u0432\u043E\u0451 \u0438\u043C\u044F \u0438\u043B\u0438 \u0441\u043B\u043E\u0432\u043E" data-v-c8fb54bc><button class="tod-btn tod-btn-primary" data-v-c8fb54bc>\u0414\u0430\u0442\u044C \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B</button></div><p class="tod-hint" data-v-c8fb54bc>\u0421\u0440\u0430\u0437\u0443 \u0432\u044B\u0434\u0430\u0434\u0438\u043C \u043F\u043E\u0434\u0431\u043E\u0440\u043A\u0443 \u0438\u0437 \u043F\u044F\u0442\u0438 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u043E\u0432.</p></div>`);
      } else {
        _push(`<div class="tod-game" data-v-c8fb54bc><div class="tod-card" data-v-c8fb54bc><div class="tod-label" data-v-c8fb54bc>\u043F\u043E\u0434\u0431\u043E\u0440\u043A\u0430 \u043D\u0438\u043A\u043E\u0432</div><ul class="nick-list" data-v-c8fb54bc><!--[-->`);
        ssrRenderList(nicknames2.value, (nick) => {
          _push(`<li data-v-c8fb54bc>${ssrInterpolate(nick)}</li>`);
        });
        _push(`<!--]--></ul></div><div class="tod-actions" data-v-c8fb54bc><div class="tod-buttons" data-v-c8fb54bc><button class="tod-btn tod-btn-ghost" data-v-c8fb54bc>\u0415\u0449\u0451 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B</button></div><div class="tod-form-inline" data-v-c8fb54bc><input${ssrRenderAttr("value", base.value)} type="text" placeholder="\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u0431\u0430\u0437\u0443 (\u0438\u043C\u044F / \u0441\u043B\u043E\u0432\u043E)" data-v-c8fb54bc><button class="tod-btn" data-v-c8fb54bc>\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C</button></div></div></div>`);
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

export { nicknames as default };
//# sourceMappingURL=nicknames-Bs3JNt3p.mjs.map
