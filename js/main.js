import { prefersReducedMotion } from './modules/motion.js';
import { initTiltCards } from './modules/tilt-cards.js';
import { initParticles } from './modules/particles.js';
import { startRouter } from './modules/router.js';

const reduced = prefersReducedMotion();

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

initParticles({ reduced });

const searchForm = document.querySelector('form.search');
if (searchForm){
  searchForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
  });
}

startRouter({
  onRoute: () => {
    initTiltCards({ reduced });
  },
});
