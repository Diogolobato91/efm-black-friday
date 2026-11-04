import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getSelection, formatBRL, whatsappLink } from '../src/campaign.js';
const campaign = JSON.parse(readFileSync(new URL('../config/campaign.json', import.meta.url)));

test('all six plan links preserve exact language, name, monthly frequency and price', () => {
  for (const modality of campaign.modalities) {
    for (const plan of modality.plans) {
      const url = new URL(whatsappLink(campaign, modality.id, plan.id));
      assert.equal(url.origin + url.pathname, 'https://wa.me/5591985106086');
      const message = url.searchParams.get('text');
      for (const text of [modality.label, plan.name, `${plan.classesPerMonth} aulas por mês`, formatBRL(plan.monthlyPriceBRL)]) assert.ok(message.includes(text), text);
      assert.match(message, /como concluir minha matrícula/);
    }
  }
});
test('changing language keeps category, price, frequency and draw chances', () => {
  for (const id of ['basic', 'pro', 'premium']) {
    const a = getSelection(campaign, 'english', id).plan;
    const b = getSelection(campaign, 'spanish', id).plan;
    for (const key of ['id', 'monthlyPriceBRL', 'classesPerMonth', 'drawChances']) assert.equal(a[key], b[key]);
    assert.notEqual(a.name, b.name);
  }
});
test('invalid choices are rejected instead of silently selecting another plan', () => {
  assert.throws(() => getSelection(campaign, 'french', 'basic'), RangeError);
  assert.throws(() => getSelection(campaign, 'english', 'invented'), RangeError);
});
test('referral does not invent chances or claim selected plan is already contracted', () => {
  const message = new URL(whatsappLink(campaign, 'spanish', 'premium', true)).searchParams.get('text');
  assert.match(message, /indicar um novo aluno/);
  assert.match(message, /Meu interesse nesta página: Espanhol, plano ¡Dale!/);
  assert.doesNotMatch(message, /\d+ chances/);
});
