import respaldo from '../data/casos-de-estudio.json'

const API_URL = import.meta.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'

/**
 * Casos de estudio del sitio. Se administran en el panel y, si la API no
 * responde, se sirve la última copia local, igual que el resto del contenido.
 *
 * Sin página de listado propia por ahora: solo fichas sueltas y una lista de
 * los últimos publicados (para /proyectos). El respaldo se regenera con
 * `node scripts/respaldo-casos-de-estudio.mjs`.
 */

/** Los últimos casos de estudio publicados, más recientes primero. */
export async function getUltimosCasos(cantidad = 3) {
  try {
    const res = await fetch(`${API_URL}/api/v1/casos-de-estudio?por_pagina=${cantidad}`, {
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) return (await res.json()).data
  } catch {
    // API no disponible: se sirve el respaldo local
  }

  return [...respaldo.casos]
    .sort((a, b) => (b.published_at ?? '').localeCompare(a.published_at ?? ''))
    .slice(0, cantidad)
}

const POR_PAGINA = 24

/** Listado completo, paginado igual que el catálogo y el blog (para el sitemap). */
export async function getCasos({ pagina = 1 } = {}) {
  const parametros = new URLSearchParams({ por_pagina: String(POR_PAGINA) })
  if (pagina > 1) parametros.set('page', String(pagina))

  try {
    const res = await fetch(`${API_URL}/api/v1/casos-de-estudio?${parametros}`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) return await res.json()
  } catch {
    // API no disponible: se filtra sobre el respaldo local
  }

  const desde = (pagina - 1) * POR_PAGINA
  return {
    data: respaldo.casos.slice(desde, desde + POR_PAGINA),
    meta: {
      pagina,
      paginas: Math.max(1, Math.ceil(respaldo.casos.length / POR_PAGINA)),
      total: respaldo.casos.length,
    },
  }
}

/** Ficha completa del caso de estudio y sus relacionados. */
export async function getCaso(slug) {
  try {
    const res = await fetch(`${API_URL}/api/v1/casos-de-estudio/${slug}`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) return await res.json()
    if (res.status === 404) return null
  } catch {
    // API no disponible: se busca en el respaldo local
  }

  const caso = respaldo.casos.find((c) => c.slug === slug)
  if (!caso) return null

  return {
    data: caso,
    relacionados: respaldo.casos
      .filter((c) => c.slug !== slug)
      .sort((a, b) => (a.category?.slug === caso.category?.slug ? -1 : 1))
      .slice(0, 3),
  }
}
