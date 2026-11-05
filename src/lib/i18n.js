export const LOCALES = ['es', 'en']
export const DEFAULT_LOCALE = 'es'

/**
 * Dada la ruta actual y el idioma activo, devuelve la misma ruta en el otro
 * idioma. El español no lleva prefijo (/tienda); el inglés vive bajo /en
 * (/en/tienda), siguiendo el `routing.prefixDefaultLocale: false` de Astro.
 */
export function rutaEnOtroIdioma(url, localeActual) {
  const [, pathname = '/', suffix = ''] = url.match(/^([^?#]*)(.*)$/) ?? []
  const base = localeActual === 'en' ? pathname.replace(/^\/en(?=\/|$)/, '') || '/' : pathname

  if (localeActual === 'en') return `${base}${suffix}`
  return `${base === '/' ? '/en' : `/en${base}`}${suffix}`
}

/**
 * Antepone /en a una ruta en español cuando el idioma pedido es inglés. Para
 * armar enlaces internos (nav, breadcrumbs, botones) dentro de componentes
 * que ya saben en qué idioma están, no para cambiar de idioma (eso es
 * rutaEnOtroIdioma).
 */
export function withLocale(path, idioma) {
  if (idioma !== 'en') return path
  return path === '/' ? '/en' : `/en${path}`
}
