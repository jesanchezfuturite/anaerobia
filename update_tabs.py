import re

with open("src/pages/soluciones/pintura-liquida.astro", "r") as f:
    content = f.read()

# 1. Replace the HTML
old_html = """        <!-- Tabs Navigation -->
        <div
          class="flex flex-wrap justify-center gap-4 mb-16"
          id="tech-tabs-nav"
        >
          <button
            class="tech-tab-btn active px-6 py-4 rounded-xl border border-brand-navy bg-brand-navy text-white shadow-lg transition-all duration-300 flex items-center gap-3 cursor-pointer select-none font-saira font-semibold italic text-lg uppercase tracking-wider"
            data-tab="tab-pretratamiento"
          >
            <span
              class="w-7 h-7 rounded-full bg-brand-lime text-brand-navy flex items-center justify-center text-xs font-bold font-sans not-italic"
              >01</span
            >
            Pretratamiento
          </button>
          <button
            class="tech-tab-btn px-6 py-4 rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm hover:shadow-md hover:border-brand-blue/30 transition-all duration-300 flex items-center gap-3 cursor-pointer select-none font-saira font-semibold italic text-lg uppercase tracking-wider"
            data-tab="tab-cabina"
          >
            <span
              class="w-7 h-7 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-bold font-sans not-italic"
              >02</span
            >
            Cabinas de Aplicación
          </button>
          <button
            class="tech-tab-btn px-6 py-4 rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm hover:shadow-md hover:border-brand-blue/30 transition-all duration-300 flex items-center gap-3 cursor-pointer select-none font-saira font-semibold italic text-lg uppercase tracking-wider"
            data-tab="tab-curado"
          >
            <span
              class="w-7 h-7 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-bold font-sans not-italic"
              >03</span
            >
            Curado (Hornos)
          </button>
        </div>"""

new_html = """        <!-- Tabs Navigation -->
        <div
          class="flex w-full border-b border-gray-200 mb-16 overflow-x-auto"
          id="tech-tabs-nav"
        >
          <button
            class="tech-tab-btn active flex-1 py-4 px-2 border-b-2 border-brand-lime text-brand-lime flex flex-col items-center justify-center gap-1 cursor-pointer select-none font-saira font-semibold italic text-base md:text-lg uppercase tracking-wider transition-colors min-w-[150px]"
            data-tab="tab-pretratamiento"
          >
            <span class="text-3xl font-light not-italic font-sans">01</span>
            <span>Pretratamiento</span>
          </button>
          <button
            class="tech-tab-btn flex-1 py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-brand-lime flex flex-col items-center justify-center gap-1 cursor-pointer select-none font-saira font-semibold italic text-base md:text-lg uppercase tracking-wider transition-colors min-w-[150px]"
            data-tab="tab-cabina"
          >
            <span class="text-3xl font-light not-italic font-sans">02</span>
            <span>Cabinas de Aplicación</span>
          </button>
          <button
            class="tech-tab-btn flex-1 py-4 px-2 border-b-2 border-transparent text-gray-400 hover:text-brand-lime flex flex-col items-center justify-center gap-1 cursor-pointer select-none font-saira font-semibold italic text-base md:text-lg uppercase tracking-wider transition-colors min-w-[150px]"
            data-tab="tab-curado"
          >
            <span class="text-3xl font-light not-italic font-sans">03</span>
            <span>Curado (Hornos)</span>
          </button>
        </div>"""

content = content.replace(old_html, new_html)

# 2. Replace the JS
old_js = """          tabBtns.forEach((b) => {
            b.classList.remove(
              "active",
              "bg-brand-navy",
              "border-brand-navy",
              "text-white",
              "shadow-lg",
            );
            b.classList.add(
              "bg-white",
              "text-gray-500",
              "border-gray-200",
              "shadow-sm",
            );
            const span = b.querySelector("span");
            if (span) {
              span.classList.remove("bg-brand-lime", "text-brand-navy");
              span.classList.add("bg-brand-blue/10", "text-brand-blue");
            }
          });

          btn.classList.add(
            "active",
            "bg-brand-navy",
            "border-brand-navy",
            "text-white",
            "shadow-lg",
          );
          btn.classList.remove(
            "bg-white",
            "text-gray-500",
            "border-gray-200",
            "shadow-sm",
          );
          const activeSpan = btn.querySelector("span");
          if (activeSpan) {
            activeSpan.classList.add("bg-brand-lime", "text-brand-navy");
            activeSpan.classList.remove("bg-brand-blue/10", "text-brand-blue");
          }"""

new_js = """          tabBtns.forEach((b) => {
            b.classList.remove(
              "active",
              "border-brand-lime",
              "text-brand-lime"
            );
            b.classList.add(
              "border-transparent",
              "text-gray-400"
            );
          });

          btn.classList.add(
            "active",
            "border-brand-lime",
            "text-brand-lime"
          );
          btn.classList.remove(
            "border-transparent",
            "text-gray-400"
          );"""

content = content.replace(old_js, new_js)

with open("src/pages/soluciones/pintura-liquida.astro", "w") as f:
    f.write(content)

print("Done")
