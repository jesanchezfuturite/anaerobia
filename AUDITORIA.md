# Auditoría de migración SEO — anaerobia.com

Fecha: 2026-09-18. Rama: `claude/anaerobia-seo-audit-a0c542`. Commit base: `06daa46`.
Método: lectura del repo, build local (`astro build` → `.vercel/output/`), código fuente de
`@astrojs/vercel@10.0.6` y `@vercel/routing-utils@5.3.3` (lo que Vercel usa para compilar
`vercel.json`), y `curl` contra producción. **Nada se desplegó.**

## 0. Resumen: qué hipótesis del brief resultaron ciertas y cuáles no

| # | Hipótesis / afirmación del brief | Veredicto | Detalle |
|---|---|---|---|
| T2 | `tienda/` y `categoria-producto/` son (a) shims con `Astro.redirect` | **Cierta**, con 301 | §2. Pero hoy son **código muerto**: el `vercel.json` los tapa. |
| T2 | «Una ruta real siempre le gana a un redirect» | **Falsa en Vercel** | Los `redirects` de `vercel.json` se evalúan **antes** que las rutas/funciones (§6). Por eso el `vercel.json` desplegado hoy mata un producto vivo (§7). |
| T3 | Hay un volcado estático del sitio viejo en `public/` | **Falsa** | `public/` no tiene ni un `.html` (§3). Hoy `/cabinas-de-pintura/` ya no devuelve WordPress: da 308 → 308 → `/soluciones/cabinas-pintura`. |
| T4 | El canonical de `?categoria=` apunta al listado | **Cierta** | `Layout.astro` construye el canonical solo con `pathname` (§4). |
| T5.1 | El sitemap emite 12 URLs `?categoria=` que el canonical descarta | **Cierta** | 5 de catálogo + 7 de blog, verificado en vivo (§5). |
| T5.2 | `PAGINAS` omite `/casos-de-estudio`, «que sí existe como ruta» | **Falsa** | No existe índice: solo `casos-de-estudio/[slug].astro`. `/casos-de-estudio` da 404 en vivo. Sí falta la ficha `/casos-de-estudio/ingenieria-alta-precision` (§5). |
| T5.3 | Los `while` pueden quedarse en bucle infinito | **Improbable pero no imposible** | Terminan con la API real (Laravel) y con el respaldo local; solo un API que ignore `page` y eco-e el número pedido los colgaría. Recomiendo acotar por `meta.paginas` (§5). |
| T5.4 | `prerender = false` con `output: 'static'` funciona y se despliega como función | **Cierta, y más**: las 27 rutas son SSR | El build dice `mode: "server"`; `.vercel/output/static` no tiene HTML (§1). |
| T6 | «No existe `vercel.json` en el repo» | **Falsa** | Existe desde el commit `06daa46` (hoy 10:16) y **ya está desplegado**. El brief se escribió antes. |
| T6 | Vercel ignora `redirects`/`trailingSlash` del `vercel.json` cuando hay Build Output API | **Falsa** | Se mezclan (`mergeRoutes`) y van antes que las rutas del adaptador. Evidencia en vivo: 308 con `content-type: text/plain` (§6). |
| T6 | Hay cadenas de más de un salto por la barra final | **Cierta** | Todas las URLs viejas dan 2 saltos hoy (§6). El nuevo `vercel.json` las deja en 1. |
| T7 | `/partes-y-filtros/pintura-electrostatica` es un producto vivo | **Cierta**, y el `vercel.json` actual lo redirige | Colisión real en producción hoy (§7). |
| T7 | El comodín `/tienda/:slug` sirve para los 10 productos posicionados | **Cierta** | Los 10 conservan slug. Dos productos **no** (`216-505`, `165010-75`) y necesitan regla propia (§7). |
| T9 | `gracias.astro` tiene `noindex` | **Falsa** | No hay meta robots en ningún lado del sitio (§9). |
| T9 | Rutas `api/` no indexables | **Cierta en la práctica** | Solo `POST`; `GET` da 404. `robots.txt` no las excluye (§9). |

Hallazgos que el brief no anticipó:

- **El sitio es 100 % SSR.** Las 27 rutas tienen `prerender = false`; `output: 'static'` no
  produce ni una página estática. Todo pasa por una sola función `_render` (nodejs24.x).
- **Duplicado por `legacy_slug`.** La API resuelve el slug viejo en la ficha, así que
  `/partes-y-filtros/216-505` renderiza el producto con canonical a sí mismo, duplicando
  `/partes-y-filtros/filtro-de-6-bolsas-con-marco-metalico` (§7).
- **17 de 19 artículos del blog enlazan a URLs viejas absolutas** (`https://anaerobia.com/…/`) y
  5 traen imágenes en `brouo.lat/ana/wp-content/…` o `/wp-content/…` (403 hoy) (§8).
- `Astro.redirect('/partes-y-filtros', 404)` en las fichas inexistentes produce un **404 con
  cabecera `Location` y cuerpo vacío**: correcto para SEO, pésimo para el usuario (§1).

---

## 1. Inventario de rutas (Tarea 1)

Fuente: `src/pages/` + `.vercel/output/config.json` generado por `astro build`. **Ningún archivo
usa `getStaticPaths`** y **los 27 tienen `export const prerender = false`**, así que no hay lista
finita de URLs en el build: los parámetros se resuelven por petición contra la API del admin
(con respaldo en `src/data/*.json`). La columna «valores» sale de los respaldos, que son la
última foto del admin.

