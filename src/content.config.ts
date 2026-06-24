import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const homepage = defineCollection({
  loader: glob({ pattern: 'index.json', base: './src/content/homepage' }),
  schema: z.object({
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
      backgroundVideo: z.string().nullable().optional(),
      buttons: z.array(z.object({
        label: z.string(),
        url: z.string()
      }))
    }),
    soluciones: z.object({
      sectionTitle: z.string(),
      sectionSubtitle: z.string(),
      cards: z.array(z.object({
        title: z.string(),
        description: z.string(),
        image: z.string().optional().nullable(),
        url: z.string().optional().nullable()
      }))
    }),
    mantenimiento: z.object({
      sectionTitle: z.string(),
      sectionSubtitle: z.string(),
      backgroundVideo: z.string().optional().nullable(),
      cards: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional().nullable()
      }))
    }),
    contacto: z.object({
      heading: z.string(),
      description: z.string(),
      phone: z.string(),
      email: z.string()
    }),
    gestion360: z.object({
      sectionTitle: z.string(),
      sectionSubtitle: z.string(),
      steps: z.array(z.string())
    }),
    industrias: z.object({
      sectionTitle: z.string(),
      sectionSubtitle: z.string(),
      items: z.array(z.object({
        name: z.string(),
        icon: z.string().optional().nullable()
      }))
    }),
    normativas: z.object({
      sectionTitle: z.string(),
      certificados: z.array(z.object({
        name: z.string(),
        logo: z.string().optional().nullable()
      })).optional()
    }),
    mapa: z.object({
      sectionTitle: z.string(),
      mapImage: z.string().optional().nullable(),
      cards: z.array(z.object({
        title: z.string(),
        description: z.string()
      })).optional()
    })
  })
});

const navigation = defineCollection({
  loader: glob({ pattern: 'index.json', base: './src/content/navigation' }),
  schema: z.object({
    links: z.array(
      z.object({
        label: z.string(),
        url: z.string(),
        hasSubmenu: z.boolean().optional(),
        submenu: z.array(
          z.object({
            label: z.string(),
            url: z.string()
          })
        ).optional()
      })
    )
  })
});

export const collections = {
  homepage,
  navigation
};
