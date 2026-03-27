export function initParticles({ reduced } = { reduced: false }){
  if (reduced) return;

  const canvas = document.querySelector('[data-particles]');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let raf = 0;
  let running = true;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const particles = [];
  const count = 34;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const rand = (min, max) => min + Math.random() * (max - min);

  const seed = () => {
    particles.length = 0;
    for (let i=0;i<count;i++){
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.6, 1.6),
        vx: rand(-0.08, 0.08),
        vy: rand(-0.04, 0.12),
        a: rand(0.05, 0.18),
      });
    }
  };

  const tick = () => {
    if (!running) return;
    ctx.clearRect(0,0,w,h);

    // very subtle wash (light theme)
    ctx.fillStyle = 'rgba(203,204,204,0.04)';
    ctx.fillRect(0,0,w,h);

    for (const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y > h + 10) p.y = -10;

      ctx.beginPath();
      ctx.fillStyle = `rgba(47,47,47,${p.a * 0.12})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();
    }

    raf = requestAnimationFrame(tick);
  };

  const onVis = () => {
    running = document.visibilityState === 'visible';
    if (running){
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }
  };

  resize();
  seed();
  tick();

  window.addEventListener('resize', () => { resize(); seed(); }, { passive: true });
  document.addEventListener('visibilitychange', onVis, { passive: true });
}
