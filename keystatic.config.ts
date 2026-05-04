import { config, fields, singleton } from '@keystatic/core';

export default config({
  storage: import.meta.env.DEV 
    ? { kind: 'local' } 
    : { 
        kind: 'github', 
        repo: 'jesanchezfuturite/anaerobia' 
      },
  singletons: {
    homepage: singleton({
      label: 'Página de Inicio',
      path: 'src/content/homepage/index',
      format: { data: 'json' },
      schema: {
        hero: fields.object({
          title: fields.text({ label: 'Título Principal' }),
          subtitle: fields.text({ label: 'Subtítulo', multiline: true }),
          backgroundVideo: fields.file({
            label: 'Video de Fondo (MP4)',
            directory: 'public/videos/hero',
            publicPath: '/videos/hero/',
          }),
          buttons: fields.array(
            fields.object({
              label: fields.text({ label: 'Etiqueta del Botón' }),
              url: fields.text({ label: 'Enlace (URL)' }),
            }),
            { label: 'Botones', itemLabel: props => props.fields.label.value }
          ),
        }, { label: 'Sección Hero' }),
        
        soluciones: fields.object({
          sectionTitle: fields.text({ label: 'Título de la Sección' }),
          sectionSubtitle: fields.text({ label: 'Subtítulo de la Sección', multiline: true }),
          cards: fields.array(
            fields.object({
              title: fields.text({ label: 'Título de la Tarjeta' }),
              description: fields.text({ label: 'Descripción' }),
              image: fields.image({
                label: 'Imagen',
                directory: 'public/images/home',
                publicPath: '/images/home/',
              }),
            }),
            { label: 'Tarjetas de Soluciones', itemLabel: props => props.fields.title.value }
          ),
        }, { label: 'Sección Soluciones Industriales' }),

        mantenimiento: fields.object({
          sectionTitle: fields.text({ label: 'Título de la Sección' }),
          sectionSubtitle: fields.text({ label: 'Subtítulo de la Sección', multiline: true }),
          backgroundVideo: fields.file({
            label: 'Video de Fondo (MP4)',
            directory: 'public/videos',
            publicPath: '/videos/',
          }),
          cards: fields.array(
            fields.object({
              title: fields.text({ label: 'Título del Servicio' }),
              description: fields.text({ label: 'Descripción' }),
              icon: fields.text({ label: 'Icono SVG (Opcional)' }),
            }),
            { label: 'Tarjetas de Mantenimiento', itemLabel: props => props.fields.title.value }
          ),
        }, { label: 'Sección Mantenimiento' }),

        gestion360: fields.object({
          sectionTitle: fields.text({ label: 'Título de la Sección' }),
          sectionSubtitle: fields.text({ label: 'Subtítulo de la Sección' }),
          steps: fields.array(fields.text({ label: 'Etapa' }), {
            label: 'Etapas',
            itemLabel: props => props.value
          }),
        }, { label: 'Sección Gestión 360°' }),

        industrias: fields.object({
          sectionTitle: fields.text({ label: 'Título de la Sección' }),
          sectionSubtitle: fields.text({ label: 'Subtítulo de la Sección' }),
          items: fields.array(
            fields.object({
              name: fields.text({ label: 'Industria' }),
              icon: fields.text({ label: 'Icono SVG (Opcional)', multiline: true })
            }), {
            label: 'Industrias',
            itemLabel: props => props.fields.name.value
          }),
        }, { label: 'Sección Industrias' }),

        normativas: fields.object({
          sectionTitle: fields.text({ label: 'Título de la Sección' }),
          certificados: fields.array(
            fields.object({
              name: fields.text({ label: 'Nombre' }),
              logo: fields.image({
                label: 'Logo',
                directory: 'public/images/home/certificaciones',
                publicPath: '/images/home/certificaciones/',
              }),
            }),
            { label: 'Certificaciones', itemLabel: props => props.fields.name.value }
          ),
        }, { label: 'Sección Normativas' }),

        mapa: fields.object({
          sectionTitle: fields.text({ label: 'Título de la Sección' }),
          mapImage: fields.image({
            label: 'Imagen del Mapa',
            directory: 'public/images/home',
            publicPath: '/images/home/',
          }),
        }, { label: 'Sección Mapa' }),

        contacto: fields.object({
          heading: fields.text({ label: 'Encabezado' }),
          description: fields.text({ label: 'Descripción', multiline: true }),
          phone: fields.text({ label: 'Teléfono' }),
          email: fields.text({ label: 'Correo' }),
        }, { label: 'Sección Contacto' }),
      },
    }),
  },
});
