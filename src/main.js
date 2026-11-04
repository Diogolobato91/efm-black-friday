import campaign from '../config/campaign.json';
import { getSelection, formatBRL, whatsappLink } from './campaign.js';
import { trackEvent } from './analytics.js';
import './style.css';

const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>';
const chat = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 9c1 4 3 6 7 6l1-2-3-1-1 1-2-2 1-1-1-3-2 2Z"/></svg>';
const globe = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg>';
const flag = (type) => `<span class="flag flag-${type}" aria-hidden="true"></span>`;
const cta = (label, section, extra = '') => `<a class="button button-orange" data-whatsapp data-section="${section}" ${extra} href="${whatsappLink(campaign, 'english', 'basic')}" target="_blank" rel="noopener noreferrer">${chat}<span>${label}</span>${arrow}</a>`;
const faq = [
  ['O valor de R$ 199,90 é a mensalidade?', 'Não. É a taxa inicial, que inclui material didático e portal do aluno. A mensalidade depende do plano escolhido: R$ 350, R$ 450 ou R$ 550. A primeira mensalidade fica para dezembro.'],
  ['Como funciona o bônus do outro idioma?', 'Você ganha um mês do outro idioma, com uma aula por semana. Depois, decide se continua nos dois idiomas ou apenas no inicialmente escolhido. Consulte a equipe sobre as condições de continuidade.'],
  ['Inglês e espanhol participam do sorteio?', 'Sim. Matrículas em qualquer uma das duas modalidades participam da promoção. Os planos de 4, 8 e 12 aulas por mês têm, respectivamente, 3, 5 e 7 chances.'],
  ['A matrícula garante a viagem para Malta?', 'Não. A viagem é uma premiação por sorteio. O prêmio inclui curso de duas semanas, hospedagem, seguro viagem, transfer do aeroporto para a acomodação e € 200 de ajuda de custo. Passagem aérea não incluída.'],
  ['Quais condições conhecidas se aplicam ao prêmio?', 'O prêmio não é transferível. Para aproveitar a premiação, é necessário manter matrícula ativa e mensalidades em dia até o mês da viagem. O regulamento será tratado na etapa final.'],
  ['Já sou aluno EFM. Posso participar?', 'Sim. Indique um novo aluno e também concorra ao intercâmbio. Fale com a equipe para saber como participar.'],
  ['Como concluo minha matrícula?', 'Escolha seu idioma e plano e fale com a EFM no WhatsApp. A equipe orienta os próximos passos e conclui a matrícula no atendimento. Abrir o link não conclui a matrícula nem confirma participação no sorteio.'],
];

