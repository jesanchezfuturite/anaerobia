# Anaerobia - Plataforma B2B Industrial Web

Bienvenido al repositorio de la nueva plataforma web de **Anaerobia**, especializada en Ingeniería Inteligente en Sistemas de Pintura y Acabado. Este proyecto ha sido desarrollado utilizando **Astro**, **Tailwind CSS**, y animaciones avanzadas mediante **GSAP** y **Lenis**.

## 🚀 Tecnologías Principales
- **Astro**: Generador de sitios estáticos ultrarrápido ideal para contenido corporativo y SEO.
- **Tailwind CSS**: Framework de CSS para diseño utilitario y responsivo.
- **GSAP**: Línea de tiempo y animaciones por Scroll (ScrollTrigger).
- **Lenis**: Sistema avanzado de Smooth Scrolling.
- **Swiper.js**: Carruseles interactivos.

---

## 🛠️ Resumen de Implementación (Día de Hoy)
Ha sido una sesión productiva enfocada en elevar la estética industrial de la marca a estándares *Premium*:

1. **Reestructuración del Bento Grid (Soluciones Industriales):**
   - Transición de un diseño irregular a una **cuadrícula estrictamente simétrica** (2 filas de 3 columnas en escritorio).
   - Estandarización de las tarjetas: dimensiones coherentes, overlay degradado constante y efectos de revelado al *hover* para garantizar equilibrio visual en toda la sección de productos.
   - Inclusión formal de la categoría de requerimientos críticos: **"Partes y Filtros"**.

2. **Perfeccionamiento del Menú Principal & Footer:**
   - Supresión de botones enmarcados para adoptar un minimalismo de alta jerarquía tipográfica.
   - Estandarización institucional de los enlaces de navegación (`NOSOTROS`, `PRODUCTOS`, `GALERÍA`, `BLOG`, `CONTACTO`, `PARTES Y FILTROS`).

3. **Sección Premium de Contacto B2B (Glassmorphism):**
   - Eliminación del bloque genérico en el pie de página ("Agendar asesoría").
   - Integración de una macro-zona de conversión dividida a dos columnas superpuesta a un recurso de *parallax industrial*.
   - Implementación de un formulario detallado diseñado para segmentación de ingeniería (Empresa, Requerimiento Técnico y Datos Corporativos) utilizando un estilo opalescente elegante.

4. **Automatización del Cinturón de Marcas (Marquee Carousel):**
   - Refactorización de la lógica del componente *Swiper* enfocado en aliados globales.
   - Creación de un sistema de retroalimentación inteligente (*Fallback*), donde los logotipos renderizadas son archivos físicos leídos desde `public/img/logos/*.png`. Si un logotipo en imagen no es encontrado temporalmente, el módulo inyecta automáticamente el estilo de texto sin romper el diseño de página.

5. **Resolución Tipográfica B2B:**
   - Adopción absoluta del *Case Uppercase* (Mayúsculas) para todos los titulares principales (`h1`-`h6`) empleando la fuente institucional **Saira**.

---

## 📂 Estructura de Assets Clave
- Las imágenes de portadas y contenido dinámico residirán en el CMS remoto o `/public/images`.
- **Logotipos de Partners:** `/public/img/logos/`
  - Debe subirse una imagen PNG por cada partner (ej. `fanuc.png`, `graco.png`) para activarse en el carrusel de inmediato.
- **Video Principal:** `/public/videos/home.mp4`

## 📦 Desarrollo y Despliegue Local

```bash
# Instalar dependencias
npm install o pnpm install

# Iniciar servidor local
npm run dev
```

El proyecto está diseñado sobre infraestructura sin servidor (*Serverless*), lo cual significa que se encuentra plenamente optimizado y **listo para su despliegue mediante Vercel**.
