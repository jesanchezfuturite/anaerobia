import re

with open("src/pages/soluciones/pintura-liquida.astro", "r") as f:
    content = f.read()

# Pattern to find the cards in Ventajas Competitivas
# They all start with <div class="space-y-4"> inside the cards.
# Wait, let's just find the `diferenciadores-grid` section and replace inside it.

start_idx = content.find('class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 diferenciadores-grid"')
end_idx = content.find('id="datos-tecnicos"', start_idx)

section_content = content[start_idx:end_idx]

# I need to replace:
# <div class="space-y-4">
#   <div class="w-12 h-12 rounded bg-... text-... flex items-center justify-center">
#     <svg>...</svg>
#   </div>
#   <h3 class="...">Title</h3>
#   <p class="...">...</p>
# </div>

# with:
# <div class="space-y-4">
#   <div class="flex items-center gap-4">
#     <div class="w-10 h-10 shrink-0 rounded bg-brand-lime/10 text-brand-lime flex items-center justify-center">
#       <svg>...</svg>
#     </div>
#     <h3 class="...">Title</h3>
#   </div>
#   <p class="...">...</p>
# </div>

pattern = re.compile(
    r'<div class="space-y-4">\s*'
    r'<div\s+class="w-12 h-12 rounded [^"]+"\s*>\s*'
    r'(<svg.*?</svg>)\s*'
    r'</div>\s*'
    r'<h3\s+class="([^"]+)"\s*>\s*'
    r'(.*?)\s*'
    r'</h3>',
    re.DOTALL
)

def repl(match):
    svg = match.group(1)
    h3_class = match.group(2)
    h3_text = match.group(3)
    
    # modify h3_class to have leading-tight so it fits better next to the icon
    if "leading-tight" not in h3_class:
        h3_class = h3_class + " leading-tight"
        
    return f"""<div class="space-y-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 shrink-0 rounded bg-brand-lime/10 text-brand-lime flex items-center justify-center">
                  {svg}
                </div>
                <h3 class="{h3_class}">
                  {h3_text}
                </h3>
              </div>"""

new_section_content = pattern.sub(repl, section_content)

new_content = content[:start_idx] + new_section_content + content[end_idx:]

with open("src/pages/soluciones/pintura-liquida.astro", "w") as f:
    f.write(new_content)

print("Done")
