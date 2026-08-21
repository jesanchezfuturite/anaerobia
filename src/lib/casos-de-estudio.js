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