| Ruta pública | Archivo | Tipo | Valores que produce hoy |
|---|---|---|---|
| `/` | `index.astro` | SSR | — |
| `/nosotros` | `nosotros.astro` | SSR | — |
| `/proyectos` | `proyectos.astro` | SSR | — |
| `/contacto` | `contacto.astro` | SSR | acepta `?producto=&parte=&categoria=&solucion=` |
| `/gracias` | `gracias.astro` | SSR | post-formulario (JS redirige aquí desde `ContactForm.astro:178`) |
| `/aviso-de-privacidad` | `aviso-de-privacidad.astro` | SSR | — |
| `/terminos-y-condiciones` | `terminos-y-condiciones.astro` | SSR | — |
| `/soluciones/{slug}` | `soluciones/*.astro` (10 archivos, uno por slug) | SSR | `aplicacion-recubrimientos`, `cabinas-pintura`, `conveyors`, `filtros`, `granallado`, `hornos-secado-curado`, `pintura-en-polvo`, `pintura-liquida`, `servicios-industriales`, `sistemas-de-pretratamiento` |
| `/partes-y-filtros` | `partes-y-filtros/index.astro` | SSR | acepta `?categoria=&marca=&buscar=&pagina=` (5 categorías, 13 marcas) |
| `/partes-y-filtros/{slug}` | `partes-y-filtros/[slug].astro` | SSR | 41 productos (`catalogo.json`); **también responde al `legacy_slug`** vía API. Slug desconocido → 404 con `Location` |
| `/blog` | `blog.astro` | SSR | acepta `?categoria=&buscar=&pagina=` (7 categorías) |
| `/blog/{slug}` | `blog/[slug].astro` | SSR | 19 artículos (`blog.json`). Desconocido → 404 |
| `/blog/rss.xml` | `blog/rss.xml.ts` | SSR (endpoint) | — |
| `/casos-de-estudio/{slug}` | `casos-de-estudio/[slug].astro` | SSR | 1 caso: `ingenieria-alta-precision`. **No hay `/casos-de-estudio` índice** |
| `/sitemap.xml` | `sitemap.xml.ts` | SSR (endpoint) | 88 URLs hoy |
| `/api/lead` | `api/lead.js` | SSR (endpoint) | solo `POST`; `GET` → 404 |
| `/tienda/{slug}` | `tienda/[slug].astro` | SSR (shim 301) | **tapado por `vercel.json`**, nunca se ejecuta |
| `/categoria-producto/{...slug}` | `categoria-producto/[...slug].astro` | SSR (shim 301) | **tapado por `vercel.json`**, nunca se ejecuta |

Rutas que el adaptador añade solo: `/_image`, `/_server-islands/*`, `/404` (interno) y un
`^/.*$ → _render` con `status: 404` para todo lo demás.

Total de URLs indexables «reales» hoy: 1 + 6 + 10 + 1 + 41 + 1 + 19 + 1 = **80**, más
`rss.xml` y `sitemap.xml`.

## 2. `tienda/` y `categoria-producto/` (Tarea 2)

**Caso (a): shims con `Astro.redirect(…, 301)`.** Código completo:

- `tienda/[slug].astro`: llama a `getProducto(slug)`; si la API responde (resuelve también
  `legacy_slug`, según `ARQUITECTURA.md:147` y comprobado en vivo), redirige **301** a
  `/partes-y-filtros/{slug nuevo}`; si no, 301 a `/partes-y-filtros`.
- `categoria-producto/[...slug].astro`: toma el último segmento, lo busca entre las categorías y
  luego entre las marcas; 301 a `/partes-y-filtros?categoria=` o `?marca=`; si no, 301 al listado.

No hay contenido duplicado ni 302. **Pero hoy no se ejecutan nunca**: el `vercel.json`
desplegado tiene `/tienda/:slug` y `/categoria-producto/:path*`, y esas reglas se evalúan antes
que la función (§6). Consecuencias medibles en producción:

- `/categoria-producto/filtros/andreae` → `/partes-y-filtros` (el comodín). El shim habría dado
  `?marca=andreae`.
- `/tienda/216-505` → `/partes-y-filtros/216-505` (página duplicada, §7). El shim habría dado el
  slug nuevo.

Decisión tomada en el nuevo `vercel.json`: **mantener los redirects en la plataforma** (sin coste
de función, sin dependencia de la API, verificables con `curl`) y **hacerlos tan completos como
el shim** (13 marcas, 5 categorías, 2 `legacy_slug`). Con eso los dos archivos son código muerto
y van a la lista de eliminación (§10).

## 3. Origen de la página legacy `/cabinas-de-pintura/` (Tarea 3)

**Hipótesis falsa: no hay volcado estático en `public/`.** Inventario completo de `public/` por
tipo: 210 webp, 51 png, 30 jpg, 14 svg, 4 mp4, 1 pdf, 1 ico, 1 jpeg, 1 JPG y `robots.txt`.
**Cero `.html`**, ninguna carpeta con nombre de ruta vieja. Las carpetas son `images/`, `img/`
(con un `backup-soluciones/` de imágenes) y `videos/`. Los únicos no-imagen:

```
public/robots.txt
public/images/proyectos/casos_de_estudio/ejemplo_caso_estudio.pdf
public/videos/home.mp4
public/videos/mantenimiento.mp4
public/videos/hero/hero/backgroundVideo.mp4
public/videos/mantenimiento/backgroundVideo.mp4
```

Además el build confirma que `.vercel/output/static/` no contiene HTML, y el `config.json` del
adaptador manda **todo** lo que no sea un archivo estático a la función Astro con 404. No hay
forma de que este repo sirva HTML de WordPress.

Estado en vivo hoy: `/cabinas-de-pintura/` → 308 `/cabinas-de-pintura` → 308
`/soluciones/cabinas-pintura` (200, con `meta name="generator"` de Astro). **No pude reproducir
la página de WordPress.** El DNS apunta a Vercel (`76.76.21.21`, nameservers Cloudflare). La
explicación más probable es que la auditoría externa vio (a) el sitio antes del deploy de las
10:16 de hoy, cuando la URL daba 404 y algún proxy/caché o el propio Cloudflare servía copia
vieja, o (b) el hosting anterior aún respondía para ese dominio en algún punto de la propagación.
Nada de eso está en el código; si vuelve a aparecer, hay que mirar reglas de Cloudflare
(Page Rules / caché) y no el repo.

Dato relacionado: `/wp-content/uploads/...` devuelve **403** (no 404) en Vercel. Es comportamiento
de la plataforma, no del repo, y afecta a imágenes que siguen enlazadas desde el blog (§8).

