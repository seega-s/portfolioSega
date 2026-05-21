# Brutalist AI SaaS Landing Page & Portfolio

Un portfolio interactivo, dinámico y con diseño brutalista, construido con **Next.js**, animaciones fluidas con **Framer Motion**, y un backend completo administrado a través de **Supabase**. Incluye un panel de administración en vivo para actualizar contenido sin tocar el código.

## 🚀 Características Principales
- **Panel de Administración en Vivo (`/admin`)**: Modifica textos, proyectos, experiencia, tecnologías y configuración general directamente desde la interfaz.
- **Multilingüe**: Soporte integrado para Inglés y Español.
- **Base de Datos en Tiempo Real**: Todo el contenido se carga desde Supabase, desde la configuración global hasta los proyectos y la experiencia laboral.
- **Diseño Brutalista e Interactivo**: Tipografías audaces, alto contraste, modo oscuro/claro y diagramas interactivos (como la red de experiencia).
- **SEO Dinámico**: Los metadatos de la página, como el título y el favicon, se actualizan dinámicamente desde el panel de administración.

## 💻 Tech Stack
- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), React, TypeScript.
- **Estilos y Animaciones**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/).
- **Backend / Base de Datos**: [Supabase](https://supabase.com/) (PostgreSQL).
- **Autenticación y Storage**: Supabase Auth & Storage (para avatares, currículums y logos).
- **Despliegue**: [Vercel](https://vercel.com/).

---

## 🛠️ Cómo Replicar y Desplegar Paso a Paso

Sigue esta guía detallada para tener tu propia copia del portfolio funcionando en la nube de forma totalmente gratuita.

### 1. Haz un Fork del Repositorio (Copia el código)
1. Ve a la parte superior derecha de esta página en GitHub.
2. Haz clic en el botón **Fork**.
3. Selecciona tu cuenta personal como destino.
4. (Opcional) Cambia el nombre del repositorio si lo deseas.
5. Haz clic en **Create fork**. Ahora tienes tu propia copia exacta del código en tu GitHub.

### 2. Configura tu Base de Datos en Supabase
Supabase es donde guardaremos toda la información (proyectos, configuración, fotos) para que puedas editarla desde el panel de administración.

1. Entra en [Supabase.com](https://supabase.com) y crea una cuenta si no tienes una.
2. Haz clic en **New Project**.
3. Selecciona tu organización, dale un nombre a tu proyecto (ej: `mi-portfolio`) y genera una contraseña segura para la base de datos.
4. Elige la región más cercana a ti y dale a **Create new project**. (Tardará un par de minutos en configurarse).
5. En el menú lateral izquierdo, haz clic en **SQL Editor** (el icono de código `</>`).
6. Haz clic en **New Query**.
7. Copia todo el contenido del archivo `supabase_setup.sql` que encontrarás en la raíz de este repositorio.
8. Pégalo en el editor de Supabase y pulsa el botón **Run** (abajo a la derecha). Esto creará todas las tablas y preparará el almacenamiento.
9. **🌟 OPCIÓN RECOMENDADA**: Para comprobar que todo funciona correctamente al instante, te recomendamos encarecidamente cargar los datos de prueba. Abre una nueva pestaña de Query, copia el contenido de `dwight_seed.sql` y pulsa **Run**. ¡Tu portfolio se convertirá en el de Dwight K. Schrute para que tengas una base sólida sobre la que empezar a editar!

### 3. Obtén tus Claves de Supabase
Para que tu código se conecte con tu nueva base de datos, necesitas 3 claves:

1. Ve a los ajustes de tu proyecto en Supabase haciendo clic en **Project Settings** (el icono del engranaje ⚙️ en el menú lateral abajo del todo).
2. En el menú secundario, haz clic en **API**.
3. Aquí encontrarás las credenciales que necesitas copiar y guardar para el siguiente paso:
   - **Project URL**: Esta será tu variable `NEXT_PUBLIC_SUPABASE_URL`.
   - **Project API Keys (anon / public)**: Esta será tu variable `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - **Project API Keys (service_role / secret)**: Baja un poco en la pantalla y copia esta clave. Será tu variable `SUPABASE_SERVICE_ROLE_KEY`. *¡Atención! Nunca compartas esta clave públicamente, es la que te da permisos de administrador.*

### 4. Despliega tu página en Vercel
Vercel es la plataforma donde alojaremos la página web de forma gratuita.

1. Ve a [Vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en el botón **Add New...** y luego en **Project**.
3. Verás una lista de tus repositorios de GitHub. Busca el repositorio al que le hiciste fork en el Paso 1 y haz clic en **Import**.
4. En la pantalla de configuración que aparece, busca la sección llamada **Environment Variables** y despliégala.
5. Añade una a una las variables que copiaste de Supabase. Escribe el nombre a la izquierda y pega el valor a la derecha, dándole a **Add** después de cada una:
   - Nombre: `NEXT_PUBLIC_SUPABASE_URL` | Valor: *(tu URL copiada)*
   - Nombre: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Valor: *(tu clave anon copiada)*
   - Nombre: `SUPABASE_SERVICE_ROLE_KEY` | Valor: *(tu clave service_role copiada)*
   - *(Opcional)* Nombre: `NEXT_PUBLIC_SITE_URL` | Valor: *(el dominio que usarás, ej: https://mi-portfolio.vercel.app)*
6. Finalmente, pulsa el botón **Deploy**.

Vercel comenzará a construir tu aplicación. En un par de minutos, verás confeti 🎉 en la pantalla y te dará la URL pública de tu nuevo portfolio.

¡Ya está! Entra en `tu-nueva-url.vercel.app/admin` para acceder a tu panel de control y modificar todo el contenido en vivo.

---

## 📄 Plantilla de Datos: Dwight K. Schrute (JSON/SQL Seed)
Para ayudarte a arrancar o para que tengas datos de ejemplo antes de escribir los tuyos, hemos dejado un archivo `dwight_seed.json` (y su equivalente para la BD: `dwight_seed.sql`) en la raíz del proyecto. ¡Si ejecutas el SQL en Supabase (como se indica en el paso 2.9), tu portfolio se convertirá en el del asistente del gerente regional de Dunder Mifflin al instante!

---

## 🔍 SEO (Search Engine Optimization)

Este proyecto incluye una estrategia de SEO completa y lista para producción:

### Metadatos Dinámicos
- **Título y Favicon dinámicos**: Se obtienen en tiempo real desde la tabla `main_config` de Supabase a través de la función `generateMetadata()` de Next.js. Cámbialos desde `/admin/main` sin tocar código.
- **Meta description, keywords y author** generados dinámicamente con el nombre del sitio.
- **Open Graph** (Facebook, LinkedIn, WhatsApp) y **Twitter Cards** completamente configurados para un aspecto profesional al compartir enlaces.

### Datos Estructurados (JSON-LD)
Se inyectan múltiples esquemas de [Schema.org](https://schema.org) en el `<head>` de cada página:
- **`Person`**: Nombre, rol, habilidades, certificaciones, links sociales, idiomas, universidad, nacionalidad.
- **`WebSite`**: Información general del sitio y su publicador.
- **`ProfilePage`**: Señala que la página principal es un perfil personal autoritativo.
- **`SoftwareSourceCode`**: Disponible para páginas de proyecto individuales (nombre, tecnologías, repositorio).
- **`BreadcrumbList`** y **`CollectionPage`**: Para navegación estructurada y listados.

### Archivos de Crawling
- **`robots.txt`** (`app/robots.ts`): Permite la indexación de todo el contenido público mientras bloquea `/admin/` y `/api/` a los crawlers genéricos.
- **`sitemap.xml`** (`app/sitemap.ts`): **Dinámico** — obtiene los proyectos de Supabase en tiempo de generación para que cada proyecto individual (`/projects/[id]`) tenga su propia entrada en el sitemap.
- **`manifest.webmanifest`** (`app/manifest.ts`): Para PWA y SEO móvil.

### SEO Técnico
- **Canonical URLs** y `hreflang` alternates (es-ES, en-US, x-default) configurados.
- **Verificación de Google** (`verification.google`) lista para Google Search Console.
- **Geo meta tags** (`geo.region`, `geo.placename`, `ICBM`) para SEO local en Murcia, España.
- **`<noscript>` fallback**: Contenido HTML renderizado en servidor para crawlers que no ejecutan JavaScript.

---

## 🤖 GEO (Generative Engine Optimization)

La optimización para motores generativos asegura que **ChatGPT, Perplexity, Claude, Google Gemini** y otros asistentes de IA puedan encontrar, leer y presentar correctamente tu información cuando alguien pregunte por ti.

### `/llms.txt` — Perfil legible por máquinas
Siguiendo la especificación [llms.txt](https://llmstxt.org/), el proyecto expone un endpoint en `/llms.txt` que genera automáticamente un documento de texto plano con:
- Nombre, rol, ubicación, links sociales y certificaciones.
- Stack técnico completo, agrupado por categorías.
- Experiencia profesional con fechas y descripciones.
- Lista de todos los proyectos con tecnologías, links y descripción.

> **Los datos se obtienen en tiempo real de Supabase**, así que siempre reflejan lo que hayas configurado en el panel de administración.

### Crawlers de IA Permitidos en `robots.txt`
Se permite **explícitamente** el acceso a los crawlers de los principales modelos de IA:

| Crawler | Servicio |
|---|---|
| `GPTBot` | OpenAI (ChatGPT) |
| `ChatGPT-User` | ChatGPT navegación web |
| `PerplexityBot` | Perplexity AI |
| `ClaudeBot` / `Claude-Web` | Anthropic (Claude) |
| `Google-Extended` | Google Gemini |
| `Amazonbot` | Amazon Alexa / IA |
| `Applebot-Extended` | Apple Intelligence |
| `cohere-ai` | Cohere |

Todos tienen acceso a la web pública, `/llms.txt` y `/api/projects`, pero las rutas `/admin/`, `/api/auth/` y `/api/experience/` están bloqueadas.

### Señalización en Headers HTTP
- **`Link` header** en la homepage: `</llms.txt>; rel="author"; type="text/plain"` — anuncia el perfil a crawlers.
- **`X-Llms-Txt`** header personalizado apuntando a `/llms.txt`.
- **CORS abierto** (`Access-Control-Allow-Origin: *`) en `/llms.txt` y `/api/projects` para que los crawlers de IA puedan leerlos sin restricciones.

### Meta Tags para Descubrimiento
```html
<link rel="author" href="/llms.txt" type="text/plain" />
<meta name="ai:profile" content="/llms.txt" />
```

### JSON-LD Enriquecido para IA
El esquema `Person` incluye campos específicos que los LLMs utilizan para extraer información:
- `givenName`, `familyName`, `nationality`, `alumniOf`
- `knowsLanguage` con objetos `Language` completos
- `subjectOf` apuntando directamente a `/llms.txt`
- `sameAs` con todos los perfiles sociales verificables

---

## ⚡ Rendimiento y Optimización

### Fuentes Optimizadas
- Se utiliza `next/font/google` para **JetBrains Mono** y **Space Grotesk**, que descarga y sirve las fuentes localmente (self-hosted). Esto elimina la necesidad de conexiones externas a Google Fonts.
- `display: 'swap'` en ambas fuentes para evitar FOIT (Flash of Invisible Text) y mejorar el CLS (Cumulative Layout Shift).

### Headers de Caché
Configurados en `next.config.mjs`:
- **Assets estáticos** (`/images/*`, `/_next/static/*`): `Cache-Control: public, max-age=31536000, immutable` — caché de 1 año.
- **`/llms.txt`**: Caché de 1 hora con `stale-while-revalidate` de 24 horas.
- **`/api/projects`**: Caché de 10 minutos con `stale-while-revalidate` de 1 hora.

### Optimización de Imágenes
- Next.js Image Optimization activada con formatos **AVIF** y **WebP** (`next.config.mjs > images.formats`).
- Imágenes remotas de Supabase Storage permitidas vía `remotePatterns`.

### Seguridad (Headers HTTP)
Cabeceras de seguridad configuradas globalmente:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation()`
- `poweredByHeader: false` — elimina la cabecera `X-Powered-By: Next.js`.

### Compresión
- `compress: true` en `next.config.mjs` — habilita compresión gzip/brotli automática.

### Resiliencia
- `generateMetadata()` envuelto en `try/catch` para que un fallo de conexión a Supabase durante el build no rompa la construcción.
- El cliente de Supabase (`lib/supabase.ts`) hace fallback a la clave `anon` si `SUPABASE_SERVICE_ROLE_KEY` no está configurada.
