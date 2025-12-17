import { ref, computed, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { S as SocialPopup } from "./SocialPopup-C9eZeUoF.js";
import { _ as _export_sfc } from "../server.mjs";
const _sfc_main = {
  __name: "TrueOrFalse",
  __ssrInlineRender: true,
  setup(__props) {
    const categories = [
      { id: "science", label: "Наука", icon: "🔬" },
      { id: "history", label: "История", icon: "🏺" },
      { id: "geo", label: "География", icon: "🌍" },
      { id: "pop", label: "Поп-культура", icon: "🎬" },
      { id: "random", label: "Случайное", icon: "🎲" }
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
        title: "Подпишись на Telegram",
        text: "Куча мемов, всё самое свежее тут",
        cta: "Перейти в логово",
        link: "https://t.me/neural_wise_wolf",
        emoji: "📬"
      },
      {
        title: "Залетай в Instagram",
        text: "Самое первое и большое сообщество, много мемов с волками",
        cta: "Открыть Instagram",
        link: "https://instagram.com/neural_wise_wolf/",
        emoji: "📸"
      },
      {
        title: "TikTok Волка",
        text: "Мемы, стримы и много волков",
        cta: "Смотреть TikTok",
        link: "https://www.tiktok.com/@neural_wolf",
        emoji: "🎵"
      },
      {
        title: "YouTube канал",
        text: "Шортсы и длинные видосы с волками",
        cta: "Открыть YouTube",
        link: "https://www.youtube.com/@neural_wolf",
        emoji: "▶️"
      }
    ];
    const popupPayload = computed(() => socials[popupIndex.value % socials.length]);
    const currentLabel = computed(() => {
      const c = categories.find((item) => item.id === selectedCategory.value);
      return c ? c.label : "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: ["tof-shell", { "tof-play": selectedCategory.value }]
      }, _attrs))} data-v-7189821a>`);
      if (!selectedCategory.value) {
        _push(`<div class="tof-content" data-v-7189821a><h1 data-v-7189821a>Правда или ложь</h1><p class="tof-sub" data-v-7189821a> Проверь, где правда, а где вымысел. Выбирай тему и отвечай, а Волк сразу покажет результат. </p><div class="tof-filters" data-v-7189821a><!--[-->`);
        ssrRenderList(categories, (c) => {
          _push(`<button class="${ssrRenderClass([{ "tof-chip-active": selectedCategory.value === c.id }, "tof-chip"])}" data-v-7189821a><span class="tof-chip-icon" data-v-7189821a>${ssrInterpolate(c.icon)}</span> ${ssrInterpolate(c.label)}</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="tof-content tof-game" data-v-7189821a><div class="tof-filters" data-v-7189821a><!--[-->`);
        ssrRenderList(categories, (c) => {
          _push(`<button class="${ssrRenderClass([{ "tof-chip-active": selectedCategory.value === c.id }, "tof-chip"])}" data-v-7189821a><span class="tof-chip-icon" data-v-7189821a>${ssrInterpolate(c.icon)}</span> ${ssrInterpolate(c.label)}</button>`);
        });
        _push(`<!--]--></div><div class="tof-card" data-v-7189821a><div class="tof-label" data-v-7189821a>${ssrInterpolate(currentLabel.value)}</div><div class="tof-prompt" data-v-7189821a>${ssrInterpolate(currentStatement.value?.text)}</div>`);
        if (!showResult.value) {
          _push(`<div class="tof-buttons" data-v-7189821a><button class="tof-btn tof-btn-true" data-v-7189821a>Правда</button><button class="tof-btn tof-btn-false" data-v-7189821a>Ложь</button></div>`);
        } else {
          _push(`<div class="tof-result" data-v-7189821a><div class="tof-answer" data-v-7189821a> Правильный ответ: <span class="${ssrRenderClass(currentStatement.value?.answer ? "tof-true" : "tof-false")}" data-v-7189821a>${ssrInterpolate(currentStatement.value?.answer ? "Правда" : "Ложь")}</span></div>`);
          if (currentStatement.value?.explanation) {
            _push(`<p class="tof-expl" data-v-7189821a>${ssrInterpolate(currentStatement.value.explanation)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div><div class="tof-actions" data-v-7189821a><button class="tof-next" data-v-7189821a>Дальше</button></div></div>`);
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
export {
  TrueOrFalse as T
};
//# sourceMappingURL=TrueOrFalse-B5uuzJ64.js.map
