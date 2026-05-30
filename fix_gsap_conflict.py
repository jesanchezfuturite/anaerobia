import re

with open("src/pages/soluciones/pintura-liquida.astro", "r") as f:
    content = f.read()

# Replace the conflicting transform transition with a safe shadow transition
content = content.replace(
    'class="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-transform duration-300 group flex flex-col justify-between"',
    'class="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] group flex flex-col justify-between"'
)

with open("src/pages/soluciones/pintura-liquida.astro", "w") as f:
    f.write(content)

print("Done")
