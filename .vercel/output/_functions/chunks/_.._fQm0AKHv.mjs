import { c as createComponent } from './astro-component_DPDTfgMB.mjs';
import 'piccolore';
import { l as renderComponent, r as renderTemplate } from './entrypoint_DkZkoPJd.mjs';
import 'react';
import { Keystatic } from '@keystatic/core/ui';
import { jsx } from 'react/jsx-runtime';
import { k as keystaticConfig } from './keystatic.config_BXR84k-C.mjs';

const appSlug = {
  envName: "PUBLIC_KEYSTATIC_GITHUB_APP_SLUG",
  value: undefined                                                
};
function makePage(config) {
  return function Keystatic$1() {
    return /* @__PURE__ */ jsx(Keystatic, {
      config,
      appSlug
    });
  };
}

const prerender = false;
const $$ = createComponent(($$result, $$props, $$slots) => {
  const Keystatic = makePage(keystaticConfig);
  return renderTemplate`${renderComponent($$result, "Keystatic", Keystatic, {})}`;
}, "/Users/user/Documents/anaerobia-web/src/pages/keystatic/[...params].astro", void 0);

const $$file = "/Users/user/Documents/anaerobia-web/src/pages/keystatic/[...params].astro";
const $$url = "/keystatic/[...params]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
