import respaldo from '../data/catalogo.json'

const API_URL = import.meta.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'

/**
 * Catálogo «Partes y Filtros»: escaparate de componentes, sin precios ni
 * compra en línea. Se administra en el panel y, si la API no responde, el
 * sitio se sirve con la última copia local (igual que el resto del contenido).
 *
 * El respaldo se regenera con `node scripts/respaldo-catalogo.mjs`.
 */

/** Listado con búsqueda y filtros. Devuelve también categorías y marcas. */
export async function getCatalogo({ categoria = '', marca = '', buscar = '', pagina = 1 } = {}) {
  const parametros = new URLSearchParams()
  if (categoria) parametros.set('categoria', categoria)
  if (marca) parametros.set('marca', marca)
  if (buscar) parametros.set('buscar', buscar)
  if (pagina > 1) parametros.set('page', String(pagina))

  try {
    const res = await fetch(`${API_URL}/api/v1/catalogo?${parametros}`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) return await res.json()
  } catch {
    // API no disponible: se filtra sobre el respaldo local
  }

  return filtrarRespaldo({ categoria, marca, buscar, pagina })
}

/** Ficha de un producto y otros de su misma categoría. */
export async function getProducto(slug) {
  try {
    const res = await fetch(`${API_URL}/api/v1/catalogo/${slug}`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) return await res.json()
    if (res.status === 404) return null
  } catch {
    // API no disponible: se busca en el respaldo local
  }

  const producto = respaldo.productos.find((p) => p.slug === slug)
  if (!producto) return null

  return {
    data: producto,
    relacionados: respaldo.productos
      .filter((p) => p.slug !== slug && p.category?.slug === producto.category?.slug)
      .slice(0, 4),
  }
}

const POR_PAGINA = 24

function filtrarRespaldo({ categoria, marca, buscar, pagina }) {
  const texto = buscar.trim().toLowerCase()

  const encontrados = respaldo.productos.filter((p) => {
    if (categoria && p.category?.slug !== categoria) return false
    if (marca && p.brand?.slug !== marca) return false
    if (!texto) return true

    return [p.name, p.sku, p.summary].filter(Boolean).some((campo) => campo.toLowerCase().includes(texto))
  })

  const desde = (pagina - 1) * POR_PAGINA

  return {
    data: encontrados.slice(desde, desde + POR_PAGINA),
    meta: {
      pagina,
      paginas: Math.max(1, Math.ceil(encontrados.length / POR_PAGINA)),
      total: encontrados.length,
    },
    categorias: respaldo.categorias,
    marcas: respaldo.marcas,
  }
}
