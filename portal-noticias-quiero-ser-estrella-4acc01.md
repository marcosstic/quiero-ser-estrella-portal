# Portal de Noticias “Fundación Quiero Ser Estrella” (MVP)
Este plan define el alcance y la implementación de un portal de noticias con panel admin para publicar artículos, con front 100% personalizado (HTML/CSS/JS) y backend propio (PHP+MySQL en HostGator cPanel), inspirado en el layout de Relámpago Zuliano, dejando la votación/premiación para una fase futura.

## Recomendación de stack (HostGator)
**Recomendado: Backend propio en PHP 8+ + MySQL + Front custom (HTML/CSS/JS)**.

- Motivo principal: quieres una experiencia muy personalizada (efectos/3D) y control total del portal, incluyendo:
  - Panel admin propio
  - Datos y reglas de negocio propias (para luego agregar votaciones)
  - Diseño editorial con identidad “escenario digital”

## Arquitectura propuesta
### Frontend (público)
- HTML/CSS/JS puros (ES6+), layout editorial + efectos teatrales controlados.
- Páginas:
  - Home (últimas/destacadas/categorías)
  - Listado por categoría
  - Listado por tag
  - Página de artículo
  - Búsqueda
  - Páginas estáticas (Sobre, Contacto)

### URLs (simples y SEO-friendly)
- Artículo: `/noticias/{slug}`
- Categoría: `/categoria/{slug}`
- Tag: `/tag/{slug}`
- Autor: `/autor/{slug}`
- (Opcional) Archivo por fecha: `/archivo/2026/03/` (sin usarlo como URL principal de artículo)

### Backend (API + Admin)
- PHP (MVC simple o estructura modular) + MySQL.
- Admin web (rutas protegidas) para:
  - Login/logout
  - CRUD de artículos
  - CRUD de categorías/tags
  - Gestión de autores
  - Subida/gestión de imágenes (media)
  - Campos SEO por artículo (title/description/slug)

### Roles y permisos (panel `/admin`)
- **Admin**
  - Gestiona usuarios y roles (crear/editar/desactivar).
  - Puede crear/editar/publicar/despublicar/borrar cualquier artículo.
  - Gestiona taxonomía global (categorías/tags) y media.
  - Accede a métricas/reportes (cuando existan).
- **Editor**
  - Puede crear/editar/publicar/despublicar artículos (incluyendo de otros autores).
  - Puede gestionar categorías/tags (si lo habilitas) y media.
  - No puede gestionar usuarios/roles.
- **Autor**
  - Puede crear y editar solo sus propios artículos.
  - Puede subir media para sus artículos.
  - Publicación (flujo editorial adoptado):
    - El autor deja el artículo en **borrador** y lo envía a **pendiente**.
    - El **editor/admin** revisa y publica.

### Flujo editorial (estados del post)
- **Borrador**: visible solo en admin; editable por su autor.
- **Pendiente**: listo para revisión; editable por editor/admin (y opcionalmente por el autor).
- **Publicado**: visible en el sitio.
- **Despublicado/Archivado** (opcional): oculta el contenido sin borrarlo.

### Editor de contenido (decisión)
- Base: **Markdown** (por performance, consistencia y seguridad).
- UX: **toolbar** (botones de formato) + previsualización.
- Pegado: soportar pegar desde Word/Google Docs con:
  - Limpieza de formato (quitar estilos inline)
  - Sanitización
  - Conversión a Markdown cuando sea posible (fallback a HTML permitido si aplica)

### Esquema de datos (alto nivel)
- `users` (admin/editor/autor, password hash, display_name, bio, avatar_media_id)
- `posts` (title, slug, excerpt, content, status, featured_image_id, author_id, published_at)
- `categories` + `post_categories`
- `tags` + `post_tags`
- `media` (path, alt, width, height, created_at)
- (Opcional) `post_views_daily` para “más vistas”

## Enfoque para ahorrar recursos de servidor (HostGator)
- Usar **tema liviano** (preferible tema propio/child theme) y **evitar page builders** (Elementor/Divi) y sliders pesados.
- Mantener **plugins mínimos** (solo lo imprescindible).
- Activar **caché de página** + compresión + minificado (plugin o capa externa).
- Poner imágenes en **WebP** y limitar tamaños (thumbnails correctos) para reducir CPU/ancho de banda.
- Usar **CDN** (p.ej. Cloudflare) para descargar carga del servidor.
- Evitar animaciones/canvas en páginas de lectura; dejar efectos “spotlight” solo en Home (y con opción de reducir motion).

