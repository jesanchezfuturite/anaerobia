export const LOCALES = ['es', 'en']
export const DEFAULT_LOCALE = 'es'

/**
 * Dada la ruta actual y el idioma activo, devuelve la misma ruta en el otro
 * idioma. El español no lleva prefijo (/tienda); el inglés vive bajo /en
 * (/en/tienda), siguiendo el `routing.prefixDefaultLocale: false` de Astro.
 */
export function rutaEnOtroIdioma(pathname, localeActual) {
  const base = localeActual === 'en' ? pathname.replace(/^\/en(?=\/|$)/, '') || '/' : pathname

  if (localeActual === 'en') return base
  return base === '/' ? '/en' : `/en${base}`
}
