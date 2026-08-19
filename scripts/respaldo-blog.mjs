/**
 * Genera el respaldo local del blog (src/data/blog.json) desde la API del
 * admin. Se corre antes de desplegar, para que el sitio siga funcionando
 * aunque el panel no responda.
 *
 *   node scripts/respaldo-blog.mjs [url-del-admin]
 */
import { writeFile } from 'node:fs/promises'

const API = process.argv[2] ?? process.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'

const listado = await (await fetch(`${API}/api/v1/blog?por_pagina=50`)).json()

const articulos = []
for (const tarjeta of listado.data) {
  const ficha = await (await fetch(`${API}/api/v1/blog/${tarjeta.slug}`)).json()
  articulos.push(ficha.data)
}

await writeFile(
  new URL('../src/data/blog.json', import.meta.url),
  JSON.stringify({ categorias: listado.categorias, articulos }, null, 4) + '\n',
)

console.log(`Respaldo generado: ${articulos.length} artículos, ${listado.categorias.length} categorías`)
