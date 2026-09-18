#!/usr/bin/env bash
# Valida los redirects contra un deploy (preview o producción) con curl.
#
#   scripts/validar-redirects.sh https://anaerobia-git-rama-equipo.vercel.app
#   scripts/validar-redirects.sh            # usa https://anaerobia.com
#
# Para cada URL vieja muestra: código de la primera respuesta, número de saltos
# hasta el 200 final y la URL final. Lo esperado es: 308, 1 salto, destino 200.
# Las tres URLs marcadas «VIVA» son rutas reales: deben dar 200 sin saltos.
#
# Si el preview tiene Deployment Protection, exporta VERCEL_BYPASS con el
# secreto «Protection Bypass for Automation» del proyecto.
set -u
BASE="${1:-https://anaerobia.com}"
BYPASS="${VERCEL_BYPASS:+-H x-vercel-protection-bypass:${VERCEL_BYPASS}}"

probar() {
  local ruta="$1" esperado="$2"
  # primera respuesta (sin seguir)
  read -r codigo location <<<"$(curl -sS -o /dev/null -m 30 $BYPASS -w '%{http_code} %{redirect_url}' "$BASE$ruta")"
  # cadena completa
  read -r saltos final url_final <<<"$(curl -sS -o /dev/null -m 60 -L $BYPASS -w '%{num_redirects} %{http_code} %{url_effective}' "$BASE$ruta")"
  local ruta_final="${url_final#"$BASE"}"
  local estado="OK "
  if [ "$esperado" = "VIVA" ]; then
    [ "$codigo" = "200" ] || estado="XX "
  else
    { [ "$codigo" = "308" ] || [ "$codigo" = "301" ]; } && [ "$saltos" = "1" ] && [ "$final" = "200" ] && [ "$ruta_final" = "$esperado" ] || estado="XX "
  fi
  printf '%s %s %sh %s  ->  %s (%s)\n' "$estado" "$codigo" "$saltos" "$ruta" "$ruta_final" "$final"
}

