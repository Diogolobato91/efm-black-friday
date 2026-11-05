const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (a, b, amount) => a + (b - a) * amount;

/** A lightweight, EFM-coloured canvas field. It decorates the hero only. */
export function initKineticGrid(hero) {
  const canvas = hero?.querySelector('[data-kinetic-grid]');
  if (!canvas) return { destroy() {} };

  const context = canvas.getContext('2d');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
  const ripples = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let visible = true;
  let observer;

  function resize() {
    const rect = hero.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(performance.now());
  }

  function point(x, y, now) {
    const dx = x - pointer.x;
    const dy = y - pointer.y;
    const distance = Math.hypot(dx, dy);
    const proximity = clamp(1 - distance / 245, 0, 1);
    const ease = proximity * proximity;
    let px = x;
    let py = y;
    if (distance > 1) {
      const warp = ease * 21;
      px -= (dx / distance) * warp;
      py -= (dy / distance) * warp;
    }
    for (const ripple of ripples) {
      const age = (now - ripple.born) / 1000;
      const radius = age * 340;
      const delta = Math.hypot(x - ripple.x, y - ripple.y) - radius;
      if (Math.abs(delta) < 48) {
        const force = (1 - Math.abs(delta) / 48) * Math.max(0, 1 - age * 1.15) * 12;
        const angle = Math.atan2(y - ripple.y, x - ripple.x);
        px += Math.cos(angle) * force;
        py += Math.sin(angle) * force;
      }
    }
    return { x: px, y: py, proximity };
  }

  function draw(now) {
    context.clearRect(0, 0, width, height);
    if (!width || !height) return;
    const gradient = context.createRadialGradient(width * .2, height * .45, 0, width * .2, height * .45, width * .72);
    gradient.addColorStop(0, 'rgba(20,57,147,.22)');
    gradient.addColorStop(.55, 'rgba(7,13,27,.05)');
    gradient.addColorStop(1, 'rgba(7,10,16,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    ripples.splice(0, ripples.length, ...ripples.filter((ripple) => now - ripple.born < 900));
    const size = width < 650 ? 48 : 58;
    const columns = Math.ceil(width / size) + 1;
    const rows = Math.ceil(height / size) + 1;
    const points = Array.from({ length: rows }, (_, row) =>
      Array.from({ length: columns }, (_, column) => point(column * size, row * size, now)),
    );

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const current = points[row][column];
        const neighbours = [points[row]?.[column + 1], points[row + 1]?.[column]].filter(Boolean);
        for (const neighbour of neighbours) {
          const active = Math.max(current.proximity, neighbour.proximity);
          context.beginPath();
          context.moveTo(current.x, current.y);
          context.lineTo(neighbour.x, neighbour.y);
          context.strokeStyle = active > .03
            ? `rgba(242,92,5,${(.08 + active * .38).toFixed(3)})`
            : 'rgba(255,255,255,.055)';
          context.lineWidth = .7 + active * .65;
          context.stroke();
        }
        context.beginPath();
        context.arc(current.x, current.y, 1.1 + current.proximity * 1.8, 0, Math.PI * 2);
        context.fillStyle = current.proximity > .03
          ? `rgba(242,92,5,${(.22 + current.proximity * .68).toFixed(3)})`
          : 'rgba(255,255,255,.13)';
        context.fill();
      }
    }
  }

  function animate(now) {
    frame = 0;
    if (!visible || document.hidden) return;
    pointer.x = lerp(pointer.x, pointer.tx, .09);
    pointer.y = lerp(pointer.y, pointer.ty, .09);
    draw(now);
    frame = requestAnimationFrame(animate);
  }

  function start() {
    if (!frame && !reducedMotion.matches && visible && !document.hidden) frame = requestAnimationFrame(animate);
    else if (reducedMotion.matches) draw(performance.now());
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function move(event) {
    if (!finePointer.matches || reducedMotion.matches) return;
    const rect = hero.getBoundingClientRect();
    pointer.tx = event.clientX - rect.left;
    pointer.ty = event.clientY - rect.top;
  }

  function click(event) {
    if (reducedMotion.matches) return;
    const rect = hero.getBoundingClientRect();
    ripples.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, born: performance.now() });
  }

  function preference() {
    stop();
    start();
  }

  function visibility() {
    if (document.hidden) stop();
    else start();
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    }, { threshold: 0 });
    observer.observe(hero);
  }
  hero.addEventListener('pointermove', move, { passive: true });
  hero.addEventListener('pointerdown', click, { passive: true });
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', visibility);
  reducedMotion.addEventListener('change', preference);
  finePointer.addEventListener('change', preference);
  resize();
  start();

  return {
    destroy() {
      stop();
      observer?.disconnect();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerdown', click);
      removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', visibility);
      reducedMotion.removeEventListener('change', preference);
      finePointer.removeEventListener('change', preference);
    },
  };
}
