import re

with open("src/pages/soluciones/pintura-liquida.astro", "r") as f:
    content = f.read()

# Change text-brand-blue to text-brand-lime for the "Ingeniería y Tecnología" supratítulo
content = content.replace(
    'class="text-brand-blue font-bold text-xs uppercase tracking-widest block mb-2"',
    'class="text-brand-lime font-bold text-xs uppercase tracking-widest block mb-2"'
)

# Change mb-4 to mb-2 for the other supratítulos
content = content.replace(
    'class="text-brand-lime font-bold tracking-widest text-xs mb-4 uppercase inline-block"',
    'class="text-brand-lime font-bold tracking-widest text-xs mb-2 uppercase inline-block"'
)

content = content.replace(
    'class="text-brand-lime font-bold tracking-widest text-xs mb-4 uppercase inline-block bg-brand-lime/10 px-4 py-1.5 rounded-full"',
    'class="text-brand-lime font-bold tracking-widest text-xs mb-2 uppercase inline-block bg-brand-lime/10 px-4 py-1.5 rounded-full"'
)

with open("src/pages/soluciones/pintura-liquida.astro", "w") as f:
    f.write(content)

print("Done")
