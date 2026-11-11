import campaign from '../config/campaign.json';
import media from '../config/media.json';
import { getSelection, formatBRL, whatsappLink } from './campaign.js';
import { trackEvent } from './analytics.js';
import { portraitMarkup, mediaUrl } from './media.js';
import { initMotion } from './motion.js';
import { initKineticGrid } from './kinetic-grid.js';
import { initMaltaGallery } from './gallery.js';
import './style.css';
import './experience.css';
import './motion.css';
import './vinicius-reference.css';

const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
const chat = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 9c1 4 3 6 7 6l1-2-3-1-1 1-2-2 1-1-1-3-2 2Z"/></svg>';
const globe = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>';
const suitcase = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M8 20v1M16 20v1M3 12h18"/></svg>';
const flag = (type) => `<span class="flag flag-${type}" aria-hidden="true"></span>`;
const cta = (label, section, extra = '') => `<a class="button button-orange" data-whatsapp data-section="${section}" ${extra} href="${whatsappLink(campaign, 'english', 'basic')}" target="_blank" rel="noopener noreferrer">${chat}<span>${label}</span>${arrow}</a>`;
const marquee = (items, variant = '') => {
  const content = items.map((item) => `<span>${item}</span><b>✳</b>`).join('');
  return `<section class="campaign-marquee ${variant}" aria-label="Destaques da campanha"><div class="marquee-track"><div class="marquee-group">${content}</div><div class="marquee-group" aria-hidden="true">${content}</div></div></section>`;
};
const faq = [
  ['O valor de R$ 199,90 é a mensalidade?', 'Não. É a taxa inicial, que inclui material didático e portal do aluno. A mensalidade depende do plano escolhido: R$ 350, R$ 450 ou R$ 550. A primeira mensalidade fica para dezembro.'],
  ['Como funciona o bônus do outro idioma?', 'Você ganha um mês do outro idioma, com uma aula por semana. Depois, decide se continua nos dois idiomas ou apenas no inicialmente escolhido. Consulte a equipe sobre as condições de continuidade.'],
  ['Inglês e espanhol participam do sorteio?', 'Sim. Matrículas em qualquer uma das duas modalidades participam da promoção. Os planos de 4, 8 e 12 aulas por mês têm, respectivamente, 3, 5 e 7 chances.'],
  ['A matrícula garante a viagem para Malta?', 'Não. A viagem é uma premiação por sorteio. O prêmio inclui curso de duas semanas, hospedagem, seguro viagem, transfer do aeroporto para a acomodação e € 200 de ajuda de custo. Passagem aérea não incluída.'],
  ['Quando será o sorteio?', 'A data, o horário e os detalhes da transmissão serão confirmados no regulamento oficial da campanha.'],
  ['Quais condições conhecidas se aplicam ao prêmio?', 'O prêmio não é transferível. Para aproveitar a premiação, é necessário manter matrícula ativa e mensalidades em dia até o mês da viagem. O regulamento será tratado na etapa final.'],
  ['Já sou aluno EFM. Posso participar?', 'Sim. Indique um novo aluno e também concorra ao intercâmbio. Fale com a equipe para saber como participar.'],
  ['Como concluo minha matrícula?', 'Escolha seu idioma e plano e fale com a EFM no WhatsApp. A equipe orienta os próximos passos e conclui a matrícula no atendimento. Abrir o link não conclui a matrícula nem confirma participação no sorteio.'],
];

