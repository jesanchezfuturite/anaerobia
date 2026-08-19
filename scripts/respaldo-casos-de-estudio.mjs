/**
 * Genera el respaldo local de casos de estudio (src/data/casos-de-estudio.json)
 * desde la API del admin. Se corre antes de desplegar, para que el sitio siga
 * funcionando aunque el panel no responda.
 *
 *   node scripts/respaldo-casos-de-estudio.mjs [url-del-admin]
 */
import { writeFile } from 'node:fs/promises'

const API = process.argv[2] ?? process.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'

const listado = await (await fetch(`${API}/api/v1/casos-de-estudio?por_pagina=50`)).json()

const casos = []
for (const tarjeta of listado.data) {
  const ficha = await (await fetch(`${API}/api/v1/casos-de-estudio/${tarjeta.slug}`)).json()
  casos.push(ficha.data)
}

await writeFile(
  new URL('../src/data/casos-de-estudio.json', import.meta.url),
  JSON.stringify({ casos }, null, 4) + '\n',
)

console.log(`Respaldo generado: ${casos.length} casos de estudio`)
