# Contexto de Desarrollo y Arquitectura (Anaerobia Web)

> [!IMPORTANT]
> **Para Agentes IA y Desarrolladores:** Antes de proponer modificaciones de código, crear nuevas secciones o alterar configuraciones de Astro/Vercel, debes leer obligatoriamente este documento. Define los estándares, soluciones arquitectónicas y reglas inquebrantables del proyecto.
> La arquitectura completa del sistema (sitio + admin) está en `ARQUITECTURA.md`.

## 1. Stack Tecnológico Base
- **Framework:** Astro 6.1 (`output: 'static'` con páginas en SSR mediante `export const prerender = false`).
- **Adaptador:** `@astrojs/vercel` (empaqueta las rutas SSR como funciones serverless).
- **UI & Estilos:** Tailwind CSS v4, GSAP (Animaciones), Lenis (Smooth Scroll).
- **Administrador de contenido:** proyecto Laravel + Filament independiente
  (repositorio `anaerobia-admin`), consumido por API REST.

## 2. Arquitectura de contenido (Admin Laravel)
Todo el contenido editable (páginas de soluciones, inicio y menú) vive en el admin y se
consulta por API en cada visita. Keystatic fue retirado: ya no hay colecciones de contenido
en el sitio (`src/content.config.ts` y `src/content/` no existen).

### Patrón obligatorio en las páginas administrables
```astro
---
export const prerender = false

import fallback from '../data/<pagina>.json'

const API_URL = import.meta.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'
let d = fallback
try {
    const res = await fetch(`${API_URL}/api/v1/soluciones/<slug>`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) d = (await res.json()).data
} catch {
    // API no disponible: la página se sirve con el contenido de respaldo
}
---
```

Reglas:
- **Siempre** debe existir el respaldo en `src/data/` y usarse si la API falla: el sitio nunca
  puede depender de que el admin esté disponible.
- Solo textos, imágenes y videos son datos. Iconos SVG, clases Tailwind, alturas, animaciones
  GSAP y tablas técnicas permanecen en el código.
- Al agregar campos nuevos hay que actualizar el seeder del admin **y** el respaldo local.

## 4. Estilos y Estética (Reglas Inquebrantables)
- **Modificación de Clases Tailwind:** No elimines ni alteres las clases de diseño complejas (como `mix-blend-luminosity`, transparencias, *glassmorphism* o `background-clip`). Todo el mapeo de datos debe inyectarse en los contenedores existentes.
- **Tipografía Institucional:** Los encabezados principales (`h1`-`h6`) deben mantenerse en mayúsculas estrictamente.
- **Animaciones GSAP:** Cualquier sección nueva que agregues debe incorporar las clases `gsap-fade`, `gsap-slide` o equivalentes, y ser registrada en los selectores del script de animaciones ubicado al final de `Layout.astro` o `index.astro`.

## 5. Reglas de Despliegue en Vercel
- **El directorio `.vercel`:** Jamás debe ser rastreado por Git. Debe permanecer en el `.gitignore`. Si se sube al repositorio, Vercel asumirá que el proyecto es "Prebuilt" (Build Output API) e intentará desplegar el caché local roto.
- **Adapter de Vercel:** Se usa `adapter: vercel()` en `astro.config.mjs` bajo `output: 'static'`. Vercel empaqueta automáticamente las páginas con `prerender = false` en *Serverless Functions*. No incluyas paquetes como `@astrojs/node` que puedan generar conflictos.
- **Variable de entorno:** `ADMIN_API_URL` debe apuntar a la URL pública del admin Laravel. El admin se despliega aparte (no en Vercel), por lo que un cambio en el admin nunca dispara un deploy del sitio.
