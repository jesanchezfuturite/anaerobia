import assert from 'node:assert/strict'
import test from 'node:test'

import { traducirContenido } from '../src/lib/traducir-contenido.js'
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
