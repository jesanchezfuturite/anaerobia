/**
 * Recorre todas las páginas del sitemap de un sitio ya corriendo y busca
 * <img src> o <a href> apuntando a 127.0.0.1, localhost o file:// — restos
 * de contenido pegado desde el entorno local del admin (ver 1.5). Falla
 * (exit 1) si encuentra alguno.
 *
 * Como la mayoría del contenido (blog, catálogo, casos de estudio) vive en
 * el backend y se sirve por SSR, esto solo se puede comprobar contra un
 * sitio real corriendo — igual que verificar-sitemap.mjs, no dentro de
 * `astro build`.
 *
 *   node scripts/verificar-medios.mjs [url-del-sitio]
 *   node scripts/verificar-medios.mjs http://localhost:4321
 */
const SITIO = process.argv[2] ?? process.env.SITEMAP_CHECK_URL ?? 'https://anaerobia.com'

const PATRON_MALA_RUTA = /(src|href)="([^"]*(?:127\.0\.0\.1|localhost|file:\/\/)[^"]*)"/gi

const xml = await (await fetch(`${SITIO}/sitemap.xml`)).text()
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

const hallazgos = []

await Promise.all(
    locs.map(async (loc) => {
        let html
        try {
            html = await (await fetch(loc)).text()
        } catch {
            return // lo reporta ya verificar-sitemap.mjs; este chequeo no duplica esa comprobación
        }

        for (const m of html.matchAll(PATRON_MALA_RUTA)) {
            hallazgos.push({ pagina: loc, atributo: m[1], valor: m[2] })
        }
    }),
)

if (hallazgos.length > 0) {
    console.error(`✗ ${hallazgos.length} referencia(s) a 127.0.0.1/localhost/file:// encontradas:`)
    for (const h of hallazgos) console.error(`  - ${h.pagina} → ${h.atributo}="${h.valor}"`)
    process.exit(1)
}

console.log(`✓ ${locs.length} páginas revisadas, ninguna referencia a 127.0.0.1, localhost o file:// (${SITIO}).`)
