export const prerender = false

import { getArticulos } from '../../lib/blog.js'

/**
 * RSS del blog. Se genera en cada petición: al publicar un artículo aparece
 * sin redesplegar el sitio.
 */

const escapar = (texto = '') =>
    texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

export async function GET({ site, url }) {
    const base = (site ?? new URL(url.origin)).origin

    // Los 20 más recientes: un lector no necesita el histórico completo.
    const { data: recientes } = await getArticulos({ pagina: 1, porPagina: 20 })

    const items = recientes
        .map((a) => {
            const fecha = a.published_at ? new Date(`${a.published_at}T12:00:00`).toUTCString() : ''

            return `        <item>
            <title>${escapar(a.title)}</title>
            <link>${base}/blog/${a.slug}</link>
            <guid isPermaLink="true">${base}/blog/${a.slug}</guid>
            <description>${escapar(a.excerpt ?? '')}</description>
            ${a.category ? `<category>${escapar(a.category.name)}</category>` : ''}
            <pubDate>${fecha}</pubDate>
        </item>`
        })
        .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Blog | Anaerobia Surface Finishing</title>
        <link>${base}/blog</link>
        <description>Artículos y conocimiento especializado sobre sistemas de pintura y acabado superficial.</description>
        <language>es-MX</language>
        <atom:link href="${base}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
    </channel>
</rss>
`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
        },
    })
}
