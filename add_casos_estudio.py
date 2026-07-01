import re

with open('src/pages/proyectos.astro', 'r') as f:
    content = f.read()

# 1. Add caseStudies array to the frontmatter
case_studies_data = """
const caseStudies = [
  {
    title: "Caso de Éxito: Optimización de Línea Automotriz",
    description: "Conoce cómo ayudamos a una armadora líder a reducir sus tiempos de ciclo en un 30% implementando cabinas de pintura de última generación con control de humedad.",
    image: "/images/proyectos/galeria_industria/Automotriz2.jpg",
    category: "Automotriz",
    documentUrl: "#"
  },
  {
    title: "Eficiencia Energética en Hornos de Curado",
    description: "Descubre los ahorros energéticos logrados en la industria metalmecánica tras la actualización de hornos convencionales a sistemas infrarrojos catalíticos.",
    image: "/images/proyectos/galeria_industria/Metalmecanica.jpg",
    category: "Industrial",
    documentUrl: "#"
  },
  {
    title: "Sostenibilidad en Pintura en Polvo",
    description: "Un fabricante de electrodomésticos logró cero emisiones de VOCs y recuperó el 98% del material excedente gracias a nuestra tecnología de aplicación en polvo.",
    image: "/images/proyectos/galeria_industria/Electrodomesticos_y_muebles.jpg",
    category: "Electrodomésticos",
    documentUrl: "#"
  }
];
"""

if "const caseStudies =" not in content:
    # Insert right before the ---
    match = re.search(r'\];\n(.*?)(---)', content, re.DOTALL)
    if match:
        content = content[:match.start(2)] + case_studies_data + "\n---" + content[match.end(2):]
        print("Added caseStudies array.")
    else:
        print("Could not find frontmatter end to inject caseStudies.")

# 2. Add the Casos de Estudio HTML section
casos_html = """

    <!-- 03. CASOS DE ESTUDIO -->
    <section class="py-16 md:py-24 px-6 md:px-12 relative bg-gray-50">
      <div class="container mx-auto max-w-7xl">
        <h2 class="text-3xl md:text-5xl font-saira font-bold text-center text-brand-navy mb-12 uppercase">
          Casos de Estudio
        </h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((caso) => (
            <div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2 group border border-gray-100">
              <!-- Top Image -->
              <div class="relative h-64 overflow-hidden">
                <img 
                  src={caso.image} 
                  alt={caso.title} 
                  loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span class="absolute top-4 right-4 bg-brand-navy/80 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full backdrop-blur-sm">
                  {caso.category}
                </span>
              </div>
              
              <!-- Content -->
              <div class="p-8 flex flex-col flex-grow">
                <h3 class="text-xl md:text-2xl font-saira font-bold text-brand-navy mb-4 leading-tight">
                  {caso.title}
                </h3>
                <p class="text-gray-600 mb-8 font-light flex-grow leading-relaxed">
                  {caso.description}
                </p>
                
                <!-- Download Button -->
                <a 
                  href={caso.documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="inline-flex items-center text-brand-lime font-bold uppercase tracking-widest text-sm hover:text-brand-navy transition-colors mt-auto group-hover:underline decoration-2 underline-offset-4"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Descargar Documento
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

"""

if "<!-- 03. CASOS DE ESTUDIO -->" not in content:
    # Insert right before CTA
    content = content.replace("<!-- 03. CTA BOTTOM -->", casos_html + "    <!-- 04. CTA BOTTOM -->")
    print("Injected Casos de Estudio HTML.")

with open('src/pages/proyectos.astro', 'w') as f:
    f.write(content)

print("Done updating proyectos.astro.")
