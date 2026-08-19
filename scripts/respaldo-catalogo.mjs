/**
 * Genera el respaldo local del catálogo (src/data/catalogo.json) a partir de
 * la API del admin. Se corre antes de desplegar, para que el sitio siga
 * funcionando aunque el panel no responda.
 *
 *   node scripts/respaldo-catalogo.mjs [url-del-admin]
 */
import { writeFile } from 'node:fs/promises'

const API = process.argv[2] ?? process.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'

const listado = await (await fetch(`${API}/api/v1/catalogo?por_pagina=100`)).json()

const productos = []
for (const tarjeta of listado.data) {
  const ficha = await (await fetch(`${API}/api/v1/catalogo/${tarjeta.slug}`)).json()
  productos.push(ficha.data)
}

const respaldo = {
  categorias: listado.categorias,
  marcas: listado.marcas,
  productos,
}

await writeFile(new URL('../src/data/catalogo.json', import.meta.url), JSON.stringify(respaldo, null, 4) + '\n')

console.log(`Respaldo generado: ${productos.length} productos, ${respaldo.categorias.length} categorías, ${respaldo.marcas.length} marcas`)
