/**
 * Verifica el sitemap de un sitio ya corriendo (dev, preview o producción):
 * que no haya <loc> duplicadas y que cada una devuelva 200. Falla (exit 1)
 * si algo no cuadra — ver 1.4.
 *
 * No corre dentro de `astro build`: la mitad de las rutas del sitio son SSR
 * con datos del backend, así que "qué responde 200" solo existe una vez que
 * el sitio está sirviendo peticiones reales, no en el paso de compilación.
 * Se corre a mano o como paso posterior al deploy, contra la URL que
 * corresponda.
 *
 *   node scripts/verificar-sitemap.mjs [url-del-sitio]
 *   node scripts/verificar-sitemap.mjs http://localhost:4321
 */
const SITIO = process.argv[2] ?? process.env.SITEMAP_CHECK_URL ?? 'https://anaerobia.com'

const xml = await (await fetch(`${SITIO}/sitemap.xml`)).text()
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

const unicas = new Set(locs)
let huboError = false

if (unicas.size !== locs.length) {
    huboError = true
    const vistas = new Set()
    const repetidas = new Set()
    for (const loc of locs) {
        if (vistas.has(loc)) repetidas.add(loc)
        vistas.add(loc)
    }
    console.error(`✗ ${locs.length} <loc> mueven a ${unicas.size} URLs únicas — hay ${locs.length - unicas.size} repetida(s):`)
    for (const loc of repetidas) console.error(`  - ${loc}`)
}

const resultados = await Promise.all(
    [...unicas].map(async (loc) => {
        try {
            const res = await fetch(loc, { method: 'GET', redirect: 'manual' })
            return { loc, status: res.status }
        } catch (e) {
            return { loc, status: 'error', detalle: String(e) }
        }
    }),
)

const fallidas = resultados.filter((r) => r.status !== 200)
if (fallidas.length > 0) {
    huboError = true
    console.error(`✗ ${fallidas.length} de ${unicas.size} URLs del sitemap no devuelven 200:`)
    for (const f of fallidas) console.error(`  - ${f.loc} → ${f.status}${f.detalle ? ` (${f.detalle})` : ''}`)
}

if (huboError) {
    process.exit(1)
}

console.log(`✓ ${unicas.size} <loc> únicas, todas devuelven 200 (${SITIO}).`)