## 4. Canonicals del catálogo (Tarea 4)

Dónde se calcula: `src/layouts/Layout.astro:21`:

```js
const canonical = new URL(Astro.url.pathname, Astro.site ?? Astro.url.origin).href;
```

Solo usa `pathname`, así que **cualquier query string desaparece del canonical y del `og:url`**.
El comentario del código lo hace a propósito («evita que los filtros del catálogo se indexen
como páginas distintas»). El efecto colateral es exactamente el que detectó la auditoría:
`/partes-y-filtros?categoria=filtros` tiene `<title>` propio (`Filtros | Partes y Filtros |
Anaerobia`), `<h1>` propio, pero canonical al listado y la descripción genérica (porque
`categoriaActual.description` está vacía en las 5 categorías del respaldo:
`catalogo.json` → `categorias[].description = ""`). Con eso la categoría se autodeclara duplicado
y no puede posicionar. Lo mismo pasa con `/blog?categoria=`.

### Evaluación de convertir las categorías en rutas reales

Propuesta: `/partes-y-filtros/categoria/[slug].astro` (y opcionalmente
`/partes-y-filtros/marca/[slug].astro`, `/blog/categoria/[slug].astro`).

Coste: **bajo, medio día.** No hay que tocar la API ni el admin.

1. Nuevo archivo `partes-y-filtros/categoria/[slug].astro` que reutiliza el cuerpo de
   `index.astro` (extraer el listado a un componente `CatalogoListado.astro` para no duplicar
   120 líneas). Si el slug no es categoría → 404.
2. `enlace()` en `index.astro`/el componente: cuando se cambia de categoría, generar
   `/partes-y-filtros/categoria/{slug}` en vez de `?categoria=`. Los filtros secundarios
   (`marca`, `buscar`, `pagina`) siguen como query sobre esa base.
3. Menú: `general.json` → `navigation` tiene 5 enlaces `?categoria=` (se editan en el admin y en
   el respaldo). Migas de pan en `partes-y-filtros/[slug].astro:49`.
4. `sitemap.xml.ts`: emitir las nuevas rutas en vez de `?categoria=` (resuelve T5.1 de paso).
5. `vercel.json`: los 5 destinos `?categoria=` pasan a la ruta nueva; añadir
   `/partes-y-filtros?categoria=:slug` → `/partes-y-filtros/categoria/:slug` (308) para no perder
   lo que ya se haya enlazado. Vercel soporta `has: [{type:'query', key:'categoria'}]`.
6. Meta description propia: hoy `categorias[].description` viene vacío del admin. Sin llenar ese
   campo en las 5 categorías la ruta nueva seguirá con descripción genérica; es trabajo de
   contenido, no de código.

Riesgo: **colisión de nombres**. `/partes-y-filtros/categoria/filtros` compite con
`/partes-y-filtros/[slug]`; Astro prioriza la ruta más específica (estática `categoria/` sobre
`[slug]`), pero conviene comprobar que ningún producto tenga slug `categoria` (ninguno lo tiene).

Ganancia: 5 páginas de categoría (+13 de marca si se quiere) con canonical propio, indexables,
que son el destino natural de `/categoria-producto/*`.

## 5. `sitemap.xml.ts` (Tarea 5)

1. **Cierto.** Emite `partes-y-filtros?categoria=` ×5 y `blog?categoria=` ×7 (12 de 88 URLs en
   vivo). Todas con canonical al listado sin query: el sitemap y el canonical se contradicen.
   Hasta que existan rutas reales (§4) hay que **quitarlas** del sitemap; con la ruta real,
   sustituirlas.
2. `/casos-de-estudio` **no existe** (404 en vivo, no hay `index.astro` en esa carpeta). Lo que sí
   falta es la ficha `/casos-de-estudio/ingenieria-alta-precision` (200 en vivo, enlazada desde
   `/proyectos`). Faltan también `/aviso-de-privacidad` y `/terminos-y-condiciones`, aunque son
   opcionales. `PAGINAS` y `SOLUCIONES` están hardcodeados: si se añade una solución hay que
   acordarse de dos sitios (`src/pages/soluciones/` y este array). `general.json → navigation`
   ya lista las 10 soluciones y podría ser la fuente.
3. **Bucle infinito: no con las implementaciones actuales.**
   - Respaldo local (`filtrarRespaldo`): devuelve `meta.pagina = pagina` (eco del pedido) y
     `data = []` cuando `pagina` supera el total → `porRecorrer.length > 0` falla → sale.
   - API Laravel (`/api/v1/catalogo?page=N`): un paginador estándar devuelve `data: []` con
     `current_page = N` cuando N excede `last_page` → sale. Si en vez de vacío **satura**
     (`current_page = last_page ≠ N`), la condición `siguiente.meta.pagina === pagina` falla y
     sale también. **El único caso que cuelga** es una API que ignore `page`, devuelva siempre la
     misma página con datos y a la vez eco-e `pagina: N`; ningún paginador razonable hace eso.
   - Caída de la API a mitad del recorrido: `getCatalogo` cae al respaldo local, que también
     termina. Se mezclarían productos de API y respaldo, pero termina.
   - Aun así el bucle no está acotado y el coste de acotarlo es una línea. Propuesta: usar
     `meta.paginas` que ya devuelven ambas implementaciones, y un tope duro.

   ```js
   const primera = await getCatalogo({ pagina: 1 })
   const fichas = [...primera.data]
   for (let pagina = 2; pagina <= Math.min(primera.meta.paginas, 50); pagina++) {
       fichas.push(...(await getCatalogo({ pagina })).data)
   }
   ```
   La función no tiene `maxDuration` configurado; con Fluid Compute el tope de Vercel es 300 s,
   así que el peor caso hoy sería un timeout, no una factura.
