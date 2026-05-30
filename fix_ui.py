import re

with open("src/pages/soluciones/pintura-liquida.astro", "r") as f:
    content = f.read()

# 1. Remove the green box from the Ventajas Competitivas icons
content = content.replace(
    'class="w-10 h-10 shrink-0 rounded bg-brand-lime/10 text-brand-lime flex items-center justify-center"',
    'class="text-brand-lime flex items-center justify-center shrink-0"'
)

# 2. Change text-sm to text-xs in the eyebrow titles
content = content.replace(
    'tracking-widest text-sm mb-4',
    'tracking-widest text-xs mb-4'
)

with open("src/pages/soluciones/pintura-liquida.astro", "w") as f:
    f.write(content)

print("Done")
