import { prefersReducedMotion } from './modules/motion.js';
import { initTiltCards } from './modules/tilt-cards.js';
import { initParticles } from './modules/particles.js';

const reduced = prefersReducedMotion();

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

initTiltCards({ reduced });
initParticles({ reduced });