document.querySelector('#app').innerHTML = `
<header class="site-header wrap">
  <a class="brand" href="#inicio" aria-label="EFM Languages — início"><img src="/brand/efm-white.svg" alt="EFM Languages" width="143" height="60"></a>
  <nav aria-label="Navegação principal"><a href="#planos">Planos</a><a href="#malta">Destino Malta</a><a href="#duvidas">Dúvidas</a></nav>
  <a class="header-contact" data-whatsapp data-section="header" href="${whatsappLink(campaign, 'english', 'basic')}" target="_blank" rel="noopener noreferrer">Fale com a EFM ${arrow}</a>
</header>
<main id="conteudo">
<section class="hero wrap" id="inicio" aria-labelledby="hero-heading">
  <div class="hero-copy">
    <p class="eyebrow"><span class="signal"></span> A BLACK FRIDAY DO SEU PRÓXIMO PASSO</p>
    <div class="black-friday" aria-label="Black Friday">BLACK<span>FRIDAY<svg class="asterisk" aria-hidden="true" viewBox="0 0 80 80" fill="currentColor"><path d="M34 0h12v25L64 7l9 9-18 18h25v12H55l18 18-9 9-18-18v25H34V55L16 73l-9-9 18-18H0V34h25L7 16l9-9 18 18Z"/></svg></span></div>
    <h1 id="hero-heading">Seu próximo idioma.<br><span>Um mundo de possibilidades.</span></h1>
    <p class="hero-description">Comece seu <strong>inglês ou espanhol</strong>, ganhe um mês do outro idioma e concorra a duas semanas de intercâmbio em Malta.</p>
    <div class="hero-actions">${cta('Quero meu plano EFM', 'hero')}<a class="text-link" href="#planos">Comparar planos ${arrow}</a></div>
    <p class="commercial">A partir de <strong>R$ 350/mês</strong> + taxa inicial de <strong>R$ 199,90</strong>, com material e portal. Primeira mensalidade em dezembro.</p>
    <p class="action-note">Atendimento pelo WhatsApp para concluir sua matrícula.</p>
  </div>
  <figure class="hero-art">
    <div class="art-top"><span>PRÓXIMA PARADA?</span><span>35°53′ N · 14°30′ E</span></div>
    <div class="art-title">MALTA<span>Uma nova perspectiva.</span></div>
    <img class="malta-illustration" src="/images/malta-illustration.svg" alt="Ilustração de Valletta, em Malta, com construções históricas à beira do mar" width="1000" height="1200" fetchpriority="high">
    <div class="floating-flag flag-one">${flag('uk')}</div><div class="floating-flag flag-two">${flag('es')}</div>
    <div class="travel-stamp"><span>CONCORRA A</span><strong>2 semanas</strong><span>DE INTERCÂMBIO</span></div>
    <figcaption>Imagem ilustrativa de Malta. Passagem aérea não incluída.</figcaption>
  </figure>
</section>
<div class="benefit-strip"><div class="wrap strip-inner"><span>${globe} Aprenda online</span><span>${check} Um mês do outro idioma</span><span>${arrow} Concorra a um intercâmbio</span></div></div>
<section class="section wrap" id="beneficios">
  <div class="section-heading"><p class="eyebrow">MAIS DO QUE COMEÇAR</p><h2>Um idioma abre portas.<br><span>Você escolhe quais.</span></h2></div>
  <div class="benefit-grid">
    <article><span class="number">01 /</span><h3>Seu aprendizado,<br>onde você estiver.</h3><p>Aulas online de inglês ou espanhol. Escolha a quantidade de aulas por mês que faz sentido para o seu momento.</p></article>
    <article><span class="number">02 /</span><h3>Um segundo idioma<br>para experimentar.</h3><p>Um mês do outro idioma, com uma aula por semana. Uma oportunidade de descobrir novas possibilidades.</p></article>
    <article><span class="number">03 /</span><h3>Seu próximo destino<br>pode ser Malta.</h3><p>Matrículas em inglês e espanhol participam do sorteio. As chances variam de acordo com o plano escolhido.</p></article>
  </div>
</section>
<section class="plans-section section" id="planos" aria-labelledby="plans-heading"><div class="wrap">
  <div class="plans-heading"><div><p class="eyebrow">COMECE DO SEU JEITO</p><h2 id="plans-heading">Escolha o idioma.<br><span>Encontre seu plano.</span></h2></div><div class="language-toggle" role="group" aria-label="Idioma do curso"><button type="button" data-language="english" aria-pressed="true">${flag('uk')} Inglês</button><button type="button" data-language="spanish" aria-pressed="false">${flag('es')} Espanhol</button></div></div>
  <p class="plans-intro">Três opções. Aulas online. Matrícula sem fidelidade.</p>
  <div class="plan-grid" id="plan-grid"></div>
  <p class="selection-status" id="selection-status" role="status" aria-live="polite"></p>
  <div class="plan-conditions"><div><span class="small-label">PARA COMEÇAR</span><p>Taxa inicial de <strong>R$ 199,90</strong></p><span>Inclui material didático e portal do aluno.</span></div><div><span class="small-label">PARA SE ORGANIZAR</span><p>Primeira mensalidade <strong>em dezembro.</strong></p><span>Os valores dos planos são mensais.</span></div><div><span class="small-label">EM TODOS OS PLANOS</span><p><strong>1 mês</strong> do outro idioma.</p><span>Uma aula por semana durante o bônus.</span></div></div>
</div></section>
<section class="section wrap malta-section" id="malta" aria-labelledby="malta-heading">
  <div class="malta-poster"><span class="poster-kicker">EFM LANGUAGES / NOVAS POSSIBILIDADES</span><span class="poster-title">HELLO,<br>MALTA.</span><img src="/images/malta-illustration.svg" alt="" width="1000" height="1200" loading="lazy"><span class="poster-foot">MEDITERRÂNEO, NOVOS ENCONTROS E APRENDIZADO.</span></div>
  <div class="malta-copy"><p class="eyebrow">UMA OPORTUNIDADE PARA IR ALÉM</p><h2 id="malta-heading">Aprender aqui.<br><span>Se imaginar lá.</span></h2><p>Ao se matricular em inglês ou espanhol na Black Friday EFM, você concorre a <strong>duas semanas de intercâmbio em Malta.</strong></p><ul class="included-list">${campaign.giveaway.included.map(item => `<li>${check}<span>${item}</span></li>`).join('')}<li>${check}<span><strong>€ 200</strong> de ajuda de custo</span></li></ul><div class="travel-notice"><strong>Passagem aérea não incluída.</strong><p>A viagem é uma premiação por sorteio, não um benefício garantido da matrícula.</p></div><p class="fine-print">Prêmio não transferível. É necessário manter matrícula ativa e mensalidades em dia até o mês da viagem para aproveitar a premiação.</p>${cta('Quero meu plano EFM', 'malta')}</div>
</section>
<section class="bonus-section section"><div class="wrap bonus-layout"><div><p class="eyebrow">SEU BÔNUS DE BLACK FRIDAY</p><h2>Comece com um.<br><span>Experimente dois.</span></h2><p>Escolheu inglês? Experimente espanhol.<br>Escolheu espanhol? Descubra o inglês.</p></div><div class="bonus-details"><span class="bonus-number">1<span>MÊS DO OUTRO IDIOMA</span></span><p>Uma aula por semana durante o bônus. Depois, você decide se continua nos dois idiomas ou apenas no escolhido inicialmente.</p><p class="fine-print">Consulte a equipe sobre as condições de continuidade após o bônus.</p>${cta('Quero aproveitar o bônus', 'bonus')}</div></div></section>
<section class="section wrap how-section"><div class="section-heading"><p class="eyebrow">SEU PRÓXIMO PASSO É SIMPLES</p><h2>Do plano à primeira conversa.</h2></div><ol class="steps"><li><span>01</span><h3>Encontre seu plano</h3><p>Escolha inglês ou espanhol e compare as aulas mensais.</p></li><li><span>02</span><h3>Fale com a EFM</h3><p>Abra o WhatsApp. Sua seleção já acompanha a mensagem.</p></li><li><span>03</span><h3>Conclua sua matrícula</h3><p>A equipe orienta os próximos passos no atendimento.</p></li></ol></section>
<section class="referral-section wrap"><div><p class="eyebrow">JÁ FAZ PARTE DA EFM?</p><h2>Indique. E também concorra.</h2><p>Já é aluno EFM? Indique um novo aluno e também concorra ao intercâmbio em Malta.</p></div>${cta('Saber sobre indicação', 'referral', 'data-referral="true"')}</section>
<section class="section wrap faq-section" id="duvidas"><div><p class="eyebrow">TUDO MAIS CLARO</p><h2>Antes de dar<br><span>o próximo passo.</span></h2><p>Ficou com outra dúvida?<br>A EFM conversa com você.</p><a class="text-link" data-whatsapp data-section="faq" href="${whatsappLink(campaign, 'english', 'basic')}" target="_blank" rel="noopener noreferrer">Falar no WhatsApp ${arrow}</a></div><div class="faq-list">${faq.map(([question,answer]) => `<details><summary>${question}<span aria-hidden="true">+</span></summary><p>${answer}</p></details>`).join('')}</div></section>
<section class="final-section section"><div class="wrap"><p class="eyebrow">BLACK FRIDAY EFM LANGUAGES</p><h2>Seu mundo pode<br>ficar <span>maior.</span></h2><p>Um novo idioma. Um bônus para explorar.<br>E a oportunidade de concorrer a Malta.</p>${cta('Quero meu plano EFM', 'final')}<p class="final-selection" data-current-selection></p><p class="commercial">A partir de R$ 350/mês + taxa inicial de R$ 199,90.<br>Primeira mensalidade em dezembro.</p></div></section>
</main>
<footer class="wrap site-footer"><a href="#inicio" aria-label="EFM Languages — voltar ao início"><img src="/brand/efm-white.svg" alt="EFM Languages" width="128" height="54"></a><p>English For Me.<br>Novos idiomas. Novas possibilidades.</p><div><span>ATENDIMENTO DA CAMPANHA</span><a data-whatsapp data-section="footer" href="${whatsappLink(campaign, 'english', 'basic')}" target="_blank" rel="noopener noreferrer">(91) 98510-6086 ${arrow}</a></div><p class="footer-note">Regulamento em etapa final de preparação. A matrícula e a participação são concluídas conforme orientação no atendimento.</p></footer>
<div class="mobile-sticky"><span data-current-selection></span>${cta('Falar com a EFM', 'sticky')}</div>`;

