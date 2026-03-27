import { renderHome, renderCategory, renderArticle } from './content-factory.js';

function normalizeHash(hash){
  const h = (hash || '').replace(/^#/, '');
  if (!h) return '/';
  return h.startsWith('/') ? h : `/${h}`;
}

function splitPath(path){
  return path.replace(/^\/+/, '').split('/').filter(Boolean);
}

export function navigate(to){
  if (!to) return;
  if (to.startsWith('#')){
    window.location.hash = to;
    return;
  }
  window.location.hash = `#${to.startsWith('/') ? to : `/${to}`}`;
}

export function startRouter({ onRoute } = {}){
  const route = () => {
    const path = normalizeHash(window.location.hash);
    const parts = splitPath(path);

    if (!parts.length){
      renderHome();
      onRoute?.({ name: 'home' });
      return;
    }

    if (parts[0] === 'categoria' && parts[1]){
      renderCategory({ categorySlug: parts[1] });
      onRoute?.({ name: 'category', slug: parts[1] });
      return;
    }

    if (parts[0] === 'noticias' && parts[1]){
      renderArticle({ slug: parts[1] });
      onRoute?.({ name: 'article', slug: parts[1] });
      return;
    }

    renderHome();
    onRoute?.({ name: 'home' });
  };

  window.addEventListener('hashchange', route);
  route();
}
