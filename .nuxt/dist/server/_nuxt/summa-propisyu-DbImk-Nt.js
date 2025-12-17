import { ref, watch, computed, resolveComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import { u as useHead } from "./v3-D81umCog.js";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/hookable/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/unctx/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/h3/dist/index.mjs";
import "vue-router";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/radix3/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/defu/dist/defu.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/ufo/dist/index.mjs";
import "C:/Users/Арсентий/Desktop/волий сайт 2/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = {
  __name: "summa-propisyu",
  __ssrInlineRender: true,
  setup(__props) {
    const amountRaw = ref("");
    const currency = ref("RUB");
    const vatMode = ref("none");
    const vatCustom = ref(0);
    const decimalSeparator = ref(".");
    const activeTab = ref("basic");
    const copiedText = ref("");
    const history = ref([]);
    const currencies = ["RUB", "USD", "EUR", "UAH", "KZT"];
    const tabs = [
      { id: "basic", label: "Основные" },
      { id: "extended", label: "Расширенные" },
      { id: "financial", label: "Финансовые" }
    ];
    const examples = [
      { label: "1 000.00 RUB", description: "Одна тысяча рублей 00 копеек", amount: "1000.00", currency: "RUB" },
      { label: "250 500,25 KZT", description: "двести пятьдесят тысяч пятьсот тенге 25 тиынов", amount: "250500,25", currency: "KZT" },
      { label: "9999.99 USD", description: "девять тысяч девятьсот девяносто девять долларов 99 центов", amount: "9999.99", currency: "USD" }
    ];
    let debounceTimer;
    watch([amountRaw, currency, vatMode, vatCustom, decimalSeparator], () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(convert, 400);
    });
    const currentResults = computed(() => {
      const last = history.value[0];
      if (!last) return [];
      return last[activeTab.value] || [];
    });
    function parseAmount(raw) {
      if (!raw) return null;
      const cleaned = raw.replace(/\s+/g, "").replace(",", ".");
      const num = Number(cleaned);
      return Number.isFinite(num) ? num : null;
    }
    function getVatRate() {
      if (vatMode.value === "none") return 0;
      if (vatMode.value === "custom") return Math.max(0, Math.min(100, vatCustom.value || 0));
      return Number(vatMode.value);
    }
    function plural(value, forms) {
      const n = Math.abs(value) % 100;
      const n1 = n % 10;
      if (n > 10 && n < 20) return forms[2];
      if (n1 > 1 && n1 < 5) return forms[1];
      if (n1 === 1) return forms[0];
      return forms[2];
    }
    const UNITS = [
      [
        ["ноль", "", ""],
        ["один", "одна", "одно"],
        ["два", "две", "два"],
        ["три", "три", "три"],
        ["четыре", "четыре", "четыре"],
        ["пять", "пять", "пять"],
        ["шесть", "шесть", "шесть"],
        ["семь", "семь", "семь"],
        ["восемь", "восемь", "восемь"],
        ["девять", "девять", "девять"]
      ],
      ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"],
      ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"],
      ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"]
    ];
    const RANKS = [
      { forms: ["рубль", "рубля", "рублей"], fem: 0 },
      { forms: ["тысяча", "тысячи", "тысяч"], fem: 1 },
      { forms: ["миллион", "миллиона", "миллионов"], fem: 0 },
      { forms: ["миллиард", "миллиарда", "миллиардов"], fem: 0 }
    ];
    function tripletToWords(num, fem) {
      const words = [];
      const h = Math.floor(num / 100);
      const t = Math.floor(num % 100 / 10);
      const u = num % 10;
      if (h) words.push(UNITS[3][h]);
      if (t > 1) {
        words.push(UNITS[2][t]);
        if (u) words.push(UNITS[0][u][fem]);
      } else if (t === 1) {
        words.push(UNITS[1][u]);
      } else if (u || !h && !t && !words.length) {
        words.push(UNITS[0][u][fem]);
      }
      return words.join(" ");
    }
    function numberToWordsRu(value) {
      if (value === 0) return "ноль";
      const parts = [];
      let rank = 0;
      let n = value;
      while (n > 0 && rank < RANKS.length) {
        const triplet = n % 1e3;
        if (triplet) {
          const words = tripletToWords(triplet, rank === 1 ? 1 : 0);
          const rankWord = rank > 0 ? ` ${plural(triplet, RANKS[rank].forms)}` : "";
          parts.unshift(`${words}${rankWord}`.trim());
        }
        n = Math.floor(n / 1e3);
        rank++;
      }
      return parts.join(" ");
    }
    function amountToWords(amount, curr) {
      const whole = Math.floor(amount);
      const cents = Math.round((amount - whole) * 100);
      const currencyMap = {
        RUB: { main: ["рубль", "рубля", "рублей"], minor: ["копейка", "копейки", "копеек"], fem: 0 },
        KZT: { main: ["тенге", "тенге", "тенге"], minor: ["тиын", "тиына", "тиынов"], fem: 0 },
        USD: { main: ["доллар", "доллара", "долларов"], minor: ["цент", "цента", "центов"], fem: 0 },
        EUR: { main: ["евро", "евро", "евро"], minor: ["цент", "цента", "центов"], fem: 0 },
        UAH: { main: ["гривна", "гривны", "гривен"], minor: ["копейка", "копейки", "копеек"], fem: 0 }
      };
      const cfg = currencyMap[curr] || currencyMap.RUB;
      const mainWords = numberToWordsRu(whole);
      const mainUnit = plural(whole, cfg.main);
      const minorUnit = plural(cents, cfg.minor);
      return `${mainWords} ${mainUnit} ${String(cents).padStart(2, "0")} ${minorUnit}`.trim();
    }
    function formatNumber(value) {
      const sep = decimalSeparator.value;
      const parts = value.toFixed(2).split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      return parts.join(sep);
    }
    function buildResults(amountNum, formatted, vatPercent) {
      const baseWords = amountToWords(amountNum, currency.value);
      const vatValue = amountNum * vatPercent / 100;
      const totalWithVat = amountNum + vatValue;
      const basic = [`${formatted} (${baseWords})`];
      const extended = [
        `${formatted} — сумма прописью: ${baseWords}`,
        vatPercent > 0 ? `НДС ${vatPercent}%: ${formatNumber(vatValue)}` : "Без НДС",
        vatPercent > 0 ? `Итого с НДС: ${formatNumber(totalWithVat)}` : `Итого: ${formatted}`
      ];
      const financial = [
        `Сумма: ${formatted}`,
        vatPercent > 0 ? `НДС ${vatPercent}%: ${formatNumber(vatValue)}` : "НДС не облагается",
        vatPercent > 0 ? `Всего к оплате: ${formatNumber(totalWithVat)}` : `Всего к оплате: ${formatted}`,
        `Прописью: ${baseWords}`
      ];
      return { basic, extended, financial };
    }
    function convert() {
      const num = parseAmount(amountRaw.value);
      if (num === null) {
        history.value = [{ basic: ["Введите корректную сумму"], extended: [], financial: [] }];
        return;
      }
      const vatPercent = getVatRate();
      const formatted = formatNumber(num);
      const resultSets = buildResults(num, formatted, vatPercent);
      history.value = [resultSets, ...history.value].slice(0, 10);
    }
    useHead({
      title: "Сумма прописью в тенге и рублях онлайн | Конвертер чисел в текст",
      meta: [
        {
          name: "description",
          content: "Онлайн конвертер суммы прописью: рубли, тенге, доллары, евро, гривны. НДС, копирование и форматирование."
        },
        { property: "og:title", content: "Сумма прописью в тенге и рублях онлайн" },
        {
          property: "og:description",
          content: "Быстрый перевод чисел в текст для счетов и договоров. Поддержка НДС и нескольких валют."
        },
        { property: "og:type", content: "website" },
        { property: "twitter:card", content: "summary" }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NavBar = resolveComponent("NavBar");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "decisions-page flex flex-col gap-10 pb-16" }, _attrs))} data-v-9e985f56>`);
      _push(ssrRenderComponent(_component_NavBar, null, null, _parent));
      _push(`<section class="page-center gap-4" data-v-9e985f56><div class="px-3 py-1 rounded-full border border-white/10 bg-white/10 text-sm text-white/90 shadow-lg shadow-blue-500/10" data-v-9e985f56> Инструмент · Финансы </div><h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-white" data-v-9e985f56> Сумма прописью в тенге и рублях онлайн </h1><p class="max-w-3xl text-lg text-slate-100" data-v-9e985f56> Бесплатный конвертер чисел в текст. Подходит для договоров, счетов, и любых документов, где нужна сумма прописью. </p><p class="max-w-3xl text-base text-slate-200" data-v-9e985f56> Работает прямо в браузере, без регистрации. Учитывает НДС и форматирует суммы под разные валюты. </p></section><section class="page-center gap-6" data-v-9e985f56><div class="converter-card" data-v-9e985f56><div class="field-block" data-v-9e985f56><label class="field-label" data-v-9e985f56>Сумма</label><input${ssrRenderAttr("value", amountRaw.value)} type="text" class="neuro-input" placeholder="Например: 12345.67" data-v-9e985f56></div><div class="currency-buttons" data-v-9e985f56><!--[-->`);
      ssrRenderList(currencies, (c) => {
        _push(`<button class="${ssrRenderClass(["pill-button", currency.value === c ? "active" : ""])}" data-v-9e985f56>${ssrInterpolate(c)}</button>`);
      });
      _push(`<!--]--></div><div class="options-grid" data-v-9e985f56><div class="field-block" data-v-9e985f56><label class="field-label" data-v-9e985f56>Налог НДС</label><select class="neuro-select" data-v-9e985f56><option value="none" data-v-9e985f56${ssrIncludeBooleanAttr(Array.isArray(vatMode.value) ? ssrLooseContain(vatMode.value, "none") : ssrLooseEqual(vatMode.value, "none")) ? " selected" : ""}>Без НДС</option><option value="10" data-v-9e985f56${ssrIncludeBooleanAttr(Array.isArray(vatMode.value) ? ssrLooseContain(vatMode.value, "10") : ssrLooseEqual(vatMode.value, "10")) ? " selected" : ""}>НДС 10%</option><option value="12" data-v-9e985f56${ssrIncludeBooleanAttr(Array.isArray(vatMode.value) ? ssrLooseContain(vatMode.value, "12") : ssrLooseEqual(vatMode.value, "12")) ? " selected" : ""}>НДС 12%</option><option value="20" data-v-9e985f56${ssrIncludeBooleanAttr(Array.isArray(vatMode.value) ? ssrLooseContain(vatMode.value, "20") : ssrLooseEqual(vatMode.value, "20")) ? " selected" : ""}>НДС 20%</option><option value="custom" data-v-9e985f56${ssrIncludeBooleanAttr(Array.isArray(vatMode.value) ? ssrLooseContain(vatMode.value, "custom") : ssrLooseEqual(vatMode.value, "custom")) ? " selected" : ""}>Своя ставка</option></select></div>`);
      if (vatMode.value === "custom") {
        _push(`<div class="field-block" data-v-9e985f56><label class="field-label" data-v-9e985f56>Своя ставка, %</label><input${ssrRenderAttr("value", vatCustom.value)} type="number" min="0" max="100" class="neuro-input" placeholder="Например: 8" data-v-9e985f56></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([vatMode.value === "custom" ? "" : "md-span", "field-block"])}" data-v-9e985f56><label class="field-label" data-v-9e985f56>Разделитель</label><select class="neuro-select" data-v-9e985f56><option value="." data-v-9e985f56${ssrIncludeBooleanAttr(Array.isArray(decimalSeparator.value) ? ssrLooseContain(decimalSeparator.value, ".") : ssrLooseEqual(decimalSeparator.value, ".")) ? " selected" : ""}>Точка (123.45)</option><option value="," data-v-9e985f56${ssrIncludeBooleanAttr(Array.isArray(decimalSeparator.value) ? ssrLooseContain(decimalSeparator.value, ",") : ssrLooseEqual(decimalSeparator.value, ",")) ? " selected" : ""}>Запятая (123,45)</option></select></div></div><div class="results-card" data-v-9e985f56><div class="tabs" data-v-9e985f56><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass(["pill-button", activeTab.value === tab.id ? "active" : ""])}" data-v-9e985f56>${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (currentResults.value.length) {
        _push(`<div class="results-list" data-v-9e985f56><!--[-->`);
        ssrRenderList(currentResults.value, (line, idx) => {
          _push(`<div class="result-row" data-v-9e985f56><span class="result-text" data-v-9e985f56>${ssrInterpolate(line)}</span><button class="copy-btn" data-v-9e985f56>`);
          if (copiedText.value === line) {
            _push(`<span data-v-9e985f56>✅</span>`);
          } else {
            _push(`<span data-v-9e985f56>📋</span>`);
          }
          _push(`<span data-v-9e985f56>${ssrInterpolate(copiedText.value === line ? "Скопировано" : "Копировать")}</span></button></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="text-slate-300 text-center" data-v-9e985f56>Введите сумму и текст появится</p>`);
      }
      _push(`</div></div></section><section class="max-w-6xl mx-auto w-full flex flex-col gap-4 text-center" data-v-9e985f56><h2 class="examples-title text-2xl font-bold text-white" data-v-9e985f56>Примеры</h2><div class="examples-grid" data-v-9e985f56><!--[-->`);
      ssrRenderList(examples, (example) => {
        _push(`<button class="example-card card bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-blue-400/60 transition" data-v-9e985f56><p class="text-lg font-semibold text-white" data-v-9e985f56>${ssrInterpolate(example.label)}</p><p class="text-sm text-slate-300" data-v-9e985f56>${ssrInterpolate(example.description)}</p></button>`);
      });
      _push(`<!--]--></div></section><section class="max-w-6xl mx-auto w-full flex flex-col gap-4" data-v-9e985f56><h2 class="text-2xl font-bold text-white" data-v-9e985f56>Особенности инструмента</h2><div class="grid grid-cols-1 md:grid-cols-3 gap-4" data-v-9e985f56><article class="card bg-white/5 border border-white/10 rounded-xl p-4" data-v-9e985f56><h3 class="text-lg font-semibold text-white mb-2" data-v-9e985f56>Мгновенное преобразование</h3><p class="text-slate-300 text-sm" data-v-9e985f56>Конвертация суммы прописью в пару кликов, без ограничений и регистрации.</p></article><article class="card bg-white/5 border border-white/10 rounded-xl p-4" data-v-9e985f56><h3 class="text-lg font-semibold text-white mb-2" data-v-9e985f56>Мультивалютность</h3><p class="text-slate-300 text-sm" data-v-9e985f56>Рубли, тенге, доллары, евро и гривны с корректными падежами и копейками.</p></article><article class="card bg-white/5 border border-white/10 rounded-xl p-4" data-v-9e985f56><h3 class="text-lg font-semibold text-white mb-2" data-v-9e985f56>Умное копирование</h3><p class="text-slate-300 text-sm" data-v-9e985f56>Копируй нужную строку одной кнопкой, есть отметка успешного копирования.</p></article></div></section><section class="max-w-6xl mx-auto w-full" data-v-9e985f56><div class="prose prose-invert prose-headings:text-white prose-p:text-slate-200 prose-li:text-slate-200 max-w-none" data-v-9e985f56><h2 data-v-9e985f56>Как работает конвертер суммы прописью</h2><p data-v-9e985f56> Инструмент переводит числа в текст для договоров, счетов, актов и любых платёжных документов. Поддерживаются рубли, тенге, доллары, евро и гривны, есть учёт НДС и выбор разделителя дробной части. </p><h3 data-v-9e985f56>Для чего подходит</h3><p data-v-9e985f56>Формирование платёжек, счетов, актов, договоров, коммерческих предложений, документов для госзакупок.</p><h3 data-v-9e985f56>НДС и форматирование</h3><p data-v-9e985f56>Выбирайте нужную ставку НДС или укажите свою, мы считаем сумму налога и итог с НДС. Дробная часть оформляется через точку или запятую.</p><h3 data-v-9e985f56>Примеры формулировок</h3><ul data-v-9e985f56><li data-v-9e985f56>«Одна тысяча рублей 00 копеек»</li><li data-v-9e985f56>«Одна тысяча тенге 00 тиынов»</li><li data-v-9e985f56>«Пятьсот долларов 25 центов»</li></ul><h3 data-v-9e985f56>Кому полезно</h3><p data-v-9e985f56>Бухгалтерия, юристы, ИП, отделы закупок и продажи — везде, где нужна корректная сумма прописью.</p><h3 data-v-9e985f56>Қазақша нұсқа</h3><p data-v-9e985f56>Құрал теңгені және тиынды сөзбен жазады, НДС мөлшерін есептейді, құжаттарға дайын жолдар береді.</p></div></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/decisions/summa-propisyu.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const summaPropisyu = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9e985f56"]]);
export {
  summaPropisyu as default
};
//# sourceMappingURL=summa-propisyu-DbImk-Nt.js.map