4. **Cierto.** Astro 6 permite `output: 'static'` + adaptador + `prerender = false` por ruta
   (build log: `output: "static"`, `mode: "server"`). `.vercel/output/functions/_render.func`
   existe con `runtime: nodejs24.x`, y `config.json` enruta `^/sitemap\.xml$` a `_render`. En vivo
   responde `x-vercel-cache: MISS`, `Cache-Control: public, max-age=3600` (lo pone el endpoint).
   Está desplegado como función, igual que **todas** las demás rutas (§1).

## 6. Viabilidad de los redirects (Tarea 6)

### Hechos verificados

- `package.json`: `@astrojs/vercel ^10.0.6` (lock: 10.0.6), `astro ^6.1.10` (lock: 6.1.10).
- `astro.config.mjs` no define `redirects` ni `trailingSlash`. El `config.json` que genera el
  build **no contiene ninguna regla de redirect ni de barra final**: solo `handle: filesystem`,
  cache de `_astro/` y las rutas a `_render`.
- Y sin embargo producción responde 308 con `content-type: text/plain` a las URLs viejas, con
  exactamente los destinos del `vercel.json` de `06daa46`. Ese 308 es de la **plataforma**, no
  de Astro (Astro emitiría 301 con `Location` vía la función).
- Cómo ocurre: `@vercel/routing-utils/dist/merge.js` (`mergeRoutes`) mezcla las rutas de
  `vercel.json` («user routes») con las del builder. En la fase sin `handle`, el orden es:
  rutas `continue` del builder → **rutas del usuario** → `check` del builder → resto. Es decir,
  **los `redirects` de `vercel.json` se evalúan antes que `handle: filesystem` y antes que las
  funciones.** La afirmación del brief de que Vercel ignora `redirects`/`trailingSlash` con Build
  Output API es falsa para este caso: lo que no se puede mezclar es `routes` (formato viejo) con
  `redirects`/`headers`/`trailingSlash` (`getTransformedRoutes` lo rechaza con
  `invalid_mixed_routes`).
- El propio adaptador lo sabe: `@astrojs/vercel/dist/index.js:183-191` lee `vercel.json` para
  avisar si su `trailingSlash` contradice al de Astro, «porque causaría redirects infinitos o
  contenido duplicado».
- Orden interno de `getTransformedRoutes` (`routing-utils/dist/index.js:216-260`):
  `cleanUrls` → **`trailingSlash`** → **`redirects`** → `handle: filesystem` → `rewrites` … Y los
  `source` se compilan con `path-to-regexp` en modo `strict: true` (`superstatic.js:242`): un
  `source` sin barra **no** casa con la URL con barra.

### Por qué hay dos saltos hoy

`vercel.json` tiene `"trailingSlash": false`. Eso genera primero la regla
`^/(.*)\/$ → /$1` (308) y **después** los redirects. Toda URL vieja (todas traían barra) hace:
`/x/` → 308 `/x` → 308 destino. Verificado en las 49 URLs: **2 saltos en todas** salvo las 3 que
solo necesitaban quitar la barra (1 salto). Google sigue hasta 10 saltos y un 308 transfiere
señal igual que un 301, así que no es una catástrofe, pero es evitable.

### Decisión: `vercel.json`, no `astro.config.mjs`

- `astro.config.mjs → redirects` también funciona (el adaptador lo traduce con el mismo
  `getTransformedRoutes` y lo pone antes de `handle: filesystem`), pero:
  - las claves son patrones de ruta de Astro (`/tienda/[slug]`), sin forma de decir «con o sin
    barra», así que no resuelve la cadena;
  - un cambio de redirect obliga a rebuild de Astro; en `vercel.json` también, pero es un archivo
    declarativo revisable sin tocar código;
  - ya hay un `vercel.json` desplegado y funcionando; mover 46 reglas de sitio no aporta nada.
- Para colapsar la cadena a **un salto** el nuevo `vercel.json`:
  1. **quita `trailingSlash: false`**;
  2. escribe cada `source` con `{/}?` (sintaxis de `path-to-regexp` que Vercel acepta: compila a
     `(?:/)?$`), de modo que casan con y sin barra;
  3. cierra con una regla genérica `"/:path+/" → "/:path+"` (308) que hace lo mismo que
     `trailingSlash: false` para las rutas nuevas (`/contacto/` → `/contacto`) pero **después** de
     los redirects específicos. Se usó `:path+` y no `:path*` ni `(.*)` porque esos dos casan con
     `/` y `//` y generarían un bucle o `Location: /`.
- Todo con `permanent: true` → **308**. No hay ningún 302.

Comprobación estática: `node scripts/validar-redirects.mjs` compila el `vercel.json` con la
misma librería que Vercel, pasa las 63 URLs de prueba en orden y contrasta cada destino con el
inventario real. Resultado: **63 URLs, 0 fallos, 0 colisiones, 60 redirigidas en 1 salto, 3 rutas
vivas intactas.**

## 7. Redirects finales (Tarea 7)

Archivo: [`vercel.json`](vercel.json). Reglas para las 46 URLs de Semrush + 3 de búsqueda:

