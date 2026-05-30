import re

with open("src/pages/soluciones/pintura-liquida.astro", "r") as f:
    content = f.read()

start_marker = '<!-- Panel 3: Curado -->'
end_marker = '<!-- 08. RESULTADOS Y VENTAJAS -->'
start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_block = """<!-- Panel 3: Curado -->
          <div
            id="tab-curado"
            class="tech-tab-panel hidden transition-all duration-500 opacity-0 transform translate-y-4"
          >
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <!-- Left Column: Image -->
              <div class="w-full relative rounded-3xl overflow-hidden shadow-2xl h-[300px] md:h-[400px] lg:h-full lg:min-h-[450px]">
                <img src="/images/soluciones/curado-horno.webp" alt="Horno de Curado Industrial" class="w-full h-full object-cover absolute inset-0" />
                <div class="absolute inset-0 bg-brand-navy/10 mix-blend-multiply"></div>
              </div>

              <!-- Right Column: Content -->
              <div class="flex flex-col pb-8">
                <div class="mb-6 text-center lg:text-left">
                  <h3 class="font-saira font-semibold italic text-brand-navy text-3xl md:text-4xl uppercase mb-6">
                    Curado de la Capa de Pintura (Horno vs Secado Natural)
                  </h3>
                  <p class="text-base text-gray-600 font-light leading-relaxed">
                    Es posible secar piezas de pintura líquida al aire libre, pero
                    dependerá de factores climáticos (humedad y temperatura) que
                    añaden variabilidad e incrementan el tiempo de ciclo. El
                    curado con un <strong class="font-semibold text-brand-navy">horno especializado</strong> asegura que la capa de
                    pintura alcance rápidamente la polimerización exacta,
                    garantizando las propiedades mecánicas y químicas de
                    resistencia, durabilidad y adherencia certificadas por el
                    fabricante.
                  </p>
                </div>

                <div class="p-6 bg-brand-lime/10 border-l-4 border-brand-lime text-brand-navy rounded-r-xl space-y-3 shadow-sm mt-4">
                  <h4 class="font-saira font-bold text-lg uppercase tracking-wider flex items-center gap-2">
                    <svg class="w-6 h-6 text-brand-lime shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    Nota técnica importante
                  </h4>
                  <p class="text-sm font-medium leading-relaxed pl-8">
                    Siga estrictamente las recomendaciones del fabricante de la
                    pintura en cuanto a la rampa de temperatura y el tiempo de
                    residencia para un curado impecable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    """
    
    content = content[:start_idx] + new_block + content[end_idx:]
    
    with open("src/pages/soluciones/pintura-liquida.astro", "w") as f:
        f.write(content)
    print("Successfully replaced content for Tab 3.")
else:
    print("Could not find the markers.")
