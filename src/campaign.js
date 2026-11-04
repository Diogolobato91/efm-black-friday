export function getSelection(campaign, language = 'english', planId = 'basic') {
  const modality = campaign.modalities.find((item) => item.id === language);
  if (!modality) throw new RangeError('Idioma inválido');
  const plan = modality.plans.find((item) => item.id === planId);
  if (!plan) throw new RangeError('Plano inválido');
  return { modality, plan };
}

export function formatBRL(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function whatsappLink(campaign, language, planId, referral = false) {
  const { modality, plan } = getSelection(campaign, language, planId);
  const message = referral
    ? `Olá! Já sou aluno EFM e quero saber como indicar um novo aluno e concorrer ao intercâmbio em Malta. Meu interesse nesta página: ${modality.label}, plano ${plan.name}.`
    : `Olá! Tenho interesse na Black Friday EFM. Escolhi ${modality.label}, plano ${plan.name}, com ${plan.classesPerMonth} aulas por mês por ${formatBRL(plan.monthlyPriceBRL)}/mês. Quero saber como concluir minha matrícula.`;
  return `${campaign.whatsapp.url}?text=${encodeURIComponent(message)}`;
}
