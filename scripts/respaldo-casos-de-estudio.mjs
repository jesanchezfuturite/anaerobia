/**
 * Genera el respaldo local de casos de estudio (src/data/casos-de-estudio.json)
 * desde la API del admin. Se corre antes de desplegar, para que el sitio siga
 * funcionando aunque el panel no responda.
 *
 *   node scripts/respaldo-casos-de-estudio.mjs [url-del-admin]
 */
import { writeFile } from 'node:fs/promises'

const API = process.argv[2] ?? process.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'

for (const locale of ['es', 'en']) {
  const listado = await (await fetch(`${API}/api/v1/casos-de-estudio?por_pagina=50&locale=${locale}`)).json()
  const casos = []
  for (const tarjeta of listado.data) {
    const ficha = await (await fetch(`${API}/api/v1/casos-de-estudio/${tarjeta.slug}?locale=${locale}`)).json()
    casos.push(ficha.data)
  }
  const nombre = locale === 'es' ? 'casos-de-estudio.json' : 'casos-de-estudio.en.json'
  await writeFile(new URL(`../src/data/${nombre}`, import.meta.url), JSON.stringify({ casos }, null, 4) + '\n')
  console.log(`Respaldo ${locale}: ${casos.length} casos de estudio`)
}
