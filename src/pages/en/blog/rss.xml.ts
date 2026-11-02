export const prerender = false

import { getArticulos } from '../../../lib/blog.js'

const escapar = (texto = '') =>
    texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')

export async function GET({ site, url }) {
    const base = (site ?? new URL(url.origin)).origin
    const { data: recientes } = await getArticulos({ pagina: 1, porPagina: 20, locale: 'en' })

    const items = recientes
        .map((article) => {
            const date = article.published_at ? new Date(`${article.published_at}T12:00:00`).toUTCString() : ''

            return `        <item>
            <title>${escapar(article.title)}</title>
            <link>${base}/en/blog/${article.slug}</link>
            <guid isPermaLink="true">${base}/en/blog/${article.slug}</guid>
            <description>${escapar(article.excerpt ?? '')}</description>
            ${article.category ? `<category>${escapar(article.category.name)}</category>` : ''}
            <pubDate>${date}</pubDate>
        </item>`
        })
        .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Blog | Anaerobia Surface Finishing</title>
        <link>${base}/en/blog</link>
        <description>Articles and specialized knowledge about paint and surface-finishing systems.</description>
        <language>en-US</language>
        <atom:link href="${base}/en/blog/rss.xml" rel="self" type="application/rss+xml" />
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
