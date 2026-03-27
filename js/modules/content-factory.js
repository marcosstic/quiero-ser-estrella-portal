import { NEWS } from './news-data.js';

const APP_ID = 'app';

function $(id){
  return document.getElementById(id);
}

function escapeHtml(str){
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function slugify(s){
  return String(s)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function fmtDate(iso){
  try{
    const d = new Date(`${iso}T12:00:00`);
    return new Intl.DateTimeFormat('es-VE', { year: 'numeric', month: 'short', day: '2-digit' }).format(d);
  }catch{
    return iso;
  }
}

function stripTags(html){
  return String(html).replace(/<[^>]*>/g, ' ');
}

function readingTime(html){
  const words = stripTags(html).trim().split(/\s+/).filter(Boolean).length;
  const wpm = 220;
  const min = Math.max(1, Math.round(words / wpm));
  return `${min} min de lectura`;
}

function shareLinks({ title, url }){
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return {
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
  };
}

function currentUrl(){
  return window.location.href;
}

function byDateDesc(a, b){
  return String(b.fecha).localeCompare(String(a.fecha));
}

function uniqueBySlug(items){
  const seen = new Set();
  const out = [];
  for (const it of items){
    if (seen.has(it.slug)) continue;
    seen.add(it.slug);
    out.push(it);
  }
  return out;
}

function sidebarHtml({ currentSlug } = {}){
  const sorted = [...NEWS].sort(byDateDesc);
  const recientes = sorted.filter((n) => n.slug !== currentSlug).slice(0, 5);
  const tendencias = sorted
    .filter((n) => (n.etiquetas || []).includes('Destacado') && n.slug !== currentSlug)
    .slice(0, 5);

  const liRecientes = recientes
    .map((n) => `<li><a href="#/noticias/${escapeHtml(n.slug)}">${escapeHtml(n.titulo)}</a></li>`)
    .join('');

  const liTendencias = tendencias
    .map((n) => `<li><a href=\"#/noticias/${escapeHtml(n.slug)}\">${escapeHtml(n.titulo)}</a></li>`)
    .join('');

  return `
    <section class=\"panel\">
      <h2 class=\"panel-title\">Noticias recientes</h2>
      <ul class=\"list\">${liRecientes}</ul>
    </section>

    <section class="panel">
      <h2 class="panel-title">Tendencias</h2>
      <ol class="list list-ordered">${liTendencias}</ol>
    </section>

    <section class=\"panel\">
      <h2 class=\"panel-title\">Síguenos</h2>
      <div class=\"social\">
        <a class=\"social-link\" href=\"#\">Instagram</a>
        <a class=\"social-link\" href=\"#\">Facebook</a>
        <a class=\"social-link\" href=\"#\">TikTok</a>
        <a class=\"social-link\" href=\"#\">Telegram</a>
      </div>
    </section>

    <section class=\"panel\">
      <h2 class=\"panel-title\">Contacto</h2>
      <p class=\"small\">correo@fundacion.com</p>
      <p class=\"small\">prensa@fundacion.com</p>
    </section>
  `;
}

function categoryLabelFromSlug(slug){
  for (const n of NEWS){
    if (slugify(n.categoria) === slug) return n.categoria;
  }
  return slug;
}

function cardHtml(n){
  return `
    <article class="card" data-tilt>
      <div class="card-media" style="background-image:url('${escapeHtml(n.imagen_principal)}'); background-size:cover; background-position:center;"></div>
      <div class="card-body">
        <div class="meta">
          <a class="pill pill-soft" href="#/categoria/${escapeHtml(slugify(n.categoria))}">${escapeHtml(n.categoria)}</a>
          <span class="meta-dot" aria-hidden="true">•</span>
          <span>${escapeHtml(fmtDate(n.fecha))}</span>
        </div>
        <h3 class="card-title"><a class="card-link" href="#/noticias/${escapeHtml(n.slug)}">${escapeHtml(n.titulo)}</a></h3>
        <p class="card-excerpt">${escapeHtml(n.resumen)}</p>
      </div>
    </article>
  `;
}

export function renderHome(){
  const el = $(APP_ID);
  if (!el) return;

  const sorted = [...NEWS].sort(byDateDesc);
  const featured = sorted[0];
  const latest = sorted.slice(1, 7);

  document.title = 'Quiero Ser Estrella — Portal';

  el.innerHTML = `
    <div class=\"grid-main\">
      <div>
        <div class=\"section-header\">
          <h2 class=\"section-title\">Destacada</h2>
          <a class=\"section-link\" href=\"#/categoria/${escapeHtml(slugify(featured.categoria))}\">Ver más</a>
        </div>

        <article class=\"featured\" data-tilt>
          <div class=\"featured-media\" style=\"background-image:url('${escapeHtml(featured.imagen_principal)}'); background-size:cover; background-position:center;\"></div>
          <div class=\"featured-body\">
            <div class=\"meta\">
              <a class=\"pill\" href=\"#/categoria/${escapeHtml(slugify(featured.categoria))}\">${escapeHtml(featured.categoria)}</a>
              <span class=\"meta-dot\" aria-hidden=\"true\">•</span>
              <span>${escapeHtml(fmtDate(featured.fecha))}</span>
            </div>
            <h3 class=\"featured-title\"><a class=\"card-link\" href=\"#/noticias/${escapeHtml(featured.slug)}\">${escapeHtml(featured.titulo)}</a></h3>
            <p class=\"featured-excerpt\">${escapeHtml(featured.resumen)}</p>
            <div class=\"meta\">Por <a href=\"#\">${escapeHtml(featured.autor)}</a></div>
          </div>
        </article>

        <div class=\"section-header\" id=\"ultimas\">
          <h2 class=\"section-title\">Últimas</h2>
          <a class=\"section-link\" href=\"#/categoria/eventos-y-galas\">Todas las noticias</a>
        </div>

        <div class=\"cards\">${latest.map(cardHtml).join('')}</div>
      </div>

      <aside class=\"sidebar\" aria-label=\"Barra lateral\">
        ${sidebarHtml()}
      </aside>
    </div>
  `;
}

export function renderCategory({ categorySlug }){
  const el = $(APP_ID);
  if (!el) return;

  const label = categoryLabelFromSlug(categorySlug);
  const items = [...NEWS]
    .filter((n) => slugify(n.categoria) === categorySlug)
    .sort(byDateDesc);

  document.title = `${label} — Quiero Ser Estrella`;

  el.innerHTML = `
    <div class=\"grid-main\">
      <div>
        <div class=\"section-header\">
          <h2 class=\"section-title\">${escapeHtml(label)}</h2>
          <a class=\"section-link\" href=\"#/\">Inicio</a>
        </div>

        <div class=\"cards\">${items.map(cardHtml).join('')}</div>
      </div>

      <aside class=\"sidebar\" aria-label=\"Barra lateral\">
        ${sidebarHtml()}
      </aside>
    </div>
  `;
}

export function renderArticle({ slug }){
  const el = $(APP_ID);
  if (!el) return;

  const n = NEWS.find((x) => x.slug === slug);
  if (!n){
    renderHome();
    return;
  }

  const categorySlug = slugify(n.categoria);
  const label = n.categoria;

  const tags = (n.etiquetas || [])
    .map((t) => `<span class=\"pill\">${escapeHtml(t)}</span>`)
    .join('');

  const share = shareLinks({ title: n.titulo, url: currentUrl() });

  const related = uniqueBySlug(
    NEWS.filter((x) => x.slug !== n.slug && slugify(x.categoria) === categorySlug)
      .sort(byDateDesc)
      .slice(0, 4)
  );

  const relatedHtml = related
    .map((x) => `<li><a href=\"#/noticias/${escapeHtml(x.slug)}\">${escapeHtml(x.titulo)}</a></li>`)
    .join('');

  document.title = `${n.titulo} — Quiero Ser Estrella`;

  el.innerHTML = `
    <div class=\"article-wrap\">
      <article class=\"article\">
        <div class=\"article-hero\" style=\"background-image:url('${escapeHtml(n.imagen_principal)}'); background-size:cover; background-position:center;\"></div>
        <div class=\"article-body\">
          <nav class="meta" aria-label="Breadcrumbs">
            <a href="#/">Inicio</a>
            <span class="meta-dot" aria-hidden="true">›</span>
            <a href="#/categoria/${escapeHtml(categorySlug)}">${escapeHtml(label)}</a>
          </nav>

          <h1 class="article-title">${escapeHtml(n.titulo)}</h1>

          <div class="meta">
            <span>Por <a href="#">${escapeHtml(n.autor)}</a></span>
            <span class="meta-dot" aria-hidden="true">•</span>
            <span>${escapeHtml(fmtDate(n.fecha))}</span>
            <span class="meta-dot" aria-hidden="true">•</span>
            <span>${escapeHtml(readingTime(n.cuerpo_html))}</span>
          </div>

          <p class="article-excerpt">${escapeHtml(n.resumen)}</p>

          <div class="tags">${tags}</div>

          <div class="prose">${n.cuerpo_html}</div>

          <div class="meta" aria-label="Compartir">
            <a class="social-link" href="${escapeHtml(share.whatsapp)}" target="_blank" rel="noreferrer">WhatsApp</a>
            <a class="social-link" href="${escapeHtml(share.facebook)}" target="_blank" rel="noreferrer">Facebook</a>
            <a class="social-link" href="${escapeHtml(share.x)}" target="_blank" rel="noreferrer">X</a>
          </div>

          <div class="author-box">
            <p class="author-name">${escapeHtml(n.autor)}</p>
            <p class="author-bio">Fundación Quiero Ser Estrella — acompañamos procesos artísticos con formación, comunidad y oportunidades reales.</p>
          </div>

          <div class=\"related\">
            <h2>Relacionados</h2>
            <ul class=\"list\">${relatedHtml}</ul>
          </div>
        </div>
      </article>

      <aside class=\"sidebar\" aria-label=\"Barra lateral\">
        ${sidebarHtml({ currentSlug: n.slug })}
      </aside>
    </div>
  `;
}
