function clamp(n, min, max){
  return Math.max(min, Math.min(max, n));
}

export function initTiltCards({ reduced } = { reduced: false }){
  if (reduced) return;

  const items = Array.from(document.querySelectorAll('[data-tilt]'));
  if (!items.length) return;

  const maxRotate = 7; // degrees
  const maxZ = 18; // px

  for (const el of items){
    if (el.dataset.tiltInit === '1') continue;
    el.dataset.tiltInit = '1';

    const onMove = (ev) => {
      const r = el.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top) / r.height;

      const rx = clamp((0.5 - py) * (maxRotate * 2), -maxRotate, maxRotate);
      const ry = clamp((px - 0.5) * (maxRotate * 2), -maxRotate, maxRotate);

      el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${maxZ}px)`;
      el.style.boxShadow = '0 26px 80px rgba(0,0,0,.42)';
    };

    const reset = () => {
      el.style.transform = 'translateZ(0)';
      el.style.boxShadow = '';
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', reset, { passive: true });
  }
}
