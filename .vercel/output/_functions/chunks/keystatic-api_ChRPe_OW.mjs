import { m as makeHandler } from './keystatic-astro-api_CNH0B6Uq.mjs';
import { k as keystaticConfig } from './keystatic.config_BXR84k-C.mjs';

const all = makeHandler({ config: keystaticConfig });
const ALL = all;

const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	ALL,
	all,
	prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
