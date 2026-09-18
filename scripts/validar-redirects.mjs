// Uso: node scripts/validar-redirects.mjs  (desde la raíz del repo, con node_modules instalado)
//
// Simula el enrutado de Vercel con el vercel.json propuesto:
//  1. compila el archivo con @vercel/routing-utils (lo mismo que hace Vercel),
//  2. pasa cada URL vieja por las reglas en orden y reporta destino y saltos,
//  3. comprueba que cada destino existe en el inventario real de rutas,
//  4. comprueba que ninguna ruta real es capturada por una regla.
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(process.cwd() + '/package.json')
const { getTransformedRoutes } = require('@vercel/routing-utils')

const cfg = JSON.parse(readFileSync('vercel.json', 'utf8'))
const { routes, error } = getTransformedRoutes(cfg)
if (error) { console.error('ERROR compilando vercel.json:', error.message); process.exit(1) }
const reglas = routes.filter((r) => r.src && r.headers?.Location).map((r) => ({ ...r, re: new RegExp(r.src) }))
console.log(`Reglas compiladas: ${reglas.length}`)

// Inventario real (Tarea 1) construido desde los datos del repo.
const catalogo = JSON.parse(readFileSync('src/data/catalogo.json', 'utf8'))
const blog = JSON.parse(readFileSync('src/data/blog.json', 'utf8'))
const casos = JSON.parse(readFileSync('src/data/casos-de-estudio.json', 'utf8'))
const SOLUCIONES = ['aplicacion-recubrimientos','cabinas-pintura','conveyors','filtros','granallado','hornos-secado-curado','pintura-en-polvo','pintura-liquida','servicios-industriales','sistemas-de-pretratamiento']
const rutasReales = new Set([
  '/', '/nosotros', '/proyectos', '/contacto', '/gracias', '/blog', '/blog/rss.xml', '/sitemap.xml',
  '/partes-y-filtros', '/aviso-de-privacidad', '/terminos-y-condiciones',
  ...SOLUCIONES.map((s) => `/soluciones/${s}`),
  ...catalogo.productos.map((p) => `/partes-y-filtros/${p.slug}`),
  // Categorías: ruta propia desde 1.3, ya no ?categoria= sobre el listado.
  ...catalogo.categorias.map((c) => `/partes-y-filtros/${c.slug}`),
  ...blog.articulos.map((a) => `/blog/${a.slug}`),
  ...casos.casos.map((c) => `/casos-de-estudio/${c.slug}`),
])
const categorias = new Set(catalogo.categorias.map((c) => c.slug))
const marcas = new Set(catalogo.marcas.map((m) => m.slug))

function existe(destino) {
  const [ruta, query] = destino.split('?')
  if (!rutasReales.has(ruta)) return false
  if (!query) return true
  const p = new URLSearchParams(query)
  if (ruta === '/partes-y-filtros') {
    if (p.has('categoria') && !categorias.has(p.get('categoria'))) return false
    if (p.has('marca') && !marcas.has(p.get('marca'))) return false
  }
  return true
}

function resolver(path) {
  const saltos = []
  let actual = path
  for (let i = 0; i < 6; i++) {
    const regla = reglas.find((r) => r.re.test(actual))
    if (!regla) break
    const m = actual.match(regla.re)
    const destino = regla.headers.Location.replace(/\$(\d)/g, (_, i) => m[i] ?? '')
    saltos.push({ status: regla.status, destino })
    if (destino.split('?')[0] === actual) { saltos.push({ status: 'LOOP' }); break }
    actual = destino.split('?')[0]
    if (destino.includes('?')) break
  }
  return saltos
}

const legacy = readFileSync(new URL('./redirects-urls-legacy.txt', import.meta.url), 'utf8').split('\n').map((l) => l.trim()).filter(Boolean)
let fallos = 0
console.log('\n=== URLs viejas → destino ===')
for (const linea of legacy) {
  // «VIVA /ruta»: es una ruta real, lo correcto es que NINGUNA regla la toque.
  const viva = linea.startsWith('VIVA ')
  const url = viva ? linea.slice(5) : linea
  const saltos = resolver(url)
  const final = saltos.at(-1)?.destino
  const ok = viva ? saltos.length === 0 && rutasReales.has(url) : saltos.length > 0 && final && existe(final)
  if (!ok) fallos++
  console.log(`${ok ? 'OK ' : 'XX '} ${saltos.length}h ${url}  →  ${saltos.map((s) => `[${s.status}] ${s.destino ?? ''}`).join(' → ') || (viva ? 'sin regla, la sirve Astro (correcto)' : 'SIN REGLA (404)')}`)
}

console.log('\n=== Colisiones: rutas reales capturadas por una regla ===')
let colisiones = 0
for (const ruta of rutasReales) {
  const regla = reglas.find((r) => r.re.test(ruta))
  if (regla) { colisiones++; console.log(`COLISIÓN ${ruta} ← ${regla.src}`) }
}
if (!colisiones) console.log('ninguna')

console.log(`\nResultado: ${legacy.length} URLs, ${fallos} fallos, ${colisiones} colisiones`)
process.exit(fallos || colisiones ? 1 : 0)
