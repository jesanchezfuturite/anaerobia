import respaldo from '../data/blog.json'

const API_URL = import.meta.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'

/**
 * Blog del sitio. Se administra en el panel y, si la API no responde, se
 * sirve la última copia local, igual que el resto del contenido.
 *
 * El respaldo se regenera con `node scripts/respaldo-blog.mjs`.
 */

const POR_PAGINA = 9

/** Listado con filtro por categoría y búsqueda. */
export async function getArticulos({ categoria = '', buscar = '', pagina = 1, porPagina = POR_PAGINA } = {}) {
  const parametros = new URLSearchParams()
  if (porPagina !== POR_PAGINA) parametros.set('por_pagina', String(porPagina))
  if (categoria) parametros.set('categoria', categoria)
  if (buscar) parametros.set('buscar', buscar)
  if (pagina > 1) parametros.set('page', String(pagina))

  try {
    const res = await fetch(`${API_URL}/api/v1/blog?${parametros}`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) return await res.json()
  } catch {
    // API no disponible: se filtra sobre el respaldo local
  }

  return filtrarRespaldo({ categoria, buscar, pagina, porPagina })
}

/** Artículo completo y sus relacionados. */
export async function getArticulo(slug) {
  try {
    const res = await fetch(`${API_URL}/api/v1/blog/${slug}`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) return await res.json()
    if (res.status === 404) return null
  } catch {
    // API no disponible: se busca en el respaldo local
  }

  const articulo = respaldo.articulos.find((a) => a.slug === slug)
  if (!articulo) return null

  return {
    data: articulo,
    relacionados: respaldo.articulos
      .filter((a) => a.slug !== slug)
      .sort((a, b) => (a.category?.slug === articulo.category?.slug ? -1 : 1))
      .slice(0, 3),
  }
}

function filtrarRespaldo({ categoria, buscar, pagina, porPagina = POR_PAGINA }) {
  const texto = buscar.trim().toLowerCase()

  const encontrados = respaldo.articulos.filter((a) => {
    if (categoria && a.category?.slug !== categoria) return false
    if (!texto) return true

    return [a.title, a.excerpt].filter(Boolean).some((campo) => campo.toLowerCase().includes(texto))
  })

  const desde = (pagina - 1) * porPagina

  return {
    data: encontrados.slice(desde, desde + porPagina),
    meta: {
      pagina,
      paginas: Math.max(1, Math.ceil(encontrados.length / porPagina)),
      total: encontrados.length,
    },
    destacado: categoria || buscar || pagina > 1 ? null : (respaldo.articulos.find((a) => a.featured) ?? null),
    categorias: respaldo.categorias,
  }
}
