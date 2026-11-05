/** Progressive decoration: content never depends on an observer to become visible. */
export function initMotion() {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const revealSelector = [
    '.section-heading', '.benefit-grid article', '.plans-heading', '.plan-card',
    '.plan-conditions > div', '.plan-finder', '.malta-poster', '.malta-copy',
    '.bonus-layout > div', '.steps li', '.faq-section > div',
    '.final-section > .wrap', '.vinicius-section > div',
  ].join(',');
  const seen = new WeakSet();
  const elements = new Set();
  const scenes = new Map();
  const decorations = new Set();
  let observer;
  let sceneObserver;
  let storyObserver;
  let frame = 0;
  let depthFrame = 0;
  let pendingScene = null;
  let pendingX = 0;
  let pendingY = 0;
  let destroyed = false;
  const depthScenes = new Set();

  root.classList.add('efm-motion');

  function stopFrame() {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    pendingScene = null;
  }

  function resetScene(scene) {
    scene.style.removeProperty('--motion-x');
    scene.style.removeProperty('--motion-y');
  }

  function updateDepth() {
    depthFrame = 0;
    if (destroyed || reduced.matches || document.hidden) return;
    for (const scene of depthScenes) {
      if (!scene.isConnected) {
        depthScenes.delete(scene);
        continue;
      }
      const rect = scene.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
      scene.style.setProperty('--scroll-progress', progress.toFixed(3));
    }
  }

  function scheduleDepth() {
    if (!depthFrame) depthFrame = requestAnimationFrame(updateDepth);
  }

  function reveal(element) {
    seen.add(element);
    if (!reduced.matches) element.classList.add('motion-enter');
    observer?.unobserve(element);
  }

  function addRoute(hero) {
    if (hero.querySelector('.motion-route')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 400 160');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.classList.add('motion-route');
    // Decorative only. The real illustration, alt text and caption remain intact.
    svg.innerHTML = '<path class="motion-route-line" d="M18 135C80 152 118 109 149 67S236 11 322 43" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 7"/><circle cx="18" cy="135" r="4" fill="currentColor"/><g class="motion-plane" transform="translate(322 43) rotate(22)"><path d="m0-18 4 13 13 8v4L4 3v11l5 4v3l-9-3-9 3v-3l5-4V3l-13 4V3l13-8Z" fill="currentColor"/></g>';
    hero.append(svg);
    decorations.add(svg);
  }

  function scheduleParallax(scene, x, y) {
    pendingScene = scene;
    pendingX = x;
    pendingY = y;
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      const active = pendingScene;
      pendingScene = null;
      if (!active || destroyed || reduced.matches || document.hidden || !finePointer.matches) return;
      active.style.setProperty('--motion-x', `${pendingX.toFixed(2)}px`);
      active.style.setProperty('--motion-y', `${pendingY.toFixed(2)}px`);
    });
  }

  function addScene(scene) {
    if (scenes.has(scene)) return;
    const state = { visible: true };
    const move = (event) => {
      if (reduced.matches || !finePointer.matches || document.hidden || !state.visible) return;
      const rect = scene.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
      scheduleParallax(scene, x * 4, y * 4);
    };
    const leave = () => {
      if (pendingScene === scene) stopFrame();
      resetScene(scene);
    };
    scene.classList.add('motion-scene');
    scene.addEventListener('pointermove', move, { passive: true });
    scene.addEventListener('pointerleave', leave);
    scenes.set(scene, { state, move, leave });
    sceneObserver?.observe(scene);
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
    }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' });
    sceneObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const scene = scenes.get(entry.target);
        if (!scene) continue;
        scene.state.visible = entry.isIntersecting;
        entry.target.classList.toggle('motion-scene-visible', entry.isIntersecting);
        if (!entry.isIntersecting) scene.leave();
      }
    }, { threshold: 0 });
    storyObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) entry.target.classList.toggle('is-active', entry.isIntersecting);
    }, { threshold: 0.24, rootMargin: '-24% 0px -42% 0px' });
  }

  function refresh() {
    if (destroyed) return;
    for (const element of elements) {
      if (!element.isConnected) {
        observer?.unobserve(element);
        elements.delete(element);
      }
    }
    document.querySelectorAll(revealSelector).forEach((element) => {
      elements.add(element);
      if (seen.has(element)) return;
      const siblings = element.parentElement?.children;
      const index = siblings ? Array.prototype.indexOf.call(siblings, element) : 0;
      element.style.setProperty('--motion-delay', `${Math.min(index, 3) * 65}ms`);
      if (reduced.matches || !observer) seen.add(element);
      else observer.observe(element);
    });
    document.querySelectorAll('.hero-art').forEach((hero) => {
      addRoute(hero);
      addScene(hero);
    });
    document.querySelectorAll('.hero-art.has-portrait, .scroll-depth').forEach((scene) => depthScenes.add(scene));
    document.querySelectorAll('.story-card').forEach((card, index) => {
      if (storyObserver) storyObserver.observe(card);
      else card.classList.toggle('is-active', index === 0);
    });
    scheduleDepth();
    for (const [scene, handlers] of scenes) {
      if (scene.isConnected) continue;
      sceneObserver?.unobserve(scene);
      scene.removeEventListener('pointermove', handlers.move);
      scene.removeEventListener('pointerleave', handlers.leave);
      scenes.delete(scene);
    }
  }

  function syncPreference() {
    root.classList.toggle('efm-motion-reduced', reduced.matches);
    if (reduced.matches || !finePointer.matches) {
      stopFrame();
      for (const scene of scenes.keys()) resetScene(scene);
    }
    if (reduced.matches) {
      depthScenes.forEach((scene) => scene.style.removeProperty('--scroll-progress'));
      document.querySelectorAll('.story-card').forEach((card) => card.classList.add('is-active'));
    }
    if (reduced.matches) {
      observer?.disconnect();
      elements.forEach((element) => {
        seen.add(element);
        element.classList.remove('motion-enter');
      });
      document.querySelector('.hero')?.classList.remove('motion-hero-enter');
    }
    refresh();
  }

  function syncVisibility() {
    root.classList.toggle('efm-motion-paused', document.hidden);
    if (document.hidden) {
      stopFrame();
      for (const scene of scenes.keys()) resetScene(scene);
    }
  }

  // These event listeners also handle preference changes while the page is open.
  reduced.addEventListener('change', syncPreference);
  finePointer.addEventListener('change', syncPreference);
  document.addEventListener('visibilitychange', syncVisibility);
  document.addEventListener('focusin', onFocus);
  addEventListener('scroll', scheduleDepth, { passive: true });
  addEventListener('resize', scheduleDepth, { passive: true });
  function onFocus(event) {
    // Keyboard focus should never wait for a decorative entrance to finish.
    const element = event.target.closest?.('.motion-enter');
    if (element) element.classList.remove('motion-enter');
  }
  syncPreference();
  syncVisibility();
  const hero = document.querySelector('.hero');
  if (hero && !reduced.matches) hero.classList.add('motion-hero-enter');

  return {
    refresh,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stopFrame();
      observer?.disconnect();
      sceneObserver?.disconnect();
      storyObserver?.disconnect();
      reduced.removeEventListener('change', syncPreference);
      finePointer.removeEventListener('change', syncPreference);
      document.removeEventListener('visibilitychange', syncVisibility);
      document.removeEventListener('focusin', onFocus);
      removeEventListener('scroll', scheduleDepth);
      removeEventListener('resize', scheduleDepth);
      if (depthFrame) cancelAnimationFrame(depthFrame);
      for (const [scene, handlers] of scenes) {
        scene.removeEventListener('pointermove', handlers.move);
        scene.removeEventListener('pointerleave', handlers.leave);
        scene.classList.remove('motion-scene', 'motion-scene-visible');
        resetScene(scene);
      }
      elements.forEach((element) => {
        element.classList.remove('motion-enter');
        element.style.removeProperty('--motion-delay');
      });
      hero?.classList.remove('motion-hero-enter');
      decorations.forEach((decoration) => decoration.remove());
      root.classList.remove('efm-motion', 'efm-motion-reduced', 'efm-motion-paused');
      scenes.clear();
      elements.clear();
      decorations.clear();
      depthScenes.forEach((scene) => scene.style.removeProperty('--scroll-progress'));
      depthScenes.clear();
    },
  };
}