document.querySelector('#app').innerHTML = `
<header class="site-header wrap">
  <a class="brand" href="#inicio" aria-label="EFM Languages — início"><img src="/brand/efm-transparent.png" alt="EFM Languages" width="125" height="58"></a>
  <nav aria-label="Navegação principal"><a href="#planos">Planos</a><a href="#malta">Destino Malta</a><a href="#duvidas">Dúvidas</a></nav>
  <a class="header-contact" data-whatsapp data-section="header" href="${whatsappLink(campaign, 'english', 'basic')}" target="_blank" rel="noopener noreferrer">Fale com a EFM ${arrow}</a>
</header>
<div class="country-orbits" aria-hidden="true">
  <span class="country-orb orbit-one">${flag('mt')}</span>
  <span class="country-orb orbit-two">${flag('uk')}</span>
  <span class="country-orb orbit-three">${flag('es')}</span>
  <span class="country-orb orbit-four">${flag('it')}</span>
  <span class="country-orb orbit-five">${flag('fr')}</span>
  <span class="country-orb orbit-six">${flag('pt')}</span>
  <span class="country-orb orbit-seven">${flag('ie')}</span>
  <span class="country-orb orbit-eight">${flag('de')}</span>
  <span class="country-orb orbit-nine">${flag('gr')}</span>
  <span class="country-orb orbit-ten">${flag('mt')}</span>
  <span class="country-orb orb-small orbit-eleven">${flag('uk')}</span>
  <span class="country-orb orb-small orbit-twelve">${flag('es')}</span>
  <span class="country-orb orbit-thirteen">${flag('pt')}</span>
  <span class="country-orb orb-small orbit-fourteen">${flag('it')}</span>
  <span class="country-orb orbit-fifteen">${flag('ie')}</span>
  <span class="country-orb orb-small orbit-sixteen">${flag('fr')}</span>
  <span class="country-orb orbit-seventeen">${flag('de')}</span>
  <span class="country-orb orb-small orbit-eighteen">${flag('gr')}</span>
</div>
<main id="conteudo">
<section class="hero wrap" id="inicio" aria-labelledby="hero-heading">
  <canvas class="hero-kinetic-grid" data-kinetic-grid aria-hidden="true"></canvas>
  <div class="hero-copy">
    <p class="eyebrow"><span class="signal"></span> BLACK FRIDAY EFM · SEU PRÓXIMO IDIOMA COMEÇA AQUI</p>
    <div class="black-friday" aria-label="Black Friday EFM"><span>BLACK FRIDAY</span><small>EFM LANGUAGES</small></div>
    <h1 id="hero-heading">Concorra a um intercâmbio de <strong>2 semanas em Malta.</strong></h1>
    <p class="hero-description">Matricule-se em <strong>inglês ou espanhol</strong>, ganhe um mês do outro idioma e transforme o começo de uma nova língua na chance de viver Malta de verdade.</p>
    <div class="hero-actions"><a class="button button-orange" href="#seu-plano"><span>Quero concorrer a Malta</span>${arrow}</a>${cta('Falar com a EFM', 'hero', 'data-hero-direct')}</div>
    <div class="hero-proof" aria-label="Condições principais"><span>Aulas online</span><span>Planos a partir de R$ 350/mês</span><span>Passagem aérea não incluída</span></div>
    <p class="action-note">Atendimento pelo WhatsApp para concluir sua matrícula.</p>
  </div>
  <figure class="hero-art ${mediaUrl(media.heroPortrait.src) ? 'has-portrait' : ''}">
    <div class="art-top"><span>PRÓXIMA PARADA?</span><span>35°53′ N · 14°30′ E</span></div>
    <div class="art-title">MALTA<span>Não é cenário. É o destino.</span></div>
    ${mediaUrl(media.heroPortrait.src)
      ? portraitMarkup(media.heroPortrait)
      : '<img class="malta-illustration" src="/images/malta-illustration.svg" alt="Ilustração de Valletta, em Malta, com construções históricas à beira do mar" width="1000" height="1200" fetchpriority="high">'}
    <div class="floating-flag flag-one">${flag('uk')}</div><div class="floating-flag flag-two">${flag('es')}</div>
    <div class="travel-stamp"><span>CONCORRA A</span><strong>2 semanas</strong><span>DE INTERCÂMBIO</span></div>
    <figcaption>Malta · seu próximo destino pode começar aqui. Passagem aérea não incluída.</figcaption>
  </figure>
  <a class="scroll-cue" href="#beneficios"><span>ROLE PARA DESCOBRIR</span><i aria-hidden="true"></i></a>
</section>
<section class="campaign-video-section campaign-video-intro-section wrap" aria-labelledby="campaign-video-heading">
  <div class="campaign-video-intro">
    <p class="campaign-video-phrase">Viva uma <span>imersão, experiências fantásticas.</span><strong> Destrave seu inglês e realize um dos seus maiores sonhos.</strong></p>
    <h2 id="campaign-video-heading">Ouça de quem viveu tudo isso na pele.</h2>
  </div>
  <div class="campaign-video-player"><video controls playsinline preload="metadata" aria-label="Vídeo da campanha Black Friday EFM"><source src="/videos/campaign-horizontal.mp4" type="video/mp4">Seu navegador não reproduz este vídeo. <a href="/videos/campaign-horizontal.mp4">Abrir vídeo</a>.</video></div>
</section>
${marquee(['VEM PARA A EFM', 'BLACK FRIDAY EFM', 'CONCORRA A UM INTERCÂMBIO EM MALTA', 'INGLÊS E ESPANHOL'])}
<div class="benefit-strip"><div class="wrap strip-inner"><span>${suitcase} Concorra a <strong>2 semanas de INTERCÂMBIO em Malta</strong></span><span>${globe} Aprenda online</span><span>${check} Ganhe 1 mês do outro idioma</span></div></div>
<section class="section wrap reference-story" id="beneficios">
  <div class="reference-story-grid">
    <figure class="reference-human"><img src="/images/vinicius-malta-coast.webp" alt="Vinícius, da EFM Languages, observando a costa de Malta" width="1080" height="1283" loading="lazy"><figcaption><strong>Vinícius, da EFM, em Malta.</strong><span>Uma experiência real que inspira o destino desta campanha.</span></figcaption></figure>
    <article class="reference-prize"><p class="eyebrow">O QUE O PRÊMIO INCLUI</p><h3>Duas semanas para viver o idioma fora da tela.</h3><ul>${campaign.giveaway.included.map(item => `<li>${check}<span>${item}</span></li>`).join('')}<li>${check}<span><strong>€ 200</strong> de ajuda de custo</span></li></ul><div class="reference-warning"><strong>Passagem aérea não incluída.</strong><span>A viagem é uma premiação por sorteio, não um benefício garantido da matrícula.</span></div>${cta('Quero concorrer', 'prize-overview')}</article>
  </div>
</section>
${marquee(['VEM PARA A EFM', 'BLACK FRIDAY EFM', 'CONCORRA A UM INTERCÂMBIO EM MALTA'], 'pdf-dream-marquee')}
<section class="pdf-dream-cta section wrap" aria-labelledby="dream-heading">
  <p class="eyebrow">O SEU IDIOMA PODE TE LEVAR MAIS LONGE</p>
  <h2 id="dream-heading"><span>Realize o sonho de um intercâmbio</span><strong>Estudando o idioma que você escolheu.</strong></h2>
  <a href="#seu-plano" class="button button-orange"><span>Quero concorrer</span>${arrow}</a>
</section>
<section class="section wrap efm-benefits" aria-labelledby="benefits-heading">
  <div class="efm-benefits-heading"><div><p class="eyebrow">POR QUE APRENDER COM A EFM</p><h2 id="benefits-heading">Um curso pensado<br><span>para caber na sua rotina.</span></h2></div><p>Você escolhe o idioma e o ritmo. A EFM cuida da experiência de aprendizagem, do material e do acompanhamento.</p></div>
  <div class="efm-benefit-grid">
    <article class="efm-benefit-card benefit-live"><div class="benefit-visual"><img src="/images/benefit-online-class.webp" alt="Aluno participando de uma aula individual de idioma pela internet" width="1024" height="1024" loading="lazy"></div><span class="benefit-index">01</span><h3>Aulas online e individuais</h3><p>Aulas que respeitam o seu ritmo e colocam você no centro da experiência.</p></article>
    <article class="efm-benefit-card benefit-time"><div class="benefit-visual"><img src="/images/benefit-flexible-time.webp" alt="Aluno organizando o melhor horário para estudar" width="1024" height="1024" loading="lazy"></div><span class="benefit-index">02</span><h3>Horários flexíveis</h3><p>Organize suas aulas de acordo com a sua disponibilidade.</p></article>
    <article class="efm-benefit-card benefit-material"><div class="benefit-visual"><img src="/images/benefit-student-portal.webp" alt="Material didático e portal digital usados durante os estudos" width="1024" height="1024" loading="lazy"></div><span class="benefit-index">03</span><h3>Material e portal do aluno</h3><p>Conteúdo didático e recursos reunidos para apoiar seus estudos.</p></article>
  </div>
</section>
${marquee(['AULAS ONLINE E INDIVIDUAIS', 'HORÁRIOS FLEXÍVEIS', 'MATERIAL E PORTAL DO ALUNO'], 'marquee-navy marquee-reverse')}
<section class="plans-section section" id="planos" aria-labelledby="plans-heading"><div class="wrap">
  <div class="plans-heading"><div><p class="eyebrow">SUA DECISÃO, DO SEU JEITO</p><h2 id="plans-heading">Monte seu plano<br><span>em poucos segundos.</span></h2></div><div class="language-toggle" role="group" aria-label="Idioma do curso"><button type="button" data-language="english" aria-pressed="true">${flag('uk')} Inglês</button><button type="button" data-language="spanish" aria-pressed="false">${flag('es')} Espanhol</button></div></div>
  <p class="plans-intro">Escolha o idioma e a quantidade de aulas. Você vê o investimento na hora e leva sua decisão pronta para o atendimento da EFM.</p>
  <div class="plan-finder" id="seu-plano" aria-labelledby="finder-heading">
    <div class="finder-heading"><div><p class="eyebrow">SEU IDIOMA. SEU RITMO.</p><h3 id="finder-heading">Quantas aulas cabem no seu mês?</h3><p>Escolha uma opção e veja o resumo do seu plano.</p></div></div>
    <div class="rhythm-options" role="group" aria-label="Quantidade de aulas por mês">
      <button type="button" class="rhythm-choice" data-rhythm="basic" aria-pressed="true"><strong>4<span>aulas / mês</span></strong><span>Um começo possível</span>${check}</button>
      <button type="button" class="rhythm-choice" data-rhythm="pro" aria-pressed="false"><strong>8<span>aulas / mês</span></strong><span>Mais espaço para praticar</span>${check}</button>
      <button type="button" class="rhythm-choice" data-rhythm="premium" aria-pressed="false"><strong>12<span>aulas / mês</span></strong><span>Mais aulas na sua rotina</span>${check}</button>
    </div>
    <div class="selected-plan" id="selected-plan"><div class="selected-overview"><span class="small-label">SUA ESCOLHA, SEM COMPLICAÇÃO</span><h3 data-choice-title></h3><p data-choice-description></p><div class="selected-perks"><span>${check} 1 mês do outro idioma</span><span data-choice-chances></span></div><p class="selected-draw-note">Concorra a Malta. Passagem aérea não incluída.</p></div><div class="selected-action"><p class="selected-price" data-choice-price></p><p>+ taxa inicial de <strong>R$ 199,90</strong><br>Primeira mensalidade em dezembro.</p>${cta('Continuar com meu plano', 'selected-plan', 'data-selection-cta')}<small>Sua escolha acompanha a mensagem no WhatsApp.</small></div></div>
  </div>
  <div class="plan-conditions"><div><span class="small-label">PARA COMEÇAR</span><p>Taxa inicial de <strong>R$ 199,90</strong></p><span>Inclui material didático e portal do aluno.</span></div><div><span class="small-label">PARA SE ORGANIZAR</span><p>Primeira mensalidade <strong>em dezembro.</strong></p><span>Os valores dos planos são mensais.</span></div><div><span class="small-label">EM TODOS OS PLANOS</span><p><strong>1 mês</strong> do outro idioma.</p><span>Uma aula por semana durante o bônus.</span></div></div>
</div></section>
<section class="malta-gallery" id="malta" aria-labelledby="gallery-heading" data-malta-gallery>
  <div class="malta-gallery-stage">
    <div class="malta-gallery-grid">
      <figure class="gallery-card gallery-card-one" data-gallery-card><img src="/images/malta-valletta.webp" alt="Vista aérea de Valletta e sua costa em Malta" width="1024" height="682" loading="lazy"></figure>
      <figure class="gallery-card gallery-card-two" data-gallery-card><img src="/images/malta-cove-aerial.webp" alt="Enseada de águas turquesa e formações rochosas em Malta" width="2048" height="1529" loading="lazy"></figure>
      <figure class="gallery-card gallery-card-three" data-gallery-card><img src="/images/malta-luzzu-boats.webp" alt="Barcos tradicionais coloridos no porto de Marsaxlokk, Malta" width="1224" height="816" loading="lazy"></figure>
      <figure class="gallery-card gallery-card-four" data-gallery-card><img src="/images/malta-blue-lagoon.webp" alt="Águas cristalinas da costa de Malta" width="2048" height="1365" loading="lazy"></figure>
      <figure class="gallery-card gallery-card-five" data-gallery-card><img src="/images/malta-street.webp" alt="Rua histórica com fachadas e varandas tradicionais de Malta" width="2048" height="1529" loading="lazy"></figure>
    </div>
    <div class="malta-gallery-copy" data-gallery-copy>
      <h2 id="gallery-heading">Malta não é cenário.<br><em>É o destino.</em></h2>
      <p>Uma matrícula pode ser o primeiro passo para duas semanas de intercâmbio.</p>
    </div>
    <p class="gallery-credit">MALTA · CIDADES HISTÓRICAS, COSTA E MEDITERRÂNEO</p>
  </div>
</section>
${marquee(['MALTA NÃO É CENÁRIO', 'É O DESTINO', '2 SEMANAS DE INTERCÂMBIO', 'BLACK FRIDAY EFM'], 'marquee-offset')}
<section class="section wrap faq-section" id="duvidas"><div><p class="eyebrow">TUDO MAIS CLARO</p><h2>Antes de dar<br><span>o próximo passo.</span></h2><p>Ficou com outra dúvida?<br>A EFM conversa com você.</p><a class="text-link" data-whatsapp data-section="faq" href="${whatsappLink(campaign, 'english', 'basic')}" target="_blank" rel="noopener noreferrer">Falar no WhatsApp ${arrow}</a></div><div class="faq-list">${faq.map(([question,answer], index) => `<details class="faq-item" ${index === 0 ? 'open' : ''}><summary><span class="faq-question">${question}</span><span class="faq-icon" aria-hidden="true">+</span></summary><div class="faq-answer"><div class="faq-answer-inner"><p>${answer}</p></div></div></details>`).join('')}</div></section>
</main>
<footer class="wrap site-footer"><a href="#inicio" aria-label="EFM Languages — voltar ao início"><img src="/brand/efm-transparent.png" alt="EFM Languages" width="110" height="66"></a><p>English For Me.<br>Novos idiomas. Novas possibilidades.</p><div><span>ATENDIMENTO DA CAMPANHA</span><a data-whatsapp data-section="footer" href="${whatsappLink(campaign, 'english', 'basic')}" target="_blank" rel="noopener noreferrer">(91) 98510-6086 ${arrow}</a></div><p class="footer-note">Regulamento em etapa final de preparação. A matrícula e a participação são concluídas conforme orientação no atendimento.</p></footer>
<div class="mobile-sticky"><span data-current-selection></span>${cta('Falar com a EFM', 'sticky')}</div>
`;

