import { ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
import { ref, computed, useSSRContext } from "vue";
import { S as SocialPopup } from "./SocialPopup-C9eZeUoF.js";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/hookable/dist/index.mjs";
import { _ as _export_sfc } from "../server.mjs";
const duration = 5;
const _sfc_main = {
  __name: "FiveSeconds",
  __ssrInlineRender: true,
  setup(__props) {
    const categories = [
      { id: "popular", label: "Популярное", icon: "🥤" },
      { id: "family", label: "Для семейных пар", icon: "💜" },
      { id: "extreme", label: "Экстрим", icon: "🔥" },
      { id: "nsfw", label: "18+", icon: "🔞" }
    ];
    const prompts = [
      // Популярное
      { text: "Назовите три вида молочных продуктов", category: "popular" },
      { text: "Назовите три социальных сети", category: "popular" },
      { text: "Назовите три фрукта жёлтого цвета", category: "popular" },
      { text: "Назовите три вида спорта с мячом", category: "popular" },
      { text: "Назовите три популярных сериала", category: "popular" },
      { text: "Назовите три вида кофе", category: "popular" },
      { text: "Назовите три музыкальных инструмента", category: "popular" },
      { text: "Назовите три кино-жанра", category: "popular" },
      { text: "Назовите три вида хлеба", category: "popular" },
      { text: "Назовите три овоща", category: "popular" },
      // Для семейных пар
      { text: "Назовите три домашних занятия, которые вы любите вместе", category: "family" },
      { text: "Назовите три любимых блюда вашей семьи", category: "family" },
      { text: "Назовите три семейные традиции", category: "family" },
      { text: "Назовите три фильма для семейного просмотра", category: "family" },
      { text: "Назовите три способа провести воскресенье", category: "family" },
      { text: "Назовите три настольные игры, которые вы играете вместе", category: "family" },
      { text: "Назовите три вещи, которые делают дом уютным", category: "family" },
      { text: "Назовите три места для семейных прогулок", category: "family" },
      { text: "Назовите три десерта, которые всем нравятся", category: "family" },
      { text: "Назовите три любимых мультфильма", category: "family" },
      // Экстрим
      { text: "Назовите три экстремальных вида спорта", category: "extreme" },
      { text: "Назовите три места для прыжков с парашютом", category: "extreme" },
      { text: "Назовите три горные вершины, на которые мечтаете подняться", category: "extreme" },
      { text: "Назовите три водных экстремальных активности", category: "extreme" },
      { text: "Назовите три известных экстремала", category: "extreme" },
      { text: "Назовите три вида гонок", category: "extreme" },
      { text: "Назовите три способа испытать адреналин", category: "extreme" },
      { text: "Назовите три экстрим-фильма", category: "extreme" },
      { text: "Назовите три навыка выживания", category: "extreme" },
      { text: "Назовите три места для дайвинга", category: "extreme" },
      // 18+
      { text: "Назовите три темы, которые не обсуждают на первом свидании", category: "nsfw" },
      { text: "Назовите три провокационных вопроса", category: "nsfw" },
      { text: "Назовите три фильма 18+", category: "nsfw" },
      { text: "Назовите три смелых признания", category: "nsfw" },
      { text: "Назовите три запретные темы", category: "nsfw" },
      { text: "Назовите три вещи, которые держат в секрете", category: "nsfw" },
      { text: "Назовите три вида откровенных разговоров", category: "nsfw" },
      { text: "Назовите три рискованных поступка", category: "nsfw" },
      { text: "Назовите три забавные неловкие ситуации", category: "nsfw" },
      { text: "Назовите три популярные истории скандалов", category: "nsfw" }
    ];
    const gameStarted = ref(false);
    const timer = ref(duration);
    const activeCategory = ref("popular");
    const currentPromptIndex = ref(0);
    ref(null);
    const timeUp = ref(false);
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
    const filteredPrompts = computed(
      () => prompts.filter((p) => p.category === activeCategory.value)
    );
    const currentPrompt = computed(() => {
      if (timeUp.value) return "Веремя вышло...";
      const list = filteredPrompts.value;
      return list.length ? list[currentPromptIndex.value % list.length].text : "Время вышло...";
    });
    const currentLabel = computed(() => {
      const c = categories.find((item) => item.id === activeCategory.value);
      return c ? c.label : "";
    });
    const displayTime = computed(() => Math.max(0, Math.ceil(timer.value)));
    const ringStyle = computed(() => {
      const radius = 52;
      const circumference = 2 * Math.PI * radius;
      const progress = Math.max(0, timer.value) / duration;
      return {
        strokeDasharray: `${circumference}px`,
        strokeDashoffset: `${circumference * (1 - progress)}px`
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><section class="${ssrRenderClass([{ "fs-started": gameStarted.value }, "fs-shell"])}" data-v-5aee7e94>`);
      if (!gameStarted.value) {
        _push(`<div class="fs-content" data-v-5aee7e94><h1 data-v-5aee7e94>Ответь за 5 секунд</h1><p class="fs-sub" data-v-5aee7e94>3 ответа, 5 секунд, бесконечный хаос</p><button class="fs-cta" data-v-5aee7e94><span class="fs-cta-icon" data-v-5aee7e94>▶</span> Начать игру </button></div>`);
      } else {
        _push(`<div class="fs-content fs-game" data-v-5aee7e94><div class="fs-filters" data-v-5aee7e94><!--[-->`);
        ssrRenderList(categories, (c) => {
          _push(`<button class="${ssrRenderClass([{ "fs-chip-active": activeCategory.value === c.id }, "fs-chip"])}" data-v-5aee7e94><span class="fs-chip-icon" data-v-5aee7e94>${ssrInterpolate(c.icon)}</span> ${ssrInterpolate(c.label)}</button>`);
        });
        _push(`<!--]--></div><div class="fs-card" data-v-5aee7e94><div class="fs-label" data-v-5aee7e94>${ssrInterpolate(currentLabel.value)}</div><div class="fs-prompt" data-v-5aee7e94>${ssrInterpolate(currentPrompt.value)}</div><div class="fs-timer" data-v-5aee7e94><svg viewBox="0 0 120 120" class="fs-ring" data-v-5aee7e94><circle class="fs-ring-bg" cx="60" cy="60" r="52" data-v-5aee7e94></circle><circle class="fs-ring-progress" cx="60" cy="60" r="52" style="${ssrRenderStyle(ringStyle.value)}" data-v-5aee7e94></circle><text x="60" y="66" text-anchor="middle" class="fs-timer-text" data-v-5aee7e94>${ssrInterpolate(displayTime.value)}</text></svg></div><div class="fs-hint" data-v-5aee7e94>Назовите три подходящих ответа</div></div><div class="fs-actions" data-v-5aee7e94><button class="fs-next" data-v-5aee7e94>Далее</button></div></div>`);
      }
      _push(`</section>`);
      _push(ssrRenderComponent(SocialPopup, {
        visible: showPopup.value,
        payload: popupPayload.value,
        onClose: ($event) => showPopup.value = false
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/games/FiveSeconds/FiveSeconds.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const FiveSecondsGame = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5aee7e94"]]);
export {
  FiveSecondsGame as F
};
//# sourceMappingURL=FiveSeconds-CxXeUALe.js.map
