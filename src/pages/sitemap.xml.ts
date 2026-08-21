export const prerender = false

import { getArticulos } from '../lib/blog.js'
import { getCatalogo } from '../lib/catalogo.js'
import navegacion from '../data/general.json'

/**
 * Sitemap del sitio. Se genera en cada petición porque el catálogo y el menú
 * viven en el admin: al publicar un producto aparece aquí sin redesplegar.
 */

/** Páginas fijas, con la prioridad que les corresponde. */
const PAGINAS = [
    { ruta: '/', prioridad: '1.0', frecuencia: 'weekly' },
    { ruta: '/nosotros', prioridad: '0.8', frecuencia: 'monthly' },
    { ruta: '/proyectos', prioridad: '0.8', frecuencia: 'monthly' },
    { ruta: '/partes-y-filtros', prioridad: '0.9', frecuencia: 'weekly' },
    { ruta: '/blog', prioridad: '0.7', frecuencia: 'weekly' },
    { ruta: '/contacto', prioridad: '0.6', frecuencia: 'yearly' },
]

const SOLUCIONES = [
    'conveyors',
    'sistemas-de-pretratamiento',
    'granallado',
    'hornos-secado-curado',
    'cabinas-pintura',
    'aplicacion-recubrimientos',
    'pintura-en-polvo',
    'pintura-liquida',
    'filtros',
    'servicios-industriales',
]

export async function GET({ site, url }) {
    const base = (site ?? new URL(url.origin)).origin
    const hoy = new Date().toISOString().split('T')[0]

    const entradas = [
        ...PAGINAS.map((p) => ({ url: `${base}${p.ruta}`, prioridad: p.prioridad, frecuencia: p.frecuencia })),
        ...SOLUCIONES.map((slug) => ({ url: `${base}/soluciones/${slug}`, prioridad: '0.8', frecuencia: 'monthly' })),
    ]

    // Catálogo: la portada de cada categoría y la ficha de cada producto.
    const { data: productos, categorias } = await getCatalogo({ pagina: 1 })

    for (const categoria of categorias) {
        entradas.push({
            url: `${base}/partes-y-filtros?categoria=${categoria.slug}`,
            prioridad: '0.7',
            frecuencia: 'weekly',
        })
    }

    // El listado viene paginado: se recorren todas las páginas.
    let pagina = 1
    let porRecorrer = productos
    const fichas = []

    while (porRecorrer.length > 0) {
        fichas.push(...porRecorrer)
        pagina += 1
        const siguiente = await getCatalogo({ pagina })
        porRecorrer = siguiente.meta.pagina === pagina ? siguiente.data : []
    }

    for (const producto of fichas) {
        entradas.push({
            url: `${base}/partes-y-filtros/${producto.slug}`,
            prioridad: '0.6',
            frecuencia: 'monthly',
        })
    }

    // Blog: la portada de cada categoría y cada artículo publicado.
    const blog = await getArticulos({ pagina: 1 })

    for (const categoria of blog.categorias) {
        entradas.push({
            url: `${base}/blog?categoria=${categoria.slug}`,
            prioridad: '0.6',
            frecuencia: 'weekly',
        })
    }

    let paginaBlog = 1
    let articulos = blog.data

    while (articulos.length > 0) {
        for (const articulo of articulos) {
            entradas.push({
                url: `${base}/blog/${articulo.slug}`,
                prioridad: '0.7',
                frecuencia: 'monthly',
                fecha: articulo.published_at,
            })
        }

        paginaBlog += 1
        const siguiente = await getArticulos({ pagina: paginaBlog })
        articulos = siguiente.meta.pagina === paginaBlog ? siguiente.data : []
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entradas
    .map(
        (e) => `    <url>
        <loc>${e.url.replace(/&/g, '&amp;')}</loc>
        <lastmod>${e.fecha ?? hoy}</lastmod>
        <changefreq>${e.frecuencia}</changefreq>
        <priority>${e.prioridad}</priority>
    </url>`,
    )
    .join('\n')}
</urlset>
`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    })
}
