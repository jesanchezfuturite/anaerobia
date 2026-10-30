/**
 * Genera el respaldo local del blog (src/data/blog.json) desde la API del
 * admin. Se corre antes de desplegar, para que el sitio siga funcionando
 * aunque el panel no responda.
 *
 *   node scripts/respaldo-blog.mjs [url-del-admin]
 */
import { writeFile } from 'node:fs/promises'

const API = process.argv[2] ?? process.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'

for (const locale of ['es', 'en']) {
  const listado = await (await fetch(`${API}/api/v1/blog?por_pagina=50&locale=${locale}`)).json()
  const articulos = []
  for (const tarjeta of listado.data) {
    const ficha = await (await fetch(`${API}/api/v1/blog/${tarjeta.slug}?locale=${locale}`)).json()
    articulos.push(ficha.data)
  }
  const nombre = locale === 'es' ? 'blog.json' : 'blog.en.json'
  await writeFile(new URL(`../src/data/${nombre}`, import.meta.url), JSON.stringify({ categorias: listado.categorias, articulos }, null, 4) + '\n')
  console.log(`Respaldo ${locale}: ${articulos.length} artículos, ${listado.categorias.length} categorías`)
}
