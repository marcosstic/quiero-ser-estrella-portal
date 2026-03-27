function clamp(n, min, max){
  return Math.max(min, Math.min(max, n));
}

export function initSpotlight({ reduced } = { reduced: false }){
  const hero = document.querySelector('[data-spotlight]');
  if (!hero) return;

  const setSpot = (xPct, yPct) => {
    hero.style.setProperty('--sx', `${xPct}%`);
    hero.style.setProperty('--sy', `${yPct}%`);
  };

  // default
  setSpot(50, 35);

  if (reduced) return;

  const onMove = (ev) => {
    const rect = hero.getBoundingClientRect();
    const x = ((ev.clientX - rect.left) / rect.width) * 100;
    const y = ((ev.clientY - rect.top) / rect.height) * 100;
    setSpot(clamp(x, 10, 90), clamp(y, 10, 90));
  };

  hero.addEventListener('pointermove', onMove, { passive: true });
  hero.addEventListener('pointerleave', () => setSpot(50, 35), { passive: true });
}
