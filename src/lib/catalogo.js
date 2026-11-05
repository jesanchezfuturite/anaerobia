import respaldo from '../data/catalogo.json'
import traducciones from '../data/catalogo.en.json'

const API_URL = import.meta.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'

/**
 * Catálogo «Partes y Filtros»: escaparate de componentes, sin precios ni
 * compra en línea. Se administra en el panel y, si la API no responde, el
 * sitio se sirve con la última copia local (igual que el resto del contenido).
 *
 * El respaldo se regenera con `node scripts/respaldo-catalogo.mjs`.
 */

/**
 * Categorías del catálogo, sin llamada a red: sirve solo para decidir si un
 * segmento de /partes-y-filtros/ es una categoría (ruta propia) o el slug de
 * un producto, antes de pedir los datos reales de esa página.
 */
export function getCategoriasLocales() {
  return respaldo.categorias
}

function respaldoEnIngles() {
  return {
    ...respaldo,
    categorias: respaldo.categorias.map((categoria) => ({ ...categoria, ...traducciones.categorias[categoria.slug] })),
    productos: respaldo.productos.map((producto) => {
      const traduccion = traducciones.productos[producto.slug] ?? {}
      const resumen = traduccion.summary?.split('\n')[0]

      return {
        ...producto,
        ...traduccion,
        seo: {
          ...producto.seo,
          description: [traduccion.name, resumen].filter(Boolean).join('. '),
        },
      }
    }),
  }
}

/** Listado con búsqueda y filtros. Devuelve también categorías y marcas. */
export async function getCatalogo({ categoria = '', marca = '', buscar = '', pagina = 1, locale = 'es' } = {}) {
  const parametros = new URLSearchParams()
  if (categoria) parametros.set('categoria', categoria)
  if (marca) parametros.set('marca', marca)
  if (buscar) parametros.set('buscar', buscar)
  if (pagina > 1) parametros.set('page', String(pagina))
  parametros.set('locale', locale)

  try {
    const res = await fetch(`${API_URL}/api/v1/catalogo?${parametros}`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) return await res.json()
  } catch {
    // API no disponible: se filtra sobre el respaldo local (siempre en español)
  }

  return filtrarRespaldo({ categoria, marca, buscar, pagina, locale })
}

/** Ficha de un producto y otros de su misma categoría. */
export async function getProducto(slug, locale = 'es') {
  try {
    const res = await fetch(`${API_URL}/api/v1/catalogo/${slug}?locale=${locale}`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) return await res.json()
    if (res.status === 404) return null
  } catch {
    // API no disponible: se busca en el respaldo local
  }

  // Igual que la API: también responde al slug del catálogo anterior.
  const copia = locale === 'en' ? respaldoEnIngles() : respaldo
  const encontrado = copia.productos.find((p) => p.slug === slug || p.legacy_slug === slug)
  if (!encontrado) return null

  const producto = {
    ...encontrado,
    english_published: Boolean(traducciones.productos[encontrado.slug]),
  }

  return {
    data: producto,
    relacionados: copia.productos
      .filter((p) => p.slug !== slug && p.category?.slug === producto.category?.slug)
      .slice(0, 4),
  }
}

const POR_PAGINA = 24

function filtrarRespaldo({ categoria, marca, buscar, pagina, locale }) {
  const copia = locale === 'en' ? respaldoEnIngles() : respaldo
  const texto = buscar.trim().toLowerCase()

  const encontrados = copia.productos.filter((p) => {
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
    categorias: copia.categorias,
    marcas: copia.marcas,
  }
}
