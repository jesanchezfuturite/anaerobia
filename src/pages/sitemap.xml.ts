export const prerender = false

import { getArticulos } from '../lib/blog.js'
import { getUltimosCasos } from '../lib/casos-de-estudio.js'
import { getCatalogo } from '../lib/catalogo.js'

/**
 * Sitemap del sitio. Se genera en cada petición porque el catálogo y el blog
 * viven en el admin: al publicar un producto aparece aquí sin redesplegar.
 *
 * Solo entran URLs con canónica propia. Las vistas filtradas del catálogo y
 * del blog (?categoria=) declaran como canónica el listado sin filtro, así que
 * listarlas aquí contradecía a la canónica y no aportaba nada.
 */

/** Páginas fijas, con la prioridad que les corresponde. */
const PAGINAS = [
    { ruta: '/', prioridad: '1.0', frecuencia: 'weekly' },
    { ruta: '/nosotros', prioridad: '0.8', frecuencia: 'monthly' },
    { ruta: '/proyectos', prioridad: '0.8', frecuencia: 'monthly' },
    { ruta: '/partes-y-filtros', prioridad: '0.9', frecuencia: 'weekly' },
    { ruta: '/blog', prioridad: '0.7', frecuencia: 'weekly' },
    { ruta: '/contacto', prioridad: '0.6', frecuencia: 'yearly' },
    { ruta: '/aviso-de-privacidad', prioridad: '0.2', frecuencia: 'yearly' },
    { ruta: '/terminos-y-condiciones', prioridad: '0.2', frecuencia: 'yearly' },
]

/** Una por archivo en src/pages/soluciones/. */
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

/**
 * Tope de páginas a recorrer en un listado paginado. Protege a la función
 * de un bucle sin fin si la API devolviera algo inesperado: con 24 productos
 * o 9 artículos por página son cientos de entradas, muy por encima del
 * catálogo y del blog actuales.
 */
const MAX_PAGINAS = 50

type Listado = { data: any[]; meta: { paginas?: number } }

/** Recorre todas las páginas de un listado paginado y devuelve sus elementos. */
async function recorrer(pedir: (pagina: number) => Promise<Listado>) {
    const primera = await pedir(1)
    const elementos = [...primera.data]
    const ultima = Math.min(Number(primera.meta?.paginas ?? 1), MAX_PAGINAS)

    for (let pagina = 2; pagina <= ultima; pagina++) {
        const siguiente = await pedir(pagina)
        if (siguiente.data.length === 0) break
        elementos.push(...siguiente.data)
    }

    return elementos
}

export async function GET({ site, url }) {
    const base = (site ?? new URL(url.origin)).origin
    const hoy = new Date().toISOString().split('T')[0]

    const entradas = [
        ...PAGINAS.map((p) => ({ url: `${base}${p.ruta}`, prioridad: p.prioridad, frecuencia: p.frecuencia })),
        ...SOLUCIONES.map((slug) => ({ url: `${base}/soluciones/${slug}`, prioridad: '0.8', frecuencia: 'monthly' })),
    ]

    // Catálogo: cada categoría (ruta propia desde 1.3, ya no ?categoria=
    // sobre el listado) y la ficha de cada producto.
    const primeraPagina = await getCatalogo({ pagina: 1 })

    for (const categoria of primeraPagina.categorias ?? []) {
        entradas.push({
            url: `${base}/partes-y-filtros/${categoria.slug}`,
            prioridad: '0.7',
            frecuencia: 'weekly',
        })
    }

    const productos = await recorrer((pagina) => getCatalogo({ pagina }))

    for (const producto of productos) {
        entradas.push({
            url: `${base}/partes-y-filtros/${producto.slug}`,
            prioridad: '0.6',
            frecuencia: 'monthly',
        })
    }

    // Blog: cada artículo publicado.
    const articulos = await recorrer((pagina) => getArticulos({ pagina }))

    for (const articulo of articulos) {
        entradas.push({
            url: `${base}/blog/${articulo.slug}`,
            prioridad: '0.7',
            frecuencia: 'monthly',
            fecha: articulo.published_at,
        })
    }

    // Casos de estudio: no hay listado propio, solo fichas enlazadas desde /proyectos.
    const casos = await getUltimosCasos(MAX_PAGINAS)

    for (const caso of casos) {
        entradas.push({
            url: `${base}/casos-de-estudio/${caso.slug}`,
            prioridad: '0.7',
            frecuencia: 'monthly',
            fecha: caso.published_at,
        })
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
