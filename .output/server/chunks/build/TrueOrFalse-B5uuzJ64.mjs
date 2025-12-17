import { ref, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { S as SocialPopup } from './SocialPopup-C9eZeUoF.mjs';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {
  __name: "TrueOrFalse",
  __ssrInlineRender: true,
  setup(__props) {
    const categories = [
      { id: "science", label: "\u041D\u0430\u0443\u043A\u0430", icon: "\u{1F52C}" },
      { id: "history", label: "\u0418\u0441\u0442\u043E\u0440\u0438\u044F", icon: "\u{1F3FA}" },
      { id: "geo", label: "\u0413\u0435\u043E\u0433\u0440\u0430\u0444\u0438\u044F", icon: "\u{1F30D}" },
      { id: "pop", label: "\u041F\u043E\u043F-\u043A\u0443\u043B\u044C\u0442\u0443\u0440\u0430", icon: "\u{1F3AC}" },
      { id: "random", label: "\u0421\u043B\u0443\u0447\u0430\u0439\u043D\u043E\u0435", icon: "\u{1F3B2}" }
    ];
    ref(false);
    const selectedCategory = ref(null);
    const currentStatement = ref(null);
    ref(null);
    const showResult = ref(false);
    ref({});
    ref(0);
    const showPopup = ref(false);
    const popupIndex = ref(0);
    const socials = [
      {
        title: "\u041F\u043E\u0434\u043F\u0438\u0448\u0438\u0441\u044C \u043D\u0430 Telegram",
        text: "\u041A\u0443\u0447\u0430 \u043C\u0435\u043C\u043E\u0432, \u0432\u0441\u0451 \u0441\u0430\u043C\u043E\u0435 \u0441\u0432\u0435\u0436\u0435\u0435 \u0442\u0443\u0442",
        cta: "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043B\u043E\u0433\u043E\u0432\u043E",
        link: "https://t.me/neural_wise_wolf",
        emoji: "\u{1F4EC}"
      },
      {
        title: "\u0417\u0430\u043B\u0435\u0442\u0430\u0439 \u0432 Instagram",
        text: "\u0421\u0430\u043C\u043E\u0435 \u043F\u0435\u0440\u0432\u043E\u0435 \u0438 \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u0441\u0442\u0432\u043E, \u043C\u043D\u043E\u0433\u043E \u043C\u0435\u043C\u043E\u0432 \u0441 \u0432\u043E\u043B\u043A\u0430\u043C\u0438",
        cta: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C Instagram",
        link: "https://instagram.com/neural_wise_wolf/",
        emoji: "\u{1F4F8}"
      },
      {
        title: "TikTok \u0412\u043E\u043B\u043A\u0430",
        text: "\u041C\u0435\u043C\u044B, \u0441\u0442\u0440\u0438\u043C\u044B \u0438 \u043C\u043D\u043E\u0433\u043E \u0432\u043E\u043B\u043A\u043E\u0432",
        cta: "\u0421\u043C\u043E\u0442\u0440\u0435\u0442\u044C TikTok",
        link: "https://www.tiktok.com/@neural_wolf",
        emoji: "\u{1F3B5}"
      },
      {
        title: "YouTube \u043A\u0430\u043D\u0430\u043B",
        text: "\u0428\u043E\u0440\u0442\u0441\u044B \u0438 \u0434\u043B\u0438\u043D\u043D\u044B\u0435 \u0432\u0438\u0434\u043E\u0441\u044B \u0441 \u0432\u043E\u043B\u043A\u0430\u043C\u0438",
        cta: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C YouTube",
        link: "https://www.youtube.com/@neural_wolf",
        emoji: "\u25B6\uFE0F"
      }
    ];
    const popupPayload = computed(() => socials[popupIndex.value % socials.length]);
    const currentLabel = computed(() => {
      const c = categories.find((item) => item.id === selectedCategory.value);
      return c ? c.label : "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: ["tof-shell", { "tof-play": selectedCategory.value }]
      }, _attrs))} data-v-7189821a>`);
      if (!selectedCategory.value) {
        _push(`<div class="tof-content" data-v-7189821a><h1 data-v-7189821a>\u041F\u0440\u0430\u0432\u0434\u0430 \u0438\u043B\u0438 \u043B\u043E\u0436\u044C</h1><p class="tof-sub" data-v-7189821a> \u041F\u0440\u043E\u0432\u0435\u0440\u044C, \u0433\u0434\u0435 \u043F\u0440\u0430\u0432\u0434\u0430, \u0430 \u0433\u0434\u0435 \u0432\u044B\u043C\u044B\u0441\u0435\u043B. \u0412\u044B\u0431\u0438\u0440\u0430\u0439 \u0442\u0435\u043C\u0443 \u0438 \u043E\u0442\u0432\u0435\u0447\u0430\u0439, \u0430 \u0412\u043E\u043B\u043A \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u043A\u0430\u0436\u0435\u0442 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442. </p><div class="tof-filters" data-v-7189821a><!--[-->`);
        ssrRenderList(categories, (c) => {
          _push(`<button class="${ssrRenderClass([{ "tof-chip-active": selectedCategory.value === c.id }, "tof-chip"])}" data-v-7189821a><span class="tof-chip-icon" data-v-7189821a>${ssrInterpolate(c.icon)}</span> ${ssrInterpolate(c.label)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="tof-content tof-game" data-v-7189821a><div class="tof-filters" data-v-7189821a><!--[-->`);
        ssrRenderList(categories, (c) => {
          _push(`<button class="${ssrRenderClass([{ "tof-chip-active": selectedCategory.value === c.id }, "tof-chip"])}" data-v-7189821a><span class="tof-chip-icon" data-v-7189821a>${ssrInterpolate(c.icon)}</span> ${ssrInterpolate(c.label)}</button>`);
        });
        _push(`<!--]--></div><div class="tof-card" data-v-7189821a><div class="tof-label" data-v-7189821a>${ssrInterpolate(currentLabel.value)}</div><div class="tof-prompt" data-v-7189821a>${ssrInterpolate((_a = currentStatement.value) == null ? void 0 : _a.text)}</div>`);
        if (!showResult.value) {
          _push(`<div class="tof-buttons" data-v-7189821a><button class="tof-btn tof-btn-true" data-v-7189821a>\u041F\u0440\u0430\u0432\u0434\u0430</button><button class="tof-btn tof-btn-false" data-v-7189821a>\u041B\u043E\u0436\u044C</button></div>`);
        } else {
          _push(`<div class="tof-result" data-v-7189821a><div class="tof-answer" data-v-7189821a> \u041F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442: <span class="${ssrRenderClass(((_b = currentStatement.value) == null ? void 0 : _b.answer) ? "tof-true" : "tof-false")}" data-v-7189821a>${ssrInterpolate(((_c = currentStatement.value) == null ? void 0 : _c.answer) ? "\u041F\u0440\u0430\u0432\u0434\u0430" : "\u041B\u043E\u0436\u044C")}</span></div>`);
          if ((_d = currentStatement.value) == null ? void 0 : _d.explanation) {
            _push(`<p class="tof-expl" data-v-7189821a>${ssrInterpolate(currentStatement.value.explanation)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div><div class="tof-actions" data-v-7189821a><button class="tof-next" data-v-7189821a>\u0414\u0430\u043B\u044C\u0448\u0435</button></div></div>`);
      }
      _push(ssrRenderComponent(SocialPopup, {
        visible: showPopup.value,
        payload: popupPayload.value,
        onClose: ($event) => showPopup.value = false
      }, null, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/games/TrueOrFalse/TrueOrFalse.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TrueOrFalse = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7189821a"]]);

export { TrueOrFalse as T };
//# sourceMappingURL=TrueOrFalse-B5uuzJ64.mjs.map