| Tráfico | URL vieja | Destino (verificado en inventario) | Regla |
|---|---|---|---|
| 30 | `/tienda/filtro-fibra-de-vidrio-en-rollo-verde/` | `/partes-y-filtros/filtro-fibra-de-vidrio-en-rollo-verde` | `/tienda/:slug{/}?` |
| 15 | `/filtros-para-cabina-de-pintura/como-elegir-filtros-…-ambientales/` | `/soluciones/filtros` | comodín |
| 12 | `/tienda/filtro-fibra-de-vidrio-en-rollo-amarillo/` | `/partes-y-filtros/filtro-fibra-de-vidrio-en-rollo-amarillo` | comodín tienda |
| 12 | `/conveyors/` | `/soluciones/conveyors` | `/conveyors/:slug*{/}?` |
| 5 | `/cabinas-de-pintura-industrial/en-monterrey-todo-lo-que-debes-saber/` | `/soluciones/cabinas-pintura` | comodín |
| 5 | `/tienda/ventilador-de-tubo-de-descarga-axial-sin-motor/` | `/partes-y-filtros/ventilador-de-tubo-de-descarga-axial-sin-motor` | comodín tienda |
| 4 | `/tienda/manometro-diferencial-de-presion-dwyer/` | `/partes-y-filtros/manometro-diferencial-de-presion-dwyer` | comodín tienda |
| 4 | `/equipo-de-aplicacion-de-pintura/…-todo-lo-que-necesitas-saber/` | `/soluciones/aplicacion-recubrimientos` | comodín |
| 3 | `/tienda/cartucho-de-celulosa-para-recoleccion-de-polvo-y-pintura-en-polvo/` | `/partes-y-filtros/cartucho-de-celulosa-…` | comodín tienda |
| 3 | `/blog/pintura-liquida-cuando-y-por-que-elegirla-sobre-la-pintura-en-polvo` | **ruta viva, sin regla** | — |
| 2 | `/tienda/transmisor-multifuncional-kimo/` | `/partes-y-filtros/transmisor-multifuncional-kimo` | comodín tienda |
| 2 | `/cabinas-de-pintura/` | `/soluciones/cabinas-pintura` | `/cabinas-de-pintura/:slug*{/}?` |
| 2 | `/filtros-para-cabina-de-pintura/tipos-de-filtros-…/` | `/soluciones/filtros` | comodín |
| 1 | `/tienda/lamparas-para-cabina-de-pintura-gfs-6-tubos-led/` | `/partes-y-filtros/lamparas-para-cabina-de-pintura-gfs-6-tubos-led` | comodín tienda |
| 1 | `/sistemas-granallado/` | `/soluciones/granallado` | |
| 1 | `/filtros-para-cabina-de-pintura/guia-completa-sobre-mantenimiento-…/` | `/blog/cuando-debo-cambiar-los-filtros-de-mi-cabina-la-importancia-del-mantenimiento` | específica |
| 1 | `/tienda/pintura-electrostatica/` | `/partes-y-filtros/pintura-electrostatica` (**el producto**, no la categoría) | comodín tienda |
| 1 | `/hornos-de-secado-y-curado/` | `/soluciones/hornos-secado-curado` | |
| 0 | `/blog/conveyors-en-sistemas-de-acabado/` | `/blog/conveyors-en-sistemas-de-acabado` | genérica de barra |
| 0 | `/sistemas-de-aplicacion-de-recubrimientos/` | `/soluciones/aplicacion-recubrimientos` | |
| 0 | `/cabina-pintura/normativas-y-seguridad-en-cabinas-de-pintura/` | `/soluciones/cabinas-pintura` | comodín |
| 0 | `/hornos-de-curado-de-pintura/guia-sobre-hornos-de-curado-de-pintura/` | `/soluciones/hornos-secado-curado` | comodín |
| 0 | `/categoria-producto/refacciones/` | `/partes-y-filtros?categoria=refacciones` | específica |
| 0 | `/categoria-producto/lamparas-infrarrojas/` | `/partes-y-filtros?categoria=lamparas-infrarrojas` | específica |
| 0 | `/sistemas-de-pintura-industrial/…-garantizando-calidad/` | `/` | comodín (ver nota) |
| 0 | `/sistemas-de-pintura-liquida/` | `/soluciones/pintura-liquida` | |
| 0 | `/categoria-producto/filtros/columbus-industries/` | `/partes-y-filtros?marca=columbus-industries` | `/categoria-producto/:parent*/columbus-industries{/}?` |
| 0 | `/cabina-pintura/el-impacto-ambiental-de-las-cabinas-de-pintura/` | `/soluciones/cabinas-pintura` | comodín |
| 0 | `/hornos-de-curado-de-pintura/tecnicas-de-curado-de-pintura/` | `/blog/la-clave-del-acabado-perfecto-secado-y-curado-en-la-pintura-liquida` | específica |
| 0 | `/cabinas-de-pintura-industrial/cabinas-de-pintura-industrial-guia/` | `/blog/como-elegir-tu-cabina-de-pintura` | específica |
| 0 | `/conveyors-old/` | `/soluciones/conveyors` | |
| 0 | `/partes-y-filtros/pintura-electrostatica` | **ruta viva, sin regla** | — |
| 0 | `/partes-y-filtros/cartucho-de-celulosa-…` | **ruta viva, sin regla** | — |
| 0 | `/blog/seguridad-industrial-en-un-sistema-de-sandblasting/` | `/blog/seguridad-industrial-en-un-sistema-de-sandblasting` | genérica de barra |
| 0 | `/cabinas-de-pintura-industrial/tipos-de-cabinas-de-pintura-industrial/` | `/blog/como-elegir-tu-cabina-de-pintura` | específica |
| 0 | `/categoria-producto/pintura-en-polvo/` | `/partes-y-filtros?categoria=pintura-en-polvo` | específica |
| 0 | `/tienda/filtro-plisado-con-marco-de-carton/` | `/partes-y-filtros/filtro-plisado-con-marco-de-carton` | comodín tienda |
| 0 | `/hornos-de-curado-de-pintura/introduccion-a-los-hornos-…/` | `/soluciones/hornos-secado-curado` | comodín |
| 0 | `/tienda/lampara-infrarroja-de-pedestal-iwt-2-modulos/` | `/partes-y-filtros/lampara-infrarroja-de-pedestal-iwt-2-modulos` | comodín tienda |
| 0 | `/filtros-para-cabina-de-pintura/filtros-para-cabinas-de-pintura/` | `/soluciones/filtros` | comodín |
| 0 | `/sistemas-de-pintura-industrial/introduccion-a-los-sistemas-…/` | `/` | comodín (ver nota) |
| 0 | `/cabina-pintura/mantenimiento-preventivo-de-cabinas-…/` | `/blog/ventajas-mantenimiento-preventivo` | específica |
| 0 | `/hornos-de-curado-de-pintura/tipos-de-hornos-de-curado-de-pintura/` | `/soluciones/hornos-secado-curado` | comodín |
| 0 | `/categoria-producto/filtros/camfil/` | `/partes-y-filtros?marca=camfil` | `:parent*/camfil` |
| 0 | `/categoria-producto/filtros/` | `/partes-y-filtros?categoria=filtros` | específica |
| — | `/cabinas-de-pintura-industrial/monterrey-pintura-de-calidad/` | `/soluciones/cabinas-pintura` | comodín |
| — | `/cabinas-de-pintura-industrial/factores-clave-instalar-en-taller/` | `/soluciones/cabinas-pintura` | comodín |
| — | `/cabina-pintura/tipos-de-cabinas-de-pintura/` | `/blog/como-elegir-tu-cabina-de-pintura` | específica |

