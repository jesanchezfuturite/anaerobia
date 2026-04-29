# Contexto de Desarrollo y Arquitectura (Anaerobia Web)

> [!IMPORTANT]
> **Para Agentes IA y Desarrolladores:** Antes de proponer modificaciones de código, crear nuevas secciones o alterar configuraciones de Astro/Vercel, debes leer obligatoriamente este documento. Define los estándares, soluciones arquitectónicas y reglas inquebrantables del proyecto.

## 1. Stack Tecnológico Base
- **Framework:** Astro 6.1 (con `output: 'static'`).
- **Adaptador:** `@astrojs/vercel` (Maneja SSR para el CMS de forma automática dentro del modo `static`).
- **UI & Estilos:** React 19, Tailwind CSS v4, GSAP (Animaciones), Lenis (Smooth Scroll).
- **CMS Headless:** Keystatic (`@keystatic/astro` y `@keystatic/core`).

## 2. Arquitectura del CMS (Keystatic)
El contenido de la página de inicio es 100% dinámico y se administra mediante Keystatic.

### Estructura de Almacenamiento (Storage)
En `keystatic.config.ts`, el almacenamiento está condicionado al entorno:
```typescript
storage: import.meta.env.DEV 
  ? { kind: 'local' } 
  : { kind: 'github', repo: 'jesanchezfuturite/anaerobia' }
```
- **Local (`npm run dev`):** Guarda los cambios físicamente en `src/content/homepage/index.json`.
- **Producción (Vercel):** Utiliza OAuth de GitHub. Los cambios desde la ruta `/keystatic` realizan *commits* directos al repositorio.

### Rutas de Administración
> [!WARNING]
> **No crear rutas manuales para Keystatic:**
> `@keystatic/astro` inyecta automáticamente las rutas `/keystatic` y `/api/keystatic` en modo SSR. Si intentas crear `src/pages/keystatic/[...params].astro` manualmente, Astro 6 arrojará una advertencia de "Colisión de Rutas Dinámicas".

## 3. Manejo de Colecciones y Tipado
Astro 6 utiliza la API de Loaders de contenido para hidratar los datos de Keystatic.

### Esquema y Loader (`src/content.config.ts`)
Keystatic exporta el *Singleton* como un único objeto JSON, por lo que NO podemos usar el loader estándar `file()`. Se utiliza `glob()` en su lugar:
```typescript
import { glob } from 'astro/loaders';

const homepage = defineCollection({
  loader: glob({ pattern: 'index.json', base: './src/content/homepage' }),
  schema: z.object({ ... })
});
```

### Consumo en el Frontend (`src/pages/index.astro`)
Los datos se obtienen usando `getEntry`:
```javascript
import { getEntry } from 'astro:content';
const homepage = await getEntry('homepage', 'index');
const data = homepage?.data || fallbackData;
```
Siempre debe existir un objeto `fallbackData` integrado en el frontend por si el JSON aún no ha sido hidratado o se borra por accidente.

## 4. Estilos y Estética (Reglas Inquebrantables)
- **Modificación de Clases Tailwind:** No elimines ni alteres las clases de diseño complejas (como `mix-blend-luminosity`, transparencias, *glassmorphism* o `background-clip`). Todo el mapeo de datos debe inyectarse en los contenedores existentes.
- **Tipografía Institucional:** Los encabezados principales (`h1`-`h6`) deben mantenerse en mayúsculas estrictamente.
- **Animaciones GSAP:** Cualquier sección nueva que agregues debe incorporar las clases `gsap-fade`, `gsap-slide` o equivalentes, y ser registrada en los selectores del script de animaciones ubicado al final de `Layout.astro` o `index.astro`.

## 5. Reglas de Despliegue en Vercel
- **El directorio `.vercel`:** Jamás debe ser rastreado por Git. Debe permanecer en el `.gitignore`. Si se sube al repositorio, Vercel asumirá que el proyecto es "Prebuilt" (Build Output API) e intentará desplegar el caché local roto.
- **Adapter de Vercel:** Se usa `adapter: vercel()` en `astro.config.mjs` bajo `output: 'static'`. Vercel automáticamente empaquetará las rutas SSR dinámicas de Keystatic en *Serverless Functions*. No incluyas paquetes como `@astrojs/node` que puedan generar conflictos.
