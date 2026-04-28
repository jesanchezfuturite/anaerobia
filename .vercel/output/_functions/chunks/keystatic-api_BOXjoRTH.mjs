import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';
import { parseString } from 'set-cookie-parser';
import { config as config$1, singleton, fields } from '@keystatic/core';

function makeHandler(_config) {
  return async function keystaticAPIRoute(context) {
    var _context$locals, _ref, _config$clientId, _ref2, _config$clientSecret, _ref3, _config$secret;
    const envVarsForCf = (_context$locals = context.locals) === null || _context$locals === void 0 || (_context$locals = _context$locals.runtime) === null || _context$locals === void 0 ? void 0 : _context$locals.env;
    const handler = makeGenericAPIRouteHandler({
      ..._config,
      clientId: (_ref = (_config$clientId = _config.clientId) !== null && _config$clientId !== void 0 ? _config$clientId : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_ID) !== null && _ref !== void 0 ? _ref : tryOrUndefined(() => {
        return undefined                                          ;
      }),
      clientSecret: (_ref2 = (_config$clientSecret = _config.clientSecret) !== null && _config$clientSecret !== void 0 ? _config$clientSecret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_GITHUB_CLIENT_SECRET) !== null && _ref2 !== void 0 ? _ref2 : tryOrUndefined(() => {
        return undefined                                              ;
      }),
      secret: (_ref3 = (_config$secret = _config.secret) !== null && _config$secret !== void 0 ? _config$secret : envVarsForCf === null || envVarsForCf === void 0 ? void 0 : envVarsForCf.KEYSTATIC_SECRET) !== null && _ref3 !== void 0 ? _ref3 : tryOrUndefined(() => {
        return undefined                                ;
      })
    }, {
      slugEnvName: "PUBLIC_KEYSTATIC_GITHUB_APP_SLUG"
    });
    const {
      body,
      headers,
      status
    } = await handler(context.request);
    let headersInADifferentStructure = /* @__PURE__ */ new Map();
    if (headers) {
      if (Array.isArray(headers)) {
        for (const [key, value] of headers) {
          if (!headersInADifferentStructure.has(key.toLowerCase())) {
            headersInADifferentStructure.set(key.toLowerCase(), []);
          }
          headersInADifferentStructure.get(key.toLowerCase()).push(value);
        }
      } else if (typeof headers.entries === "function") {
        for (const [key, value] of headers.entries()) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
        if ("getSetCookie" in headers && typeof headers.getSetCookie === "function") {
          const setCookieHeaders2 = headers.getSetCookie();
          if (setCookieHeaders2 !== null && setCookieHeaders2 !== void 0 && setCookieHeaders2.length) {
            headersInADifferentStructure.set("set-cookie", setCookieHeaders2);
          }
        }
      } else {
        for (const [key, value] of Object.entries(headers)) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
      }
    }
    const setCookieHeaders = headersInADifferentStructure.get("set-cookie");
    headersInADifferentStructure.delete("set-cookie");
    if (setCookieHeaders) {
      for (const setCookieValue of setCookieHeaders) {
        var _options$sameSite;
        const {
          name,
          value,
          ...options
        } = parseString(setCookieValue);
        const sameSite = (_options$sameSite = options.sameSite) === null || _options$sameSite === void 0 ? void 0 : _options$sameSite.toLowerCase();
        context.cookies.set(name, value, {
          domain: options.domain,
          expires: options.expires,
          httpOnly: options.httpOnly,
          maxAge: options.maxAge,
          path: options.path,
          sameSite: sameSite === "lax" || sameSite === "strict" || sameSite === "none" ? sameSite : void 0
        });
      }
    }
    return new Response(body, {
      status,
      headers: [...headersInADifferentStructure.entries()].flatMap(([key, val]) => val.map((x) => [key, x]))
    });
  };
}
function tryOrUndefined(fn) {
  try {
    return fn();
  } catch {
    return void 0;
  }
}

const config = config$1({
  storage: {
    kind: "github",
    repo: "jesanchezfuturite/anaerobia"
  },
  singletons: {
    homepage: singleton({
      label: "Página de Inicio",
      path: "src/content/homepage/index",
      format: { data: "json" },
      schema: {
        hero: fields.object({
          title: fields.text({ label: "Título Principal" }),
          subtitle: fields.text({ label: "Subtítulo", multiline: true }),
          backgroundVideo: fields.file({
            label: "Video de Fondo (MP4)",
            directory: "public/videos/hero",
            publicPath: "/videos/hero/"
          }),
          buttons: fields.array(
            fields.object({
              label: fields.text({ label: "Etiqueta del Botón" }),
              url: fields.text({ label: "Enlace (URL)" })
            }),
            { label: "Botones", itemLabel: (props) => props.fields.label.value }
          )
        }, { label: "Sección Hero" }),
        soluciones: fields.object({
          sectionTitle: fields.text({ label: "Título de la Sección" }),
          sectionSubtitle: fields.text({ label: "Subtítulo de la Sección", multiline: true }),
          cards: fields.array(
            fields.object({
              title: fields.text({ label: "Título de la Tarjeta" }),
              description: fields.text({ label: "Descripción" }),
              image: fields.image({
                label: "Imagen",
                directory: "public/images/home",
                publicPath: "/images/home/"
              })
            }),
            { label: "Tarjetas de Soluciones", itemLabel: (props) => props.fields.title.value }
          )
        }, { label: "Sección Soluciones Industriales" }),
        mantenimiento: fields.object({
          sectionTitle: fields.text({ label: "Título de la Sección" }),
          sectionSubtitle: fields.text({ label: "Subtítulo de la Sección", multiline: true }),
          cards: fields.array(
            fields.object({
              title: fields.text({ label: "Título del Servicio" }),
              description: fields.text({ label: "Descripción" }),
              icon: fields.text({ label: "Icono SVG (Opcional)" })
            }),
            { label: "Tarjetas de Mantenimiento", itemLabel: (props) => props.fields.title.value }
          )
        }, { label: "Sección Mantenimiento" }),
        contacto: fields.object({
          heading: fields.text({ label: "Encabezado" }),
          description: fields.text({ label: "Descripción", multiline: true }),
          phone: fields.text({ label: "Teléfono" }),
          email: fields.text({ label: "Correo" })
        }, { label: "Sección Contacto" })
      }
    })
  }
});

const all = makeHandler({ config });
const ALL = all;

const prerender = false;

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  all,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
