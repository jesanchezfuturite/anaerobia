import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Necesario para las URLs absolutas del sitemap y de las etiquetas sociales.
  site: 'https://anaerobia.com',
  output: 'static',
  // Una sola forma de URL: el build no emite la variante con barra final.
  // El adaptador de Vercel genera solo con esto la redirección 308 de esa
  // variante (verificado en .vercel/output/config.json); no hace falta
  // ninguna regla manual en vercel.json.
  trailingSlash: 'never',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});