## Enfoque para ahorrar recursos (versión backend propio)
- Evitar render del lado servidor pesado: páginas públicas pueden ser SSR ligero en PHP o HTML estático con fetch a API, pero priorizar HTML servida rápido.
- Cache:
  - Cache de páginas públicas (home, categorías, artículo) con TTL.
  - Invalidación al publicar/editar.
- Consultas SQL:
  - Índices en `posts.slug`, `posts.published_at`, tablas puente.
- Imágenes:
  - Subir una sola vez y generar tamaños (thumbnail/medium/large) para no servir originales.
- Assets:
  - Versionado de CSS/JS para cache en navegador.

### Checklist performance (MVP)
- Cache: página completa + browser cache.
- Imágenes: WebP + lazy-load + tamaños predefinidos.
- CSS/JS: minificado y diferido cuando aplique.
- Fuentes: máximo 1 familia / 2 pesos; `font-display: swap`.
- Base de datos: limitar revisiones/autosaves si hace falta; limpieza periódica.
- Seguridad básica: limitar intentos de login + ocultar endpoints innecesarios.

## Qué copiar del sitio de referencia (requisitos funcionales)
Basado en el artículo de ejemplo, el portal debe incluir:

### Página de artículo
- **Título** visible y H1.
- **Autor** y **fecha**.
- **Imagen destacada** (hero/media) dentro del contenido.
- **Contenido** con tipografía legible y espaciado editorial.
- **Tags** al final.
- **Autor box** / ficha del autor (opcional, pero útil).
- **Historias relacionadas** (Related Story).

### Sidebar / módulos de engagement
- **Noticias recientes** (lista de últimos posts).
- **Más vistas** (ranking).
- **Síguenos** (Instagram/Facebook/TikTok/Telegram).
- **Contacto** (emails + web).

### Navegación y taxonomía
- **Menú por categorías** con subcategorías (ejemplo en referencia: Regionales>Zulia, Deportes>Futbol, etc.).
- Archivo por **categoría** y por **tag**.
- (Deseable) **búsqueda**.

## Identidad de marca aplicada al portal (sin sobrecargar)
Mantener el concepto “escenario digital”, pero en modo editorial:
- **Home/Hero**: puede tener el efecto “spotlight” (suave) y CTA a “Últimas noticias”.
- **Páginas de artículo**: diseño limpio, con detalles de marca:
  - Fondo oscuro solo en header/hero/bloques; cuerpo principal con alto contraste.
  - Acentos `#face10` solo en links, botones y highlights.
- Respetar paleta base:
  - `#2f2f2f` fondo
  - `#fbfbfb` texto principal
  - `#face10` acento principal
  - `#f8e999` acento secundario
  - `#cbcccb` grises estructurales

## MVP (alcance cerrado)
- Backend propio (PHP 8+) + MySQL en HostGator.
- Front público custom (HTML/CSS/JS) con identidad “escenario digital” (efectos controlados).
- Panel `/admin` con roles **admin/editor/autor** y flujo **autor -> pendiente -> editor/admin publica**.
- Tipos de contenido:
  - **Noticia** (post)
  - (Opcional en MVP) **Página** (Sobre, Contacto)
- Componentes públicos:
  - Home con: “Últimas”, “Destacadas”, “Categorías”, “Más vistas”
  - Página de artículo con: autor/fecha, tags, relacionados, sidebar
  - Listados por categoría/tag
  - Página de autor
  - Búsqueda
- Analítica básica:
  - **GA4** (visitas) + eventos simples (click a redes, etc.)

## Fase 2 (no implementar ahora)
- Sistema de **premiación/votación** con anti-fraude y reportes.
- Comentarios moderados (si el cliente lo pide).

## Decisiones pendientes (preguntar al cliente)
- Regla de votación (cuando llegue fase 2):
  - 1 voto por categoría vs por nominado vs diario.
- Categorías oficiales del portal (lista final).
- ¿Secciones fijas además de noticias? (Radio/TV/Redes como página/landing).

## Entregables
- Sitio operativo en HostGator (PHP+MySQL) con panel `/admin`.
- Front custom con estilos de marca (paleta + componentes) y layout inspirado en la referencia.
- Checklist de SEO/performance/seguridad básico.

## Criterios de aceptación (MVP)
- Publicar un artículo desde admin (con imagen destacada, tags y categoría) se refleja correctamente en:
  - Home
  - Página de categoría
  - Página de artículo
- La web carga rápido en móvil (sin animaciones pesadas en páginas de artículo).
- Menú de categorías navegable y consistente.
