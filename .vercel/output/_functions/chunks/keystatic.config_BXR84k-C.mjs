import { config, singleton, fields } from '@keystatic/core';

const keystaticConfig = config({
  storage: {
    kind: "github",
    repo: "jesanchezfuturite/anaerobia"
  },
  singletons: {
    homepage: singleton({
      label: "Página de Inicio",
      path: "src/content/homepage/index",
      format: { data: "json" },
      schema: {
        hero: fields.object({
          title: fields.text({ label: "Título Principal" }),
          subtitle: fields.text({ label: "Subtítulo", multiline: true }),
          backgroundVideo: fields.file({
            label: "Video de Fondo (MP4)",
            directory: "public/videos/hero",
            publicPath: "/videos/hero/"
          }),
          buttons: fields.array(
            fields.object({
              label: fields.text({ label: "Etiqueta del Botón" }),
              url: fields.text({ label: "Enlace (URL)" })
            }),
            { label: "Botones", itemLabel: (props) => props.fields.label.value }
          )
        }, { label: "Sección Hero" }),
        soluciones: fields.object({
          sectionTitle: fields.text({ label: "Título de la Sección" }),
          sectionSubtitle: fields.text({ label: "Subtítulo de la Sección", multiline: true }),
          cards: fields.array(
            fields.object({
              title: fields.text({ label: "Título de la Tarjeta" }),
              description: fields.text({ label: "Descripción" }),
              image: fields.image({
                label: "Imagen",
                directory: "public/images/home",
                publicPath: "/images/home/"
              })
            }),
            { label: "Tarjetas de Soluciones", itemLabel: (props) => props.fields.title.value }
          )
        }, { label: "Sección Soluciones Industriales" }),
        mantenimiento: fields.object({
          sectionTitle: fields.text({ label: "Título de la Sección" }),
          sectionSubtitle: fields.text({ label: "Subtítulo de la Sección", multiline: true }),
          cards: fields.array(
            fields.object({
              title: fields.text({ label: "Título del Servicio" }),
              description: fields.text({ label: "Descripción" }),
              icon: fields.text({ label: "Icono SVG (Opcional)" })
            }),
            { label: "Tarjetas de Mantenimiento", itemLabel: (props) => props.fields.title.value }
          )
        }, { label: "Sección Mantenimiento" }),
        contacto: fields.object({
          heading: fields.text({ label: "Encabezado" }),
          description: fields.text({ label: "Descripción", multiline: true }),
          phone: fields.text({ label: "Teléfono" }),
          email: fields.text({ label: "Correo" })
        }, { label: "Sección Contacto" })
      }
    })
  }
});

export { keystaticConfig as k };