let language = 'english';
let planId = 'basic';
let motion;
let kineticGrid;
let maltaGallery;
let selectionAnimation;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function updateLinks() {
  const { modality, plan } = getSelection(campaign, language, planId);
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = whatsappLink(campaign, language, link.dataset.plan || planId, link.dataset.referral === 'true');
  });
  document.querySelectorAll('[data-current-selection]').forEach((node) => { node.textContent = `${modality.label} · ${plan.name} · ${formatBRL(plan.monthlyPriceBRL)}/mês`; });
  document.querySelectorAll('[data-rhythm]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.rhythm === planId)));
  document.querySelector('[data-choice-title]').textContent = `${modality.label} · ${plan.name}`;
  document.querySelector('[data-choice-description]').textContent = `${plan.classesPerMonth} aulas online por mês, no seu ritmo.`;
  document.querySelector('[data-choice-chances]').textContent = `${plan.drawChances} chances no sorteio`;
  document.querySelector('[data-choice-price]').innerHTML = `${formatBRL(plan.monthlyPriceBRL)}<small>/mês</small>`;
  document.querySelector('[data-selection-cta] span').textContent = `Continuar com o ${plan.name}`;
}
function event(name, section) { trackEvent(name, { section, language, plan: planId }); }

function choosePlan(nextPlan, section, eventName) {
  if (nextPlan === planId) return;
  getSelection(campaign, language, nextPlan);
  planId = nextPlan;
  updateLinks();
  motion?.refresh();
  const feedback = document.querySelector('.selected-plan');
  selectionAnimation?.cancel();
  if (!reducedMotion.matches && feedback.animate) {
    selectionAnimation = feedback.animate([{ transform: 'translateY(5px)' }, { transform: 'translateY(0)' }], { duration: 260, easing: 'ease-out' });
  }
  event(eventName, section);
}

