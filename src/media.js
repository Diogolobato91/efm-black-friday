export function escapeText(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

export function mediaUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  const candidate = value.trim();
  if (/[\x00-\x20\\]/.test(candidate)) return '';
  if (candidate.startsWith('/') && !candidate.startsWith('//')) return candidate;
  try {
    const url = new URL(candidate);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
  } catch { return ''; }
}

export function portraitMarkup(portrait = {}) {
  const src = mediaUrl(portrait.src);
  if (!src) return '';
  return `<div class="hero-portrait"><img src="${escapeText(src)}" alt="${escapeText(portrait.alt || 'Vinícius, da EFM Languages')}" width="720" height="900" decoding="async"><span>${escapeText(portrait.caption || 'Vinícius · EFM Languages')}</span></div>`;
}

export function videoMarkup(video = {}) {
  const src = mediaUrl(video.src);
  if (!src) return '';
  const poster = mediaUrl(video.poster), captions = mediaUrl(video.captions);
  return `<section class="vinicius-section section wrap" aria-labelledby="vinicius-heading"><div><p class="eyebrow">QUEM ESTÁ COM VOCÊ NESSA JORNADA</p><h2 id="vinicius-heading">${escapeText(video.title || 'Conheça a campanha com o Vinícius')}</h2><p>${escapeText(video.description || '')}</p><a class="text-link" href="#seu-plano">Encontre seu plano <span aria-hidden="true">→</span></a></div><div class="vinicius-video"><video controls playsinline preload="none"${poster ? ` poster="${escapeText(poster)}"` : ''} aria-label="${escapeText(video.title || 'Vinícius apresenta a campanha EFM')}"><source src="${escapeText(src)}">${captions ? `<track kind="captions" src="${escapeText(captions)}" srclang="pt-BR" label="Português" default>` : ''}Seu navegador não reproduz este vídeo. <a href="${escapeText(src)}">Abrir vídeo</a>.</video></div></section>`;
}
