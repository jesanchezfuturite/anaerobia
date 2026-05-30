import re

with open("src/pages/soluciones/pintura-liquida.astro", "r") as f:
    content = f.read()

# Since the block is large, let's use regex or string replace from <!-- Panel 2: Cabina --> to <!-- Panel 3: Curado -->
start_marker = '<!-- Panel 2: Cabina -->'
end_marker = '<!-- Panel 3: Curado -->'
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    old_block = content[start_idx:end_idx]
    
    new_block = """<!-- Panel 2: Cabina -->
          <div
            id="tab-cabina"
            class="tech-tab-panel hidden transition-all duration-500 opacity-0 transform translate-y-4"
          >
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <!-- Left Column: Image -->
              <div class="w-full relative rounded-3xl overflow-hidden shadow-2xl h-[300px] md:h-[400px] lg:h-full lg:min-h-[550px]">
                <img src="/images/soluciones/cabina-aplicacion.webp" alt="Cabina de Aplicación Industrial" class="w-full h-full object-cover absolute inset-0" />
                <div class="absolute inset-0 bg-brand-navy/10 mix-blend-multiply"></div>
              </div>

              <!-- Right Column: Content -->
              <div class="flex flex-col pb-8">
                <div class="mb-10 text-center lg:text-left">
                  <h3
                    class="font-saira font-semibold italic text-brand-navy text-3xl md:text-4xl uppercase mb-4"
                  >
                    Especificaciones de Cabinas
                  </h3>
                  <p class="text-base text-gray-600 font-light leading-relaxed">
                    La cabina proporciona un espacio de confinamiento controlado y
                    seguro para la aplicación de pintura, asegurando la calidad
                    del acabado Clase A mediante:
                  </p>
                </div>

                <ul class="space-y-6 text-gray-600 font-light text-base lg:text-lg pl-2 lg:pl-0">
                  <li class="flex items-center gap-4">
                    <svg class="w-7 h-7 text-brand-lime shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span class="font-saira font-semibold text-brand-navy uppercase italic tracking-wide">Ventilación Controlada</span>
                  </li>
                  <li class="flex items-center gap-4">
                    <svg class="w-7 h-7 text-brand-lime shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span class="font-saira font-semibold text-brand-navy uppercase italic tracking-wide">Filtros de Aire</span>
                  </li>
                  <li class="flex items-center gap-4">
                    <svg class="w-7 h-7 text-brand-lime shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span class="font-saira font-semibold text-brand-navy uppercase italic tracking-wide">Iluminación Específica</span>
                  </li>
                  <li class="flex items-center gap-4">
                    <svg class="w-7 h-7 text-brand-lime shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span class="font-saira font-semibold text-brand-navy uppercase italic tracking-wide">Paredes y Pisos Resistentes</span>
                  </li>
                  <li class="flex items-center gap-4">
                    <svg class="w-7 h-7 text-brand-lime shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span class="font-saira font-semibold text-brand-navy uppercase italic tracking-wide">Puertas Herméticas</span>
                  </li>
                  <li class="flex items-center gap-4">
                    <svg class="w-7 h-7 text-brand-lime shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span class="font-saira font-semibold text-brand-navy uppercase italic tracking-wide">Protección Personal</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          """
    
    content = content[:start_idx] + new_block + content[end_idx:]
    
    with open("src/pages/soluciones/pintura-liquida.astro", "w") as f:
        f.write(content)
    print("Successfully replaced content for Tab 2.")
else:
    print("Could not find the markers.")

