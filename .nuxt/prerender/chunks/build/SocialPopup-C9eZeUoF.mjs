import { mergeProps, useSSRContext } from 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'file://C:/Users/%D0%90%D1%80%D1%81%D0%B5%D0%BD%D1%82%D0%B8%D0%B9/Desktop/%D0%B2%D0%BE%D0%BB%D0%B8%D0%B9%20%D1%81%D0%B0%D0%B9%D1%82%202/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {
  __name: "SocialPopup",
  __ssrInlineRender: true,
  props: {
    visible: { type: Boolean, default: false },
    payload: {
      type: Object,
      default: () => ({
        title: "",
        text: "",
        cta: "",
        link: "",
        emoji: ""
      })
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.visible) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "sp-overlay" }, _attrs))} data-v-93c76394><div class="sp-card" data-v-93c76394><button class="sp-close" data-v-93c76394>\xD7</button><div class="sp-badge" data-v-93c76394>${ssrInterpolate(__props.payload.emoji)}</div><h3 data-v-93c76394>${ssrInterpolate(__props.payload.title)}</h3><p data-v-93c76394>${ssrInterpolate(__props.payload.text)}</p><div class="sp-actions" data-v-93c76394><a${ssrRenderAttr("href", __props.payload.link)} target="_blank" rel="noopener" class="sp-btn" data-v-93c76394>${ssrInterpolate(__props.payload.cta)}</a></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/SocialPopup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const SocialPopup = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-93c76394"]]);

export { SocialPopup as S };
//# sourceMappingURL=SocialPopup-C9eZeUoF.mjs.map
