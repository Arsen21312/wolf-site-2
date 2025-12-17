import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { S as SocialPopup } from './SocialPopup-C9eZeUoF.mjs';
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

const microCategories = [
  {
    id: "impulse",
    label: "\u0418\u043C\u043F\u0443\u043B\u044C\u0441",
    icon: "\u26A1",
    description: "\u0411\u044B\u0441\u0442\u0440\u044B\u0439 \u0442\u043E\u043B\u0447\u043E\u043A, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0441\u043D\u0443\u0442\u044C\u0441\u044F",
    actions: [
      "\u0421\u0434\u0435\u043B\u0430\u0439 15 \u043F\u0440\u0438\u0441\u0435\u0434\u0430\u043D\u0438\u0439 \u0431\u0435\u0437 \u043C\u0443\u0437\u044B\u043A\u0438",
      "\u041D\u0430\u043F\u0438\u0448\u0438 \u0434\u0440\u0443\u0433\u0443 \u043E\u0434\u043D\u0443 \u0447\u0435\u0441\u0442\u043D\u0443\u044E \u0444\u0440\u0430\u0437\u0443 \u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u044C",
      "\u0423\u043C\u043E\u0439\u0441\u044F \u0445\u043E\u043B\u043E\u0434\u043D\u043E\u0439 \u0432\u043E\u0434\u043E\u0439 \u0438 \u0441\u0434\u0435\u043B\u0430\u0439 \u0433\u043B\u0443\u0431\u043E\u043A\u0438\u0439 \u0432\u0434\u043E\u0445",
      "\u041E\u0442\u043A\u0440\u043E\u0439 \u043E\u043A\u043D\u043E \u0438 \u043F\u043E\u0434\u044B\u0448\u0438 60 \u0441\u0435\u043A\u0443\u043D\u0434, \u0433\u043B\u044F\u0434\u044F \u0432\u0434\u0430\u043B\u044C",
      "\u0421\u0434\u0435\u043B\u0430\u0439 20 \u043E\u0442\u0436\u0438\u043C\u0430\u043D\u0438\u0439, \u0435\u0441\u043B\u0438 \u043D\u0435 \u043C\u043E\u0436\u0435\u0448\u044C \u2014 \u0441\u0442\u043E\u043B\u044C\u043A\u043E, \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0432\u044B\u0439\u0434\u0435\u0442"
    ]
  },
  {
    id: "switch",
    label: "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435",
    icon: "\u{1F9E0}",
    description: "\u041C\u0435\u043D\u044F\u0435\u043C \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442, \u0447\u0442\u043E\u0431\u044B \u043C\u043E\u0437\u0433 \u043E\u0436\u0438\u043B",
    actions: [
      "\u0421\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u043B\u0435\u0439\u043B\u0438\u0441\u0442: \u0432\u043A\u043B\u044E\u0447\u0438 \u0436\u0430\u043D\u0440, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0440\u0435\u0434\u043A\u043E \u0441\u043B\u0443\u0448\u0430\u0435\u0448\u044C",
      "\u0412\u044B\u0439\u0434\u0438 \u043D\u0430 \u0443\u043B\u0438\u0446\u0443 \u0438 \u0434\u043E\u0439\u0434\u0438 \u0434\u043E \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0433\u043E \u0443\u0433\u043B\u0430, \u0441\u0447\u0438\u0442\u0430\u044F \u0448\u0430\u0433\u0438",
      "\u0421\u0434\u0435\u043B\u0430\u0439 3 \u0444\u043E\u0442\u043E \u043D\u0435\u043E\u0431\u044B\u0447\u043D\u044B\u0445 \u0434\u0435\u0442\u0430\u043B\u0435\u0439 \u0432\u043E\u043A\u0440\u0443\u0433",
      "\u0417\u0430\u043F\u0438\u0448\u0438 \u0433\u043E\u043B\u043E\u0441\u043E\u043C \u043E\u0434\u043D\u0443 \u0438\u0434\u0435\u044E, \u0447\u0442\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C \u0441\u0435\u0433\u043E\u0434\u043D\u044F",
      "\u0421\u044F\u0434\u044C \u0438 2 \u043C\u0438\u043D\u0443\u0442\u044B \u0441\u043C\u043E\u0442\u0440\u0438 \u043D\u0430 \u043F\u043E\u0442\u043E\u043B\u043E\u043A, \u0431\u0435\u0437 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430"
    ]
  },
  {
    id: "wolfstep",
    label: "\u0412\u043E\u043B\u0447\u0438\u0439 \u0448\u0430\u0433",
    icon: "\u{1F43A}",
    description: "\u0414\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0432\u043F\u0435\u0440\u0435\u0434 \u0432 \u0441\u0432\u043E\u0439 \u0440\u0438\u0442\u043C",
    actions: [
      "\u041D\u0430\u0431\u0435\u0440\u0438 \u0432\u043E\u0434\u0443, \u0441\u0434\u0435\u043B\u0430\u0439 \u043F\u0430\u0440\u0443 \u0433\u043B\u043E\u0442\u043A\u043E\u0432 \u0438 \u0437\u0430\u043A\u0440\u043E\u0439 \u0437\u0430\u0434\u0430\u0447\u0443, \u0447\u0442\u043E \u043E\u0442\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u043B 5 \u043C\u0438\u043D\u0443\u0442",
      "\u0423\u0431\u0435\u0440\u0438 \u043E\u0434\u043D\u0443 \u0432\u0435\u0449\u044C \u0441\u043E \u0441\u0442\u043E\u043B\u0430 \u0438\u043B\u0438 \u0438\u0437 \u043A\u043E\u043C\u043D\u0430\u0442\u044B",
      "\u0421\u0434\u0435\u043B\u0430\u0439 \u043F\u043B\u0430\u043D \u043D\u0430 \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0438\u0435 30 \u043C\u0438\u043D\u0443\u0442 \u0438\u0437 3 \u043F\u0443\u043D\u043A\u0442\u043E\u0432",
      "\u0417\u0430\u043F\u0438\u0448\u0438 \u0446\u0435\u043B\u044C \u043D\u0430 \u0434\u0435\u043D\u044C \u043E\u0434\u043D\u0438\u043C \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435\u043C \u0438 \u043F\u043E\u0441\u0442\u0430\u0432\u044C \u0441\u0435\u0431\u0435 \u043D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435",
      "\u041D\u0430\u0434\u0435\u043D\u044C \u043E\u0431\u0443\u0432\u044C \u0438 \u0432\u044B\u0439\u0434\u0438 \u043F\u0440\u043E\u0439\u0442\u0438\u0441\u044C \u0432\u043E\u043A\u0440\u0443\u0433 \u0434\u043E\u043C\u0430 \u0438\u043B\u0438 \u043F\u043E\u0434\u044A\u0435\u0437\u0434\u0430"
    ]
  }
];
const _sfc_main = {
  __name: "micro-actions",
  __ssrInlineRender: true,
  setup(__props) {
    const categories = microCategories;
    const gameStarted = ref(false);
    const activeCategory = ref(categories[0].id);
    const currentAction = ref("");
    ref({ impulse: -1, switch: -1, wolfstep: -1 });
    const isAnimating = ref(false);
    const feedback = ref("");
    ref(0);
    const showPopup = ref(false);
    const popupIndex = ref(0);
    const currentCategoryLabel = computed(() => {
      const item = categories.find((c) => c.id === activeCategory.value);
      return item ? item.label : activeCategory.value;
    });
    const socials = [
      {
        title: "\u041F\u043E\u0434\u043F\u0438\u0448\u0438\u0441\u044C \u043D\u0430 Telegram",
        text: "\u041A\u0443\u0447\u0430 \u043C\u0435\u043C\u043E\u0432, \u0432\u0441\u0451 \u0441\u0430\u043C\u043E\u0435 \u0441\u0432\u0435\u0436\u0435\u0435 \u0442\u0443\u0442",
        cta: "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043B\u043E\u0433\u043E\u0432\u043E",
        link: "https://t.me/neural_wise_wolf",
        emoji: "\u{1F43A}"
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
        emoji: "\u{1F3A5}"
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "tod-page" }, _attrs))} data-v-5b5bedb6><div class="tod-container" data-v-5b5bedb6>`);
      if (!gameStarted.value) {
        _push(`<div class="tod-intro" data-v-5b5bedb6><h1 class="tod-title" data-v-5b5bedb6>\u041C\u0438\u043A\u0440\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435</h1><p class="tod-subtitle" data-v-5b5bedb6>1\u20135 \u043C\u0438\u043D\u0443\u0442, \u0447\u0442\u043E\u0431\u044B \u0441\u0434\u0432\u0438\u043D\u0443\u0442\u044C\u0441\u044F \u0441 \u043C\u0435\u0441\u0442\u0430. \u0416\u043C\u0438 \u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0443\u0439 \u043F\u0440\u044F\u043C\u043E \u0441\u0435\u0439\u0447\u0430\u0441.</p><button class="tod-btn tod-btn-primary" data-v-5b5bedb6>\u0414\u0430\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435</button><p class="tod-hint" data-v-5b5bedb6>\u0412\u044B\u0431\u0438\u0440\u0430\u0435\u043C \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u0441\u0440\u0430\u0437\u0443 \u043F\u043E\u0441\u043B\u0435 \u0441\u0442\u0430\u0440\u0442\u0430.</p></div>`);
      } else {
        _push(`<div class="tod-game" data-v-5b5bedb6><div class="tod-modes" data-v-5b5bedb6><!--[-->`);
        ssrRenderList(unref(categories), (cat) => {
          _push(`<button class="${ssrRenderClass([{ "tod-chip-active": activeCategory.value === cat.id }, "tod-chip"])}" data-v-5b5bedb6><span class="tod-chip-label" data-v-5b5bedb6><span class="tod-chip-icon" data-v-5b5bedb6>${ssrInterpolate(cat.icon)}</span> ${ssrInterpolate(cat.label)}</span><span class="tod-chip-desc" data-v-5b5bedb6>${ssrInterpolate(cat.description)}</span></button>`);
        });
        _push(`<!--]--></div><div class="tod-card" data-v-5b5bedb6><div class="tod-label" data-v-5b5bedb6><span data-v-5b5bedb6>\u043C\u0438\u043A\u0440\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435</span>, <span data-v-5b5bedb6>${ssrInterpolate(currentCategoryLabel.value)}</span></div><div class="${ssrRenderClass([{ "tod-question-animate": isAnimating.value }, "tod-question-text"])}" data-v-5b5bedb6>${ssrInterpolate(currentAction.value)}</div>`);
        if (feedback.value) {
          _push(`<p class="tod-wolf-hint" data-v-5b5bedb6><span class="tod-wolf-hint-strong" data-v-5b5bedb6>${ssrInterpolate(feedback.value)}</span></p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="tod-actions" data-v-5b5bedb6><div class="tod-buttons" data-v-5b5bedb6><button class="tod-btn tod-btn-ghost" data-v-5b5bedb6>\u0414\u0440\u0443\u0433\u043E\u0435</button><button class="tod-btn tod-btn-primary" data-v-5b5bedb6>\u0421\u0434\u0435\u043B\u0430\u043B</button></div></div></div>`);
      }
      _push(`</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/decisions/micro-actions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const microActions = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5b5bedb6"]]);

export { microActions as default };
//# sourceMappingURL=micro-actions-CJ78i3YI.mjs.map
