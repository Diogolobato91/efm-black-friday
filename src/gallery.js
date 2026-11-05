const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, amount) => a + (b - a) * amount;

export function initMaltaGallery(section) {
  if (!section) return { destroy() {} };
  const cards = [...section.querySelectorAll('[data-gallery-card]')];
  const copy = section.querySelector('[data-gallery-copy]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  const origins = [
    [-34, -22, .7, -7], [22, -30, .72, 5], [38, 8, .68, 6],
    [-28, 25, .7, -5], [10, 31, .72, 4],
  ];

  function render() {
    frame = 0;
    if (reducedMotion.matches || innerWidth < 760) {
      cards.forEach((card) => { card.style.transform = ''; card.style.opacity = ''; });
      if (copy) { copy.style.opacity = ''; copy.style.transform = ''; }
      return;
    }
    const rect = section.getBoundingClientRect();
    const travel = Math.max(1, rect.height - innerHeight);
    const progress = clamp(-rect.top / travel);
    const eased = 1 - Math.pow(1 - progress, 3);
    cards.forEach((card, index) => {
      const [x, y, scale, rotate] = origins[index] || origins[0];
      card.style.transform = `translate3d(${lerp(x, 0, eased)}vw,${lerp(y, 0, eased)}vh,0) scale(${lerp(scale, 1, eased)}) rotate(${lerp(rotate, 0, eased)}deg)`;
      card.style.opacity = String(lerp(.48, 1, clamp(progress * 1.7)));
    });
    if (copy) {
      const copyProgress = clamp(progress / .48);
      copy.style.opacity = String(1 - copyProgress);
      copy.style.transform = `translate3d(-50%,${lerp(-50, -64, copyProgress)}%,0) scale(${lerp(1, .88, copyProgress)})`;
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(render);
  }

  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  reducedMotion.addEventListener('change', schedule);
  render();
  return {
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      reducedMotion.removeEventListener('change', schedule);
    },
  };
}
