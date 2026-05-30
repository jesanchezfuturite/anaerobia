import re

with open("src/pages/soluciones/pintura-liquida.astro", "r") as f:
    content = f.read()

old_block = """            <div class="mb-10 max-w-3xl text-center md:text-left mx-auto md:mx-0">
              <h3
                class="font-saira font-semibold italic text-brand-navy text-2xl uppercase mb-4"
              >
                Pretratamiento de Superficies
              </h3>
              <p class="text-base text-gray-600 font-light leading-relaxed">
                El pretratamiento es esencial para garantizar una buena
                adherencia, durabilidad y apariencia del acabado final.
                Existen dos métodos generales que se implementan según las
                condiciones del metal:
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Quimico -->
              <div class="flex flex-col py-4">
                <div class="flex items-center gap-3 mb-6">
                  <div class="text-brand-lime flex items-center justify-center shrink-0">
                    <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h4 class="font-saira font-bold text-brand-navy text-xl uppercase italic">Pretratamiento Químico</h4>
                </div>
                <ul class="space-y-4 text-gray-600 font-light text-sm">
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span>Permite aplicar sello antioxidante protector.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span>Elimina de forma absoluta aceites, lubricantes y grasas.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span>Gran versatilidad del proceso (aspersión, inmersión).</span>
                  </li>
                </ul>
              </div>

              <!-- Mecanico -->
              <div class="flex flex-col py-4">
                <div class="flex items-center gap-3 mb-6">
                  <div class="text-brand-lime flex items-center justify-center shrink-0">
                    <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 class="font-saira font-bold text-brand-navy text-xl uppercase italic">Pretratamiento Mecánico</h4>
                </div>
                <ul class="space-y-4 text-gray-600 font-light text-sm">
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span>Permite utilizar diversos materiales abrasivos (granalla, arena).</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span>Elimina cascarilla de laminación, óxido fuerte, rebaba y recubrimientos viejos.</span>
                  </li>
                  <li class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                    <span>Permite alcanzar y controlar el perfil de anclaje (rugosidad) deseado.</span>
                  </li>
                </ul>
              </div>
            </div>"""

new_block = """            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              <!-- Left Column: Image -->
              <div class="w-full relative rounded-3xl overflow-hidden shadow-2xl h-[300px] md:h-[400px] lg:h-full lg:min-h-[550px]">
                <img src="/images/soluciones/pretratamiento.webp" alt="Pretratamiento Industrial" class="w-full h-full object-cover absolute inset-0" />
                <div class="absolute inset-0 bg-brand-navy/10 mix-blend-multiply"></div>
              </div>

              <!-- Right Column: Content -->
              <div class="flex flex-col pb-8">
                <div class="mb-10 text-center lg:text-left">
                  <h3
                    class="font-saira font-semibold italic text-brand-navy text-3xl md:text-4xl uppercase mb-4"
                  >
                    Pretratamiento de Superficies
                  </h3>
                  <p class="text-base text-gray-600 font-light leading-relaxed">
                    El pretratamiento es esencial para garantizar una buena
                    adherencia, durabilidad y apariencia del acabado final.
                    Existen dos métodos generales que se implementan según las
                    condiciones del metal:
                  </p>
                </div>

                <div class="flex flex-col gap-10">
                  <!-- Quimico -->
                  <div class="flex flex-col">
                    <div class="flex items-center gap-3 mb-4">
                      <div class="text-brand-lime flex items-center justify-center shrink-0">
                        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <h4 class="font-saira font-bold text-brand-navy text-xl uppercase italic">Pretratamiento Químico</h4>
                    </div>
                    <ul class="space-y-3 text-gray-600 font-light text-sm pl-10 lg:pl-0">
                      <li class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <span>Permite aplicar sello antioxidante protector.</span>
                      </li>
                      <li class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <span>Elimina de forma absoluta aceites, lubricantes y grasas.</span>
                      </li>
                      <li class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <span>Gran versatilidad del proceso (aspersión, inmersión).</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Mecanico -->
                  <div class="flex flex-col">
                    <div class="flex items-center gap-3 mb-4">
                      <div class="text-brand-lime flex items-center justify-center shrink-0">
                        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h4 class="font-saira font-bold text-brand-navy text-xl uppercase italic">Pretratamiento Mecánico</h4>
                    </div>
                    <ul class="space-y-3 text-gray-600 font-light text-sm pl-10 lg:pl-0">
                      <li class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <span>Permite utilizar diversos materiales abrasivos (granalla, arena).</span>
                      </li>
                      <li class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <span>Elimina cascarilla de laminación, óxido fuerte, rebaba y recubrimientos viejos.</span>
                      </li>
                      <li class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-brand-lime shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                        <span>Permite alcanzar y controlar el perfil de anclaje (rugosidad) deseado.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>"""

if old_block in content:
    content = content.replace(old_block, new_block)
    with open("src/pages/soluciones/pintura-liquida.astro", "w") as f:
        f.write(content)
    print("Successfully replaced content.")
else:
    print("Could not find the old block to replace.")