Los 10 productos de `/tienda/` fueron validados uno a uno contra `catalogo.json`: los 10
conservan slug. `pintura-electrostatica` es «Pistola de aplicación electrostática» (categoría
`pintura-en-polvo`) y está vivo en `/partes-y-filtros/pintura-electrostatica`.

### Colisiones y errores del `vercel.json` anterior (`06daa46`), corregidos

1. **`/partes-y-filtros/pintura-electrostatica → ?categoria=pintura-en-polvo`.** Redirigía un
   producto vivo que está en el sitemap. Como los redirects van antes que la función, la ficha
   era inalcanzable en producción (verificado: 308). **Eliminada.**
2. **`/tienda/pintura-electrostatica → ?categoria=pintura-en-polvo`.** Mandaba el producto a la
   categoría en vez de a su ficha. **Eliminada**; lo cubre el comodín hacia la ficha.
3. **Comodín `/tienda/:slug` sin excepciones para los `legacy_slug` distintos.** Hay dos:
   `216-505` → `filtro-de-6-bolsas-con-marco-metalico` y `165010-75` →
   `filtro-en-rollo-de-poliester-difusor-de-aire-pare-techo-de-cabinas-de-pintura`. Hoy
   `/tienda/216-505` acaba en `/partes-y-filtros/216-505`, que la API **renderiza** (resuelve
   `legacy_slug`) con canonical a sí misma: **contenido duplicado con canonical propio**.
   **Añadidas** 2 reglas en `/tienda/` y 2 en `/partes-y-filtros/` que mandan al slug nuevo.
   Además conviene el parche de código de §10 para que la ficha redirija sola cuando
   `producto.slug !== slug` (cubre cualquier `legacy_slug` futuro).
4. **`/categoria-producto/:path*` demasiado codicioso**: solo camfil y columbus-industries tenían
   regla propia; las otras 11 marcas iban al listado. **Añadidas** las 13 marcas con
   `:parent*/marca{/}?` (casa `/categoria-producto/filtros/andreae/` y
   `/categoria-producto/andreae/`) y la 5.ª categoría `equipos-para-aplicacion-de-pintura`.
5. **`trailingSlash: false` + `source` sin barra = 2 saltos** en las 46 URLs. Corregido (§6).

### Reglas nuevas que no estaban en el brief

Encontradas en el contenido migrado (§8) o por higiene de WordPress; ninguna choca con una ruta
real (comprobado por el validador contra los 80 URLs del inventario):

| Origen | Destino | Motivo |
|---|---|---|
| `/cabina-de-pintura/*` | `/soluciones/cabinas-pintura` | 4 enlaces en blog/catálogo; 404 hoy |
| `/sistemas-de-pintura-en-polvo/*` | `/soluciones/pintura-en-polvo` | 2 enlaces en blog; 404 hoy |
| `/servicios-y-refacciones/*` | `/soluciones/servicios-industriales` | 2 enlaces en blog; 404 hoy |
| `/equipo-de-pretratamiento/*` | `/soluciones/sistemas-de-pretratamiento` | 1 enlace; 404 hoy |
| `/registro/` | `/contacto` | 1 enlace; 404 hoy |
| `/feed/`, `/blog/feed/` | `/blog/rss.xml` | feed de WP que los agregadores siguen pidiendo |
| `/sitemap_index.xml`, `/*-sitemap.xml` | `/sitemap.xml` | sitemaps de Yoast que Google sigue rastreando |
| `/:path+/` | `/:path+` | sustituye a `trailingSlash: false`, al final |

Conservadas del `vercel.json` anterior (destinos verificados): `/categoria/*`, `/tag/*`,
`/author/*` → `/blog`; `/carrito` → `/partes-y-filtros`; `/finalizar-compra`, `/mi-cuenta/*`,
`/contactanos` → `/contacto`; `/aviso-de-privacidad-2` → `/aviso-de-privacidad`;
`/pintura-electrostatica` → `/soluciones/pintura-en-polvo`.

### Notas de criterio

- **`/sistemas-de-pintura-industrial/*` → `/`.** Se mantiene lo que ya estaba (la home es la
  página de «integración de sistemas de pintura»), pero Google puede tratar «muchas URLs a la
  home» como soft-404. Son 6 URLs con 0 tráfico; si se prefiere un destino temático,
  `/soluciones/aplicacion-recubrimientos` o `/proyectos`. Decisión de negocio, no técnica.
- Los destinos `?categoria=`/`?marca=` son rutas válidas pero **con canonical al listado** (§4).
  Transfieren autoridad al listado, no a la categoría. Cuando existan rutas de categoría (§4),
  cambiar esos 18 destinos.
- Las URLs de Semrush con `/filtros-para-cabina-de-pintura/…`, `/cabina-pintura/…`,
  `/hornos-de-curado-de-pintura/…`, etc. eran **entradas de blog** de categorías que no se
  migraron (`ARQUITECTURA.md:124`: solo la categoría «Blog»). El contenido ya no existe; el
  redirect a la solución es lo más cercano. Las 5 que tienen artículo nuevo equivalente van a
  ese artículo.

## 8. Enlaces internos rotos (Tarea 8)

**Componentes y páginas (`src/**/*.astro`, `src/lib`, `src/components`)**: limpios. Ningún
`href` a rutas viejas. Los únicos `href` internos son `/`, `/contacto`, `/blog`, `/blog/rss.xml`,
`/proyectos`, `/partes-y-filtros` y los que se generan desde datos.