document.addEventListener('click', (e) => {
  const languageButton = e.target.closest('[data-language]');
  if (languageButton && languageButton.dataset.language !== language) {
    language = languageButton.dataset.language;
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    updateLinks(); event('language_select', 'plans');
    motion?.refresh();
  }
  const rhythmButton = e.target.closest('[data-rhythm]');
  if (rhythmButton) choosePlan(rhythmButton.dataset.rhythm, 'plan-finder', 'rhythm_select');
  const link = e.target.closest('[data-whatsapp]');
  if (link) {
    event('whatsapp_click', link.dataset.section);
  }
});

const faqItems = [...document.querySelectorAll('.faq-item')];
const faqAnimations = new WeakMap();

function setFaqState(item, open, animate = !reducedMotion.matches) {
  const answer = item.querySelector('.faq-answer');
  const runningAnimation = faqAnimations.get(item);
  runningAnimation?.cancel();

  const startHeight = answer.getBoundingClientRect().height;
  item.open = open;

  if (!animate) return;

  const endHeight = open ? answer.scrollHeight : 0;
  const animation = answer.animate(
    [
      { height: `${startHeight}px`, opacity: open ? 0 : 1 },
      { height: `${endHeight}px`, opacity: open ? 1 : 0 },
    ],
    { duration: 280, easing: 'cubic-bezier(.2,.75,.25,1)' },
  );

  faqAnimations.set(item, animation);
  animation.addEventListener('finish', () => {
    if (faqAnimations.get(item) === animation) faqAnimations.delete(item);
  }, { once: true });
}

