export const prerender = false

// Recibe el formulario de contacto (general o cotización de producto) y lo
// guarda en el admin, que es quien manda el lead a Brevo (cuenta propia de
// Anaerobia). Ya no depende de n8n: el sitio está en desarrollo, así que fue
// el momento de desconectarlo por completo en vez de arrastrarlo.
const ADMIN_API_URL = import.meta.env.ADMIN_API_URL ?? 'http://127.0.0.1:8000'
const LEADS_API_SECRET = import.meta.env.LEADS_API_SECRET ?? ''

export async function POST({ request }) {
    let data
    try {
        data = await request.json()
    } catch {
        return new Response(JSON.stringify({ error: 'JSON inválido' }), { status: 400 })
    }

    try {
        const res = await fetch(`${ADMIN_API_URL}/api/v1/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Leads-Secret': LEADS_API_SECRET,
            },
            body: JSON.stringify(data),
            signal: AbortSignal.timeout(5000),
        })

        if (res.ok) {
            return new Response(JSON.stringify({ ok: true }), { status: 201 })
        }
    } catch {
        // El admin no respondió.
    }

    return new Response(JSON.stringify({ error: 'No se pudo registrar el lead' }), { status: 502 })
}