**`general.json` / `homepage.json`**: limpios (`/conveyors` aparece solo dentro de
`/soluciones/conveyors`). El menú tiene 5 enlaces `?categoria=` (ver §4).

**Contenido migrado (`src/data/blog.json`, `src/data/catalogo.json`)**: aquí está el problema.
Todo son URLs **absolutas** `https://anaerobia.com/…/` con barra final, por lo que hoy cada clic
hace 2 saltos (o 404). Se editan en el admin (Laravel) y luego se regenera el respaldo con
`node scripts/respaldo-blog.mjs` / `respaldo-catalogo.mjs`.

| Página | Enlace viejo | Cambiar a |
|---|---|---|
| 6 artículos (`la-clave-para-el-rendimiento-optimo-de-tu-proyecto`, `pretratamiento-un-basico-…`, `sabes-como-funciona-un-horno-batch-burn-off`, `5-consejos-para-mantener-el-balanceo-…`, `5-revisiones-para-no-detener-tu-horno`, `conveyors-en-sistemas-de-acabado`) | `https://anaerobia.com/sistemas-de-pintura-industrial/` | `/` o la solución que toque |
| `el-secreto-para-una-adherencia-perfecta-…` | `/sistemas-granallado/`, `/sistemas-de-aplicacion-de-recubrimientos/`, `/sistemas-de-pintura-en-polvo/` | `/soluciones/granallado`, `/soluciones/aplicacion-recubrimientos`, `/soluciones/pintura-en-polvo` |
| `la-clave-del-acabado-perfecto-…` | `/sistemas-de-pintura-liquida/`, `/blog/tecnologias-de-aplicacion-…/` | `/soluciones/pintura-liquida`, `/blog/tecnologias-de-aplicacion-de-pintura-liquida-guia-de-equipos-y-procesos` |
| `tecnologias-de-aplicacion-de-pintura-liquida-…` | `/blog/pintura-liquida-cuando-…/`, `/blog/pretratamiento-un-basico-…/` | mismas rutas sin dominio ni barra |
| `pintura-liquida-cuando-y-por-que-elegirla-…` | `/sistemas-de-pintura-liquida/`, `/sistemas-granallado/` | `/soluciones/pintura-liquida`, `/soluciones/granallado` |
| `pintura-en-polvo-innovacion-…` | `/sistemas-de-pintura-liquida/`, `/sistemas-de-pintura-en-polvo/` | `/soluciones/pintura-liquida`, `/soluciones/pintura-en-polvo` |
| `como-elegir-tu-cabina-de-pintura` | `/cabinas-de-pintura/`, `/equipo-de-pretratamiento/` | `/soluciones/cabinas-pintura`, `/soluciones/sistemas-de-pretratamiento` |
| `conveyors-en-sistemas-de-acabado` | `/registro/` | `/contacto` |
| `anaerobia-com-mantenimiento-de-hornos-de-curado`, `ventajas-mantenimiento-preventivo` | `/servicios-y-refacciones/`, `/contacto/` | `/soluciones/servicios-industriales`, `/contacto` |
| `seguridad-industrial-en-un-sistema-de-sandblasting` | `/cabina-de-pintura/` | `/soluciones/cabinas-pintura` |
| `tecnologia-infrarroja-…`, `5-consejos-para-la-aplicacion-…` | `/contacto/` | `/contacto` |
| Productos `bomba-de-piston-horizontal-maple-31`, `filtro-plenum-…-panel-azul`, `infrared-standing-units` | `/cabina-de-pintura/` | `/soluciones/cabinas-pintura` |
| Productos `lamparas-para-cabina-de-pintura-gfs-led`, `…-6-tubos-led` | `/cabinas-de-pintura/` | `/soluciones/cabinas-pintura` |
| Producto `filtro-fibra-de-vidrio-en-rollo-verde` (el de más tráfico) | `/filtros-para-cabina-de-pintura/` | `/soluciones/filtros` |

**Imágenes rotas** (no las arregla ningún redirect):

| Artículo | Imagen |
|---|---|
| `cuando-debo-cambiar-los-filtros-de-mi-cabina-…` | `https://anaerobia.com/wp-content/uploads/2021/01/filtros-varios-AN-1.webp`, `…/2021/02/71VrCESr48L._SL1340_.webp` (403 hoy) |
| `tecnologia-infrarroja-en-sistemas-de-curado` | `https://brouo.lat/ana/wp-content/uploads/2022/10/Spot-Repair2.jpg` (dominio de staging ajeno) |
| `5-consejos-para-la-aplicacion-de-pintura-liquida` | 5 imágenes en `brouo.lat/ana/wp-content/uploads/2022/08/Efren*.jpg` |
| `seguridad-industrial-en-un-sistema-de-sandblasting` | 2 imágenes `brouo.lat/ana/wp-content/uploads/2022/0{6,7}/Marco-*.jpg` |
| `ventajas-mantenimiento-preventivo` | `brouo.lat/ana/wp-content/uploads/2021/06/mantenimiento-preventivo.png` |

Son `href` de galerías (`<a href=imagen>`); hay que resubirlas al admin o quitar el enlace.
Que el sitio dependa de `brouo.lat` es además un riesgo: si ese host desaparece, se rompen.

## 9. Revisión menor (Tarea 9)

- **`gracias.astro` no tiene `noindex`.** `Layout.astro` no acepta ninguna prop de robots y no
  emite `<meta name="robots">` en ninguna página (verificado en vivo: `/gracias` da 200, canonical
  `https://anaerobia.com/gracias`, sin meta robots). Es indexable. Parche en §10.
- **`src/pages/api/lead.js`** solo exporta `POST`; `GET /api/lead` devuelve 404 (Astro). No es
  indexable en la práctica. `robots.txt` no tiene `Disallow: /api/`; añadirlo es gratis y evita
  que Googlebot gaste peticiones en 404.
