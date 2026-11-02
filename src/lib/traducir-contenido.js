/** Reemplaza textos exactos dentro de un árbol de contenido sin tocar medios, SVG ni estructura. */
export function traducirContenido(valor, traducciones) {
  if (typeof valor === 'string') return traducciones[valor] ?? valor
  if (Array.isArray(valor)) return valor.map((item) => traducirContenido(item, traducciones))
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([clave, item]) => [clave, traducirContenido(item, traducciones)]))
  }
  return valor
}
