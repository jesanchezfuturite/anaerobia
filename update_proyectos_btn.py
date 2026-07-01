import re

with open('src/pages/proyectos.astro', 'r') as f:
    content = f.read()

# 1. Update the documentUrl and add isPageLink: true to the first case study
content = content.replace(
    'documentUrl: "/images/proyectos/casos_de_estudio/ejemplo_caso_estudio.pdf"',
    'documentUrl: "/casos-de-estudio/ingenieria-alta-precision",\n    isPageLink: true'
)

# 2. Update the button rendering logic
button_html_original = """                <!-- Download Button -->
                <a 
                  href={caso.documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="inline-flex items-center text-brand-lime font-bold uppercase tracking-widest text-sm hover:text-brand-navy transition-colors mt-auto group-hover:underline decoration-2 underline-offset-4"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  Descargar Documento
                </a>"""

button_html_new = """                <!-- Link/Download Button -->
                {caso.isPageLink ? (
                  <a 
                    href={caso.documentUrl} 
                    class="inline-flex items-center text-brand-lime font-bold uppercase tracking-widest text-sm hover:text-brand-navy transition-colors mt-auto group-hover:underline decoration-2 underline-offset-4"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    Leer más
                  </a>
                ) : (
                  <a 
                    href={caso.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="inline-flex items-center text-brand-lime font-bold uppercase tracking-widest text-sm hover:text-brand-navy transition-colors mt-auto group-hover:underline decoration-2 underline-offset-4"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Descargar Documento
                  </a>
                )}"""

content = content.replace(button_html_original, button_html_new)

with open('src/pages/proyectos.astro', 'w') as f:
    f.write(content)

print("Updated button in proyectos.astro")