let language = 'english';
let planId = 'basic';

function renderPlans() {
  const { modality } = getSelection(campaign, language, planId);
  document.querySelector('#plan-grid').innerHTML = modality.plans.map((plan, index) => `<article class="plan-card ${index === 1 ? 'plan-card-featured' : ''} ${plan.id === planId ? 'is-selected' : ''}" data-plan-card="${plan.id}"><div class="plan-card-top"><span class="small-label">${modality.label.toUpperCase()}</span><span class="plan-indicator">${plan.id === planId ? 'Selecionado' : `PLANO 0${index + 1}`}</span></div><h3>${plan.name}</h3><div class="class-count"><strong>${plan.classesPerMonth}</strong><span>aulas<br>por mês</span></div><p class="plan-price"><span>R$</span> ${plan.monthlyPriceBRL}<small>/mês</small></p><ul><li>${check}<span>${plan.drawChances} chances no sorteio de Malta</span></li><li>${check}<span>1 mês do outro idioma</span></li><li>${check}<span>Aulas online</span></li></ul><button class="select-plan" type="button" data-select-plan="${plan.id}" aria-pressed="${plan.id === planId}">${plan.id === planId ? 'Plano selecionado' : 'Selecionar plano'} ${check}</button><a class="button ${index === 1 ? 'button-orange' : 'button-outline'}" data-whatsapp data-section="plans" data-plan="${plan.id}" href="${whatsappLink(campaign, language, plan.id)}" target="_blank" rel="noopener noreferrer"><span>Quero o ${plan.name}</span>${arrow}</a></article>`).join('');
}
function updateLinks() {
  const { modality, plan } = getSelection(campaign, language, planId);
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = whatsappLink(campaign, language, link.dataset.plan || planId, link.dataset.referral === 'true');
  });
  document.querySelectorAll('[data-current-selection]').forEach((node) => { node.textContent = `${modality.label} · ${plan.name} · ${formatBRL(plan.monthlyPriceBRL)}/mês`; });
  document.querySelector('#selection-status').textContent = `Sua seleção: ${modality.label}, plano ${plan.name}, ${plan.classesPerMonth} aulas por mês.`;
}
function event(name, section) { trackEvent(name, { section, language, plan: planId }); }

