import sys

astro_file = "src/pages/soluciones/pintura-liquida.astro"
temp_file = "temp2.txt"

with open(astro_file, "r") as f:
    astro_content = f.read()

with open(temp_file, "r") as f:
    temp_content = f.read()

# Find the start of the pain-points-grid
start_index = astro_content.find('<div class="grid grid-cols-1 md:grid-cols-3 gap-8 pain-points-grid">')

if start_index == -1:
    print("Could not find the target grid div!")
    sys.exit(1)

# Keep the header and everything before
new_content = astro_content[:start_index]

# Add the wrapper
wrapper = """        <div class="flex flex-col lg:flex-row gap-8 lg:h-[600px] w-full max-w-7xl mx-auto pain-points-grid items-stretch">
          <!-- Column 1: Image (40%) -->
          <div class="w-full lg:w-[40%] rounded-3xl overflow-hidden relative shadow-lg h-64 lg:h-full shrink-0 group">
             <img src="/images/soluciones/pintura_liquida_2.webp" alt="Puntos de Inflexión" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
             <div class="absolute inset-0 bg-brand-navy/30 mix-blend-multiply"></div>
          </div>
          
          <!-- Column 2: Cards (25%) -->
          <div class="w-full lg:w-[25%] flex flex-col justify-between gap-4 shrink-0 h-full">
"""

new_content += wrapper
new_content += temp_content

with open(astro_file, "w") as f:
    f.write(new_content)

print("Successfully merged temp2.txt into pintura-liquida.astro!")
