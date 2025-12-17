import { hasInjectionContext, inject } from 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/vue/index.mjs';
import { t as tryUseNuxtApp } from './server.mjs';
import { u as useHead$1, h as headSymbol } from '../_/renderer.mjs';

function injectHead(nuxtApp) {
  var _a;
  const nuxt = nuxtApp || tryUseNuxtApp();
  return ((_a = nuxt == null ? void 0 : nuxt.ssrContext) == null ? void 0 : _a.head) || (nuxt == null ? void 0 : nuxt.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  }));
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}

export { useHead as u };
//# sourceMappingURL=v3-D81umCog.mjs.map
