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
        image: z.string().optional().nullable()
      }))
    }),
    mantenimiento: z.object({
      sectionTitle: z.string(),
      sectionSubtitle: z.string(),
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
    })
  })
});

export const collections = {
  homepage
};