- **Chatbot Conversia** (`Layout.astro:88-97`). Diagnóstico: el `<script is:inline
  src="https://conversia.com.mx/assets/js/chatbot.js">` va **sin `async`/`defer`**, así que
  bloquea el parser, pero está al **final del `<body>`**, después de todo el contenido, por lo
  que **no retrasa el LCP de forma directa**. Coste medido: 38,8 KB (6,9 KB gzip), caché 1 h;
  luego carga `https://chatbot.futurite.mobi/assets/js/build/app-build2.js` (responde 302 a un
  script mayor con `no-store`) y un `mp3`. El `CHATKODEX.init` inmediato depende de que el
  script sincrónico ya haya cargado; si se pone `defer` hay que mover el `init` a un listener de
  `load`. Lo que **sí** pesa en LCP está justo antes en el mismo archivo: dos CSS externos
  bloqueantes en `<head>` (Google Fonts con 2 familias y 13 pesos, Swiper desde jsdelivr) y
  cuatro scripts sincrónicos (GSAP, ScrollTrigger, Lenis desde unpkg, Swiper) para toda página,
  la necesite o no. Si se ataca LCP, ese es el orden de prioridad; el chatbot es lo último.

## 10. Entregables

### 10.1 Cambio de configuración: `vercel.json`

Reemplaza el anterior. 63 reglas, todas `permanent: true` (308). Validación estática:

```bash
node scripts/validar-redirects.mjs
```

### 10.2 Archivos a eliminar (propuesta; no se borraron en esta rama)

| Archivo | Justificación |
|---|---|
| `src/pages/tienda/[slug].astro` | Código muerto: `/tienda/:slug` lo captura `vercel.json` antes de llegar a la función. El nuevo `vercel.json` cubre lo único que el shim hacía mejor (los 2 `legacy_slug`). Mantenerlo da falsa sensación de que «la ruta existe». |
| `src/pages/categoria-producto/[...slug].astro` | Ídem: las 5 categorías y 13 marcas están explícitas en `vercel.json`; el comodín final hace el `/partes-y-filtros` de respaldo. |
| `temp.txt`, `temp2.txt` | Fragmentos HTML de trabajo (tabs y tarjetas) en la raíz del repo, sin referencia desde ningún archivo. Ruido. |
| `public/img/backup-soluciones/**` (6 carpetas) | Nombre y ubicación indican respaldo de imágenes; ningún JSON ni `.astro` lo referencia (`grep -r backup-soluciones src` vacío). Confirmar antes de borrar por si el admin apunta ahí. |

No hay nada que borrar en `public/` por la Tarea 3: no existe volcado legacy.

### 10.3 Cambios de código recomendados (no aplicados: fuera del alcance «solo redirects»)

1. **Ficha con `legacy_slug`** — `src/pages/partes-y-filtros/[slug].astro`, tras `const producto = ficha.data`:
   ```js
   if (producto.slug !== slug) {
       return Astro.redirect(`/partes-y-filtros/${producto.slug}`, 301)
   }
   ```
   Cierra el duplicado para cualquier `legacy_slug` presente o futuro.
2. **`noindex` en `/gracias`** — `Layout.astro`: nueva prop `noindex?: boolean` que emita
   `<meta name="robots" content="noindex, nofollow" />`; en `gracias.astro`,
   `<Layout title="Gracias - Anaerobia" noindex>`.
3. **Sitemap** — quitar los dos bucles de `?categoria=`, añadir `/casos-de-estudio/{slug}`
   (`getUltimosCasos()` ya existe en `lib/casos-de-estudio.js`), y acotar los `while` con
   `meta.paginas` (§5.3).
4. **`robots.txt`** — añadir `Disallow: /api/` y `Disallow: /gracias`.
5. **Ficha inexistente** — `Astro.redirect('/partes-y-filtros', 404)` devuelve 404 con `Location`
   y cuerpo vacío (Astro no valida el estado: `render-context.js:321`). Mejor
   `return new Response(null, { status: 404 })` y dejar que Astro renderice `404.astro` (que
   tampoco existe hoy: el 404 actual es la página por defecto de Astro).

### 10.4 Validación contra el deploy preview

Script con los 63 casos (49 del brief + `legacy_slug` + URLs del contenido + barra final):

```bash
scripts/validar-redirects.sh https://<deploy-preview>.vercel.app
```

Lo esperado por línea: `OK 308 1h /url-vieja/ -> /destino (200)`. Las tres rutas vivas deben salir
`OK 200 0h`. Si el preview tiene Deployment Protection, exportar `VERCEL_BYPASS` con el secreto
«Protection Bypass for Automation». Ejecutado hoy contra producción (estado anterior al cambio):
**58 XX / 5 OK**, por los 2 saltos, la colisión de `pintura-electrostatica`, el duplicado
`216-505` y los 404 de las URLs del contenido.

Comandos sueltos para revisar a mano los casos críticos:

```bash
# Colisión corregida: producto vivo, debe dar 200 sin Location
curl -sI https://<preview>/partes-y-filtros/pintura-electrostatica | grep -iE '^HTTP|^location'

# Un solo salto desde la URL con barra (antes: 2)
curl -sI https://<preview>/tienda/filtro-fibra-de-vidrio-en-rollo-verde/ | grep -iE '^HTTP|^location'

# legacy_slug al slug nuevo
curl -sI https://<preview>/tienda/216-505/ | grep -iE '^HTTP|^location'
curl -sI https://<preview>/partes-y-filtros/216-505 | grep -iE '^HTTP|^location'

# Marca bajo cualquier padre
curl -sI https://<preview>/categoria-producto/filtros/andreae/ | grep -iE '^HTTP|^location'

# Barra final en ruta nueva: 1 salto, y la raíz no debe redirigir
curl -sI https://<preview>/soluciones/conveyors/ | grep -iE '^HTTP|^location'
curl -sI https://<preview>/ | grep -iE '^HTTP|^location'

# Cadena completa con conteo de saltos
curl -sL -o /dev/null -w 'saltos=%{num_redirects} final=%{http_code} %{url_effective}\n' \
  https://<preview>/cabinas-de-pintura/
```