faqItems.forEach((item) => {
  item.querySelector('summary').addEventListener('click', (event) => {
    event.preventDefault();
    const shouldOpen = !item.open;
    faqItems.forEach((other) => {
      if (other !== item && other.open) setFaqState(other, false);
    });
    setFaqState(item, shouldOpen);
  });
});

updateLinks();
motion = initMotion();
kineticGrid = initKineticGrid(document.querySelector('.hero'));
maltaGallery = initMaltaGallery(document.querySelector('[data-malta-gallery]'));
function stopSelectionMotion() {
  if (reducedMotion.matches || document.hidden) {
    selectionAnimation?.cancel();
    selectionAnimation = undefined;
  }
}
reducedMotion.addEventListener('change', stopSelectionMotion);
document.addEventListener('visibilitychange', stopSelectionMotion);

// Scroll feedback only: no persistent sales prompt or forced navigation.
const progress = document.createElement('div');
progress.className = 'reading-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.prepend(progress);
let scrollFrame = 0;
function updateScrollFeedback() {
  scrollFrame = 0;
  const scrollRange = document.documentElement.scrollHeight - innerHeight;
  progress.style.setProperty('--reading-progress', String(scrollRange > 0 ? Math.min(1, Math.max(0, scrollY / scrollRange)) : 0));
  document.documentElement.style.setProperty('--page-progress', String(scrollRange > 0 ? Math.min(1, Math.max(0, scrollY / scrollRange)) : 0));
}
function scheduleScrollFeedback() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollFeedback);
}
addEventListener('scroll', scheduleScrollFeedback, { passive: true });
addEventListener('resize', scheduleScrollFeedback, { passive: true });
updateScrollFeedback();
if (import.meta.hot) import.meta.hot.dispose(() => {
  motion.destroy();
  kineticGrid.destroy();
  maltaGallery.destroy();
  selectionAnimation?.cancel();
  reducedMotion.removeEventListener('change', stopSelectionMotion);
  document.removeEventListener('visibilitychange', stopSelectionMotion);
  removeEventListener('scroll', scheduleScrollFeedback);
  removeEventListener('resize', scheduleScrollFeedback);
  cancelAnimationFrame(scrollFrame);
  progress.remove();
});
