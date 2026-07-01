import re

with open('src/pages/proyectos.astro', 'r') as f:
    content = f.read()

# 1. Fix the frontmatter. We'll find everything between 'const seoDescription = ...' and '---'
frontmatter_end = content.find('---', content.find('const seoDescription'))
if frontmatter_end != -1:
    new_frontmatter = """
const industries = [
  { title: "Agricultura", image: "/images/proyectos/galeria_industria/Agricultura.jpg" },
  { title: "Automotriz", image: "/images/proyectos/galeria_industria/Automotriz.JPG" },
  { title: "Automotriz 2", image: "/images/proyectos/galeria_industria/Automotriz 2.jpg" },
  { title: "Electrodomésticos y Muebles", image: "/images/proyectos/galeria_industria/Electrodomesticos_y_muebles.jpg" },
  { title: "Energía", image: "/images/proyectos/galeria_industria/Energia.jpg" },
  { title: "Equipo Pesado", image: "/images/proyectos/galeria_industria/Equipo_Pesado.png" },
  { title: "Ferroviaria", image: "/images/proyectos/galeria_industria/Ferroviaria.jpg" },
  { title: "Industria General", image: "/images/proyectos/galeria_industria/Industria_general.jpg" },
  { title: "Metalmecánica", image: "/images/proyectos/galeria_industria/Metalmecanica.jpg" },
  { title: "Vehículos Recreacionales", image: "/images/proyectos/galeria_industria/Recreational_Vehicles.jpg" }
];
"""
    
    # We need to find where to start replacing. Let's find 'const filters =' or 'const projects =' or 'category: "polvo"'
    # Actually, it's a mess right now because the replace tool got confused. Let's just find the very top and reconstruct it.

    # Read original clean frontmatter from a fresh state if possible, but we can't easily.
    # Let's just regex out the frontmatter block.
    match = re.search(r'---\nimport Layout from "../layouts/Layout.astro";\n\nconst seoTitle = "Proyectos \| Anaerobia Surface Finishing";\nconst seoDescription = "Galería de proyectos ejecutados de sistemas de pintura y acabado, cabinas y hornos implementados por Anaerobia.";\n(.*?)---', content, re.DOTALL)
    
    if match:
        content = content[:match.start(1)] + new_frontmatter + "\n---" + content[match.end():]
        print("Replaced frontmatter successfully.")
    else:
        print("Could not find frontmatter block.")

# 2. Add the gallery HTML back.
# We will insert it right before '<!-- 03. CTA BOTTOM -->'
gallery_html = """

    <!-- 02. MASONRY GALLERY (INDUSTRIES) -->
    <section class="py-16 md:py-24 px-6 md:px-12 relative bg-white min-h-screen">
      <div class="container mx-auto">
        <h2 class="text-3xl md:text-5xl font-saira font-bold text-center text-brand-navy mb-12 uppercase">
          Proyectos por Industria
        </h2>
        
        <!-- Masonry Grid -->
        <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6" id="masonry-gallery">
          {industries.map((item) => (
            <div class="gallery-item relative group break-inside-avoid rounded-xl overflow-hidden shadow-md cursor-pointer bg-gray-100">
              <img 
                src={item.image} 
                alt={item.title} 
                loading="lazy"
                class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <!-- Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 class="text-white font-saira font-bold text-xl md:text-2xl leading-tight transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

"""

if "<!-- 02. MASONRY GALLERY" not in content:
    content = content.replace("<!-- 03. CTA BOTTOM -->", gallery_html + "    <!-- 03. CTA BOTTOM -->")
    print("Injected gallery HTML.")

with open('src/pages/proyectos.astro', 'w') as f:
    f.write(content)

print("Done updating proyectos.astro.")
