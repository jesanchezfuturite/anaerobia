import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Necesario para las URLs absolutas del sitemap y de las etiquetas sociales.
  site: 'https://anaerobia.com',
  output: 'static',
  adapter: vercel(),
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    // El español sigue sin prefijo (/tienda) para no romper URLs ya posicionadas;
    // el inglés vive bajo /en (/en/tienda).
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});