document.addEventListener('click', (e) => {
  const languageButton = e.target.closest('[data-language]');
  if (languageButton && languageButton.dataset.language !== language) {
    language = languageButton.dataset.language;
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    renderPlans(); updateLinks(); event('language_select', 'plans');
  }
  const planButton = e.target.closest('[data-select-plan]');
  if (planButton) {
    planId = planButton.dataset.selectPlan;
    renderPlans(); updateLinks();
    document.querySelector(`[data-select-plan="${planId}"]`).focus({ preventScroll: true });
    event('plan_select', 'plans');
  }
  const link = e.target.closest('[data-whatsapp]');
  if (link) {
    if (link.dataset.plan) {
      planId = link.dataset.plan;
      // Do not replace the active link before its native navigation runs.
      updateLinks();
      document.querySelectorAll('[data-plan-card]').forEach(card => {
        const selected = card.dataset.planCard === planId;
        card.classList.toggle('is-selected', selected);
        card.querySelector('.plan-indicator').textContent = selected ? 'Selecionado' : 'PLANO';
        const button = card.querySelector('[data-select-plan]');
        button.setAttribute('aria-pressed', String(selected));
        button.innerHTML = `${selected ? 'Plano selecionado' : 'Selecionar plano'} ${check}`;
      });
    }
    event('whatsapp_click', link.dataset.section);
  }
});
renderPlans(); updateLinks();