echo "Base: $BASE"
echo "--- Semrush (46) + 3 de búsqueda ---"
probar /tienda/filtro-fibra-de-vidrio-en-rollo-verde/ /partes-y-filtros/filtro-fibra-de-vidrio-en-rollo-verde
probar /filtros-para-cabina-de-pintura/como-elegir-filtros-para-cabinas-de-pintura-que-cumplan-con-las-normativas-ambientales/ /soluciones/filtros
probar /tienda/filtro-fibra-de-vidrio-en-rollo-amarillo/ /partes-y-filtros/filtro-fibra-de-vidrio-en-rollo-amarillo
probar /conveyors/ /soluciones/conveyors
probar /cabinas-de-pintura-industrial/en-monterrey-todo-lo-que-debes-saber/ /soluciones/cabinas-pintura
probar /tienda/ventilador-de-tubo-de-descarga-axial-sin-motor/ /partes-y-filtros/ventilador-de-tubo-de-descarga-axial-sin-motor
probar /tienda/manometro-diferencial-de-presion-dwyer/ /partes-y-filtros/manometro-diferencial-de-presion-dwyer
probar /equipo-de-aplicacion-de-pintura/equipo-de-aplicacion-de-pintura-todo-lo-que-necesitas-saber/ /soluciones/aplicacion-recubrimientos
probar /tienda/cartucho-de-celulosa-para-recoleccion-de-polvo-y-pintura-en-polvo/ /partes-y-filtros/cartucho-de-celulosa-para-recoleccion-de-polvo-y-pintura-en-polvo
probar /blog/pintura-liquida-cuando-y-por-que-elegirla-sobre-la-pintura-en-polvo VIVA
probar /tienda/transmisor-multifuncional-kimo/ /partes-y-filtros/transmisor-multifuncional-kimo
probar /cabinas-de-pintura/ /soluciones/cabinas-pintura
probar /filtros-para-cabina-de-pintura/tipos-de-filtros-para-cabinas-de-pintura-cual-es-el-adecuado-para-tu-negocio/ /soluciones/filtros
probar /tienda/lamparas-para-cabina-de-pintura-gfs-6-tubos-led/ /partes-y-filtros/lamparas-para-cabina-de-pintura-gfs-6-tubos-led
probar /sistemas-granallado/ /soluciones/granallado
probar /filtros-para-cabina-de-pintura/guia-completa-sobre-mantenimiento-de-filtros-para-cabina-de-pintura/ /blog/cuando-debo-cambiar-los-filtros-de-mi-cabina-la-importancia-del-mantenimiento
probar /tienda/pintura-electrostatica/ /partes-y-filtros/pintura-electrostatica
probar /hornos-de-secado-y-curado/ /soluciones/hornos-secado-curado
probar /blog/conveyors-en-sistemas-de-acabado/ /blog/conveyors-en-sistemas-de-acabado
probar /sistemas-de-aplicacion-de-recubrimientos/ /soluciones/aplicacion-recubrimientos
probar /cabina-pintura/normativas-y-seguridad-en-cabinas-de-pintura/ /soluciones/cabinas-pintura
probar /hornos-de-curado-de-pintura/guia-sobre-hornos-de-curado-de-pintura/ /soluciones/hornos-secado-curado
probar /categoria-producto/refacciones/ '/partes-y-filtros?categoria=refacciones'
probar /categoria-producto/lamparas-infrarrojas/ '/partes-y-filtros?categoria=lamparas-infrarrojas'
probar /sistemas-de-pintura-industrial/sistemas-de-pintura-industrial-garantizando-calidad/ /
probar /sistemas-de-pintura-liquida/ /soluciones/pintura-liquida
probar /categoria-producto/filtros/columbus-industries/ '/partes-y-filtros?marca=columbus-industries'
probar /cabina-pintura/el-impacto-ambiental-de-las-cabinas-de-pintura/ /soluciones/cabinas-pintura
probar /hornos-de-curado-de-pintura/tecnicas-de-curado-de-pintura/ /blog/la-clave-del-acabado-perfecto-secado-y-curado-en-la-pintura-liquida
probar /cabinas-de-pintura-industrial/cabinas-de-pintura-industrial-guia/ /blog/como-elegir-tu-cabina-de-pintura
probar /conveyors-old/ /soluciones/conveyors
probar /partes-y-filtros/pintura-electrostatica VIVA
probar /partes-y-filtros/cartucho-de-celulosa-para-recoleccion-de-polvo-y-pintura-en-polvo VIVA
probar /blog/seguridad-industrial-en-un-sistema-de-sandblasting/ /blog/seguridad-industrial-en-un-sistema-de-sandblasting
probar /cabinas-de-pintura-industrial/tipos-de-cabinas-de-pintura-industrial/ /blog/como-elegir-tu-cabina-de-pintura
probar /categoria-producto/pintura-en-polvo/ '/partes-y-filtros?categoria=pintura-en-polvo'
probar /tienda/filtro-plisado-con-marco-de-carton/ /partes-y-filtros/filtro-plisado-con-marco-de-carton
probar /hornos-de-curado-de-pintura/introduccion-a-los-hornos-de-curado-de-pintura/ /soluciones/hornos-secado-curado
probar /tienda/lampara-infrarroja-de-pedestal-iwt-2-modulos/ /partes-y-filtros/lampara-infrarroja-de-pedestal-iwt-2-modulos
probar /filtros-para-cabina-de-pintura/filtros-para-cabinas-de-pintura/ /soluciones/filtros
probar /sistemas-de-pintura-industrial/introduccion-a-los-sistemas-de-pintura-industrial/ /
probar /cabina-pintura/mantenimiento-preventivo-de-cabinas-de-pintura-industrial/ /blog/ventajas-mantenimiento-preventivo
probar /hornos-de-curado-de-pintura/tipos-de-hornos-de-curado-de-pintura/ /soluciones/hornos-secado-curado
probar /categoria-producto/filtros/camfil/ '/partes-y-filtros?marca=camfil'
probar /categoria-producto/filtros/ '/partes-y-filtros?categoria=filtros'
probar /cabinas-de-pintura-industrial/monterrey-pintura-de-calidad/ /soluciones/cabinas-pintura
probar /cabinas-de-pintura-industrial/factores-clave-instalar-en-taller/ /soluciones/cabinas-pintura
probar /cabina-pintura/tipos-de-cabinas-de-pintura/ /blog/como-elegir-tu-cabina-de-pintura

echo "--- slugs que cambiaron (legacy_slug) ---"
probar /tienda/216-505/ /partes-y-filtros/filtro-de-6-bolsas-con-marco-metalico
probar /tienda/165010-75/ /partes-y-filtros/filtro-en-rollo-de-poliester-difusor-de-aire-pare-techo-de-cabinas-de-pintura
probar /partes-y-filtros/216-505 /partes-y-filtros/filtro-de-6-bolsas-con-marco-metalico

echo "--- URLs viejas encontradas en el contenido del blog/catálogo ---"
probar /cabina-de-pintura/ /soluciones/cabinas-pintura
probar /sistemas-de-pintura-en-polvo/ /soluciones/pintura-en-polvo
probar /servicios-y-refacciones/ /soluciones/servicios-industriales
probar /equipo-de-pretratamiento/ /soluciones/sistemas-de-pretratamiento
probar /registro/ /contacto

echo "--- barra final en rutas nuevas y sitemaps de WordPress ---"
probar /contacto/ /contacto
probar /soluciones/conveyors/ /soluciones/conveyors
probar /feed/ /blog/rss.xml
probar /post-sitemap.xml /sitemap.xml
