import fallback from '../data/general.json'

const API_URL = import.meta.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'

/**
 * Contenido común a todo el sitio (logotipo, normativas y aliados globales).
 * Se administra en la página «General» del admin y lo consumen tanto las
 * páginas como el Navbar y el Footer. Si la API no responde, se usa el
 * respaldo local, igual que en el resto del sitio.
 */
export async function getGeneral() {
  try {
    const res = await fetch(`${API_URL}/api/v1/paginas/general`, { signal: AbortSignal.timeout(5000) })
    if (res.ok) return (await res.json()).data
  } catch {
    // API no disponible: se sirve el contenido de respaldo
  }

  return fallback
}
