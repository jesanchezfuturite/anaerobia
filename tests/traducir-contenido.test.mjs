import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync, readFileSync } from 'node:fs'
import { readdirSync } from 'node:fs'

import { traducirContenido } from '../src/lib/traducir-contenido.js'
import { rutaEnOtroIdioma } from '../src/lib/i18n.js'
import general from '../src/data/general.json' with { type: 'json' }
import generalEn from '../src/data/general.en.json' with { type: 'json' }
import homepage from '../src/data/homepage.json' with { type: 'json' }
import homepageEn from '../src/data/homepage.en.json' with { type: 'json' }

test('traduce textos exactos sin cambiar la estructura ni otros valores', () => {
  const contenido = {
    titulo: 'Cabinas de pintura',
    bloques: [{ texto: 'Captura de overspray', imagen: '/cabina.webp' }],
    activo: true,
  }

  assert.deepEqual(
    traducirContenido(contenido, {
      'Cabinas de pintura': 'Paint booths',
      'Captura de overspray': 'Overspray capture',
    }),
    {
      titulo: 'Paint booths',
      bloques: [{ texto: 'Overspray capture', imagen: '/cabina.webp' }],
      activo: true,
    },
  )
})

test('el selector de idioma conserva filtros y datos de cotizacion', () => {
  assert.equal(
    rutaEnOtroIdioma('/contacto?producto=Filtro&parte=123', 'es'),
    '/en/contacto?producto=Filtro&parte=123',
  )
  assert.equal(
    rutaEnOtroIdioma('/en/partes-y-filtros?marca=gfs', 'en'),
    '/partes-y-filtros?marca=gfs',
  )
})

test('el respaldo general también queda en inglés', () => {
  const traducido = traducirContenido(general, generalEn)

  assert.equal(traducido.navigation.links[0].label, 'About Us')
  assert.equal(traducido.normas.badge, 'Legal and Safety Compliance')
  assert.equal(traducido.footer.copyright, 'Anaerobia. All rights reserved.')
})

test('el respaldo del home traduce su contenido industrial', () => {
  const traducido = traducirContenido(homepage, homepageEn)

  assert.equal(traducido.hero.title, 'Smart Engineering for Paint and Finishing Systems')
  assert.equal(traducido.soluciones.cards[0].title, 'Powder Coating Systems')
  assert.equal(traducido.mapa.cards[2].title, 'Dry-Off Oven')
  assert.equal(traducido.contacto.heading, 'Ready to improve your surface-finishing process?')
})

test('todas las paginas bilingues criticas tienen respaldo ingles', () => {
  const paginas = [
    ['nosotros', 'About Us'],
    ['proyectos', 'Projects'],
    ['aviso-de-privacidad', 'Privacy Notice'],
    ['terminos-y-condiciones', 'Terms and Conditions'],
  ]

  for (const [slug, titulo] of paginas) {
    const ruta = new URL(`../src/data/${slug}.en.json`, import.meta.url)
    assert.equal(existsSync(ruta), true, `${slug} no tiene respaldo ingles`)
    const contenido = JSON.parse(readFileSync(ruta, 'utf8'))
    assert.match(contenido.seo.title, new RegExp(titulo, 'i'))
    assert.doesNotMatch(contenido.hero.title, /Nosotros|Proyectos|Aviso|Términos/i)
  }
})

test('los metadatos y controles compartidos se localizan por idioma', () => {
  const layout = readFileSync(new URL('../src/layouts/Layout.astro', import.meta.url), 'utf8')
  const navbar = readFileSync(new URL('../src/components/Navbar.astro', import.meta.url), 'utf8')
  const home = readFileSync(new URL('../src/components/pages/Home.astro', import.meta.url), 'utf8')
  const producto = readFileSync(new URL('../src/pages/partes-y-filtros/[slug].astro', import.meta.url), 'utf8')

  assert.match(layout, /idioma === ['"]en['"].*Surface finishing/s)
  assert.match(navbar, /aria-label=\{[^}]*openMenu/)
  assert.match(home, /description=\{T\.seoDescription\}/)
  assert.match(home, /T\.certificacion\(cert\.name\)/)
  assert.match(producto, /`\$\{producto\.name\} \| \$\{T\.catalogo\} \| Anaerobia`/)
})

test('el blog publica un RSS propio en ingles', () => {
  const ruta = new URL('../src/pages/en/blog/rss.xml.ts', import.meta.url)
  assert.equal(existsSync(ruta), true)
  const rss = readFileSync(ruta, 'utf8')
  assert.match(rss, /locale:\s*['"]en['"]/)
  assert.match(rss, /<language>en-US<\/language>/)
})

test('el sitemap solo agrega fichas inglesas aprobadas por la API', () => {
  const sitemap = readFileSync(new URL('../src/pages/sitemap.xml.ts', import.meta.url), 'utf8')

  assert.match(sitemap, /getCatalogo\(\{ pagina, locale: ['"]en['"] \}\)/)
  assert.match(sitemap, /if \(productosEn\.has\(producto\.slug\)\)/)
  assert.match(sitemap, /getArticulos\(\{ pagina, locale: ['"]en['"] \}\)/)
  assert.match(sitemap, /if \(articulosEn\.has\(articulo\.slug\)\)/)
  assert.match(sitemap, /getUltimosCasos\(MAX_PAGINAS, ['"]en['"]\)/)
  assert.match(sitemap, /if \(casosEn\.has\(caso\.slug\)\)/)
  assert.match(sitemap, /ruta !== ['"]\/aneffy['"]/)
})

test('las soluciones no dejan textos alternativos espanoles como respaldo ingles', () => {
  const directory = new URL('../src/pages/soluciones/', import.meta.url)
  for (const file of readdirSync(directory).filter((name) => name.endsWith('.astro'))) {
    const source = readFileSync(new URL(file, directory), 'utf8')
    assert.doesNotMatch(source, /alt=\{[^\n]*\|\|\s*"/, `${file} conserva un alt fijo en español`)

    for (const line of source.split('\n').filter((value) => value.includes('Certificación ${cert.name}'))) {
      assert.match(line, /locale === ['"]en['"]/, `${file} no localiza el alt de certificación`)
    }
  }
})
