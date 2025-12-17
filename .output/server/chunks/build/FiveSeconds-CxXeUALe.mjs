import { ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { ref, computed, useSSRContext } from 'vue';
import { S as SocialPopup } from './SocialPopup-C9eZeUoF.mjs';
import { _ as _export_sfc } from './server.mjs';

const duration = 5;
const _sfc_main = {
  __name: "FiveSeconds",
  __ssrInlineRender: true,
  setup(__props) {
    const categories = [
      { id: "popular", label: "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u043E\u0435", icon: "\u{1F964}" },
      { id: "family", label: "\u0414\u043B\u044F \u0441\u0435\u043C\u0435\u0439\u043D\u044B\u0445 \u043F\u0430\u0440", icon: "\u{1F49C}" },
      { id: "extreme", label: "\u042D\u043A\u0441\u0442\u0440\u0438\u043C", icon: "\u{1F525}" },
      { id: "nsfw", label: "18+", icon: "\u{1F51E}" }
    ];
    const prompts = [
      // Популярное
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0432\u0438\u0434\u0430 \u043C\u043E\u043B\u043E\u0447\u043D\u044B\u0445 \u043F\u0440\u043E\u0434\u0443\u043A\u0442\u043E\u0432", category: "popular" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0441\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0445 \u0441\u0435\u0442\u0438", category: "popular" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0444\u0440\u0443\u043A\u0442\u0430 \u0436\u0451\u043B\u0442\u043E\u0433\u043E \u0446\u0432\u0435\u0442\u0430", category: "popular" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0432\u0438\u0434\u0430 \u0441\u043F\u043E\u0440\u0442\u0430 \u0441 \u043C\u044F\u0447\u043E\u043C", category: "popular" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0445 \u0441\u0435\u0440\u0438\u0430\u043B\u0430", category: "popular" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0432\u0438\u0434\u0430 \u043A\u043E\u0444\u0435", category: "popular" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043C\u0443\u0437\u044B\u043A\u0430\u043B\u044C\u043D\u044B\u0445 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u0430", category: "popular" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043A\u0438\u043D\u043E-\u0436\u0430\u043D\u0440\u0430", category: "popular" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0432\u0438\u0434\u0430 \u0445\u043B\u0435\u0431\u0430", category: "popular" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043E\u0432\u043E\u0449\u0430", category: "popular" },
      // Для семейных пар
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0434\u043E\u043C\u0430\u0448\u043D\u0438\u0445 \u0437\u0430\u043D\u044F\u0442\u0438\u044F, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0432\u044B \u043B\u044E\u0431\u0438\u0442\u0435 \u0432\u043C\u0435\u0441\u0442\u0435", category: "family" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043B\u044E\u0431\u0438\u043C\u044B\u0445 \u0431\u043B\u044E\u0434\u0430 \u0432\u0430\u0448\u0435\u0439 \u0441\u0435\u043C\u044C\u0438", category: "family" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0441\u0435\u043C\u0435\u0439\u043D\u044B\u0435 \u0442\u0440\u0430\u0434\u0438\u0446\u0438\u0438", category: "family" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0444\u0438\u043B\u044C\u043C\u0430 \u0434\u043B\u044F \u0441\u0435\u043C\u0435\u0439\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0430", category: "family" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0441\u043F\u043E\u0441\u043E\u0431\u0430 \u043F\u0440\u043E\u0432\u0435\u0441\u0442\u0438 \u0432\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435", category: "family" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043D\u0430\u0441\u0442\u043E\u043B\u044C\u043D\u044B\u0435 \u0438\u0433\u0440\u044B, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0432\u044B \u0438\u0433\u0440\u0430\u0435\u0442\u0435 \u0432\u043C\u0435\u0441\u0442\u0435", category: "family" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0432\u0435\u0449\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0434\u0435\u043B\u0430\u044E\u0442 \u0434\u043E\u043C \u0443\u044E\u0442\u043D\u044B\u043C", category: "family" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043C\u0435\u0441\u0442\u0430 \u0434\u043B\u044F \u0441\u0435\u043C\u0435\u0439\u043D\u044B\u0445 \u043F\u0440\u043E\u0433\u0443\u043B\u043E\u043A", category: "family" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0434\u0435\u0441\u0435\u0440\u0442\u0430, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0432\u0441\u0435\u043C \u043D\u0440\u0430\u0432\u044F\u0442\u0441\u044F", category: "family" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043B\u044E\u0431\u0438\u043C\u044B\u0445 \u043C\u0443\u043B\u044C\u0442\u0444\u0438\u043B\u044C\u043C\u0430", category: "family" },
      // Экстрим
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u044D\u043A\u0441\u0442\u0440\u0435\u043C\u0430\u043B\u044C\u043D\u044B\u0445 \u0432\u0438\u0434\u0430 \u0441\u043F\u043E\u0440\u0442\u0430", category: "extreme" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043C\u0435\u0441\u0442\u0430 \u0434\u043B\u044F \u043F\u0440\u044B\u0436\u043A\u043E\u0432 \u0441 \u043F\u0430\u0440\u0430\u0448\u044E\u0442\u043E\u043C", category: "extreme" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0433\u043E\u0440\u043D\u044B\u0435 \u0432\u0435\u0440\u0448\u0438\u043D\u044B, \u043D\u0430 \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043C\u0435\u0447\u0442\u0430\u0435\u0442\u0435 \u043F\u043E\u0434\u043D\u044F\u0442\u044C\u0441\u044F", category: "extreme" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0432\u043E\u0434\u043D\u044B\u0445 \u044D\u043A\u0441\u0442\u0440\u0435\u043C\u0430\u043B\u044C\u043D\u044B\u0445 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438", category: "extreme" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0445 \u044D\u043A\u0441\u0442\u0440\u0435\u043C\u0430\u043B\u0430", category: "extreme" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0432\u0438\u0434\u0430 \u0433\u043E\u043D\u043E\u043A", category: "extreme" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0441\u043F\u043E\u0441\u043E\u0431\u0430 \u0438\u0441\u043F\u044B\u0442\u0430\u0442\u044C \u0430\u0434\u0440\u0435\u043D\u0430\u043B\u0438\u043D", category: "extreme" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u044D\u043A\u0441\u0442\u0440\u0438\u043C-\u0444\u0438\u043B\u044C\u043C\u0430", category: "extreme" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043D\u0430\u0432\u044B\u043A\u0430 \u0432\u044B\u0436\u0438\u0432\u0430\u043D\u0438\u044F", category: "extreme" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043C\u0435\u0441\u0442\u0430 \u0434\u043B\u044F \u0434\u0430\u0439\u0432\u0438\u043D\u0433\u0430", category: "extreme" },
      // 18+
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0442\u0435\u043C\u044B, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u043D\u0435 \u043E\u0431\u0441\u0443\u0436\u0434\u0430\u044E\u0442 \u043D\u0430 \u043F\u0435\u0440\u0432\u043E\u043C \u0441\u0432\u0438\u0434\u0430\u043D\u0438\u0438", category: "nsfw" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043F\u0440\u043E\u0432\u043E\u043A\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0445 \u0432\u043E\u043F\u0440\u043E\u0441\u0430", category: "nsfw" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0444\u0438\u043B\u044C\u043C\u0430 18+", category: "nsfw" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0441\u043C\u0435\u043B\u044B\u0445 \u043F\u0440\u0438\u0437\u043D\u0430\u043D\u0438\u044F", category: "nsfw" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0437\u0430\u043F\u0440\u0435\u0442\u043D\u044B\u0435 \u0442\u0435\u043C\u044B", category: "nsfw" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0432\u0435\u0449\u0438, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 \u0434\u0435\u0440\u0436\u0430\u0442 \u0432 \u0441\u0435\u043A\u0440\u0435\u0442\u0435", category: "nsfw" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0432\u0438\u0434\u0430 \u043E\u0442\u043A\u0440\u043E\u0432\u0435\u043D\u043D\u044B\u0445 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u043E\u0432", category: "nsfw" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0440\u0438\u0441\u043A\u043E\u0432\u0430\u043D\u043D\u044B\u0445 \u043F\u043E\u0441\u0442\u0443\u043F\u043A\u0430", category: "nsfw" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u0437\u0430\u0431\u0430\u0432\u043D\u044B\u0435 \u043D\u0435\u043B\u043E\u0432\u043A\u0438\u0435 \u0441\u0438\u0442\u0443\u0430\u0446\u0438\u0438", category: "nsfw" },
      { text: "\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u044B\u0435 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u0441\u043A\u0430\u043D\u0434\u0430\u043B\u043E\u0432", category: "nsfw" }
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
    const filteredPrompts = computed(
      () => prompts.filter((p) => p.category === activeCategory.value)
    );
    const currentPrompt = computed(() => {
      if (timeUp.value) return "\u0412\u0435\u0440\u0435\u043C\u044F \u0432\u044B\u0448\u043B\u043E...";
      const list = filteredPrompts.value;
      return list.length ? list[currentPromptIndex.value % list.length].text : "\u0412\u0440\u0435\u043C\u044F \u0432\u044B\u0448\u043B\u043E...";
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
        _push(`<div class="fs-content" data-v-5aee7e94><h1 data-v-5aee7e94>\u041E\u0442\u0432\u0435\u0442\u044C \u0437\u0430 5 \u0441\u0435\u043A\u0443\u043D\u0434</h1><p class="fs-sub" data-v-5aee7e94>3 \u043E\u0442\u0432\u0435\u0442\u0430, 5 \u0441\u0435\u043A\u0443\u043D\u0434, \u0431\u0435\u0441\u043A\u043E\u043D\u0435\u0447\u043D\u044B\u0439 \u0445\u0430\u043E\u0441</p><button class="fs-cta" data-v-5aee7e94><span class="fs-cta-icon" data-v-5aee7e94>\u25B6</span> \u041D\u0430\u0447\u0430\u0442\u044C \u0438\u0433\u0440\u0443 </button></div>`);
      } else {
        _push(`<div class="fs-content fs-game" data-v-5aee7e94><div class="fs-filters" data-v-5aee7e94><!--[-->`);
        ssrRenderList(categories, (c) => {
          _push(`<button class="${ssrRenderClass([{ "fs-chip-active": activeCategory.value === c.id }, "fs-chip"])}" data-v-5aee7e94><span class="fs-chip-icon" data-v-5aee7e94>${ssrInterpolate(c.icon)}</span> ${ssrInterpolate(c.label)}</button>`);
        });
        _push(`<!--]--></div><div class="fs-card" data-v-5aee7e94><div class="fs-label" data-v-5aee7e94>${ssrInterpolate(currentLabel.value)}</div><div class="fs-prompt" data-v-5aee7e94>${ssrInterpolate(currentPrompt.value)}</div><div class="fs-timer" data-v-5aee7e94><svg viewBox="0 0 120 120" class="fs-ring" data-v-5aee7e94><circle class="fs-ring-bg" cx="60" cy="60" r="52" data-v-5aee7e94></circle><circle class="fs-ring-progress" cx="60" cy="60" r="52" style="${ssrRenderStyle(ringStyle.value)}" data-v-5aee7e94></circle><text x="60" y="66" text-anchor="middle" class="fs-timer-text" data-v-5aee7e94>${ssrInterpolate(displayTime.value)}</text></svg></div><div class="fs-hint" data-v-5aee7e94>\u041D\u0430\u0437\u043E\u0432\u0438\u0442\u0435 \u0442\u0440\u0438 \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0449\u0438\u0445 \u043E\u0442\u0432\u0435\u0442\u0430</div></div><div class="fs-actions" data-v-5aee7e94><button class="fs-next" data-v-5aee7e94>\u0414\u0430\u043B\u0435\u0435</button></div></div>`);
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

export { FiveSecondsGame as F };
//# sourceMappingURL=FiveSeconds-CxXeUALe.mjs.map
