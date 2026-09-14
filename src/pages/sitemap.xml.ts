export const prerender = false

import { getArticulos } from '../lib/blog.js'
import { getCatalogo } from '../lib/catalogo.js'
import { getCasos } from '../lib/casos-de-estudio.js'
import respaldoAviso from '../data/aviso-de-privacidad.json'
import respaldoTerminos from '../data/terminos-y-condiciones.json'

/**
 * Sitemap del sitio. Se genera en cada petición porque el catálogo, el blog
 * y los casos de estudio viven en el admin: al publicar algo aparece aquí
 * sin redesplegar (ver 1.4).
 *
 * Las páginas fijas (menú, soluciones, legales) ya no son una lista a mano:
 * se leen del propio árbol de páginas del proyecto, así que una página que
 * exista no puede faltar aquí por descuido — que fue el bug original.
 */

const PAGINAS_ESTATICAS = import.meta.glob('/src/pages/**/*.astro', { eager: false })

/** No son contenido para posicionar: página transaccional de un formulario. */
const RUTAS_EXCLUIDAS = new Set(['/gracias'])

function rutaDesdeArchivo(ruta: string) {
    let r = ruta.replace(/^\/src\/pages/, '').replace(/\.astro$/, '')
    if (r.endsWith('/index')) r = r.slice(0, -'/index'.length)
    return r === '' ? '/' : r
}

function rutasEstaticas() {
    return Object.keys(PAGINAS_ESTATICAS)
        .filter((ruta) => !ruta.includes('[')) // rutas dinámicas: se listan aparte, desde su fuente de datos
        .map(rutaDesdeArchivo)
        .filter((ruta) => !RUTAS_EXCLUIDAS.has(ruta))
}

const MESES: Record<string, string> = {
    enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
    julio: '07', agosto: '08', septiembre: '09', setiembre: '09', octubre: '10',
    noviembre: '11', diciembre: '12',
}

/** Parsea el «Última actualización: DD / mes / AAAA» que publican las páginas legales. */
function fechaDeTexto(texto?: string) {
    const m = /(\d{1,2})\s*\/\s*([a-záéíóúñ]+)\s*\/\s*(\d{4})/i.exec(texto ?? '')
    if (!m) return undefined
    const mes = MESES[m[2].toLowerCase()]
    return mes ? `${m[3]}-${mes}-${m[1].padStart(2, '0')}` : undefined
}

const API_URL = import.meta.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'

/** «Última actualización» de una página legal (Aviso de Privacidad, Términos). */
async function fechaDePaginaLegal(key: string, fallback: any) {
    let d = fallback
    try {
        const res = await fetch(`${API_URL}/api/v1/paginas/${key}`, { signal: AbortSignal.timeout(5000) })
        if (res.ok) d = (await res.json()).data
    } catch {
        // API no disponible: se usa el respaldo local
    }

    return fechaDeTexto(d?.contenido?.actualizacion)
}

interface Entrada {
    url: string
    fecha?: string
}

export async function GET({ site, url }: { site?: URL; url: URL }) {
    const base = (site ?? new URL(url.origin)).origin

    const [fechaAviso, fechaTerminos] = await Promise.all([
        fechaDePaginaLegal('aviso-de-privacidad', respaldoAviso),
        fechaDePaginaLegal('terminos-y-condiciones', respaldoTerminos),
    ])

    const FECHA_POR_RUTA: Record<string, string | undefined> = {
        '/aviso-de-privacidad': fechaAviso,
        '/terminos-y-condiciones': fechaTerminos,
    }

    const entradas: Entrada[] = rutasEstaticas().map((ruta) => ({ url: `${base}${ruta}`, fecha: FECHA_POR_RUTA[ruta] }))

    // Catálogo: cada categoría (ruta propia, ver 1.3) y cada ficha. Sin
    // fecha real disponible en los datos del catálogo — se omite (ver 1.4).
    const { data: productos, categorias } = await getCatalogo({ pagina: 1 })

    for (const categoria of categorias) {
        entradas.push({ url: `${base}/partes-y-filtros/${categoria.slug}` })
    }

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
        entradas.push({ url: `${base}/partes-y-filtros/${producto.slug}` })
    }

    // Blog: cada artículo. Las categorías del blog son vista de conveniencia
    // (?categoria=) que canonicaliza al listado — no llevan entrada propia
    // en el sitemap (ver 1.3).
    let paginaBlog = 1
    let articulos = (await getArticulos({ pagina: paginaBlog })).data

    while (articulos.length > 0) {
        for (const articulo of articulos) {
            entradas.push({ url: `${base}/blog/${articulo.slug}`, fecha: articulo.published_at ?? undefined })
        }

        paginaBlog += 1
        const siguiente = await getArticulos({ pagina: paginaBlog })
        articulos = siguiente.meta.pagina === paginaBlog ? siguiente.data : []
    }

    // Casos de estudio: mismo patrón de paginación que catálogo y blog.
    let paginaCasos = 1
    let casos = (await getCasos({ pagina: paginaCasos })).data

    while (casos.length > 0) {
        for (const caso of casos) {
            entradas.push({ url: `${base}/casos-de-estudio/${caso.slug}`, fecha: caso.published_at ?? undefined })
        }

        paginaCasos += 1
        const siguiente = await getCasos({ pagina: paginaCasos })
        casos = siguiente.meta.pagina === paginaCasos ? siguiente.data : []
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entradas
    .map(
        (e) => `    <url>
        <loc>${e.url.replace(/&/g, '&amp;')}</loc>${e.fecha ? `\n        <lastmod>${e.fecha}</lastmod>` : ''}
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
