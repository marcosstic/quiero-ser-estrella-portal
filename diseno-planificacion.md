# Planificación de Diseño (UI/UX + Front Modular) — Fundación Quiero Ser Estrella

Este documento define el diseño del portal (mockup) con HTML/CSS/JS puros, con una arquitectura modular y efectos 3D/animaciones usados de forma estratégica para transmitir “escenario digital” sin sacrificar legibilidad editorial.

## Objetivo UX
- Priorizar lectura y navegación (portal de noticias).
- Mantener identidad “gala/spotlight” principalmente en Home y elementos de énfasis.
- Rápido en móvil: efectos pesados solo en zonas puntuales, degradables y con `prefers-reduced-motion`.

## Principios UI
- Jerarquía clara: titular, bajada, autor/fecha, categorías/tags.
- Sistema de espaciado consistente (8px base).
- Tipografía con alto contraste.
- Estados interactivos visibles (hover/focus).

## Paleta (tokens)
- Fondo: `#2f2f2f`
- Texto: `#fbfbfb`
- Spotlight/CTA: `#face10`
- Lujo: `#f8e999`
- Estructura/grises: `#cbcccb`, `#9c9e9c`, `#7c7c7c`

Uso recomendado:
- `#face10` solo para elementos de acción/énfasis.
- Evitar saturar el layout con dorado.

## Tipografía
- Base: sistema (sin Google Fonts) para rendimiento.
- Escala sugerida:
  - H1 40–48px (responsive)
  - H2 24–32px
  - Body 16–18px
  - Meta 12–14px

## Layout (mockup)
### Header
- Logo + nombre.
- Menú categorías.
- Búsqueda.

### Home
- Hero “Spotlight” con:
  - Título + claim.
  - Botón principal (CTA a noticias).
  - Efecto spotlight siguiendo cursor (desktop) y modo estático (mobile).
- Sección “Destacada”.
- Grilla “Últimas” (cards).
- Sidebar:
  - Recientes.
  - Más vistas.
  - Síguenos.
  - Contacto.

### Artículo (futuro, en mockup como plantilla)
- H1 + meta (autor/fecha).
- Contenido editorial (Markdown renderizado a HTML).
- Tags.
- Relacionados.

## Componentes (design system)
- Botón primaria (ticket/VIP): fondo dorado, borde y glow en hover.
- Cards de noticia:
  - Imagen, categoría, título, meta.
  - Tilt 3D suave en hover.
- Pills (categoría/tag).
- Input búsqueda.

## Efectos y animaciones (estratégicos)
### 1) Spotlight (Hero)
- Implementación: CSS `radial-gradient` controlado por JS.
- Degradación:
  - Mobile: spotlight fijo.
  - `prefers-reduced-motion`: spotlight fijo.

### 2) Tilt 3D en cards
- `transform: rotateX/rotateY translateZ` en hover.
- Limitado a cards visibles.
- Desactivable en `prefers-reduced-motion`.

### 3) Partículas sutiles (Hero)
- Canvas con densidad baja para simular “polvo/flash”.
- Pausar si la pestaña no está activa.

## Accesibilidad
- Contraste mínimo AA.
- `:focus-visible` para teclado.
- Respeto a `prefers-reduced-motion`.
- Tamaños de tap targets.

## Arquitectura de archivos (front)
Estructura simple, escalable y modular:

- `/index.html`
- `/css/`
  - `tokens.css` (variables)
  - `base.css` (reset + tipografía + accesibilidad)
  - `layout.css` (grid/containers)
  - `components.css` (botones, cards, pills)
  - `effects.css` (spotlight, 3D, partículas)
- `/js/`
  - `main.js` (bootstrap)
  - `/modules/`
    - `spotlight.js`
    - `tilt-cards.js`
    - `particles.js`
    - `motion.js` (detección reduced-motion)

## Convenciones de ingeniería (front)
- JS sin dependencias, módulos ES.
- Un módulo = una responsabilidad.
- Data-attributes para enlazar comportamiento (`data-tilt`, `data-spotlight`).
- Evitar listeners globales costosos.

## Checklist UX del mockup
- Home legible con efecto “gala” sin afectar lectura.
- Navegación clara.
- Cards con jerarquía tipográfica.
- Micro-interacciones coherentes.

## Despliegue rápido (Vercel)
- Es sitio estático: Vercel detecta `index.html`.
- Subir el folder a GitHub y “Import Project” en Vercel.
- No requiere build.
